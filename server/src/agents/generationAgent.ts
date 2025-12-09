import generationFixture from '../simulations/data/generation.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';

const goal = 'Generate a concise curriculum plan using JSON for the requested experience.';

const runSimulation = (_task: AgentTask): unknown => {
  return {
    ...generationFixture,
    source: 'simulation',
  };
};

const runLive = async (task: AgentTask): Promise<unknown> => {
  const model = await loadGeminiModel();
  if (!model) return runSimulation(task);

  const prompt = buildPrompt(task, goal);
  try {
    const result = await model.generateContent([{ text: prompt }]);
    const text = result.response.text();
    return {
      source: 'gemini',
      output: parseModelText(text),
    };
  } catch (_error) {
    return runSimulation(task);
  }
};

export const generationAgent = async (task: AgentTask): Promise<unknown> => {
  if (isSimulationMode()) {
    return runSimulation(task);
  }

  return runLive(task);
};
