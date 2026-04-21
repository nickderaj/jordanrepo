import cors from 'cors';
import express from 'express';
import { runMigrations } from './db.js';
import { todosRouter } from './todos.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const corsOrigin = process.env.CORS_ORIGIN;
const allowOrigin: cors.CorsOptions['origin'] = corsOrigin
  ? corsOrigin.split(',').map((s) => s.trim())
  : (origin, cb) => {
      if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    };

app.use(cors({ origin: allowOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/todos', todosRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function main() {
  await runMigrations();
  app.listen(port, () => {
    console.log(`backend listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start backend', err);
  process.exit(1);
});
