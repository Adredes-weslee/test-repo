import React from 'react';
import { Input, Select, Textarea } from '../../../components/ui';
import type { ProjectManualInputs } from '../../../types';
import { Rocket } from '../../../components/icons';

interface ProjectManualInputFormProps {
    projectInputs: ProjectManualInputs;
    onProjectInputChange: (field: string, value: string) => void;
}

export const ProjectManualInputForm = React.forwardRef<HTMLInputElement, ProjectManualInputFormProps>(({ projectInputs, onProjectInputChange }, ref) => {
    return (
        <div className="animate-fadeIn">
            <div className="flex items-center space-x-2 mb-6">
                <Rocket className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-slate-800">Generate Capstone Project</h2>
            </div>
            <div className="space-y-4">
                <Input
                    ref={ref}
                    label="Project Title"
                    id="projectTitle"
                    value={projectInputs.title}
                    onChange={e => onProjectInputChange('title', e.target.value)}
                    placeholder="e.g., Real-time Data Dashboard"
                    required
                />
                <Select 
                    label="Difficulty" 
                    id="difficulty" 
                    value={projectInputs.difficulty} 
                    onChange={e => onProjectInputChange('difficulty', e.target.value)}
                >
                    <option value="any">Any Difficulty</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </Select>
                <div>
                    <label htmlFor="projectExpectations" className="block text-sm font-medium text-slate-600 mb-1">Project Expectations</label>
                    <Textarea
                        id="projectExpectations"
                        value={projectInputs.expectations}
                        onChange={e => onProjectInputChange('expectations', e.target.value)}
                        rows={4}
                        placeholder="Describe the project in a few sentences. What should the final result look like? What features should it have?"
                    />
                </div>
            </div>
        </div>
    );
});