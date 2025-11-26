import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button, MarkdownContent } from '../../../../components/ui';
import { Eye, Modification } from '../../../../components/icons';
import type { FileNode } from '../../../../types';

const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'py': return 'python';
        case 'js': return 'javascript';
        case 'ts': return 'typescript';
        case 'html': return 'html';
        case 'css': return 'css';
        case 'json': return 'json';
        case 'md': return 'markdown';
        case 'yml':
        case 'yaml':
            return 'yaml';
        case 'dockerfile':
            return 'dockerfile';
        default:
            return 'plaintext';
    }
};

interface EditorPanelProps {
    selectedFile: FileNode | null;
    selectedFilePath: string[] | null;
    onFileContentChange: (newContent: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ selectedFile, selectedFilePath, onFileContentChange }) => {
    const [markdownView, setMarkdownView] = useState<'preview' | 'edit'>('preview');
    const language = selectedFile?.name ? getLanguageFromFileName(selectedFile.name) : 'plaintext';
    const isMarkdown = language === 'markdown';

    useEffect(() => {
        setMarkdownView('preview');
    }, [selectedFilePath]);

    return (
        <div className="bg-[#1e1e1e] rounded-md min-h-0 flex flex-col flex-1">
             <div className="bg-slate-800 px-4 py-1.5 flex justify-between items-center flex-shrink-0 border-b border-slate-600">
                <span className="text-xs text-slate-300 truncate pr-4">
                    {selectedFilePath ? selectedFilePath.join('/') : 'No file selected'}
                </span>
                {selectedFile && isMarkdown && (
                    <Button
                        variant="secondary"
                        className="!py-1 !px-2 !text-xs !bg-slate-600 hover:!bg-slate-500 !text-white border-slate-500"
                        icon={markdownView === 'preview' ? Modification : Eye}
                        onClick={() => setMarkdownView(prev => prev === 'preview' ? 'edit' : 'preview')}
                    >
                        {markdownView === 'preview' ? 'Edit' : 'Preview'}
                    </Button>
                )}
            </div>
            <div className="flex-1 min-h-0">
                {selectedFile ? (
                    isMarkdown && markdownView === 'preview' ? (
                        <div className="h-full overflow-y-auto bg-white text-slate-800 p-6">
                            <MarkdownContent content={selectedFile.content || ''} />
                        </div>
                    ) : (
                        <Editor
                            height="100%"
                            language={language}
                            value={selectedFile.content || ''}
                            onChange={(value) => onFileContentChange(value || '')}
                            theme="vs-dark"
                            loading={<div className="text-slate-400 p-4">Loading editor...</div>}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    )
                ) : (
                    <div className="p-4 text-slate-400">Select a file to view its content</div>
                )}
            </div>
        </div>
    );
};
