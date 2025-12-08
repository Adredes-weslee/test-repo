
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const ImageRightLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);
    
    return (
        <div className={`w-full h-full bg-white relative overflow-hidden flex ${classes.padding}`}>
            {/* Decorative BG for visual consistency with standard layout */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-400"></div>
            <div className="w-full h-full flex flex-col">
            <h3 className={`${classes.title} font-bold text-slate-900`}>{slide.title}</h3>
            <div className="flex">
            <div className="w-1/2 h-full flex flex-col justify-center pr-8 z-10">
                <div className={classes.bulletSpacing}>
                    {slide.bullets.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className={`rounded-full bg-primary flex-shrink-0 ${classes.bulletIcon}`} />
                            <p className={`${classes.body} text-slate-700`}>{bullet}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-1/2 h-full flex items-center justify-center pl-8 z-10">
                <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors group/placeholder cursor-pointer">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover/placeholder:scale-110 transition-transform">
                            {/* Image Icon */}
                            <svg className={`${classes.isPrint ? 'w-16 h-16' : 'w-8 h-8'} text-slate-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className={`${classes.isPrint ? 'text-2xl' : 'text-sm'} font-medium`}>Add Image</span>
                </div>
            </div>
            </div>
            </div>
            <div className={`absolute bottom-6 right-8 ${classes.footer} text-slate-400`}>
                {index + 1} / {total}
            </div>
        </div>
    );
};
