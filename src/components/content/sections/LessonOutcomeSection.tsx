import React from 'react';
import { Goal } from '../../icons';
import { MarkdownContent, RegenerateButton, Textarea } from '../../ui';
import { RegenerationPart } from '../../../types';

interface LessonOutcomeSectionProps {
    outcome: string;
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    isRegenerating?: boolean;
    openPopoverPartId?: string | null;
    isEditing: boolean;
    editedOutcome: string;
    onEditChange: (newOutcome: string) => void;
}

export const LessonOutcomeSection: React.FC<LessonOutcomeSectionProps> = ({ outcome, onRegenerate, isRegenerating, openPopoverPartId, isEditing, editedOutcome, onEditChange }) => {
    const regenButtonRef = React.useRef<HTMLButtonElement>(null);

    if (!outcome && !isEditing) {
        return null;
    }

    const simpleTitle = (
        <div className="flex items-center space-x-3">
            <Goal className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">Lesson Outcome</span>
        </div>
    );

    const handleRegenerateClick = () => {
        onRegenerate?.({ type: 'outcome' }, regenButtonRef);
    };

    const partId = 'outcome';
    const isPopoverOpen = openPopoverPartId === partId;

    return (
        <div id="lesson-outcome" className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative group scroll-mt-8">
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10"></div>}
            <div className="flex justify-between items-center mb-4">
                {simpleTitle}
                {!isEditing && onRegenerate && (
                    <div className={`transition-opacity ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <RegenerateButton 
                            ref={regenButtonRef} 
                            onClick={handleRegenerateClick} 
                            isPopoverOpen={isPopoverOpen} 
                        />
                    </div>
                )}
            </div>
            
            {isEditing ? (
                <div className="flex items-start gap-2">
                    <Textarea 
                        value={editedOutcome}
                        onChange={e => onEditChange(e.target.value)}
                        rows={3}
                        placeholder="e.g., Students will be able to..."
                        className="flex-grow"
                    />
                    {onRegenerate && (
                        <RegenerateButton 
                            ref={regenButtonRef} 
                            onClick={handleRegenerateClick} 
                            isPopoverOpen={isPopoverOpen} 
                        />
                    )}
                </div>
            ) : (
                 <div className="prose prose-sm max-w-none text-slate-700">
                    <MarkdownContent content={outcome} />
                </div>
            )}
        </div>
    );
};
