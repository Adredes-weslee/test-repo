import { z } from 'zod';
import { LessonPlanSchema } from './zod';

export type LessonPlan = z.infer<typeof LessonPlanSchema>;
