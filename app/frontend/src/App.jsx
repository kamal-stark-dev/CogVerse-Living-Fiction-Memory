import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatThread from './components/ChatThread'
import { sendChat } from './api'

export default function App() {
  const [selectedUniverse, setSelectedUniverse] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [crossUniverse, setCrossUniverse] = useState(false)
  const [referenceUniverse, setReferenceUniverse] = useState('')
  const [referenceQuery, setReferenceQuery] = useState('')

  const handleSelectCharacter = (universe, character) => {
    setSelectedUniverse(universe)
    setSelectedCharacter(character)
    setMessages([])
  }

  const handleSend = async (question) => {
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)
    try {
      const payload = {
        speaker: selectedCharacter,
        speaker_universe: selectedUniverse,
        question,
        reference_universe: crossUniverse && referenceUniverse ? referenceUniverse : null,
        reference_query: crossUniverse && referenceQuery ? referenceQuery : null,
      }
      const { answer, memory_trace } = await sendChat(payload)
      setMessages((prev) => [...prev, { role: 'assistant', content: answer, trace: memory_trace }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Something broke: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        selectedUniverse={selectedUniverse}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={handleSelectCharacter}
      />
      <div className="main-column">
        <div className="cross-universe-bar">
          <label>
            <input
              type="checkbox"
              checked={crossUniverse}
              onChange={(e) => setCrossUniverse(e.target.checked)}
            />{' '}
            Cross-universe question
          </label>
          {crossUniverse && (
            <>
              <input
                placeholder="Referenced universe folder name (e.g. Harry_Potter)"
                value={referenceUniverse}
                onChange={(e) => setReferenceUniverse(e.target.value)}
              />
              <input
                placeholder="What happened? (e.g. Sirius Black's death)"
                value={referenceQuery}
                onChange={(e) => setReferenceQuery(e.target.value)}
              />
            </>
          )}
        </div>
        <ChatThread
          speaker={selectedCharacter}
          speakerUniverse={selectedUniverse}
          onSend={handleSend}
          messages={messages}
          loading={loading}
        />
      </div>
    </div>
  )
}
