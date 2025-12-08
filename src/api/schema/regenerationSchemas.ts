
import { Type } from '@google/genai';

// Legacy / Helper
export const lessonOutcomeSchema = {
    type: Type.OBJECT,
    properties: { lessonOutcome: { type: Type.STRING } },
    required: ['lessonOutcome'],
};

export const lessonOutlineSchema = {
    type: Type.OBJECT,
    properties: { lessonOutline: { type: Type.STRING } },
    required: ['lessonOutline'],
};

export const projectSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING },
        objective: { type: Type.STRING },
        deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['description', 'objective', 'deliverables'],
};

// Common
export const lessonTitleSchema = {
    type: Type.OBJECT,
    properties: { lessonTitle: { type: Type.STRING } },
    required: ['lessonTitle'],
};

export const curriculumTitleSchema = {
    type: Type.OBJECT,
    properties: { curriculumTitle: { type: Type.STRING, description: 'A new, regenerated title for the entire curriculum.' } },
    required: ['curriculumTitle'],
};

export const exerciseSchema = {
    type: Type.OBJECT,
    properties: {
        problem: { type: Type.STRING },
        hint: { type: Type.STRING },
        answer: { type: Type.STRING },
        explanation: { type: Type.STRING },
    },
    required: ['problem', 'hint', 'answer', 'explanation'],
};

export const quizQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        answer: { type: Type.STRING },
        explanation: { type: Type.STRING },
    },
    required: ['question', 'options', 'answer', 'explanation'],
};

// New Section Schemas
export const overviewSchema = {
    type: Type.OBJECT,
    properties: { overview: { type: Type.STRING } },
    required: ['overview'],
};

export const learningObjectivesSchema = {
    type: Type.OBJECT,
    properties: { learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } } },
    required: ['learningObjectives'],
};

export const activationSchema = {
    type: Type.OBJECT,
    properties: { activation: { type: Type.STRING } },
    required: ['activation'],
};

export const demonstrationSchema = {
    type: Type.OBJECT,
    properties: { demonstration: { type: Type.STRING } },
    required: ['demonstration'],
};

export const applicationSchema = {
    type: Type.OBJECT,
    properties: { application: { type: Type.STRING } },
    required: ['application'],
};

export const integrationSchema = {
    type: Type.OBJECT,
    properties: { integration: { type: Type.STRING } },
    required: ['integration'],
};

export const reflectionAndAssessmentSchema = {
    type: Type.OBJECT,
    properties: { reflectionAndAssessment: { type: Type.STRING } },
    required: ['reflectionAndAssessment'],
};
