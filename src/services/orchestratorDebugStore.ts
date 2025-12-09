type OrchestratorDebugSnapshot = {
  enabled: boolean;
  orchestrationId?: string | null;
  input?: {
    topic: string;
    filters: Record<string, string>;
    filesCount: number;
    files?: { mimeType: string; data: string }[];
    // optional raw files payload if already available
  };
  // The final curriculum payload used by the Generation UI
  orchestratorOrFinalGeneration?: any;

  // Orchestrator artifacts
  run?: any | null;
  tasks?: any[];
  logs?: any[];
  logsCompact?: any[];
  outputs?: { discovery?: any; generation?: any; validation?: any };
  mode?: 'simulation' | 'live' | 'unknown';
  queue?: any[];
  adminTasks?: any[];
  feedback?: any;

  // Only populated after user triggers compare
  directGeneration?: any;
  directError?: string | null;

  // simple timestamp helps avoid stale UI confusion
  updatedAt?: number;
};

let lastDebug: OrchestratorDebugSnapshot | null = null;

export const setLastOrchestratorDebug = (data: OrchestratorDebugSnapshot) => {
  lastDebug = { ...data, updatedAt: Date.now() };
};

export const mergeLastOrchestratorDebug = (patch: Partial<OrchestratorDebugSnapshot>) => {
  if (!lastDebug) {
    lastDebug = { enabled: false, updatedAt: Date.now(), ...patch } as any;
    return;
  }
  lastDebug = { ...lastDebug, ...patch, updatedAt: Date.now() };
};

export const getLastOrchestratorDebug = () => lastDebug;

export type { OrchestratorDebugSnapshot };
