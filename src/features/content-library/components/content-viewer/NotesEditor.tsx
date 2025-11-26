import React, { useState, useEffect } from 'react';
import { Modification, Check, X } from '../../../../components/icons';
import { Textarea } from '../../../../components/ui';

interface NotesEditorProps {
    notes?: string;
    onUpdateNotes: (notes: string) => void;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ notes, onUpdateNotes }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotes, setEditedNotes] = useState(notes || '');

    useEffect(() => {
        setEditedNotes(notes || '');
    }, [notes]);

    const handleSave = () => {
        onUpdateNotes(editedNotes);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedNotes(notes || '');
        setIsEditing(false);
    };

    return (
        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-semibold text-slate-700">Notes</h4>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <button onClick={handleCancel} className="text-slate-500 hover:text-slate-700 p-1"><X className="w-5 h-5" /></button>
                        <button onClick={handleSave} className="text-primary hover:text-primary-dark p-1"><Check className="w-5 h-5" /></button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-slate-700 p-1"><Modification className="w-5 h-5" /></button>
                )}
            </div>

            {isEditing ? (
                <Textarea
                    id="notes-editor"
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="h-[100px]"
                    placeholder="Add notes..."
                />
            ) : notes ? (
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{notes}</p>
            ) : (
                <p className="text-sm text-slate-400 italic">No notes added yet.</p>
            )}
        </div>
    );
};