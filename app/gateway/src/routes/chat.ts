import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { proxyToAgent } from '../services/agentProxy.js';
import { sessionStore } from '../services/sessionStore.js';
import type { ChatRequest } from '../types/index.js';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as ChatRequest;

    if (!body.message?.trim() && !body.code?.trim() && !body.errorTrace?.trim()) {
      res.status(400).json({ error: 'message, code lub errorTrace jest wymagane' });
      return;
    }

    const session = sessionStore.getOrCreate(body.sessionId);
    body.sessionId = session.id;

    sessionStore.addMessage(session.id, {
      role: 'user',
      content: body.message ?? '',
      timestamp: new Date(),
    });

    await proxyToAgent(body, res);
  } catch (err) {
    next(err);
  }
});

export default router;
