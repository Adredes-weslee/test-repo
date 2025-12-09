import { agentHandlers } from '../agents';
import { orchestratorStore, OrchestratorStore } from './store';
import { AgentTask, CreateTaskInput } from './types';

type TaskHandler = (task: AgentTask) => Promise<unknown> | unknown;

export interface QueueOptions {
  concurrency?: number;
  handlers: Record<string, TaskHandler>;
  store?: OrchestratorStore;
}

export interface QueueState {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  activeWorkers: number;
  concurrency: number;
}

export class InProcessQueue {
  private readonly store: OrchestratorStore;
  private readonly handlers: Record<string, TaskHandler>;
  private readonly concurrency: number;
  private readonly pendingTaskIds: string[] = [];

  private activeWorkers = 0;
  private queuedCount = 0;
  private runningCount = 0;
  private completedCount = 0;
  private failedCount = 0;
  private stopped = false;
  private shutdownResolver?: () => void;
  private shutdownPromise?: Promise<void>;

  constructor(options: QueueOptions) {
    this.store = options.store ?? orchestratorStore;
    this.handlers = options.handlers;
    const configured = Number(process.env.QUEUE_CONCURRENCY);
    this.concurrency = Number.isFinite(configured) && configured > 0
      ? configured
      : options.concurrency ?? 2;

    this.attachSignalHandlers();
  }

  enqueue(input: CreateTaskInput): AgentTask {
    const task = this.store.createTask(input);
    this.queuedCount += 1;
    this.pendingTaskIds.push(task.id);

    this.store.appendEvent({
      runId: task.runId,
      taskId: task.id,
      agent: input.agent ?? 'unknown',
      type: 'task_queued',
      message: 'Task queued',
    });

    this.processQueue();
    return task;
  }

  getQueueState(): QueueState {
    return {
      queued: this.queuedCount,
      running: this.runningCount,
      completed: this.completedCount,
      failed: this.failedCount,
      activeWorkers: this.activeWorkers,
      concurrency: this.concurrency,
    };
  }

  async shutdown(): Promise<void> {
    this.stopped = true;
    if (this.activeWorkers === 0) {
      return Promise.resolve();
    }

    if (!this.shutdownPromise) {
      this.shutdownPromise = new Promise((resolve) => {
        this.shutdownResolver = resolve;
      });
    }

    return this.shutdownPromise;
  }

  private attachSignalHandlers(): void {
    const handleSignal = async () => {
      await this.shutdown();
    };

    process.once('SIGINT', handleSignal);
    process.once('SIGTERM', handleSignal);
  }

  private processQueue(): void {
    if (this.stopped) return;

    while (this.activeWorkers < this.concurrency && this.pendingTaskIds.length > 0) {
      const taskId = this.pendingTaskIds.shift();
      if (taskId) {
        void this.runTask(taskId);
      }
    }
  }

  private async runTask(taskId: string): Promise<void> {
    this.activeWorkers += 1;
    this.queuedCount = Math.max(0, this.queuedCount - 1);
    this.runningCount += 1;

    const task = this.store.updateTaskStatus(taskId, 'running');
    if (task?.runId) {
      this.store.updateRunStatus(task.runId, 'running');
    }

    if (task) {
      this.store.appendEvent({
        runId: task.runId,
        taskId: task.id,
        agent: task.agent ?? 'unknown',
        type: 'task_started',
        message: 'Task started',
      });

      this.store.appendEvent({
        runId: task.runId,
        taskId: task.id,
        agent: task.agent ?? 'unknown',
        type: 'agent_started',
        message: 'Agent handler started',
      });
    }

    try {
      const handler = this.resolveHandler(task);
      const result = await handler(task as AgentTask);
      this.store.updateTaskStatus(taskId, 'succeeded', result);

      if (task) {
        this.store.appendEvent({
          runId: task.runId,
          taskId: task.id,
          agent: task.agent ?? 'unknown',
          type: 'task_succeeded',
          message: 'Task succeeded',
        });

        this.store.appendEvent({
          runId: task.runId,
          taskId: task.id,
          agent: task.agent ?? 'unknown',
          type: 'agent_output_ready',
          message: 'Agent produced output',
          meta: { output: result },
        });

        this.store.appendEvent({
          runId: task.runId,
          taskId: task.id,
          agent: task.agent ?? 'unknown',
          type: 'agent_completed',
          message: 'Agent completed successfully',
        });
      }

      this.completedCount += 1;
    } catch (error) {
      this.store.updateTaskStatus(taskId, 'failed');

      if (task) {
        this.store.appendEvent({
          runId: task.runId,
          taskId: task.id,
          agent: task.agent ?? 'unknown',
          type: 'task_failed',
          message: error instanceof Error ? error.message : 'Task failed',
        });

        this.store.appendEvent({
          runId: task.runId,
          taskId: task.id,
          agent: task.agent ?? 'unknown',
          type: 'agent_failed',
          message: error instanceof Error ? error.message : 'Agent failed',
        });
      }

      this.failedCount += 1;
    } finally {
      this.runningCount = Math.max(0, this.runningCount - 1);
      this.activeWorkers = Math.max(0, this.activeWorkers - 1);

      if (this.stopped && this.activeWorkers === 0 && this.shutdownResolver) {
        this.shutdownResolver();
      }

      this.processQueue();
    }
  }

  private resolveHandler(task?: AgentTask): TaskHandler {
    if (!task) {
      return async () => undefined;
    }

    const handler = (task.agent && this.handlers[task.agent]) || this.handlers.default;
    if (!handler) {
      throw new Error(`No handler found for agent: ${task.agent ?? 'default'}`);
    }

    return handler;
  }
}

export const inProcessQueue = new InProcessQueue({
  handlers: agentHandlers,
});
