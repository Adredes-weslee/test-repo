
import { Type } from '@google/genai';

export const slideContentSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'The main title of the slide.' },
    bullets: { 
        type: Type.ARRAY, 
        description: 'Key points or bullet content for the slide.',
        items: { type: Type.STRING }
    },
    speakerNotes: { type: Type.STRING, description: 'Detailed speaker notes explaining the slide content.' },
    visualDescription: { type: Type.STRING, description: 'A description of the visual layout, images, or diagrams for the slide.' },
    layoutSuggestion: { type: Type.STRING, description: 'Suggestion for slide layout (e.g., "Two Column", "Title Only", "Image Right").' }
  },
  required: ['title', 'bullets', 'speakerNotes', 'visualDescription', 'layoutSuggestion']
};

export const slidesGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        slides: {
            type: Type.ARRAY,
            description: 'An array of slide objects representing the presentation deck.',
            items: slideContentSchema
        },
        designRationale: { type: Type.STRING, description: 'Explanation of how Mayer\'s Principles and UDL were applied.' }
    },
    required: ['slides', 'designRationale']
};
