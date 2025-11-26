import React, { useState } from 'react';
import { Select, Checkbox, Textarea } from '../../../components/ui';
import { Settings, ChevronDown } from '../../../components/icons';
import type { GenerationOptions } from '../../../types';
import {
    exercisesPerLessonOptions,
    quizQuestionsPerLessonOptions,
} from '../../../config';

interface GenerationSettingsAdvancedProps {
    generationOptions: GenerationOptions;
    onOptionChange: (field: string, value: string | boolean) => void;
}

export const GenerationSettingsAdvanced: React.FC<GenerationSettingsAdvancedProps> = ({
    generationOptions,
    onOptionChange,
}) => {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    return (
        <div className="mt-6 border-t border-slate-200">
            <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex justify-between items-center text-left pt-4 group"
            >
                <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-slate-500 group-hover:text-primary-text transition-colors" />
                    <h4 className="text-sm font-semibold text-slate-700 group-hover:text-primary-text transition-colors">Advanced Settings</h4>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </button>
            {isAdvancedOpen && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                    <Select label="Exercises per Lesson" id="exercisesPerLesson" value={generationOptions.exercisesPerLesson} onChange={e => onOptionChange('exercisesPerLesson', e.target.value)} required>
                        {exercisesPerLessonOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    <Select label="Quiz Questions per Lesson" id="quizQuestionsPerLesson" value={generationOptions.quizQuestionsPerLesson} onChange={e => onOptionChange('quizQuestionsPerLesson', e.target.value)} required>
                        {quizQuestionsPerLessonOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    <div className="pt-1">
                        <label htmlFor="instructions" className="block text-sm font-medium text-slate-600 mb-1">Additional Instructions</label>
                        <Textarea
                            id="instructions"
                            rows={3}
                            value={generationOptions.instructions}
                            onChange={(e) => onOptionChange('instructions', e.target.value)}
                        />
                    </div>
                    <div className="space-y-3 pt-1">
                        <Checkbox id="code-examples" label="Include code examples" checked={generationOptions.codeExamples} onChange={e => onOptionChange('codeExamples', e.target.checked)} />
                        <Checkbox id="visual-elements" label="Suggest visual elements" checked={generationOptions.visualElements} onChange={e => onOptionChange('visualElements', e.target.checked)} />
                    </div>
                </div>
            )}
        </div>
    );
};