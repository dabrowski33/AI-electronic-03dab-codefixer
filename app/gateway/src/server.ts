import 'dotenv/config';
import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import chatRouter from './routes/chat.js';
import healthRouter from './routes/health.js';
import sessionsRouter from './routes/sessions.js';
import { config } from './config.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '2mb' }));
app.use(logger);

app.use('/api/chat', chatRouter);
app.use('/api/health', healthRouter);
app.use('/api/sessions', sessionsRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[Gateway] Running on http://localhost:${config.port}`);
  console.log(`[Gateway] Proxying to Agent: ${config.agentUrl}`);
  console.log(`[Gateway] Allowing Frontend: ${config.frontendUrl}`);
});
