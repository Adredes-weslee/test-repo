import { z } from 'zod';
import { ContentItemSchema } from './zod';

export type ContentItem = z.infer<typeof ContentItemSchema>;
