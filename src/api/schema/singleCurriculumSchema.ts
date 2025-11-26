import { Type } from '@google/genai';

export const singleCurriculumSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'The new title of the varied curriculum.' },
    description: { type: Type.STRING, description: 'A new brief description of the varied curriculum.' },
    tags: {
      type: Type.ARRAY,
      description: 'A new list of relevant tags (e.g., difficulty, topic).',
      items: { type: Type.STRING }
    },
    lessons: { 
        type: Type.ARRAY, 
        description: 'A new list of lesson titles for the varied curriculum.', 
        items: { type: Type.STRING } 
    },
  },
  required: ['title', 'description', 'tags', 'lessons']
};
