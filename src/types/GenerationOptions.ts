import { z } from 'zod';
import { GenerationOptionsSchema } from './zod';

export type GenerationOptions = z.infer<typeof GenerationOptionsSchema>;
