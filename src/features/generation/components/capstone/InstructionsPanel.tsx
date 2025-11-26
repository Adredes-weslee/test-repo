import React, { useState } from 'react';
import { Button, Textarea } from '../../../../components/ui';

interface InstructionsPanelProps {
    onApply: (instructions: string) => void;
    isRegenerating: boolean;
}

export const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ onApply, isRegenerating }) => {
    const [instructions, setInstructions] = useState('');

    const handleApplyClick = () => {
        if (instructions.trim()) {
            onApply(instructions);
            setInstructions('');
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 flex flex-col h-1/4">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Instructions</h3>
            <Textarea 
                placeholder="e.g., Add a Flask API endpoint to the app.py file..." 
                rows={3} 
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="resize-none"
            />
            <Button 
                className="w-full mt-2 !py-2" 
                onClick={handleApplyClick} 
                disabled={!instructions.trim() || isRegenerating}
            >
                {isRegenerating ? 'Applying...' : 'Apply Instructions'}
            </Button>
        </div>
    );
}
