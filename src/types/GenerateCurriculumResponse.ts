import { z } from 'zod';
import { GenerateCurriculumResponseSchema } from './zod';

export type GenerateCurriculumResponse = z.infer<typeof GenerateCurriculumResponseSchema>;
