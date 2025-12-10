import React, { useEffect } from 'react';
import { Button } from '../ui';
import type { OrchestratorDebugSnapshot } from '../../services/orchestratorDebugStore';

type AgentTask = {
    id: string;
    runId: string;
    status: string;
    description?: string;
    agent?: string;
    result?: unknown;
    createdAt?: string;
    updatedAt?: string;
};

type GenerationDebugPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    snapshot: OrchestratorDebugSnapshot | null;
    onRunDirectCompare?: () => Promise<void>;
    isComparing: boolean;
};

const formatJson = (data: any) => data === undefined ? 'N/A' : JSON.stringify(data, null, 2);

const getTaskLabel = (task?: Partial<AgentTask>) =>
    task?.description ?? task?.agent ?? task?.id ?? 'Unknown';

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

const normalizeLogs = (logPayload: any): string[] => {
    if (!logPayload) return [];
    if (Array.isArray(logPayload)) return logPayload.map(entry => (typeof entry === 'string' ? entry : JSON.stringify(entry)));
    if (Array.isArray(logPayload?.logs)) return logPayload.logs.map((entry: any) => (typeof entry === 'string' ? entry : JSON.stringify(entry)));
    return [];
};

const capLogs = (logs: string[], limit = 200) => logs.slice(Math.max(0, logs.length - limit));

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
    const stagedOutputs = snapshot?.outputs ?? {
        discovery: (snapshot?.run as any)?.output?.discovery,
        generation: (snapshot?.run as any)?.output?.generation,
        validation: (snapshot?.run as any)?.output?.validation,
    };
    const tasks = Array.isArray(snapshot?.tasks) ? snapshot.tasks : [];
    const compactLogs = capLogs(normalizeLogs(snapshot?.logsCompact ?? snapshot?.logs));
    const fallbackLogs = capLogs(normalizeLogs(snapshot?.logs));
    const logLines = compactLogs.length > 0 ? compactLogs : fallbackLogs;
    const validation = stagedOutputs?.validation ?? {};
    const validationHasSummary = validation?.pass !== undefined || validation?.andragogyScore !== undefined || validation?.pedagogyScore !== undefined || validation?.reasons !== undefined;
    const feedbackList =
        (snapshot as any)?.feedback?.feedback ??
        (snapshot as any)?.feedback ??
        [];

    const renderMode = () => {
        if (snapshot?.mode && snapshot.mode !== 'unknown') return snapshot.mode;
        if (snapshot?.mode === undefined || snapshot?.mode === null) return 'unknown (health unavailable)';
        return 'unknown';
    };

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
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between p-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Generation Debug</h2>
                        {snapshot?.updatedAt && (
                            <p className="text-xs text-slate-500">
                                Updated: {new Date(snapshot.updatedAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {onRunDirectCompare && (
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onRunDirectCompare}
                                disabled={isComparing || !snapshot?.input?.topic}
                            >
                                {isComparing ? 'Comparing...' : 'Run Direct Compare'}
                            </Button>
                        )}
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
                        <div className="p-3 rounded border border-slate-200 bg-slate-50">
                            <p className="font-semibold mb-1">Run Metadata</p>
                            <p className="text-slate-600"><span className="font-medium">Orchestration ID:</span> {snapshot?.orchestrationId ?? 'N/A'}</p>
                            <p className="text-slate-600"><span className="font-medium">Status:</span> {snapshot?.run?.status ?? 'N/A'}</p>
                            {snapshot?.run?.createdAt && (
                                <p className="text-slate-600"><span className="font-medium">Created:</span> {new Date(snapshot.run.createdAt).toLocaleString()}</p>
                            )}
                            {snapshot?.run?.updatedAt && (
                                <p className="text-slate-600"><span className="font-medium">Updated:</span> {new Date(snapshot.run.updatedAt).toLocaleString()}</p>
                            )}
                        </div>
                        <div className="p-3 rounded border border-slate-200 bg-slate-50">
                            <p className="font-semibold mb-1">Mode</p>
                            <p className="text-slate-600">{renderMode()}</p>
                        </div>
                    </div>

                    <div className="p-3 rounded border border-slate-200 bg-white">
                        <p className="font-semibold mb-2">Stage Outputs</p>
                        <div className="space-y-2">
                            <details className="border border-slate-200 rounded">
                                <summary className="cursor-pointer px-3 py-2 font-medium">Discovery Output</summary>
                                <pre className="bg-slate-900 text-slate-100 p-3 text-xs overflow-auto max-h-60">
                                    {formatJson(stagedOutputs?.discovery)}
                                </pre>
                            </details>
                            <details className="border border-slate-200 rounded">
                                <summary className="cursor-pointer px-3 py-2 font-medium">Generation Output</summary>
                                <pre className="bg-slate-900 text-slate-100 p-3 text-xs overflow-auto max-h-60">
                                    {formatJson(stagedOutputs?.generation)}
                                </pre>
                            </details>
                            <details className="border border-slate-200 rounded">
                                <summary className="cursor-pointer px-3 py-2 font-medium flex items-center justify-between">
                                    <span>Validation Output</span>
                                    {validation?.pass !== undefined && (
                                        <span className={`text-xs px-2 py-0.5 rounded ${validation.pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {validation.pass ? 'Pass' : 'Fail'}
                                        </span>
                                    )}
                                </summary>
                                <div className="space-y-2 p-3">
                                    {validationHasSummary && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                            <div className="p-2 rounded border border-slate-200 bg-slate-50">
                                                <p className="font-semibold">Pass</p>
                                                <p>{validation?.pass === undefined ? 'N/A' : validation.pass ? 'Yes' : 'No'}</p>
                                            </div>
                                            <div className="p-2 rounded border border-slate-200 bg-slate-50">
                                                <p className="font-semibold">Andragogy Score</p>
                                                <p>{validation?.andragogyScore ?? 'N/A'}</p>
                                            </div>
                                            <div className="p-2 rounded border border-slate-200 bg-slate-50">
                                                <p className="font-semibold">Pedagogy Score</p>
                                                <p>{validation?.pedagogyScore ?? 'N/A'}</p>
                                            </div>
                                            {Array.isArray(validation?.reasons) && validation.reasons.length > 0 && (
                                                <div className="p-2 rounded border border-slate-200 bg-slate-50 sm:col-span-3">
                                                    <p className="font-semibold">Reasons</p>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {validation.reasons.map((reason: any, idx: number) => (
                                                            <li key={idx}>{typeof reason === 'string' ? reason : JSON.stringify(reason)}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <pre className="bg-slate-900 text-slate-100 p-3 text-xs overflow-auto max-h-60">
                                        {formatJson(stagedOutputs?.validation)}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    </div>

                    <div className="p-3 rounded border border-slate-200 bg-white">
                        <p className="font-semibold mb-2">Tasks</p>
                        {tasks.length === 0 ? (
                            <p className="text-xs text-slate-500">No tasks returned by API for this run.</p>
                        ) : (
                            <div className="space-y-2">
                                {tasks.map((task, idx) => {
                                    const duration = task?.durationMs ?? task?.duration ?? task?.elapsedMs;
                                    return (
                                        <div key={task?.id ?? idx} className="border border-slate-200 rounded p-2 text-xs bg-slate-50">
                                            <p><span className="font-semibold">Name:</span> {getTaskLabel(task)}</p>
                                            {task?.agent && <p className="text-[11px] text-slate-500">Agent: {task.agent}</p>}
                                            <p><span className="font-semibold">Status:</span> {task?.status ?? 'N/A'}</p>
                                            {duration !== undefined && <p><span className="font-semibold">Duration:</span> {duration} ms</p>}
                                            {task?.error && <p className="text-red-600"><span className="font-semibold">Error:</span> {typeof task.error === 'string' ? task.error : JSON.stringify(task.error)}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {logLines.length > 0 && (
                        <div className="p-3 rounded border border-slate-200 bg-white">
                            <p className="font-semibold mb-2">Logs {snapshot?.logsCompact ? '(compact)' : ''}</p>
                            <pre className="bg-slate-900 text-slate-100 p-3 text-xs overflow-auto max-h-64 whitespace-pre-wrap">
                                {logLines.join('\n')}
                            </pre>
                        </div>
                    )}

                    {snapshot?.feedback && (
                        <div className="p-3 rounded border border-slate-200 bg-white">
                            <p className="font-semibold mb-2">Feedback (read-only)</p>
                            {Array.isArray(feedbackList) && feedbackList.length === 0 && (
                                <p className="text-xs text-slate-500 mb-2">No feedback submitted for this run yet.</p>
                            )}
                            <pre className="bg-slate-900 text-slate-100 p-3 text-xs overflow-auto max-h-60">
                                {formatJson(snapshot.feedback)}
                            </pre>
                        </div>
                    )}

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
