import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export { app };
