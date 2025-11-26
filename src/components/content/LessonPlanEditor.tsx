import React from 'react';
import type { LessonPlan, Exercise } from '../../types';
import { Collapsible, Input, IconButton, Textarea } from '../ui';
import { Lesson, Check, Exercise as ExerciseIcon, Quiz, Rocket as Project, FilePlus, Trash } from '../icons';

type QuizQuestion = LessonPlan['quiz']['questions'][0];

const EditorTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <Textarea {...props} />
);

const SectionHeader: React.FC<{ icon: React.ElementType, title: string }> = ({ icon: Icon, title }) => (
    <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-semibold text-slate-700">{title}</span>
    </div>
);

// --- Helper functions for markdown conversion ---

const exerciseToMarkdown = (exercise: Exercise): string => {
    return `**Problem:**\n${exercise.problem}\n\n**Hint:**\n${exercise.hint}\n\n**Answer:**\n${exercise.answer}\n\n**Explanation:**\n${exercise.explanation}`;
};

const parseExerciseMarkdown = (markdown: string): Exercise => {
    const problem = markdown.match(/\*\*Problem:\*\*\n([\s\S]*?)(\n\n\*\*Hint:\*\*|$)/)?.[1]?.trim() || '';
    const hint = markdown.match(/\*\*Hint:\*\*\n([\s\S]*?)(\n\n\*\*Answer:\*\*|$)/)?.[1]?.trim() || '';
    const answer = markdown.match(/\*\*Answer:\*\*\n([\s\S]*?)(\n\n\*\*Explanation:\*\*|$)/)?.[1]?.trim() || '';
    const explanation = markdown.match(/\*\*Explanation:\*\*\n([\s\S]*)/)?.[1]?.trim() || '';

    return { problem, hint, answer, explanation };
};

const quizQuestionToMarkdown = (q: QuizQuestion): string => {
    return `**Question:**\n${q.question}\n\n**Options:**\n${q.options.join('\n')}\n\n**Answer:**\n${q.answer}\n\n**Explanation:**\n${q.explanation}`;
};

const parseQuizQuestionMarkdown = (markdown: string): QuizQuestion => {
    const question = markdown.match(/\*\*Question:\*\*\n([\s\S]*?)(\n\n\*\*Options:\*\*|$)/)?.[1]?.trim() || '';
    const optionsStr = markdown.match(/\*\*Options:\*\*\n([\s\S]*?)(\n\n\*\*Answer:\*\*|$)/)?.[1]?.trim() || '';
    const options = optionsStr.split('\n').map(o => o.trim()).filter(Boolean);
    const answer = markdown.match(/\*\*Answer:\*\*\n([\s\S]*?)(\n\n\*\*Explanation:\*\*|$)/)?.[1]?.trim() || '';
    const explanation = markdown.match(/\*\*Explanation:\*\*\n([\s\S]*)/)?.[1]?.trim() || '';

    return { question, options, answer, explanation };
};

// --- Component ---

export const LessonPlanEditor: React.FC<{
    lessonPlan: Partial<LessonPlan>;
    onPlanChange: (plan: Partial<LessonPlan>) => void;
}> = ({ lessonPlan, onPlanChange }) => {

    const handleFieldChange = (field: keyof LessonPlan, value: any) => {
        onPlanChange({ ...lessonPlan, [field]: value });
    };

    const handleExerciseChange = (exIndex: number, markdown: string) => {
        const newExercises = [...(lessonPlan.exercises || [])];
        newExercises[exIndex] = parseExerciseMarkdown(markdown);
        handleFieldChange('exercises', newExercises);
    };

    const addExercise = () => {
        const newExercises = [...(lessonPlan.exercises || []), { problem: '', hint: '', answer: '', explanation: '' }];
        handleFieldChange('exercises', newExercises);
    };

    const removeExercise = (exIndex: number) => {
        const newExercises = (lessonPlan.exercises || []).filter((_, i) => i !== exIndex);
        handleFieldChange('exercises', newExercises);
    };

    const handleQuizQuestionChange = (qIndex: number, markdown: string) => {
        const newQuestions = [...(lessonPlan.quiz?.questions || [])];
        newQuestions[qIndex] = parseQuizQuestionMarkdown(markdown);
        handleFieldChange('quiz', { questions: newQuestions });
    };

    const addQuizQuestion = () => {
        const newQuestions = [...(lessonPlan.quiz?.questions || []), { question: '', options: [], answer: '', explanation: '' }];
        handleFieldChange('quiz', { questions: newQuestions });
    };

    const removeQuizQuestion = (qIndex: number) => {
        const newQuestions = (lessonPlan.quiz?.questions || []).filter((_, i) => i !== qIndex);
        handleFieldChange('quiz', { questions: newQuestions });
    };

    const handleProjectChange = (field: keyof LessonPlan['project'], value: string) => {
        const newProject = { ...(lessonPlan.project || { description: '', objective: '', deliverables: [] }), [field]: value };
        handleFieldChange('project', newProject);
    };
    
    const handleProjectDeliverablesChange = (value: string) => {
        const deliverables = value.split('\n');
        const newProject = { ...(lessonPlan.project || { description: '', objective: '', deliverables: [] }), deliverables };
        handleFieldChange('project', newProject);
    };

    return (
        <div className="space-y-4 pt-4">
            <Collapsible title={<SectionHeader icon={Check} title="Lesson Outcome" />} defaultOpen={true}>
                <EditorTextarea 
                    value={lessonPlan.lessonOutcome || ''}
                    onChange={e => handleFieldChange('lessonOutcome', e.target.value)}
                    rows={2}
                    placeholder="e.g., Students will be able to..."
                />
            </Collapsible>

            <Collapsible title={<SectionHeader icon={Lesson} title="Lesson Outline" />} defaultOpen={true}>
                <EditorTextarea 
                    value={lessonPlan.lessonOutline || ''}
                    onChange={e => handleFieldChange('lessonOutline', e.target.value)}
                    rows={15}
                    placeholder="Markdown supported content for the lesson."
                />
            </Collapsible>

            <Collapsible title={<SectionHeader icon={ExerciseIcon} title="Exercises" />} defaultOpen={true}>
                <div className="space-y-6">
                    {(lessonPlan.exercises || []).map((ex, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 relative">
                             <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-slate-700">Exercise {i+1}</h4>
                                <IconButton icon={Trash} tooltipText="Remove Exercise" variant="danger" onClick={() => removeExercise(i)} className="!w-8 !h-8" />
                            </div>
                            <EditorTextarea 
                                value={exerciseToMarkdown(ex)}
                                onChange={e => handleExerciseChange(i, e.target.value)}
                                rows={15}
                                placeholder={`**Problem:**\n...\n\n**Hint:**\n...\n\n**Answer:**\n...\n\n**Explanation:**\n...`}
                            />
                        </div>
                    ))}
                    <IconButton icon={FilePlus} tooltipText="Add Exercise" variant="primary" onClick={addExercise} />
                </div>
            </Collapsible>
            
            <Collapsible title={<SectionHeader icon={Quiz} title="Quiz" />} defaultOpen={true}>
                 <div className="space-y-6">
                    {(lessonPlan.quiz?.questions || []).map((q, i) => (
                         <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 relative">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-slate-700">Question {i+1}</h4>
                                <IconButton icon={Trash} tooltipText="Remove Question" variant="danger" onClick={() => removeQuizQuestion(i)} className="!w-8 !h-8" />
                            </div>
                            <EditorTextarea 
                                value={quizQuestionToMarkdown(q)}
                                onChange={e => handleQuizQuestionChange(i, e.target.value)}
                                rows={15}
                                placeholder={`**Question:**\n...\n\n**Options:**\nOption 1\nOption 2\n\n**Answer:**\n...\n\n**Explanation:**\n...`}
                            />
                        </div>
                    ))}
                    <IconButton icon={FilePlus} tooltipText="Add Question" variant="primary" onClick={addQuizQuestion} />
                </div>
            </Collapsible>
        </div>
    );
};