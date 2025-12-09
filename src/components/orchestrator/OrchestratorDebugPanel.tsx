import React, { useMemo, useState } from 'react';
import { Collapsible } from '../ui';

const stringify = (value: unknown) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
};

type OrchestratorDebugPanelProps = {
  enabled: boolean;
  topic: string;
  filters: unknown;
  filesCount: number;

  orchestrationId?: string | null;
  run?: any;
  logs?: any[];

  orchestratorGeneration?: any;
  directGeneration?: any;

  directError?: string | null;
};

const summarizeGeneration = (data: any) => {
  const curriculums = Array.isArray(data?.curriculums)
    ? data.curriculums
    : data?.curriculum
      ? [data.curriculum]
      : [];

  const firstCurriculum = curriculums[0] ?? {};
  const modules = Array.isArray(firstCurriculum?.modules) ? firstCurriculum.modules : [];

  const lessonCounts = modules.map((module: any) => {
    const lessons = Array.isArray(module?.lessons) ? module.lessons : [];
    return lessons.length;
  });

  return {
    curriculumCount: curriculums.length,
    moduleCount: modules.length,
    lessonCounts,
    curriculumTitle: firstCurriculum?.title || firstCurriculum?.curriculumTitle || '',
    moduleTitles: modules.map((module: any) => module?.title || module?.moduleTitle || 'Untitled Module'),
  };
};

const renderComparisonTable = (orchestrator: any, direct: any) => {
  const orchestratorSummary = summarizeGeneration(orchestrator || {});
  const directSummary = summarizeGeneration(direct || {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-3 border rounded-lg bg-white/60">
        <h4 className="font-semibold text-slate-800 mb-2">Orchestrator</h4>
        <p className="text-sm text-slate-600">Curriculums: {orchestratorSummary.curriculumCount}</p>
        <p className="text-sm text-slate-600">Modules (first): {orchestratorSummary.moduleCount}</p>
        <p className="text-sm text-slate-600">Lessons per module: {orchestratorSummary.lessonCounts.join(', ') || 'N/A'}</p>
        <div className="mt-2">
          <p className="text-xs font-semibold text-slate-700">Curriculum Title</p>
          <p className="text-xs text-slate-600 break-words">{orchestratorSummary.curriculumTitle || '—'}</p>
        </div>
        {orchestratorSummary.moduleTitles.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-slate-700">Module Titles</p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
              {orchestratorSummary.moduleTitles.map((title, idx) => (
                <li key={idx}>{title || 'Untitled Module'}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="p-3 border rounded-lg bg-white/60">
        <h4 className="font-semibold text-slate-800 mb-2">Direct</h4>
        <p className="text-sm text-slate-600">Curriculums: {directSummary.curriculumCount}</p>
        <p className="text-sm text-slate-600">Modules (first): {directSummary.moduleCount}</p>
        <p className="text-sm text-slate-600">Lessons per module: {directSummary.lessonCounts.join(', ') || 'N/A'}</p>
        <div className="mt-2">
          <p className="text-xs font-semibold text-slate-700">Curriculum Title</p>
          <p className="text-xs text-slate-600 break-words">{directSummary.curriculumTitle || '—'}</p>
        </div>
        {directSummary.moduleTitles.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-slate-700">Module Titles</p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
              {directSummary.moduleTitles.map((title, idx) => (
                <li key={idx}>{title || 'Untitled Module'}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const OrchestratorDebugPanel: React.FC<OrchestratorDebugPanelProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    enabled,
    topic,
    filters,
    filesCount,
    orchestrationId,
    run,
    logs,
    orchestratorGeneration,
    directGeneration,
    directError,
  } = props;

  const comparison = useMemo(
    () => renderComparisonTable(orchestratorGeneration, directGeneration),
    [orchestratorGeneration, directGeneration]
  );

  const hasData = Boolean(topic) || Boolean(orchestrationId) || Boolean(directGeneration);

  return (
    <div className="mt-8 border rounded-lg bg-slate-50/70 p-4">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div>
          <p className="text-sm font-semibold text-slate-800">Orchestrator Debug Panel</p>
          <p className="text-xs text-slate-600">{enabled ? 'Orchestrator enabled' : 'Orchestrator disabled'}</p>
        </div>
        <span className="text-xs text-primary font-semibold">{isOpen ? 'Hide' : 'Show'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 text-sm text-slate-700">
          {!hasData && <p className="text-xs text-slate-500">No debug data recorded yet.</p>}

          {hasData && (
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-800">Input</p>
                <p className="text-xs text-slate-600">Topic: {topic || '—'}</p>
                <p className="text-xs text-slate-600">Files: {filesCount}</p>
                <Collapsible
                  title={<span className="text-xs font-semibold text-slate-700">Filters</span>}
                  containerClassName="border border-slate-200 rounded"
                  headerClassName="px-3 py-2"
                  contentClassName="px-3 pb-3"
                  defaultOpen={false}
                >
                  <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-auto">{stringify(filters)}</pre>
                </Collapsible>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-slate-800">Orchestration</p>
                  <p className="text-xs text-slate-600">ID: {orchestrationId || '—'}</p>
                  <p className="text-xs text-slate-600">Status: {run?.status || '—'}</p>
                  {run?.createdAt && <p className="text-xs text-slate-600">Created: {run.createdAt}</p>}
                  {run?.updatedAt && <p className="text-xs text-slate-600">Updated: {run.updatedAt}</p>}
                  <Collapsible
                    title={<span className="text-xs font-semibold text-slate-700">Full Run</span>}
                    containerClassName="border border-slate-200 rounded mt-2"
                    headerClassName="px-3 py-2"
                    contentClassName="px-3 pb-3"
                    defaultOpen={false}
                  >
                    <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-auto">{stringify(run)}</pre>
                  </Collapsible>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Logs</p>
                  <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded max-h-48 overflow-auto whitespace-pre-wrap">{stringify(logs || [])}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-slate-800">Discovery</p>
                  <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-auto">{stringify(run?.output?.discovery || run?.output?.discoveryOutput)}</pre>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Validation</p>
                  <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-auto">{stringify(run?.output?.validation || run?.output?.validationOutput)}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-semibold text-slate-800">Orchestrator Generation</p>
                  <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-auto">{stringify(orchestratorGeneration)}</pre>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Direct Generation</p>
                  {directError ? (
                    <p className="text-xs text-red-600">{directError}</p>
                  ) : (
                    <pre className="text-xs bg-slate-900 text-slate-50 p-2 rounded overflow-auto">{stringify(directGeneration)}</pre>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800 mb-2">Comparison</p>
                {comparison}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrchestratorDebugPanel;
