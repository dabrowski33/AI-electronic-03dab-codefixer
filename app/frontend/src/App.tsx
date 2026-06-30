import { useState, useCallback } from 'react'
import './App.css'
import { Header } from './components/Header/Header'
import { ChatWindow } from './components/ChatWindow/ChatWindow'
import { CodeInput } from './components/CodeInput/CodeInput'
import { useChat } from './hooks/useChat'
import type { SendMessagePayload } from './types'

function App() {
  const { state, sendMessage } = useChat()
  const [inputKey, setInputKey] = useState(0)

  const handleSend = useCallback(async (payload: SendMessagePayload) => {
    await sendMessage(payload)
    setInputKey(k => k + 1)
  }, [sendMessage])

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <div className="chat-layout">
          <div className="chat-area">
            <ChatWindow
              messages={state.messages}
              isStreaming={state.isStreaming}
              error={state.error}
            />
            <div className="input-area">
              <CodeInput
                key={inputKey}
                onSend={handleSend}
                disabled={state.isStreaming}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
