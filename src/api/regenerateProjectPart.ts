
import { ai } from '../core/api/client';
import type { CapstoneProject } from '../types';
import type { DetailedProjectData } from '../types';
import { 
    detailedDescriptionSchema,
    learningOutcomesSchema,
    projectRequirementsSchema,
    techStackSchema,
    deliverablesSchema,
    constraintsSchema,
    futureOrientedElementSchema,
    participationModelSchema,
    evidenceOfLearningSchema,
    assessmentFeedbackSchema,
    judgementCriteriaSchema
} from './schema';
import { 
    DetailedDescriptionSchema,
    LearningOutcomesSchema,
    ProjectRequirementsSchema,
    TechStackSchema,
    DeliverablesSchema,
    ConstraintsSchema,
    FutureOrientedElementSchema,
    ParticipationModelSchema,
    EvidenceOfLearningSchema,
    AssessmentFeedbackSchema,
    JudgementCriteriaSchema
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
        case 'constraints': return constraintsSchema;
        case 'futureOrientedElement': return futureOrientedElementSchema;
        case 'participationModel': return participationModelSchema;
        case 'evidenceOfLearning': return evidenceOfLearningSchema;
        case 'assessmentFeedback': return assessmentFeedbackSchema;
        case 'judgementCriteria': return judgementCriteriaSchema;
        default: throw new Error(`Invalid project regeneration part type: ${String(part)}`);
    }
};

const getZodSchemaForPart = (part: keyof DetailedProjectData) => {
    switch (part) {
        case 'detailedDescription': return DetailedDescriptionSchema;
        case 'techStack': return TechStackSchema;
        case 'learningOutcomes': return LearningOutcomesSchema;
        case 'projectRequirements': return ProjectRequirementsSchema;
        case 'deliverables': return DeliverablesSchema;
        case 'constraints': return ConstraintsSchema;
        case 'futureOrientedElement': return FutureOrientedElementSchema;
        case 'participationModel': return ParticipationModelSchema;
        case 'evidenceOfLearning': return EvidenceOfLearningSchema;
        case 'assessmentFeedback': return AssessmentFeedbackSchema;
        case 'judgementCriteria': return JudgementCriteriaSchema;
        default: throw new Error(`Invalid project regeneration part type: ${String(part)}`);
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
    console.error(`Error regenerating project part "${String(partToRegenerate)}":`, error);
    throw error;
  }
};
