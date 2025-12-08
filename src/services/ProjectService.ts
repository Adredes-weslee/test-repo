
import {
  generateDetailedProjectParts,
  generateProjectFileStructure,
  generateFileContent,
  regenerateProjectFiles,
  regenerateProjectPart,
  generateAndragogicalAnalysis,
} from '../api';
import type { CapstoneProject, ProjectFilesData, DetailedProjectData, AndragogicalAnalysis } from '../types';

class ProjectService {
    generateDetailedProjectParts(
        project: CapstoneProject,
    ): AsyncGenerator<{ part: keyof DetailedProjectData; data: Partial<DetailedProjectData>; }, void, undefined> {
        return generateDetailedProjectParts(project);
    }

    generateProjectFileStructure(project: CapstoneProject): Promise<ProjectFilesData> {
        return generateProjectFileStructure(project);
    }

    generateFileContent(
        project: CapstoneProject,
        filePath: string,
        onProgress: (progress: number, message: string) => void
    ): Promise<string> {
        return generateFileContent(project, filePath, onProgress);
    }

    regenerateProjectFiles(
        project: CapstoneProject,
        instructions: string,
        onProgress: (progress: number) => void
    ): Promise<ProjectFilesData> {
        return regenerateProjectFiles(project, instructions, onProgress);
    }

    regenerateProjectPart(
        project: CapstoneProject,
        partToRegenerate: keyof DetailedProjectData,
        instructions: string,
    ): Promise<Partial<DetailedProjectData>> {
        return regenerateProjectPart(project, partToRegenerate, instructions);
    }

    analyzeAndragogy(content: string): Promise<AndragogicalAnalysis> {
        return generateAndragogicalAnalysis(content, 'project');
    }
}

export const projectService = new ProjectService();
