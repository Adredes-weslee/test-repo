import React from 'react';
import type { IndustryTrend } from '../../../types';
import { TrendChart } from './TrendChart';

interface TopicListItemProps {
  trend: IndustryTrend;
  isActive: boolean;
  onSelect: () => void;
  color: string;
}

export const TopicListItem: React.FC<TopicListItemProps> = ({ trend, isActive, onSelect, color }) => {
  const activeClasses = 'bg-primary-lightest border-primary-medium shadow-md';
  const inactiveClasses = 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
    >
      <div className="flex justify-between items-start">
        <h3 className={`font-bold pr-4 ${isActive ? 'text-primary' : 'text-slate-800'}`}>{trend.topic}</h3>
        <TrendChart data={trend.trendData} className="w-24 h-8 flex-shrink-0" />
      </div>
      <p className="text-sm text-slate-600 mt-2">{trend.description}</p>
    </button>
  );
};
