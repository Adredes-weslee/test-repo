
import React, { useRef } from 'react';
import type { ContentItem, Curriculum, GenerationOptions, RegenerationPart, LessonPlan } from '../../types';
import { getRegenerationPartId } from '../../types';
import { IconButton, Input, RegenerateButton, Button } from '../../components/ui';
import { Modification, Library, Trash, CopyPlus, Presentation } from '../../components/icons';
import { formatDate, getDifficultyClasses, isDifficultyTag, lessonPlanToMarkdown } from '../../utils';
import { useNavigationStore, useCurriculumStore } from '../../store';

interface PreviewHeaderProps {
    curriculum: Curriculum | ContentItem;
    generationOptions?: GenerationOptions | null;
    generationDate?: string | null;
    onRegenerateRequest: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    openPopoverPartId: string | null;
    onSaveClick: () => void;
    onDeleteClick: () => void;
    showSaveButton: boolean;
    showDeleteButton: boolean;
    saveButtonRef: React.RefObject<HTMLButtonElement>;
    deleteButtonRef: React.RefObject<HTMLButtonElement>;
    onUpdateCurriculumTitle?: (newTitle: string) => void;
    saveButtonDisabled?: boolean;
    showDuplicateButton?: boolean;
    onDuplicateAndVaryClick?: () => void;
    isEditing?: boolean;
    showEditButton?: boolean;
    onEditClick?: () => void;
    editedCurriculumTitle?: string;
    onCurriculumTitleChange?: (newTitle: string) => void;
    onDiscard?: () => void;
    lessonPlans?: (LessonPlan | null)[] | null;
    showDebugButton?: boolean;
    onOpenDebug?: () => void;
}

export const PreviewHeader: React.FC<PreviewHeaderProps> = ({
    curriculum,
    generationOptions,
    generationDate,
    onRegenerateRequest,
    openPopoverPartId,
    onSaveClick,
    onDeleteClick,
    showSaveButton,
    showDeleteButton,
    saveButtonRef,
    deleteButtonRef,
    onUpdateCurriculumTitle,
    saveButtonDisabled,
    showDuplicateButton,
    onDuplicateAndVaryClick,
    isEditing,
    showEditButton,
    onEditClick,
    editedCurriculumTitle,
    onCurriculumTitleChange,
    onDiscard,
    lessonPlans,
    showDebugButton,
    onOpenDebug,
}) => {
    const curriculumTitleRegenButtonRef = React.useRef<HTMLButtonElement>(null);
    const navigateTo = useNavigationStore((state) => state.navigateTo);
    const setSlidesContext = useCurriculumStore((state) => state.setSlidesContext);

    const isContentItem = 'created' in curriculum;
    
    // Correctly resolve difficulty: ContentItem has explicit 'difficulty', Curriculum relies on 'tags'.
    const difficulty = isContentItem 
        ? (curriculum as ContentItem).difficulty 
        : (curriculum.tags?.find(isDifficultyTag) || 'N/A');

    const lessonCount = ('content' in curriculum && curriculum.content) ? curriculum.content.lessons.length : (('lessonCount' in curriculum) ? curriculum.lessonCount : 0);
    const totalHours = generationOptions
        ? lessonCount * parseFloat(generationOptions.lessonDuration)
        : isContentItem ? (curriculum as ContentItem).lessonCount * (curriculum as ContentItem).lessonDuration : 0;
    const date = isContentItem ? (curriculum as ContentItem).created : generationDate;
    const formattedDate = formatDate(date);
    const dateLabel = isContentItem ? 'Created on' : 'Generated on';
    const curriculumTitle = 'title' in curriculum ? curriculum.title : (curriculum as ContentItem).name;
    
    const openCurriculumTitleRegen = () => {
        onRegenerateRequest({ type: 'curriculumTitle' }, curriculumTitleRegenButtonRef);
    };
    const isCurriculumTitleRegenOpen = openPopoverPartId === getRegenerationPartId({ type: 'curriculumTitle' });

    const handleGenerateSlides = () => {
        // Prepare structured context for slides generation
        let items: { title: string; content: string }[] = [];

        if (isContentItem) {
            // If it's a saved item, use the stored lesson content
            const item = curriculum as ContentItem;
            items = item.lessons.map(l => ({
                title: l.title,
                content: l.content
            }));
        } else {
            // If it's a generation result (Curriculum), try to use lessonPlans if available
            const curr = curriculum as Curriculum;
            const lessonTitles = curr.content.lessons;
            
            items = lessonTitles.map((title, index) => {
                const plan = lessonPlans?.[index];
                const content = plan ? lessonPlanToMarkdown(plan) : 'Content not generated yet.';
                return { title, content };
            });
        }

        setSlidesContext({
            courseTitle: curriculumTitle,
            items: items
        });
        navigateTo('Slides');
    };

    return (
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
            <div className="mr-4 flex-grow">
                {isEditing && onCurriculumTitleChange ? (
                     <div className="flex items-end gap-2">
                        <Input
                            label="Course Title"
                            id="course-title-editor"
                            value={editedCurriculumTitle}
                            onChange={(e) => onCurriculumTitleChange(e.target.value)}
                            containerClassName="!w-[50%]"
                        />
                        <RegenerateButton
                          ref={curriculumTitleRegenButtonRef}
                          onClick={openCurriculumTitleRegen}
                          isPopoverOpen={isCurriculumTitleRegenOpen}
                        />
                    </div>
                ) : (
                    <div className="relative group -ml-12 pl-12 pt-1">
                        <p className="text-sm font-semibold text-slate-400">Course</p>
                        <div className="z-10 w-[80%] flex flex-row justify-start items-center">
                            <h1 className="text-3xl w-fit font-semibold text-slate-800">{curriculumTitle}</h1>
                            {/*onUpdateCurriculumTitle && showEditButton && !isEditing && (
                                <IconButton icon={Modification} tooltipText="Edit Course" onClick={onEditClick} className="ml-2 !w-8 !h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )*/}
                        </div>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-slate-500 mt-1">
                            <span className={`px-2 py-0-5 text-xs rounded-full font-medium ${getDifficultyClasses(difficulty)}`}>{difficulty}</span>
                            <span className="text-slate-400">&middot;</span>
                            <span>{lessonCount} lessons</span>
                            {totalHours > 0 && (
                                <>
                                    <span className="text-slate-400">&middot;</span>
                                    <span>{totalHours} hrs total</span>
                                </>
                            )}
                            {formattedDate && (
                                <>
                                    <span className="text-slate-400">&middot;</span>
                                    <span>{dateLabel} {formattedDate}</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                {onDiscard && (
                    <IconButton
                        icon={Trash}
                        tooltipText="Discard and start new"
                        onClick={onDiscard}
                        variant="danger"
                        disabled={isEditing}
                    />
                )}
                {showEditButton && !isEditing && (
                    <IconButton
                        icon={Modification}
                        tooltipText="Edit Lesson"
                        onClick={onEditClick}
                        variant="default"
                    />
                )}
                <Button
                    icon={Presentation}
                    variant="secondary"
                    onClick={handleGenerateSlides}
                    size="small"
                    className="!px-3"
                    disabled={isEditing}
                >
                    Generate Slides
                </Button>
                {showDuplicateButton && (
                    <Button
                        icon={CopyPlus}
                        variant="secondary"
                        onClick={onDuplicateAndVaryClick}
                        size="small"
                        className="!px-3"
                        disabled={isEditing}
                    >
                        Duplicate & Vary
                    </Button>
                )}
                {showDebugButton && onOpenDebug && (
                    <Button
                        variant="secondary"
                        onClick={onOpenDebug}
                        size="small"
                        className="!px-3"
                        disabled={isEditing}
                    >
                        Debug
                    </Button>
                )}
                {showSaveButton && (
                    <Button
                        ref={saveButtonRef}
                        icon={Library}
                        variant="primary"
                        onClick={onSaveClick}
                        size="small"
                        className="!px-3"
                        disabled={saveButtonDisabled || isEditing}
                    >
                        Save to Library
                    </Button>
                )}
                {showDeleteButton && (
                    <Button
                        ref={deleteButtonRef}
                        icon={Trash}
                        variant="danger-secondary"
                        onClick={onDeleteClick}
                        size="small"
                        className="!px-3"
                        disabled={isEditing}
                    >
                        Delete
                    </Button>
                )}
            </div>
        </div>
    );
};
