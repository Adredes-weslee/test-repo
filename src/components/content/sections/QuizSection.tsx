import React from 'react';
import type { LessonPlan, RegenerationPart } from '../../../types';
import { Quiz } from '../../icons';
import { MarkdownContent, RegenerateButton } from '../../ui';
import { quizQuestionToMarkdown, parseQuizQuestionMarkdown } from '../../../utils/markdownEditorUtils';
import { GenericListSection, ViewModeRenderHelpers } from './GenericListSection';

type QuizQuestion = LessonPlan['quiz']['questions'][0];

interface QuizSectionProps {
    quiz: LessonPlan['quiz'];
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart?: () => Promise<QuizQuestion>;
    regeneratingPart?: string | null;
    openPopoverPartId?: string | null;
    isEditing: boolean;
    editedQuiz: LessonPlan['quiz'];
    onEditChange: (newQuiz: LessonPlan['quiz']) => void;
}

const renderQuizView = (q: QuizQuestion, index: number, helpers: ViewModeRenderHelpers, onRegenerate?: QuizSectionProps['onRegenerate']) => {
    const { ref, isPopoverOpen, isRegenerating, onRegenerateClick } = helpers;
    return (
        <div key={index} className="relative group/item text-sm border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 pt-2 first:pt-0">
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10 -m-2 p-2"></div>}
            <div className="flex justify-between items-start">
                <div className="font-semibold text-slate-800 mb-2 pr-4">
                    <MarkdownContent content={`${index + 1}. ${q.question}`} />
                </div>
                {onRegenerate && (
                    <div className={`transition-opacity flex-shrink-0 ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}>
                        <RegenerateButton
                            ref={ref}
                            onClick={onRegenerateClick}
                            isPopoverOpen={isPopoverOpen}
                        />
                    </div>
                )}
            </div>
            <ul className="space-y-1.5 list-none pl-2">
                {q.options.map(opt => (
                    <li key={opt} className="text-slate-600 flex items-start">
                        <span className={`flex-shrink-0 inline-block w-4 h-4 mr-2 mt-1 border rounded-full ${opt === q.answer ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}></span>
                        <MarkdownContent content={opt} />
                    </li>
                ))}
            </ul>
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2">
                {q.explanation && (
                    <div className="text-slate-600">
                        <strong className="font-medium text-slate-700">Explanation:</strong>
                        <div className="prose prose-sm max-w-none inline-block">
                            <MarkdownContent content={q.explanation} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const QuizSection: React.FC<QuizSectionProps> = ({ quiz, editedQuiz, onRegenerate, onEditChange, isEditing, ...props }) => {
    if ((!quiz || !quiz.questions || quiz.questions.length === 0) && !isEditing) {
        return null;
    }

    const simpleTitle = (
        <div className="flex items-center space-x-3">
            <Quiz className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">Quiz</span>
        </div>
    );
    
    return (
        <div id="lesson-quiz" className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative group scroll-mt-8">
            <div className="flex justify-between items-center mb-4">
                {simpleTitle}
            </div>
            <GenericListSection
                isEditing={isEditing}
                items={quiz.questions || []}
                editedItems={editedQuiz.questions || []}
                onEditChange={(newQuestions) => onEditChange({ questions: newQuestions })}
                partType="quiz"
                itemToMarkdown={quizQuestionToMarkdown}
                parseMarkdownToItem={parseQuizQuestionMarkdown}
                renderItemView={(item, index, helpers) => renderQuizView(item, index, helpers, onRegenerate)}
                newItemPlaceholder={`**Question:**\n...\n\n**Options:**\nOption 1\nOption 2\n\n**Answer:**\n...\n\n**Explanation:**\n...`}
                singularItemName="Question"
                onRegenerate={onRegenerate}
                {...props}
            />
        </div>
    );
};