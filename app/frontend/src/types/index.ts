export type Language = 'python' | 'java' | 'javascript' | 'typescript' | 'go' | 'csharp' | 'other';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  reasoningTokens: string;
  code?: string;
  errorTrace?: string;
  language?: Language;
  timestamp: Date;
}

export interface ChatState {
  sessionId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
}

export interface SendMessagePayload {
  message: string;
  code?: string;
  errorTrace?: string;
  language?: Language;
}
