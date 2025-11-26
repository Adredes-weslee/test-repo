import { Type } from '@google/genai';

export const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    lessonOutcome: {
      type: Type.STRING,
      description: 'A concise learning outcome for this specific lesson.',
    },
    lessonOutline: {
      type: Type.STRING,
      description: 'A markdown-formatted outline of the key topics covered in the lesson.',
    },
    exercises: {
      type: Type.ARRAY,
      description: 'An array of interactive exercises related to the lesson.',
      items: {
        type: Type.OBJECT,
        properties: {
            problem: { type: Type.STRING, description: 'The problem statement for the exercise.' },
            hint: { type: Type.STRING, description: 'A hint to help the user if they are stuck.' },
            answer: { type: Type.STRING, description: 'The correct answer or solution to the problem.' },
            explanation: { type: Type.STRING, description: 'A detailed explanation of the solution.' },
        },
        required: ['problem', 'hint', 'answer', 'explanation'],
      }
    },
    quiz: {
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
    },
    project: {
      type: Type.OBJECT,
      description: 'A small project to apply the learned concepts.',
      properties: {
        description: { type: Type.STRING, description: 'A detailed brief of the project.' },
        objective: { type: Type.STRING, description: 'The learning objectives of the project.' },
        deliverables: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of what the student needs to submit.' },
      },
      required: ['description', 'objective', 'deliverables'],
    },
  },
  required: ['lessonOutcome', 'lessonOutline', 'exercises', 'quiz', 'project'],
};