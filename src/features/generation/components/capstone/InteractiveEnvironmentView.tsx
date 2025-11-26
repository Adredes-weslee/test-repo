import React, { useState, useEffect } from 'react';
import { Button, LoadingSpinner } from '../../../../components/ui';
import { Rocket, Terminal } from '../../../../components/icons';
import type { CapstoneProject, FileNode } from '../../../../types';
import { FileExplorer } from './FileExplorer';
import { EditorPanel } from './EditorPanel';
import { InstructionsPanel } from './InstructionsPanel';
import { OutputPanel, Layout } from './OutputPanel';

const findFileInTree = (nodes: FileNode[], path: string[]): FileNode | null => {
    if (!nodes || path.length === 0) return null;
    const [current, ...rest] = path;
    const node = nodes.find(n => n.name === current);
    if (!node) return null;
    if (rest.length === 0) return node;
    return (node.type === 'folder' && node.children) ? findFileInTree(node.children, rest) : null;
};

const updateFileInTree = (nodes: FileNode[], path: string[], newContent: string): FileNode[] => {
    return nodes.map(node => {
        if (node.name === path[0]) {
            if (path.length === 1 && node.type === 'file') {
                return { ...node, content: newContent };
            }
            if (node.type === 'folder' && node.children) {
                return { ...node, children: updateFileInTree(node.children, path.slice(1), newContent) };
            }
        }
        return node;
    });
};

interface InteractiveEnvironmentViewProps {
    activeProject: CapstoneProject | null;
    updateSelectedProject: (project: CapstoneProject) => void;
    handleBackToConfiguration: () => void;
    handleGoToExport: () => void;
    handleApplyInstructions: (instructions: string) => void;
    isRegenerating: boolean;
    handleCancelRegeneration: () => void;
    capstoneProgress: number;
    handleFileCreate: (parentPath: string[], type: 'file' | 'folder') => string[] | undefined;
    handleFileRename: (path: string[], newName: string) => boolean;
    handleFileDelete: (path: string[]) => void;
}

export const InteractiveEnvironmentView: React.FC<InteractiveEnvironmentViewProps> = (props) => {
    const { activeProject, updateSelectedProject, handleApplyInstructions, isRegenerating, capstoneProgress, handleCancelRegeneration, handleFileDelete } = props;
    const [layout, setLayout] = useState<Layout>('terminal');
    const [selectedFilePath, setSelectedFilePath] = useState<string[] | null>(null);
    const [renamingPath, setRenamingPath] = useState<string[] | null>(null);
    
    const selectedFile = selectedFilePath ? findFileInTree(activeProject?.fileStructure || [], selectedFilePath) : null;

    useEffect(() => {
        if (activeProject?.fileStructure) {
            setRenamingPath(null);
            const findFirstFile = (nodes: FileNode[], basePath: string[] = []): string[] | null => {
                for (const node of nodes) {
                    const currentPath = [...basePath, node.name];
                    if (node.type === 'file') return currentPath;
                    if (node.type === 'folder' && node.children) {
                        const nestedFile = findFirstFile(node.children, currentPath);
                        if (nestedFile) return nestedFile;
                    }
                }
                return null;
            };
            const firstFilePath = findFirstFile(activeProject.fileStructure);
            setSelectedFilePath(firstFilePath);
        }
    }, [activeProject?.id]);

    const handleFileContentChange = (newContent: string) => {
        if (!activeProject || !selectedFilePath) return;
        const newFileStructure = updateFileInTree(activeProject.fileStructure!, selectedFilePath, newContent);
        updateSelectedProject({ ...activeProject, fileStructure: newFileStructure });
    };

    const onFileDelete = (path: string[]) => {
        handleFileDelete(path);
        if (selectedFilePath?.join('/') === path.join('/')) {
            setSelectedFilePath(null);
        }
    }

    if (!activeProject) return <div>Loading...</div>;

    return (
        <div className="animate-fadeIn flex flex-col h-[calc(100vh-200px)] relative">
            {isRegenerating && (
                <LoadingSpinner
                    title="Applying Instructions"
                    message="AI is modifying the project files..."
                    progress={capstoneProgress}
                    onCancel={handleCancelRegeneration}
                />
            )}
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Interactive Environment</h2>
                    <p className="text-slate-600 mt-1">Test the generated project files and regenerate assets as needed.</p>
                </div>
                <div className="flex gap-4">
                    <Button onClick={props.handleBackToConfiguration} variant="secondary">Edit Project Details</Button>
                    <Button onClick={props.handleGoToExport} icon={Rocket}>Finalize & Export</Button>
                </div>
            </div>
            
            <div className="flex gap-4 flex-1 min-h-0">
                {/* Left Column */}
                <div className="w-1/3 lg:w-1/4 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col h-3/4">
                        <FileExplorer 
                            fileStructure={activeProject.fileStructure}
                            onSelectFile={setSelectedFilePath}
                            selectedFilePath={selectedFilePath}
                            onFileCreate={props.handleFileCreate}
                            onFileRename={props.handleFileRename}
                            onFileDelete={onFileDelete}
                            renamingPath={renamingPath}
                            setRenamingPath={setRenamingPath}
                        />
                    </div>
                    <InstructionsPanel onApply={handleApplyInstructions} isRegenerating={isRegenerating} />
                </div>

                {/* Right Column */}
                <div className="w-2/3 lg:w-3/4 flex flex-col h-full">
                        <EditorPanel 
                            selectedFile={selectedFile}
                            selectedFilePath={selectedFilePath}
                            onFileContentChange={handleFileContentChange}
                        />
                </div>
            </div>
        </div>
    );
};