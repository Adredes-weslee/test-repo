
import { ai } from '../core/api/client';
import { API_MODELS } from '../config';
import type { CapstoneProject } from '../types';
import { Type } from '@google/genai';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { ipynbPlanSchema } from './schema';
import { getIpynbPlanPrompt, getIpynbCellPrompt } from './prompts';
import type { IpynbCellPart } from './prompts';
import { z } from 'zod';

const ipynbCellContentSchema = {
    type: Type.OBJECT,
    properties: {
        source: { type: Type.STRING, description: 'The content for the Jupyter notebook cell.' },
    },
    required: ['source'],
};

const IpynbCellPartSchema = z.object({
    cellType: z.enum(['markdown', 'code']),
    description: z.string(),
});

const IpynbPlanZodSchema = z.object({
    plan: z.array(IpynbCellPartSchema),
});

const IpynbCellContentZodSchema = z.object({
    source: z.string().optional(),
});

const planIpynbGeneration = async (project: CapstoneProject, filePath: string): Promise<IpynbCellPart[]> => {
    const prompt = getIpynbPlanPrompt(project, filePath);

    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT,
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: ipynbPlanSchema,
            }
        });
        const parsed = cleanAndParseJson(response.text);
        const validated = IpynbPlanZodSchema.parse(parsed);
        return validated.plan;
    } catch (error) {
        console.error(`Error planning ipynb generation for ${filePath}:`, error);
        return [{ cellType: 'markdown', description: `A markdown cell explaining that notebook generation failed.` }];
    }
};

const generateIpynbCell = async (project: CapstoneProject, filePath: string, part: IpynbCellPart): Promise<string> => {
    const prompt = getIpynbCellPrompt(project, filePath, part);

    try {
        const response = await ai.models.generateContent({
            model: API_MODELS.GENERATE_DETAILED_PROJECT,
            contents: [prompt],
            config: {
                responseMimeType: 'application/json',
                responseSchema: ipynbCellContentSchema,
            }
        });
        const parsed = cleanAndParseJson(response.text);
        const validated = IpynbCellContentZodSchema.parse(parsed);
        return validated.source || '';
    } catch (error) {
        console.error(`Error generating cell for ${filePath}: ${part.description}`, error);
        return `# Cell content generation failed.`;
    }
};

export const generateIpynbContent = async (
  project: CapstoneProject,
  filePath: string,
  onProgress: (progress: number, message: string) => void
): Promise<string> => {
    onProgress(0, `Planning notebook: ${filePath}...`);
    const plan = await planIpynbGeneration(project, filePath);

    if (plan.length === 0) {
        onProgress(1, `Finished notebook: ${filePath}`);
        return '';
    }

    const notebook: { cells: any[], metadata: object, nbformat: number, nbformat_minor: number } = {
        cells: [],
        metadata: { language_info: { name: 'python' } },
        nbformat: 4,
        nbformat_minor: 5
    };

    for (let i = 0; i < plan.length; i++) {
        const part = plan[i];
        onProgress((i / plan.length), `Generating cell ${i + 1}/${plan.length} for ${filePath}...`);
        const cellContent = await generateIpynbCell(project, filePath, part);

        notebook.cells.push({
            cell_type: part.cellType,
            source: cellContent.split('\\n'),
            metadata: {},
            ...(part.cellType === 'code' && { outputs: [], execution_count: null })
        });
    }
    
    onProgress(1, `Finished notebook: ${filePath}`);
    return JSON.stringify(notebook, null, 2);
}
