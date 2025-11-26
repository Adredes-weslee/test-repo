import React from 'react';
import { SkeletonBar } from './SkeletonBar';

export const ContentItemCardSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 w-full animate-pulse">
        <SkeletonBar width="70%" height="1.25rem" />
        <div className="flex items-center gap-2 mt-2">
            <SkeletonBar width="60px" height="1rem" />
            <SkeletonBar width="50px" height="1rem" />
            <SkeletonBar width="70px" height="1rem" />
        </div>
        <SkeletonBar width="40%" height="0.75rem" className="mt-2" />
    </div>
);