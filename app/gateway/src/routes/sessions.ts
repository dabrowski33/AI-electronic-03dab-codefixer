import { Router } from 'express';
import { sessionStore } from '../services/sessionStore.js';

const router = Router();

router.get('/:sessionId', (req, res) => {
  const session = sessionStore.get(req.params.sessionId);
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json(session);
});

router.get('/', (_req, res) => {
  res.json(sessionStore.list());
});

export default router;
