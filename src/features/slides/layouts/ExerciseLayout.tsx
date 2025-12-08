
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const ExerciseLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);

    return (
        <div className={`w-full h-full bg-slate-50 relative overflow-hidden flex flex-col ${classes.padding}`}>
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100/50 rounded-bl-full -mr-24 -mt-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-100/50 rounded-tr-full -ml-16 -mb-16"></div>
            
            {/* Header Badge */}
            <div className="absolute top-2 right-4 flex items-center gap-2 z-10">
                <span className={`bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider rounded-full border border-emerald-200 ${classes.isPrint ? 'px-6 py-2 text-xl' : 'px-3 py-1 text-xs'}`}>
                    Practical Exercise
                </span>
            </div>

            <div className="flex-grow flex flex-col justify-center z-10 w-full max-w-5xl mx-auto">
                {/* Title */}
                <h3 className={`${classes.title} font-bold text-slate-800 mb-6 border-l-4 border-emerald-500 pl-6`}>
                    {slide.title}
                </h3>
                
                {/* Problem Statement Card */}
                <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${classes.isPrint ? 'p-12 border-2' : 'p-8'}`}>
                    <div className={classes.bulletSpacing}>
                        {slide.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className={`rounded-full bg-emerald-500 flex-shrink-0 ${classes.bulletIcon}`} />
                                <p className={`${classes.body} text-slate-700 font-medium`}>{bullet}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`absolute bottom-6 right-8 ${classes.footer} text-slate-400`}>
                {index + 1} / {total}
            </div>
        </div>
    );
};
