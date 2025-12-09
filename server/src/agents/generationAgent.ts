import generationFixture from '../simulations/data/generation.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';
import { orchestratorStore } from '../orchestrator/store';

const goal = `Generate a concise curriculum plan using JSON for the requested experience.
Always respond with valid JSON using a top-level "curriculums" array (even for a single curriculum).
Ensure curriculum and module titles reflect the requested topic.`;

type GenerationSource = 'gemini' | 'simulation';

const normalizeToCanonicalLesson = (raw: any) => ({
  title: raw?.title ?? raw?.lessonTitle ?? 'Untitled Lesson',
  description: raw?.description ?? raw?.lessonDescription ?? '',
});

const normalizeToCanonicalModule = (raw: any) => ({
  title: raw?.title ?? raw?.moduleTitle ?? 'Untitled Module',
  description: raw?.description ?? raw?.moduleDescription ?? '',
  lessons: Array.isArray(raw?.lessons)
    ? raw.lessons.map(normalizeToCanonicalLesson)
    : raw?.lessons && typeof raw.lessons === 'object'
      ? Object.keys(raw.lessons)
          .filter(key => /^\d+$/.test(key))
          .map(key => raw.lessons[key])
          .filter(Boolean)
          .map(normalizeToCanonicalLesson)
      : [],
});

const normalizeToCanonicalCurriculum = (raw: any) => ({
  title: raw?.title ?? raw?.curriculumTitle ?? 'Untitled Curriculum',
  description: raw?.description ?? raw?.curriculumDescription ?? '',
  modules: Array.isArray(raw?.modules)
    ? raw.modules.map(normalizeToCanonicalModule)
    : raw?.modules && typeof raw.modules === 'object'
      ? Object.keys(raw.modules)
          .filter(key => /^\d+$/.test(key))
          .map(key => raw.modules[key])
          .filter(Boolean)
          .map(normalizeToCanonicalModule)
      : [],
});

const normalizeGenerationResult = (parsed: unknown, source: GenerationSource) => {
  if (parsed && typeof parsed === 'object') {
    const record = parsed as Record<string, unknown>;

    const extractCurriculumsFromRecord = (): unknown[] | null => {
      if (Array.isArray(record.curriculums)) {
        return record.curriculums;
      }

      if (record.curriculums && typeof record.curriculums === 'object') {
        const valueRecord = record.curriculums as Record<string, unknown>;
        const numericKeys = Object.keys(valueRecord).filter(key => /^\d+$/.test(key));
        if (numericKeys.length) {
          return numericKeys.map(key => valueRecord[key]).filter(Boolean);
        }
      }

      if (record.curriculum && !record.curriculums) {
        const { curriculum } = record;
        return Array.isArray(curriculum) ? curriculum : [curriculum];
      }

      const numericKeys = Object.keys(record).filter(key => /^\d+$/.test(key));
      if (numericKeys.length) {
        return numericKeys.map(key => record[key]).filter(Boolean);
      }

      return null;
    };

    const curriculums = extractCurriculumsFromRecord();

    if (curriculums) {
      const canonicalCurriculums = curriculums.map(normalizeToCanonicalCurriculum);
      const { curriculum, ...rest } = record;
      const cleanedRest = { ...rest };

      Object.keys(cleanedRest)
        .filter(key => /^\d+$/.test(key))
        .forEach(key => delete cleanedRest[key]);

      return {
        ...cleanedRest,
        curriculums: canonicalCurriculums,
        source,
      };
    }

    return { ...record, source };
  }

  return undefined;
};

const shouldSimulate = (task: AgentTask): boolean => {
  const run = orchestratorStore.getRun(task.runId);
  const runSim = (run?.input as any)?.simulation === true;
  return runSim || isSimulationMode();
};

const runSimulation = (_task: AgentTask): unknown => {
  const normalized = normalizeGenerationResult(generationFixture, 'simulation');

  return normalized ?? {
    ...generationFixture,
    source: 'simulation',
  };
};

const runLive = async (task: AgentTask): Promise<unknown> => {
  const model = await loadGeminiModel();
  if (!model) {
    return {
      ...generationFixture,
      source: 'simulation',
      reason: 'gemini_unavailable',
    };
  }

  const prompt = buildPrompt(task, goal);

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const text = result.response.text();
    const parsed = parseModelText(text);
    const normalized = normalizeGenerationResult(parsed, 'gemini');

    if (normalized) {
      return normalized;
    }

    return { message: text ?? String(parsed), source: 'gemini' };
  } catch (_error) {
    return {
      ...generationFixture,
      source: 'simulation',
      reason: 'gemini_call_failed',
    };
  }
};

export const generationAgent = async (task: AgentTask): Promise<unknown> => {
  if (shouldSimulate(task)) {
    return runSimulation(task);
  }

  return runLive(task);
};
