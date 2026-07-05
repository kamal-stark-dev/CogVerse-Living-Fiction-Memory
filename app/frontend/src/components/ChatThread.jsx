import { useState, useRef, useEffect } from "react";
import MemoryTrace from "./MemoryTrace";
import Avatar from "./Avatar";
import BridgePanel from "./BridgePanel";
import RelationshipGraph from "./RelationshipGraph";
import { suggestedQuestions } from "../utils/suggestions";

export default function ChatThread({
  speaker,
  speakerUniverse,
  onSend,
  messages,
  loading,
  crossUniverse,
  onToggleCrossUniverse,
  referenceUniverse,
  referenceCharacter,
  referenceQuery,
  onReferenceUniverseChange,
  onReferenceCharacterChange,
  onReferenceQueryChange,
}) {
  const [input, setInput] = useState("");
  const [showGraph, setShowGraph] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    setShowGraph(false);
  }, [speaker, speakerUniverse]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim() || !speaker) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <main className="chat-panel">
      <div className="chat-header">
        {speaker ? (
          <div className="chat-header-inner">
            <Avatar universe={speakerUniverse} character={speaker} size={56} />
            <div className="chat-header-text">
              <span className="chat-eyebrow">Summoning</span>
              <h2>{speaker}</h2>
              <span className="chat-sub">
                {speakerUniverse?.replace(/_/g, " ")}
              </span>
            </div>
            <button
              type="button"
              className="graph-toggle"
              onClick={() => setShowGraph((v) => !v)}
            >
              🕸 {showGraph ? "Hide" : "View"} memory graph
            </button>
          </div>
        ) : (
          <span className="chat-placeholder">
            Choose a character from The Archive to begin
          </span>
        )}
      </div>

      {showGraph && speaker && (
        <RelationshipGraph universe={speakerUniverse} character={speaker} />
      )}

      <div className="chat-thread">
        {speaker && messages.length === 0 && !loading && (
          <div className="empty-state">
            <Avatar universe={speakerUniverse} character={speaker} size={64} />
            <p className="empty-state-title">Ask {speaker} anything, or try:</p>
            <div className="empty-state-chips">
              {suggestedQuestions(speaker).map((q) => (
                <button
                  key={q}
                  type="button"
                  className="empty-state-chip"
                  onClick={() => onSend(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <div className="bubble-content">{m.content}</div>
            {m.role === "assistant" && m.trace && (
              <MemoryTrace
                primary={m.trace.primary}
                reference={m.trace.reference}
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="bubble assistant loading">
            <div className="bubble-content">summoning a response…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <BridgePanel
        enabled={crossUniverse}
        onToggle={onToggleCrossUniverse}
        excludeUniverse={speakerUniverse}
        referenceUniverse={referenceUniverse}
        referenceCharacter={referenceCharacter}
        referenceQuery={referenceQuery}
        onReferenceUniverseChange={onReferenceUniverseChange}
        onReferenceCharacterChange={onReferenceCharacterChange}
        onReferenceQueryChange={onReferenceQueryChange}
      />

      <form className="chat-input-row" onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            speaker ? `Ask ${speaker} something…` : "Select a character first"
          }
          disabled={!speaker}
        />
        <button type="submit" disabled={!speaker || loading}>
          Send
        </button>
      </form>
    </main>
  );
}
