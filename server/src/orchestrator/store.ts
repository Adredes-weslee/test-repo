import { v4 as uuidv4 } from 'uuid';
import { sanitizeEventMessage } from './events';
import { redactPIIDeep } from '../safety/pii';
import {
  AgentEvent,
  AgentRun,
  AgentRunStatus,
  AgentTask,
  AgentTaskStatus,
  AppendEventInput,
  CreateFeedbackInput,
  CreateRunInput,
  CreateTaskInput,
  FeedbackEntry,
} from './types';

import type { RunError } from './types';

export class OrchestratorStore {
  private runs = new Map<string, AgentRun>();
  private tasks = new Map<string, AgentTask>();
  private events: AgentEvent[] = [];
  private feedbackEntries: FeedbackEntry[] = [];
  private evaluationResults = new Map<string, unknown>();

  createRun(input: CreateRunInput = {}): AgentRun {
    const now = new Date();
    const run: AgentRun = {
      id: uuidv4(),
      status: 'created',
      input: input.input,
      createdAt: now,
      updatedAt: now,
    };

    this.runs.set(run.id, run);
    return run;
  }

  getRun(runId: string): AgentRun | undefined {
    return this.runs.get(runId);
  }

  listRuns(): AgentRun[] {
    return Array.from(this.runs.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  updateRunStatus(runId: string, status: AgentRunStatus): AgentRun | undefined {
    const run = this.runs.get(runId);
    if (!run) return undefined;

    const updated: AgentRun = {
      ...run,
      status,
      updatedAt: new Date(),
    };

    this.runs.set(runId, updated);
    return updated;
  }

  setRunOutput(runId: string, output: unknown): AgentRun | undefined {
    const run = this.runs.get(runId);
    if (!run) return undefined;

    const redactedOutput = redactPIIDeep(output);

    const updated: AgentRun = {
      ...run,
      output: redactedOutput,
      updatedAt: new Date(),
    };

    this.runs.set(runId, updated);
    return updated;
  }

  createTask(input: CreateTaskInput): AgentTask {
    const now = new Date();
    const task: AgentTask = {
      id: uuidv4(),
      runId: input.runId,
      status: 'queued',
      description: input.description,
      agent: input.agent,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.tasks.get(taskId);
  }

  updateTaskStatus(
    taskId: string,
    status: AgentTaskStatus,
    result?: unknown
  ): AgentTask | undefined {
    const task = this.tasks.get(taskId);
    if (!task) return undefined;

    const updated: AgentTask = {
      ...task,
      status,
      result: result ?? task.result,
      updatedAt: new Date(),
    };

    this.tasks.set(taskId, updated);
    return updated;
  }

  listTasksByRun(runId: string): AgentTask[] {
    return Array.from(this.tasks.values())
      .filter((task) => task.runId === runId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  listAllTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  appendEvent(input: AppendEventInput): AgentEvent {
    const event: AgentEvent = {
      id: uuidv4(),
      runId: input.runId,
      taskId: input.taskId,
      agent: input.agent,
      type: input.type,
      message: sanitizeEventMessage(input.message),
      meta: redactPIIDeep(input.meta),
      timestamp: new Date(),
    };

    this.events.push(event);
    return event;
  }

  listEventsByRun(runId: string): AgentEvent[] {
    return this.events
      .filter((event) => event.runId === runId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  addFeedback(input: CreateFeedbackInput): FeedbackEntry {
    const feedback: FeedbackEntry = {
      id: uuidv4(),
      runId: input.runId,
      artifactType: input.artifactType,
      artifactId: input.artifactId,
      decision: input.decision,
      rating: input.rating,
      comment: input.comment,
      createdAt: new Date(),
    };

    this.feedbackEntries.push(feedback);
    return feedback;
  }

  listFeedbackByRun(runId: string): FeedbackEntry[] {
    return this.feedbackEntries
      .filter((entry) => entry.runId === runId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  listAllFeedback(): FeedbackEntry[] {
    return [...this.feedbackEntries].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  setRunEvaluation(runId: string, evaluation: unknown): void {
    this.evaluationResults.set(runId, evaluation);
  }

  getRunEvaluation(runId: string): unknown {
    return this.evaluationResults.get(runId);
  }
  
  setRunError(runId: string, error: unknown): AgentRun | undefined {
    const run = this.runs.get(runId);
    if (!run) return undefined;

    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Run failed';

    const updated: AgentRun = {
      ...run,
      status: 'failed',
      error: { message },
      updatedAt: new Date(),
    };

    this.runs.set(runId, updated);
    return updated;
  }


  listRunEvaluations(): { runId: string; evaluation: unknown }[] {
    return Array.from(this.evaluationResults.entries()).map(([runId, evaluation]) => ({
      runId,
      evaluation,
    }));
  }
}

export const orchestratorStore = new OrchestratorStore();
