

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { File as FileIcon, Folder, ChevronRight, ChevronDown, FilePlus, FolderPlus } from '../../../../components/icons';
import { IconButton, Input } from '../../../../components/ui';
import type { FileNode } from '../../../../types';
import { ContextMenu } from './ContextMenu';

const FileNodeDisplay: React.FC<{ 
    node: FileNode; 
    level: number;
    onSelectFile: (path: string[]) => void;
    selectedFilePath: string[] | null;
    currentPath: string[];
    onFileRename: (path: string[], newName: string) => boolean;
    onFileDelete: (path: string[]) => void;
    renamingPath: string[] | null;
    setRenamingPath: (path: string[] | null) => void;
    onContextMenu: (e: React.MouseEvent, path: string[]) => void;
}> = ({ node, level, onSelectFile, selectedFilePath, currentPath, onFileRename, onFileDelete, renamingPath, setRenamingPath, onContextMenu }) => {
    const [isOpen, setIsOpen] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const path = [...currentPath, node.name];
    const isFolder = node.type === 'folder';
    const isSelected = selectedFilePath?.join('/') === path.join('/');
    const isRenaming = renamingPath?.join('/') === path.join('/');

    useEffect(() => {
        if (isRenaming) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isRenaming]);

    const handleRename = () => {
        if (!inputRef.current || !renamingPath) return;
        const newName = inputRef.current.value;
        if (newName !== node.name) {
            onFileRename(renamingPath, newName);
        }
        setRenamingPath(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleRename();
        if (e.key === 'Escape') setRenamingPath(null);
    };

    const Icon = isFolder ? Folder : FileIcon;
    const paddingLeft = `${level * 1.25}rem`;

    const handleClick = () => {
        if (isFolder) {
            setIsOpen(!isOpen);
        } else {
            onSelectFile(path);
        }
    };

    return (
        <div>
            <div
                className={`flex items-center p-1 rounded-md hover:bg-slate-100 cursor-pointer text-sm group ${isSelected ? 'bg-primary-lightest text-primary-dark font-medium' : 'text-slate-700'}`}
                style={{ paddingLeft }}
                onClick={handleClick}
                onContextMenu={(e) => onContextMenu(e, path)}
            >
                {isFolder ? (
                    <span className="mr-1">
                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                ) : (
                    <span className="w-4 h-4 mr-1"></span> // Placeholder for alignment
                )}
                <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${isFolder ? 'text-sky-600' : 'text-slate-500'}`} />
                {isRenaming ? (
                    <Input
                        ref={inputRef}
                        defaultValue={node.name}
                        onBlur={handleRename}
                        onKeyDown={handleKeyDown}
                        className="!p-0 !h-6 !text-sm !border-primary-focus"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="truncate">{node.name}</span>
                )}
            </div>
            {isFolder && isOpen && node.children && (
                 <div>
                    {node.children.sort((a,b) => {
                        if (a.type === b.type) return a.name.localeCompare(b.name);
                        return a.type === 'folder' ? -1 : 1;
                    }).map(child => (
                        <FileNodeDisplay 
                            key={child.name} 
                            node={child} 
                            level={level + 1}
                            onSelectFile={onSelectFile}
                            selectedFilePath={selectedFilePath}
                            currentPath={path}
                            onFileRename={onFileRename}
                            onFileDelete={onFileDelete}
                            renamingPath={renamingPath}
                            setRenamingPath={setRenamingPath}
                            onContextMenu={onContextMenu}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const FileExplorer: React.FC<{ 
    fileStructure: FileNode[] | undefined;
    onSelectFile: (path: string[]) => void;
    selectedFilePath: string[] | null;
    onFileCreate: (parentPath: string[], type: 'file' | 'folder') => string[] | undefined;
    onFileRename: (path: string[], newName: string) => boolean;
    onFileDelete: (path: string[]) => void;
    renamingPath: string[] | null;
    setRenamingPath: (path: string[] | null) => void;
}> = (props) => {
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, path: string[] } | null>(null);
    const explorerRef = useRef<HTMLDivElement>(null);

    const tree = props.fileStructure || [];
    
    const findNodeByPath = (nodes: FileNode[], path: string[]): FileNode | null => {
        if (path.length === 0) return null;
        const [current, ...rest] = path;
        const node = nodes.find(n => n.name === current);
        if (!node) return null;
        if (rest.length === 0) return node;
        return findNodeByPath(node.children || [], rest);
    };

    const getParentPathForCreation = (): string[] => {
        if (!props.selectedFilePath) return [];
        const selectedNode = findNodeByPath(tree, props.selectedFilePath);
        return selectedNode?.type === 'folder' ? props.selectedFilePath : props.selectedFilePath.slice(0, -1);
    };

    const handleCreate = (type: 'file' | 'folder') => {
        const parentPath = getParentPathForCreation();
        const newPath = props.onFileCreate(parentPath, type);
        if (newPath) {
            props.setRenamingPath(newPath);
        }
    };

    const handleContextMenu = (e: React.MouseEvent, path: string[]) => {
        e.preventDefault();
        e.stopPropagation();
        if (explorerRef.current) {
            const rect = explorerRef.current.getBoundingClientRect();
            setContextMenu({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                path
            });
        }
    };
    
    const contextMenuOptions = useMemo(() => {
        if (!contextMenu) return [];

        const isProtectedFile =
            contextMenu.path.length === 1 &&
            (contextMenu.path[0].toLowerCase() === 'readme.md' || contextMenu.path[0].toLowerCase() === 'setup.md');

        return [
            { label: 'Rename', action: () => props.setRenamingPath(contextMenu.path), disabled: isProtectedFile },
            { label: 'Delete', action: () => props.onFileDelete(contextMenu.path), disabled: isProtectedFile },
        ];
    }, [contextMenu, props]);

    if (!tree || tree.length === 0) {
        return <div className="text-sm text-slate-500">No file structure defined.</div>;
    }

    return (
        <div className="relative h-full flex flex-col" ref={explorerRef}>
            <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <h3 className="text-sm font-semibold text-slate-800">File Explorer</h3>
                <div className="flex items-center gap-1">
                    <IconButton icon={FilePlus} tooltipText="New File" onClick={() => handleCreate('file')} className="!w-7 !h-7" />
                    <IconButton icon={FolderPlus} tooltipText="New Folder" onClick={() => handleCreate('folder')} className="!w-7 !h-7" />
                </div>
            </div>
            <div className="space-y-0.5 overflow-y-auto flex-1">
                {tree.sort((a,b) => {
                        if (a.type === b.type) return a.name.localeCompare(b.name);
                        return a.type === 'folder' ? -1 : 1;
                    }).map(node => (
                    <FileNodeDisplay 
                        key={node.name} 
                        node={node} 
                        level={0} 
                        currentPath={[]}
                        onContextMenu={handleContextMenu}
                        {...props}
                    />
                ))}
            </div>
            {contextMenu && <ContextMenu {...contextMenu} options={contextMenuOptions} onClose={() => setContextMenu(null)} />}
        </div>
    );
};