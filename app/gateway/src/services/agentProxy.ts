import type { Response } from 'express';
import { config } from '../config.js';
import type { ChatRequest } from '../types/index.js';

export async function proxyToAgent(request: ChatRequest, res: Response): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let agentResponse: globalThis.Response;

  try {
    agentResponse = await fetch(`${config.agentUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Agent unavailable';
    res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
    res.end();
    return;
  }

  if (!agentResponse.ok || !agentResponse.body) {
    res.write(`event: error\ndata: ${JSON.stringify({ message: `Agent error: ${agentResponse.status}` })}\n\n`);
    res.end();
    return;
  }

  const reader = agentResponse.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stream error';
    res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
  } finally {
    res.end();
  }
}
