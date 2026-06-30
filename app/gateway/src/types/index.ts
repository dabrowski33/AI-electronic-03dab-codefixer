export interface ChatRequest {
  sessionId: string | null;
  message: string;
  code?: string | null;
  errorTrace?: string | null;
  language?: string;
}

export interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: SessionMessage[];
}

export interface SessionMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
