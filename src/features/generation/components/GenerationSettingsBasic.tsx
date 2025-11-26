import React from 'react';
import { Select } from '../../../components/ui';
import type { GenerationOptions } from '../../../types';
import {
    generationModels,
    generationStyles,
    lessonDurationOptions
} from '../../../config';

interface GenerationSettingsBasicProps {
    generationOptions: GenerationOptions;
    onOptionChange: (field: string, value: string) => void;
}

export const GenerationSettingsBasic: React.FC<GenerationSettingsBasicProps> = ({
    generationOptions,
    onOptionChange,
}) => {
    return (
        <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4">Basic Settings</h3>
            <div className="space-y-4">
                <Select label="Model" id="model" value={generationOptions.model} onChange={e => onOptionChange('model', e.target.value)} required>
                    {generationModels.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
                <Select label="Generation Style" id="style" value={generationOptions.style} onChange={e => onOptionChange('style', e.target.value)} required>
                    {generationStyles.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
                <Select label="Lesson Duration" id="lessonDuration" value={generationOptions.lessonDuration} onChange={e => onOptionChange('lessonDuration', e.target.value)} required>
                    {lessonDurationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </div>
        </div>
    );
};