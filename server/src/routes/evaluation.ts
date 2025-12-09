import { Router, Request, Response, NextFunction } from 'express';
import { evaluateArtifact } from '../evaluation/evaluate';
import { orchestratorStore } from '../orchestrator/store';

const router = Router();

const respondOk = (res: Response, data: unknown, status = 200) => {
  res.status(status).json({ ok: true, data });
};

const respondError = (res: Response, message: string, status = 400) => {
  res.status(status).json({ ok: false, error: { message } });
};

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    if (!body || typeof body.type !== 'string' || !body.artifact) {
      return respondError(res, 'Invalid evaluation input', 400);
    }

    if (!['course', 'lesson', 'capstone'].includes(body.type)) {
      return respondError(res, 'Unsupported artifact type', 400);
    }

    const evaluation = evaluateArtifact({
      type: body.type,
      artifact: body.artifact,
      intent: body.intent,
    });

    if (typeof body.runId === 'string' && body.runId) {
      orchestratorStore.setRunEvaluation(body.runId, evaluation);
    }

    respondOk(res, { evaluation });
  } catch (error) {
    next(error);
  }
});

export const evaluationRouter = router;
