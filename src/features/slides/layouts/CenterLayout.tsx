
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const CenterLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);
    
    return (
        <div className={`w-full h-full bg-slate-900 relative overflow-hidden flex flex-col justify-center items-center text-center ${classes.padding} text-white`}>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-10 skew-x-12 translate-x-20"></div>
            <div className="z-10 max-w-4xl">
                <h3 className={`${classes.title.replace('text-slate-900', '')} font-bold leading-tight`}>{slide.title}</h3>
                <div className={`space-y-4 ${classes.body} text-slate-300`}>
                    {slide.bullets.map((b, i) => <p key={i}>{b}</p>)}
                </div>
            </div>
            <div className={`absolute bottom-6 right-8 ${classes.footer} text-slate-400`}>
                {index + 1} / {total}
            </div>
        </div>
    );
};
