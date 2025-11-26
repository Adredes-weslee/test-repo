import { ai } from '../core/api/client';
import { fileStructureSchema } from './schema';
import { API_MODELS } from '../config';
import { cleanAndParseJson } from '../core/utils/jsonUtils';
import type { CapstoneProject, ProjectFilesData, FileNode } from '../types';
import { getProjectFileStructurePrompt } from './prompts';
import { ProjectFilesDataSchema } from '../types/zod';

const renamePdfToMd = (nodes: FileNode[]): FileNode[] => {
    return nodes.map(node => {
        if (node.type === 'file' && node.name.toLowerCase().endsWith('.pdf')) {
            const newName = node.name.substring(0, node.name.lastIndexOf('.')) + '.md';
            return { ...node, name: newName };
        }
        if (node.type === 'folder' && node.children) {
            return { ...node, children: renamePdfToMd(node.children) };
        }
        return node;
    });
};

export const generateProjectFileStructure = async (
  project: CapstoneProject,
): Promise<ProjectFilesData> => {
    
  const prompt = getProjectFileStructurePrompt(project);
  
  try {
      const response = await ai.models.generateContent({
        model: API_MODELS.GENERATE_DETAILED_PROJECT,
        contents: [prompt],
        config: {
          responseMimeType: 'application/json',
          responseSchema: fileStructureSchema
        }
      });

      const parsedJson = cleanAndParseJson(response.text);
      const generatedData = ProjectFilesDataSchema.parse(parsedJson);

      if (generatedData.fileStructure) {
        generatedData.fileStructure = renamePdfToMd(generatedData.fileStructure);
      }
      return generatedData;
  } catch (error) {
    console.error("Error generating project file structure:", error);
    throw error;
  }
};