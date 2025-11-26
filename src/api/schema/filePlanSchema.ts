import { Type } from '@google/genai';

export const ipynbPlanSchema = {
  type: Type.OBJECT,
  properties: {
    plan: {
      type: Type.ARRAY,
      description: 'An array of objects, where each object represents a cell in the Jupyter Notebook.',
      items: {
        type: Type.OBJECT,
        properties: {
          cellType: { type: Type.STRING, description: 'Either "markdown" or "code".' },
          description: { type: Type.STRING, description: 'A description of the cell\'s purpose and content.' },
        },
        required: ['cellType', 'description'],
      }
    }
  },
  required: ['plan'],
};
