import React, { useEffect } from 'react';
import { Button } from '../ui';

type GenerationDebugPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    snapshot: any | null;
    onRunDirectCompare: () => Promise<void>;
    isComparing: boolean;
};

const formatJson = (data: any) => data === undefined ? 'N/A' : JSON.stringify(data, null, 2);

const extractCurriculums = (payload: any): any[] => {
    if (!payload) return [];
    if (Array.isArray(payload?.curriculums)) return payload.curriculums;
    if (Array.isArray(payload)) return payload;
    if (payload?.title) return [payload];
    return [];
};

const buildSummary = (payload: any) => {
    const curriculums = extractCurriculums(payload);
    const first = curriculums[0];
    const modules = Array.isArray(first?.modules) ? first.modules : [];

    return {
        curriculumsCount: curriculums.length,
        moduleCount: modules.length,
        lessonsPerModule: modules.map((mod: any) => (Array.isArray(mod?.lessons) ? mod.lessons.length : 0)),
        curriculumTitle: first?.title ?? 'N/A',
        moduleTitles: modules.map((mod: any) => mod?.title ?? 'Untitled Module'),
    };
};

export const GenerationDebugPanel: React.FC<GenerationDebugPanelProps> = ({
    isOpen,
    onClose,
    snapshot,
    onRunDirectCompare,
    isComparing,
}) => {
    // Escape-to-close
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const orchestratorSummary = buildSummary(snapshot?.orchestratorOrFinalGeneration);
    const directSummary = buildSummary(snapshot?.directGeneration);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close when clicking the backdrop itself (not the modal content)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 py-8"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto border border-slate-200">
                
                {/* Sticky header so Close never disappears */}
                <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Generation Debug</h2>
                        {snapshot?.updatedAt && (
                            <p className="text-xs text-slate-500">
                                Updated: {new Date(snapshot.updatedAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={onRunDirectCompare}
                            disabled={isComparing || !snapshot?.input?.topic}
                        >
                            {isComparing ? 'Comparing...' : 'Run Direct Compare'}
                        </Button>
                        <Button variant="secondary" size="small" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>

                <div className="p-4 space-y-4 text-sm text-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded border border-slate-200 bg-slate-50">
                            <p className="font-semibold mb-1">Orchestrator Enabled</p>
                            <p className="text-slate-600">{snapshot?.enabled ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="p-3 rounded border border-slate-200 bg-slate-50">
                            <p className="font-semibold mb-1">Input</p>
                            <p className="text-slate-600">
                                <span className="font-medium">Topic:</span> {snapshot?.input?.topic ?? 'N/A'}
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Files Count:</span> {snapshot?.input?.filesCount ?? 0}
                            </p>
                            <p className="text-slate-600">
                                <span className="font-medium">Filters:</span> {formatJson(snapshot?.input?.filters || {})}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold mb-2">Orchestrator / Final Generation</p>
                            <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-auto max-h-64">
                                {formatJson(snapshot?.orchestratorOrFinalGeneration)}
                            </pre>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Direct Generation</p>
                            <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-auto max-h-64">
                                {snapshot?.directError
                                    ? `Error: ${snapshot.directError}`
                                    : formatJson(snapshot?.directGeneration)}
                            </pre>
                        </div>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <h3 className="font-semibold text-slate-800 mb-3">Comparison</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 rounded border border-slate-200 bg-white">
                                <p className="font-semibold mb-2">Orchestrator / Final</p>
                                <p>Curriculums: {orchestratorSummary.curriculumsCount}</p>
                                <p>Modules: {orchestratorSummary.moduleCount}</p>
                                <p>Lessons per module: {orchestratorSummary.lessonsPerModule.join(', ') || 'N/A'}</p>
                                <p>Title: {orchestratorSummary.curriculumTitle}</p>
                                <p>Module titles: {orchestratorSummary.moduleTitles.join(', ') || 'N/A'}</p>
                            </div>
                            <div className="p-3 rounded border border-slate-200 bg-white">
                                <p className="font-semibold mb-2">Direct Generation</p>
                                <p>Curriculums: {directSummary.curriculumsCount}</p>
                                <p>Modules: {directSummary.moduleCount}</p>
                                <p>Lessons per module: {directSummary.lessonsPerModule.join(', ') || 'N/A'}</p>
                                <p>Title: {directSummary.curriculumTitle}</p>
                                <p>Module titles: {directSummary.moduleTitles.join(', ') || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Optional bottom close for extra safety */}
                    <div className="pt-2 flex justify-end">
                        <Button variant="secondary" size="small" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
