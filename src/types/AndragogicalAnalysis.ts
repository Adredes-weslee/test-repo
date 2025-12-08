
import { z } from 'zod';
import { AndragogicalAnalysisSchema } from './zod';

export type AndragogicalAnalysis = z.infer<typeof AndragogicalAnalysisSchema>;
