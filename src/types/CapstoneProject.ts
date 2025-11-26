import { z } from 'zod';
import { 
  FileNodeSchema, 
  ProjectFilesDataSchema, 
  CapstoneProjectSchema,
  DetailedProjectDataSchema
} from './zod';

export type ProjectFilesData = z.infer<typeof ProjectFilesDataSchema>;
export type CapstoneProject = z.infer<typeof CapstoneProjectSchema>;
export type DetailedProjectData = z.infer<typeof DetailedProjectDataSchema>;