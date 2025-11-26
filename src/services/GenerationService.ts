import { generateLessonPlan, regenerateLessonPart, generateNewLessonPart, generateFullVariedCourseStreamed, getPromptSuggestion } from '../api';
import type { Curriculum, LessonPlan, GenerationOptions, RegenerationPart, ContentItem, PromptSuggestion } from '../types';


class GenerationService {
  generateLessonPlan(
    curriculum: Curriculum,
    lesson: string,
    options: GenerationOptions,
    previousLessons: LessonPlan[],
    onProgress: (progress: number) => void
  ): Promise<LessonPlan> {
    return generateLessonPlan(curriculum, lesson, options, previousLessons, onProgress);
  }

  regenerateLessonPart(
    curriculum: Curriculum,
    lessonPlan: LessonPlan | null,
    lessonTitle: string | null,
    partToRegenerate: RegenerationPart,
    instructions: string,
    options: GenerationOptions,
  ): Promise<any> {
    return regenerateLessonPart(curriculum, lessonPlan, lessonTitle, partToRegenerate, instructions, options);
  }

  generateNewLessonPart(
    curriculum: Curriculum,
    lessonPlan: LessonPlan,
    lessonTitle: string,
    partToGenerate: 'exercise' | 'quiz',
    options: GenerationOptions,
  ): Promise<any> {
    return generateNewLessonPart(curriculum, lessonPlan, lessonTitle, partToGenerate, options);
  }

  generateFullVariedCourseStreamed(
    originalContentItem: ContentItem,
    lessonIndex: number,
    instructions: string,
  ): AsyncGenerator<ContentItem> {
    return generateFullVariedCourseStreamed(originalContentItem, lessonIndex, instructions);
  }

  getPromptSuggestion(prompt: string, type: 'course' | 'project'): Promise<PromptSuggestion | null> {
    return getPromptSuggestion(prompt, type);
  }
}

export const generationService = new GenerationService();