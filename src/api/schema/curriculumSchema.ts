import { Type } from '@google/genai';

export const curriculumSchema = {
  type: Type.OBJECT,
  properties: {
    curriculums: {
      type: Type.ARRAY,
      description: 'An array of curriculum outlines.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'The title of the curriculum.' },
          description: { type: Type.STRING, description: 'A brief description of the curriculum.' },
          tags: {
            type: Type.ARRAY,
            description: 'A list of relevant tags (e.g., difficulty, topic).',
            items: { type: Type.STRING }
          },
          learningOutcomes: {
            type: Type.ARRAY,
            description: 'A list of key learning outcomes.',
            items: { type: Type.STRING }
          },
          recommended: { type: Type.BOOLEAN, description: 'Whether this curriculum is the recommended one.' },
          content: {
            type: Type.OBJECT,
            properties: {
              lessons: { type: Type.ARRAY, description: 'A list of lesson titles.', items: { type: Type.STRING } },
            },
            required: ['lessons']
          }
        },
        required: ['title', 'description', 'tags', 'learningOutcomes', 'recommended', 'content']
      }
    },
    agentThoughts: {
      type: Type.ARRAY,
      description: 'A step-by-step list of thoughts from the AI agent on how it generated the curriculum outlines.',
      items: { type: Type.STRING }
    }
  },
  required: ['curriculums', 'agentThoughts']
};
