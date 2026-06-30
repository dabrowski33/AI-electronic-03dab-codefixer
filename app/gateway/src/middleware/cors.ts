import cors from 'cors';
import { config } from '../config.js';

export const corsMiddleware = cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:4200'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'OPTIONS'],
});
