import { fetchTrendingTopics, fetchTrendingCapstoneTopics, generateCurriculum, generateCapstoneProjects, fetchIndustryTrends, fetchTrendData, fetchTopicDetails } from '../api';
import type { GenerateCurriculumResponse, IndustryTrend } from '../types';
import type { GenerateCapstoneProjectsResponse } from '../api/generateCapstoneProjects';
import {
  getOrchestrationLogs,
  getOrchestrationStatus,
  getOrchestrationTasks,
  isOrchestratorDebugCompareEnabled,
  isOrchestratorEnabled,
  startOrchestration,
} from '../api/orchestrator';
import { ORCHESTRATOR_DEBUG_COMPARE, appConfig } from '../config';
import { simulateProgress } from '../utils';
import type { OrchestrationRun } from '../api/orchestrator';
import { setLastOrchestratorDebug } from './orchestratorDebugStore';

type LegacyCurriculumLike = {
  curriculumTitle?: string;
  curriculumDescription?: string;
  content?: { lessons?: string[]; capstoneProjects?: string[] };
  modules?: any[];
  tags?: string[];
  learningOutcomes?: string[];
  recommended?: boolean;
};

const normalizeLessonForUI = (raw: any) => ({
  title: raw?.title ?? raw?.lessonTitle ?? 'Untitled Lesson',
  description: raw?.description ?? raw?.lessonDescription ?? '',
});

const normalizeModuleForUI = (raw: any) => {
  const lessons = Array.isArray(raw?.lessons)
    ? raw.lessons.map(normalizeLessonForUI)
    : raw?.lessons && typeof raw.lessons === 'object'
      ? Object.keys(raw.lessons)
          .filter(key => /^\d+$/.test(key))
          .map(key => raw.lessons[key])
          .filter(Boolean)
          .map(normalizeLessonForUI)
      : [];

  return {
    title: raw?.title ?? raw?.moduleTitle ?? 'Untitled Module',
    description: raw?.description ?? raw?.moduleDescription ?? '',
    lessons,
  };
};

const normalizeCurriculumForUI = (raw: LegacyCurriculumLike & Record<string, any>) => {
  const modules = Array.isArray(raw?.modules)
    ? raw.modules.map(normalizeModuleForUI)
    : raw?.modules && typeof raw.modules === 'object'
      ? Object.keys(raw.modules)
          .filter(key => /^\d+$/.test(key))
          .map(key => raw.modules[key])
          .filter(Boolean)
          .map(normalizeModuleForUI)
      : [];

  const lessonTitles = modules.flatMap(module => module.lessons.map(lesson => lesson.title).filter(Boolean));
  const contentLessons = Array.isArray(raw?.content?.lessons)
    ? raw.content.lessons
    : lessonTitles;

  return {
    ...raw,
    title: raw?.title ?? raw?.curriculumTitle ?? 'Untitled Curriculum',
    description: raw?.description ?? raw?.curriculumDescription ?? '',
    modules,
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    learningOutcomes: Array.isArray(raw?.learningOutcomes) ? raw.learningOutcomes : [],
    recommended: typeof raw?.recommended === 'boolean' ? raw.recommended : false,
    content: {
      lessons: Array.isArray(contentLessons) ? contentLessons : [],
      capstoneProjects: Array.isArray(raw?.content?.capstoneProjects)
        ? raw.content.capstoneProjects
        : [],
    },
  };
};

const normalizeCurriculumsForUI = (
  rawCurriculums: unknown,
  agentThoughts: unknown
): GenerateCurriculumResponse => {
  const curriculumsArray = Array.isArray(rawCurriculums)
    ? rawCurriculums
    : rawCurriculums && typeof rawCurriculums === 'object'
      ? Object.keys(rawCurriculums)
          .filter(key => /^\d+$/.test(key))
          .sort((a, b) => Number(a) - Number(b))
          .map(key => (rawCurriculums as any)[key])
          .filter(Boolean)
      : rawCurriculums
        ? [rawCurriculums]
        : [];

  return {
    curriculums: curriculumsArray.map(raw => normalizeCurriculumForUI(raw as any)),
    agentThoughts: Array.isArray(agentThoughts) ? agentThoughts : [],
  };
};

interface FileData { mimeType: string; data: string; }
type FilterOptions = { [key: string]: string; };

class DiscoveryService {
  fetchTrendingTopics(industry: string): Promise<string[]> {
    return fetchTrendingTopics(industry);
  }

  fetchTrendingCapstoneTopics(industry: string): Promise<string[]> {
    return fetchTrendingCapstoneTopics(industry);
  }

  fetchIndustryTrends(industry: string, count: number, existingTopics: string[], timePeriod: string): Promise<IndustryTrend[]> {
    return fetchIndustryTrends(industry, count, existingTopics, timePeriod);
  }

  fetchTrendData(topic: string, timePeriod: string): Promise<number[]> {
    return fetchTrendData(topic, timePeriod);
  }
  
  fetchTopicDetails(topic: string, timePeriod: string): Promise<Pick<IndustryTrend, 'detailedDescription' | 'sources'>> {
    return fetchTopicDetails(topic, timePeriod);
  }

  generateCurriculum(
    topic: string,
    filters: FilterOptions,
    files: FileData[],
    onProgress: (progress: number) => void
  ): Promise<GenerateCurriculumResponse> {
    if (!isOrchestratorEnabled) {
      return (async () => {
        const directGeneration = await generateCurriculum(topic, filters, files, onProgress);
        const rawCurriculums = directGeneration?.curriculums ??
          (directGeneration?.curriculum ? [directGeneration.curriculum] : []) ??
          [];
        const normalized = normalizeCurriculumsForUI(
          rawCurriculums,
          (directGeneration as any)?.agentThoughts ?? (directGeneration as any)?.thoughts ?? []
        );

        try {
          setLastOrchestratorDebug({
            enabled: false,
            input: { topic, filters, filesCount: files.length },
            orchestrationId: null,
            run: null,
            logs: [],
            orchestratorGeneration: null,
            directGeneration: normalized,
            directError: null,
          });
        } catch (error) {
          console.warn('Failed to record orchestrator debug info for direct generation', error);
        }

        return normalized;
      })();
    }

    const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.discovery, onProgress);

    const pollInterval = 400;
    const isTerminalStatus = (status?: string) => ['completed', 'failed', 'cancelled'].includes(status || '');

    const awaitNextStatus = () => new Promise(resolve => setTimeout(resolve, pollInterval));

    const mapRunToCurriculum = (run: OrchestrationRun): GenerateCurriculumResponse => {
      const generationOutput = (run.output as any)?.generation ?? run.output ?? {};
      const rawCurriculums =
        generationOutput.curriculums ??
        (generationOutput.curriculum ? [generationOutput.curriculum] : []);

      return normalizeCurriculumsForUI(
        rawCurriculums,
        generationOutput.agentThoughts ?? generationOutput.thoughts ?? []
      );
    };

    return (async () => {
      let orchestrationId: string | null = null;
      let run: OrchestrationRun | null = null;
      let tasks: any[] = [];

      const recordDebugSnapshot = (overrides: Partial<any> = {}) => {
        try {
          setLastOrchestratorDebug({
            enabled: true,
            input: { topic, filters, filesCount: files.length },
            orchestrationId,
            run,
            tasks,
            logs: [],
            orchestratorGeneration: run?.output,
            directGeneration: null,
            directError: null,
            ...overrides,
          });
        } catch (error) {
          console.warn('Failed to record orchestrator debug info', error);
        }
      };

      try {
        const { id, runId } = await startOrchestration({ type: 'course', topic, filters, files });
        orchestrationId = id || runId;

        if (!orchestrationId) {
          throw new Error('Failed to start curriculum orchestration');
        }

        const startTime = Date.now();
        const maxWaitTime = 600_000;
        run = await getOrchestrationStatus(orchestrationId);
        recordDebugSnapshot();

        while (!isTerminalStatus(run.status)) {
          if (Date.now() - startTime > maxWaitTime) {
            throw new Error('Curriculum orchestration timed out after 60 seconds');
          }

          await awaitNextStatus();

          try {
            const fetchedTasks = orchestrationId ? await getOrchestrationTasks(orchestrationId) : [];
            tasks = Array.isArray(fetchedTasks) ? fetchedTasks : tasks;
            const total = tasks.length;
            const done = tasks.filter(task => ['succeeded', 'failed', 'cancelled'].includes(task?.status || '')).length;
            const pct = total > 0 ? Math.min(95, Math.round((done / total) * 100)) : null;
            if (pct !== null) {
              onProgress(pct);
            }
          } catch (error) {
            console.warn('Failed to fetch orchestration tasks', error);
          }

          run = await getOrchestrationStatus(orchestrationId);
          recordDebugSnapshot();
        }

        clearInterval(progressInterval);

        if (!run) {
          throw new Error('Curriculum orchestration returned no run data');
        }

        let logs: { logs?: string[] } | null = null;
        try {
          logs = orchestrationId ? await getOrchestrationLogs(orchestrationId) : null;
        } catch (error) {
          console.warn('Failed to fetch orchestration logs', error);
        }

        let directGeneration: GenerateCurriculumResponse | null = null;
        let directError: string | null = null;

        if (ORCHESTRATOR_DEBUG_COMPARE && isOrchestratorDebugCompareEnabled) {
          try {
            const direct = await generateCurriculum(topic, filters, files, () => {});
            const rawCurriculums = direct?.curriculums ?? (direct?.curriculum ? [direct.curriculum] : []) ?? [];
            directGeneration = normalizeCurriculumsForUI(
              rawCurriculums,
              (direct as any)?.agentThoughts ?? (direct as any)?.thoughts ?? []
            );
          } catch (error) {
            directError = error instanceof Error ? error.message : String(error);
          }
        }

        try {
          const generationOutput = (run.output as any)?.generation ?? run.output ?? {};
          setLastOrchestratorDebug({
            enabled: true,
            input: { topic, filters, filesCount: files.length },
            orchestrationId,
            run,
            tasks,
            logs: logs?.logs ?? [],
            orchestratorGeneration: generationOutput,
            directGeneration,
            directError,
          });
        } catch (error) {
          console.warn('Failed to record orchestrator debug info', error);
        }

        if (run.status === 'completed') {
          onProgress(100);
          return mapRunToCurriculum(run);
        }

        onProgress(0);
        throw new Error(run.error?.message ?? 'Curriculum orchestration failed');
      } catch (error) {
        clearInterval(progressInterval);
        onProgress(0);
        throw error;
      }
    })();
  }

  generateCapstoneProjects(
    topic: string,
    industry: string,
    files: FileData[],
    onProgress: (progress: number) => void
  ): Promise<GenerateCapstoneProjectsResponse> {
    return generateCapstoneProjects(topic, industry, files, onProgress);
  }
}

export const discoveryService = new DiscoveryService();
