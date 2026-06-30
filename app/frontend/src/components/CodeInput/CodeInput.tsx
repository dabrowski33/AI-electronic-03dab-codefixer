import { useState } from 'react'
import './CodeInput.css'
import type { Language, SendMessagePayload } from '../../types'

interface CodeInputProps {
  onSend: (payload: SendMessagePayload) => void
  disabled?: boolean
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'csharp', label: 'C#' },
  { value: 'other', label: 'Inny' },
]

export function CodeInput({ onSend, disabled = false }: CodeInputProps) {
  const [message, setMessage] = useState('')
  const [code, setCode] = useState('')
  const [errorTrace, setErrorTrace] = useState('')
  const [language, setLanguage] = useState<Language>('python')
  const [showAdvanced, setShowAdvanced] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim() && !code.trim() && !errorTrace.trim()) return
    if (disabled) return

    onSend({
      message: message.trim(),
      code: code.trim() || undefined,
      errorTrace: errorTrace.trim() || undefined,
      language,
    })

    setMessage('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form className="code-input" onSubmit={handleSubmit}>
      <div className="code-input-header">
        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced(v => !v)}
        >
          {showAdvanced ? '▾ Ukryj kod i błąd' : '▸ Dodaj kod i Stack Trace'}
        </button>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as Language)}
          className="lang-select"
          disabled={disabled}
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {showAdvanced && (
        <div className="advanced-fields">
          <div className="field-group">
            <label className="field-label">Kod źródłowy</label>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Wklej kod tutaj..."
              className="code-textarea"
              rows={6}
              disabled={disabled}
            />
          </div>
          <div className="field-group">
            <label className="field-label">Stack Trace / komunikat błędu</label>
            <textarea
              value={errorTrace}
              onChange={e => setErrorTrace(e.target.value)}
              placeholder="Wklej komunikat błędu lub Stack Trace..."
              className="code-textarea error-textarea"
              rows={4}
              disabled={disabled}
            />
          </div>
        </div>
      )}

      <div className="message-row">
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Opisz problem lub zadaj pytanie... (Enter aby wysłać, Shift+Enter nowa linia)"
          className="message-textarea"
          rows={2}
          disabled={disabled}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={disabled || (!message.trim() && !code.trim() && !errorTrace.trim())}
        >
          {disabled ? (
            <span className="loading-dots">•••</span>
          ) : (
            'Analizuj'
          )}
        </button>
      </div>
    </form>
  )
}
