import generationFixture from '../simulations/data/generation.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';
import { orchestratorStore } from '../orchestrator/store';

const goal = `Generate a concise curriculum plan using JSON for the requested experience.
Always respond with valid JSON using a top-level "curriculums" array (even for a single curriculum).
Ensure curriculum and module titles reflect the requested topic.`;

type GenerationSource = 'gemini' | 'simulation';

const normalizeGenerationResult = (parsed: unknown, source: GenerationSource) => {
  if (parsed && typeof parsed === 'object') {
    const record = parsed as Record<string, unknown>;

    if (Array.isArray(record.curriculums)) {
      return { ...record, source };
    }

    if (record.curriculum && !record.curriculums) {
      const { curriculum, ...rest } = record;
      const normalizedCurriculums = Array.isArray(curriculum)
        ? curriculum
        : [curriculum];

      return { ...rest, curriculums: normalizedCurriculums, source };
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
