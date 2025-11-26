import { ai } from '../core/api/client';
import { capstoneProjectsSchema } from './schema';
import { API_MODELS, appConfig } from '../config';
import { simulateProgress } from '../utils';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import type { CapstoneProject } from '../types';
import { getCapstoneProjectsPrompt } from './prompts';
import { GenerateCapstoneProjectsResponseSchema } from '../types/zod';

export interface GenerateCapstoneProjectsResponse {
  projects: Omit<CapstoneProject, 'id' | 'detailedDescription' | 'fileStructure' | 'industry'>[];
  agentThoughts: string[];
}

interface FileData {
  mimeType: string;
  data: string;
}

export const generateCapstoneProjects = async (
  topic: string,
  industry: string,
  files: FileData[],
  onProgress: (progress: number) => void
): Promise<GenerateCapstoneProjectsResponse> => {
    
  const industryPrompt = industry === 'All'
    ? 'for the tech industry in general'
    : `specifically for the ${industry} industry`;
  
  const fileContextPrompt = files.length > 0
    ? `The user has provided a curriculum document. Use this curriculum as the primary source of context to generate highly relevant and tailored capstone project ideas that would be suitable for students who have completed this curriculum.`
    : '';

  const prompt = getCapstoneProjectsPrompt(topic, industryPrompt, fileContextPrompt);

  const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.capstoneDiscovery, onProgress);

  try {
      const fileParts = files.map(file => ({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data,
        },
      }));
      const allParts = [...fileParts, { text: prompt }];

      const response = await ai.models.generateContent({
        model: API_MODELS.GENERATE_CAPSTONE_PROJECTS,
        contents: files.length > 0 ? [{ parts: allParts }] : prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: capstoneProjectsSchema
        }
      });
      clearInterval(progressInterval);
      onProgress(100);

      const parsedJson = cleanAndParseJson(response.text);
      const generatedData = GenerateCapstoneProjectsResponseSchema.parse(parsedJson);

      return {
        projects: generatedData.projects || [],
        agentThoughts: generatedData.agentThoughts || []
      };
  } catch (error) {
    clearInterval(progressInterval);
    onProgress(0);
    console.error("Error generating capstone projects:", error);
    throw error;
  }
};