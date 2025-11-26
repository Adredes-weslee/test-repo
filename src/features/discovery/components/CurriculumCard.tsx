import React from 'react';
import { Lesson } from '../../../components/icons/index';
import { getDifficultyClasses, isDifficultyTag } from '../../../utils';
import { CardWrapper } from '../../../components/ui';
import type { Curriculum } from '../../../types';

export const CurriculumCard: React.FC<{
  title: string;
  description: string;
  tags: string[];
  content: Curriculum['content'];
  recommended?: boolean;
  active?: boolean;
  onClick?: () => void;
}> = ({ title, description, tags, content, recommended, active, onClick }) => {
  const difficultyTag = tags.find(isDifficultyTag);
  const otherTags = tags.filter(tag => !isDifficultyTag(tag));
  const sortedTags = difficultyTag ? [difficultyTag, ...otherTags] : tags;

  return (
    <CardWrapper onClick={onClick} isActive={active}>
      <div className="flex flex-col h-full text-left">
        <div className="flex justify-between items-start mb-3">
          <h4 className={`font-bold text-slate-800 pr-4 transition-colors ${active ? 'text-primary' : ''}`}>{title}</h4>
          {recommended && <span className="flex-shrink-0 text-xs font-semibold bg-primary-lighter text-primary-text px-2 py-1 rounded-full">Recommended</span>}
        </div>
        <p className="text-sm text-slate-600 mb-4 flex-grow">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {sortedTags.map(tag => <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-md ${isDifficultyTag(tag) ? getDifficultyClasses(tag) : 'bg-slate-100 text-slate-600'}`}>{tag}</span>)}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto pt-4 border-t border-slate-200 group-hover:border-primary-medium/30">
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Lesson className="w-4 h-4 text-primary-focus" />
              <span>{content.lessons.length} Lessons</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};