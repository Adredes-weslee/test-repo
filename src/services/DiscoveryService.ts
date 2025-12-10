import { fetchTrendingTopics, fetchTrendingCapstoneTopics, generateCurriculum, generateCapstoneProjects, fetchIndustryTrends, fetchTrendData, fetchTopicDetails } from '../api';
import type { GenerateCurriculumResponse, IndustryTrend } from '../types';
import type { GenerateCapstoneProjectsResponse } from '../api/generateCapstoneProjects';
import {
  getHealth,
  getOrchestrationFeedback,
  getOrchestrationLogs,
  getOrchestrationLogsCompact,
  getOrchestrationStatus,
  getOrchestrationTasks,
  isOrchestratorEnabled,
  startOrchestration,
} from '../api/orchestrator';
import { appConfig } from '../config';
import { simulateProgress } from '../utils';
import type { OrchestrationRun } from '../api/orchestrator';
import { mergeLastOrchestratorDebug, setLastOrchestratorDebug } from './orchestratorDebugStore';

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
    const baseDebugSnapshot = {
      enabled: isOrchestratorEnabled,
      input: { topic, filters, filesCount: files?.length ?? 0, files },
    };

    setLastOrchestratorDebug(baseDebugSnapshot);

    if (!isOrchestratorEnabled) {
      return generateCurriculum(topic, filters, files, onProgress)
        .then(response => {
          const curriculum = response.curriculums.find(c => c.recommended) || response.curriculums[0];
          mergeLastOrchestratorDebug({
            orchestratorOrFinalGeneration: curriculum,
          });
          return response;
        })
        .catch(error => {
          mergeLastOrchestratorDebug(baseDebugSnapshot);
          throw error;
        });
    }

    const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.discovery, onProgress);

    const pollInterval = 400;
    const isTerminalStatus = (status?: string) => ['completed', 'failed', 'cancelled'].includes(status || '');

    const awaitNextStatus = () => new Promise(resolve => setTimeout(resolve, pollInterval));

    const captureDebugData = (orchestrationId: string, run: OrchestrationRun) => {
      void (async () => {
        let runDetails: OrchestrationRun | null = run ?? null;
        let tasks: any[] | undefined;
        let logs: any[] | undefined;
        let logsCompact: any[] | undefined;
        let mode: 'simulation' | 'live' | 'unknown' = 'unknown';
        let feedback: any;

        try {
          runDetails = await getOrchestrationStatus(orchestrationId);
        } catch {
          // non-fatal
        }

        try {
          tasks = await getOrchestrationTasks(orchestrationId);
        } catch {
          // non-fatal
        }

        try {
          logs = await getOrchestrationLogs(orchestrationId);
        } catch {
          // non-fatal
        }

        try {
          logsCompact = await getOrchestrationLogsCompact(orchestrationId);
        } catch {
          // non-fatal
        }

        try {
          const health = await getHealth();
          mode = health?.simulationMode === undefined ? 'unknown' : health.simulationMode ? 'simulation' : 'live';
        } catch {
          // non-fatal
        }

        try {
          feedback = await getOrchestrationFeedback(orchestrationId);
        } catch {
          // non-fatal
        }

        const outputs = {
          discovery: (runDetails?.output as any)?.discovery,
          generation: (runDetails?.output as any)?.generation,
          validation: (runDetails?.output as any)?.validation,
        };

        mergeLastOrchestratorDebug({
          orchestrationId,
          run: runDetails,
          tasks,
          logs: (logs as any)?.logs ?? logs,
          logsCompact,
          outputs,
          mode,
          feedback,
        });
      })();
    };

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
      try {
        const { id, runId } = await startOrchestration({ type: 'course', topic, filters, files });
        const orchestrationId = id || runId;

        if (!orchestrationId) {
          throw new Error('Failed to start curriculum orchestration');
        }

        setLastOrchestratorDebug({
          ...baseDebugSnapshot,
          enabled: true,
          orchestrationId,
        });

        const startTime = Date.now();
        const maxWaitTime = 600_000;
        let run = await getOrchestrationStatus(orchestrationId);

        while (!isTerminalStatus(run.status)) {
          if (Date.now() - startTime > maxWaitTime) {
            throw new Error('Curriculum orchestration timed out after 60 seconds');
          }
          await awaitNextStatus();
          run = await getOrchestrationStatus(orchestrationId);
        }

        clearInterval(progressInterval);

        captureDebugData(orchestrationId, run);

        if (run.status === 'completed') {
          onProgress(100);
          return mapRunToCurriculum(run);
        }

        onProgress(0);
        throw new Error(run.error?.message ?? 'Curriculum orchestration failed');
      } catch (error) {
        clearInterval(progressInterval);
        onProgress(0);
        mergeLastOrchestratorDebug(baseDebugSnapshot);
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
