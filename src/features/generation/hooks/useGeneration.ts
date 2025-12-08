import { useState, useRef, useEffect, useCallback } from 'react';
import { useCancellableAction, useLessonPlanApi, useProjectApi, useProjectFileManager } from '../../../hooks';
import { getDefaultGenerationOptions } from '../../../config';
import { isDifficultyTag, lessonPlanToMarkdown, updateFileContentInTree } from '../../../utils';
import { useCurriculumStore, useContentLibraryStore, useToastStore, useNavigationStore } from '../../../store';
import { generationService, projectService, discoveryService } from '../../../services';
import type { Curriculum, LessonPlan, GenerationOptions, DetailedProjectData, CapstoneProject, FileNode, RegenerationPart, Exercise, AndragogicalAnalysis } from '../../../types';

type GenerationMode = 'idle' | 'course' | 'capstone';
type ViewState = 'idle' | 'loading' | 'results';

export const useGeneration = () => {
    const { 
        selectedCurriculum, setSelectedCurriculum, 
        selectedCapstoneProject, setSelectedCapstoneProject,
        startGenerationImmediately, setStartGenerationImmediately,
        workflowStartedFrom,
    } = useCurriculumStore();
    
    const [generationMode, setGenerationMode] = useState<GenerationMode>('idle');
    const [view, setView] = useState<ViewState>('idle');
    const isCancelledRef = useRef(false);
    const [progress, setProgress] = useState(0);
    const navigateTo = useNavigationStore((state) => state.navigateTo);

    // Andragogical Analysis State
    const [andragogyAnalysis, setAndragogyAnalysis] = useState<AndragogicalAnalysis | null>(null);
    const [isAnalyzingAndragogy, setIsAnalyzingAndragogy] = useState(false);

    // --- Course Generation State & Hooks ---
    const { generatedCurriculum, setGeneratedCurriculum } = useCurriculumStore();
    const addContentItem = useContentLibraryStore((state) => state.addContentItem);
    const addToast = useToastStore((state) => state.addToast);
    const { isLoading: isGeneratingLessons, progress: lessonGenerationProgress, regeneratingPart, generateAllLessonPlans, regeneratePart, generateNewPart } = useLessonPlanApi(isCancelledRef);

    const [lessonPlans, setLessonPlans] = useState<(LessonPlan | null)[] | null>(null);
    const [lastGenOptions, setLastGenOptions] = useState<GenerationOptions | null>(null);
    const [generationDate, setGenerationDate] = useState<string | null>(null);
    const [lastRegeneratedTitle, setLastRegeneratedTitle] = useState<{ lessonIndex: number; title: string; id: number } | null>(null);
    const [lastRegeneratedCurriculumTitle, setLastRegeneratedCurriculumTitle] = useState<{ title: string; id: number } | null>(null);
    const [isDuplicating, setIsDuplicating] = useState(false);

    // --- Project Generation State & Hooks ---
    const { activeProject, updateProject, updateProjectPart, handleFileCreate, handleFileRename, handleFileDelete } = useProjectFileManager();
    const [capstoneView, setCapstoneView] = useState<'idle' | 'loading' | 'configure' | 'environment' | 'export'>('idle');
    const {
        isLoading: isCapstoneLoading, isRegeneratingFiles, isRegeneratingPart,
        progress: capstoneProgress, loadingMessage, generateDetails, generateEnvironment, 
        applyInstructions, regeneratePart: regenerateProjectPartApi
    } = useProjectApi(isCancelledRef);

    const confirmCancelAction = useCallback(() => {
        isCancelledRef.current = true;
        setView('idle');
        setGenerationMode('idle');
        setLessonPlans(null);
        setGeneratedCurriculum(null);
        updateProject(null);
        setCapstoneView('idle');
        setProgress(0);
        setSelectedCurriculum(null);
        setSelectedCapstoneProject(null);
        setStartGenerationImmediately(false);
        setAndragogyAnalysis(null);
    }, [setGeneratedCurriculum, setStartGenerationImmediately, setSelectedCapstoneProject, setSelectedCurriculum, updateProject]);

    const startCourseGeneration = useCallback(async (curriculum: Curriculum, options: GenerationOptions, isResume = false) => {
        isCancelledRef.current = false;
        setGenerationMode('course');
        setView('loading');
        setGeneratedCurriculum(curriculum);
        setGenerationDate(new Date().toISOString());
        
        if (!isResume) {
            setLessonPlans(Array(curriculum.content.lessons.length).fill(null));
        }
        setLastGenOptions(options);
        setAndragogyAnalysis(null);

        try {
            setView('results');
            let completedPlans: LessonPlan[] = [];
            // If resuming, pass existing plans
            const currentPlans = isResume && lessonPlans ? lessonPlans : undefined;
            
            for await (const { plan, index } of generateAllLessonPlans(curriculum, options, currentPlans)) {
                completedPlans[index] = plan;
                setLessonPlans(prevPlans => {
                    const updatedPlans = [...(prevPlans || [])];
                    updatedPlans[index] = plan;
                    return updatedPlans;
                });
            }
            
            // Trigger Andragogy Analysis if not cancelled and at least one plan exists
            const allPlansCompleted = completedPlans.every(p => p !== null);
            if (allPlansCompleted && completedPlans.length > 0) {
                setIsAnalyzingAndragogy(true);
                const analysisContext = `Curriculum: ${curriculum.title}\nDescription: ${curriculum.description}\nObjectives: ${curriculum.learningOutcomes.join(', ')}\n\nSample Lesson (${curriculum.content.lessons[0]}):\n${lessonPlanToMarkdown(completedPlans[0])}`;
                generationService.analyzeAndragogy(analysisContext).then(analysis => {
                    if (!isCancelledRef.current) setAndragogyAnalysis(analysis);
                }).finally(() => setIsAnalyzingAndragogy(false));
            }

        } catch (error) {
            // Error toast is handled inside useLessonPlanApi.
            // DO NOT reset state here to allow resumption.
        } finally {
            setSelectedCurriculum(null);
            setStartGenerationImmediately(false);
        }
    }, [generateAllLessonPlans, setGeneratedCurriculum, setSelectedCurriculum, setStartGenerationImmediately, lessonPlans]);

    const startCapstoneGeneration = useCallback(async (project: CapstoneProject, isResume = false) => {
        isCancelledRef.current = false;
        setGenerationMode('capstone');
        // Initial view state set to loading, but we will switch to results quickly to show skeletons
        setView('loading');
        setAndragogyAnalysis(null);
        
        const skeletonProject: CapstoneProject = {
            ...project,
            detailedDescription: '', 
            techStack: [], 
            learningOutcomes: [],
            projectRequirements: [], 
            deliverables: [],
            // Initialize all detailed fields to ensure skeletons render correctly
            constraints: [],
            futureOrientedElement: '',
            participationModel: '',
            evidenceOfLearning: [],
            assessmentFeedback: '',
            judgementCriteria: [],
        };

        if (!isResume) {
            updateProject(skeletonProject);
        }
        setCapstoneView('configure');
        
        // Switch to results view immediately to show the configuration view with skeletons
        // Use a timeout to allow state updates (updateProject) to propagate
        setTimeout(() => {
             if (!isCancelledRef.current) setView('results');
        }, 0);

        try {
            // Use current active project if resuming, otherwise start from skeleton
            const projectToProcess = isResume ? project : skeletonProject;
            let finalProjectState = projectToProcess;
            
            for await (const { data } of generateDetails(projectToProcess)) {
                if (isCancelledRef.current) return;
                updateProjectPart(data);
                finalProjectState = { ...finalProjectState, ...data };
            }
            
            // Trigger Andragogy Analysis
            setIsAnalyzingAndragogy(true);
            const analysisContext = `Project Title: ${finalProjectState.title}\nDescription: ${finalProjectState.detailedDescription}\nRequirements: ${finalProjectState.projectRequirements?.join('\n')}\nDeliverables: ${finalProjectState.deliverables?.join('\n')}\nLearning Outcomes: ${finalProjectState.learningOutcomes?.join('\n')}`;
            projectService.analyzeAndragogy(analysisContext).then(analysis => {
                if (!isCancelledRef.current) setAndragogyAnalysis(analysis);
            }).finally(() => setIsAnalyzingAndragogy(false));

        } catch (error) {
            // Error toast is handled inside useProjectApi
            // DO NOT reset state here to allow resumption.
        } finally {
            setSelectedCapstoneProject(null);
        }
    }, [generateDetails, updateProject, updateProjectPart, setSelectedCapstoneProject]);
    
    const handleResume = async () => {
        if (generationMode === 'course') {
            if (!generatedCurriculum || !lastGenOptions) return;
            await startCourseGeneration(generatedCurriculum, lastGenOptions, true);
        } else if (generationMode === 'capstone') {
            if (!activeProject) return;
            await startCapstoneGeneration(activeProject, true);
        }
    };

    // --- Trigger generation from Discovery/Trending ---
    useEffect(() => {
        if (selectedCurriculum && startGenerationImmediately) {
            startCourseGeneration(selectedCurriculum, getDefaultGenerationOptions());
        }
    }, [selectedCurriculum, startGenerationImmediately, startCourseGeneration]);

    useEffect(() => {
        if (selectedCapstoneProject) {
            startCapstoneGeneration(selectedCapstoneProject);
        }
    }, [selectedCapstoneProject, startCapstoneGeneration]);

    const handleGenerate = async (prompt: string, type: 'course' | 'project', file: File | null) => {
        if (!prompt.trim() && !file) return;
        
        isCancelledRef.current = false;
        
        // Update generation mode immediately to show correct loading text
        if (type === 'course') {
            setGenerationMode('course');
        } else {
            setGenerationMode('capstone');
        }

        setView('loading');
        setProgress(5);

        try {
            let fileData: { mimeType: string; data: string }[] = [];
            if (file) {
                const data = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                const mimeType = file.type || 'application/octet-stream';
                fileData = [{ mimeType, data }];
            }

            if (type === 'course') {
                const response = await discoveryService.generateCurriculum(
                    prompt, 
                    { difficulty: 'any', numLessons: 'any' }, 
                    fileData, 
                    (p) => { if (!isCancelledRef.current) setProgress(p * 0.9); }
                );
                
                if (isCancelledRef.current) return;

                const curriculum = response.curriculums.find(c => c.recommended) || response.curriculums[0];
                if (!curriculum) throw new Error("No curriculum generated");

                await startCourseGeneration(curriculum, getDefaultGenerationOptions());

            } else {
                const response = await discoveryService.generateCapstoneProjects(
                    prompt, 
                    'All', 
                    fileData, 
                    (p) => { if (!isCancelledRef.current) setProgress(p * 0.9); }
                );

                if (isCancelledRef.current) return;

                const rawProject = response.projects.find(p => p.recommended) || response.projects[0];
                if (!rawProject) throw new Error("No project generated");

                const project: CapstoneProject = {
                    ...rawProject,
                    id: Date.now(),
                    industry: 'All',
                    detailedDescription: '',
                };

                await startCapstoneGeneration(project);
            }

        } catch (error) {
            console.error("Error in generation:", error);
            if (!isCancelledRef.current) {
                setView('idle');
                setGenerationMode('idle'); // Reset generation mode on error
                setProgress(0);
                
                let message = "Failed to process request. Please try again.";
                if (error instanceof Error) {
                    if (error.message.startsWith('JSON_PARSE_ERROR')) {
                        message = "The AI returned an unexpected response format. Please try again.";
                    } else if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
                        message = "The model is overloaded. Please try again later.";
                    } else {
                        message = error.message;
                    }
                }
                addToast(message, { type: 'error' });
            }
        }
    };
    
    // --- Course-specific handlers ---
    const handleRegeneratePart = async (lessonIndex: number, part: RegenerationPart, instructions: string) => {
        if (!generatedCurriculum || !lessonPlans || !lastGenOptions) return;
        const result = await regeneratePart(generatedCurriculum, lessonPlans[lessonIndex], generatedCurriculum.content.lessons[lessonIndex], part, instructions, lastGenOptions);
        
        if (part.type === 'curriculumTitle') {
            setLastRegeneratedCurriculumTitle({ title: (result as { curriculumTitle: string }).curriculumTitle, id: Date.now() });
        } else if (part.type === 'title') {
            setLastRegeneratedTitle({ lessonIndex, title: (result as { lessonTitle: string }).lessonTitle, id: Date.now() });
        } else {
            setLessonPlans(prevPlans => {
                const newPlans = [...(prevPlans || [])];
                if (!newPlans[lessonIndex]) return newPlans;
                let lessonToUpdate = { ...newPlans[lessonIndex]! };
                
                if (part.type === 'exercise') {
                    if (!lessonToUpdate.exercises) lessonToUpdate.exercises = [];
                    lessonToUpdate.exercises[part.index] = result as Exercise;
                } else if (part.type === 'quiz') {
                    if (!lessonToUpdate.quiz) lessonToUpdate.quiz = { questions: [] };
                    lessonToUpdate.quiz.questions[part.index] = result as LessonPlan['quiz']['questions'][0];
                } else if (part.type === 'outcome') {
                    lessonToUpdate.lessonOutcome = (result as { lessonOutcome: string }).lessonOutcome;
                    lessonToUpdate.overview = (result as { lessonOutcome: string }).lessonOutcome; // Legacy sync
                } else if (part.type === 'outline') {
                    lessonToUpdate.lessonOutline = (result as { lessonOutline: string }).lessonOutline;
                    lessonToUpdate.demonstration = (result as { lessonOutline: string }).lessonOutline; // Legacy sync
                } else if (part.type === 'project') {
                    lessonToUpdate.project = result as LessonPlan['project'];
                } else if (part.type === 'overview') {
                    lessonToUpdate.overview = (result as { overview: string }).overview;
                } else if (part.type === 'activation') {
                    lessonToUpdate.activation = (result as { activation: string }).activation;
                } else if (part.type === 'demonstration') {
                    lessonToUpdate.demonstration = (result as { demonstration: string }).demonstration;
                } else if (part.type === 'application') {
                    lessonToUpdate.application = (result as { application: string }).application;
                } else if (part.type === 'integration') {
                    lessonToUpdate.integration = (result as { integration: string }).integration;
                } else if (part.type === 'reflectionAndAssessment') {
                    lessonToUpdate.reflectionAndAssessment = (result as { reflectionAndAssessment: string }).reflectionAndAssessment;
                }

                newPlans[lessonIndex] = lessonToUpdate;
                return newPlans;
            });
        }
    };

    const handleGenerateNewPart = async (lessonIndex: number, partType: 'exercise' | 'quiz') => {
        if (!generatedCurriculum || !lessonPlans?.[lessonIndex] || !lastGenOptions) throw new Error("Missing context.");
        return generateNewPart(generatedCurriculum, lessonPlans[lessonIndex]!, generatedCurriculum.content.lessons[lessonIndex], partType, lastGenOptions);
    };

    const handleSaveContent = async (notes: string) => {
        if (!generatedCurriculum || !lessonPlans || !lastGenOptions || lessonPlans.some(lp => lp === null)) return;
        const newContentItem = await addContentItem({
            name: generatedCurriculum.title,
            lessonCount: generatedCurriculum.content.lessons.length,
            lessonDuration: parseFloat(lastGenOptions.lessonDuration),
            difficulty: generatedCurriculum.tags.find(isDifficultyTag) || 'Beginner',
            notes: notes.trim() ? notes.trim() : undefined,
            generationOptions: lastGenOptions,
            lessons: generatedCurriculum.content.lessons.map((title, index) => ({
                title,
                content: lessonPlanToMarkdown(lessonPlans[index]!)
            }))
        });
        if (newContentItem) addToast(`"${newContentItem.name}" has been saved.`, {});
    };

    // --- Project-specific handlers ---
    const handleGoToEnvironment = async () => {
        if (!activeProject) return;
        isCancelledRef.current = false;
        setCapstoneView('environment');
        
        try {
            let latestFileStructure: FileNode[] | undefined = activeProject.fileStructure;
            for await (const result of generateEnvironment(activeProject)) {
                if(isCancelledRef.current) break;
                if (result.type === 'structure') latestFileStructure = result.data;
                else if (result.type === 'file') latestFileStructure = updateFileContentInTree(latestFileStructure || [], result.path, result.content);
                updateProjectPart({ fileStructure: latestFileStructure });
            }
        } catch (error) {
            if (!isCancelledRef.current) setCapstoneView('configure');
        }
    };

    const handleApplyInstructions = async (instructions: string) => {
        if (!activeProject || !instructions.trim()) return;
        const fileStructure = await applyInstructions(activeProject, instructions);
        if (fileStructure && !isCancelledRef.current) updateProjectPart({ fileStructure });
    };

    const handleRegenerateProjectPart = async (part: keyof DetailedProjectData, instructions: string) => {
        if (!activeProject) return;
        const result = await regenerateProjectPartApi(activeProject, part, instructions);
        updateProjectPart(result);
    };
    
    const { isModalOpen: isCancelModalOpen, open: openCancelModal, close: closeCancelModal, confirm: confirmCancel } = useCancellableAction(confirmCancelAction);
    
    const confirmTrashAction = () => {
        confirmCancelAction();
        navigateTo('Trending');
    };
    
    const { 
        isModalOpen: isTrashModalOpen, 
        open: openTrashModal, 
        close: closeTrashModal, 
        confirm: confirmTrash 
    } = useCancellableAction(confirmTrashAction);

    return {
        generationMode, view, progress, isCancelModalOpen, openCancelModal, closeCancelModal, confirmCancelAction: confirmCancel, handleGenerate,
        isTrashModalOpen, openTrashModal, closeTrashModal, confirmTrash,
        isGeneratingLessons,
        lessonGenerationProgress,
        lessonPlans, generatedCurriculum, regeneratingPart, lastGenOptions, generationDate, lastRegeneratedTitle, lastRegeneratedCurriculumTitle,
        handleRegeneratePart, handleGenerateNewPart, handleSaveContent,
        handleUpdateLessonPlan: (lessonIndex: number, updatedLessonPlan: LessonPlan) => setLessonPlans(prev => prev?.map((p, i) => i === lessonIndex ? updatedLessonPlan : p) || null),
        handleUpdateLessonTitle: (lessonIndex: number, newTitle: string) => setGeneratedCurriculum(prev => prev ? { ...prev, content: { ...prev.content, lessons: prev.content.lessons.map((t, i) => i === lessonIndex ? newTitle : t) } } : null),
        handleUpdateCurriculumTitle: (newTitle: string) => setGeneratedCurriculum(prev => prev ? { ...prev, title: newTitle } : null),
        handleDuplicateAndVary: async (lessonIndex: number, instructions: string) => { /* Stub */ },
        isDuplicating,
        capstoneView, setCapstoneView, activeProject, capstoneProgress, isCapstoneLoading,
        loadingTitle: "Generating...", loadingMessage, isRegenerating: isRegeneratingFiles, isRegeneratingPart,
        handleGoToEnvironment, handleApplyInstructions, handleRegenerateProjectPart,
        handleFileCreate, handleFileRename, handleFileDelete,
        updateSelectedProject: updateProject,
        handleBackToConfiguration: () => setCapstoneView('configure'),
        handleGoToExport: () => setCapstoneView('export'),
        handleCancelGeneration: confirmCancelAction,
        handleGenerateManualProject: () => { /* Stub */ },
        currentCurriculum: generatedCurriculum,
        andragogyAnalysis, isAnalyzingAndragogy,
        handleResume
    };
};