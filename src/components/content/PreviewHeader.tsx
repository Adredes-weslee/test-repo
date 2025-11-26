import React, { useRef } from 'react';
import type { ContentItem, Curriculum, GenerationOptions, RegenerationPart } from '../../types';
import { getRegenerationPartId } from '../../types';
import { IconButton, Input, RegenerateButton, Button } from '../../components/ui';
import { Modification, Library, Trash, CopyPlus } from '../../components/icons';
import { formatDate, getDifficultyClasses, isDifficultyTag } from '../../utils';

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
}) => {
    const curriculumTitleRegenButtonRef = React.useRef<HTMLButtonElement>(null);

    const isContentItem = 'created' in curriculum;
    const difficulty = 'tags' in curriculum ? (curriculum.tags.find(isDifficultyTag) || 'N/A') : curriculum.difficulty;
    const lessonCount = 'content' in curriculum ? curriculum.content.lessons.length : curriculum.lessonCount;
    const totalHours = generationOptions
        ? lessonCount * parseFloat(generationOptions.lessonDuration)
        : isContentItem ? curriculum.lessonCount * curriculum.lessonDuration : 0;
    const date = isContentItem ? curriculum.created : generationDate;
    const formattedDate = formatDate(date);
    const dateLabel = isContentItem ? 'Created on' : 'Generated on';
    const curriculumTitle = 'title' in curriculum ? curriculum.title : curriculum.name;
    
    const openCurriculumTitleRegen = () => {
        onRegenerateRequest({ type: 'curriculumTitle' }, curriculumTitleRegenButtonRef);
    };
    const isCurriculumTitleRegenOpen = openPopoverPartId === getRegenerationPartId({ type: 'curriculumTitle' });

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