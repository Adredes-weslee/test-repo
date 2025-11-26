import React from 'react';
import { CardWrapper, Button } from '../../../components/ui';
import type { IndustryTrend } from '../../../types';

interface TrendingTopicCardProps {
  trend: IndustryTrend;
  onClick: () => void;
  color: string;
}

export const TrendingTopicCard: React.FC<TrendingTopicCardProps> = ({ trend, onClick, color }) => {
  return (
    <CardWrapper 
      className="!p-0 flex flex-col h-full group" // Remove padding, group for hover
      isActive={false} 
      onClick={onClick}
    >
      <div 
        className="w-full h-1.5 rounded-t-lg"
        style={{ backgroundColor: color }}
      />
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 pr-4 group-hover:text-primary transition-colors">{trend.topic}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 flex-grow">{trend.description}</p>
        <div className="mt-auto pt-4 border-t border-slate-200">
          <Button 
            variant="secondary" 
            size="small" 
            className="w-full !py-2 group-hover:bg-primary-lightest group-hover:border-primary-medium group-hover:text-primary-text transition-colors"
          >
            View Details
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};