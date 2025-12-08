import { useRef, useCallback, useEffect } from 'react';
import type { CapstoneProject, DiscoveryType } from '../../../types';
import { useCancellableAction } from '../../../hooks';
import { useTrendingTopics } from './useTrendingTopics';
import { useDiscoveryState } from './useDiscoveryState';
import { useDiscoveryCache } from './useDiscoveryCache';
import { useDiscoveryResults } from './useDiscoveryResults';
import { useProjectDiscoveryTrigger } from './useProjectDiscoveryTrigger';
import { useCourseDiscoveryTrigger } from './useCourseDiscoveryTrigger';
import { discoveryService } from '../../../services';
import type { GenerateCurriculumResponse } from '../../../types';
import type { GenerateCapstoneProjectsResponse } from '../../../api';
import { useToastStore, useCurriculumStore } from '../../../store';

interface FileData {
  mimeType: string;
  data: string;
}

export const useDiscovery = () => {
  const {
    discoveryType, setDiscoveryType,
    searchValue, setSearchValue,
    view, setView,
    progress, setProgress,
    filters, handleFilterChange,
    selectedIndustry, handleIndustryChange,
    resetDiscoveryState
  } = useDiscoveryState();

  const {
    cachedCurriculumResults,
    cachedProjectResults,
    saveCurriculumToCache,
    saveProjectsToCache,
    clearCache
  } = useDiscoveryCache();

  const {
    curriculumResults, setCurriculumResults,
    projectResults, setProjectResults,
    agentThoughts, setAgentThoughts,
    clearResults,
  } = useDiscoveryResults();
  
  const isCancelledRef = useRef(false);
  const addToast = useToastStore((state) => state.addToast);
  const setWorkflowStartedFrom = useCurriculumStore((state) => state.setWorkflowStartedFrom);

  // Load from cache on initial mount
  useEffect(() => {
    // This effect runs once on mount to restore state from localStorage cache.
    if (cachedCurriculumResults) {
      setDiscoveryType('course');
      setCurriculumResults(cachedCurriculumResults.curriculums?.filter(Boolean) || []);
      setAgentThoughts(cachedCurriculumResults.agentThoughts || []);
      setView('results');
    } else if (cachedProjectResults) {
      setDiscoveryType('project');
      const validProjects = cachedProjectResults.projects?.filter(Boolean) || [];
      const fullProjects: CapstoneProject[] = validProjects.map((p, index) => ({
          ...p,
          id: Date.now() + index,
          industry: selectedIndustry,
          detailedDescription: '',
      }));
      setProjectResults(fullProjects);
      setAgentThoughts(cachedProjectResults.agentThoughts || []);
      setView('results');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount, as useLocalStorage initializes synchronously.

  const discoverCourses = async (
    searchValue: string,
    filters: { [key: string]: string },
    fileData: FileData[],
    onProgress: (p: number) => void
  ): Promise<GenerateCurriculumResponse> => {
    const response = await discoveryService.generateCurriculum(searchValue, filters, fileData, onProgress);
    if (isCancelledRef.current) throw new Error("Cancelled");
    return response;
  };

  const discoverProjects = async (
      searchValue: string,
      industry: string,
      fileData: FileData[],
      onProgress: (p: number) => void
  ): Promise<GenerateCapstoneProjectsResponse> => {
      const response = await discoveryService.generateCapstoneProjects(searchValue, industry, fileData, onProgress);
      if (isCancelledRef.current) throw new Error("Cancelled");
      return response;
  };


  const handleStartDiscovery = useCallback(async (files: File[], options?: { forceDiscoveryType?: DiscoveryType }) => {
    if (searchValue.trim() === '' && files.length === 0) return;
    
    isCancelledRef.current = false;
    setProgress(0);
    setView('loading');

    const currentDiscoveryType = options?.forceDiscoveryType || discoveryType;
    
    try {
      const onProgressCallback = (p: number) => {
        if (!isCancelledRef.current) setProgress(p);
      };
      
      const fileData = await Promise.all(
        files.map(async (file) => {
            const data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
            const mimeType = file.type.startsWith('text/markdown') ? 'text/plain' : file.type;
            return { mimeType, data };
        })
      );

      if (currentDiscoveryType === 'course') {
        const response = await discoverCourses(searchValue, filters, fileData, onProgressCallback);
        const validCurriculums = response.curriculums?.filter(Boolean) || [];
        setCurriculumResults(validCurriculums);
        setAgentThoughts(response.agentThoughts || []);
        saveCurriculumToCache({ curriculums: validCurriculums, agentThoughts: response.agentThoughts || [] });
      } else {
        const response = await discoverProjects(searchValue, selectedIndustry, fileData, onProgressCallback);
        const validProjects = response.projects?.filter(Boolean) || [];
        const fullProjects: CapstoneProject[] = validProjects.map((p, index) => ({
            ...p,
            id: Date.now() + index,
            industry: selectedIndustry,
            detailedDescription: `This project is about ${p.title}. A more detailed description will be generated in the next step.`,
        }));
        setProjectResults(fullProjects);
        setAgentThoughts(response.agentThoughts || []);
        saveProjectsToCache({ projects: validProjects, agentThoughts: response.agentThoughts || [] });
      }
      
      setTimeout(() => {
        if (!isCancelledRef.current) setView('results');
      }, 500);

    } catch (error) {
      if (isCancelledRef.current || (error instanceof Error && error.message === "Cancelled")) return;
      console.error("Error generating discovery data:", error);
      
      let message = "An unexpected error occurred during discovery. Please try again.";
      if (error instanceof Error) {
        if (error.message.startsWith('JSON_PARSE_ERROR')) {
            message = "The AI returned a response in an unexpected format. Please try again.";
        } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
            message = "The model is overloaded. Please try again later.";
        } else {
            message = error.message;
        }
      }
      addToast(message, { type: 'error' });

      setView('idle');
      setProgress(0);
    }
  }, [
    searchValue, filters, discoveryType, selectedIndustry, addToast, saveCurriculumToCache, 
    saveProjectsToCache, setProgress, setView, 
    setCurriculumResults, setAgentThoughts, setProjectResults
  ]);
  
  // Handle triggering project discovery from a saved course
  useProjectDiscoveryTrigger({
    handleStartDiscovery,
    clearCache,
    clearResults,
    setView,
    setDiscoveryType,
    setSearchValue,
  });

  // Handle triggering course discovery from a project
  useCourseDiscoveryTrigger({
    handleStartDiscovery,
    clearCache,
    clearResults,
    setView,
    setDiscoveryType,
    setSearchValue,
  });

  const confirmCancelAction = () => {
    isCancelledRef.current = true;
    setView('idle');
    setProgress(0);
  };
  
  const {
    isModalOpen: isCancelModalOpen,
    open: handleCancelDiscovery,
    close: closeCancelModal,
    confirm: confirmCancelDiscovery,
  } = useCancellableAction(confirmCancelAction);


  const handleNewSearch = () => {
    isCancelledRef.current = true;
    clearCache();
    clearResults();
    resetDiscoveryState();
    setWorkflowStartedFrom(null);
  };

  const handleModifySearch = () => {
    setView('idle');
  };

  const { trendingTopics, isFetchingTopics } = useTrendingTopics(discoveryType, selectedIndustry, view === 'idle');

  return {
    view,
    discoveryType,
    setDiscoveryType,
    searchValue,
    setSearchValue,
    curriculumResults,
    projectResults,
    agentThoughts,
    trendingTopics,
    isFetchingTopics,
    progress,
    filters,
    handleFilterChange,
    selectedIndustry,
    handleIndustryChange,
    handleStartDiscovery,
    handleNewSearch,
    handleModifySearch,
    handleCancelDiscovery,
    isCancelModalOpen,
    confirmCancelDiscovery,
    closeCancelModal,
  };
};