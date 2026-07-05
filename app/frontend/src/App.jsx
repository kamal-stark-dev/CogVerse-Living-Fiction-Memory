import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatThread from "./components/ChatThread";
import LoreLedgerDrawer from "./components/LoreLedgerDrawer";
import { sendChat } from "./api";
import { getTheme } from "./utils/themes";
import { CONVERSATIONS_KEY, LAST_ACTIVE_KEY } from "./utils/storageKeys";

const DEFAULT_ACCENT = "#7C5CFC";
const DEFAULT_ACCENT_SOFT = "rgba(124, 92, 252, 0.15)";

function conversationKey(universe, character) {
  return `${universe}::${character}`;
}

function loadConversations() {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadLastActive() {
  try {
    const raw = localStorage.getItem(LAST_ACTIVE_KEY);
    return raw ? JSON.parse(raw) : { universe: null, character: null };
  } catch {
    return { universe: null, character: null };
  }
}

export default function App() {
  const initialActive = loadLastActive();

  // The ACTUAL active conversation identity -- this is what gets sent to
  // /chat and used as the conversation history key. Only ever changes when
  // a character is explicitly picked, never just from browsing the sidebar.
  const [selectedUniverse, setSelectedUniverse] = useState(
    initialActive.universe,
  );
  const [selectedCharacter, setSelectedCharacter] = useState(
    initialActive.character,
  );

  // Which universe's accordion is currently expanded in the sidebar. Purely
  // cosmetic (logo + color theme) -- browsing a universe without picking a
  // character must NEVER change what /chat sends for the active conversation.
  const [expandedUniverse, setExpandedUniverse] = useState(null);

  const [conversations, setConversations] = useState(loadConversations);
  const [loading, setLoading] = useState(false);

  const [crossUniverse, setCrossUniverse] = useState(false);
  const [referenceUniverse, setReferenceUniverse] = useState("");
  const [referenceCharacter, setReferenceCharacter] = useState("");
  const [referenceQuery, setReferenceQuery] = useState("");

  const [ledgerOpen, setLedgerOpen] = useState(false);

  const activeUniverse = selectedUniverse || expandedUniverse;

  const handleReferInGateway = (universe, itemName, isCharacter) => {
    setCrossUniverse(true);
    setReferenceUniverse(universe);
    if (isCharacter) {
      setReferenceCharacter(itemName);
      setReferenceQuery("");
    } else {
      setReferenceCharacter("");
      setReferenceQuery(itemName);
    }
  };

  const activeKey = selectedCharacter
    ? conversationKey(selectedUniverse, selectedCharacter)
    : null;
  const messages = activeKey ? conversations[activeKey] || [] : [];

  // Persist conversations any time they change, so a real page refresh
  // restores history too, not just in-session character switching.
  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(
      LAST_ACTIVE_KEY,
      JSON.stringify({
        universe: selectedUniverse,
        character: selectedCharacter,
      }),
    );
  }, [selectedUniverse, selectedCharacter]);

  // Theme/logo follow whichever universe is expanded in the sidebar; falls
  // back to the active chat's universe once the accordion is collapsed again,
  // so the theme doesn't jarringly reset to default mid-conversation.
  useEffect(() => {
    const themeUniverse = expandedUniverse || selectedUniverse;
    const root = document.documentElement;
    if (themeUniverse) {
      const theme = getTheme(themeUniverse);
      root.style.setProperty("--accent", theme.accent);
      root.style.setProperty("--accent-soft", theme.soft);
    } else {
      root.style.setProperty("--accent", DEFAULT_ACCENT);
      root.style.setProperty("--accent-soft", DEFAULT_ACCENT_SOFT);
    }
  }, [expandedUniverse, selectedUniverse]);

  const handleSelectCharacter = (universe, character) => {
    setSelectedUniverse(universe);
    setSelectedCharacter(character);
    // Deliberately NOT clearing messages -- conversations are keyed per
    // character now, so switching back to someone restores their history.
  };

  const handleSend = async (question) => {
    const key = conversationKey(selectedUniverse, selectedCharacter);

    setConversations((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), { role: "user", content: question }],
    }));
    setLoading(true);

    try {
      const combinedReferenceQuery =
        crossUniverse && referenceUniverse
          ? [referenceCharacter, referenceQuery].filter(Boolean).join(": ")
          : null;

      const payload = {
        speaker: selectedCharacter,
        speaker_universe: selectedUniverse,
        question,
        reference_universe:
          crossUniverse && referenceUniverse ? referenceUniverse : null,
        reference_query: combinedReferenceQuery,
      };
      const { answer, memory_trace } = await sendChat(payload);
      setConversations((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] || []),
          { role: "assistant", content: answer, trace: memory_trace },
        ],
      }));
    } catch (err) {
      setConversations((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] || []),
          { role: "assistant", content: `Something broke: ${err.message}` },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        selectedUniverse={selectedUniverse}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={handleSelectCharacter}
        onExpandedChange={setExpandedUniverse}
      />
      <div className="main-column">
        <ChatThread
          speaker={selectedCharacter}
          speakerUniverse={selectedUniverse}
          onSend={handleSend}
          messages={messages}
          loading={loading}
          crossUniverse={crossUniverse}
          onToggleCrossUniverse={setCrossUniverse}
          referenceUniverse={referenceUniverse}
          referenceCharacter={referenceCharacter}
          referenceQuery={referenceQuery}
          onReferenceUniverseChange={setReferenceUniverse}
          onReferenceCharacterChange={setReferenceCharacter}
          onReferenceQueryChange={setReferenceQuery}
          activeUniverse={activeUniverse}
          onOpenLedger={() => setLedgerOpen(true)}
        />
      </div>
      <LoreLedgerDrawer
        isOpen={ledgerOpen}
        onClose={() => setLedgerOpen(false)}
        activeUniverse={activeUniverse}
        onReferInGateway={handleReferInGateway}
      />
    </div>
  );
}
