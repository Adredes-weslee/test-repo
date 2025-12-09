import validationFixture from '../simulations/data/validation.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';
import { orchestratorStore } from '../orchestrator/store';

export interface ValidationResult {
  andragogyScore: number;
  pedagogyScore: number;
  pass: boolean;
  reasons: string[];
  source?: string;
  rawOutput?: unknown;
}

const goal =
  'Evaluate the learning plan for pedagogy and andragogy. Respond with JSON containing andragogyScore, pedagogyScore, pass, and reasons (array).';

const shouldSimulate = (task: AgentTask): boolean => {
  const run = orchestratorStore.getRun(task.runId);
  const runSim = (run?.input as any)?.simulation === true;
  return runSim || isSimulationMode();
};

const extractTopic = (task: AgentTask): string | undefined => {
  const run = orchestratorStore.getRun(task.runId);
  const topic = (run?.input as { topic?: unknown } | undefined)?.topic;
  if (typeof topic === 'string' && topic.trim()) {
    return topic.trim();
  }

  return undefined;
};

const stringifySafe = (value: unknown): string => {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value);
  } catch (_error) {
    return String(value);
  }
};

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

const checkRelevance = (task: AgentTask): ValidationResult | null => {
  const topic = extractTopic(task);
  if (!topic) return null;

  const generationTask = orchestratorStore
    .listTasksByRun(task.runId)
    .find((entry) => entry.agent === 'generation');

  if (
    generationTask?.result &&
    typeof generationTask.result === 'object' &&
    (generationTask.result as { source?: string }).source === 'simulation'
  ) {
    return null;
  }

  const tokens = tokenize(topic);
  if (!tokens.length) return null;

  const haystack = `${stringifySafe(generationTask?.result ?? '')} ${task.description ?? ''}`.toLowerCase();

  const hits = tokens.reduce(
    (count, token) => (haystack.includes(token) ? count + 1 : count),
    0
  );

  const requiredHits = Math.max(1, Math.ceil(tokens.length * 0.5));
  if (hits >= requiredHits) return null;

  return {
    andragogyScore: 0.1,
    pedagogyScore: 0.1,
    pass: false,
    reasons: ['Artifact appears out of scope for requested topic.'],
    source: 'relevance-filter',
  };
};

const runSimulation = (_task: AgentTask): ValidationResult => {
  return {
    ...validationFixture,
    source: 'simulation',
  } as ValidationResult;
};

const normalizeResult = (data: unknown): ValidationResult => {
  const fallback = runSimulation({} as AgentTask);
  if (typeof data !== 'object' || data === null) return fallback;

  const typed = data as Partial<ValidationResult>;
  return {
    andragogyScore: typeof typed.andragogyScore === 'number' ? typed.andragogyScore : fallback.andragogyScore,
    pedagogyScore: typeof typed.pedagogyScore === 'number' ? typed.pedagogyScore : fallback.pedagogyScore,
    pass: typeof typed.pass === 'boolean' ? typed.pass : fallback.pass,
    reasons: Array.isArray(typed.reasons) ? typed.reasons.map(String) : fallback.reasons,
    source: typed.source ?? fallback.source,
    rawOutput: typed.rawOutput ?? data,
  };
};

const runLive = async (task: AgentTask): Promise<ValidationResult> => {
  const model = await loadGeminiModel();
  if (!model) return runSimulation(task);

  const prompt = buildPrompt(task, goal);
  try {
    const result = await model.generateContent([{ text: prompt }]);
    const parsed = parseModelText(result.response.text());

    // Ensure we always tag where this came from
    const base = (parsed && typeof parsed === 'object')
      ? { ...(parsed as object) }
      : { rawOutput: parsed };

    return normalizeResult({ ...base, source: 'gemini' });
  } catch (_error) {
    return runSimulation(task);
  }
};

export const validationAgent = async (task: AgentTask): Promise<ValidationResult> => {
  if (shouldSimulate(task)) {
    return runSimulation(task);
  }

  const relevanceResult = checkRelevance(task);
  if (relevanceResult) {
    return relevanceResult;
  }

  return runLive(task);
};
