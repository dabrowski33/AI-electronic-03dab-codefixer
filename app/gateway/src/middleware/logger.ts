import type { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[Gateway] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`);
  });
  next();
}
