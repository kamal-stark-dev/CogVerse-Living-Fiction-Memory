import express from "express";
import path from "path";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client safely with a fallback message if GEMINI_API_KEY is missing
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is missing. AI chat will fail until configured.");
}

const DATA_DIR = path.resolve(process.cwd(), "data");

// Helper: list all universes (directories under data/)
async function listUniverses(): Promise<string[]> {
  try {
    const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    console.error("Error reading universes:", error);
    return [];
  }
}

// Helper: list all characters under a universe (stems of *.txt files under Characters/)
async function listCharacters(universe: string): Promise<string[]> {
  const charDir = path.join(DATA_DIR, universe, "Characters");
  try {
    const entries = await fs.readdir(charDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
      .map((entry) => entry.name.replace(/\.txt$/, "").replace(/_/g, " "))
      .sort();
  } catch (error) {
    console.error(`Error reading characters for ${universe}:`, error);
    return [];
  }
}

// Helper: search files in a universe for facts matching the user query
async function searchUniverse(universe: string, query: string, characterName?: string): Promise<string> {
  const universeDir = path.join(DATA_DIR, universe);
  const results: string[] = [];

  // 1. If we are searching for a specific character, always read their file first
  if (characterName) {
    const charFileName = characterName.replace(/ /g, "_") + ".txt";
    const charPath = path.join(universeDir, "Characters", charFileName);
    try {
      const charContent = await fs.readFile(charPath, "utf-8");
      results.push(`[Character Memory - ${characterName}]:\n${charContent}`);
    } catch (e) {
      console.warn(`Could not read character file for ${characterName}:`, e);
    }
  }

  // 2. Scan other .txt files in the universe to find matching terms
  const matchedFiles: { filePath: string; score: number }[] = [];
  const queryWords = query.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3); // match terms of meaningful length

  async function scanDir(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".txt")) {
        // Skip the character's own file (already handled)
        if (characterName && entry.name === characterName.replace(/ /g, "_") + ".txt") {
          continue;
        }
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          let score = 0;
          for (const word of queryWords) {
            if (content.toLowerCase().includes(word)) {
              score += 1;
            }
          }
          if (score > 0) {
            matchedFiles.push({ filePath: fullPath, score });
          }
        } catch {}
      }
    }
  }

  await scanDir(universeDir);

  // Sort by score descending and take the top 2 matching files
  matchedFiles.sort((a, b) => b.score - a.score);
  const topMatches = matchedFiles.slice(0, 2);

  for (const match of topMatches) {
    const relativeName = path.relative(universeDir, match.filePath);
    try {
      const content = await fs.readFile(match.filePath, "utf-8");
      results.push(`[World Lore - ${relativeName}]:\n${content}`);
    } catch {}
  }

  // Also include the general universe summary if it exists and hasn't been added yet
  const mainUniverseFile = path.join(universeDir, `${universe}_Universe.txt`);
  if (!topMatches.some((m) => m.filePath === mainUniverseFile)) {
    try {
      const mainContent = await fs.readFile(mainUniverseFile, "utf-8");
      results.push(`[Universe Context - ${universe}]:\n${mainContent}`);
    } catch {}
  }

  return results.join("\n\n");
}

// Build persona system prompt
function buildSystemPrompt(speaker: string, primaryContext: string, referenceContext?: string): string {
  let prompt = `You are ${speaker}. Fully embody their personality, speech patterns, values, and worldview.

Known facts about you, grounded in your world's memory graph:
${primaryContext}

Rules:
- Stay completely in character. Never break the fourth wall or mention being an AI.
- Use the facts naturally, as lived experience, not as a recited list.
- Match your canonical speech style, vocabulary, and tone exactly.
- Keep responses focused and conversational, not encyclopedic.`;

  if (referenceContext) {
    prompt += `

You have just been told about a situation from another world, which you have
no first-hand knowledge of beyond what's shared here:
${referenceContext}

Respond to it the way you genuinely would, filtered entirely through your own
personality, values, and experience.`;
  }

  return prompt;
}

// API Routes
app.get("/api/universes", async (req, res) => {
  const universes = await listUniverses();
  res.json({ universes });
});

app.get("/api/universes/:universe/characters", async (req, res) => {
  const { universe } = req.params;
  const universes = await listUniverses();
  if (!universes.includes(universe)) {
    return res.status(404).json({ error: `Unknown universe: ${universe}` });
  }
  const characters = await listCharacters(universe);
  res.json({ characters });
});

app.get("/api/universes/:universe/lore", async (req, res) => {
  const { universe } = req.params;
  const universes = await listUniverses();
  if (!universes.includes(universe)) {
    return res.status(404).json({ error: `Unknown universe: ${universe}` });
  }

  const universeDir = path.join(DATA_DIR, universe);
  const loreData: { [category: string]: { name: string; content: string }[] } = {};

  async function scan(dir: string, categoryName: string) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith(".txt")) {
          const name = entry.name.replace(/\.txt$/, "").replace(/_/g, " ");
          const content = await fs.readFile(path.join(dir, entry.name), "utf-8");
          if (!loreData[categoryName]) {
            loreData[categoryName] = [];
          }
          loreData[categoryName].push({ name, content });
        } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
          await scan(path.join(dir, entry.name), entry.name.replace(/_/g, " "));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  await scan(universeDir, "Overview");

  const sortedLore: typeof loreData = {};
  Object.keys(loreData)
    .sort()
    .forEach((cat) => {
      sortedLore[cat] = loreData[cat].sort((a, b) => a.name.localeCompare(b.name));
    });

  res.json({ lore: sortedLore });
});

app.get("/api/universes/:universe/characters/:character/starters", async (req, res) => {
  const { universe, character } = req.params;
  try {
    const charFileName = character.replace(/ /g, "_") + ".txt";
    const charPath = path.join(DATA_DIR, universe, "Characters", charFileName);
    const content = await fs.readFile(charPath, "utf-8").catch(() => "");

    if (!ai || !content) {
      return res.json({ starters: ["Tell me about yourself.", "What is your main goal?", "Who are your allies?"] });
    }

    const prompt = `You are a lore advisor for ${character} in the universe of ${universe}.
Based on their memory trace below, generate exactly 3 intriguing, canon-accurate conversation starter questions a fan or inquirer can ask ${character}.
Ensure the questions are short (under 12 words), canonical, and highly engaging.
Return ONLY a valid JSON array of strings, like: ["Question 1", "Question 2", "Question 3"]. No markdown formatting, no backticks.

Memory Trace:
${content}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "[]";
    const starters = JSON.parse(text);
    res.json({ starters: Array.isArray(starters) ? starters.slice(0, 3) : [] });
  } catch (error) {
    console.error("Error generating starters:", error);
    res.json({ starters: ["Tell me about yourself.", "What is your main goal?", "Who are your allies?"] });
  }
});

app.post("/api/chat", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini AI API Key not configured. Please add GEMINI_API_KEY under Settings > Secrets.",
    });
  }

  try {
    const { speaker, speaker_universe, question, reference_universe, reference_query } = req.body;

    if (!speaker || !speaker_universe || !question) {
      return res.status(400).json({ error: "Missing required parameters: speaker, speaker_universe, question" });
    }

    // 1. Search primary universe for grounded facts
    const primaryContext = await searchUniverse(speaker_universe, question, speaker);

    // 2. Search reference universe if provided for cross-universe queries
    let referenceContext = "";
    if (reference_universe && reference_query) {
      referenceContext = await searchUniverse(reference_universe, reference_query);
    }

    // 3. Build the system prompt
    const systemPrompt = buildSystemPrompt(speaker, primaryContext, referenceContext || undefined);

    // 4. Query the modern @google/genai SDK using gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    const answer = response.text || "I am speechless...";

    res.json({
      answer: answer,
      memory_trace: {
        primary: primaryContext,
        reference: referenceContext || null,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred during generation" });
  }
});

// Setup Frontend Vite Middleware / Static serving
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupFrontend().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
});
