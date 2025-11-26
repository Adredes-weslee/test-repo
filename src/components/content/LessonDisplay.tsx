
import React from 'react';
import type { LessonPlan, RegenerationPart } from '../../types';
import { LessonStructureNav } from './LessonStructureNav';
import { LessonContent } from './LessonContent';

interface LessonDisplayProps {
    lessonPlan: LessonPlan | null;
    lessonTitle: string;
    isEditing: boolean;
    editedPlan: LessonPlan;
    onPlanChange: (updatedPlan: LessonPlan) => void;
    onRegenerate: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart: (partType: 'exercise' | 'quiz') => Promise<any>;
    regeneratingPart: string | null;
    openPopoverPartId: string | null;
    isCapstone: boolean;
    animationDirection?: 'right' | 'left' | null;
}

export const LessonDisplay: React.FC<LessonDisplayProps> = ({ 
    lessonPlan, 
    lessonTitle,
    isEditing,
    editedPlan,
    onPlanChange,
    onRegenerate, 
    onGenerateNewPart,
    regeneratingPart, 
    openPopoverPartId, 
    isCapstone,
    animationDirection,
}) => {
    
    const animationClass = animationDirection === 'right' 
        ? 'animate-slideInFromRight' 
        : animationDirection === 'left' 
        ? 'animate-slideInFromLeft' 
        : 'animate-fadeIn';

    return (
        <div className={`flex flex-col md:flex-row gap-8 items-start ${isEditing ? 'pb-24' : ''}`}>
            <LessonStructureNav lessonPlan={lessonPlan} />
            <div className={`flex-1 w-full min-w-0 ${animationClass}`}>
                {lessonPlan && editedPlan ? (
                    <LessonContent
                        lessonPlan={lessonPlan}
                        onRegenerate={onRegenerate}
                        onGenerateNewPart={onGenerateNewPart}
                        regeneratingPart={regeneratingPart}
                        openPopoverPartId={openPopoverPartId}
                        isEditing={isEditing}
                        editedPlan={editedPlan}
                        onPlanChange={onPlanChange}
                    />
                ) : (
                    <div>Loading...</div> // This should be replaced by a skeleton
                )}
            </div>
        </div>
    );
};
