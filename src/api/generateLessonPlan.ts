import { ai } from '../core/api/client';
import type { Curriculum, LessonPlan, GenerationOptions } from '../types';
import { lessonPlanSchema as geminiLessonPlanSchema } from './schema';
import { simulateProgress } from '../utils';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { appConfig } from '../config';
import { getLessonPlanPrompt } from './prompts';
import { LessonPlanSchema } from '../types/zod';

export const generateLessonPlan = async (
  curriculum: Curriculum,
  lesson: string,
  options: GenerationOptions,
  previousLessons: LessonPlan[],
  onProgress: (progress: number) => void
): Promise<LessonPlan> => {
    
  const prompt = getLessonPlanPrompt(curriculum, lesson, options, previousLessons);
  
  const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.generation, onProgress);

  try {
      const response = await ai.models.generateContent({
        model: options.model,
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: geminiLessonPlanSchema,
        }
      });
      clearInterval(progressInterval);
      onProgress(100);

      const parsedJson = cleanAndParseJson(response.text);
      return LessonPlanSchema.parse(parsedJson);
  } catch (error) {
    clearInterval(progressInterval);
    onProgress(0);
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};