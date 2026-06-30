export interface StreamCallbacks {
  onReasoning: (token: string) => void
  onToken: (token: string) => void
  onDone: (sessionId: string) => void
  onError: (message: string) => void
}

export interface ChatPayload {
  sessionId: string | null
  message: string
  code?: string
  errorTrace?: string
  language?: string
}

export async function streamChat(payload: ChatPayload, callbacks: StreamCallbacks): Promise<void> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok || !response.body) {
    callbacks.onError(`Błąd serwera: ${response.status} ${response.statusText}`)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    let currentEvent = ''
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim()
      } else if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim()
        try {
          const data = JSON.parse(dataStr) as Record<string, string>
          if (currentEvent === 'reasoning' && data.token) {
            callbacks.onReasoning(data.token)
          } else if (currentEvent === 'token' && data.token) {
            callbacks.onToken(data.token)
          } else if (currentEvent === 'done') {
            callbacks.onDone(data.sessionId ?? '')
          } else if (currentEvent === 'error') {
            callbacks.onError(data.message ?? 'Nieznany błąd')
          }
        } catch {
          // ignore parse errors for malformed chunks
        }
        currentEvent = ''
      }
    }
  }
}
