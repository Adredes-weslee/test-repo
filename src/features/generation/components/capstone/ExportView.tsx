import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui';
import { Check, Rocket, File as FileIcon } from '../../../../components/icons';
import type { CapstoneProject, FileNode } from '../../../../types';
import JSZip from 'jszip';
import saveAs from 'file-saver';

interface ExportViewProps {
    activeProject: CapstoneProject | null;
    onDiscard: () => void;
}

const addFilesToZip = (zip: JSZip, nodes: FileNode[]) => {
    nodes.forEach(node => {
        if (node.type === 'file') {
            zip.file(node.name, node.content || '', { binary: false });
        } else if (node.type === 'folder' && node.children) {
            const folderZip = zip.folder(node.name);
            if (folderZip) {
                addFilesToZip(folderZip, node.children);
            }
        }
    });
};


export const ExportView: React.FC<ExportViewProps> = ({ activeProject, onDiscard }) => {
    const [isPreparing, setIsPreparing] = useState(true);
    const [isZipping, setIsZipping] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsPreparing(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleDownloadZip = async () => {
        if (!activeProject || !activeProject.fileStructure) {
            console.error("No project data to zip.");
            return;
        }

        setIsZipping(true);
        try {
            const zip = new JSZip();
            addFilesToZip(zip, activeProject.fileStructure);
            const blob = await zip.generateAsync({ type: "blob" });
            const projectName = activeProject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            saveAs(blob, `${projectName}.zip`);
        } catch (error) {
            console.error("Error creating zip file:", error);
        } finally {
            setIsZipping(false);
        }
    };

    const handleDownloadMarkdown = () => {
        if (!activeProject) return;
        let markdown = `# ${activeProject.title}\n\n`;
        
        if (activeProject.detailedDescription) {
            markdown += `${activeProject.detailedDescription}\n\n`;
        } else {
            markdown += `## Overview\n\n${activeProject.description}\n\n`;
        }
        
        // The detailedDescription from the AI already contains these sections in a well-formatted way.
        // We only add them if they somehow weren't generated.
        if (activeProject.learningOutcomes?.length > 0 && !markdown.includes('## Learning Outcomes')) {
            markdown += `## Learning Outcomes\n\n${activeProject.learningOutcomes.map(o => `* ${o}`).join('\n')}\n\n`;
        }
        if (activeProject.projectRequirements?.length > 0 && !markdown.includes('## Core Features') && !markdown.includes('## Project Requirements')) {
            markdown += `## Project Requirements\n\n${activeProject.projectRequirements.map(r => `* ${r}`).join('\n')}\n\n`;
        }
        if (activeProject.deliverables?.length > 0 && !markdown.includes('## Deliverables')) {
            markdown += `## Deliverables\n\n${activeProject.deliverables.map(d => `* ${d}`).join('\n')}\n\n`;
        }
    
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const projectName = activeProject.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        saveAs(blob, `${projectName}_brief.md`);
    };

    const isProgrammingProject = activeProject?.techStack && activeProject.techStack.length > 0;

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto border border-slate-100 animate-fadeIn text-center">
            {isPreparing ? (
                 <>
                    <div className="relative w-16 h-16 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Preparing Files...</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mt-2">
                        Your capstone project assets are being prepared for download.
                    </p>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Your Project is Ready!</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mt-2">
                        Download the generated assets for<br/><span className="font-semibold text-slate-700">{activeProject?.title}</span>.
                    </p>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {isProgrammingProject ? (
                            <>
                                <Button variant="primary" icon={Rocket} onClick={handleDownloadZip} disabled={isZipping}>
                                    {isZipping ? 'Zipping...' : 'Download ZIP File'}
                                </Button>
                                <Button variant="secondary" icon={Rocket}>
                                    Download Config File
                                </Button>
                            </>
                        ) : (
                             <div className="sm:col-span-2">
                                <Button variant="primary" icon={FileIcon} onClick={handleDownloadMarkdown}>
                                    Download Project Brief (.md)
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col text-slate-600 items-center justify-center">
                        <Button onClick={onDiscard} variant="text">
                           New Generation
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
