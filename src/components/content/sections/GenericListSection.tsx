import React, { useState, useEffect, useRef } from 'react';
import type { RegenerationPart } from '../../../types';
import { getRegenerationPartId } from '../../../types';
import { FilePlus, Trash } from '../../icons';
import { IconButton, Textarea, RegenerateButton } from '../../ui';

export interface ViewModeRenderHelpers {
    part: RegenerationPart;
    partId: string;
    isRegenerating: boolean;
    isPopoverOpen: boolean;
    ref: React.RefObject<HTMLButtonElement>;
    onRegenerateClick: () => void;
}

interface GenericListSectionProps<T> {
    isEditing: boolean;
    items: T[];
    editedItems: T[];
    onEditChange: (newItems: T[]) => void;
    partType: 'exercise' | 'quiz';
    itemToMarkdown: (item: T) => string;
    parseMarkdownToItem: (markdown: string) => T;
    renderItemView: (
        item: T, 
        index: number, 
        helpers: ViewModeRenderHelpers
    ) => React.ReactNode;
    onRegenerate?: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart?: () => Promise<T>;
    singularItemName: string;
    newItemPlaceholder: string;
    regeneratingPart?: string | null;
    openPopoverPartId?: string | null;
}

export const GenericListSection = <T extends object>({
    isEditing,
    items,
    editedItems,
    onEditChange,
    partType,
    itemToMarkdown,
    parseMarkdownToItem,
    renderItemView,
    onRegenerate,
    onGenerateNewPart,
    singularItemName,
    newItemPlaceholder,
    regeneratingPart,
    openPopoverPartId,
}: GenericListSectionProps<T>) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const regenButtonRefs = useRef<Array<React.RefObject<HTMLButtonElement>>>([]);

    useEffect(() => {
        const itemsLength = isEditing ? editedItems.length : items.length;
        regenButtonRefs.current = Array(itemsLength).fill(null).map((_, i) => regenButtonRefs.current[i] || React.createRef());
    }, [items.length, editedItems.length, isEditing]);

    const handleItemChange = (index: number, markdown: string) => {
        const newItems = [...editedItems];
        newItems[index] = parseMarkdownToItem(markdown);
        onEditChange(newItems);
    };

    const addItem = async () => {
        if (isGenerating) return;

        if (onGenerateNewPart) {
            setIsGenerating(true);
            try {
                const generatedItem = await onGenerateNewPart();
                onEditChange([...editedItems, generatedItem]);
            } catch (error) {
                // Parent component will show a toast
            } finally {
                setIsGenerating(false);
            }
        } else {
            // Create an empty item as a fallback
            const emptyMarkdown = newItemPlaceholder.replace(/\.\.\./g, '');
            const emptyItem = parseMarkdownToItem(emptyMarkdown);
            onEditChange([...editedItems, emptyItem]);
        }
    };

    const removeItem = (index: number) => {
        onEditChange(editedItems.filter((_, i) => i !== index));
    };

    if (isEditing) {
        return (
            <div className="space-y-6">
               {editedItems.map((item, i) => {
                   const part: RegenerationPart = { type: partType, index: i };
                   const partId = getRegenerationPartId(part);
                   const isPopoverOpen = openPopoverPartId === partId;
                   const ref = regenButtonRefs.current[i];
                   
                   return (
                       <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 relative">
                           <div className="flex justify-between items-center">
                               <h4 className="font-semibold text-slate-700">{singularItemName} {i+1}</h4>
                               <IconButton icon={Trash} tooltipText={`Remove ${singularItemName}`} variant="danger" onClick={() => removeItem(i)} className="!w-8 !h-8" />
                           </div>
                           <div className="flex flex-row gap-4 items-start">
                               <Textarea 
                                   value={itemToMarkdown(item)}
                                   onChange={e => handleItemChange(i, e.target.value)}
                                   rows={10}
                                   placeholder={newItemPlaceholder}
                               />
                               {onRegenerate && (
                                   <RegenerateButton 
                                       ref={ref} 
                                       onClick={() => onRegenerate?.(part, ref)} 
                                       isPopoverOpen={isPopoverOpen}
                                   />
                               )}
                           </div>
                       </div>
                   );
               })}
               <IconButton icon={FilePlus} tooltipText={`Add ${singularItemName}`} variant="primary" onClick={addItem} disabled={isGenerating} />
           </div>
        );
    }

    return (
        <div className="space-y-8">
            {items.map((item, index) => {
                const part: RegenerationPart = { type: partType, index };
                const partId = getRegenerationPartId(part);
                const isRegenerating = regeneratingPart === partId;
                const isPopoverOpen = openPopoverPartId === partId;
                const ref = regenButtonRefs.current[index];

                const helpers: ViewModeRenderHelpers = {
                    part,
                    partId,
                    isRegenerating,
                    isPopoverOpen,
                    ref,
                    onRegenerateClick: () => onRegenerate?.(part, ref),
                };

                return renderItemView(item, index, helpers);
            })}
        </div>
    );
};
