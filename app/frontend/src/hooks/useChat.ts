import { useState, useCallback } from 'react'
import { streamChat } from '../services/api'
import type { ChatState, SendMessagePayload, ChatMessage } from '../types'

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    sessionId: null,
    messages: [],
    isStreaming: false,
    error: null,
  })

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    const userMessageId = generateId()
    const assistantMessageId = generateId()

    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: payload.message || (payload.code ? '[Kod do analizy]' : '[Błąd do analizy]'),
      reasoningTokens: '',
      code: payload.code,
      errorTrace: payload.errorTrace,
      language: payload.language,
      timestamp: new Date(),
    }

    const assistantMsg: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      reasoningTokens: '',
      timestamp: new Date(),
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg, assistantMsg],
      isStreaming: true,
      error: null,
    }))

    try {
      await streamChat(
        {
          sessionId: state.sessionId,
          message: payload.message,
          code: payload.code,
          errorTrace: payload.errorTrace,
          language: payload.language,
        },
        {
          onReasoning: (token) => {
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(m =>
                m.id === assistantMessageId
                  ? { ...m, reasoningTokens: m.reasoningTokens + token }
                  : m
              ),
            }))
          },
          onToken: (token) => {
            setState(prev => ({
              ...prev,
              messages: prev.messages.map(m =>
                m.id === assistantMessageId
                  ? { ...m, content: m.content + token }
                  : m
              ),
            }))
          },
          onDone: (newSessionId) => {
            setState(prev => ({
              ...prev,
              sessionId: newSessionId || prev.sessionId,
              isStreaming: false,
            }))
          },
          onError: (errorMessage) => {
            setState(prev => ({
              ...prev,
              isStreaming: false,
              error: errorMessage,
              messages: prev.messages.filter(m => m.id !== assistantMessageId),
            }))
          },
        }
      )
    } catch (err) {
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: err instanceof Error ? err.message : 'Błąd połączenia z serwerem',
        messages: prev.messages.filter(m => m.id !== assistantMessageId),
      }))
    }
  }, [state.sessionId])

  return { state, sendMessage }
}
