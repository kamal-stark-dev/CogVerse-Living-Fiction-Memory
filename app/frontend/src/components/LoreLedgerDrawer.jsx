import { useState, useEffect } from "react";
import { fetchUniverseLedger } from "../api";
import { 
  Search, 
  X, 
  Terminal, 
  BookOpen, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Layers,
  Database,
  ArrowRightLeft
} from "lucide-react";
import { getTheme } from "../utils/themes";

export default function LoreLedgerDrawer({
  isOpen,
  onClose,
  activeUniverse,
  onReferInGateway
}) {
  const [ledger, setLedger] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inspectorItem, setInspectorItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hookedMessage, setHookedMessage] = useState(false);

  // Fetch ledger data whenever the active universe changes
  useEffect(() => {
    if (activeUniverse) {
      setLoading(true);
      setError(null);
      fetchUniverseLedger(activeUniverse)
        .then((data) => {
          setLedger(data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load ledger database");
          setLoading(false);
        });
    } else {
      setLedger([]);
    }
  }, [activeUniverse]);

  if (!isOpen) return null;

  const currentTheme = activeUniverse ? getTheme(activeUniverse) : null;
  const accentColor = currentTheme ? currentTheme.accent : "#7C5CFC";

  // List of all categories available in the current universe ledger
  const categories = ["All", ...ledger.map((c) => c.category)];

  // Filter items client-side using name and content
  const filteredLedger = ledger.map((cat) => {
    // If selectedCategory is not "All" and doesn't match this category, skip
    if (selectedCategory !== "All" && cat.category !== selectedCategory) {
      return { category: cat.category, items: [] };
    }

    const filteredItems = cat.items.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q)
      );
    });

    return {
      category: cat.category,
      items: filteredItems,
    };
  }).filter((cat) => cat.items.length > 0);

  const handleReferInGateway = (item, category) => {
    const isCharacter = category.toLowerCase().includes("character");
    onReferInGateway(activeUniverse, item.name, isCharacter);
    
    // Show a beautiful temporary visual notification
    setHookedMessage(true);
    setTimeout(() => {
      setHookedMessage(false);
    }, 2500);
  };

  return (
    <div className="lore-ledger-drawer" style={{ "--universe-accent": accentColor }}>
      {/* Drawer Backdrop for smaller screens */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Main Drawer Container */}
      <div className="drawer-container">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-area">
            <BookOpen className="drawer-header-icon" size={20} />
            <div>
              <h3>Lore Ledger</h3>
              <p className="drawer-subtitle">
                {activeUniverse ? `${activeUniverse.replace(/_/g, " ")} Database` : "World Memory Archive"}
              </p>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="drawer-search-box">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search names, descriptions, secrets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="drawer-categories scroll-x">
          {categories.map((cat) => {
            const count = cat === "All" 
              ? ledger.reduce((acc, c) => acc + c.items.length, 0)
              : ledger.find(c => c.category === cat)?.items.length || 0;

            return (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body / Items List */}
        <div className="drawer-body">
          {loading ? (
            <div className="drawer-loading">
              <div className="spinner" />
              <p>Scanning timeline archives...</p>
            </div>
          ) : error ? (
            <div className="drawer-error">
              <p className="error-msg">{error}</p>
            </div>
          ) : filteredLedger.length === 0 ? (
            <div className="drawer-empty">
              <Database size={32} className="empty-icon" />
              <p>No memory records match your search criteria.</p>
            </div>
          ) : (
            <div className="ledger-sections">
              {filteredLedger.map((section) => (
                <div key={section.category} className="ledger-section">
                  <h4 className="section-title">
                    <Layers size={14} className="section-icon" />
                    {section.category}
                  </h4>
                  <div className="ledger-items-grid">
                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="ledger-item-card"
                        onClick={() => setInspectorItem({ ...item, category: section.category })}
                      >
                        <div className="item-card-header">
                          <span className="item-name">{item.name}</span>
                          <ChevronRight size={14} className="item-arrow" />
                        </div>
                        <p className="item-preview">
                          {item.content.length > 95
                            ? `${item.content.substring(0, 95)}...`
                            : item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Node Inspector: Cyber Glowing Terminal Modal */}
      {inspectorItem && (
        <div className="inspector-modal-overlay" onClick={() => setInspectorItem(null)}>
          <div className="inspector-terminal" onClick={(e) => e.stopPropagation()}>
            {/* Terminal Top Bar */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="terminal-title">
                <Terminal size={14} className="terminal-title-icon" />
                <span>CANON_LOGS_INSPECTOR v1.07</span>
              </div>
              <button className="terminal-close" onClick={() => setInspectorItem(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="terminal-body">
              <div className="terminal-crt-scanline" />
              
              <div className="terminal-meta-block">
                <div><span className="term-label">OBJECT_ID:</span> <span className="term-value">{inspectorItem.name.toUpperCase().replace(/\s+/g, "_")}</span></div>
                <div><span className="term-label">CATEGORY:</span> <span className="term-value">{inspectorItem.category.toUpperCase()}</span></div>
                <div><span className="term-label">STATUS:</span> <span className="term-value pulse text-green-400">ACTIVE_IN_TIMELINE_MEMORY</span></div>
              </div>

              <div className="terminal-divider" />

              <div className="terminal-content">
                <h2 className="terminal-item-title">{inspectorItem.name}</h2>
                <div className="terminal-text-block">
                  {inspectorItem.content}
                </div>
              </div>

              <div className="terminal-divider" />

              {/* Actions Area */}
              <div className="terminal-actions">
                <button
                  className="terminal-btn action-gateway"
                  onClick={() => handleReferInGateway(inspectorItem, inspectorItem.category)}
                >
                  <ArrowRightLeft size={14} />
                  <span>Refer in Gateway</span>
                </button>
                <button className="terminal-btn action-close" onClick={() => setInspectorItem(null)}>
                  Close Logs
                </button>
              </div>

              {/* Toast message inside terminal for portal hooking */}
              {hookedMessage && (
                <div className="terminal-toast">
                  <Sparkles size={14} className="toast-icon animate-bounce" />
                  <span>SUCCESS: Reference hooked into Cross-Universe Portal gateway!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
