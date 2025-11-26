import { z } from 'zod';
import { CurriculumSchema } from './zod';

export type Curriculum = z.infer<typeof CurriculumSchema>;
