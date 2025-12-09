
import React, { useEffect, useState } from 'react';
import { LessonPlanViewer } from './components/LessonPlanViewer';
import { useGeneration } from './hooks';
import { ConfirmationModal, LoadingSpinner } from '../../components/ui';
import { CapstoneWorkspace } from './components/capstone/CapstoneWorkspace';
import { GenerationInputForm } from './components/GenerationInputForm';
import { useCurriculumStore } from '../../store';
import { OrchestratorDebugPanel } from '../../components/orchestrator/OrchestratorDebugPanel';
import { getLastOrchestratorDebug } from '../../services/orchestratorDebugStore';

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
    const [debugData, setDebugData] = useState(getLastOrchestratorDebug());

    const status = debugData?.run?.status;
    const isTerminal = ['completed', 'failed', 'cancelled'].includes(status || '');

    useEffect(() => {
        if (startGenerationWithPrompt) {
            handleGenerate(startGenerationWithPrompt.prompt, startGenerationWithPrompt.type, null);
            setStartGenerationWithPrompt(null);
        }
    }, [startGenerationWithPrompt, setStartGenerationWithPrompt, handleGenerate]);

    useEffect(() => {
        if (isTerminal) return;
        const interval = setInterval(() => {
            setDebugData(getLastOrchestratorDebug());
        }, 500);

        return () => clearInterval(interval);
    }, [isTerminal]);
    
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
            <div className="mt-6">
                <OrchestratorDebugPanel
                    enabled={Boolean(debugData?.enabled)}
                    topic={debugData?.input?.topic ?? ''}
                    filters={debugData?.input?.filters ?? {}}
                    filesCount={debugData?.input?.filesCount ?? 0}
                    orchestrationId={debugData?.orchestrationId ?? null}
                    run={debugData?.run ?? null}
                    logs={debugData?.logs ?? []}
                    orchestratorGeneration={debugData?.orchestratorGeneration}
                    directGeneration={debugData?.directGeneration}
                    directError={debugData?.directError ?? null}
                />
            </div>
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
