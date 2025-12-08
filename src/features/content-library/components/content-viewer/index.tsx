
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DeleteConfirmationPopover } from './DeleteConfirmationPopover';
import { RegeneratePopover, LessonNavigator, EditModeFooter } from '../../../../components/ui';
import { Eye } from '../../../../components/icons/index';
import type { ContentItem, RegenerationPart, LessonPlan } from '../../../../types';
import { getRegenerationPartId } from '../../../../types';
import { PreviewHeader, EditableLesson, NotesEditor } from '../../../../components/content';
import { parseLessonPlanMarkdown, lessonPlanToMarkdown } from '../../../../utils';
import { DuplicateAndVaryModal } from './DuplicateAndVaryModal';

interface ContentViewerProps {
    selectedContent: ContentItem | null;
    onDeleteRequest: () => void;
    onRegenerate: (lessonIndex: number, part: RegenerationPart, instructions: string) => void;
    onGenerateNewPart: (lessonIndex: number, partType: 'exercise' | 'quiz') => Promise<any>;
    regeneratingPart: string | null;
    onUpdateNotes: (notes: string) => void;
    onUpdateLessonPlan: (lessonIndex: number, updatedPlan: LessonPlan) => void;
    onUpdateLessonTitle: (lessonIndex: number, newTitle: string) => void;
    onUpdateCurriculumTitle: (newTitle: string) => void;
    lastRegeneratedCurriculumTitle?: { title: string; id: number } | null;
    lastRegeneratedLessonTitle?: { lessonIndex: number; title: string; id: number } | null;
    onDuplicateAndVary: (lessonIndex: number, instructions: string) => Promise<void>;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({ 
    selectedContent, 
    onDeleteRequest, 
    onRegenerate,
    onGenerateNewPart,
    regeneratingPart,
    onUpdateNotes,
    onUpdateLessonPlan,
    onUpdateLessonTitle,
    onUpdateCurriculumTitle,
    lastRegeneratedCurriculumTitle,
    lastRegeneratedLessonTitle,
    onDuplicateAndVary,
}) => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [animationDirection, setAnimationDirection] = useState<'right' | 'left' | null>(null);
    const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
    const deleteButtonRef = useRef<HTMLButtonElement>(null);
    const prevContentIdRef = useRef<number | null>(null);
    const [regenPopover, setRegenPopover] = useState<{ open: boolean; part: RegenerationPart | null; partId: string | null; ref: React.RefObject<HTMLButtonElement> | null }>({ open: false, part: null, partId: null, ref: null });
    const viewerRef = useRef<HTMLDivElement>(null);
    const [duplicateModalState, setDuplicateModalState] = useState({ isOpen: false, lessonIndex: -1 });
    
    // Edit mode state management
    const [isEditing, setIsEditing] = useState(false);
    const [editedCurriculumTitle, setEditedCurriculumTitle] = useState('');
    const [editedLessonTitle, setEditedLessonTitle] = useState('');
    const [editedLessonPlan, setEditedLessonPlan] = useState<LessonPlan | null>(null);
    const [processedRegenIds, setProcessedRegenIds] = useState({ title: -1, curriculumTitle: -1 });

    const currentLesson = selectedContent?.lessons?.[currentLessonIndex];
    const lessonPlan = useMemo(() => currentLesson ? parseLessonPlanMarkdown(currentLesson.content) as LessonPlan : null, [currentLesson]);
    
    // Reset index and edit mode when content item changes
    useEffect(() => {
        if (selectedContent) {
            if (prevContentIdRef.current !== selectedContent.id) {
                setCurrentLessonIndex(0);
                setAnimationDirection(null);
                setIsDeletePopoverOpen(false);
                setIsEditing(false);
            }
            prevContentIdRef.current = selectedContent.id;
        }
    }, [selectedContent]);

    // Initialize/reset edit states when data changes
    useEffect(() => {
        if (selectedContent) {
            setEditedCurriculumTitle(selectedContent.name);
        }
        const title = selectedContent?.lessons?.[currentLessonIndex]?.title || '';
        setEditedLessonTitle(title);
        setEditedLessonPlan(lessonPlan || null);
    }, [selectedContent, lessonPlan, currentLessonIndex]);
    
    // Handle incoming curriculum title regeneration
    useEffect(() => {
        if (lastRegeneratedCurriculumTitle && lastRegeneratedCurriculumTitle.id !== processedRegenIds.curriculumTitle) {
            setEditedCurriculumTitle(lastRegeneratedCurriculumTitle.title);
            setIsEditing(true);
            setProcessedRegenIds(prev => ({ ...prev, curriculumTitle: lastRegeneratedCurriculumTitle.id }));
        }
    }, [lastRegeneratedCurriculumTitle, processedRegenIds.curriculumTitle]);

    // Handle incoming lesson title regeneration
    useEffect(() => {
        if (lastRegeneratedLessonTitle && lastRegeneratedLessonTitle.id !== processedRegenIds.title && lastRegeneratedLessonTitle.lessonIndex === currentLessonIndex) {
            setEditedLessonTitle(lastRegeneratedLessonTitle.title);
            setIsEditing(true);
            setProcessedRegenIds(prev => ({ ...prev, title: lastRegeneratedLessonTitle.id }));
        }
    }, [lastRegeneratedLessonTitle, currentLessonIndex, processedRegenIds.title]);

    const handleConfirmDelete = () => {
        onDeleteRequest();
        setIsDeletePopoverOpen(false);
    };

    const handleRegenerateClick = (instructions: string) => {
        if (regenPopover.part && regenPopover.partId) {
            onRegenerate(currentLessonIndex, regenPopover.part, instructions);
            setRegenPopover({ open: false, part: null, partId: null, ref: null });
        }
    };
    
    const openRegenPopover = (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => {
        setRegenPopover({ open: true, part, partId: getRegenerationPartId(part), ref });
    };
    
    const handleGenerateNewPart = (partType: 'exercise' | 'quiz') => {
        return onGenerateNewPart(currentLessonIndex, partType);
    };

    const handleIndexChange = (newIndex: number) => {
        if (newIndex > currentLessonIndex) {
            setAnimationDirection('right');
        } else if (newIndex < currentLessonIndex) {
            setAnimationDirection('left');
        }
        setCurrentLessonIndex(newIndex);
    };

    const handleOpenDuplicateModal = (index: number) => {
        setDuplicateModalState({ isOpen: true, lessonIndex: index });
    };

    const handleCloseDuplicateModal = () => {
        setDuplicateModalState({ isOpen: false, lessonIndex: -1 });
    };

    const handlePerformDuplicate = (instructions: string) => {
        const { lessonIndex } = duplicateModalState;
        if (lessonIndex === -1) return;

        onDuplicateAndVary(lessonIndex, instructions);
        handleCloseDuplicateModal();
    };

    const handleSave = () => {
        if (!selectedContent) return;
        onUpdateCurriculumTitle(editedCurriculumTitle);
        onUpdateLessonTitle(currentLessonIndex, editedLessonTitle);
        if (editedLessonPlan) {
            const updatedContent = lessonPlanToMarkdown(editedLessonPlan);
            if (selectedContent.lessons[currentLessonIndex].content !== updatedContent) {
                onUpdateLessonPlan(currentLessonIndex, editedLessonPlan);
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (selectedContent) {
            setEditedCurriculumTitle(selectedContent.name);
            const title = selectedContent.lessons[currentLessonIndex]?.title || '';
            setEditedLessonTitle(title);
            setEditedLessonPlan(lessonPlan);
        }
        setIsEditing(false);
    };


    return (
        <div className="h-full lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[556px] relative" ref={viewerRef}>
          {selectedContent ? (
            <div>
              <PreviewHeader
                curriculum={selectedContent}
                generationOptions={selectedContent.generationOptions}
                onRegenerateRequest={openRegenPopover}
                openPopoverPartId={regenPopover.partId}
                onDeleteClick={() => setIsDeletePopoverOpen(p => !p)}
                deleteButtonRef={deleteButtonRef}
                showSaveButton={false}
                showDeleteButton={true}
                showDuplicateButton={true}
                onDuplicateAndVaryClick={() => handleOpenDuplicateModal(currentLessonIndex)}
                onUpdateCurriculumTitle={onUpdateCurriculumTitle}
                onSaveClick={() => {}}
                saveButtonRef={React.createRef<HTMLButtonElement>()}
                isEditing={isEditing}
                showEditButton={true}
                onEditClick={() => setIsEditing(true)}
                editedCurriculumTitle={editedCurriculumTitle}
                onCurriculumTitleChange={setEditedCurriculumTitle}
              />
              <DeleteConfirmationPopover 
                isOpen={isDeletePopoverOpen} 
                onConfirm={handleConfirmDelete} 
                onCancel={() => setIsDeletePopoverOpen(false)}
                triggerRef={deleteButtonRef}
              />
              
              <NotesEditor 
                notes={selectedContent.notes}
                onUpdateNotes={onUpdateNotes}
              />

              {selectedContent.lessons?.length > 1 && (
                <LessonNavigator
                    currentLessonIndex={currentLessonIndex}
                    totalLessons={selectedContent.lessons.length}
                    lessonTitle={editedLessonTitle}
                    onIndexChange={handleIndexChange}
                    className="mb-4"
                />
              )}

                <EditableLesson
                    key={`${selectedContent.id}-${currentLessonIndex}`}
                    lessonPlan={lessonPlan}
                    onRegenerate={openRegenPopover}
                    onGenerateNewPart={handleGenerateNewPart}
                    regeneratingPart={regeneratingPart}
                    openPopoverPartId={regenPopover.partId}
                    animationDirection={animationDirection}
                    onDuplicateAndVary={() => {}} // This is now handled by the header
                    isEditing={isEditing}
                    editedLessonPlan={editedLessonPlan}
                    onPlanChange={setEditedLessonPlan}
                    editedLessonTitle={editedLessonTitle}
                    onTitleChange={setEditedLessonTitle}
                    currentLessonIndex={currentLessonIndex}
                />
               <RegeneratePopover
                  isOpen={regenPopover.open}
                  onClose={() => setRegenPopover({ open: false, part: null, partId: null, ref: null })}
                  triggerRef={regenPopover.ref!}
                  onRegenerate={handleRegenerateClick}
                  isLoading={regeneratingPart === regenPopover.partId}
              />
              <DuplicateAndVaryModal
                isOpen={duplicateModalState.isOpen}
                onClose={handleCloseDuplicateModal}
                onGenerate={handlePerformDuplicate}
                isLoading={false} // Loading state is now handled by the skeleton card
              />
              {isEditing && <EditModeFooter onSave={handleSave} onCancel={handleCancel} />}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Eye className="w-14 h-14 text-slate-300 mb-5" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Select Content</h3>
              <p className="text-sm text-slate-500">Select content from the list to view and modify it here.</p>
            </div>
          )}
        </div>
    );
};
