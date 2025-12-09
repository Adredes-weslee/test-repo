import discoveryFixture from '../simulations/data/discovery.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';
import { orchestratorStore } from '../orchestrator/store';

const goal = 'Analyze learner needs and propose a discovery summary for a new learning experience.';

const shouldSimulate = (task: AgentTask): boolean => {
  const run = orchestratorStore.getRun(task.runId);
  const runSim = (run?.input as any)?.simulation === true;
  return runSim || isSimulationMode();
};

const runSimulation = (_task: AgentTask): unknown => {
  return {
    ...discoveryFixture,
    source: 'simulation',
  };
};

const runLive = async (task: AgentTask): Promise<unknown> => {
  const model = await loadGeminiModel();
  if (!model) {
    return {
      ...discoveryFixture,
      source: 'simulation',
      reason: 'gemini_unavailable',
    };
  }

  const prompt = buildPrompt(task, goal);

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const text = result.response.text();
    const parsed = parseModelText(text);

    // ✅ Flatten to match simulation shape
    if (parsed && typeof parsed === 'object') {
      return { ...(parsed as Record<string, unknown>), source: 'gemini' };
    }

    // fallback if parseModelText returns a string/primitive
    return { message: text ?? String(parsed), source: 'gemini' };
  } catch (_error) {
    return {
      ...discoveryFixture,
      source: 'simulation',
      reason: 'gemini_call_failed',
    };
  }
};

export const discoveryAgent = async (task: AgentTask): Promise<unknown> => {
  if (shouldSimulate(task)) {
    return runSimulation(task);
  }

  return runLive(task);
};
