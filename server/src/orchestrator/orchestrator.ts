import { ValidationResult } from '../agents/validationAgent';
import { inProcessQueue } from './queue';
import { orchestratorStore } from './store';
import { AgentRun, AgentTask } from './types';

const SUMMARY_MAX_LENGTH = 200;

const summarizeOutput = (output: unknown, fallback: string): string => {
  if (!output) return fallback;

  if (typeof output === 'string') {
    return output.length > SUMMARY_MAX_LENGTH
      ? `${output.slice(0, SUMMARY_MAX_LENGTH - 3)}...`
      : output;
  }

  const asString = JSON.stringify(output);
  return asString.length > SUMMARY_MAX_LENGTH
    ? `${asString.slice(0, SUMMARY_MAX_LENGTH - 3)}...`
    : asString;
};

const waitForTaskCompletion = async (
  taskId: string,
  onRunning?: () => void
): Promise<AgentTask> => {
  return new Promise((resolve, reject) => {
    let hasStarted = false;
    const interval = setInterval(() => {
      const task = orchestratorStore.getTask(taskId);
      if (!task) return;

      if (task.status === 'running' && !hasStarted) {
        hasStarted = true;
        onRunning?.();
      }

      if (task.status === 'succeeded') {
        clearInterval(interval);
        resolve(task);
      }

      if (task.status === 'failed') {
        clearInterval(interval);
        reject(new Error('Task failed'));
      }
    }, 50);
  });
};

const buildGenerationDescription = (discoveryResult: unknown): string => {
  const summary = summarizeOutput(
    discoveryResult,
    'Use the discovery findings to inform generation.'
  );
  return `Generate a curriculum plan informed by discovery insights. Summary: ${summary}`;
};

const buildValidationDescription = (generationResult: unknown): string => {
  const summary = summarizeOutput(
    generationResult,
    'Evaluate the generated curriculum for quality.'
  );
  return `Validate the generated curriculum. Summary: ${summary}`;
};

const evaluateValidationResult = (result: Partial<ValidationResult>): boolean => {
  if (typeof result.pass === 'boolean') {
    return result.pass;
  }

  const andragogyScore =
    typeof result.andragogyScore === 'number' ? result.andragogyScore : 0;
  const pedagogyScore =
    typeof result.pedagogyScore === 'number' ? result.pedagogyScore : 0;

  return andragogyScore >= 0.7 && pedagogyScore >= 0.7;
};

const initializeRun = (payload: unknown): AgentRun => {
  const run = orchestratorStore.createRun({ input: payload });
  orchestratorStore.updateRunStatus(run.id, 'created');
  return run;
};

const runWorkflow = async (runId: string): Promise<AgentRun | undefined> => {
  const run = orchestratorStore.getRun(runId);
  if (!run) return undefined;

  let runStarted = false;
  let runFailed = false;

  const emitRunStarted = () => {
    if (runStarted) return;
    runStarted = true;
    orchestratorStore.appendEvent({
      runId: run.id,
      agent: 'orchestrator',
      type: 'run_started',
      message: 'Run started',
    });
  };

  const emitRunFailed = (message: string) => {
    if (runFailed) return;
    runFailed = true;
    orchestratorStore.updateRunStatus(run.id, 'failed');
    orchestratorStore.appendEvent({
      runId: run.id,
      agent: 'orchestrator',
      type: 'run_failed',
      message,
    });
  };

  try {
    const discoveryTask = inProcessQueue.enqueue({
      runId: run.id,
      agent: 'discovery',
      description: 'Perform discovery to understand learner needs.',
    });

    const discoveryCompleted = await waitForTaskCompletion(
      discoveryTask.id,
      emitRunStarted
    );

    const generationTask = inProcessQueue.enqueue({
      runId: run.id,
      agent: 'generation',
      description: buildGenerationDescription(discoveryCompleted.result),
    });

    const generationCompleted = await waitForTaskCompletion(
      generationTask.id,
      emitRunStarted
    );

    const validationTask = inProcessQueue.enqueue({
      runId: run.id,
      agent: 'validation',
      description: buildValidationDescription(generationCompleted.result),
    });

    const validationCompleted = await waitForTaskCompletion(
      validationTask.id,
      emitRunStarted
    );

    const validationResult = (validationCompleted.result ?? {}) as ValidationResult;
    const passed = evaluateValidationResult(validationResult);

    if (!passed) {
      emitRunFailed('Validation did not pass.');
      return orchestratorStore.getRun(run.id);
    }

    orchestratorStore.updateRunStatus(run.id, 'completed');
    orchestratorStore.setRunOutput(run.id, {
      discovery: discoveryCompleted.result,
      generation: generationCompleted.result,
      validation: validationResult,
    });

    orchestratorStore.appendEvent({
      runId: run.id,
      agent: 'orchestrator',
      type: 'run_completed',
      message: 'Run completed successfully',
    });

    return orchestratorStore.getRun(run.id);
  } catch (error) {
    emitRunFailed(error instanceof Error ? error.message : 'Run failed');
    return orchestratorStore.getRun(run.id);
  }
};

export const startRun = async (payload: unknown): Promise<AgentRun | undefined> => {
  const run = initializeRun(payload);
  return runWorkflow(run.id);
};

export const startRunAsync = (payload: unknown): { runId: string } => {
  const run = initializeRun(payload);
  void runWorkflow(run.id);
  return { runId: run.id };
};
