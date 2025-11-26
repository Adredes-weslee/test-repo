

import React from 'react';
import { CardWrapper } from '../../../components/ui';
import { getDifficultyClasses, isDifficultyTag } from '../../../utils';
import type { CapstoneProject } from '../../../types';

interface ProjectCardProps {
    project: CapstoneProject;
    isActive?: boolean;
    onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isActive, onClick }) => {
    const difficultyTag = project.tags.find(isDifficultyTag) || 'Beginner';
    const otherTags = project.tags.filter(t => !isDifficultyTag(t));
    
    return (
        <CardWrapper onClick={onClick} isActive={isActive}>
            <div className="flex flex-col h-full text-left">
                <div className="flex justify-between items-start mb-3">
                    <h4 className={`font-bold text-slate-800 pr-4 transition-colors ${isActive ? 'text-primary' : ''}`}>{project.title}</h4>
                    {project.recommended && <span className="flex-shrink-0 text-xs font-semibold bg-primary-lighter text-primary-text px-2 py-1 rounded-full">Recommended</span>}
                </div>
                <p className="text-sm text-slate-600 mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${getDifficultyClasses(difficultyTag)}`}>{difficultyTag}</span>
                    {otherTags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">{tag}</span>
                    ))}
                </div>
            </div>
        </CardWrapper>
    );
};