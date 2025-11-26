import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Curriculum, GenerationOptions, ManualInputs, ProjectManualInputs } from '../../../types';
import { ManualInputForm } from './ManualInputForm';
import { CurriculumConfig } from './CurriculumConfig';
import { GenerationSettingsBasic } from './GenerationSettingsBasic';
import { GenerationSettingsAdvanced } from './GenerationSettingsAdvanced';
import { useLocalStorage } from '../../../hooks';
import { Button } from '../../../components/ui';
import { 
    getDefaultGenerationOptions,
    appConfig
} from '../../../config';
import { isDifficultyTag } from '../../../utils';
import { ProjectManualInputForm } from './ProjectManualInputForm';

interface GenerationSettingsProps {
    selectedCurriculum: Curriculum | null;
    view: string;
    hasResults: boolean;
    onNewGeneration: () => void;
    onGenerate: (options: GenerationOptions, manualInputs: ManualInputs) => void;
    onGenerateProject: (projectInputs: ProjectManualInputs) => void;
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
    selectedCurriculum,
    view,
    hasResults,
    onNewGeneration,
    onGenerate,
    onGenerateProject,
}) => {
    const [generationType, setGenerationType] = useState<'course' | 'project'>('project');
    const [animationClass, setAnimationClass] = useState('animate-fadeIn');
    const courseTitleInputRef = useRef<HTMLInputElement>(null);
    const projectTitleInputRef = useRef<HTMLInputElement>(null);

    const [manualInputs, setManualInputs] = useState<ManualInputs>({
        curriculumTitle: '',
        lessonTitles: '',
        difficulty: 'Beginner',
    });

    const [projectManualInputs, setProjectManualInputs] = useState<ProjectManualInputs>({
        title: '',
        difficulty: 'any',
        expectations: '',
    });

    const [generationOptions, setGenerationOptions] = useLocalStorage<GenerationOptions>(
        appConfig.STORAGE_KEYS.generationSettings,
        getDefaultGenerationOptions
    );

    useEffect(() => {
        // Automatically focus the first input when the mode changes or the component becomes active.
        const timer = setTimeout(() => {
            if (selectedCurriculum) {
                // No manual input to focus on when a curriculum is selected from Discovery
                return;
            }
            if (generationType === 'course') {
                courseTitleInputRef.current?.focus();
            } else {
                projectTitleInputRef.current?.focus();
            }
        }, 50); // Small delay to ensure the new component is in the DOM.
        return () => clearTimeout(timer);
    }, [generationType, selectedCurriculum]);

    const handleGenerationTypeChange = (newType: 'course' | 'project') => {
        if (generationType === newType) return;

        const slideOutClass = newType === 'project' ? 'animate-slideOutToRight' : 'animate-slideOutToLeft';
        setAnimationClass(slideOutClass);
        
        setTimeout(() => {
            setGenerationType(newType);
            const slideInClass = newType === 'project' ? 'animate-slideInFromLeft' : 'animate-slideInFromRight';
            setAnimationClass(slideInClass);
        }, 400);
    };

    const handleManualInputChange = (field: string, value: string) => {
        setManualInputs(prev => ({ ...prev, [field]: value }));
    };
    
    const handleProjectInputChange = (field: string, value: string) => {
        setProjectManualInputs(prev => ({ ...prev, [field]: value }));
    };

    const handleOptionChange = (field: string, value: string | boolean) => {
        setGenerationOptions((prev) => ({...prev, [field]: value}));
    };
    
    const handleNewGenerationClick = () => {
        if (selectedCurriculum) {
            const difficulty = selectedCurriculum.tags.find(isDifficultyTag) || 'Beginner';
            setManualInputs({
                curriculumTitle: selectedCurriculum.title,
                lessonTitles: selectedCurriculum.content.lessons.join('\n'),
                difficulty: difficulty,
            });
        } else {
            setManualInputs({ curriculumTitle: '', lessonTitles: '', difficulty: 'Beginner' });
        }
        onNewGeneration();
    };

    const lessonsToGenerate = manualInputs.lessonTitles.split('\n').map(t => t.trim()).filter(t => t);
    
    const isCourseGenerationDisabled = view === 'loading' || (!selectedCurriculum && (lessonsToGenerate.length === 0 || !manualInputs.curriculumTitle.trim()));
    const isProjectGenerationDisabled = view === 'loading' || !projectManualInputs.title.trim();
    const isGenerateButtonDisabled = selectedCurriculum ? isCourseGenerationDisabled : (generationType === 'course' ? isCourseGenerationDisabled : isProjectGenerationDisabled);

    const handleSubmit = useCallback(() => {
        if (isGenerateButtonDisabled) return;
        if (selectedCurriculum || generationType === 'course') {
            onGenerate(generationOptions, manualInputs);
        } else {
            onGenerateProject(projectManualInputs);
        }
    }, [isGenerateButtonDisabled, selectedCurriculum, generationType, onGenerate, generationOptions, manualInputs, onGenerateProject, projectManualInputs]);

    return (
        <div className="w-full lg:col-span-1 lg:flex-shrink-0 space-y-6 lg:top-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {selectedCurriculum ? (
                    <>
                        <div className="border-b border-slate-200 pb-4 mb-4">
                            <CurriculumConfig curriculum={selectedCurriculum} onNewGeneration={handleNewGenerationClick} />
                        </div>
                        <div className="pt-4">
                            <GenerationSettingsBasic
                                generationOptions={generationOptions}
                                onOptionChange={handleOptionChange}
                            />
                        </div>
                        <GenerationSettingsAdvanced
                            generationOptions={generationOptions}
                            onOptionChange={handleOptionChange}
                        />
                    </>
                ) : (
                    <div className={animationClass}>
                        {generationType === 'course' ? (
                            <>
                                <ManualInputForm 
                                    ref={courseTitleInputRef}
                                    manualInputs={manualInputs} 
                                    onManualInputChange={handleManualInputChange} 
                                />
                                <div className="pt-4 border-t border-slate-200 mt-6">
                                    <GenerationSettingsBasic
                                        generationOptions={generationOptions}
                                        onOptionChange={handleOptionChange}
                                    />
                                </div>
                                <GenerationSettingsAdvanced
                                    generationOptions={generationOptions}
                                    onOptionChange={handleOptionChange}
                                />
                                <div className="text-center mt-6 text-sm text-slate-500 border-t border-slate-200 pt-4">
                                    Alternatively, you can generate a {' '}
                                    <button onClick={() => handleGenerationTypeChange('project')} className="text-primary-text font-semibold hover:underline focus:outline-none">
                                         project
                                    </button>
                                    .
                                </div>
                            </>
                        ) : (
                            <>
                                <ProjectManualInputForm 
                                    ref={projectTitleInputRef}
                                    projectInputs={projectManualInputs} 
                                    onProjectInputChange={handleProjectInputChange} 
                                />
                                <div className="text-center mt-6 text-sm text-slate-500 border-t border-slate-200 pt-4">
                                    Alternatively, you can generate{' '}
                                    <button onClick={() => handleGenerationTypeChange('course')} className="text-primary-text font-semibold hover:underline focus:outline-none">
                                        lesson plans
                                    </button>
                                    .
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            <Button
                onClick={handleSubmit}
                disabled={isGenerateButtonDisabled}
                className="w-full"
            >
                {hasResults ? 'Generate' : 'Generate'}
            </Button>
        </div>
    );
};