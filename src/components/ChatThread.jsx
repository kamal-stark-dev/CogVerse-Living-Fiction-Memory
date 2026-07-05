import { useState, useRef, useEffect } from 'react'
import MemoryTrace from './MemoryTrace'
import Avatar from './Avatar'
import { BookOpen, Send, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function ChatThread({ 
  speaker, 
  speakerUniverse, 
  onSend, 
  messages, 
  loading,
  onToggleLedger,
  ledgerOpen
}) {
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
          <div className="chat-header-inner" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar universe={speakerUniverse} character={speaker} size={56} />
              <div className="chat-header-text">
                <span className="chat-eyebrow">Summoning</span>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {speaker}
                </h2>
                <span className="chat-sub">{speakerUniverse?.replace(/_/g, ' ')}</span>
              </div>
            </div>
            
            <button 
              className={`ledger-toggle-btn ${ledgerOpen ? 'active' : ''}`}
              onClick={onToggleLedger}
              title="Toggle Lore Ledger"
              style={{
                background: ledgerOpen ? 'var(--accent)' : 'var(--surface-raised)',
                color: ledgerOpen ? '#0b0e1a' : 'var(--text)',
                border: '1px solid var(--border)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              <BookOpen size={16} />
              <span className="hide-mobile">Ledger</span>
            </button>
          </div>
        ) : (
          <span className="chat-placeholder">Choose a character from The Archive to begin</span>
        )}
      </div>

      <div className="chat-thread">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bubble ${m.role}`}
            >
              <div className="bubble-content">{m.content}</div>
              {m.role === 'assistant' && m.trace && (
                <MemoryTrace primary={m.trace.primary} reference={m.trace.reference} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bubble assistant loading"
          >
            <div className="bubble-content" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="typing-pulse" />
              summoning a response…
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      <form className="chat-input-row" onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={speaker ? `Ask ${speaker} something…` : 'Select a character first'}
          disabled={!speaker}
        />
        <button type="submit" disabled={!speaker || loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Send size={14} />
          <span>Send</span>
        </button>
      </form>
    </main>
  )
}
