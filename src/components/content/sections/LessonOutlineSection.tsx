import React from 'react';
import { Lesson } from '../../icons';
import { MarkdownContent, RegenerateButton, Textarea } from '../../ui';
import { RegenerationPart } from '../../../types';

interface LessonOutlineSectionProps {
    outline: string;
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    isRegenerating?: boolean;
    openPopoverPartId?: string | null;
    isEditing: boolean;
    editedOutline: string;
    onEditChange: (newOutline: string) => void;
}

export const LessonOutlineSection: React.FC<LessonOutlineSectionProps> = ({ outline, onRegenerate, isRegenerating, openPopoverPartId, isEditing, editedOutline, onEditChange }) => {
    const regenButtonRef = React.useRef<HTMLButtonElement>(null);

    if (!outline && !isEditing) {
        return null;
    }
    
    const simpleTitle = (
        <div className="flex items-center space-x-3">
            <Lesson className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">Lesson</span>
        </div>
    );

    const handleRegenerateClick = () => {
        onRegenerate?.({ type: 'outline' }, regenButtonRef);
    };

    const partId = 'outline';
    const isPopoverOpen = openPopoverPartId === partId;

    return (
        <div id="lesson-outline" className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative group scroll-mt-8">
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
                        value={editedOutline}
                        onChange={e => onEditChange(e.target.value)}
                        rows={10}
                        placeholder="Markdown supported content for the lesson."
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
                    <MarkdownContent content={outline} />
                </div>
            )}
        </div>
    );
};
