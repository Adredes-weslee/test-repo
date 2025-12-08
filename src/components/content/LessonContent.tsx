
import React from 'react';
import type { LessonPlan, RegenerationPart, Exercise } from '../../types';
import {
    ExercisesSection,
    QuizSection,
    LessonSection,
} from './sections';
import { Goal, Sparkles, Eye, PenTool, Briefcase, Thinking, File } from '../icons';

type QuizQuestion = LessonPlan['quiz']['questions'][0];

interface LessonContentProps {
    lessonPlan: LessonPlan;
    onRegenerate: (part: RegenerationPart, ref: React.RefObject<HTMLButtonElement>) => void;
    onGenerateNewPart?: (partType: 'exercise' | 'quiz') => Promise<any>;
    regeneratingPart: string | null;
    openPopoverPartId: string | null;
    isEditing: boolean;
    editedPlan: LessonPlan;
    onPlanChange: (updatedPlan: LessonPlan) => void;
}

export const LessonContent: React.FC<LessonContentProps> = ({ 
    lessonPlan, 
    onRegenerate, 
    onGenerateNewPart, 
    regeneratingPart, 
    openPopoverPartId, 
    isEditing, 
    editedPlan, 
    onPlanChange 
}) => {
    
    const handlePartUpdate = (updatedPart: Partial<LessonPlan>) => {
        onPlanChange({ ...editedPlan, ...updatedPart });
    };

    const handleGenerateNewExercise = onGenerateNewPart ? async () => await onGenerateNewPart('exercise') as Exercise : undefined;
    const handleGenerateNewQuizQuestion = onGenerateNewPart ? async () => await onGenerateNewPart('quiz') as QuizQuestion : undefined;

    // Backward compatibility check:
    // If the plan has 'lessonOutcome' but no 'overview', use 'lessonOutcome' as overview.
    const effectiveOverview = lessonPlan.overview || lessonPlan.lessonOutcome || '';
    const effectiveActivation = lessonPlan.activation || (lessonPlan.lessonOutline ? 'Included in Demonstration' : '') || '';
    const effectiveDemonstration = lessonPlan.demonstration || lessonPlan.lessonOutline || '';
    const effectiveApplication = lessonPlan.application || (lessonPlan.project?.description ? `### Project: ${lessonPlan.project.description}\n\n${lessonPlan.project.objective}` : '') || '';
    const effectiveIntegration = lessonPlan.integration || '';
    const effectiveReflection = lessonPlan.reflectionAndAssessment || '';

    return (
        <div className="space-y-6">
            <LessonSection
                id="lesson-overview"
                title="1. Overview"
                icon={File}
                content={effectiveOverview}
                isEditing={isEditing}
                editedContent={editedPlan.overview || editedPlan.lessonOutcome || ''}
                onEditChange={val => handlePartUpdate({ overview: val, lessonOutcome: val })}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingPart === 'overview' || regeneratingPart === 'outcome'}
                openPopoverPartId={openPopoverPartId}
                partType="overview"
                rows={4}
                badges={[
                    { label: 'Alignment', type: '6 PoLD' },
                    { label: 'Authentic', type: '6 PoLD' }
                ]}
            />

            {/* Objectives handling */}
            {lessonPlan.learningObjectives && lessonPlan.learningObjectives.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                        <Goal className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-slate-700">2. Learning Objectives</span>
                    </div>
                    {isEditing ? (
                        <textarea 
                            className="w-full border border-slate-300 rounded p-2 text-sm"
                            value={editedPlan.learningObjectives?.join('\n')}
                            onChange={e => handlePartUpdate({ learningObjectives: e.target.value.split('\n') })}
                            rows={5}
                        />
                    ) : (
                        <ul className="list-disc list-outside ml-5 space-y-1 text-slate-700 text-sm">
                            {lessonPlan.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                        </ul>
                    )}
                </div>
            )}

            <LessonSection
                id="lesson-activation"
                title="3. Activation"
                icon={Sparkles}
                content={effectiveActivation}
                isEditing={isEditing}
                editedContent={editedPlan.activation || ''}
                onEditChange={val => handlePartUpdate({ activation: val })}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingPart === 'activation'}
                openPopoverPartId={openPopoverPartId}
                partType="activation"
                badges={[
                    { label: 'Activation', type: 'Merrill' },
                    { label: 'ZPD Check', type: 'Vygotsky' }
                ]}
            />

            <LessonSection
                id="lesson-demonstration"
                title="4. Demonstration"
                icon={Eye}
                content={effectiveDemonstration}
                isEditing={isEditing}
                editedContent={editedPlan.demonstration || editedPlan.lessonOutline || ''}
                onEditChange={val => handlePartUpdate({ demonstration: val, lessonOutline: val })}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingPart === 'demonstration' || regeneratingPart === 'outline'}
                openPopoverPartId={openPopoverPartId}
                partType="demonstration"
                rows={10}
                badges={[
                    { label: 'Demonstration', type: 'Merrill' },
                    { label: 'MKO', type: 'Vygotsky' }
                ]}
            />

            <LessonSection
                id="lesson-application"
                title="5. Application (Core Activity)"
                icon={PenTool}
                content={effectiveApplication}
                isEditing={isEditing}
                editedContent={editedPlan.application || ''}
                onEditChange={val => handlePartUpdate({ application: val })}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingPart === 'application'}
                openPopoverPartId={openPopoverPartId}
                partType="application"
                rows={8}
                badges={[
                    { label: 'Application', type: 'Merrill' },
                    { label: 'Scaffolding', type: 'Vygotsky' },
                    { label: 'Affordances', type: 'Billett' }
                ]}
            />

            <LessonSection
                id="lesson-integration"
                title="6. Integration (Transfer)"
                icon={Briefcase}
                content={effectiveIntegration}
                isEditing={isEditing}
                editedContent={editedPlan.integration || ''}
                onEditChange={val => handlePartUpdate({ integration: val })}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingPart === 'integration'}
                openPopoverPartId={openPopoverPartId}
                partType="integration"
                badges={[
                    { label: 'Integration', type: 'Merrill' },
                    { label: 'Social', type: 'Vygotsky' }
                ]}
            />

            <LessonSection
                id="lesson-reflection"
                title="7. Feedback & Reflection"
                icon={Thinking}
                content={effectiveReflection}
                isEditing={isEditing}
                editedContent={editedPlan.reflectionAndAssessment || ''}
                onEditChange={val => handlePartUpdate({ reflectionAndAssessment: val })}
                onRegenerate={onRegenerate}
                isRegenerating={regeneratingPart === 'reflectionAndAssessment'}
                openPopoverPartId={openPopoverPartId}
                partType="reflectionAndAssessment"
                badges={[
                    { label: 'Feedback', type: '6 PoLD' },
                    { label: 'Social', type: 'Vygotsky' }
                ]}
            />

            <ExercisesSection 
                exercises={lessonPlan.exercises || []} 
                onRegenerate={onRegenerate} 
                regeneratingPart={regeneratingPart} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedExercises={editedPlan.exercises || []} 
                onEditChange={(exercises) => handlePartUpdate({ exercises })} 
                onGenerateNewPart={handleGenerateNewExercise} 
                badges={[
                    { label: 'Scaffolding', type: 'Vygotsky' },
                    { label: 'Apply', type: 'Bloom' }
                ]}
            />
            <QuizSection 
                quiz={lessonPlan.quiz || { questions: [] }} 
                onRegenerate={onRegenerate} 
                regeneratingPart={regeneratingPart} 
                openPopoverPartId={openPopoverPartId} 
                isEditing={isEditing} 
                editedQuiz={editedPlan.quiz || { questions: [] }} 
                onEditChange={(quiz) => handlePartUpdate({ quiz })} 
                onGenerateNewPart={handleGenerateNewQuizQuestion} 
                badges={[
                    { label: 'Evaluate', type: 'Bloom' },
                    { label: 'Judgement', type: '6 PoLD' }
                ]}
            /> 
        </div>
    );
};
