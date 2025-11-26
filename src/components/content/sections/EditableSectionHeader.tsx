import React from 'react';
import { IconButton } from '../../ui';
import { Modification, Check, X } from '../../icons';

interface EditableSectionHeaderProps {
    title: string;
    icon: React.ElementType;
    isEditing: boolean;
    onStartEdit: (e?: React.MouseEvent) => void;
    onSave: () => void;
    onCancel: () => void;
    onUpdate?: unknown; // Prop to check if editing is enabled
}

export const EditableSectionHeader: React.FC<EditableSectionHeaderProps> = ({ title, icon: Icon, isEditing, onStartEdit, onSave, onCancel, onUpdate }) => {
    const simpleTitle = (
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-slate-700">{title}</span>
        </div>
    );
    
    if (isEditing) {
        return (
            <div className="flex justify-between items-center w-full">
                {simpleTitle}
                <div className="flex items-center gap-2">
                    <IconButton icon={X} tooltipText="Cancel" onClick={onCancel} className="!w-8 !h-8" />
                    <IconButton icon={Check} tooltipText="Save" variant="primary" onClick={onSave} className="!w-8 !h-8" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex justify-between items-center w-full">
            {simpleTitle}
            {onUpdate && (
                <IconButton 
                    icon={Modification} 
                    tooltipText="Edit Section" 
                    onClick={onStartEdit}
                    className="!w-8 !h-8"
                />
            )}
        </div>
    );
};