
import React from 'react';

export const SlideSkeleton: React.FC = () => {
    return (
        <div className="w-full h-full bg-white relative overflow-hidden flex flex-col p-8 animate-pulse">
            {/* Header / Title area */}
            <div className="w-2/3 h-10 bg-slate-200 rounded mb-8"></div>
            
            {/* Bullets / Content area */}
            <div className="space-y-4 flex-grow">
                <div className="flex items-start gap-4">
                    <div className="w-3 h-3 mt-1.5 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div className="w-full h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-3 h-3 mt-1.5 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-3 h-3 mt-1.5 rounded-full bg-slate-200 flex-shrink-0"></div>
                    <div className="w-5/6 h-4 bg-slate-200 rounded"></div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-6 right-8 w-8 h-4 bg-slate-200 rounded"></div>
        </div>
    );
};