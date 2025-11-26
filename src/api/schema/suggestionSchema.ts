import { Type } from '@google/genai';

export const suggestionSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: 'A very short, 3-5 word summary of the improvement suggestion.'
    },
    suggestion: {
      type: Type.STRING,
      description: 'The full, rewritten, improved prompt.'
    },
  },
  required: ['summary', 'suggestion'],
};
