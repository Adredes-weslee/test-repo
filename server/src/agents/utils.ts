import { AgentTask } from '../orchestrator/types';

export interface GeminiModel {
  generateContent: (
    input: unknown
  ) => Promise<{ response: { text: () => string | undefined } }>;
}

export const isSimulationMode = (): boolean =>
  process.env.SIMULATION_MODE === 'true' || !process.env.GEMINI_API_KEY;

export const buildPrompt = (task: AgentTask, goal: string): string => {
  const baseDescription = task.description
    ? `Task description: ${task.description}`
    : 'No explicit task description provided.';

  return [
    goal,
    baseDescription,
    'Return JSON only.',
  ].join('\n');
};

export const loadGeminiModel = async (): Promise<GeminiModel | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const moduleName: string = '@google/genai';
  try {
    const genAiModule = (await import(moduleName)) as {
      GoogleGenerativeAI?: new (apiKey: string) => {
        getGenerativeModel: (options: { model: string }) => GeminiModel;
      };
    };

    if (!genAiModule?.GoogleGenerativeAI) {
      return null;
    }

    const client = new genAiModule.GoogleGenerativeAI(apiKey);
    return client.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (error) {
    console.warn('Gemini client unavailable, falling back to simulation.', error);
    return null;
  }
};

export const parseModelText = (text?: string): unknown => {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_error) {
    return { message: text };
  }
};
