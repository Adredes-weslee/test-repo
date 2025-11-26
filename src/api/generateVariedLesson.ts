import { ai } from '../core/api/client';
import type { Curriculum, LessonPlan, GenerationOptions, ContentItem } from '../types';
import { generateLessonPlan } from './generateLessonPlan';
import { singleCurriculumSchema } from './schema';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { lessonPlanToMarkdown } from '../utils';
import { getVariedCurriculumPrompt } from './prompts';
import { VariedCurriculumOutlineSchema } from '../types/zod';

interface VariedCurriculumOutline {
    title: string;
    description: string;
    tags: string[];
    lessons: string[];
}

// 1. Generate a new curriculum outline based on the variation.
const generateVariedCurriculum = async (
    originalCurriculum: Curriculum,
    originalLessonTitle: string,
    instructions: string,
    options: GenerationOptions
): Promise<VariedCurriculumOutline> => {
    const prompt = getVariedCurriculumPrompt(originalCurriculum, originalLessonTitle, instructions);

    const response = await ai.models.generateContent({
        model: options.model,
        contents: [prompt],
        config: {
            responseMimeType: 'application/json',
            responseSchema: singleCurriculumSchema,
        }
    });

    const parsedJson = cleanAndParseJson(response.text);
    return VariedCurriculumOutlineSchema.parse(parsedJson);
};


// 2. Main orchestrator async generator
export async function* generateFullVariedCourseStreamed(
    originalContentItem: ContentItem,
    lessonIndex: number,
    instructions: string,
): AsyncGenerator<ContentItem> {
    const originalLesson = originalContentItem.lessons[lessonIndex];
    if (!originalLesson) {
        throw new Error('Lesson to vary not found.');
    }

    const curriculumForApi: Curriculum = {
        title: originalContentItem.name,
        description: originalContentItem.notes || '',
        tags: [originalContentItem.difficulty],
        recommended: false,
        learningOutcomes: [],
        content: {
            lessons: originalContentItem.lessons.map(l => l.title),
        }
    };

    const newOutline = await generateVariedCurriculum(curriculumForApi, originalLesson.title, instructions, originalContentItem.generationOptions);
    
    const newItemId = Date.now();
    const newDifficulty = newOutline.tags.find(t => ['Beginner', 'Intermediate', 'Advanced'].includes(t)) || 'Beginner';

    const skeletonItem: ContentItem = {
        id: newItemId,
        name: newOutline.title,
        lessonCount: newOutline.lessons.length,
        lessonDuration: originalContentItem.lessonDuration,
        difficulty: newDifficulty,
        created: new Date().toISOString().split('T')[0],
        generationOptions: originalContentItem.generationOptions,
        lessons: [],
        progress: 5,
    };
    yield skeletonItem;

    const newCurriculumForGeneration: Curriculum = {
        ...newOutline,
        recommended: false,
        learningOutcomes: [],
        content: { lessons: newOutline.lessons }
    };

    const newLessonPlans: LessonPlan[] = [];
    for (const [index, lessonTitle] of newOutline.lessons.entries()) {
        // We don't need progress tracking here, so pass a dummy function.
        const onProgress = () => {};
        const newPlan = await generateLessonPlan(newCurriculumForGeneration, lessonTitle, originalContentItem.generationOptions, newLessonPlans, onProgress);
        newLessonPlans.push(newPlan);
        
        yield {
            ...skeletonItem,
            progress: 5 + Math.round(((index + 1) / newOutline.lessons.length) * 90),
        };
    }
    
    const newNote = `Varied from course "${originalContentItem.name}" (based on lesson: "${originalLesson.title}").\n\nVariation instructions: "${instructions}"`;

    const newContentItem: ContentItem = {
        ...skeletonItem,
        notes: newNote,
        lessons: newOutline.lessons.map((title, index) => ({
            title,
            content: lessonPlanToMarkdown(newLessonPlans[index]!)
        }))
    };
    
    yield { ...newContentItem, progress: 100 };
}