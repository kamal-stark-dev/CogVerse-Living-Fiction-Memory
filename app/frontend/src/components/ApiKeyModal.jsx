import { useState, useEffect, useRef } from "react";
import { GROQ_KEY_KEY } from "../utils/storageKeys";

export default function ApiKeyModal({ onClose }) {
  const [inputVal, setInputVal] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const inputRef = useRef(null);

  // Load stored key into the input on open
  useEffect(() => {
    const stored = localStorage.getItem(GROQ_KEY_KEY) ?? "";
    setInputVal(stored);
    setHasKey(!!stored);
    // Focus the input after mount
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const handleSave = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    localStorage.setItem(GROQ_KEY_KEY, trimmed);
    setHasKey(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemove = () => {
    localStorage.removeItem(GROQ_KEY_KEY);
    setInputVal("");
    setHasKey(false);
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="key-modal-overlay" onClick={handleBackdrop}>
      <div className="key-modal" role="dialog" aria-modal="true" aria-label="API Key settings">
        {/* Header */}
        <div className="key-modal-header">
          <span className="key-modal-icon">🔑</span>
          <h2 className="key-modal-title">Connect your Groq API Key</h2>
          <button
            type="button"
            className="key-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Description */}
        <p className="key-modal-desc">
          Use your own key for unlimited chat without hitting any server-side
          rate limits. It's stored only in your browser and sent directly to
          the backend — never logged.
        </p>

        {/* Input row */}
        <div className="key-modal-input-row">
          <input
            ref={inputRef}
            id="groq-api-key-input"
            type={revealed ? "text" : "password"}
            className="key-modal-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="gsk_••••••••••••••••••••••••••••••••••••••••••••••••"
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <button
            type="button"
            className="key-modal-reveal"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide key" : "Reveal key"}
            title={revealed ? "Hide" : "Show"}
          >
            {revealed ? "🙈" : "👁"}
          </button>
        </div>

        {/* Action buttons */}
        <div className="key-modal-actions">
          <button
            type="button"
            className="key-modal-save"
            onClick={handleSave}
            disabled={!inputVal.trim()}
          >
            {saved ? "✅ Saved!" : "Save key"}
          </button>
          {hasKey && (
            <button
              type="button"
              className="key-modal-remove"
              onClick={handleRemove}
            >
              Remove key
            </button>
          )}
        </div>

        {/* Status line */}
        <div className="key-modal-status">
          {hasKey ? (
            <span className="key-status-active">
              ✅ Your key is active — chat will use it.
            </span>
          ) : (
            <span className="key-status-fallback">
              ⚠ No key saved — using the server's shared key.
            </span>
          )}
        </div>

        {/* Footer link */}
        <div className="key-modal-footer">
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="key-modal-link"
          >
            Get a free key → console.groq.com
          </a>
        </div>
      </div>
    </div>
  );
}
