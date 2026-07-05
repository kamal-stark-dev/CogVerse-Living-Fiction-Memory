import { useEffect, useState } from "react";
import { fetchUniverses, fetchCharacters } from "../api";
import { getTheme } from "../utils/themes";
import Avatar from "./Avatar";
import Logo from "./Logo";

export default function Sidebar({
  selectedUniverse,
  selectedCharacter,
  onSelectCharacter,
}) {
  const [universes, setUniverses] = useState([]);
  const [charactersByUniverse, setCharactersByUniverse] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUniverses()
      .then(setUniverses)
      .catch((e) => setError(e.message));
  }, []);

  const toggleUniverse = async (universe) => {
    const next = expanded === universe ? null : universe;
    setExpanded(next);
    if (next && !charactersByUniverse[universe]) {
      try {
        const chars = await fetchCharacters(universe);
        setCharactersByUniverse((prev) => ({ ...prev, [universe]: chars }));
      } catch (e) {
        setError(e.message);
      }
    }
  };

  return (
    <aside className="archive">
      <div className="archive-header">
        <span className="archive-eyebrow">The Archive</span>
        <Logo universe={selectedUniverse} fallbackText="CogRealm" />
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
                      <Avatar universe={universe} character={char} size={22} />
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
    </aside>
  );
}
