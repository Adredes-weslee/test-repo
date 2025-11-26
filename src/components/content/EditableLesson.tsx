import React, { useMemo, useRef } from 'react';
import { LessonDisplay } from '../../components/content';
import type { RegenerationPart, LessonPlan } from '../../types';
import { RegenerateButton } from '../../components/ui';
import { LessonPlanSkeleton } from '../../components/skeletons/LessonPlanSkeleton';

interface EditableLessonProps {
    lessonPlan: LessonPlan | null;
    onRegenerate: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart: (partType: 'exercise' | 'quiz') => Promise<any>;
    regeneratingPart: string | null;
    openPopoverPartId: string | null;
    totalLessons?: number;
    animationDirection?: 'right' | 'left' | null;
    onDuplicateAndVary: (lessonIndex: number) => void;
    isEditing: boolean;
    editedLessonPlan: LessonPlan | null;
    onPlanChange: (plan: LessonPlan) => void;
    editedLessonTitle: string;
    onTitleChange: (title: string) => void;
    currentLessonIndex: number;
}

export const EditableLesson: React.FC<EditableLessonProps> = ({ 
    lessonPlan, 
    onRegenerate, 
    onGenerateNewPart, 
    regeneratingPart, 
    openPopoverPartId, 
    totalLessons = 0,
    animationDirection,
    isEditing,
    editedLessonPlan,
    onPlanChange,
    editedLessonTitle,
    onTitleChange,
    currentLessonIndex,
}) => {
    const isCapstone = useMemo(() => totalLessons > 0 && currentLessonIndex === totalLessons - 1, [totalLessons, currentLessonIndex]);
    
    const titleRegenButtonRef = useRef<HTMLButtonElement>(null);

    const animationClass = animationDirection === 'right' 
        ? 'animate-slideInFromRight' 
        : animationDirection === 'left' 
        ? 'animate-slideInFromLeft' 
        : 'animate-fadeIn';

    return (
        <div className="relative">
            <div className={`flex justify-between items-end w-full mb-6 ${animationClass}`}>
                <div>
                    <p className="text-sm font-semibold text-slate-400">Lesson</p>
                    {!isEditing && (
                        <h2 className="text-2xl font-bold text-slate-800 mt-1 break-words">{editedLessonTitle}</h2>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative mb-6">
                    <label htmlFor="lesson-title-editor-card" className="block text-sm font-semibold text-slate-700 mb-2">Lesson Title</label>
                    <div className="flex items-center gap-2">
                        <input
                            id="lesson-title-editor-card"
                            value={editedLessonTitle}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-focus focus:border-primary-focus"
                        />
                        <RegenerateButton
                            ref={titleRegenButtonRef}
                            onClick={() => onRegenerate({ type: 'title' }, titleRegenButtonRef)}
                            isPopoverOpen={openPopoverPartId === 'title'}
                        />
                    </div>
                </div>
            )}

            <div className="relative">
                {lessonPlan && editedLessonPlan ? (
                    <LessonDisplay
                        lessonPlan={lessonPlan}
                        lessonTitle={editedLessonTitle}
                        isEditing={isEditing}
                        editedPlan={editedLessonPlan}
                        onPlanChange={onPlanChange}
                        onRegenerate={onRegenerate}
                        onGenerateNewPart={onGenerateNewPart}
                        regeneratingPart={regeneratingPart}
                        openPopoverPartId={openPopoverPartId}
                        isCapstone={isCapstone}
                        animationDirection={animationDirection}
                    />
                ) : (
                    <LessonPlanSkeleton />
                )}
            </div>
        </div>
    );
};
