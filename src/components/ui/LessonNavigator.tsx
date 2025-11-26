
import React from 'react';
import { ChevronLeft, ChevronRight } from '../icons';

interface LessonNavigatorProps {
    currentLessonIndex: number;
    totalLessons: number;
    lessonTitle: string;
    onIndexChange: (index: number) => void;
    className?: string;
}

export const LessonNavigator: React.FC<LessonNavigatorProps> = ({
    currentLessonIndex,
    totalLessons,
    lessonTitle,
    onIndexChange,
    className,
}) => {
    if (totalLessons <= 1) {
        return null;
    }

    const buttonClasses = "flex items-center justify-center w-10 h-10 text-primary rounded-full shadow-primary-focus/30 hover:text-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:shadow-none";

    return (
        <div className={`flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-200 ${className || ''}`}>
            <button
                onClick={() => onIndexChange(Math.max(0, currentLessonIndex - 1))}
                disabled={currentLessonIndex === 0}
                className={buttonClasses}
                aria-label="Previous lesson"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="relative flex-1 min-w-0 mx-2 group" title={lessonTitle}>
                <div className="flex justify-center items-baseline text-sm font-medium text-slate-700">
                    <span className="text-slate-500 flex-shrink-0">Lesson {currentLessonIndex + 1} of {totalLessons}:</span>
                    <span className="ml-2 text-slate-800 font-semibold truncate">{lessonTitle}</span>
                </div>
            </div>
            <button
                onClick={() => onIndexChange(Math.min(totalLessons - 1, currentLessonIndex + 1))}
                disabled={currentLessonIndex >= totalLessons - 1}
                className={buttonClasses}
                aria-label="Next lesson"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
};
