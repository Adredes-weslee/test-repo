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

const buildStrategySelectionDescription = (discoveryResult: unknown): string => {
  const summary = summarizeOutput(
    discoveryResult,
    'Select strategy bundles grounded in andragogy guidelines.'
  );
  return `Choose learning design strategy bundles using discovery insights. Discovery summary: ${summary}`;
};

const buildStrategySelectionSummary = (strategySelectionResult: unknown): string =>
  summarizeOutput(strategySelectionResult, 'Focus on selected bundles and rationale.');

const buildGenerationDescription = (
  discoveryResult: unknown,
  strategySelectionResult: unknown
): string => {
  const discoverySummary = summarizeOutput(
    discoveryResult,
    'Use the discovery findings to inform generation.'
  );

  const strategySummary = summarizeOutput(
    strategySelectionResult,
    'Prioritize the selected strategy bundles.'
  );

  return [
    'Generate a curriculum plan informed by discovery insights.',
    `Discovery summary: ${discoverySummary}`,
    `Strategy selection summary: ${strategySummary}`,
  ].join(' ');
};

const buildValidationDescription = (
  generationResult: unknown,
  strategySelectionResult?: unknown
): string => {
  const genSummary = summarizeOutput(
    generationResult,
    'Evaluate the generated curriculum for quality.'
  );

  const strategySummary = strategySelectionResult
    ? buildStrategySelectionSummary(strategySelectionResult)
    : '';

  return [
    'Validate the generated curriculum against andragogy and pedagogy expectations.',
    `Generation summary: ${genSummary}`,
    strategySelectionResult ? `Strategy selection summary: ${strategySummary}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

const evaluateValidationResult = (result: Partial<ValidationResult>): boolean => {
  if (typeof result.pass === 'boolean') {
    return result.pass;
  }

  const andragogyScore =
    typeof result.andragogyScore === 'number' ? result.andragogyScore : 0;
  const pedagogyScore =
    typeof result.pedagogyScore === 'number' ? result.pedagogyScore : 0;

  return andragogyScore >= 0.3 && pedagogyScore >= 0.3;
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
    orchestratorStore.setRunError?.(run.id, { message });
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
      displayName: 'Discovery',
      description: 'Perform discovery to understand learner needs.',
    });

    const discoveryCompleted = await waitForTaskCompletion(
      discoveryTask.id,
      emitRunStarted
    );

    const strategySelectionTask = inProcessQueue.enqueue({
      runId: run.id,
      agent: 'strategy-selection',
      displayName: 'Strategy Selection',
      description: buildStrategySelectionDescription(discoveryCompleted.result),
    });

    const strategySelectionCompleted = await waitForTaskCompletion(
      strategySelectionTask.id,
      emitRunStarted
    );

    const generationTask = inProcessQueue.enqueue({
      runId: run.id,
      agent: 'generation',
      displayName: 'Generation',
      description: buildGenerationDescription(
        discoveryCompleted.result,
        strategySelectionCompleted.result
      ),
    });

    const generationCompleted = await waitForTaskCompletion(
      generationTask.id,
      emitRunStarted
    );

    const validationTask = inProcessQueue.enqueue({
      runId: run.id,
      agent: 'validation',
      displayName: 'Validation',
      description: buildValidationDescription(
        generationCompleted.result,
        strategySelectionCompleted.result
      ),
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
      strategySelection: strategySelectionCompleted.result,
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
