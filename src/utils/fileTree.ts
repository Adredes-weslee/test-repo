import type { FileNode } from '../types';

export const addNodeToTree = (nodes: FileNode[], parentPath: string[], newNode: FileNode): FileNode[] => {
    if (parentPath.length === 0) {
        if (nodes.some(n => n.name === newNode.name)) return nodes;
        return [...nodes, newNode];
    }
    const [current, ...rest] = parentPath;
    return nodes.map(node => {
        if (node.name === current && node.type === 'folder' && node.children) {
            return { ...node, children: addNodeToTree(node.children, rest, newNode) };
        }
        return node;
    });
};

export const renameNodeInTree = (nodes: FileNode[], path: string[], newName: string): FileNode[] => {
    if (path.length === 1) {
        return nodes.map(node => (node.name === path[0] ? { ...node, name: newName } : node));
    }
    const [current, ...rest] = path;
    return nodes.map(node => {
        if (node.name === current && node.type === 'folder' && node.children) {
            return { ...node, children: renameNodeInTree(node.children, rest, newName) };
        }
        return node;
    });
};

export const deleteNodeFromTree = (nodes: FileNode[], path: string[]): FileNode[] => {
    if (path.length === 1) {
        return nodes.filter(node => node.name !== path[0]);
    }
    const [current, ...rest] = path;
    return nodes.map(node => {
        if (node.name === current && node.type === 'folder' && node.children) {
            return { ...node, children: deleteNodeFromTree(node.children, rest) };
        }
        return node;
    });
};

export const getChildrenOfPath = (nodes: FileNode[], path: string[]): FileNode[] => {
    if (path.length === 0) return nodes;
    let currentLevel = nodes;
    for (const part of path) {
        const node = currentLevel.find(n => n.name === part);
        if (node && node.type === 'folder' && node.children) {
            currentLevel = node.children;
        } else {
            return [];
        }
    }
    return currentLevel;
};

export const getFilePaths = (nodes: FileNode[], path: string[] = []): string[][] => {
    let paths: string[][] = [];
    for (const node of nodes) {
        const newPath = [...path, node.name];
        if (node.type === 'file') {
            paths.push(newPath);
        }
        if (node.type === 'folder' && node.children) {
            paths = paths.concat(getFilePaths(node.children, newPath));
        }
    }
    return paths;
};

export const updateFileContentInTree = (nodes: FileNode[], path: string[], content: string): FileNode[] => {
    return nodes.map(node => {
        if (node.name === path[0]) {
            if (path.length === 1 && node.type === 'file') {
                return { ...node, content };
            }
            if (node.type === 'folder' && node.children) {
                return { ...node, children: updateFileContentInTree(node.children, path.slice(1), content) };
            }
        }
        return node;
    });
};
