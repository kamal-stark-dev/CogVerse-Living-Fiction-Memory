import { useState, useEffect } from "react";
import { fetchLoreLedger } from "../api";
import { getTheme } from "../utils/themes";
import { 
  Database, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  ExternalLink, 
  X, 
  RotateCw,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LoreLedger({ universe, onReferenceFact, onClose }) {
  const [lore, setLore] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!universe) return;
    setLoading(true);
    setError(null);
    setSelectedItem(null);
    fetchLoreLedger(universe)
      .then((data) => {
        setLore(data);
        // Expand the first category by default
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setExpandedCategories({ [keys[0]]: true });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [universe]);

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  if (!universe) {
    return (
      <aside className="lore-ledger empty">
        <Database size={32} className="text-dim opacity-40 mb-3" />
        <p className="empty-text">Select a character to unlock their universe ledger</p>
      </aside>
    );
  }

  const theme = getTheme(universe);

  // Filter items by search
  const filteredLore = {};
  let totalItems = 0;
  Object.keys(lore).forEach((cat) => {
    const items = lore[cat].filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );
    if (items.length > 0) {
      filteredLore[cat] = items;
      totalItems += items.length;
    }
  });

  return (
    <aside className="lore-ledger" style={{ "--u-accent": theme.accent }}>
      <div className="lore-ledger-header">
        <div className="title-row">
          <BookOpen size={16} className="text-accent" />
          <h3>Lore Ledger</h3>
          {onClose && (
            <button className="close-btn" onClick={onClose} title="Close Panel">
              <X size={16} />
            </button>
          )}
        </div>
        <span className="subtitle">{universe.replace(/_/g, " ")} memory graph</span>
      </div>

      <div className="search-bar">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search universe memories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch("")}>
            <X size={12} />
          </button>
        )}
      </div>

      <div className="lore-ledger-content">
        {loading && (
          <div className="lore-loading">
            <RotateCw size={18} className="animate-spin text-accent" />
            <span>Scanning memory clusters...</span>
          </div>
        )}

        {error && <p className="lore-error">Memory trace failed: {error}</p>}

        {!loading && !error && Object.keys(filteredLore).length === 0 && (
          <div className="lore-empty-search">
            <Search size={24} className="opacity-30 mb-2" />
            <span>No memory clusters matched your search</span>
          </div>
        )}

        {!loading &&
          !error &&
          Object.keys(filteredLore).map((category) => {
            const isExpanded = !!expandedCategories[category];
            const items = filteredLore[category];

            return (
              <div key={category} className="lore-category-block">
                <button
                  className={`lore-category-header ${isExpanded ? "open" : ""}`}
                  onClick={() => toggleCategory(category)}
                >
                  <div className="header-left">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="category-name">{category}</span>
                  </div>
                  <span className="count-badge">{items.length}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="lore-items-container"
                    >
                      {items.map((item) => (
                        <button
                          key={item.name}
                          className="lore-item-row"
                          onClick={() => setSelectedItem(item)}
                        >
                          <Sparkles size={11} className="item-sparkle" />
                          <span className="item-name">{item.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
      </div>

      {/* Embedded Fact Viewer modal inside the ledger */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fact-viewer-overlay"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="fact-viewer-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="category-tag">{universe.replace(/_/g, " ")}</span>
                  <h4>{selectedItem.name}</h4>
                </div>
                <button className="modal-close" onClick={() => setSelectedItem(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="modal-body">
                <pre>{selectedItem.content}</pre>
              </div>
              <div className="modal-footer">
                <button
                  className="action-btn"
                  onClick={() => {
                    onReferenceFact(selectedItem.name);
                    setSelectedItem(null);
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Refer in Gateway</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
