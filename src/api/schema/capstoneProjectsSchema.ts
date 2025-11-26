import { Type } from '@google/genai';

export const capstoneProjectsSchema = {
  type: Type.OBJECT,
  properties: {
    projects: {
      type: Type.ARRAY,
      description: 'An array of distinct capstone project outlines.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The title of the capstone project.' },
          description: { type: Type.STRING, description: 'A brief, one-sentence description of the project.' },
          learningOutcomes: {
            type: Type.ARRAY,
            description: 'A list of 3-4 key learning outcomes for the project.',
            items: { type: Type.STRING }
          },
          tags: {
            type: Type.ARRAY,
            description: "A list of 3-4 relevant tags (e.g., key technology). The first tag MUST be the difficulty level: 'Beginner', 'Intermediate', or 'Advanced'.",
            items: { type: Type.STRING }
          },
          recommended: { type: Type.BOOLEAN, description: 'Whether this project is the most recommended one. Exactly one project must be true.' },
          techStack: {
            type: Type.ARRAY,
            description: 'A list of 3-5 key technologies and frameworks for the project. Should be an empty array for non-programming projects.',
            items: { type: Type.STRING }
          },
          projectRequirements: {
            type: Type.ARRAY,
            description: 'A list of 3-4 high-level project requirements.',
            items: { type: Type.STRING }
          },
          deliverables: {
            type: Type.ARRAY,
            description: 'A list of 2-3 expected deliverables.',
            items: { type: Type.STRING }
          }
        },
        required: ['title', 'description', 'learningOutcomes', 'tags', 'recommended', 'projectRequirements', 'deliverables']
      }
    },
    agentThoughts: {
      type: Type.ARRAY,
      description: 'A step-by-step list of thoughts from the AI agent on how it generated the project ideas.',
      items: { type: Type.STRING }
    }
  },
  required: ['projects', 'agentThoughts']
};