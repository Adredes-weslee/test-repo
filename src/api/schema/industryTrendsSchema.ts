import { Type } from '@google/genai';

export const industryTrendsSchema = {
  type: Type.OBJECT,
  properties: {
    trends: {
      type: Type.ARRAY,
      description: 'An array of trending topics.',
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: 'The name of the trending topic.' },
          description: { type: Type.STRING, description: 'A short, insightful reason why this topic is currently trending.' },
          detailedDescription: { type: Type.STRING, description: 'A more detailed, multi-sentence paragraph explaining the topic, its significance, and why it\'s a valuable area of study or development.' },
          trendData: {
            type: Type.ARRAY,
            description: 'An array of 28 numbers between 0 and 100 representing the daily trend interest over the last 4 weeks. The last number represents the current day.',
            items: { type: Type.NUMBER }
          }
        },
        required: ['topic', 'description', 'detailedDescription', 'trendData']
      }
    }
  },
  required: ['trends']
};

export const trendDataSchema = {
    type: Type.OBJECT,
    properties: {
        trendData: {
            type: Type.ARRAY,
            description: 'An array of numbers representing trend interest over a specified period.',
            items: { type: Type.NUMBER }
        }
    },
    required: ['trendData']
};