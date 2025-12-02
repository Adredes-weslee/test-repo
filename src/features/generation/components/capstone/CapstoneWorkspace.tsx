
import React from 'react';
import type { useGeneration } from '../../hooks';
import { LoadingSpinner } from '../../../../components/ui';
import { ConfigurationView } from './ConfigurationView';
import { InteractiveEnvironmentView } from './InteractiveEnvironmentView';
import { ExportView } from './ExportView';

type UseGenerationReturn = ReturnType<typeof useGeneration>;

export const CapstoneWorkspace: React.FC<UseGenerationReturn> = (props) => {
    const { 
        capstoneView,
        isCapstoneLoading,
        loadingTitle,
        loadingMessage,
        capstoneProgress,
        openCancelModal,
    } = props;

    if (isCapstoneLoading && (capstoneView === 'environment' || capstoneView === 'loading')) {
        return (
            <div className="relative min-h-[60vh]">
                <LoadingSpinner
                    title={loadingTitle}
                    message={loadingMessage}
                    progress={capstoneProgress}
                    onCancel={openCancelModal}
                />
            </div>
        );
    }
    
    switch (capstoneView) {
        case 'configure':
            return <ConfigurationView 
                activeProject={props.activeProject}
                updateSelectedProject={props.updateSelectedProject}
                onDiscard={props.openTrashModal}
                handleGoToEnvironment={props.handleGoToEnvironment}
                handleGoToExport={props.handleGoToExport}
                isGenerating={isCapstoneLoading} // Pass the loading state for detail generation
                handleRegenerateProjectPart={props.handleRegenerateProjectPart}
                isRegeneratingPart={props.isRegeneratingPart}
                capstoneProgress={props.capstoneProgress}
                loadingMessage={props.loadingMessage}
                onCancel={props.openCancelModal}
            />;
        case 'environment':
            return <InteractiveEnvironmentView 
                activeProject={props.activeProject}
                updateSelectedProject={props.updateSelectedProject}
                handleBackToConfiguration={props.handleBackToConfiguration}
                handleGoToExport={props.handleGoToExport}
                handleApplyInstructions={props.handleApplyInstructions}
                isRegenerating={props.isRegenerating}
                handleCancelRegeneration={props.handleCancelGeneration}
                capstoneProgress={props.capstoneProgress}
                handleFileCreate={props.handleFileCreate}
                handleFileRename={props.handleFileRename}
                handleFileDelete={props.handleFileDelete}
            />;
        case 'export':
            return <ExportView 
                activeProject={props.activeProject}
                onDiscard={props.openTrashModal}
            />;
        default:
            return <div className="text-center p-8">Loading project...</div>;
    }
}
