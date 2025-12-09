export type EvaluationInputType = 'course' | 'lesson' | 'capstone';

export interface EvaluationInput {
  type: EvaluationInputType;
  artifact: unknown;
  intent?: unknown;
}

export interface EvaluationResult {
  intentAlignmentScore: number;
  andragogyScore: number;
  pedagogyScore: number;
  pass: boolean;
  reasons: string[];
}

const clampScore = (score: number) => Math.max(0, Math.min(1, score));

const hasKeys = (value: unknown, keys: string[]): boolean => {
  if (typeof value !== 'object' || value === null) return false;
  return keys.every((key) => key in value);
};

const scorePresence = (value: unknown, signals: string[]): number => {
  if (typeof value !== 'object' || value === null) return 0;

  const text = JSON.stringify(value).toLowerCase();
  const hits = signals.reduce((count, signal) => {
    return text.includes(signal.toLowerCase()) ? count + 1 : count;
  }, 0);

  return clampScore(hits / Math.max(signals.length, 1));
};

const buildReasons = (
  intentAlignmentScore: number,
  andragogyScore: number,
  pedagogyScore: number,
  type: EvaluationInputType
): string[] => {
  const reasons: string[] = [];

  if (intentAlignmentScore < 0.5) {
    reasons.push('Intent alignment is unclear or missing.');
  }

  if (andragogyScore < 0.5) {
    reasons.push('Adult-learning cues like relevance and autonomy are weak.');
  }

  if (pedagogyScore < 0.5) {
    reasons.push('Learning structure or assessment signals are limited.');
  }

  if (reasons.length === 0) {
    reasons.push(`${type} artifact covers intent, activities, and assessment clearly.`);
  }

  return reasons.slice(0, 5);
};

export const evaluateArtifact = (input: EvaluationInput): EvaluationResult => {
  const { artifact, intent, type } = input;

  const requiredKeys: Record<EvaluationInputType, string[]> = {
    course: ['modules', 'outcomes'],
    lesson: ['objectives', 'activities'],
    capstone: ['requirements', 'milestones'],
  };

  const structuralScore = hasKeys(artifact, requiredKeys[type]) ? 0.7 : 0.3;
  const intentScore = clampScore(scorePresence(intent ?? artifact, ['goal', 'intent']));
  const andragogySignals = ['outcomes', 'learner', 'practice', 'reflection'];
  const pedagogySignals = ['assessment', 'rubric', 'steps', 'examples'];

  const andragogyScore = clampScore((structuralScore + scorePresence(artifact, andragogySignals)) / 2);
  const pedagogyScore = clampScore((structuralScore + scorePresence(artifact, pedagogySignals)) / 2);
  const intentAlignmentScore = clampScore((structuralScore + intentScore) / 2);

  const pass = intentAlignmentScore >= 0.4 && andragogyScore >= 0.4 && pedagogyScore >= 0.4;
  const reasons = buildReasons(intentAlignmentScore, andragogyScore, pedagogyScore, type);

  return {
    intentAlignmentScore,
    andragogyScore,
    pedagogyScore,
    pass,
    reasons,
  };
};
