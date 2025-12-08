
import { ai } from '../core/api/client';
import { API_MODELS } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { andragogyAnalysisSchema } from './schema';
import { getAndragogyAnalysisPrompt } from './prompts/andragogyPrompts';
import { AndragogicalAnalysisSchema } from '../types/zod';
import type { AndragogicalAnalysis } from '../types';

export const generatePedagogicalAnalysis = async (
    content: string,
    type: 'course' | 'project'
): Promise<AndragogicalAnalysis> => {
    
    const prompt = getAndragogyAnalysisPrompt(content, type);

    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT, // Use a capable model for reasoning
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: andragogyAnalysisSchema
            }
        });

        const parsedJson = cleanAndParseJson(response.text);
        return AndragogicalAnalysisSchema.parse(parsedJson);

    } catch (error) {
        console.error("Error generating pedagogical analysis:", error);
        throw error;
    }
};
