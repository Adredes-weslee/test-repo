
import { ai } from '../core/api/client';
import type { CapstoneProject } from '../types';
import type { DetailedProjectData } from '../types';
import { 
    detailedDescriptionSchema,
    learningOutcomesSchema,
    projectRequirementsSchema,
    techStackSchema,
    deliverablesSchema
} from './schema';
import { 
    DetailedDescriptionSchema,
    LearningOutcomesSchema,
    ProjectRequirementsSchema,
    TechStackSchema,
    DeliverablesSchema,
} from '../types/zod';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { buildProjectPartRegenerationPrompt } from './prompts';
import { API_MODELS } from '../config';

const getResponseSchemaForPart = (part: keyof DetailedProjectData) => {
    switch (part) {
        case 'detailedDescription': return detailedDescriptionSchema;
        case 'techStack': return techStackSchema;
        case 'learningOutcomes': return learningOutcomesSchema;
        case 'projectRequirements': return projectRequirementsSchema;
        case 'deliverables': return deliverablesSchema;
        default: throw new Error('Invalid project regeneration part type');
    }
};

const getZodSchemaForPart = (part: keyof DetailedProjectData) => {
    switch (part) {
        case 'detailedDescription': return DetailedDescriptionSchema;
        case 'techStack': return TechStackSchema;
        case 'learningOutcomes': return LearningOutcomesSchema;
        case 'projectRequirements': return ProjectRequirementsSchema;
        case 'deliverables': return DeliverablesSchema;
        default: throw new Error('Invalid project regeneration part type');
    }
};

export const regenerateProjectPart = async (
  project: CapstoneProject,
  partToRegenerate: keyof DetailedProjectData,
  instructions: string,
): Promise<Partial<DetailedProjectData>> => {
    
  const schema = getResponseSchemaForPart(partToRegenerate);
  const zodSchema = getZodSchemaForPart(partToRegenerate);
  const prompt = buildProjectPartRegenerationPrompt(project, partToRegenerate, instructions);
  
  try {
      const response = await ai.models.generateContent({
        model: API_MODELS.GENERATE_DETAILED_PROJECT,
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      const parsedJson = cleanAndParseJson(response.text);
      return zodSchema.parse(parsedJson);

  } catch (error) {
    console.error(`Error regenerating project part (${String(partToRegenerate)}):`, error);
    throw error;
  }
};
