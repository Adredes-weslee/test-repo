import React from 'react';
import { SkeletonBar } from '../../../components/skeletons';

export const TrendingTopicCardSkeleton: React.FC = () => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 w-full animate-pulse flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <SkeletonBar width="60%" height="1.25rem" />
            <SkeletonBar width="6rem" height="2rem" />
        </div>
        <SkeletonBar width="90%" height="1rem" className="mt-2" />
        <SkeletonBar width="80%" height="1rem" className="mt-1 mb-4" />
        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-200">
            <SkeletonBar width="50%" height="2rem" />
            <SkeletonBar width="50%" height="2rem" />
        </div>
    </div>
);
