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

interface OrchestrationLogs {
  logs: string[];
}

interface OrchestrationStartResponse {
  id?: string;
  runId?: string;
}

const buildUrl = (path: string) => `${orchestratorBaseUrl}${path}`;

const handleOrchestratorResponse = async <T>(response: Response): Promise<T> => {
  let body: any = null;

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

  if (body?.data === undefined) {
    throw new Error('Missing data in orchestrator response');
  }

  return body.data as T;
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

export const getOrchestrationLogs = async (runId: string): Promise<OrchestrationLogs> => {
  const response = await fetch(buildUrl(`/orchestrations/${runId}/logs`));

  return handleOrchestratorResponse<OrchestrationLogs>(response);
};
