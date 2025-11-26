import { useLocalStorage } from '../hooks';
import type { CapstoneProject, FileNode } from '../types';
import { addNodeToTree, renameNodeInTree, deleteNodeFromTree, getChildrenOfPath } from '../utils';
import { useToastStore } from '../store';
import { appConfig } from '../config';

export const useProjectFileManager = () => {
    const addToast = useToastStore((state) => state.addToast);
    const [activeProject, setActiveProject] = useLocalStorage<CapstoneProject | null>(appConfig.STORAGE_KEYS.activeCapstoneProject, null);

    const updateProject = (project: CapstoneProject | null) => {
        setActiveProject(project);
    };

    const updateProjectPart = (data: Partial<CapstoneProject>) => {
        setActiveProject(prev => prev ? { ...prev, ...data } : null);
    };
    
    const handleFileCreate = (parentPath: string[], type: 'file' | 'folder'): string[] | undefined => {
        if (!activeProject?.fileStructure) return;
        const children = getChildrenOfPath(activeProject.fileStructure, parentPath);
        const existingNames = children.map(c => c.name);
        let name = type === 'file' ? 'new-file.txt' : 'new-folder';
        let counter = 1;
        while (existingNames.includes(name)) {
            name = type === 'file' ? `new-file-${counter}.txt` : `new-folder-${counter}`;
            counter++;
        }
        const newNode: FileNode = type === 'file' ? { name, type: 'file', content: '' } : { name, type: 'folder', children: [] };
        const newFileStructure = addNodeToTree(activeProject.fileStructure, parentPath, newNode);
        setActiveProject({ ...activeProject, fileStructure: newFileStructure });
        return [...parentPath, name];
    };

    const handleFileRename = (path: string[], newName: string): boolean => {
        if (!activeProject?.fileStructure || !newName.trim()) return false;
        
        const isProtectedFile = path.length === 1 && (['readme.md', 'setup.md'].includes(path[0].toLowerCase()));
        if (isProtectedFile) {
            addToast("README.md and SETUP.md cannot be renamed.", { type: 'error' });
            return false;
        }

        const parentPath = path.slice(0, -1);
        const children = getChildrenOfPath(activeProject.fileStructure, parentPath);
        if (children.some(c => c.name === newName)) {
            addToast(`A file or folder named "${newName}" already exists.`, { type: 'error' });
            return false;
        }
        const newFileStructure = renameNodeInTree(activeProject.fileStructure, path, newName.trim());
        setActiveProject({ ...activeProject, fileStructure: newFileStructure });
        return true;
    };

    const handleFileDelete = (path: string[]) => {
        if (!activeProject?.fileStructure) return;
        
        const isProtectedFile = path.length === 1 && (['readme.md', 'setup.md'].includes(path[0].toLowerCase()));
        if (isProtectedFile) {
            addToast("README.md and SETUP.md cannot be deleted.", { type: 'error' });
            return;
        }

        const newFileStructure = deleteNodeFromTree(activeProject.fileStructure, path);
        setActiveProject({ ...activeProject, fileStructure: newFileStructure });
    };

    return {
        activeProject,
        updateProject,
        updateProjectPart,
        handleFileCreate,
        handleFileRename,
        handleFileDelete,
    };
};