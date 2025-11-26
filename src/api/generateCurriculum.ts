import { ai } from '../core/api/client';
import type { GenerateCurriculumResponse } from '../types';
import { curriculumSchema } from './schema';
import { discoveryFilters, API_MODELS, appConfig } from '../config';
import { simulateProgress } from '../utils';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import { getCurriculumPrompt } from './prompts';
import { GenerateCurriculumResponseSchema } from '../types/zod';

interface FilterOptions {
  [key: string]: string;
}

interface FileData {
  mimeType: string;
  data: string;
}

export const generateCurriculum = async (
  topic: string,
  filters: FilterOptions,
  files: FileData[],
  onProgress: (progress: number) => void
): Promise<GenerateCurriculumResponse> => {
  let filterInstructions = '';

  for (const filterConfig of discoveryFilters) {
    const filterId = filterConfig.id;
    const selectedValue = filters[filterId];

    if (selectedValue && selectedValue !== 'any') {
      const selectedOption = filterConfig.options.find(opt => opt.value === selectedValue);
      if (selectedOption) {
        const valueForPrompt = selectedOption.promptValue ?? selectedValue;
        const instruction = filterConfig.promptTemplate.replace('{value}', valueForPrompt);
        filterInstructions += ` ${instruction}`;
      }
    } else if (filterId === 'difficulty' && selectedValue === 'any') {
      filterInstructions += ` For each curriculum, randomly assign a difficulty level from "Beginner", "Intermediate", or "Advanced".`;
    }
  }

  let contentBreakdownInstruction: string;
  if (filters.numLessons && filters.numLessons !== 'any') {
    // If a lesson count is specified, instruct the AI to adhere to it.
    contentBreakdownInstruction = `For the content breakdown, provide a list of lesson titles that strictly adheres to the lesson count specified in the filter.`;
  } else {
    // If no filter is applied, provide a more flexible default.
    contentBreakdownInstruction = `For the content breakdown, provide a list of lesson titles, with a varying number of titles (typically 5-7) for each outline.`;
  }
  
  const fileContextPrompt = files.length > 0 
    ? `The user has provided a project specification document. Use this document as the primary source of context to generate a highly relevant and tailored curriculum. The topic "${topic}" should be interpreted through the lens of the provided specification.`
    : '';

  const prompt = getCurriculumPrompt(topic, filterInstructions, contentBreakdownInstruction, fileContextPrompt);
  
  const progressInterval = simulateProgress(appConfig.SIMULATED_PROGRESS_DURATIONS.discovery, onProgress);

  try {
      const fileParts = files.map(file => ({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data,
        },
      }));
      const allParts = [...fileParts, { text: prompt }];

      const response = await ai.models.generateContent({
        model: API_MODELS.GENERATE_CURRICULUM,
        contents: files.length > 0 ? [{ parts: allParts }] : prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: curriculumSchema
        }
      });
      clearInterval(progressInterval);
      onProgress(100);

      const parsedJson = cleanAndParseJson(response.text);
      const generatedData = GenerateCurriculumResponseSchema.parse(parsedJson);

      return {
        curriculums: generatedData.curriculums || [],
        agentThoughts: generatedData.agentThoughts || []
      };
  } catch (error) {
    clearInterval(progressInterval);
    onProgress(0);
    console.error("Error generating curriculum data:", error);
    throw error;
  }
};