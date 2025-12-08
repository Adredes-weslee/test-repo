
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Curriculum, CapstoneProject } from '../types';

interface CurriculumState {
  selectedCurriculum: Curriculum | null;
  setSelectedCurriculum: (curriculum: Curriculum | null) => void;

  currentCurriculum: Curriculum | null;
  setCurrentCurriculum: (curriculum: Curriculum | null) => void;

  generatedCurriculum: Curriculum | null;
  setGeneratedCurriculum: (curriculum: Curriculum | null) => void;

  selectedCapstoneProject: CapstoneProject | null;
  setSelectedCapstoneProject: (project: CapstoneProject | null) => void;

  startGenerationImmediately: boolean;
  setStartGenerationImmediately: (start: boolean) => void;

  workflowStartedFrom: 'course' | 'project' | null;
  setWorkflowStartedFrom: (from: 'course' | 'project' | null) => void;

  startGenerationWithPrompt: { prompt: string; type: 'course' | 'project' } | null;
  setStartGenerationWithPrompt: (config: { prompt: string; type: 'course' | 'project' } | null) => void;

  curriculumForProjectDiscovery: string | null;
  setCurriculumForProjectDiscovery: (curriculum: string | null) => void;
  startProjectDiscovery: boolean;
  setStartProjectDiscovery: (start: boolean) => void;
  
  projectForCourseDiscovery: CapstoneProject | null;
  setProjectForCourseDiscovery: (project: CapstoneProject | null) => void;
  startCourseDiscovery: boolean;
  setStartCourseDiscovery: (start: boolean) => void;

  // New Slides Context
  slidesContext: { courseTitle: string; items: { title: string; content: string }[] } | null;
  setSlidesContext: (context: { courseTitle: string; items: { title: string; content: string }[] } | null) => void;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set) => ({
      // Non-persisted state
      selectedCurriculum: null,
      selectedCapstoneProject: null,
      startGenerationImmediately: false,
      startGenerationWithPrompt: null,
      curriculumForProjectDiscovery: null,
      startProjectDiscovery: false,
      projectForCourseDiscovery: null,
      startCourseDiscovery: false,
      slidesContext: null,

      // Persisted state
      currentCurriculum: null,
      generatedCurriculum: null,
      workflowStartedFrom: null,

      // Actions
      setSelectedCurriculum: (curriculum) => set({ selectedCurriculum: curriculum }),
      setCurrentCurriculum: (curriculum) => set({ currentCurriculum: curriculum }),
      setGeneratedCurriculum: (curriculum) => set({ generatedCurriculum: curriculum }),
      setSelectedCapstoneProject: (project) => set({ selectedCapstoneProject: project }),
      setStartGenerationImmediately: (start) => set({ startGenerationImmediately: start }),
      setWorkflowStartedFrom: (from) => set({ workflowStartedFrom: from }),
      setStartGenerationWithPrompt: (config) => set({ startGenerationWithPrompt: config }),
      setCurriculumForProjectDiscovery: (curriculum) => set({ curriculumForProjectDiscovery: curriculum }),
      setStartProjectDiscovery: (start) => set({ startProjectDiscovery: start }),
      setProjectForCourseDiscovery: (project) => set({ projectForCourseDiscovery: project }),
      setStartCourseDiscovery: (start) => set({ startCourseDiscovery: start }),
      setSlidesContext: (context) => set({ slidesContext: context }),
    }),
    {
      name: 'eliceCreatorAICurriculumState',
      storage: createJSONStorage(() => localStorage),
      // Only persist the state that needs to survive page reloads.
      partialize: (state) => ({
        currentCurriculum: state.currentCurriculum,
        generatedCurriculum: state.generatedCurriculum,
        workflowStartedFrom: state.workflowStartedFrom,
      }),
    }
  )
);
