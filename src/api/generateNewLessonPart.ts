import { ai } from '../core/api/client';
import type { Curriculum, LessonPlan, GenerationOptions } from '../types';
import { exerciseSchema as geminiExerciseSchema, quizQuestionSchema as geminiQuizQuestionSchema } from './schema';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { buildNewPartPrompt } from './prompts';
import { ExerciseSchema, QuizQuestionSchema } from '../types/zod';
import { z } from 'zod';


type PartToGenerate = 'exercise' | 'quiz';

const getResponseSchemaForPart = (part: PartToGenerate) => {
    switch (part) {
        case 'exercise': return geminiExerciseSchema;
        case 'quiz': return geminiQuizQuestionSchema;
        default: throw new Error('Invalid part type');
    }
};

const getZodSchemaForPart = (part: PartToGenerate) => {
    switch (part) {
        case 'exercise': return ExerciseSchema;
        case 'quiz': return QuizQuestionSchema;
        default: throw new Error('Invalid part type');
    }
};

export const generateNewLessonPart = async <T extends PartToGenerate>(
  curriculum: Curriculum,
  lessonPlan: LessonPlan,
  lessonTitle: string,
  partToGenerate: T,
  options: GenerationOptions,
): Promise<z.infer<ReturnType<typeof getZodSchemaForPart>>> => {
    
  const schema = getResponseSchemaForPart(partToGenerate);
  const zodSchema = getZodSchemaForPart(partToGenerate);
  const prompt = buildNewPartPrompt(curriculum, lessonPlan, lessonTitle, partToGenerate, options);
  
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
    console.error(`Error generating new lesson part (${partToGenerate}):`, error);
    throw error;
  }
};