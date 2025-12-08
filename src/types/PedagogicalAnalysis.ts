
import { z } from 'zod';
import { AndragogicalAnalysisSchema } from './zod';

export type PedagogicalAnalysis = z.infer<typeof AndragogicalAnalysisSchema>;
