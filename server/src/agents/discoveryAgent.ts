import discoveryFixture from '../simulations/data/discovery.json';
import { AgentTask } from '../orchestrator/types';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';

const goal = 'Analyze learner needs and propose a discovery summary for a new learning experience.';

const runSimulation = (_task: AgentTask): unknown => {
  return {
    ...discoveryFixture,
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

export const discoveryAgent = async (task: AgentTask): Promise<unknown> => {
  if (isSimulationMode()) {
    return runSimulation(task);
  }

  return runLive(task);
};
