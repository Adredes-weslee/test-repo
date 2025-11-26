
import { Type } from '@google/genai';

export const lessonOutcomeSchema = {
    type: Type.OBJECT,
    properties: {
        lessonOutcome: { type: Type.STRING },
    },
    required: ['lessonOutcome'],
};

export const lessonOutlineSchema = {
    type: Type.OBJECT,
    properties: {
        lessonOutline: { type: Type.STRING },
    },
    required: ['lessonOutline'],
};

export const lessonTitleSchema = {
    type: Type.OBJECT,
    properties: {
        lessonTitle: { type: Type.STRING },
    },
    required: ['lessonTitle'],
};

export const curriculumTitleSchema = {
    type: Type.OBJECT,
    properties: {
        curriculumTitle: { type: Type.STRING, description: 'A new, regenerated title for the entire curriculum.' },
    },
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

export const projectSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING },
        objective: { type: Type.STRING },
        deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['description', 'objective', 'deliverables'],
};