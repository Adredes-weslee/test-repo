
import React, { useState, useMemo } from 'react';
import { useCurriculumStore, useNavigationStore, useToastStore } from '../../store';
import { Button, LoadingSpinner, Select } from '../../components/ui';
import { Upload, X, Presentation, ChevronLeft, ChevronRight, LayoutTemplate, Sparkles } from '../../components/icons';
import { generateSlideSection } from '../../api/generateSlides';
import { parseLessonPlanMarkdown, stripMarkdown } from '../../utils/markdownParser';
import { SlideSkeleton } from '../../components/skeletons/SlideSkeleton';
import { UISlide, Deck } from './types';
import { SlideDesign } from './components/SlideDesign';
import { exportPptx } from './utils/exportPptx';

// Section mapping for generation
const SECTIONS_MAP = [
    { key: 'title', label: 'Title Slide' },
    { key: 'overview', label: 'Overview' },
    { key: 'learningObjectives', label: 'Learning Objectives' },
    { key: 'activation', label: 'Activation' },
    { key: 'demonstration', label: 'Demonstration' },
    { key: 'application', label: 'Application' },
    { key: 'integration', label: 'Integration' },
    { key: 'reflectionAndAssessment', label: 'Feedback & Reflection' },
    { key: 'exercises', label: 'Exercises' },
    { key: 'quiz', label: 'Quiz' },
];

export const SlidesFeature: React.FC = () => {
    const { slidesContext } = useCurriculumStore();
    const navigateTo = useNavigationStore((state) => state.navigateTo);
    const addToast = useToastStore((state) => state.addToast);
    
    const [view, setView] = useState<'input' | 'loading' | 'results'>('input');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [generatedDecks, setGeneratedDecks] = useState<Deck[]>([]);
    const [designRationale, setDesignRationale] = useState<string>('');
    const [activeDeckIndex, setActiveDeckIndex] = useState(0);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

    const handleBack = () => {
        navigateTo('Library'); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const activeContext = useMemo(() => {
        if (!slidesContext) return null;
        return {
            topic: slidesContext.courseTitle,
            items: slidesContext.items
        };
    }, [slidesContext]);

    const handleGenerate = async () => {
        if (!activeContext || !activeContext.items) return;
        
        setView('results');
        const initialDecks: Deck[] = [];

        // 1. Initialize Skeleton Decks
        activeContext.items.forEach((item) => {
            const parsedPlan = parseLessonPlanMarkdown(item.content);
            const skeletonSlides: UISlide[] = [];

            skeletonSlides.push({
                title: item.title, bullets: [], speakerNotes: '', visualDescription: '', layoutSuggestion: 'Title Only',
                id: 'title-skeleton', sectionId: 'title', sectionTitle: 'Title Slide', isLoading: true
            });

            SECTIONS_MAP.forEach(section => {
                if (section.key === 'title') return;
                const hasContent = (parsedPlan as any)[section.key] || (parsedPlan.quiz && section.key === 'quiz' && parsedPlan.quiz.questions.length > 0) || (parsedPlan.exercises && section.key === 'exercises' && parsedPlan.exercises.length > 0);
                
                if (hasContent) {
                    skeletonSlides.push({
                        title: section.label, bullets: [], speakerNotes: '', visualDescription: '', layoutSuggestion: 'Standard',
                        id: `${section.key}-skeleton`, sectionId: section.key, sectionTitle: section.label, isLoading: true
                    });
                }
            });

            skeletonSlides.push({
                title: 'Thank You', bullets: [], speakerNotes: '', visualDescription: '', layoutSuggestion: 'Center',
                id: 'end-skeleton', sectionId: 'end', sectionTitle: 'End Slide', isLoading: true
            });

            initialDecks.push({ title: item.title, slides: skeletonSlides });
        });

        setGeneratedDecks(initialDecks);
        setActiveDeckIndex(0);
        setActiveSlideIndex(0);

        // 2. Process sections
        initialDecks.forEach((deck, deckIndex) => {
            const lessonItem = activeContext.items[deckIndex];
            const parsedPlan = parseLessonPlanMarkdown(lessonItem.content);

            const processSection = async (sectionId: string, sectionTitle: string, sectionContent: string) => {
                try {
                    let promptTitle = sectionTitle;
                    if (sectionId === 'quiz') promptTitle = 'Quiz';

                    const response = await generateSlideSection(promptTitle, sectionContent, uploadedFile);
                    if (deckIndex === 0 && !designRationale) setDesignRationale(response.designRationale);

                    setGeneratedDecks(prev => {
                        const newDecks = [...prev];
                        const currentDeck = { ...newDecks[deckIndex] };
                        const otherSlides = currentDeck.slides.filter(s => s.sectionId !== sectionId);
                        
                        const newSlides = response.slides.map((s, idx) => ({
                            ...s,
                            title: stripMarkdown(s.title),
                            bullets: s.bullets.map(stripMarkdown),
                            id: `${sectionId}-${idx}`,
                            sectionId,
                            sectionTitle,
                            isLoading: false
                        }));

                        const order = ['title', ...SECTIONS_MAP.map(s => s.key), 'end'];
                        const allSlides = [...otherSlides, ...newSlides].sort((a, b) => {
                            return order.indexOf(a.sectionId) - order.indexOf(b.sectionId);
                        });

                        currentDeck.slides = allSlides;
                        newDecks[deckIndex] = currentDeck;
                        return newDecks;
                    });
                } catch (e) {
                    console.error(`Failed to generate section ${sectionTitle}`, e);
                    setGeneratedDecks(prev => {
                        const newDecks = [...prev];
                        const currentDeck = { ...newDecks[deckIndex] };
                        currentDeck.slides = currentDeck.slides.filter(s => s.sectionId !== sectionId);
                        newDecks[deckIndex] = currentDeck;
                        return newDecks;
                    });
                }
            };

            processSection('title', 'Title Slide', `Lesson Title: ${lessonItem.title}`);

            SECTIONS_MAP.forEach(section => {
                if (section.key === 'title') return;
                let content = '';
                if (section.key === 'quiz' && parsedPlan.quiz) content = JSON.stringify(parsedPlan.quiz);
                else if (section.key === 'exercises' && parsedPlan.exercises) content = JSON.stringify(parsedPlan.exercises);
                else content = (parsedPlan as any)[section.key];

                if (content) processSection(section.key, section.label, content);
            });

            processSection('end', 'Thank You Slide', `Lesson Title: ${lessonItem.title}`);
        });
    };

    const handleRegenerateSection = async () => {
        const activeDeck = generatedDecks[activeDeckIndex];
        const activeSlide = activeDeck?.slides[activeSlideIndex];
        if (!activeDeck || !activeSlide || !activeContext) return;

        const sectionId = activeSlide.sectionId;
        const sectionTitle = activeSlide.sectionTitle;
        const lessonItem = activeContext.items[activeDeckIndex];
        const parsedPlan = parseLessonPlanMarkdown(lessonItem.content);

        let content = '';
        if (sectionId === 'title' || sectionId === 'end') content = `Lesson Title: ${lessonItem.title}`;
        else if (sectionId === 'quiz' && parsedPlan.quiz) content = JSON.stringify(parsedPlan.quiz);
        else if (sectionId === 'exercises' && parsedPlan.exercises) content = JSON.stringify(parsedPlan.exercises);
        else content = (parsedPlan as any)[sectionId];

        if (!content) return;

        setRegeneratingSection(sectionId);
        
        const currentDeck = { ...activeDeck };
        const otherSlides = currentDeck.slides.filter(s => s.sectionId !== sectionId);
        const skeleton: UISlide = {
            title: sectionTitle, bullets: [], speakerNotes: '', visualDescription: '', layoutSuggestion: 'Standard',
            id: `${sectionId}-regen-skeleton`, sectionId, sectionTitle, isLoading: true
        };
        const order = ['title', ...SECTIONS_MAP.map(s => s.key), 'end'];
        const allSlidesWithSkeleton = [...otherSlides, skeleton].sort((a, b) => order.indexOf(a.sectionId) - order.indexOf(b.sectionId));
        
        const skeletonIndex = allSlidesWithSkeleton.findIndex(s => s.id === skeleton.id);

        setGeneratedDecks(prev => {
            const newDecks = [...prev];
            newDecks[activeDeckIndex] = { ...currentDeck, slides: allSlidesWithSkeleton };
            return newDecks;
        });
        if (skeletonIndex !== -1) setActiveSlideIndex(skeletonIndex);
        
        try {
            const promptTitle = sectionId === 'quiz' ? 'Quiz' : sectionTitle;
            const response = await generateSlideSection(promptTitle, content, uploadedFile);

            setGeneratedDecks(prev => {
                const newDecks = [...prev];
                const deckToUpdate = { ...newDecks[activeDeckIndex] };
                const slidesWithoutSkeleton = deckToUpdate.slides.filter(s => s.sectionId !== sectionId);
                const newSlides = response.slides.map((s, idx) => ({
                    ...s,
                    title: stripMarkdown(s.title),
                    bullets: s.bullets.map(stripMarkdown),
                    id: `${sectionId}-regen-${idx}`,
                    sectionId,
                    sectionTitle,
                    isLoading: false
                }));

                const allSlidesFinal = [...slidesWithoutSkeleton, ...newSlides].sort((a, b) => order.indexOf(a.sectionId) - order.indexOf(b.sectionId));
                deckToUpdate.slides = allSlidesFinal;
                newDecks[activeDeckIndex] = deckToUpdate;
                return newDecks;
            });
            addToast('Section regenerated!', { type: 'default' });
        } catch (e) {
            console.error("Regeneration failed", e);
            addToast('Failed to regenerate section.', { type: 'error' });
        } finally {
            setRegeneratingSection(null);
        }
    };

    const handleDownloadPPTX = async () => {
        const activeDeck = generatedDecks[activeDeckIndex];
        if (!activeDeck || activeDeck.slides.length === 0) return;

        setIsExporting(true);
        addToast('Generating PowerPoint... This may take a moment.', { type: 'default' });

        try {
            await exportPptx(activeDeck);
            addToast('PPTX downloaded successfully!', { type: 'default' });
        } catch (error) {
            console.error("PPTX Export failed:", error);
            addToast('Failed to export PPTX.', { type: 'error' });
        } finally {
            setIsExporting(false);
        }
    };

    if (!slidesContext) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <p className="text-slate-500 mb-4">No content selected for slide generation.</p>
                <Button onClick={handleBack}>Go Back</Button>
            </div>
        );
    }

    if (view === 'results') {
        const activeDeck = generatedDecks[activeDeckIndex];
        const activeSlide = activeDeck?.slides[activeSlideIndex];

        if (!activeDeck) return <LoadingSpinner title="Initializing..." message="Preparing your slides..." progress={10} />;

        const isDeckLoading = activeDeck.slides.some(s => s.isLoading);

        return (
            <div className="animate-fadeIn max-w-6xl mx-auto relative pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Generated Slides</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-semibold text-slate-600 flex-shrink-0">Viewing Deck:</span>
                            <div className="w-100">
                                <Select 
                                    value={activeDeckIndex}
                                    onChange={(e) => { setActiveDeckIndex(Number(e.target.value)); setActiveSlideIndex(0); }}
                                    className="!py-1.5"
                                >
                                    {generatedDecks.map((deck, idx) => (
                                        <option key={idx} value={idx}>Lesson {idx + 1}: {deck.title}</option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="primary" onClick={handleDownloadPPTX} disabled={isExporting || isDeckLoading} icon={Presentation}>
                            {isExporting ? 'Exporting...' : 'Download PPTX'}
                        </Button>
                        <Button variant="secondary" onClick={() => setView('input')}>Start Over</Button>
                        <Button variant="secondary" onClick={handleBack}>Close</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 aspect-[16/9] flex flex-col overflow-hidden relative transition-all duration-300">
                            {activeSlide ? (
                                <SlideDesign slide={activeSlide} deckTitle={activeDeck.title} index={activeSlideIndex} total={activeDeck.slides.length} variant="preview" />
                            ) : (
                                <SlideSkeleton />
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <Button variant="secondary" onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))} disabled={activeSlideIndex === 0} icon={ChevronLeft}>Previous</Button>
                            <span className="text-slate-600 font-medium">Slide {activeSlideIndex + 1} of {activeDeck.slides.length}</span>
                            <Button variant="secondary" onClick={() => setActiveSlideIndex(Math.min(activeDeck.slides.length - 1, activeSlideIndex + 1))} disabled={activeSlideIndex === activeDeck.slides.length - 1} icon={ChevronRight}>Next</Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {activeSlide && (
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="text-sm font-semibold text-slate-700">Section: {activeSlide.sectionTitle}</div>
                                <Button size="xs" variant="secondary" icon={Sparkles} onClick={handleRegenerateSection} disabled={activeSlide.isLoading || !!regeneratingSection}>
                                    {regeneratingSection === activeSlide.sectionId ? 'Regenerating...' : 'Regenerate'}
                                </Button>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><LayoutTemplate className="w-4 h-4 text-primary" /> Speaker Notes</h4>
                            {activeSlide && activeSlide.isLoading ? <div className="space-y-2 animate-pulse"><div className="h-4 bg-slate-200 rounded w-full"></div><div className="h-4 bg-slate-200 rounded w-5/6"></div></div> : <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{activeSlide?.speakerNotes}</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fadeIn mt-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-lightest rounded-full flex items-center justify-center mx-auto mb-4"><Presentation className="w-8 h-8 text-primary" /></div>
                <h2 className="text-2xl font-bold text-slate-800">Generate Presentation Slides</h2>
                <p className="text-slate-600 mt-2">Transform "<span className="font-semibold">{slidesContext.courseTitle}</span>" into a professional slide deck.</p>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Reference Slide (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-primary-light transition-colors">
                        {!uploadedFile ? (
                            <>
                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-500 mb-2">Upload a reference slide (image/pdf) to mimic design style.</p>
                                <label className="text-primary font-semibold text-sm hover:underline cursor-pointer">Browse Files<input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" /></label>
                            </>
                        ) : (
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200"><span className="text-sm text-slate-700 truncate">{uploadedFile.name}</span><button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button></div>
                        )}
                    </div>
                </div>
                <div className="flex gap-4 pt-4"><Button variant="secondary" onClick={handleBack} className="flex-1">Cancel</Button><Button onClick={handleGenerate} className="flex-1" icon={Presentation}>Generate Decks</Button></div>
            </div>
        </div>
    );
};
