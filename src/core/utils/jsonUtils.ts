import { z } from 'zod';

export const cleanAndParseJson = (jsonString: string): unknown => {
    let cleanedString = jsonString.trim();

    // The AI model can sometimes wrap the JSON response in markdown code fences.
    // We need to strip them before parsing.
    if (cleanedString.startsWith('```json')) {
        cleanedString = cleanedString.substring(7);
    } else if (cleanedString.startsWith('```JSON')) {
        cleanedString = cleanedString.substring(7);
    } else if (cleanedString.startsWith('```')) {
        cleanedString = cleanedString.substring(3);
    }
    
    if (cleanedString.endsWith('```')) {
        cleanedString = cleanedString.slice(0, -3);
    }

    // Strip C-style comments (// and /* */) while preserving strings
    // This matches: escaped quotes, quoted strings, or comments (captured in group 1)
    // If it's a comment (group 1 is truthy), replace with empty string. Otherwise keep the match.
    cleanedString = cleanedString.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, c) => c ? "" : m);

    cleanedString = cleanedString.trim();

    // Sometimes the model might return JSON with trailing commas which is invalid.
    // This is a simple regex to remove them. It's not foolproof but handles common cases.
    cleanedString = cleanedString.replace(/,\s*([}\]])/g, '$1');

    // Fix invalid escape sequences (e.g. \c in \cos, \m in \mathcal) commonly generated in LaTeX within JSON.
    // We escape the backslash if it is followed by a character that is NOT a valid escape character.
    // Valid JSON escapes: " \ / b f n r t u
    // We use a capture group for double backslashes (\\) to preserve them (e.g. \\pi in LaTeX), 
    // and only target single backslashes not followed by valid escape chars.
    cleanedString = cleanedString.replace(/(\\\\)|(\\)(?![/\\"'bfnrtu])/g, (match, p1, p2) => {
        if (p1) return p1; // Valid double backslash, keep it as is
        return '\\\\'; // Invalid single backslash, escape it
    });

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