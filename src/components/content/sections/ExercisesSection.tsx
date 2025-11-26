import React from 'react';
import type { Exercise as ExerciseType, RegenerationPart } from '../../../types';
import { Exercise } from '../../icons';
import { MarkdownContent, RegenerateButton } from '../../ui';
import { exerciseToMarkdown, parseExerciseMarkdown } from '../../../utils/markdownEditorUtils';
import { GenericListSection, ViewModeRenderHelpers } from './GenericListSection';

interface ExercisesSectionProps {
    exercises: ExerciseType[];
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart?: () => Promise<ExerciseType>;
    regeneratingPart?: string | null;
    openPopoverPartId?: string | null;
    isEditing: boolean;
    editedExercises: ExerciseType[];
    onEditChange: (newExercises: ExerciseType[]) => void;
}

const renderExerciseView = (exercise: ExerciseType, index: number, helpers: ViewModeRenderHelpers, onRegenerate?: ExercisesSectionProps['onRegenerate']) => {
    const { ref, isPopoverOpen, isRegenerating, onRegenerateClick } = helpers;
    return (
        <div key={index} className="relative group/item space-y-4 text-sm pt-4 first:pt-0">
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10 -m-2 p-2"></div>}
            <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold text-slate-800">Exercise {index + 1}</h4>
                {onRegenerate && (
                    <div className={`transition-opacity ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}>
                        <RegenerateButton
                            ref={ref}
                            onClick={onRegenerateClick}
                            isPopoverOpen={isPopoverOpen}
                        />
                    </div>
                )}
            </div>
            <div>
                <p className="font-semibold text-slate-800 mb-1">Problem</p>
                <div className="text-slate-700">
                    <MarkdownContent content={exercise.problem} />
                </div>
            </div>
            <div>
                <p className="font-semibold text-slate-800 mb-1">Hint</p>
                <div className="text-slate-600 italic">
                    <MarkdownContent content={exercise.hint} />
                </div>
            </div>
            <div>
                <p className="font-semibold text-slate-800 mb-1">Answer & Explanation</p>
                <div className="p-3 bg-primary-lightest border border-primary-light rounded-md space-y-2">
                    <div className="font-medium text-primary-dark">
                        <MarkdownContent content={exercise.answer} />
                    </div>
                    <div className="text-slate-700 pt-2 border-t border-primary-light">
                        <MarkdownContent content={exercise.explanation} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({ exercises, editedExercises, onRegenerate, isEditing, onEditChange, ...props }) => {

    if ((!exercises || exercises.length === 0) && !isEditing) {
        return null;
    }
    
    const simpleTitle = (
        <div className="flex items-center space-x-3">
            <Exercise className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">Exercises</span>
        </div>
    );
    
    return (
        <div id="lesson-exercises" className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative group scroll-mt-8">
             <div className="flex justify-between items-center mb-4">
                {simpleTitle}
            </div>
            <GenericListSection
                isEditing={isEditing}
                onEditChange={onEditChange}
                items={exercises}
                editedItems={editedExercises}
                partType="exercise"
                itemToMarkdown={exerciseToMarkdown}
                parseMarkdownToItem={parseExerciseMarkdown}
                renderItemView={(item, index, helpers) => renderExerciseView(item, index, helpers, onRegenerate)}
                newItemPlaceholder={`**Problem:**\n...\n\n**Hint:**\n...\n\n**Answer:**\n...\n\n**Explanation:**\n...`}
                singularItemName="Exercise"
                onRegenerate={onRegenerate}
                {...props}
            />
        </div>
    );
};