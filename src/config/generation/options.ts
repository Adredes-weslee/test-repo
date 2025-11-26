import { API_MODELS } from '../devops.config';
import type { GenerationOptions } from '../../types';

export const generationModels = [
    { value: API_MODELS.GENERATION_PRO, label: 'Gemini 2.5 Pro' },
    { value: API_MODELS.GENERATION_FLASH, label: 'Gemini Flash' },
    { value: API_MODELS.GENERATION_FLASH_LITE, label: 'Gemini Flash Lite', default: true },
];

export const generationStyles = [
    { value: 'Comprehensive', label: 'Comprehensive', default: true },
    { value: 'Concise', label: 'Concise' },
    { value: 'Step-by-step', label: 'Step-by-step' },
];

export const exercisesPerLessonOptions = [
    { value: '1', label: '1 Exercise' },
    { value: '2', label: '2 Exercises', default: true },
    { value: '3', label: '3 Exercises' },
];

export const quizQuestionsPerLessonOptions = [
    { value: '3', label: '3 Questions', default: true },
    { value: '5', label: '5 Questions' },
    { value: '7', label: '7 Questions' },
];

export const lessonDurationOptions = [
    { value: '0.5', label: '30 Minutes' },
    { value: '0.75', label: '45 Minutes' },
    { value: '1', label: '1 Hour', default: true },
    { value: '1.5', label: '1.5 Hours' },
    { value: '2', label: '2 Hours' },
    { value: '3', label: '3 Hours' },
];

export const getDefaultGenerationOptions = (): GenerationOptions => {
    const findDefault = (options: {value: string, default?: boolean}[], fallbackIndex = 0) => {
        const defaultOption = options.find(o => o.default);
        return defaultOption ? defaultOption.value : (options[fallbackIndex]?.value || '');
    };
    return {
        model: findDefault(generationModels),
        style: findDefault(generationStyles),
        exercisesPerLesson: findDefault(exercisesPerLessonOptions),
        quizQuestionsPerLesson: findDefault(quizQuestionsPerLessonOptions),
        lessonDuration: findDefault(lessonDurationOptions),
        codeExamples: true,
        visualElements: true,
        instructions: "",
    };
};
