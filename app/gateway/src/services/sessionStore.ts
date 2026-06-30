import { randomUUID } from 'crypto';
import type { Session, SessionMessage } from '../types/index.js';

class SessionStore {
  private sessions = new Map<string, Session>();

  getOrCreate(id: string | null): Session {
    if (id && this.sessions.has(id)) {
      return this.sessions.get(id)!;
    }
    const session: Session = {
      id: id ?? randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  addMessage(sessionId: string, message: SessionMessage): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
      session.updatedAt = new Date();
    }
  }

  list(): Session[] {
    return Array.from(this.sessions.values());
  }
}

export const sessionStore = new SessionStore();
