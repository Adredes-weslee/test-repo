import React from 'react';
import { Button, MarkdownContent } from '../../../components/ui';
import { X, Sparkles, Rocket } from '../../../components/icons';
import type { IndustryTrend } from '../../../types';

interface TrendingTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  trend: IndustryTrend | null;
  onGenerate: (topic: string, type: 'course' | 'project') => void;
}

export const TrendingTopicModal: React.FC<TrendingTopicModalProps> = ({ 
  isOpen, 
  onClose, 
  trend, 
  onGenerate,
}) => {
  if (!isOpen || !trend) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2 pr-8">{trend.topic}</h2>
        <p className="text-sm text-slate-600 mb-6 pr-8">{trend.description}</p>

        <div className="overflow-y-auto pr-2 flex-grow my-6 border-t border-slate-200 pt-6">
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
        </div>

        <div className="flex-shrink-0 flex justify-end gap-4 mt-auto pt-6 border-t border-slate-200">
            <Button variant="secondary" icon={Sparkles} onClick={() => onGenerate(trend.topic, 'course')}>
                Generate Course
            </Button>
            <Button variant="primary" icon={Rocket} onClick={() => onGenerate(trend.topic, 'project')}>
                Generate Project
            </Button>
        </div>
      </div>
    </div>
  );
};