const DEFAULT_ORCHESTRATOR_BASE_URL = 'http://localhost:4000';

const orchestratorBaseUrl = (import.meta.env?.VITE_ORCHESTRATOR_BASE_URL || DEFAULT_ORCHESTRATOR_BASE_URL).replace(/\/$/, '');

export const isOrchestratorEnabled = (import.meta.env?.VITE_USE_ORCHESTRATOR ?? 'false') === 'true';

interface EnvelopeError {
  message?: string;
}

interface FileData {
  mimeType: string;
  data: string;
}

type FilterOptions = { [key: string]: string };

export interface CourseOrchestrationPayload {
  type: 'course';
  topic: string;
  filters: FilterOptions;
  files: FileData[];
  simulation?: boolean;
}

export interface OrchestrationRun {
  id?: string;
  status?: string;
  output?: any;
  error?: EnvelopeError;
}

interface OrchestrationStartResponse {
  id?: string;
  runId?: string;
}

const buildUrl = (path: string) => `${orchestratorBaseUrl}${path}`;

const handleOrchestratorResponse = async <T>(
  response: Response,
  options: { requireData?: boolean } = {}
): Promise<T> => {
  let body: any = null;

  const { requireData = true } = options;

  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  if (!response.ok) {
    const message = body?.error?.message || body?.message || 'Orchestrator request failed';
    throw new Error(message);
  }

  if (body?.error) {
    throw new Error(body.error.message || 'Orchestrator request failed');
  }

  if (requireData && body?.data === undefined) {
    throw new Error('Missing data in orchestrator response');
  }

  return (requireData ? body?.data : body) as T;
};

const unwrapTasks = (body: any): any[] => body?.data?.tasks ?? body?.tasks ?? [];

const unwrapLogs = (body: any): any[] => {
  const logs =
    body?.data?.events ??
    body?.data?.logs ??
    body?.data ??
    body?.logs ??
    body?.events ??
    [];

  return Array.isArray(logs) ? logs : [];
};

const unwrapFeedback = (body: any): { feedback: any[] } => {
  const feedback = body?.data?.feedback ?? body?.feedback ?? [];

  return { feedback: Array.isArray(feedback) ? feedback : [] };
};

export const startOrchestration = async (payload: CourseOrchestrationPayload): Promise<OrchestrationStartResponse> => {
  const response = await fetch(buildUrl('/orchestrations'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleOrchestratorResponse<OrchestrationStartResponse>(response);
};

export const getOrchestrationStatus = async (runId: string): Promise<OrchestrationRun> => {
  const response = await fetch(buildUrl(`/orchestrations/${runId}`));
  const data = await handleOrchestratorResponse<OrchestrationRun | { run: OrchestrationRun }>(response);

  return (data as any).run ?? data;
};

export const getOrchestrationLogs = async (runId: string): Promise<any[]> => {
  const response = await fetch(buildUrl(`/orchestrations/${runId}/logs`));

  return unwrapLogs(await handleOrchestratorResponse<any>(response, { requireData: false }));
};

export const getOrchestrationTasks = async (runId: string): Promise<any[]> => {
  const response = await fetch(buildUrl(`/orchestrations/${runId}/tasks`));

  return unwrapTasks(await handleOrchestratorResponse<any>(response, { requireData: false }));
};

export const getOrchestrationLogsCompact = async (runId: string): Promise<any[]> => {
  const response = await fetch(buildUrl(`/orchestrations/${runId}/logs/compact`));

  return unwrapLogs(await handleOrchestratorResponse<any>(response, { requireData: false }));
};

export const getHealth = async (): Promise<{ simulationMode?: boolean }> => {
  const response = await fetch(buildUrl('/health'));

  const body = await handleOrchestratorResponse<any>(response, { requireData: false });

  return { simulationMode: body?.simulationMode ?? body?.data?.simulationMode };
};

export const getAdminQueue = async (): Promise<any> => {
  const response = await fetch(buildUrl('/admin/queue'));

  return handleOrchestratorResponse<any>(response);
};

export const getAdminTasks = async (): Promise<any> => {
  const response = await fetch(buildUrl('/admin/tasks'));

  return handleOrchestratorResponse<any>(response);
};

export const getOrchestrationFeedback = async (runId: string): Promise<any> => {
  const response = await fetch(buildUrl(`/orchestrations/${runId}/feedback`));

  return unwrapFeedback(await handleOrchestratorResponse<any>(response, { requireData: false }));
};
