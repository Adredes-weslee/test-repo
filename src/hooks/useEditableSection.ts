import React, { useState, useEffect } from 'react';

export const useEditableSection = <T,>(initialData: T, onSave: (data: T) => void) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<T>(initialData);

    useEffect(() => {
        setEditedData(initialData);
    }, [initialData]);

    const handleSave = () => {
        onSave(editedData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedData(initialData);
        setIsEditing(false);
    };
    
    const startEditing = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsEditing(true);
    }

    return {
        isEditing,
        startEditing,
        editedData,
        setEditedData,
        handleSave,
        handleCancel,
    };
};
