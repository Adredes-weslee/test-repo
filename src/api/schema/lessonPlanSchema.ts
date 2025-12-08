
import { Type } from '@google/genai';

const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
      problem: { type: Type.STRING, description: 'The problem statement for the exercise.' },
      hint: { type: Type.STRING, description: 'A hint to help the user if they are stuck.' },
      answer: { type: Type.STRING, description: 'The correct answer or solution to the problem.' },
      explanation: { type: Type.STRING, description: 'A detailed explanation of the solution.' },
  },
  required: ['problem', 'hint', 'answer', 'explanation'],
};

const quizSchema = {
  type: Type.OBJECT,
  description: 'A short quiz to test understanding.',
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          explanation: { type: Type.STRING, description: 'A detailed explanation for why the answer is correct.' },
        },
        required: ['question', 'options', 'answer', 'explanation'],
      },
    },
  },
  required: ['questions'],
};

// 1. Overview
export const overviewSectionSchema = {
  type: Type.OBJECT,
  properties: {
    overview: {
      type: Type.STRING,
      description: 'A markdown formatted overview including Purpose, Real-world relevance, and Links to Course ILO(s).',
    },
  },
  required: ['overview'],
};

// 2. Learning Objectives
export const learningObjectivesSectionSchema = {
  type: Type.OBJECT,
  properties: {
    learningObjectives: {
      type: Type.ARRAY,
      description: 'A list of lesson-level learning objectives. Each must contain a verb from Bloom\'s Taxonomy and a clear performance expectation.',
      items: { type: Type.STRING },
    },
  },
  required: ['learningObjectives'],
};

// 3. Activation
export const activationSectionSchema = {
  type: Type.OBJECT,
  properties: {
    activation: {
      type: Type.STRING,
      description: 'Markdown content for the Activation phase (Merrill). Elicit prior knowledge, workplace experience, and connect lesson to real problems.',
    },
  },
  required: ['activation'],
};

// 4. Demonstration
export const demonstrationSectionSchema = {
  type: Type.OBJECT,
  properties: {
    demonstration: {
      type: Type.STRING,
      description: 'Markdown content for the Demonstration phase (Merrill). Show expert modelling and provide examples of quality performance.',
    },
  },
  required: ['demonstration'],
};

// 5. Application
export const applicationSectionSchema = {
  type: Type.OBJECT,
  properties: {
    application: {
      type: Type.STRING,
      description: 'Markdown content for the Application phase (Merrill). Must include an authentic task mirroring real practice, tools/tech as affordances, and scaffolded support.',
    },
  },
  required: ['application'],
};

// 6. Integration
export const integrationSectionSchema = {
  type: Type.OBJECT,
  properties: {
    integration: {
      type: Type.STRING,
      description: 'Markdown content for the Integration phase (Merrill). Learners apply concepts in a new or unfamiliar context.',
    },
  },
  required: ['integration'],
};

// 7. Feedback & Reflection
export const reflectionSectionSchema = {
  type: Type.OBJECT,
  properties: {
    reflectionAndAssessment: {
      type: Type.STRING,
      description: 'Markdown content covering Feedback & Judgement Cycle and Reflection. Include self-assessment, peer critique, and reflection questions.',
    },
  },
  required: ['reflectionAndAssessment'],
};

// 8. Exercises
export const exercisesSectionSchema = {
  type: Type.OBJECT,
  properties: {
    exercises: {
      type: Type.ARRAY,
      description: 'An array of interactive exercises related to the lesson.',
      items: exerciseSchema
    },
  },
  required: ['exercises'],
};

// 9. Quiz
export const quizSectionSchema = {
  type: Type.OBJECT,
  properties: {
    quiz: quizSchema,
  },
  required: ['quiz'],
};

// Full schema for reference or validation if needed
export const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    ...overviewSectionSchema.properties,
    ...learningObjectivesSectionSchema.properties,
    ...activationSectionSchema.properties,
    ...demonstrationSectionSchema.properties,
    ...applicationSectionSchema.properties,
    ...integrationSectionSchema.properties,
    ...reflectionSectionSchema.properties,
    ...exercisesSectionSchema.properties,
    ...quizSectionSchema.properties,
  },
  required: [
    'overview',
    'learningObjectives',
    'activation',
    'demonstration',
    'application',
    'integration',
    'reflectionAndAssessment',
    'exercises',
    'quiz',
  ],
};
