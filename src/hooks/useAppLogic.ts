import { useNavigationStore, useCurriculumStore, useContentLibraryStore } from '../store';
import type { Curriculum, ContentItem, CapstoneProject } from '../types';

export const useAppLogic = () => {
    const navigateTo = useNavigationStore((state) => state.navigateTo);
    const { 
        setSelectedCurriculum, 
        setSelectedCapstoneProject, 
        setStartGenerationImmediately,
        workflowStartedFrom,
        setWorkflowStartedFrom,
    } = useCurriculumStore();
    const setActiveContentItem = useContentLibraryStore((state) => state.setActiveContentItem);

    const selectCurriculumAndSwitchToGeneration = (curriculum: Curriculum) => {
        if (!workflowStartedFrom) {
            setWorkflowStartedFrom('course');
        }
        setSelectedCurriculum(curriculum);
        setStartGenerationImmediately(true);
        navigateTo('Generation');
    };

    const selectCapstoneProjectAndSwitchToGeneration = (project: CapstoneProject) => {
        if (!workflowStartedFrom) {
            setWorkflowStartedFrom('project');
        }
        setSelectedCapstoneProject(project);
        navigateTo('Generation');
    };

    const viewContentItemInLibrary = (item: ContentItem) => {
        setActiveContentItem(item);
        navigateTo('Library');
    };

    return {
        selectCurriculumAndSwitchToGeneration,
        selectCapstoneProjectAndSwitchToGeneration,
        viewContentItemInLibrary,
    };
};