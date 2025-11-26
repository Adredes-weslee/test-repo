import React from 'react';
import { Input, Select, Textarea } from '../../../components/ui';
import { HelpCircle, Sparkles } from '../../../components/icons';

interface ManualInputFormProps {
    manualInputs: {
        curriculumTitle: string;
        lessonTitles: string;
        difficulty: string;
    };
    onManualInputChange: (field: string, value: string) => void;
}

export const ManualInputForm = React.forwardRef<HTMLInputElement, ManualInputFormProps>(({ manualInputs, onManualInputChange }, ref) => {
    return (
        <div>
            <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-slate-800">Generate Lesson Plans</h2>
            </div>
            <div className="space-y-4">
                <Input
                    ref={ref}
                    label="Curriculum Title"
                    id="curriculumTitle"
                    value={manualInputs.curriculumTitle}
                    onChange={e => onManualInputChange('curriculumTitle', e.target.value)}
                    placeholder="e.g., Intro to Python"
                    required
                />
                <div>
                    <div className="flex items-center space-x-1.5 mb-1">
                        <label htmlFor="lessonTitles" className="block text-sm font-medium text-slate-600">
                            Lesson Titles<span className="text-primary ml-1">*</span>
                        </label>
                        <div className="relative group flex items-center">
                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                Enter one lesson title per line
                                <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                            </div>
                        </div>
                    </div>
                    <Textarea
                        id="lessonTitles"
                        rows={4}
                        value={manualInputs.lessonTitles}
                        onChange={e => onManualInputChange('lessonTitles', e.target.value)}
                    />
                </div>
                <Select label="Difficulty" id="difficulty" value={manualInputs.difficulty} onChange={e => onManualInputChange('difficulty', e.target.value)} required>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </Select>
            </div>
        </div>
    );
});