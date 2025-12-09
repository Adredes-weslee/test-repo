import validationFixture from '../simulations/data/validation.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';

export interface ValidationResult {
  andragogyScore: number;
  pedagogyScore: number;
  pass: boolean;
  reasons: string[];
  source?: string;
  rawOutput?: unknown;
}

const goal = 'Evaluate the learning plan for pedagogy and andragogy. Respond with JSON containing andragogyScore, pedagogyScore, pass, and reasons (array).';

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
    reasons: Array.isArray(typed.reasons)
      ? typed.reasons.map(String)
      : fallback.reasons,
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
    return normalizeResult({ ...(parsed as object), source: 'gemini' });
  } catch (_error) {
    return runSimulation(task);
  }
};

export const validationAgent = async (task: AgentTask): Promise<ValidationResult> => {
  if (isSimulationMode()) {
    return runSimulation(task);
  }

  return runLive(task);
};
