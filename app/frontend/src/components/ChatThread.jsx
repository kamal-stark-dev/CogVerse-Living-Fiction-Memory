import { useState, useRef, useEffect } from 'react'
import MemoryTrace from './MemoryTrace'
import Avatar from './Avatar'

export default function ChatThread({ speaker, speakerUniverse, onSend, messages, loading }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const submit = (e) => {
    e.preventDefault()
    if (!input.trim() || !speaker) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <main className="chat-panel">
      <div className="chat-header">
        {speaker ? (
          <div className="chat-header-inner">
            <Avatar universe={speakerUniverse} character={speaker} size={56} />
            <div className="chat-header-text">
              <span className="chat-eyebrow">Summoning</span>
              <h2>{speaker}</h2>
              <span className="chat-sub">{speakerUniverse?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        ) : (
          <span className="chat-placeholder">Choose a character from The Archive to begin</span>
        )}
      </div>

      <div className="chat-thread">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <div className="bubble-content">{m.content}</div>
            {m.role === 'assistant' && m.trace && (
              <MemoryTrace primary={m.trace.primary} reference={m.trace.reference} />
            )}
          </div>
        ))}
        {loading && <div className="bubble assistant loading"><div className="bubble-content">summoning a response…</div></div>}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-row" onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={speaker ? `Ask ${speaker} something…` : 'Select a character first'}
          disabled={!speaker}
        />
        <button type="submit" disabled={!speaker || loading}>
          Send
        </button>
      </form>
    </main>
  )
}
