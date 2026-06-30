import { useState } from 'react'
import './ReasoningPanel.css'

interface ReasoningPanelProps {
  tokens: string
  isStreaming?: boolean
}

export function ReasoningPanel({ tokens, isStreaming = false }: ReasoningPanelProps) {
  const [expanded, setExpanded] = useState(false)

  if (!tokens && !isStreaming) return null

  return (
    <div className="reasoning-panel">
      <button
        className="reasoning-toggle"
        onClick={() => setExpanded(e => !e)}
        type="button"
      >
        <span className="reasoning-icon">⚙</span>
        <span className="reasoning-label">Proces Myślowy Agenta</span>
        {isStreaming && <span className="reasoning-indicator">rozumowanie<span className="dots">...</span></span>}
        <span className={`reasoning-chevron ${expanded ? 'expanded' : ''}`}>▾</span>
      </button>
      {expanded && (
        <div className="reasoning-body">
          <pre className="reasoning-text">{tokens}</pre>
        </div>
      )}
    </div>
  )
}
