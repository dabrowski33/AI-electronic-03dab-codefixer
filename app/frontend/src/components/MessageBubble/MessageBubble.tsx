import './MessageBubble.css'
import { ReasoningPanel } from '../ReasoningPanel/ReasoningPanel'
import type { ChatMessage } from '../../types'

interface MessageBubbleProps {
  message: ChatMessage
  isCurrentlyStreaming?: boolean
}

export function MessageBubble({ message, isCurrentlyStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  function renderContent(content: string) {
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n')
        const lang = lines[0].trim()
        const code = lines.slice(1).join('\n')
        return (
          <div key={i} className="code-block">
            {lang && <div className="code-lang">{lang}</div>}
            <pre><code>{code}</code></pre>
            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(code)}
              type="button"
            >
              Kopiuj
            </button>
          </div>
        )
      }
      return <span key={i} className="text-content">{part}</span>
    })
  }

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-role">{isUser ? 'Ty' : 'CodeFixer AI'}</div>
      {!isUser && (message.reasoningTokens || isCurrentlyStreaming) && (
        <ReasoningPanel
          tokens={message.reasoningTokens}
          isStreaming={isCurrentlyStreaming && !message.content}
        />
      )}
      <div className="message-content">
        {renderContent(message.content)}
        {isCurrentlyStreaming && <span className="cursor-blink">▎</span>}
      </div>
      <div className="message-time">
        {message.timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}
