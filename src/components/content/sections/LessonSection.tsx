
import React from 'react';
import { MarkdownContent, RegenerateButton, Textarea, AndragogyBadge } from '../../ui';
import type { Badge } from '../../ui/AndragogyBadge';
import { RegenerationPart } from '../../../types';

// Helper to exclude parts that require an index (like exercise and quiz)
type NonIndexedRegenerationPart = Exclude<RegenerationPart, { index: number }>;

interface LessonSectionProps {
    id: string;
    title: string;
    icon: React.ElementType;
    content: string;
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    isRegenerating?: boolean;
    openPopoverPartId?: string | null;
    isEditing: boolean;
    editedContent: string;
    onEditChange: (newContent: string) => void;
    partType: NonIndexedRegenerationPart['type'];
    rows?: number;
    badges?: Badge[];
}

export const LessonSection: React.FC<LessonSectionProps> = ({ 
    id, 
    title, 
    icon: Icon, 
    content, 
    onRegenerate, 
    isRegenerating, 
    openPopoverPartId, 
    isEditing, 
    editedContent, 
    onEditChange, 
    partType, 
    rows = 6, 
    badges 
}) => {
    const regenButtonRef = React.useRef<HTMLButtonElement>(null);

    const handleRegenerateClick = () => {
        // Cast to RegenerationPart to satisfy discriminated union check
        onRegenerate?.({ type: partType } as RegenerationPart, regenButtonRef);
    };

    const isPopoverOpen = openPopoverPartId === partType;
    const isEmpty = !content && !isEditing;

    return (
        <div 
            id={id} 
            className={`p-6 rounded-lg border shadow-sm relative group scroll-mt-8 transition-colors ${isEmpty ? 'bg-slate-50 border-slate-200 border-dashed' : 'bg-white border-slate-200'}`}
        >
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10"></div>}
            
            <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 ${isEmpty ? 'opacity-70' : ''}`}>
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${isEmpty ? 'text-slate-400' : 'text-primary'}`} />
                        <span className="font-semibold text-slate-700">{title}</span>
                    </div>
                    {badges && badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 ml-8">
                            {badges.map((b, i) => <AndragogyBadge key={i} badge={b} />)}
                        </div>
                    )}
                </div>
                {!isEditing && onRegenerate && !isEmpty && (
                    <div className={`transition-opacity self-end sm:self-auto ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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
                        value={editedContent}
                        onChange={e => onEditChange(e.target.value)}
                        rows={rows}
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
                    {content ? (
                        <MarkdownContent content={content} />
                    ) : (
                        <p className="text-sm text-slate-400 italic">No content available.</p>
                    )}
                </div>
            )}
        </div>
    );
};
