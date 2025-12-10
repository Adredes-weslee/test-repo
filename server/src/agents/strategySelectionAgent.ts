import strategySelectionFixture from '../simulations/data/strategySelection.json';
import { AgentTask, StrategyBundle, StrategySelectionResult } from '../orchestrator/types';
import { orchestratorStore } from '../orchestrator/store';
import { buildPrompt, isSimulationMode, loadGeminiModel, parseModelText } from './utils';

const goal =
  'Select the best learning design strategy bundles from the taxonomy based on the discovery output. Respond with JSON containing strategyBundles (array), rationales (array), confidence.';

const allowedBundles: StrategyBundle[] = [
  'Authentic Alignment',
  'Guided Participation',
  'Learner Agency & Reflection',
  'Collaborative Practice',
  'Multimedia & Accessibility',
];

const shouldSimulate = (task: AgentTask): boolean => {
  const run = orchestratorStore.getRun(task.runId);
  const runSim = (run?.input as any)?.simulation === true;
  return runSim || isSimulationMode();
};

const runSimulation = (_task: AgentTask): StrategySelectionResult => ({
  ...(strategySelectionFixture as StrategySelectionResult),
  source: 'simulation',
});

const normalizeResult = (data: unknown): StrategySelectionResult => {
  const fallback = runSimulation({} as AgentTask);
  if (typeof data !== 'object' || data === null) return fallback;

  const typed = data as Partial<StrategySelectionResult>;
  const bundles = Array.isArray(typed.strategyBundles)
    ? typed.strategyBundles
        .map((entry) => {
          if (typeof entry !== 'string') return null;
          const trimmed = entry.trim();
          return allowedBundles.find((bundle) => bundle === trimmed) ?? null;
        })
        .filter((bundle): bundle is StrategyBundle => Boolean(bundle))
    : fallback.strategyBundles;

  const rationales = Array.isArray(typed.rationales)
    ? typed.rationales.map((entry) => String(entry))
    : fallback.rationales;

  const confidence =
    typeof typed.confidence === 'number' ? typed.confidence : fallback.confidence;

  return {
    strategyBundles: bundles.length ? bundles : fallback.strategyBundles,
    rationales: rationales.length ? rationales : fallback.rationales,
    confidence,
    source: typed.source ?? fallback.source,
    rawOutput: typed.rawOutput ?? data,
  };
};

const runLive = async (task: AgentTask): Promise<StrategySelectionResult> => {
  const model = await loadGeminiModel();
  if (!model) return runSimulation(task);

  const prompt = [
    buildPrompt(task, goal),
    'Use ANDRAGOGY_GUIDELINES.md as the primary reference. Return JSON only.',
    `Allowed bundles: ${allowedBundles.join(', ')}.`,
  ].join('\n');

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const parsed = parseModelText(result.response.text());
    const base = parsed && typeof parsed === 'object' ? { ...(parsed as object) } : { rawOutput: parsed };
    return normalizeResult({ ...base, source: 'gemini' });
  } catch (_error) {
    return runSimulation(task);
  }
};

export const strategySelectionAgent = async (
  task: AgentTask
): Promise<StrategySelectionResult> => {
  if (shouldSimulate(task)) {
    return runSimulation(task);
  }

  return runLive(task);
};
