import React, { useState } from 'react';
import { generationService } from '../services';
import type { Curriculum, LessonPlan, GenerationOptions } from '../types';
import type { RegenerationPart } from '../types/Regeneration';
import { getRegenerationPartId } from '../types';
import { useToastStore } from '../store';

export const useLessonPlanApi = (isCancelledRef: React.MutableRefObject<boolean>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [regeneratingPart, setRegeneratingPart] = useState<string | null>(null);
    const addToast = useToastStore((state) => state.addToast);

    const generateAllLessonPlans = async function* (
        curriculum: Curriculum,
        options: GenerationOptions,
        existingPlans?: (LessonPlan | null)[]
    ): AsyncGenerator<{ plan: LessonPlan; index: number }> {
        setIsLoading(true);
        setProgress(0);

        const lessons = curriculum.content.lessons;
        const numLessons = lessons.length;
        const allPlans: (LessonPlan | null)[] = existingPlans ? [...existingPlans] : Array(numLessons).fill(null);

        try {
            for (let i = 0; i < numLessons; i++) {
                if (isCancelledRef.current) throw new Error("Cancelled");

                // Resume Logic: Skip if plan already exists
                if (existingPlans && existingPlans[i]) {
                    continue; 
                }

                const onLessonProgress = (p: number) => {
                    if (isCancelledRef.current) return;
                    setProgress(((i * 100) + p) / numLessons);
                };

                const previousPlans = allPlans.slice(0, i).filter((p): p is LessonPlan => p !== null);
                const newPlan = await generationService.generateLessonPlan(curriculum, lessons[i], options, previousPlans, onLessonProgress);

                if (isCancelledRef.current) throw new Error("Cancelled");

                allPlans[i] = newPlan;
                yield { plan: newPlan, index: i };
            }
        } catch (error) {
            if (isCancelledRef.current || (error instanceof Error && error.message === "Cancelled")) {
                // Don't show toast on cancellation
            } else {
                console.error("Failed to generate lesson plans:", error);
                
                let message = "An unexpected error occurred while generating the lesson plan.";
                if (error instanceof Error) {
                    if (error.message.startsWith('JSON_PARSE_ERROR')) {
                        message = "The AI returned an unexpected format. Generation stopped.";
                    } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                        message = "The model is overloaded. Please try again later.";
                    } else {
                        message = error.message;
                    }
                }
                addToast(message, { type: 'error' });
            }
            throw error; // Rethrow to be caught by the calling hook
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const regeneratePart = async (
        curriculum: Curriculum,
        lessonPlan: LessonPlan | null,
        lessonTitle: string | null,
        part: RegenerationPart,
        instructions: string,
        options: GenerationOptions
    ) => {
        const partId = getRegenerationPartId(part);
        setRegeneratingPart(partId);
        try {
            const isCurriculumPart = part.type === 'curriculumTitle';
            if (!isCurriculumPart && !lessonPlan) {
                throw new Error("Please wait for the lesson to be generated before regenerating parts.");
            }

            const result = await generationService.regenerateLessonPart(curriculum, lessonPlan, lessonTitle, part, instructions, options);
            addToast("Content successfully regenerated.", { type: 'default' });
            return result;
        } catch (error) {
            console.error("Regeneration failed:", error);
            
            let message = "Failed to regenerate content. Please try again.";
            if (error instanceof Error) {
                if (error.message.startsWith('JSON_PARSE_ERROR')) {
                    message = "The AI returned a response in an unexpected format. Please try again.";
                } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                    message = "The model is overloaded. Please try again later.";
                } else {
                    message = error.message;
                }
            }
            addToast(message, { type: 'error' });
            throw error;
        } finally {
            setRegeneratingPart(null);
        }
    };
    
    const generateNewPart = async (
        curriculum: Curriculum,
        lessonPlan: LessonPlan,
        lessonTitle: string,
        partType: 'exercise' | 'quiz',
        options: GenerationOptions
    ) => {
        try {
            const result = await generationService.generateNewLessonPart(curriculum, lessonPlan, lessonTitle, partType, options);
            addToast(`New ${partType} generated.`, { type: 'default' });
            return result;
        } catch (error) {
            console.error(`Failed to generate new ${partType}:`, error);
            
            let message = `Failed to generate new ${partType}. Please try again.`;
            if (error instanceof Error) {
                if (error.message.startsWith('JSON_PARSE_ERROR')) {
                    message = "The AI returned a response in an unexpected format. Please try again.";
                } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                    message = "The model is overloaded. Please try again later.";
                } else {
                    message = error.message;
                }
            }
            addToast(message, { type: 'error' });
            throw error;
        }
    };
    
    return { isLoading, progress, regeneratingPart, generateAllLessonPlans, regeneratePart, generateNewPart };
};