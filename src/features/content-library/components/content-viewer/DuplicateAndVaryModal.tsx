import React, { useState, useEffect } from 'react';
import { Button, Textarea } from '../../../../components/ui';
import { Sparkles } from '../../../../components/icons';

interface DuplicateAndVaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (instructions: string) => void;
    isLoading: boolean; // Kept for prop consistency, but internal logic is removed.
}

export const DuplicateAndVaryModal: React.FC<DuplicateAndVaryModalProps> = ({ isOpen, onClose, onGenerate, isLoading }) => {
    const [instructions, setInstructions] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setInstructions('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerate = () => {
        onGenerate(instructions);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Duplicate and Vary Course</h3>
                <p className="text-slate-600 mb-6">Provide instructions on how to vary a lesson from this course. A completely new course will be generated and saved to your library based on your instructions.</p>
                <div>
                    <label htmlFor="vary-instructions" className="block text-sm font-medium text-slate-600 mb-1">
                        Instructions
                    </label>
                    <Textarea
                        id="vary-instructions"
                        rows={4}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="e.g., Make the lesson on 'React State Management' more advanced by using Zustand instead of Redux..."
                    />
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleGenerate}>
                        Generate New Course
                    </Button>
                </div>
            </div>
        </div>
    );
};