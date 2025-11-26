import { ai } from '../core/api/client';
import { API_MODELS } from '../config';
import type { CapstoneProject } from '../types';
import { Type } from '@google/genai';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { getReadmePartPrompt } from './prompts';
import type { ReadmePart } from './prompts';
import { z } from 'zod';

const readmePartContentSchema = {
    type: Type.OBJECT,
    properties: {
        content: { type: Type.STRING, description: 'The markdown content for the specified section.' },
    },
    required: ['content'],
};

const ReadmePartContentZodSchema = z.object({
    content: z.string(),
});

const getReadmePlan = (): ReadmePart[] => [
    { partName: 'Project Title', description: 'Create a level-1 heading with the project title.' },
    { partName: 'Overview', description: 'Write a 1-2 paragraph summary expanding on the project\'s purpose and key goals.' },
    { partName: 'Features', description: 'Create a bulleted list of the main features, based on the project requirements.' },
    { partName: 'Tech Stack', description: 'Create a bulleted list of the core technologies used.' },
    { partName: 'Getting Started', description: 'Briefly explain that detailed setup instructions are in `SETUP.md` and provide a link to it (`./SETUP.md`).' },
    { partName: 'Running the Project', description: 'Provide clear, step-by-step instructions with markdown code blocks for how to run the application in a development environment.' },
    { partName: 'Deployment', description: 'Provide a high-level overview of how to build and deploy the application.' },
];

const getSetupMdPlan = (): ReadmePart[] => [
    { partName: 'SETUP Instructions', description: 'Create a level-1 heading `SETUP Instructions`.' },
    { partName: 'Prerequisites', description: 'Create a bulleted list of all software and tools that must be installed before starting, including version numbers (e.g., Node.js v18+).' },
    { partName: 'Installation', description: 'Provide a step-by-step guide on how to install project dependencies (e.g., `npm install`).' },
    { partName: 'Environment Variables', description: 'Explain how to set up environment variables. Include a markdown code block with an example `.env.example` file.' },
];

const generateReadmePart = async (project: CapstoneProject, part: ReadmePart): Promise<string> => {
    const prompt = getReadmePartPrompt(project, part);

    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT,
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: readmePartContentSchema,
            }
        });
        const parsed = cleanAndParseJson(response.text);
        const validated = ReadmePartContentZodSchema.parse(parsed);
        return validated.content;
    } catch (error) {
        console.error(`Error generating README part ${part.partName}:`, error);
        return `## ${part.partName}\n\nContent generation for this section failed.`;
    }
};

export const generateReadmeContent = async (
  project: CapstoneProject,
  filePath: string,
  onProgress: (progress: number, message: string) => void
): Promise<string> => {
    const isReadme = filePath.toLowerCase() === 'readme.md';
    const plan = isReadme ? getReadmePlan() : getSetupMdPlan();
    
    let fullContent = '';

    for (let i = 0; i < plan.length; i++) {
        onProgress(i / plan.length, `Generating ${plan[i].partName} for ${filePath}...`);
        const part = plan[i];
        const partContent = await generateReadmePart(project, part);
        
        const heading = part.partName.includes('Title') || part.partName.includes('Instructions')
            ? ''
            : `## ${part.partName}\n\n`;
        
        fullContent += `${partContent}\n\n`;
    }
    
    onProgress(1, `Finished ${filePath}`);
    return fullContent.trim();
};