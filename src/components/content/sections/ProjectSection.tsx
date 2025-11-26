import React from 'react';
import { Rocket as Project } from '../../icons';
import { MarkdownContent, RegenerateButton, Textarea } from '../../ui';
import type { LessonPlan, RegenerationPart } from '../../../types';

interface ProjectSectionProps {
    project: LessonPlan['project'];
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    isRegenerating?: boolean;
    openPopoverPartId?: string | null;
    isEditing: boolean;
    editedProject: LessonPlan['project'];
    onEditChange: (newProject: LessonPlan['project']) => void;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ project, onRegenerate, isRegenerating, openPopoverPartId, isEditing, editedProject, onEditChange }) => {
    const regenButtonRef = React.useRef<HTMLButtonElement>(null);

    const handleProjectChange = (field: keyof LessonPlan['project'], value: string) => {
        onEditChange({ ...(editedProject || { description: '', objective: '', deliverables: [] }), [field]: value });
    };
    
    const handleProjectDeliverablesChange = (value: string) => {
        onEditChange({ ...(editedProject || { description: '', objective: '', deliverables: [] }), deliverables: value.split('\n') });
    };

    if ((!project || !project.description) && !isEditing) {
        return null;
    }

    const simpleTitle = (
        <div className="flex items-center space-x-3">
            <Project className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">Project</span>
        </div>
    );

    const handleRegenerateClick = () => {
        onRegenerate?.({ type: 'project' }, regenButtonRef);
    };

    const partId = 'project';
    const isPopoverOpen = openPopoverPartId === partId;

    return (
        <div id="lesson-project" className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative group scroll-mt-8">
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10"></div>}
            <div className="flex justify-between items-center mb-4">
                {simpleTitle}
                {!isEditing && onRegenerate && (
                    <div className={`transition-opacity ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <RegenerateButton 
                            ref={regenButtonRef} 
                            onClick={handleRegenerateClick} 
                            isPopoverOpen={isPopoverOpen}
                        />
                    </div>
                )}
            </div>
            
            {isEditing ? (
                 <div className="space-y-3">
                    <Textarea value={editedProject?.description || ''} onChange={e => handleProjectChange('description', e.target.value)} rows={3} placeholder="Project description..." />
                    <Textarea value={editedProject?.objective || ''} onChange={e => handleProjectChange('objective', e.target.value)} rows={2} placeholder="Project objective..." />
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Deliverables (one per line)</label>
                        <Textarea value={editedProject?.deliverables?.join('\n') || ''} onChange={e => handleProjectDeliverablesChange(e.target.value)} rows={3} placeholder="A deployed web app..." />
                    </div>
                </div>
            ) : (
                <div className="space-y-4 text-sm">
                    <div>
                        <p className="font-semibold text-lg text-slate-800 mb-1">Description</p>
                        <div className="text-slate-700">
                            <MarkdownContent content={project.description} />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-slate-800 mb-1">Objective</p>
                        <div className="text-slate-700">
                            <MarkdownContent content={project.objective} />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-slate-800 mb-1">Deliverables</p>
                        <ul className="list-disc list-outside ml-5 space-y-1 text-slate-700">
                            {project.deliverables.map((d, i) => (
                                <li key={i}>
                                    <MarkdownContent content={d} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};