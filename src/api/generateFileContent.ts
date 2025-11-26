
import { ai } from '../core/api/client';
import { API_MODELS, appConfig } from '../config';
import type { CapstoneProject } from '../types';
import { Type } from '@google/genai';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { generateReadmeContent } from './generateReadmeContent';
import { generateIpynbContent } from './generateIpynbContent';
import { getDefaultFileContentPrompt } from './prompts';
import { z } from 'zod';

const fileContentSchema = {
    type: Type.OBJECT,
    properties: {
        content: { type: Type.STRING, description: 'The complete, well-formatted code or text for the specified file.' },
    },
    required: ['content'],
};

const FileContentZodSchema = z.object({
    content: z.string(),
});

const generateDefaultFileContent = async (
    project: CapstoneProject,
    filePath: string,
    onProgress: (progress: number, message: string) => void
): Promise<string> => {
    const prompt = getDefaultFileContentPrompt(project, filePath);

    onProgress(0.5, `Generating ${filePath}...`);
    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT,
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: fileContentSchema,
            }
        });
        onProgress(1, `Finished ${filePath}`);
        const parsed = cleanAndParseJson(response.text);
        const validated = FileContentZodSchema.parse(parsed);
        return validated.content;
    } catch (error) {
        onProgress(1, `Error generating ${filePath}`);
        console.error(`Error generating content for ${filePath}:`, error);
        return `/* Content generation for ${filePath} failed. */`;
    }
}

const fileHandlers: Record<string, (project: CapstoneProject, filePath: string, onProgress: (p: number, m: string) => void) => Promise<string>> = {
    '.ipynb': generateIpynbContent,
    '.md': (project, filePath, onProgress) => {
        if (filePath.toLowerCase() === 'readme.md' || filePath.toLowerCase() === 'setup.md') {
            return generateReadmeContent(project, filePath, onProgress);
        }
        return generateDefaultFileContent(project, filePath, onProgress);
    },
};

export const generateFileContent = async (
  project: CapstoneProject,
  filePath: string,
  onProgress: (progress: number, message: string) => void // progress is 0 to 1
): Promise<string> => {
    const lowerFilePath = filePath.toLowerCase();
    const extension = `.${lowerFilePath.split('.').pop()}`;

    if (appConfig.PROJECT_GENERATION.binaryFileExtensions.includes(extension)) {
        onProgress(1, `Skipping binary file: ${filePath}`);
        return `/* Binary file content for ${filePath} is not generated. */`;
    }

    const handler = fileHandlers[extension] || generateDefaultFileContent;
    return handler(project, filePath, onProgress);
};
