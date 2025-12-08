
import { Type } from '@google/genai';

export const detailedDescriptionSchema = {
  type: Type.OBJECT,
  properties: {
    detailedDescription: { 
        type: Type.STRING, 
        description: 'A comprehensive, multi-paragraph project brief framing the challenge as an authentic, real-world scenario.' 
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
            description: 'A detailed list of professional-quality deliverables (e.g., final artefact, reflection component).',
            items: { type: Type.STRING }
        },
    },
    required: ['deliverables']
};

export const constraintsSchema = {
    type: Type.OBJECT,
    properties: {
        constraints: {
            type: Type.ARRAY,
            description: 'A list of project constraints including tools, data, roles, timeline, and workplace conditions.',
            items: { type: Type.STRING }
        },
    },
    required: ['constraints']
};

export const futureOrientedElementSchema = {
    type: Type.OBJECT,
    properties: {
        futureOrientedElement: {
            type: Type.STRING,
            description: 'A description of an unfamiliar scenario or inquiry-based task to promote adaptability and future-oriented learning.',
        },
    },
    required: ['futureOrientedElement']
};

export const participationModelSchema = {
    type: Type.OBJECT,
    properties: {
        participationModel: {
            type: Type.STRING,
            description: 'A description of how the learner participates (Observe, Assist, Perform) throughout the project.',
        },
    },
    required: ['participationModel']
};

export const evidenceOfLearningSchema = {
    type: Type.OBJECT,
    properties: {
        evidenceOfLearning: {
            type: Type.ARRAY,
            description: 'A list of tangible evidence of learning (artefacts, demonstrations, self-evaluation).',
            items: { type: Type.STRING }
        },
    },
    required: ['evidenceOfLearning']
};

export const assessmentFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        assessmentFeedback: {
            type: Type.STRING,
            description: 'A description of the assessment strategy, formative checkpoints, and feedback mechanisms (dialogic, peer/self/expert).',
        },
    },
    required: ['assessmentFeedback']
};

export const judgementCriteriaSchema = {
    type: Type.OBJECT,
    properties: {
        judgementCriteria: {
            type: Type.ARRAY,
            description: 'A list of quality expectations and observable performance indicators.',
            items: { type: Type.STRING }
        },
    },
    required: ['judgementCriteria']
};
