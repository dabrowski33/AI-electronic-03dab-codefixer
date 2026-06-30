import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const message = err instanceof Error ? err.message : 'Internal server error';
  console.error('[Gateway] Error:', err);
  res.status(500).json({ error: message });
}
