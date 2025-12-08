
import { ai } from '../core/api/client';
import { API_MODELS, appConfig } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { getSlidesPrompt, getSectionSlidesPrompt } from './prompts/slidesPrompts';
import { slidesGenerationSchema } from './schema/slidesSchema';
import { z } from 'zod';

export interface Slide {
    title: string;
    bullets: string[];
    speakerNotes: string;
    visualDescription: string;
    layoutSuggestion: string;
}

const SlideSchema = z.object({
    title: z.string(),
    bullets: z.array(z.string()),
    speakerNotes: z.string(),
    visualDescription: z.string(),
    layoutSuggestion: z.string()
});

const SlidesResponseSchema = z.object({
    slides: z.array(SlideSchema),
    designRationale: z.string()
});

export type SlidesResponse = z.infer<typeof SlidesResponseSchema>;

export const generateSlides = async (
    topic: string,
    contentContext: string,
    referenceFile: File | null,
    onProgress: (progress: number) => void,
    scope: 'course' | 'lesson' = 'course'
): Promise<SlidesResponse> => {
    
    // Simulate reading file (in a real app, this would use a multimodal model)
    const referenceContext = referenceFile ? `User uploaded a reference file named: ${referenceFile.name}` : '';
    
    const prompt = getSlidesPrompt(topic, contentContext, referenceContext, scope);

    // Simulate progress
    const interval = setInterval(() => {
        onProgress(Math.random() * 80);
    }, 1000);

    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT, // Using detailed model for better reasoning
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: slidesGenerationSchema
            }
        });

        clearInterval(interval);
        onProgress(100);

        const parsedJson = cleanAndParseJson(response.text);
        return SlidesResponseSchema.parse(parsedJson);

    } catch (error) {
        clearInterval(interval);
        onProgress(0);
        console.error("Error generating slides:", error);
        throw error;
    }
};

export const generateSlideSection = async (
    sectionTitle: string,
    sectionContent: string,
    referenceFile: File | null,
): Promise<SlidesResponse> => {
    const referenceContext = referenceFile ? `User uploaded a reference file named: ${referenceFile.name}` : '';
    const prompt = getSectionSlidesPrompt(sectionTitle, sectionContent, referenceContext);

    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT,
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: slidesGenerationSchema
            }
        });

        const parsedJson = cleanAndParseJson(response.text);
        return SlidesResponseSchema.parse(parsedJson);
    } catch (error) {
        console.error(`Error generating slides for section ${sectionTitle}:`, error);
        throw error;
    }
};