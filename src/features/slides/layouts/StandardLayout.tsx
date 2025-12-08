
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const StandardLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);
    return (
        <div className={`w-full h-full bg-white relative overflow-hidden flex flex-col ${classes.padding}`}>
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-400"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-50 rounded-tl-full -mr-20 -mb-20 z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <h3 className={`${classes.title} font-bold text-slate-900`}>{slide.title}</h3>
                <div className={classes.bulletSpacing}>
                    {slide.bullets.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className={`rounded-full bg-primary flex-shrink-0 ${classes.bulletIcon}`} />
                            <p className={`${classes.body} text-slate-700`}>{bullet}</p>
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
