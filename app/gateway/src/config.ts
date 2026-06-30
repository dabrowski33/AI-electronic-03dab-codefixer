export const config = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  agentUrl: process.env.AGENT_URL ?? 'http://localhost:8000',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
} as const;
