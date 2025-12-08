
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const SidebarLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);
    
    return (
        <div className="w-full h-full bg-white relative overflow-hidden flex">
            <div className={`w-1/3 bg-primary-lightest h-full flex flex-col justify-center ${classes.padding} border-r border-slate-100`}>
                <h3 className={`${classes.title.replace('mb-', 'mb-0')} text-slate-900 font-bold leading-tight`}>{slide.title}</h3>
                <div className="mt-8 w-12 h-1 bg-primary"></div>
            </div>
            <div className={`w-2/3 h-full flex flex-col justify-center ${classes.padding}`}>
                <div className={classes.bulletSpacing}>
                    {slide.bullets.map((bullet, i) => (
                        <div key={i} className={`flex items-start gap-4`}>
                            <div className={`rounded-full bg-primary-light flex-shrink-0 ${classes.bulletIcon}`} />
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
