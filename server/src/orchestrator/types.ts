export type AgentRunStatus =
  | 'created'
  | 'running'
  | 'awaiting_human'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface AgentRun {
  id: string;
  status: AgentRunStatus;
  input?: unknown;
  output?: unknown;
  error?: RunError;
  createdAt: Date;
  updatedAt: Date;
}

export interface RunError {
  message: string;
}


export type AgentTaskStatus =
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'blocked';

export interface AgentTask {
  id: string;
  runId: string;
  status: AgentTaskStatus;
  description?: string;
  displayName?: string;
  agent?: string;
  result?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentEvent {
  id: string;
  runId: string;
  taskId?: string;
  agent: string;
  type: string;
  message: string;
  timestamp: Date;
  meta?: Record<string, unknown>;
}

export interface CreateRunInput {
  input?: unknown;
  agent?: string;
  meta?: Record<string, unknown>;
}

export interface CreateTaskInput {
  runId: string;
  description?: string;
  displayName?: string;
  agent?: string;
  meta?: Record<string, unknown>;
}

export interface AppendEventInput {
  runId: string;
  taskId?: string;
  agent: string;
  type: string;
  message: string;
  meta?: Record<string, unknown>;
}

export type FeedbackDecision = 'accept' | 'edit' | 'reject';

export interface FeedbackEntry {
  id: string;
  runId: string;
  artifactType?: 'curriculum' | 'lesson' | 'capstone' | string;
  artifactId?: string;
  decision: FeedbackDecision;
  rating?: number;
  comment?: string;
  createdAt: Date;
}

export interface CreateFeedbackInput {
  runId: string;
  artifactType?: 'curriculum' | 'lesson' | 'capstone' | string;
  artifactId?: string;
  decision: FeedbackDecision;
  rating?: number;
  comment?: string;
}

export type StrategyBundle =
  | 'Authentic Alignment'
  | 'Guided Participation'
  | 'Learner Agency & Reflection'
  | 'Collaborative Practice'
  | 'Multimedia & Accessibility';

export interface StrategySelectionResult {
  strategyBundles: StrategyBundle[];
  rationales: string[];
  confidence?: number;
  source?: string;
  rawOutput?: unknown;
}

export interface RunOutput {
  discovery?: unknown;
  strategySelection?: StrategySelectionResult;
  generation?: unknown;
  validation?: unknown;
}
