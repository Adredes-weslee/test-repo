
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const TitleLayout: React.FC<SlideLayoutProps> = ({ slide, variant }) => {
    const classes = useSlideStyles(slide, variant);
    
    return (
        <div className={`w-full h-full bg-white relative overflow-hidden flex flex-col justify-center items-center text-center ${classes.padding}`}>
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-400"></div>
            
            {/* Abstract Shapes */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-lightest/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="z-10 max-w-5xl flex flex-col items-center">
                <h1 className={`${classes.isPrint ? 'text-7xl' : 'text-5xl'} font-bold text-slate-900 mb-8 tracking-tight leading-tight`}>
                    {slide.title}
                </h1>
                {slide.bullets.length > 0 && (
                    <div className="w-16 h-1.5 bg-primary rounded-full mb-8"></div>
                )}
                {slide.bullets.length > 0 && (
                    <p className={`${classes.isPrint ? 'text-3xl' : 'text-xl'} text-slate-500 font-medium max-w-2xl mx-auto`}>
                        {slide.bullets[0]}
                    </p>
                )}
            </div>
        </div>
    );
};
