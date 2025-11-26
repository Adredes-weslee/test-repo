import React from 'react';
import { Button } from './Button';

interface EditModeFooterProps {
    onCancel: () => void;
    onSave: () => void;
}

export const EditModeFooter: React.FC<EditModeFooterProps> = ({ onCancel, onSave }) => {
    return (
        <div className="sticky bottom-14 z-30 py-4 -mx-6 -mb-6 px-6 bg-white/90 backdrop-blur-sm border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] animate-fadeIn rounded-b-xl">
            <div className="flex justify-end items-center gap-4">
                <Button variant="secondary" onClick={onCancel} className="!py-2 !px-6">Cancel</Button>
                <Button variant="primary" onClick={onSave} className="!py-2 !px-6">Save Changes</Button>
            </div>
        </div>
    );
};