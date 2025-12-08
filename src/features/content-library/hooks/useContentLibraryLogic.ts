
import { useState, useMemo, useEffect } from 'react';
import { useContentLibraryStore, useToastStore } from '../../../store';
import type { ContentItem, LessonPlan, RegenerationPart, Curriculum, Exercise } from '../../../types';
import { getRegenerationPartId } from '../../../types';
import { lessonPlanToMarkdown, parseLessonPlanMarkdown, fuzzySearch } from '../../../utils';
import { generationService } from '../../../services';

export const useContentLibraryLogic = () => {
    // State from Zustand store
    const { 
        contentLibrary,
        activeContentItem,
        setActiveContentItem,
        updateContentItem,
        deleteContentItem,
        addContentItem,
        initialize,
        isInitialized,
        isLoading,
    } = useContentLibraryStore();

    const addToast = useToastStore((state) => state.addToast);
    
    // Local UI state
    const [searchTerm, setSearchTerm] = useState('');
    const [regeneratingPart, setRegeneratingPart] = useState<string | null>(null);
    const [lastRegeneratedCurriculumTitle, setLastRegeneratedCurriculumTitle] = useState<{ title: string; id: number } | null>(null);
    const [lastRegeneratedLessonTitle, setLastRegeneratedLessonTitle] = useState<{ lessonIndex: number; title: string; id: number } | null>(null);
    const [inProgressItems, setInProgressItems] = useState<ContentItem[]>([]);

    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize]);


    // Memoized filtering logic
    const filteredContent = useMemo(() =>
        contentLibrary.filter(item =>
            fuzzySearch(searchTerm, item.name)
        ), [contentLibrary, searchTerm]);

    // Effect to manage active item
    useEffect(() => {
        if (isInitialized && !activeContentItem && contentLibrary.length > 0) {
            setActiveContentItem(contentLibrary[0]);
        }
        if (activeContentItem && !contentLibrary.find(item => item.id === activeContentItem.id)) {
            setActiveContentItem(contentLibrary[0] || null);
        }
    }, [contentLibrary, activeContentItem, setActiveContentItem, isInitialized]);

    // Mutation helpers
    const updateActiveContentItem = (updatedItem: ContentItem) => {
        updateContentItem(updatedItem);
        setActiveContentItem(updatedItem);
    };

    const handleUpdateNotes = (notes: string) => {
        if (!activeContentItem) return;
        const updatedItem = { ...activeContentItem, notes: notes.trim() ? notes.trim() : undefined };
        updateActiveContentItem(updatedItem);
    };
    
    const handleUpdateLessonPlan = (lessonIndex: number, updatedPlan: LessonPlan) => {
        if (!activeContentItem) return;
        const updatedLessons = [...activeContentItem.lessons];
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], content: lessonPlanToMarkdown(updatedPlan) };
        const updatedItem = { ...activeContentItem, lessons: updatedLessons };
        updateActiveContentItem(updatedItem);
    };
    
    const handleUpdateLessonTitle = (lessonIndex: number, newTitle: string) => {
        if (!activeContentItem) return;
        const updatedLessons = [...activeContentItem.lessons];
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], title: newTitle };
        const updatedItem = { ...activeContentItem, lessons: updatedLessons };
        updateActiveContentItem(updatedItem);
    };

    const handleUpdateCurriculumTitle = (newTitle: string) => {
        if (!activeContentItem) return;
        const updatedItem = { ...activeContentItem, name: newTitle };
        updateActiveContentItem(updatedItem);
    };

    const handleDeleteItem = async () => {
        if (activeContentItem) {
            const item = { ...activeContentItem };
            await deleteContentItem(item.id);
            addToast(`"${item.name}" has been deleted.`, {
                action: {
                    label: 'Undo',
                    onClick: async () => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { id, ...itemData } = item;
                        const newItem = await addContentItem(itemData);
                        if(newItem) {
                           setActiveContentItem(newItem);
                        }
                    },
                }
            });
        }
    };

    // API interaction logic
    const handleRegeneratePart = async (lessonIndex: number, part: RegenerationPart, instructions: string) => {
        if (!activeContentItem) return;

        const partId = getRegenerationPartId(part);
        setRegeneratingPart(partId);

        try {
            const lesson = activeContentItem.lessons[lessonIndex];
            const lessonPlan = parseLessonPlanMarkdown(lesson.content) as LessonPlan;
            const isCurriculumPart = part.type === 'curriculumTitle';

            const curriculumForApi: Curriculum = {
                title: activeContentItem.name,
                description: '',
                tags: [activeContentItem.difficulty],
                recommended: false,
                learningOutcomes: [],
                content: { lessons: activeContentItem.lessons.map(l => l.title) }
            };
            
            const genOptions = activeContentItem.generationOptions;

            const result = await generationService.regenerateLessonPart(curriculumForApi, isCurriculumPart ? null : lessonPlan, isCurriculumPart ? null : lesson.title, part, instructions, genOptions);
            
            if (part.type === 'curriculumTitle') {
                setLastRegeneratedCurriculumTitle({ title: (result as { curriculumTitle: string }).curriculumTitle, id: Date.now() });
                return;
            }
            if (part.type === 'title') {
                setLastRegeneratedLessonTitle({ lessonIndex, title: (result as { lessonTitle: string }).lessonTitle, id: Date.now() });
                return;
            }

            let updatedLessonPlan: LessonPlan = { ...lessonPlan };
            
            if (part.type === 'exercise') {
                updatedLessonPlan.exercises[part.index] = result as Exercise;
            } else if (part.type === 'quiz') {
                updatedLessonPlan.quiz.questions[part.index] = result as LessonPlan['quiz']['questions'][0];
            } else if (part.type === 'outcome') {
                updatedLessonPlan.lessonOutcome = (result as { lessonOutcome: string }).lessonOutcome;
                updatedLessonPlan.overview = (result as { lessonOutcome: string }).lessonOutcome;
            } else if (part.type === 'outline') {
                updatedLessonPlan.lessonOutline = (result as { lessonOutline: string }).lessonOutline;
                updatedLessonPlan.demonstration = (result as { lessonOutline: string }).lessonOutline;
            } else if (part.type === 'project') {
                updatedLessonPlan.project = result as LessonPlan['project'];
            } else if (part.type === 'overview') {
                updatedLessonPlan.overview = (result as { overview: string }).overview;
            } else if (part.type === 'activation') {
                updatedLessonPlan.activation = (result as { activation: string }).activation;
            } else if (part.type === 'demonstration') {
                updatedLessonPlan.demonstration = (result as { demonstration: string }).demonstration;
            } else if (part.type === 'application') {
                updatedLessonPlan.application = (result as { application: string }).application;
            } else if (part.type === 'integration') {
                updatedLessonPlan.integration = (result as { integration: string }).integration;
            } else if (part.type === 'reflectionAndAssessment') {
                updatedLessonPlan.reflectionAndAssessment = (result as { reflectionAndAssessment: string }).reflectionAndAssessment;
            }

            handleUpdateLessonPlan(lessonIndex, updatedLessonPlan);
            addToast("Content successfully regenerated.", { type: 'default' });

        } catch (error) {
            console.error("Failed to generate content in library:", error);
            addToast("Failed to generate content. Please try again.", { type: 'error' });
        } finally {
            setRegeneratingPart(null);
        }
    };
    
    const handleGenerateNewPart = async (lessonIndex: number, partType: 'exercise' | 'quiz') => {
        if (!activeContentItem) throw new Error("No active content item selected.");
        try {
            const lesson = activeContentItem.lessons[lessonIndex];
            const lessonPlan = parseLessonPlanMarkdown(lesson.content) as LessonPlan;
            const curriculumForApi: Curriculum = {
                title: activeContentItem.name,
                description: '',
                tags: [activeContentItem.difficulty],
                recommended: false,
                learningOutcomes: [],
                content: { lessons: activeContentItem.lessons.map(l => l.title) }
            };
            
            const result = await generationService.generateNewLessonPart(curriculumForApi, lessonPlan, lesson.title, partType, activeContentItem.generationOptions);
            addToast(`New ${partType} generated.`, { type: 'default' });
            return result;
        } catch (error) {
            addToast(`Failed to generate new ${partType}. Please try again.`, { type: 'error' });
            throw error;
        }
    };

    const generateAndSaveVariedCourse = async (lessonIndex: number, instructions: string) => {
        if (!activeContentItem) return;
        let newItemId: number | null = null;
        try {
            for await (const progressItem of generationService.generateFullVariedCourseStreamed(activeContentItem, lessonIndex, instructions)) {
                newItemId = progressItem.id;
                if (progressItem.progress < 100) {
                     setInProgressItems(prev => {
                        const existing = prev.find(item => item.id === progressItem.id);
                        if (existing) {
                            return prev.map(item => item.id === progressItem.id ? { ...item, ...progressItem } : item);
                        } else {
                            return [progressItem, ...prev];
                        }
                    });
                } else {
                    addContentItem(progressItem);
                    setActiveContentItem(progressItem);
                    setInProgressItems(prev => prev.filter(item => item.id !== progressItem.id));
                    addToast("New course variation created and saved.", { type: 'default' });
                }
            }
        } catch (error) {
            console.error("Failed to duplicate and vary course:", error);
            addToast("Failed to create new course. Please try again.", { type: 'error' });
            if (newItemId) {
                setInProgressItems(prev => prev.filter(item => item.id !== newItemId!));
            }
        }
    };
    
    return {
        filteredContent,
        activeContentItem,
        searchTerm,
        setSearchTerm,
        inProgressItems,
        isLoading: !isInitialized || isLoading,
        isInitialized,
        handleSelectContent: setActiveContentItem,
        handleDeleteItem,
        handleRegeneratePart,
        handleGenerateNewPart,
        regeneratingPart,
        handleUpdateNotes,
        handleUpdateLessonPlan,
        handleUpdateLessonTitle,
        handleUpdateCurriculumTitle,
        lastRegeneratedCurriculumTitle,
        lastRegeneratedLessonTitle,
        generateAndSaveVariedCourse,
    };
};
