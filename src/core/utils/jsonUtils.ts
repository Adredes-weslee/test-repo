import { z } from 'zod';

export const cleanAndParseJson = (jsonString: string): unknown => {
    let cleanedString = jsonString.trim();

    // The AI model can sometimes wrap the JSON response in markdown code fences.
    // We need to strip them before parsing.
    if (cleanedString.startsWith('```json')) {
        cleanedString = cleanedString.substring(7);
    }
    if (cleanedString.startsWith('```')) {
        cleanedString = cleanedString.substring(3);
    }
    if (cleanedString.endsWith('```')) {
        cleanedString = cleanedString.slice(0, -3);
    }

    cleanedString = cleanedString.trim();

    // Sometimes the model might return JSON with trailing commas which is invalid.
    // This is a simple regex to remove them. It's not foolproof but handles common cases.
    cleanedString = cleanedString.replace(/,\s*([}\]])/g, '$1');

    try {
        return JSON.parse(cleanedString);
    } catch (parseError) {
        console.error("Failed to parse cleaned JSON:", parseError);
        console.error("Original malformed JSON string:", jsonString);
        console.error("Attempted to parse:", cleanedString);
        
        if (parseError instanceof z.ZodError) {
             throw new Error(`ZOD_VALIDATION_ERROR: ${parseError.message}`);
        }
        // Re-throw a specific error to be handled by the caller.
        throw new Error(`JSON_PARSE_ERROR: ${(parseError as Error).message}`);
    }
};