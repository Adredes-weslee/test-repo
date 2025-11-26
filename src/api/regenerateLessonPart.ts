import { ai } from '../core/api/client';
import type { Curriculum, LessonPlan, GenerationOptions } from '../types';
import type { RegenerationPart } from '../types/Regeneration';
import { exerciseSchema, quizQuestionSchema, lessonOutlineSchema, lessonOutcomeSchema, projectSchema, lessonTitleSchema, curriculumTitleSchema } from './schema';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { buildRegenerationPrompt } from './prompts';
import { 
    LessonOutcomeSchema, 
    LessonOutlineSchema, 
    ExerciseSchema, 
    QuizQuestionSchema, 
    ProjectSchema,
    LessonTitleSchema,
    CurriculumTitleSchema
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