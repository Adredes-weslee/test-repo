import React from 'react';
import { Sparkles } from '../icons';

const SkeletonTag: React.FC<{ width: string; delay: string; }> = ({ width, delay }) => (
    <div 
        className="h-8 bg-slate-200 rounded-full animate-fadeIn"
        style={{ width, animationDelay: delay, opacity: 0 }}
    />
);

export const TrendingTopicsLoader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 animate-fadeIn" style={{ opacity: 0 }}>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span>Curating trending topics...</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                <SkeletonTag width="6rem" delay="0.2s" />
                <SkeletonTag width="9rem" delay="0.4s" />
                <SkeletonTag width="7rem" delay="0.6s" />
                <SkeletonTag width="8rem" delay="0.8s" />
            </div>
        </div>
    );
};
