
import React from 'react';
import { SlideLayoutProps } from '../types';
import { useSlideStyles } from '../hooks/useSlideStyles';

export const SplitLayout: React.FC<SlideLayoutProps> = ({ slide, index, total, variant }) => {
    const classes = useSlideStyles(slide, variant);
    const mid = Math.ceil(slide.bullets.length / 2);
    const col1 = slide.bullets.slice(0, mid);
    const col2 = slide.bullets.slice(mid);

    return (
        <div className={`w-full h-full bg-white relative overflow-hidden flex flex-col ${classes.padding}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-lightest rounded-bl-full -mr-16 -mt-16"></div>
            <h3 className={`${classes.title} font-bold text-slate-800 border-b-2 border-primary-light pb-4 w-fit pr-12`}>{slide.title}</h3>
            <div className="flex-grow grid grid-cols-2 gap-12">
                <div className={classes.bulletSpacing}>
                    {col1.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={`rounded-full bg-primary flex-shrink-0 ${classes.bulletIcon}`} />
                            <p className={`${classes.body} text-slate-700`}>{bullet}</p>
                        </div>
                    ))}
                </div>
                <div className={classes.bulletSpacing}>
                    {col2.map((bullet, i) => (
                        <div key={i} className="flex items-start gap-3">
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
