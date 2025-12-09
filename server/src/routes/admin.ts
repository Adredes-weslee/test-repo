import { Router, Request, Response } from 'express';
import { inProcessQueue } from '../orchestrator/queue';
import { orchestratorStore } from '../orchestrator/store';

const router = Router();

const respondOk = (res: Response, data: unknown) => {
  res.json({ ok: true, data });
};

router.get('/runs', (_req: Request, res: Response) => {
  const runs = orchestratorStore.listRuns();
  respondOk(res, { runs });
});

router.get('/tasks', (_req: Request, res: Response) => {
  const tasks = orchestratorStore.listAllTasks();
  respondOk(res, { tasks });
});

router.get('/queue', (_req: Request, res: Response) => {
  const queue = inProcessQueue.getQueueState();
  respondOk(res, { queue });
});

router.get('/evaluations', (_req: Request, res: Response) => {
  const evaluations = orchestratorStore.listRunEvaluations();
  respondOk(res, { evaluations });
});

export const adminRouter = router;
