import { z } from 'zod';
import { ExerciseSchema } from './zod';

export type Exercise = z.infer<typeof ExerciseSchema>;
