import React from 'react';
import type { ContentItem } from '../../../types';
import { getDifficultyClasses, formatDate } from '../../../utils';
import { CardWrapper } from '../../../components/ui';

interface ContentItemCardProps {
    item: ContentItem & { progress?: number };
    isSelected: boolean;
    onSelect: () => void;
}

export const ContentItemCard: React.FC<ContentItemCardProps> = ({ item, isSelected, onSelect }) => {
    const isGenerating = typeof item.progress === 'number' && item.progress < 100;

    return (
        <CardWrapper onClick={isGenerating ? undefined : onSelect} isActive={isSelected} className="!p-4 w-full text-left">
            <p className={`font-semibold text-slate-800 truncate pr-8 transition-colors ${isSelected ? 'text-primary' : ''}`}>{item.name}</p>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-slate-500 mt-1.5">
                <span className={`px-2 py-0.5 rounded-full font-medium ${getDifficultyClasses(item.difficulty)}`}>{item.difficulty}</span>
                <span className="text-slate-400">&middot;</span>
                <span>{item.lessonCount} lessons</span>
                <span className="text-slate-400">&middot;</span>
                <span>{item.lessonCount * item.lessonDuration} hrs total</span>
            </div>
            {isGenerating ? (
                <>
                    <p className="text-xs text-slate-500 mt-2">Generating...</p>
                    <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5 overflow-hidden">
                        <div
                            className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${item.progress}%` }}
                        ></div>
                    </div>
                </>
            ) : (
                <p className="text-xs text-slate-500 mt-1.5">Created on {formatDate(item.created)}</p>
            )}
        </CardWrapper>
    );
};