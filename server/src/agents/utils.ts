import fs from 'fs/promises';
import path from 'path';
import { AgentTask } from '../orchestrator/types';
import { orchestratorStore } from '../orchestrator/store';

export interface GeminiModel {
  generateContent: (
    input: unknown
  ) => Promise<{ response: { text: () => string | undefined } }>;
}

export const isSimulationMode = (): boolean =>
  process.env.SIMULATION_MODE === 'true' || !process.env.GEMINI_API_KEY;

export const buildPrompt = (task: AgentTask, goal: string): string => {
  const run = orchestratorStore.getRun(task.runId);
  const input = run?.input as
    | { type?: unknown; topic?: unknown; filters?: unknown; files?: unknown[] }
    | undefined;

  const inputSummary = {
    type: typeof input?.type === 'string' ? input.type : undefined,
    topic: typeof input?.topic === 'string' ? input.topic : undefined,
    filters: input?.filters ?? undefined,
    filesCount: Array.isArray(input?.files) ? input?.files?.length : 0,
  };

  const baseDescription = task.description
    ? `Task description: ${task.description}`
    : 'No explicit task description provided.';

  return [
    goal,
    baseDescription,
    `Run input summary: ${JSON.stringify(inputSummary)}`,
    'Stay on the requested topic throughout. Curriculum and module titles must clearly reflect the topic.',
    'Return valid JSON only.',
  ].join('\n');
};

let cachedGuidelines: string | null = null;

export const loadAndragogyGuidelinesExcerpt = async (
  maxChars = 20000
): Promise<string> => {
  if (cachedGuidelines) return cachedGuidelines;

  const fallback =
    'Apply constructive alignment, authentic practice, guided participation, feedback, judgement, future-oriented transfer, and accessibility principles.';

  const tryPaths = [
    path.resolve(process.cwd(), 'ANDRAGOGY_GUIDELINES.md'),
    path.resolve(__dirname, '../../../ANDRAGOGY_GUIDELINES.md'),
  ];

  for (const p of tryPaths) {
    try {
      const raw = await fs.readFile(p, 'utf8');
      const excerpt = raw.slice(0, maxChars);
      cachedGuidelines = excerpt;
      return excerpt;
    } catch {
      // continue to next path
    }
  }

  cachedGuidelines = fallback;
  return fallback;
};

export const loadGeminiModel = async (): Promise<GeminiModel | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const modelName = process.env.GEMINI_MODEL ?? 'gemini-2.5-pro';

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const client = new GoogleGenerativeAI(apiKey);
    return client.getGenerativeModel({ model: modelName });
  } catch (primaryError) {
    try {
      const { GoogleGenerativeAI } = await import('@google/genai');
      const client = new GoogleGenerativeAI(apiKey);
      return client.getGenerativeModel({ model: modelName });
    } catch (_fallbackError) {
      console.warn('Gemini SDK not available; falling back to simulation.', primaryError);
      return null;
    }
  }
};

export const parseModelText = (text?: string): unknown => {
  if (!text) return null;

  let cleaned = text.trim();

  const fencedMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch) {
    cleaned = fencedMatch[1].trim();
  }

  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  }

  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    return { message: cleaned };
  }
};
