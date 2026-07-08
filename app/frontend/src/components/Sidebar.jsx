import { useEffect, useState } from "react";
import { fetchUniverses, fetchCharacters } from "../api";
import { getTheme } from "../utils/themes";
import { CONVERSATIONS_KEY, LAST_ACTIVE_KEY, GROQ_KEY_KEY } from "../utils/storageKeys";
import Avatar from "./Avatar";
import Logo from "./Logo";
import ApiKeyModal from "./ApiKeyModal";

export default function Sidebar({
  selectedUniverse,
  selectedCharacter,
  onSelectCharacter,
  onExpandedChange,
}) {
  const [universes, setUniverses] = useState([]);
  const [charactersByUniverse, setCharactersByUniverse] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  // Track whether a key is currently saved so the badge updates live.
  const [hasGroqKey, setHasGroqKey] = useState(
    () => !!localStorage.getItem(GROQ_KEY_KEY),
  );

  // Keep the badge in sync when the modal saves/removes a key.
  useEffect(() => {
    const sync = () => setHasGroqKey(!!localStorage.getItem(GROQ_KEY_KEY));
    window.addEventListener("storage", sync);
    // Also poll on focus so changes made in the same tab (modal) are caught.
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    fetchUniverses()
      .then(setUniverses)
      .catch((e) => setError(e.message));
  }, []);

  // On page load, if a conversation was restored from localStorage, expand
  // that universe's accordion so the active character is visibly selected
  // rather than just working invisibly in the background.
  useEffect(() => {
    if (selectedUniverse && !expanded) {
      setExpanded(selectedUniverse);
      if (!charactersByUniverse[selectedUniverse]) {
        fetchCharacters(selectedUniverse)
          .then((chars) =>
            setCharactersByUniverse((prev) => ({
              ...prev,
              [selectedUniverse]: chars,
            })),
          )
          .catch((e) => setError(e.message));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUniverse]);

  const toggleUniverse = async (universe) => {
    const next = expanded === universe ? null : universe;
    setExpanded(next);
    onExpandedChange?.(next);
    if (next && !charactersByUniverse[universe]) {
      try {
        const chars = await fetchCharacters(universe);
        setCharactersByUniverse((prev) => ({ ...prev, [universe]: chars }));
      } catch (e) {
        setError(e.message);
      }
    }
  };

  // Whichever universe's accordion is open takes priority for the logo;
  // once collapsed, falls back to whatever universe you're actively
  // chatting in, so the branding doesn't revert to plain text mid-conversation.
  const logoUniverse = expanded || selectedUniverse;

  const handleReset = () => {
    if (
      window.confirm(
        "Clear all chat history and start fresh? This can't be undone.",
      )
    ) {
      localStorage.removeItem(CONVERSATIONS_KEY);
      localStorage.removeItem(LAST_ACTIVE_KEY);
      window.location.reload();
    }
  };

  return (
    <aside className="archive">
      <div className="archive-scroll">
        <div className="archive-header">
          <span className="archive-eyebrow">The Archive</span>
          <Logo universe={logoUniverse} fallbackText="CogVerse" />
        </div>

        {error && (
          <p className="empty-note">Couldn't reach the backend: {error}</p>
        )}

        <div className="archive-list">
          {universes.map((universe) => {
            const accent = getTheme(universe).accent;
            const isOpen = expanded === universe;
            return (
              <div key={universe} className="universe-block">
                <button
                  className={`universe-row ${isOpen ? "open" : ""}`}
                  style={{ "--u-accent": accent }}
                  onClick={() => toggleUniverse(universe)}
                >
                  <span className="sigil" />
                  {universe.replace(/_/g, " ")}
                </button>
                {isOpen && (
                  <div className="character-list">
                    {(charactersByUniverse[universe] || []).map((char) => (
                      <button
                        key={char}
                        className={`character-row ${
                          selectedCharacter === char &&
                          selectedUniverse === universe
                            ? "active"
                            : ""
                        }`}
                        style={{ "--u-accent": accent }}
                        onClick={() => onSelectCharacter(universe, char)}
                      >
                        <Avatar
                          universe={universe}
                          character={char}
                          size={22}
                        />
                        {char}
                      </button>
                    ))}
                    {charactersByUniverse[universe]?.length === 0 && (
                      <span className="empty-note">
                        No characters found in this universe's folder
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {!error && universes.length === 0 && (
            <p className="empty-note">
              No universes found. Check that REPO_DATA_DIR on the backend points
              at your data/ folder.
            </p>
          )}
        </div>
      </div>

      <div className="archive-footer">
        <button
          type="button"
          className={`api-key-button ${hasGroqKey ? "key-active" : ""}`}
          onClick={() => {
            setShowKeyModal(true);
            // Re-check key presence every time the modal is opened
            setHasGroqKey(!!localStorage.getItem(GROQ_KEY_KEY));
          }}
        >
          🔑 {hasGroqKey ? "Key connected ✅" : "Add API Key"}
        </button>
        <button type="button" className="reset-button" onClick={handleReset}>
          🔄 Reset demo data
        </button>
      </div>

      {showKeyModal && (
        <ApiKeyModal
          onClose={() => {
            setShowKeyModal(false);
            // Sync badge immediately when modal closes
            setHasGroqKey(!!localStorage.getItem(GROQ_KEY_KEY));
          }}
        />
      )}
    </aside>
  );
}
