import React from 'react';
import { Button, MarkdownContent } from '../../../components/ui';
import { Sparkles, Rocket } from '../../../components/icons';
import type { IndustryTrend } from '../../../types';
import { TrendChart } from './TrendChart';
import { SkeletonBar } from '../../../components/skeletons';

interface TopicDetailViewProps {
  trend: IndustryTrend | null;
  onGenerate: (topic: string, type: 'course' | 'project') => void;
  color: string;
  isLoading?: boolean;
}

const DetailBodySkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <SkeletonBar width="100%" height="1rem" />
        <SkeletonBar width="100%" height="1rem" />
        <SkeletonBar width="70%" height="1rem" />
        <SkeletonBar width="100%" height="1rem" className="mt-4" />
        <SkeletonBar width="80%" height="1rem" />
        <SkeletonBar width="95%" height="1rem" className="mt-4" />
        <SkeletonBar width="60%" height="1rem" />
    </div>
);


export const TopicDetailView: React.FC<TopicDetailViewProps> = ({ trend, onGenerate, color, isLoading }) => {
  if (!trend) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex items-center justify-center text-slate-500 sticky top-24">
        Select a topic to see the details.
      </div>
    );
  }

  return (
    <div className="bg-white pt-6 pl-6 pr-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full sticky top-24">
      {/* Header section */}
      <div className="flex justify-between items-start mb-4">
          <div className="pr-4 flex-grow">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{trend.topic}</h2>
              <p className="text-sm text-slate-600">{trend.description}</p>
          </div>
          <div className="flex-shrink-0 w-48">
              <TrendChart data={trend.trendData} size="large" />
          </div>
      </div>

      {/* Body section */}
      <div className="overflow-y-auto flex-grow my-6 border-t border-slate-200 pt-6 text-slate-600">
        {isLoading ? (
          <DetailBodySkeleton />
        ) : (
          <>
            <MarkdownContent content={trend.detailedDescription} />
            {trend.sources && trend.sources.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-slate-800 mb-2 border-t border-slate-200 pt-4">Sources</h3>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm">
                  {trend.sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-primary-text hover:underline break-words">
                        {source.web.title || source.web.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer section */}
      <div className="flex-shrink-0 flex justify-end gap-4 w-full sticky bottom-[40px] bg-white py-4 border-t border-slate-200">
        <Button variant="secondary" icon={Sparkles} onClick={() => onGenerate(trend.topic, 'course')}>
          Generate Course
        </Button>
        <Button variant="primary" icon={Rocket} onClick={() => onGenerate(trend.topic, 'project')}>
          Generate Project
        </Button>
      </div>
    </div>
  );
};