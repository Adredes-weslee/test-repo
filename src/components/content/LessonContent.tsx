import React from 'react';
import type { LessonPlan, RegenerationPart, Exercise } from '../../types';
import {
    LessonOutcomeSection,
    LessonOutlineSection,
    ExercisesSection,
    QuizSection,
    ProjectSection,
} from './sections';

type QuizQuestion = LessonPlan['quiz']['questions'][0];

interface LessonContentProps {
    lessonPlan: LessonPlan;
    onRegenerate: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart?: (partType: 'exercise' | 'quiz') => Promise<any>;
    regeneratingPart: string | null;
    openPopoverPartId: string | null;
    isEditing: boolean;
    editedPlan: LessonPlan;
    onPlanChange: (updatedPlan: LessonPlan) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({ 
    lessonPlan, 
    onRegenerate, 
    onGenerateNewPart, 
    regeneratingPart, 
    openPopoverPartId, 
    isEditing, 
    editedPlan, 
    onPlanChange 
}) => {
    
    const handlePartUpdate = (updatedPart: Partial<LessonPlan>) => {
        onPlanChange({ ...editedPlan, ...updatedPart });
    };

    const handleGenerateNewExercise = onGenerateNewPart ? async () => await onGenerateNewPart('exercise') as Exercise : undefined;
    const handleGenerateNewQuizQuestion = onGenerateNewPart ? async () => await onGenerateNewPart('quiz') as QuizQuestion : undefined;

    return (
        <div className="space-y-6">
            <LessonOutcomeSection 
                outcome={lessonPlan.lessonOutcome || ''} 
                onRegenerate={onRegenerate} 
                isRegenerating={regeneratingPart === 'outcome'} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedOutcome={editedPlan.lessonOutcome} 
                onEditChange={(lessonOutcome) => handlePartUpdate({ lessonOutcome })} 
            />
            <LessonOutlineSection 
                outline={lessonPlan.lessonOutline || ''} 
                onRegenerate={onRegenerate} 
                isRegenerating={regeneratingPart === 'outline'} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedOutline={editedPlan.lessonOutline} 
                onEditChange={(lessonOutline) => handlePartUpdate({ lessonOutline })} 
            />
            <ExercisesSection 
                exercises={lessonPlan.exercises || []} 
                onRegenerate={onRegenerate} 
                regeneratingPart={regeneratingPart} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedExercises={editedPlan.exercises} 
                onEditChange={(exercises) => handlePartUpdate({ exercises })} 
                onGenerateNewPart={handleGenerateNewExercise} 
            />
            <QuizSection 
                quiz={lessonPlan.quiz || { questions: [] }} 
                onRegenerate={onRegenerate} 
                regeneratingPart={regeneratingPart} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedQuiz={editedPlan.quiz} 
                onEditChange={(quiz) => handlePartUpdate({ quiz })} 
                onGenerateNewPart={handleGenerateNewQuizQuestion} 
            /> 
            {/*
            <ProjectSection 
                project={lessonPlan.project || { description: '', objective: '', deliverables: [] }} 
                onRegenerate={onRegenerate} 
                isRegenerating={regeneratingPart === 'project'} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedProject={editedPlan.project} 
                onEditChange={(project) => handlePartUpdate({ project })} 
            />
            */}
        </div>
    );
};
