
import { ai } from '../core/api/client';
import type { Curriculum, LessonPlan, GenerationOptions } from '../types';
import type { RegenerationPart } from '../types/Regeneration';
import { 
    exerciseSchema, quizQuestionSchema, lessonOutlineSchema, lessonOutcomeSchema, projectSchema, lessonTitleSchema, curriculumTitleSchema,
    overviewSchema, learningObjectivesSchema, activationSchema, demonstrationSchema, applicationSchema, integrationSchema, reflectionAndAssessmentSchema
} from './schema';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { buildRegenerationPrompt } from './prompts';
import { 
    LessonOutcomeSchema, 
    LessonOutlineSchema, 
    ExerciseSchema, 
    QuizQuestionSchema, 
    ProjectSchema,
    LessonTitleSchema,
    CurriculumTitleSchema,
    OverviewSchema,
    LearningObjectivesSchema,
    ActivationSchema,
    DemonstrationSchema,
    ApplicationSchema,
    IntegrationSchema,
    ReflectionAndAssessmentSchema
} from '../types/zod';
import { z } from 'zod';

const getResponseSchemaForPart = (part: RegenerationPart) => {
    switch (part.type) {
        case 'outcome': return lessonOutcomeSchema;
        case 'outline': return lessonOutlineSchema;
        case 'exercise': return exerciseSchema;
        case 'quiz': return quizQuestionSchema;
        case 'project': return projectSchema;
        case 'title': return lessonTitleSchema;
        case 'curriculumTitle': return curriculumTitleSchema;
        case 'overview': return overviewSchema;
        case 'objectives': return learningObjectivesSchema;
        case 'activation': return activationSchema;
        case 'demonstration': return demonstrationSchema;
        case 'application': return applicationSchema;
        case 'integration': return integrationSchema;
        case 'reflectionAndAssessment': return reflectionAndAssessmentSchema;
        default: throw new Error('Invalid regeneration part type');
    }
};

const getZodSchemaForPart = (part: RegenerationPart) => {
    switch (part.type) {
        case 'outcome': return LessonOutcomeSchema;
        case 'outline': return LessonOutlineSchema;
        case 'exercise': return ExerciseSchema;
        case 'quiz': return QuizQuestionSchema;
        case 'project': return ProjectSchema;
        case 'title': return LessonTitleSchema;
        case 'curriculumTitle': return CurriculumTitleSchema;
        case 'overview': return OverviewSchema;
        case 'objectives': return LearningObjectivesSchema;
        case 'activation': return ActivationSchema;
        case 'demonstration': return DemonstrationSchema;
        case 'application': return ApplicationSchema;
        case 'integration': return IntegrationSchema;
        case 'reflectionAndAssessment': return ReflectionAndAssessmentSchema;
        default: throw new Error('Invalid regeneration part type');
    }
};


export const regenerateLessonPart = async <T extends RegenerationPart>(
  curriculum: Curriculum,
  lessonPlan: LessonPlan | null,
  lessonTitle: string | null,
  partToRegenerate: T,
  instructions: string,
  options: GenerationOptions,
): Promise<z.infer<ReturnType<typeof getZodSchemaForPart>>> => {
    
  const schema = getResponseSchemaForPart(partToRegenerate);
  const zodSchema = getZodSchemaForPart(partToRegenerate);
  const prompt = buildRegenerationPrompt(curriculum, lessonPlan, lessonTitle, partToRegenerate, instructions, options);
  
  try {
      const response = await ai.models.generateContent({
        model: options.model,
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      const parsedJson = cleanAndParseJson(response.text);
      return zodSchema.parse(parsedJson);

  } catch (error) {
    console.error(`Error regenerating lesson part (${partToRegenerate.type}):`, error);
    throw error;
  }
};
