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
  if (!apiKey) return null;

  const candidates = ['@google/genai', '@google/generative-ai'];

  for (const moduleName of candidates) {
    try {
      const mod = (await import(moduleName)) as any;

      // @google/genai style
      if (mod?.GoogleGenerativeAI) {
        const client = new mod.GoogleGenerativeAI(apiKey);
        return client.getGenerativeModel({ model: 'gemini-2.5-pro' });
      }

      // @google/generative-ai style
      if (mod?.GoogleGenerativeAI) {
        const client = new mod.GoogleGenerativeAI(apiKey);
        return client.getGenerativeModel({ model: 'gemini-2.5-pro' });
      }
    } catch {
      // try next
    }
  }

  console.warn('Gemini SDK not available; falling back to simulation.');
  return null;
};

export const parseModelText = (text?: string): unknown => {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_error) {
    return { message: text };
  }
};
