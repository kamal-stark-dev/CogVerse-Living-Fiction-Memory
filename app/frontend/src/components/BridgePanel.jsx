import { useEffect, useState } from "react";
import { fetchUniverses, fetchCharacters } from "../api";
import { getTheme } from "../utils/themes";

function suggestedTopics(character) {
  const who = character || "they";
  return [
    `${who}'s biggest loss`,
    `${who}'s greatest victory`,
    `A moment ${who} doubted themself`,
    `How ${who} changed over time`,
  ];
}

export default function BridgePanel({
  enabled,
  onToggle,
  excludeUniverse,
  referenceUniverse,
  referenceCharacter,
  referenceQuery,
  onReferenceUniverseChange,
  onReferenceCharacterChange,
  onReferenceQueryChange,
}) {
  const [universes, setUniverses] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUniverses()
      .then(setUniverses)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (referenceUniverse) {
      fetchCharacters(referenceUniverse)
        .then(setCharacters)
        .catch(() => setCharacters([]));
    } else {
      setCharacters([]);
    }
  }, [referenceUniverse]);

  const refAccent = referenceUniverse
    ? getTheme(referenceUniverse).accent
    : null;

  return (
    <div className="bridge-wrap">
      {enabled && (
        <div
          className="bridge-panel"
          style={refAccent ? { "--ref-accent": refAccent } : {}}
        >
          <div className="bridge-panel-header">
            <span>🌉</span> Bring in context from another universe
          </div>

          <div className="bridge-panel-row">
            <select
              value={referenceUniverse}
              onChange={(e) => {
                onReferenceUniverseChange(e.target.value);
                onReferenceCharacterChange("");
              }}
            >
              <option value="">Choose a universe…</option>
              {universes
                .filter((u) => u !== excludeUniverse)
                .map((u) => (
                  <option key={u} value={u}>
                    {u.replace(/_/g, " ")}
                  </option>
                ))}
            </select>

            <select
              value={referenceCharacter}
              onChange={(e) => onReferenceCharacterChange(e.target.value)}
              disabled={!referenceUniverse}
            >
              <option value="">Any character…</option>
              {characters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <input
            className="bridge-query-input"
            placeholder="What should they know about? e.g. Sirius Black's death"
            value={referenceQuery}
            onChange={(e) => onReferenceQueryChange(e.target.value)}
            disabled={!referenceUniverse}
          />

          {referenceUniverse && (
            <div className="bridge-chips">
              {suggestedTopics(referenceCharacter).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="bridge-chip"
                  onClick={() => onReferenceQueryChange(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={`bridge-toggle ${enabled ? "active" : ""}`}
        onClick={() => onToggle(!enabled)}
      >
        🌉 {enabled ? "Bridging another realm" : "Bridge another realm"}
        {enabled && referenceUniverse && (
          <span className="bridge-summary">
            {" "}
            · pulling from {referenceUniverse.replace(/_/g, " ")}
          </span>
        )}
      </button>
    </div>
  );
}
