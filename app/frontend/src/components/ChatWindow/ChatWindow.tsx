import { useEffect, useRef } from 'react'
import './ChatWindow.css'
import { MessageBubble } from '../MessageBubble/MessageBubble'
import type { ChatMessage } from '../../types'

interface ChatWindowProps {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
}

export function ChatWindow({ messages, isStreaming, error }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return (
      <div className="chat-window chat-window--empty">
        <div className="empty-state">
          <div className="empty-icon">⚡</div>
          <h2 className="empty-title">CodeFixer AI</h2>
          <p className="empty-desc">
            Wklej kod i błąd poniżej, aby zacząć debugowanie z pomocą AI.
          </p>
          <div className="empty-features">
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Analiza Stack Trace</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙</span>
              <span>Transparentny Reasoning</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Gotowa Poprawka Kodu</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isCurrentlyStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
