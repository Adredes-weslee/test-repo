import React from 'react';
import { SkeletonBar } from '../../../components/skeletons';

const TopicListItemSkeleton = () => (
    <div className="bg-white p-4 rounded-lg border-2 border-slate-200 w-full animate-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <SkeletonBar width="12rem" height="1.25rem" />
                <SkeletonBar width="8rem" height="1rem" />
            </div>
            <SkeletonBar width="6rem" height="2rem" />
        </div>
        <SkeletonBar width="95%" height="1rem" className="mt-3" />
        <SkeletonBar width="80%" height="1rem" className="mt-1" />
    </div>
);

const TopicDetailViewSkeleton = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full animate-pulse sticky top-24">
        <div className="flex justify-between items-start">
            <div className="w-2/3 space-y-2">
                <SkeletonBar width="80%" height="1.75rem" />
                <SkeletonBar width="60%" height="1rem" />
            </div>
            <SkeletonBar width="8rem" height="3rem" />
        </div>
        <SkeletonBar width="100%" height="1rem" className="mt-4" />
        <SkeletonBar width="90%" height="1rem" className="mt-1" />

        <div className="my-4 border-t border-b border-slate-200 py-4 -mx-6 px-6 space-y-3">
             <SkeletonBar width="100%" height="1rem" />
             <SkeletonBar width="100%" height="1rem" />
             <SkeletonBar width="70%" height="1rem" />
             <SkeletonBar width="100%" height="1rem" className="mt-4" />
             <SkeletonBar width="80%" height="1rem" />
        </div>
        <div className="flex justify-end gap-4 mt-auto pt-4">
            <SkeletonBar width="8rem" height="2.5rem" />
            <SkeletonBar width="8rem" height="2.5rem" />
        </div>
    </div>
);

export const TrendingSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-slate-800"><SkeletonBar width="8rem" height="1.5rem" /></h3>
            <TopicListItemSkeleton />
            <TopicListItemSkeleton />
            <TopicListItemSkeleton />
        </div>
        <div className="lg:col-span-2">
            <TopicDetailViewSkeleton />
        </div>
    </div>
);
