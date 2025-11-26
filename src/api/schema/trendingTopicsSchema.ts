import { Type } from '@google/genai';

export const trendingTopicsSchema = {
  type: Type.OBJECT,
  properties: {
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: 'A trending topic, library, or framework.'
      }
    }
  },
  required: ['topics']
};
