
import React, { useEffect, useState } from 'react';
import { LessonPlanViewer } from './components/LessonPlanViewer';
import { useGeneration } from './hooks';
import { ConfirmationModal, LoadingSpinner } from '../../components/ui';
import { CapstoneWorkspace } from './components/capstone/CapstoneWorkspace';
import { GenerationInputForm } from './components/GenerationInputForm';
import { useCurriculumStore } from '../../store';
import { GenerationDebugPanel } from '../../components/orchestrator/GenerationDebugPanel';
import { generateCurriculum as generateCurriculumApi } from '../../api/generateCurriculum';
import { getLastOrchestratorDebug, mergeLastOrchestratorDebug } from '../../services/orchestratorDebugStore';

const GenerationFeature: React.FC = () => {
    const hookValues = useGeneration();
    const {
        generationMode,
        isCancelModalOpen,
        closeCancelModal,
        confirmCancelAction,
        view,
        progress,
        handleGenerate,
        isTrashModalOpen,
        closeTrashModal,
        confirmTrash,
        openTrashModal,
    } = hookValues;
    const { startGenerationWithPrompt, setStartGenerationWithPrompt } = useCurriculumStore();
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    const [debugSnapshot, setDebugSnapshot] = useState<any | null>(null);
    const [isComparing, setIsComparing] = useState(false);

    useEffect(() => {
        if (startGenerationWithPrompt) {
            handleGenerate(startGenerationWithPrompt.prompt, startGenerationWithPrompt.type, null);
            setStartGenerationWithPrompt(null);
        }
    }, [startGenerationWithPrompt, setStartGenerationWithPrompt, handleGenerate]);

    const openDebugPanel = () => {
        setDebugSnapshot(getLastOrchestratorDebug());
        setIsDebugOpen(true);
    };

    const closeDebugPanel = () => setIsDebugOpen(false);

    const runDirectCompare = async () => {
        const snap = getLastOrchestratorDebug();
        if (!snap?.input?.topic) {
            return;
        }

        setIsComparing(true);
        try {
            const direct = await generateCurriculumApi(
                snap.input.topic,
                snap.input.filters || {},
                snap.input.files || [],
                (_p: number) => {}
            );

            mergeLastOrchestratorDebug({
                directGeneration: direct,
                directError: null,
            });
        } catch (err) {
            mergeLastOrchestratorDebug({
                directGeneration: null,
                directError: err instanceof Error ? err.message : String(err),
            });
        } finally {
            setDebugSnapshot(getLastOrchestratorDebug());
            setIsComparing(false);
        }
    };
    
    const renderContent = () => {
        if (view === 'loading') {
            return (
                <div className="relative min-h-[60vh]">
                    <LoadingSpinner
                        title={generationMode === 'course' ? 'Generating Course...' : 'Generating Project...'}
                        message={generationMode === 'course' ? 'Our AI is building your lessons...' : 'Our AI is scaffolding your project...'}
                        progress={progress}
                        onCancel={hookValues.openCancelModal}
                    />
                </div>
            )
        }

        if (view === 'idle') {
            return <GenerationInputForm 
                onGenerate={hookValues.handleGenerate}
                isLoading={false}
            />;
        }

        switch(generationMode) {
            case 'course':
                return (
                     <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                     {/*
                        <div className="w-full lg:col-span-1 lg:flex-shrink-0 space-y-6 lg:top-8">
                        </div>
                     */}
                        <LessonPlanViewer
                            view={hookValues.view}
                            isGenerating={hookValues.isGeneratingLessons}
                            progress={hookValues.lessonGenerationProgress}
                            lessonPlans={hookValues.lessonPlans}
                            currentCurriculum={hookValues.generatedCurriculum}
                            generationOptions={hookValues.lastGenOptions}
                            generationDate={hookValues.generationDate}
                            regeneratingPart={hookValues.regeneratingPart}
                            onSaveContent={hookValues.handleSaveContent}
                            onRegenerate={hookValues.handleRegeneratePart}
                            onGenerateNewPart={hookValues.handleGenerateNewPart}
                            onUpdateLessonPlan={hookValues.handleUpdateLessonPlan}
                            onUpdateLessonTitle={hookValues.handleUpdateLessonTitle}
                            onUpdateCurriculumTitle={hookValues.handleUpdateCurriculumTitle}
                            onCancel={hookValues.openCancelModal}
                            lastRegeneratedTitle={hookValues.lastRegeneratedTitle}
                            lastRegeneratedCurriculumTitle={hookValues.lastRegeneratedCurriculumTitle}
                            onDuplicateAndVary={hookValues.handleDuplicateAndVary}
                            isDuplicating={hookValues.isDuplicating}
                            onDiscard={openTrashModal}
                            andragogyAnalysis={hookValues.andragogyAnalysis}
                            isAnalyzingAndragogy={hookValues.isAnalyzingAndragogy}
                            onOpenDebug={openDebugPanel}
                        />
                    </div>
                );
            case 'capstone':
                return <CapstoneWorkspace {...hookValues} />;
            default:
                return <GenerationInputForm 
                    onGenerate={hookValues.handleGenerate}
                    isLoading={false}
                />;
        }
    };

    return (
        <>
            {renderContent()}
            <GenerationDebugPanel
                isOpen={isDebugOpen}
                onClose={closeDebugPanel}
                snapshot={debugSnapshot}
                onRunDirectCompare={runDirectCompare}
                isComparing={isComparing}
            />
            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={closeCancelModal}
                onConfirm={confirmCancelAction}
                title="Stop Generating"
                message="Are you sure you want to stop? All progress will be lost."
                cancelButtonText="Continue Generating"
                confirmButtonText="Stop"
            />
            <ConfirmationModal
                isOpen={isTrashModalOpen}
                onClose={closeTrashModal}
                onConfirm={confirmTrash}
                title="Discard Generation"
                message="Are you sure you want to discard this generation and start a new discovery? All unsaved progress will be lost."
                cancelButtonText="Keep Generating"
                confirmButtonText="Discard"
                variant="danger"
            />
        </>
    );
};

export default GenerationFeature;
