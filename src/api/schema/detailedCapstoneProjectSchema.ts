import { Type } from '@google/genai';

export const detailedDescriptionSchema = {
  type: Type.OBJECT,
  properties: {
    detailedDescription: { 
        type: Type.STRING, 
        description: 'A comprehensive, multi-paragraph description of the project, framed within a real-world scenario. It should outline the project\'s goals, context, and specific features to build in markdown format.' 
    },
  },
  required: ['detailedDescription']
};

export const learningOutcomesSchema = {
    type: Type.OBJECT,
    properties: {
        learningOutcomes: {
            type: Type.ARRAY,
            description: 'A refined and detailed list of 4-6 specific learning outcomes.',
            items: { type: Type.STRING }
        },
    },
    required: ['learningOutcomes']
};

export const projectRequirementsSchema = {
    type: Type.OBJECT,
    properties: {
        projectRequirements: {
            type: Type.ARRAY,
            description: 'A detailed, itemized list of functional and non-functional requirements for the project.',
            items: { type: Type.STRING }
        },
    },
    required: ['projectRequirements']
};

export const techStackSchema = {
    type: Type.OBJECT,
    properties: {
        techStack: {
            type: Type.ARRAY,
            description: 'A confirmed list of technologies, including specific libraries or versions if applicable.',
            items: { type: Type.STRING }
        },
    },
    required: ['techStack']
};

export const deliverablesSchema = {
    type: Type.OBJECT,
    properties: {
        deliverables: {
            type: Type.ARRAY,
            description: 'A detailed list of professional-quality deliverables.',
            items: { type: Type.STRING }
        },
    },
    required: ['deliverables']
};