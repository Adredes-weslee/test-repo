import React, { useState, useRef, useEffect } from 'react';
import { Collapsible, Textarea, RegenerateButton, IconButton } from '../../ui';
import { FilePlus, Trash } from '../../icons';
import type { RegenerationPart } from '../../../types';
import { getRegenerationPartId } from '../../../types';
import { EditableSectionHeader } from './EditableSectionHeader';

interface EditableListSectionProps<T> {
    title: string;
    icon: React.ElementType;
    items: T[];
    partType: 'exercise' | 'quiz';
    itemToMarkdown: (item: T) => string;
    parseMarkdownToItem: (markdown: string) => T;
    renderItem: (item: T, index: number) => React.ReactNode;
    onUpdate?: (newItems: T[]) => void;
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart?: () => Promise<T>;
    regeneratingPart?: string | null;
    openPopoverPartId?: string | null;
    newItemPlaceholder: string;
    singularItemName: string;
}

export const EditableListSection = <T,>({
    title, icon, items, partType, itemToMarkdown, parseMarkdownToItem, renderItem, onUpdate, 
    onRegenerate, onGenerateNewPart, regeneratingPart, openPopoverPartId, newItemPlaceholder, singularItemName
}: EditableListSectionProps<T>) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMarkdowns, setEditedMarkdowns] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const regenButtonRefs = useRef<Array<React.RefObject<HTMLButtonElement>>>([]);

    useEffect(() => {
        regenButtonRefs.current = Array(editedMarkdowns.length).fill(null).map((_, i) => regenButtonRefs.current[i] || React.createRef());
    }, [editedMarkdowns.length]);

    const startEditing = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditedMarkdowns(items.map(itemToMarkdown));
        setIsEditing(true);
    };

    const handleSave = () => {
        const newItems = editedMarkdowns.map(parseMarkdownToItem);
        onUpdate?.(newItems);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedMarkdowns([]);
        setIsEditing(false);
    };

    const handleItemChange = (index: number, markdown: string) => {
        const newMarkdowns = [...editedMarkdowns];
        newMarkdowns[index] = markdown;
        setEditedMarkdowns(newMarkdowns);
    };

    const addItem = async () => {
        if (isGenerating) return;

        if (onGenerateNewPart) {
            setIsGenerating(true);
            try {
                const newItem = await onGenerateNewPart();
                setEditedMarkdowns(prev => [...prev, itemToMarkdown(newItem)]);
            } catch(e) {
                // error is handled by the caller, which shows a toast
            } finally {
                setIsGenerating(false);
            }
        } else {
            setEditedMarkdowns(prev => [...prev, newItemPlaceholder]);
        }
    };

    const removeItem = (index: number) => {
        setEditedMarkdowns(prev => prev.filter((_, i) => i !== index));
    };
    
    const titleComponent = (
        <EditableSectionHeader 
            title={title} 
            icon={icon}
            isEditing={isEditing}
            onStartEdit={startEditing}
            onSave={handleSave}
            onCancel={handleCancel}
            onUpdate={onUpdate}
        />
    );

    if ((!items || items.length === 0) && !isEditing) return null;

    return (
        <div className="relative group">
            <Collapsible title={titleComponent} defaultOpen={true} headerClassName="w-full flex justify-between items-center p-4 text-left bg-slate-50/50 hover:bg-slate-100/70 group">
                {isEditing ? (
                    <div className="space-y-6">
                        {editedMarkdowns.map((markdown, i) => {
                            const part: RegenerationPart = { type: partType, index: i };
                            const ref = regenButtonRefs.current[i];
                            return (
                                <div key={i} className="p-4 bg-white rounded-lg border border-slate-200 space-y-3 relative">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-slate-700">{singularItemName} {i + 1}</h4>
                                        <IconButton icon={Trash} tooltipText={`Remove ${singularItemName}`} variant="danger" onClick={() => removeItem(i)} className="!w-8 !h-8" />
                                    </div>
                                    <div className="flex flex-row gap-4 items-start">
                                        <Textarea value={markdown} onChange={e => handleItemChange(i, e.target.value)} rows={10} placeholder={newItemPlaceholder} />
                                        {onRegenerate && <RegenerateButton ref={ref} onClick={() => onRegenerate?.(part, ref)} isPopoverOpen={openPopoverPartId === getRegenerationPartId(part)} />}
                                    </div>
                                </div>
                            );
                        })}
                        <IconButton icon={FilePlus} tooltipText={`Add ${singularItemName}`} variant="primary" onClick={addItem} disabled={isGenerating} />
                    </div>
                ) : (
                    <div className="space-y-8 relative group/section">
                        {items.map((item, index) => {
                            const partId = getRegenerationPartId({ type: partType, index });
                            const isRegenerating = regeneratingPart === partId;
                            return (
                                <div key={index} className="relative">
                                    {isRegenerating && <div className="absolute inset-0 bg-slate-50/50 animate-pulse rounded-lg z-10 -m-2 p-2"></div>}
                                    {renderItem(item, index)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Collapsible>
        </div>
    );
};
