import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { adminRouter } from './routes/admin';
import { evaluationRouter } from './routes/evaluation';
import { orchestrationsRouter } from './routes/orchestrations';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const simulationMode = process.env.SIMULATION_MODE === 'true';

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());

if (!simulationMode && !process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set.');
}

app.get('/health', (_req: unknown, res: { json: (body: unknown) => void }) => {
  res.json({
    status: 'ok',
    simulationMode,
  });
});

app.use('/orchestrations', orchestrationsRouter);
app.use('/admin', adminRouter);
app.use('/evaluate', evaluationRouter);

app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ ok: false, error: { message } });
  }
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export { app };
