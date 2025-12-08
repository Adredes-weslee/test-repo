import React, { useState } from 'react';
import { projectService } from '../services';
import type { CapstoneProject, DetailedProjectData, FileNode } from '../types';
import { getFilePaths } from '../utils';
import { useToastStore } from '../store';

export const useProjectApi = (isCancelledRef: React.MutableRefObject<boolean>) => {
    const addToast = useToastStore((state) => state.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegeneratingFiles, setIsRegeneratingFiles] = useState(false);
    const [isRegeneratingPart, setIsRegeneratingPart] = useState<keyof DetailedProjectData | null>(null);
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    const generateDetails = async function* (project: CapstoneProject) {
        setIsLoading(true);
        setProgress(0);
        setLoadingMessage('Generating project specifications...');
        try {
            const generator = projectService.generateDetailedProjectParts(project);
            let partCount = 0;
            const totalParts = 5;
            for await (const part of generator) {
                if (isCancelledRef.current) return;
                partCount++;
                setProgress((partCount / totalParts) * 100);
                const partName = String(part.part).replace(/([A-Z])/g, ' $1').toLowerCase();
                setLoadingMessage(`Generating ${partName}...`);
                yield part;
            }
        } catch (error) {
            console.error("Error generating project details:", error);
            
            let message = "Failed to generate project specifications.";
            if (error instanceof Error) {
                if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                    message = "The model is overloaded. Please try again later.";
                } else {
                    message = error.message;
                }
            }
            addToast(message, { type: 'error' });
            throw error;
        } finally {
            if (!isCancelledRef.current) {
                setTimeout(() => {
                    setIsLoading(false);
                    setLoadingMessage('');
                }, 500);
            } else {
                setIsLoading(false);
                setLoadingMessage('');
            }
        }
    };
    
    const generateEnvironment = async function* (project: CapstoneProject) {
        setIsLoading(true);
        setProgress(0);
        setLoadingMessage("Planning file structure...");
        try {
            const { fileStructure } = await projectService.generateProjectFileStructure(project);
            if (isCancelledRef.current) return;
            yield { type: 'structure', data: fileStructure };

            setLoadingMessage("Generating files...");
            const filePaths = getFilePaths(fileStructure);
            const totalFiles = filePaths.length;
            for (let i = 0; i < totalFiles; i++) {
                if (isCancelledRef.current) return;
                const path = filePaths[i];
                
                const onFileProgress = (fileProgress: number, message: string) => {
                    if (!isCancelledRef.current) {
                        setProgress(((i + fileProgress) / totalFiles) * 100);
                        setLoadingMessage(`Generating file ${i + 1} of ${totalFiles}...`);
                    }
                };
                
                const content = await projectService.generateFileContent({ ...project, fileStructure }, path.join('/'), onFileProgress);
                if (isCancelledRef.current) return;
                
                yield { type: 'file', path, content };
            }
        } catch (error) {
            console.error("Error generating project environment:", error);
            let message = "Failed to generate project environment.";
            if (error instanceof Error) {
                if (error.message.startsWith('JSON_PARSE_ERROR')) {
                    message = "The AI returned an unexpected response. Generation stopped.";
                } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                    message = "The model is overloaded. Please try again later.";
                } else {
                    message = error.message;
                }
            }
            addToast(message, { type: 'error' });
            throw error;
        } finally {
            if (!isCancelledRef.current) {
                setTimeout(() => setIsLoading(false), 1000);
            } else {
                setIsLoading(false);
            }
        }
    };

    const applyInstructions = async (project: CapstoneProject, instructions: string): Promise<FileNode[] | undefined> => {
        setIsRegeneratingFiles(true);
        setProgress(0);
        try {
            const onProgress = (p: number) => { if (!isCancelledRef.current) setProgress(p); };
            const { fileStructure } = await projectService.regenerateProjectFiles(project, instructions, onProgress);
            if (isCancelledRef.current) return;
            addToast("Project files updated.", { type: 'default' });
            return fileStructure;
        } catch (error) {
            console.error("Error applying instructions:", error);
            
            let message = "Failed to apply instructions.";
            if (error instanceof Error) {
                if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                    message = "The model is overloaded. Please try again later.";
                } else {
                    message = error.message;
                }
            }
            addToast(message, { type: 'error' });
            throw error;
        } finally {
            setIsRegeneratingFiles(false);
        }
    };

    const regeneratePart = async (project: CapstoneProject, part: keyof DetailedProjectData, instructions: string) => {
        setIsRegeneratingPart(part);
        try {
            const result = await projectService.regenerateProjectPart(project, part, instructions);
            addToast(`Project ${String(part)} regenerated.`, { type: 'default' });
            return result;
        } catch (error) {
            console.error(`Error regenerating project part "${String(part)}":`, error);
            
            let message = `Failed to regenerate project ${String(part)}.`;
            if (error instanceof Error) {
                if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                    message = "The model is overloaded. Please try again later.";
                } else {
                    message = error.message;
                }
            }
            addToast(message, { type: 'error' });
            throw error;
        } finally {
            setIsRegeneratingPart(null);
        }
    };

    return {
        isLoading,
        isRegeneratingFiles,
        isRegeneratingPart,
        progress,
        loadingMessage,
        generateDetails,
        generateEnvironment,
        applyInstructions,
        regeneratePart
    };
};