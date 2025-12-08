
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const QuizLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);
    const optionCount = slide.bullets.length;
    const useGrid = optionCount > 2;

    return (
        <div className={`w-full h-full bg-slate-50 relative overflow-hidden flex flex-col ${classes.padding}`}>
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-100/50 rounded-bl-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100/50 rounded-tr-full -ml-16 -mb-16"></div>
            
            {/* Header Badge */}
            <div className="absolute top-2 right-4 flex items-center gap-2">
                <span className={`bg-primary/10 text-primary font-bold uppercase tracking-wider rounded-full ${classes.isPrint ? 'px-6 py-2 text-xl' : 'px-3 py-1 text-xs'}`}>
                    Quiz Question
                </span>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center z-10 w-full max-w-6xl mx-auto">
                {/* Question */}
                <h3 className={`${classes.title} font-bold text-slate-800 text-center mb-8 w-full`}>
                    {slide.title}
                </h3>
                
                {/* Options */}
                <div className={`grid ${useGrid ? 'grid-cols-2' : 'grid-cols-1'} gap-6 w-full`}>
                    {slide.bullets.map((option, i) => (
                        <div 
                            key={i} 
                            className={`bg-white rounded-xl border-2 border-slate-200 flex items-center shadow-sm transition-shadow ${classes.isPrint ? 'p-8 gap-8 border-4' : 'p-4 gap-4'}`}
                        >
                            <div className={`
                                flex-shrink-0 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center border-2 border-slate-300
                                ${classes.isPrint ? 'w-16 h-16 text-3xl border-4' : 'w-10 h-10 text-lg'}
                            `}>
                                {String.fromCharCode(65 + i)}
                            </div>
                            <p className={`${classes.body} text-slate-700 font-medium text-left leading-snug`}>
                                {option}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={`absolute bottom-6 right-8 ${classes.footer} text-slate-400`}>
                {index + 1} / {total}
            </div>
        </div>
    );
};
