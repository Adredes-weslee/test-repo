import { ai } from '../core/api/client';
import { fileStructureSchema } from './schema';
import { API_MODELS, appConfig } from '../config';
import { simulateProgress } from '../utils';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import type { CapstoneProject, ProjectFilesData } from '../types';
import { buildProjectFileRegenerationPrompt } from './prompts';
import { ProjectFilesDataSchema } from '../types/zod';

export const regenerateProjectFiles = async (
  project: CapstoneProject,
  instructions: string,
  onProgress: (progress: number) => void
): Promise<ProjectFilesData> => {
    
  const prompt = buildProjectFileRegenerationPrompt(project, instructions);
  
  const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.capstoneDetails, onProgress);

  try {
      const response = await ai.models.generateContent({
        model: API_MODELS.GENERATE_DETAILED_PROJECT, // Use the powerful model for code generation
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: fileStructureSchema
        }
      });
      clearInterval(progressInterval);
      onProgress(100);

      const parsedJson = cleanAndParseJson(response.text);
      const generatedData = ProjectFilesDataSchema.parse(parsedJson);
      return generatedData;
  } catch (error) {
    clearInterval(progressInterval);
    onProgress(0);
    console.error("Error regenerating project files:", error);
    throw error;
  }
};