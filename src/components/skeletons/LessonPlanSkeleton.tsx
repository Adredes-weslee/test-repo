import React from 'react';
import { Goal, Exercise, Quiz, Sparkles, Eye, PenTool, Briefcase, Thinking, File } from '../icons';
import { LessonStructureNav } from '../content/LessonStructureNav';

const SkeletonBar: React.FC<{ width?: string; height?: string; className?: string }> = ({ width = '100%', height = '1rem', className = '' }) => (
    <div className={`bg-slate-200 rounded animate-pulse ${className}`} style={{ width, height }}></div>
);

const SkeletonSection: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-semibold text-slate-700">{title}</span>
            </div>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

interface LessonContentSkeletonProps {
}

export const LessonPlanSkeleton: React.FC<LessonContentSkeletonProps> = () => {
    const standardContent = (
        <div className={`flex flex-col md:flex-row gap-8 items-start`}>
            <LessonStructureNav lessonPlan={null} />
            <div className={`flex-1 w-full min-w-0 space-y-6`}>
                
                {/* 1. Overview */}
                <SkeletonSection icon={File} title="1. Overview">
                    <SkeletonBar />
                    <SkeletonBar />
                    <SkeletonBar width="80%" />
                </SkeletonSection>

                {/* 2. Learning Objectives */}
                <SkeletonSection icon={Goal} title="2. Learning Objectives">
                    <SkeletonBar width="90%" />
                    <SkeletonBar width="85%" />
                    <SkeletonBar width="80%" />
                </SkeletonSection>

                {/* 3. Activation */}
                <SkeletonSection icon={Sparkles} title="3. Activation">
                    <SkeletonBar />
                    <SkeletonBar width="95%" />
                </SkeletonSection>

                {/* 4. Demonstration */}
                <SkeletonSection icon={Eye} title="4. Demonstration">
                    <SkeletonBar />
                    <SkeletonBar />
                    <SkeletonBar width="90%" />
                    <SkeletonBar height="4rem" width="100%" className="my-2" />
                    <SkeletonBar width="80%" />
                </SkeletonSection>

                {/* 5. Application */}
                <SkeletonSection icon={PenTool} title="5. Application (Core Activity)">
                    <SkeletonBar />
                    <SkeletonBar width="95%" />
                    <SkeletonBar width="90%" />
                </SkeletonSection>

                {/* 6. Integration */}
                <SkeletonSection icon={Briefcase} title="6. Integration (Transfer)">
                    <SkeletonBar />
                    <SkeletonBar width="85%" />
                </SkeletonSection>

                {/* 7. Feedback & Reflection */}
                <SkeletonSection icon={Thinking} title="7. Feedback & Reflection">
                    <SkeletonBar />
                    <SkeletonBar width="90%" />
                </SkeletonSection>

                {/* 8. Exercises */}
                <SkeletonSection icon={Exercise} title="8. Exercises">
                    <div className="space-y-4">
                        <div>
                            <SkeletonBar height="1.25rem" width="30%" className="mb-2" />
                            <SkeletonBar />
                            <SkeletonBar width="90%" />
                        </div>
                        <div>
                            <SkeletonBar height="1.25rem" width="30%" className="mb-2" />
                            <SkeletonBar />
                            <SkeletonBar width="90%" />
                        </div>
                    </div>
                </SkeletonSection>

                {/* 9. Quiz */}
                <SkeletonSection icon={Quiz} title="9. Quiz">
                    <div className="space-y-4">
                        <div>
                            <SkeletonBar height="1.25rem" width="40%" className="mb-2" />
                            <SkeletonBar width="60%" className="mb-1" />
                            <SkeletonBar width="60%" className="mb-1" />
                            <SkeletonBar width="60%" className="mb-1" />
                        </div>
                    </div>
                </SkeletonSection>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {standardContent}
        </div>
    );
};