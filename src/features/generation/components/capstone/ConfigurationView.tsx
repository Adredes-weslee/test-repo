import React, { useState, useEffect, useRef } from 'react';
import { Button, MarkdownContent, Textarea, RegenerateButton, EditModeFooter, IconButton, RegeneratePopover, AndragogyBadge, Collapsible } from '../../../../components/ui';
import type { Badge } from '../../../../components/ui/AndragogyBadge';
import { Rocket, Terminal, Goal, Modification, File as FileIcon, SquareCheckBig, Trash, Sparkles, Thinking, Check, Eye, Lock, Target } from '../../../../components/icons';
import type { CapstoneProject, DetailedProjectData, AndragogicalAnalysis } from '../../../../types';
import { SkeletonBar } from '../../../../components/skeletons';
import { AndragogyInfo } from '../../../../components/content/AndragogyInfo';

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
    andragogyAnalysis: AndragogicalAnalysis | null;
    isAnalyzingAndragogy: boolean;
    onResume?: () => void;
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
    badges?: Badge[];
}

const EditableSection: React.FC<EditableSectionProps> = ({ 
    id, title, icon: Icon, content, isEditing, onContentChange, rows = 5, className = '', isGenerating, isEmpty,
    part, onRegenerateRequest, isPopoverOpen, isRegenerating, badges
}) => {
    const regenButtonRef = useRef<HTMLButtonElement>(null);
    
    const handleRegenClick = () => {
        onRegenerateRequest(part, regenButtonRef);
    }

    return (
        <div id={id} className={`relative group scroll-mt-24 ${className}`}>
            {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10 -m-2 p-2"></div>}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-slate-700">{title}</span>
                    </div>
                    {badges && badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 ml-8">
                            {badges.map((b, i) => <AndragogyBadge key={i} badge={b} />)}
                        </div>
                    )}
                </div>
                 {isEditing ? (
                    <RegenerateButton
                        ref={regenButtonRef}
                        onClick={handleRegenClick}
                        isPopoverOpen={isPopoverOpen}
                        className="self-end sm:self-auto"
                    />
                ) : (
                    <div className={`transition-opacity self-end sm:self-auto ${isPopoverOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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
    handleRegenerateProjectPart, isRegeneratingPart, capstoneProgress, loadingMessage, onCancel,
    andragogyAnalysis, isAnalyzingAndragogy, onResume
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

    const handleListFieldChange = (field: keyof DetailedProjectData, value: string) => {
        // Only split if the field is an array type in the project object
        if (Array.isArray(editedProject?.[field])) {
             handleFieldChange(field as keyof CapstoneProject, value.split('\n').filter(line => line.trim() !== ''));
        } else {
             handleFieldChange(field as keyof CapstoneProject, value);
        }
    };

    const isIncomplete = !isGenerating && (
        !activeProject.detailedDescription || 
        activeProject.learningOutcomes.length === 0 || 
        activeProject.projectRequirements.length === 0 || 
        activeProject.deliverables.length === 0 ||
        (isProgrammingProject && activeProject.techStack.length === 0)
    );

    const isGenerateButtonDisabled = isGenerating || isIncomplete;

    return (
        <div className="animate-fadeIn relative bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            {isIncomplete && onResume && (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-2 text-sm text-orange-700">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Generation Paused.</span>
                        <span>Some sections are incomplete. Resume to finish.</span>
                    </div>
                    <Button onClick={onResume} icon={Rocket} size="small" className="w-full sm:w-auto">
                        Resume Generation
                    </Button>
                </div>
            )}

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
                                disabled={isGenerating}
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
                <Collapsible
                    title={<div className="flex items-center gap-2 font-semibold text-slate-700"><Target className="w-5 h-5 text-primary" />Andragogical Analysis</div>}
                    containerClassName="border rounded-lg border-slate-200 bg-slate-50/50"
                    headerClassName="w-full flex justify-between items-center p-4 text-left hover:bg-slate-100/70 transition-colors"
                    defaultOpen={false}
                >
                    <AndragogyInfo analysis={andragogyAnalysis} isLoading={isAnalyzingAndragogy} />
                </Collapsible>

                <EditableSection
                    id="project-description"
                    title="1. Project Brief (Authentic Challenge)"
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
                    badges={[
                        { label: 'Authentic', type: '6 PoLD' },
                        { label: 'Problem-centered', type: 'Merrill' }
                    ]}
                />
                
                <hr />
                <EditableSection
                    id="project-learning-outcomes"
                    title="2. Learning Outcomes"
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
                    badges={[
                        { label: 'Alignment', type: '6 PoLD' },
                        { label: 'ZPD', type: 'Vygotsky' }
                    ]}
                />

                {isProgrammingProject && (
                    <>
                        <hr />
                        <EditableSection
                            id="project-tech-stack"
                            title="3. Tech Stack"
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
                            badges={[
                                { label: 'Materially Mediated', type: 'Boud' },
                                { label: 'Activation', type: 'Merrill' }
                            ]}
                        />
                    </>
                )}

                <hr />
                <EditableSection
                    id="project-requirements"
                    title="4. Project Requirements"
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
                    badges={[
                        { label: 'Authentic', type: '6 PoLD' },
                        { label: 'Scaffolding', type: 'Vygotsky' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-deliverables"
                    title="5. Required Deliverables"
                    icon={Rocket}
                    content={isEditing ? editedProject.deliverables.join('\n') : activeProject.deliverables.map(d => `* ${d}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('deliverables', value)}
                    isGenerating={isGenerating}
                    isEmpty={activeProject.deliverables.length === 0}
                    part="deliverables"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'deliverables'}
                    isRegenerating={isRegeneratingPart === 'deliverables'}
                    badges={[
                        { label: 'Alignment', type: '6 PoLD' },
                        { label: 'Emergent', type: 'Boud' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-evidence"
                    title="6. Evidence of Learning"
                    icon={Check}
                    content={isEditing ? (editedProject.evidenceOfLearning || []).join('\n') : (activeProject.evidenceOfLearning || []).map(r => `* ${r}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('evidenceOfLearning', value)}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.evidenceOfLearning || activeProject.evidenceOfLearning.length === 0}
                    part="evidenceOfLearning"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'evidenceOfLearning'}
                    isRegenerating={isRegeneratingPart === 'evidenceOfLearning'}
                    badges={[
                        { label: 'Assessment as Evidence', type: 'Billett' },
                        { label: 'Holistic', type: '6 PoLD' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-constraints"
                    title="7. Constraints"
                    icon={Lock}
                    content={isEditing ? (editedProject.constraints || []).join('\n') : (activeProject.constraints || []).map(t => `* ${t}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('constraints', value)}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.constraints || activeProject.constraints.length === 0}
                    part="constraints"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'constraints'}
                    isRegenerating={isRegeneratingPart === 'constraints'}
                    badges={[
                        { label: 'Situated', type: 'Boud' },
                        { label: 'Affordances', type: 'Billett' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-judgement"
                    title="8. Judgement Criteria"
                    icon={Eye}
                    content={isEditing ? (editedProject.judgementCriteria || []).join('\n') : (activeProject.judgementCriteria || []).map(r => `* ${r}`).join('\n')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleListFieldChange('judgementCriteria', value)}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.judgementCriteria || activeProject.judgementCriteria.length === 0}
                    part="judgementCriteria"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'judgementCriteria'}
                    isRegenerating={isRegeneratingPart === 'judgementCriteria'}
                    badges={[
                        { label: 'Judgement', type: '6 PoLD' },
                        { label: 'Evaluate', type: 'Bloom' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-assessment"
                    title="9. Assessment & Feedback"
                    icon={Thinking}
                    content={isEditing ? (editedProject.assessmentFeedback || '') : (activeProject.assessmentFeedback || '')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleFieldChange('assessmentFeedback', value)}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.assessmentFeedback}
                    part="assessmentFeedback"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'assessmentFeedback'}
                    isRegenerating={isRegeneratingPart === 'assessmentFeedback'}
                    badges={[
                        { label: 'Feedback', type: '6 PoLD' },
                        { label: 'Social', type: 'Vygotsky' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-participation"
                    title="10. Participation Model (Billett)"
                    icon={Goal}
                    content={isEditing ? (editedProject.participationModel || '') : (activeProject.participationModel || '')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleFieldChange('participationModel', value)}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.participationModel}
                    part="participationModel"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'participationModel'}
                    isRegenerating={isRegeneratingPart === 'participationModel'}
                    badges={[
                        { label: 'Guided Participation', type: 'Billett' },
                        { label: 'MKO', type: 'Vygotsky' }
                    ]}
                />

                <hr />
                <EditableSection
                    id="project-future-oriented"
                    title="11. Future-Oriented Element"
                    icon={Sparkles}
                    content={isEditing ? (editedProject.futureOrientedElement || '') : (activeProject.futureOrientedElement || '')}
                    isEditing={isEditing}
                    onContentChange={(value) => handleFieldChange('futureOrientedElement', value)}
                    isGenerating={isGenerating}
                    isEmpty={!activeProject.futureOrientedElement}
                    part="futureOrientedElement"
                    onRegenerateRequest={openRegenPopover}
                    isPopoverOpen={regenPopover.open && regenPopover.part === 'futureOrientedElement'}
                    isRegenerating={isRegeneratingPart === 'futureOrientedElement'}
                    badges={[
                        { label: 'Future-oriented', type: '6 PoLD' },
                        { label: 'Integration', type: 'Merrill' }
                    ]}
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