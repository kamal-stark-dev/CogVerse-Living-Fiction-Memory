import { useEffect } from "react";
import { Orbit, Compass, RefreshCw, X, HelpCircle, ArrowRightLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CrossUniverseGateway({
  crossUniverse,
  setCrossUniverse,
  referenceUniverse,
  setReferenceUniverse,
  referenceQuery,
  setReferenceQuery,
  allUniverses,
  activeUniverse,
  speakerName,
}) {
  // If the user turns on the gateway and referenceUniverse is empty,
  // default to another universe (different from activeUniverse)
  useEffect(() => {
    if (crossUniverse && !referenceUniverse && allUniverses.length > 0) {
      const fallback = allUniverses.find((u) => u !== activeUniverse) || allUniverses[0];
      setReferenceUniverse(fallback);
    }
  }, [crossUniverse, referenceUniverse, allUniverses, activeUniverse, setReferenceUniverse]);

  const readableName = (folderName) => {
    if (!folderName) return "";
    return folderName.replace(/_/g, " ");
  };

  return (
    <div className="cross-universe-panel">
      <div className="gateway-toggle-row">
        <button
          className={`gateway-btn ${crossUniverse ? "active" : ""}`}
          onClick={() => setCrossUniverse(!crossUniverse)}
          type="button"
        >
          <div className="btn-label">
            <Orbit className={`orbit-icon ${crossUniverse ? "spinning" : ""}`} size={16} />
            <span>Cross-Universe Gateway</span>
          </div>
          <span className="gateway-status">
            {crossUniverse ? "ON / PORTAL OPEN" : "OFF"}
          </span>
        </button>

        <p className="gateway-hint hide-mobile">
          {crossUniverse ? (
            <>
              Letting <strong>{speakerName || "character"}</strong> access lore records from an external realm.
            </>
          ) : (
            "Graft foreign lore memories into character cognition for cross-over chats."
          )}
        </p>
      </div>

      <AnimatePresence initial={false}>
        {crossUniverse && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="gateway-controls"
          >
            <div className="controls-grid">
              <div className="control-group">
                <label>
                  <Compass size={12} className="text-accent" />
                  <span>Target Universe</span>
                </label>
                <div className="select-wrapper">
                  <select
                    value={referenceUniverse}
                    onChange={(e) => setReferenceUniverse(e.target.value)}
                    className="custom-select"
                  >
                    {allUniverses.map((uni) => (
                      <option key={uni} value={uni}>
                        {readableName(uni)} {uni === activeUniverse ? "(Self)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="control-group flex-grow">
                <label>
                  <ArrowRightLeft size={12} className="text-accent" />
                  <span>Referenced Subject / Event</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g., Sirius Black's death, Jesse Pinkman's escape..."
                    value={referenceQuery}
                    onChange={(e) => setReferenceQuery(e.target.value)}
                    className="custom-input"
                  />
                  {referenceQuery && (
                    <button
                      className="clear-input-btn"
                      onClick={() => setReferenceQuery("")}
                      type="button"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Helper Panel */}
            <div className="gateway-status-bar">
              <HelpCircle size={12} />
              <span>
                Tip: Browse the <strong>Lore Ledger</strong> sidebar and click <strong>Refer in Gateway</strong> to populate these instantly!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
