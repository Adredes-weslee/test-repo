import { z } from 'zod';
import { IndustryTrendSchema } from './zod';

export type IndustryTrend = z.infer<typeof IndustryTrendSchema>;
