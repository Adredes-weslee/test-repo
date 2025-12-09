import { Router, Request, Response, NextFunction } from 'express';
import { startRunAsync } from '../orchestrator/orchestrator';
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

    if (body?.simulation === true) {
      process.env.SIMULATION_MODE = 'true';
    }

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

export const orchestrationsRouter = router;
