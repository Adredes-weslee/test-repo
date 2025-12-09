import { Router, Request, Response, NextFunction } from 'express';
import { startRunAsync } from '../orchestrator/orchestrator';
import { orchestratorStore } from '../orchestrator/store';
import { FeedbackDecision } from '../orchestrator/types';

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


    const { runId } = startRunAsync(body);
    respondOk(res, { runId }, 201);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req: Request, res: Response) => {
  const run = orchestratorStore.getRun(req.params.id);
  if (!run) {
    return respondError(res, 'Run not found', 404);
  }

  respondOk(res, { run });
});

router.get('/:id/tasks', (req: Request, res: Response) => {
  const run = orchestratorStore.getRun(req.params.id);
  if (!run) {
    return respondError(res, 'Run not found', 404);
  }

  const tasks = orchestratorStore.listTasksByRun(req.params.id);
  respondOk(res, { tasks });
});

router.get('/:id/logs', (req: Request, res: Response) => {
  const run = orchestratorStore.getRun(req.params.id);
  if (!run) {
    return respondError(res, 'Run not found', 404);
  }

  const events = orchestratorStore.listEventsByRun(req.params.id);
  respondOk(res, { events });
});

router.get('/:id/logs/compact', (req: Request, res: Response) => {
  const run = orchestratorStore.getRun(req.params.id);
  if (!run) {
    return respondError(res, 'Run not found', 404);
  }

  const events = orchestratorStore.listEventsByRun(req.params.id);
  const logs = events.map((event) =>
    `${event.timestamp.toISOString()} [${event.agent}] ${event.type}: ${event.message}`
  );

  respondOk(res, { logs });
});

router.post('/:id/cancel', (req: Request, res: Response) => {
  const run = orchestratorStore.getRun(req.params.id);
  if (!run) {
    return respondError(res, 'Run not found', 404);
  }

  orchestratorStore.updateRunStatus(req.params.id, 'cancelled');
  orchestratorStore.appendEvent({
    runId: req.params.id,
    agent: 'orchestrator',
    type: 'run_cancelled',
    message: 'Run cancelled by request',
  });

  respondOk(res, { run: orchestratorStore.getRun(req.params.id) });
});

router.post('/:id/feedback', (req: Request, res: Response, next: NextFunction) => {
  try {
    const run = orchestratorStore.getRun(req.params.id);
    if (!run) {
      return respondError(res, 'Run not found', 404);
    }

    const body = req.body || {};
    const decision = body.decision as FeedbackDecision | undefined;
    const validDecisions: FeedbackDecision[] = ['accept', 'edit', 'reject'];

    if (!decision || !validDecisions.includes(decision)) {
      return respondError(res, 'Invalid decision', 400);
    }

    let rating: number | undefined;
    if (body.rating !== undefined) {
      const numericRating = Number(body.rating);
      if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        return respondError(res, 'Rating must be between 1 and 5', 400);
      }
      rating = numericRating;
    }

    const feedback = orchestratorStore.addFeedback({
      runId: run.id,
      artifactType: body.artifactType,
      artifactId: body.artifactId,
      decision,
      rating,
      comment: body.comment,
    });

    respondOk(res, { feedback }, 201);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/feedback', (req: Request, res: Response) => {
  const run = orchestratorStore.getRun(req.params.id);
  if (!run) {
    return respondError(res, 'Run not found', 404);
  }

  const feedback = orchestratorStore.listFeedbackByRun(req.params.id);
  respondOk(res, { feedback });
});

export const orchestrationsRouter = router;
