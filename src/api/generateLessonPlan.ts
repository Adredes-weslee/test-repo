
import { ai } from '../core/api/client';
import type { Curriculum, LessonPlan, GenerationOptions } from '../types';
import { 
    overviewSectionSchema, 
    learningObjectivesSectionSchema,
    activationSectionSchema,
    demonstrationSectionSchema,
    applicationSectionSchema,
    integrationSectionSchema,
    reflectionSectionSchema,
    exercisesSectionSchema,
    quizSectionSchema
} from './schema/lessonPlanSchema';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { 
    getOverviewPrompt,
    getLearningObjectivesPrompt,
    getActivationPrompt,
    getDemonstrationPrompt,
    getApplicationPrompt,
    getIntegrationPrompt,
    getReflectionPrompt,
    getExercisesPrompt,
    getQuizPrompt
} from './prompts/lessonPlanPrompts';
import { LessonPlanSchema } from '../types/zod';

export const generateLessonPlan = async (
  curriculum: Curriculum,
  lesson: string,
  options: GenerationOptions,
  previousLessons: LessonPlan[],
  onProgress: (progress: number) => void
): Promise<LessonPlan> => {
    
  try {
      const model = options.model;
      
      // 1. Overview
      onProgress(5);
      const overviewPrompt = getOverviewPrompt(curriculum, lesson, options, previousLessons);
      const overviewRes = await ai.models.generateContent({
        model, contents: [overviewPrompt], config: { responseMimeType: 'application/json', responseSchema: overviewSectionSchema }
      });
      const overviewData = cleanAndParseJson(overviewRes.text) as { overview: string };
      
      // 2. Learning Objectives
      onProgress(15);
      const objectivesPrompt = getLearningObjectivesPrompt(curriculum, lesson, options, overviewData.overview);
      const objectivesRes = await ai.models.generateContent({
        model, contents: [objectivesPrompt], config: { responseMimeType: 'application/json', responseSchema: learningObjectivesSectionSchema }
      });
      const objectivesData = cleanAndParseJson(objectivesRes.text) as { learningObjectives: string[] };

      // 3. Activation
      onProgress(25);
      const activationPrompt = getActivationPrompt(curriculum, lesson, options, overviewData.overview, objectivesData.learningObjectives);
      const activationRes = await ai.models.generateContent({
        model, contents: [activationPrompt], config: { responseMimeType: 'application/json', responseSchema: activationSectionSchema }
      });
      const activationData = cleanAndParseJson(activationRes.text) as { activation: string };

      // 4. Demonstration
      onProgress(35);
      const demonstrationPrompt = getDemonstrationPrompt(curriculum, lesson, options, overviewData.overview, objectivesData.learningObjectives, activationData.activation);
      const demonstrationRes = await ai.models.generateContent({
        model, contents: [demonstrationPrompt], config: { responseMimeType: 'application/json', responseSchema: demonstrationSectionSchema }
      });
      const demonstrationData = cleanAndParseJson(demonstrationRes.text) as { demonstration: string };

      // 5. Application
      onProgress(50);
      const applicationPrompt = getApplicationPrompt(curriculum, lesson, options, overviewData.overview, objectivesData.learningObjectives, demonstrationData.demonstration);
      const applicationRes = await ai.models.generateContent({
        model, contents: [applicationPrompt], config: { responseMimeType: 'application/json', responseSchema: applicationSectionSchema }
      });
      const applicationData = cleanAndParseJson(applicationRes.text) as { application: string };

      // 6. Integration
      onProgress(65);
      const integrationPrompt = getIntegrationPrompt(curriculum, lesson, options, applicationData.application);
      const integrationRes = await ai.models.generateContent({
        model, contents: [integrationPrompt], config: { responseMimeType: 'application/json', responseSchema: integrationSectionSchema }
      });
      const integrationData = cleanAndParseJson(integrationRes.text) as { integration: string };

      // 7. Feedback & Reflection
      onProgress(75);
      const reflectionPrompt = getReflectionPrompt(curriculum, lesson, options, integrationData.integration);
      const reflectionRes = await ai.models.generateContent({
        model, contents: [reflectionPrompt], config: { responseMimeType: 'application/json', responseSchema: reflectionSectionSchema }
      });
      const reflectionData = cleanAndParseJson(reflectionRes.text) as { reflectionAndAssessment: string };

      // 8. Exercises
      onProgress(85);
      const exercisesPrompt = getExercisesPrompt(curriculum, lesson, options, applicationData.application);
      const exercisesRes = await ai.models.generateContent({
        model, contents: [exercisesPrompt], config: { responseMimeType: 'application/json', responseSchema: exercisesSectionSchema }
      });
      const exercisesData = cleanAndParseJson(exercisesRes.text) as { exercises: any[] };

      // 9. Quiz
      onProgress(95);
      const quizPrompt = getQuizPrompt(curriculum, lesson, options, objectivesData.learningObjectives, demonstrationData.demonstration);
      const quizRes = await ai.models.generateContent({
        model, contents: [quizPrompt], config: { responseMimeType: 'application/json', responseSchema: quizSectionSchema }
      });
      const quizData = cleanAndParseJson(quizRes.text) as { quiz: any };

      // Assembly
      const fullLessonData = {
          ...overviewData,
          ...objectivesData,
          ...activationData,
          ...demonstrationData,
          ...applicationData,
          ...integrationData,
          ...reflectionData,
          ...exercisesData,
          ...quizData,
      };

      // Validate against the full schema
      const lessonPlan = LessonPlanSchema.parse(fullLessonData);
      
      onProgress(100);
      return lessonPlan;

  } catch (error) {
    onProgress(0);
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};
