import { ai } from '../core/api/client';
import { API_MODELS } from '../config';
import { getPromptSuggestionPrompt } from './prompts';
import { suggestionSchema } from './schema';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { PromptSuggestionSchema, type PromptSuggestion } from '../types';

export const getPromptSuggestion = async (prompt: string, type: 'course' | 'project'): Promise<PromptSuggestion | null> => {
  if (prompt.trim().length < 10) { // Don't generate for very short prompts
    return null;
  }

  try {
    const apiPrompt = getPromptSuggestionPrompt(prompt, type);
    const response = await ai.models.generateContent({
      model: API_MODELS.FETCH_TRENDING_TOPICS, // Use a fast, cheap model
      contents: [apiPrompt],
      config: {
        responseMimeType: 'application/json',
        responseSchema: suggestionSchema,
      }
    });
    
    const parsed = cleanAndParseJson(response.text);
    const validated = PromptSuggestionSchema.parse(parsed);
    return validated;

  } catch (error) {
    console.error("Error getting prompt suggestion:", error);
    return null; // Fail silently
  }
};