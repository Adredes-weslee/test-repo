import { z } from 'zod';
import { PromptSuggestionSchema } from './zod';

export type PromptSuggestion = z.infer<typeof PromptSuggestionSchema>;
