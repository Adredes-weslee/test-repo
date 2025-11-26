
import React, { useState, useEffect, useRef } from 'react';
import { Button, MarkdownContent, Textarea, RegenerateButton, EditModeFooter, IconButton, RegeneratePopover } from '../../../../components/ui';
import { Rocket, Terminal, Goal, Modification, File as FileIcon, SquareCheckBig, Trash, Sparkles } from '../../../../components/icons';
import type { CapstoneProject, DetailedProjectData } from '../../../../types';
import { SkeletonBar } from '../../../../components/skeletons';

interface ConfigurationViewProps {
    activeProject: CapstoneProject | null;
    updateSelectedProject: (project: CapstoneProject) => void;
    onDiscard: () => void;
    handleGoToEnvironment: () => void;
    handleGoToExport: () => void;
    isGenerating: boolean;
    handleRegenerateProjectPart: (part: keyof DetailedProjectData, instructions: string) => void;
    isRegeneratingPart: keyof DetailedProjectData | null;
    capstoneProgress?: number;
    loadingMessage?: string;
    onCancel?: () => void;
}

interface EditableSectionProps {
    id: string;
    title: string;
    icon: React.ElementType;
    content: string;
    isEditing: boolean;
    onContentChange: (value: string) => void;
    rows?: number;
    className?: string;
    isGenerating: boolean;
    isEmpty: boolean;
    part: keyof DetailedProjectData;
    onRegenerateRequest: (part: keyof DetailedProjectData, ref: React.RefObject<HTMLButtonElement>) => void;
    isPopoverOpen: boolean;
    isRegenerating: boolean;
}

const EditableSection: React.FC<EditableSectionProps> = ({ 
    id, title, icon: Icon, content, isEditing, onContentChange, rows = 5, className = '', isGenerating, isEmpty,
    part, onRegenerateRequest, isPopoverOpen, isRegenerating
}) => {
    const regenButtonRef = useRef<HTMLButtonElement>(null);
    
    const handleRegenClick = () => {
        onRegenerateRequest(part, regenButtonRef);
    }

    return (
        <div id={id} className={`relative group scroll-mt-24 ${className}`}>
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10 -m-2 p-2"></div>}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-slate-700">{title}</span>
                </div>
                 {isEditing ? (
                    <RegenerateButton
                        ref={regenButtonRef}
                        onClick={handleRegenClick}
                        isPopoverOpen={isPopoverOpen}
                    />
                ) : (
                    <div className={`transition-opacity ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                         <RegenerateButton
                            ref={regenButtonRef}
                            onClick={handleRegenClick}
                            isPopoverOpen={isPopoverOpen}
                        />
                    </div>
                )}
            </div>
            {isEditing ? (
                <Textarea
                    value={content}
                    onChange={e => onContentChange(e.target.value)}
                    rows={rows}
                />
            ) : (
                isGenerating && isEmpty ? (
                    <div className="space-y-2 pt-1">
                        <SkeletonBar height="0.875rem" />
                        <SkeletonBar height="0.875rem" width="90%" />
                        <SkeletonBar height="0.875rem" width="80%" />
                    </div>
                ) : (
                    <div className="prose prose-sm max-w-none text-slate-700">
                        <MarkdownContent content={content} />
                    </div>
                )
            )}
        </div>
    );
};

export const ConfigurationView: React.FC<ConfigurationViewProps> = ({ 
    activeProject, updateSelectedProject, onDiscard, handleGoToEnvironment, handleGoToExport, isGenerating,
    handleRegenerateProjectPart, isRegeneratingPart, capstoneProgress, loadingMessage, onCancel
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState<CapstoneProject | null>(activeProject);
    const [regenPopover, setRegenPopover] = useState<{ open: boolean; part: keyof DetailedProjectData | null; ref: React.RefObject<HTMLButtonElement> | null }>({ open: false, part: null, ref: null });

    useEffect(() => {
        setEditedProject(activeProject);
    }, [activeProject]);

    if (!activeProject || !editedProject) {
        return (
            <div className="text-center p-8">
                <p>No project selected. Please go back and select a project.</p>
                <Button onClick={onDiscard} className="mt-4">Start Over</Button>
            </div>
        );
    }

    const isProgrammingProject = activeProject.techStack && activeProject.techStack.length > 0;

    const openRegenPopover = (part: keyof DetailedProjectData, ref: React.RefObject<HTMLButtonElement>) => {
        setRegenPopover({ open: true, part, ref });
    };

    const handleRegenerate = (instructions: string) => {
        if (regenPopover.part) {
            handleRegenerateProjectPart(regenPopover.part, instructions);
            setRegenPopover({ open: false, part: null, ref: null });
        }
    };

    const handleSave = () => {
        updateSelectedProject(editedProject);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProject(activeProject);
        setIsEditing(false);
    };

    const handleFieldChange = (field: keyof CapstoneProject, value: string | string[]) => {
        setEditedProject(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleListFieldChange = (field: 'techStack' | 'projectRequirements' | 'deliverables' | 'learningOutcomes', value: string) => {
        handleFieldChange(field, value.split('\n').filter(line => line.trim() !== ''));
    };

    const isGenerateButtonDisabled = isGenerating || !activeProject.detailedDescription;

    return (
        <div className="animate-fadeIn relative bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            {isGenerating && capstoneProgress !== undefined && (
                <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 flex-shrink min-w-0">
                            <Sparkles className="w-5 h-5 text-primary animate-pulse flex-shrink-0" />
                            <span className="font-semibold text-slate-700 flex-shrink-0">Generating:</span>
                            <span className="truncate" title={loadingMessage}>{loadingMessage}</span>
                        </div>
                        <div className="w-full max-w-xs flex items-center gap-3">
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${capstoneProgress}%` }}
                                ></div>
                            </div>
                            {onCancel && (
                                <Button variant="danger-secondary" size="xs" onClick={onCancel}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                <div>
                    <p className="text-sm font-semibold text-slate-400">Project</p>
                    <h1 className="text-3xl font-semibold text-slate-800">{editedProject.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    {!isEditing && (
                        <>
                            <IconButton 
                                icon={Trash} 
                                tooltipText="Start Over"
                                onClick={onDiscard}
                                className="text-red-400 hover:text-red-600"
                            />
                            <IconButton 
                                icon={Modification} 
                                tooltipText="Edit Project Details"
                                onClick={() => setIsEditing(true)}
                                disabled={isGenerateButtonDisabled}
                            />
                            {isProgrammingProject ? (
                                <Button onClick={handleGoToEnvironment} icon={Rocket} disabled={isGenerateButtonDisabled}>
                                    Generate Environment
                                </Button>
                            ) : (
                                <Button onClick={handleGoToExport} icon={Rocket} disabled={isGenerateButtonDisabled}>
                                    Finalize & Export
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="w-full space-y-6">
                <EditableSection
                    id="project-description"
                    title="Description"
                    icon={FileIcon}
                    content={isEditing ? editedProject.detailedDescription : activeProject.detailedDescription}
                    isEditing={isEditing}
                    onContentChange={(value) => handleFieldChange('detailedDescription', value)}
                    rows={8}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.detailedDescription}
                    part="detailedDescription"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'detailedDescription'}
                    isRegenerating={isRegeneratingPart === 'detailedDescription'}
                />
                {isProgrammingProject && (
                    <>
                        <hr />
                        <EditableSection
                            id="project-tech-stack"
                            title="Tech Stack"
                            icon={Terminal}
                            content={isEditing ? editedProject.techStack.join('\n') : activeProject.techStack.map(t => `* ${t}`).join('\n')}
                            isEditing={isEditing}
                            onContentChange={(value) => handleListFieldChange('techStack', value)}
                            isGenerating={isGenerating}
                            isEmpty={activeProject.techStack.length === 0}
                            part="techStack"
                            onRegenerateRequest={openRegenPopover}
                            isPopoverOpen={regenPopover.open && regenPopover.part === 'techStack'}
                            isRegenerating={isRegeneratingPart === 'techStack'}
                        />
                    </>
                )}
                <hr />
                <EditableSection
                    id="project-learning-outcomes"
                    title="Learning Outcomes"
                    icon={Goal}
                    content={isEditing ? editedProject.learningOutcomes.join('\n') : activeProject.learningOutcomes.map(r => `* ${r}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('learningOutcomes', value)}
                    isGenerating={isGenerating}
                    isEmpty={activeProject.learningOutcomes.length === 0}
                    part="learningOutcomes"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'learningOutcomes'}
                    isRegenerating={isRegeneratingPart === 'learningOutcomes'}
                />
                <hr />
                <EditableSection
                    id="project-requirements"
                    title="Project Requirements"
                    icon={SquareCheckBig}
                    content={isEditing ? editedProject.projectRequirements.join('\n') : activeProject.projectRequirements.map(d => `* ${d}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('projectRequirements', value)}
                    isGenerating={isGenerating}
                    isEmpty={activeProject.projectRequirements.length === 0}
                    part="projectRequirements"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'projectRequirements'}
                    isRegenerating={isRegeneratingPart === 'projectRequirements'}
                />
                <hr />
                <EditableSection
                    id="project-deliverables"
                    title="Deliverables"
                    icon={Rocket}
                    content={isEditing ? editedProject.deliverables.join('\n') : activeProject.deliverables.map(d => `* ${d}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('deliverables', value)}
                    className="pb-10"
                    isGenerating={isGenerating}
                    isEmpty={activeProject.deliverables.length === 0}
                    part="deliverables"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'deliverables'}
                    isRegenerating={isRegeneratingPart === 'deliverables'}
                />
            </div>
            
            <RegeneratePopover
                isOpen={regenPopover.open}
                onClose={() => setRegenPopover({ open: false, part: null, ref: null })}
                triggerRef={regenPopover.ref!}
                onRegenerate={handleRegenerate}
                isLoading={!!isRegeneratingPart}
            />

            {isEditing && <EditModeFooter onSave={handleSave} onCancel={handleCancel} />}
        </div>
    );
};
