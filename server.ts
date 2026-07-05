import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.resolve(process.cwd(), "data");

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Helpers
function listUniverses() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter(name => {
      const fullPath = path.join(DATA_DIR, name);
      return fs.statSync(fullPath).isDirectory() && !name.startsWith(".");
    })
    .sort();
}

function listCharacters(universe: string) {
  const charDir = path.join(DATA_DIR, universe, "Characters");
  if (!fs.existsSync(charDir)) return [];
  return fs.readdirSync(charDir)
    .filter(file => file.endsWith(".txt"))
    .map(file => file.replace(/\.txt$/, "").replace(/_/g, " "))
    .sort();
}

function getCharacterFileContent(universe: string, character: string) {
  const charFilename = character.replace(/ /g, "_") + ".txt";
  const charPath = path.join(DATA_DIR, universe, "Characters", charFilename);
  if (fs.existsSync(charPath)) {
    return fs.readFileSync(charPath, "utf-8");
  }
  
  // Case-insensitive matching fallback
  const charDir = path.join(DATA_DIR, universe, "Characters");
  if (fs.existsSync(charDir)) {
    const files = fs.readdirSync(charDir);
    const matchedFile = files.find(f => f.toLowerCase() === charFilename.toLowerCase());
    if (matchedFile) {
      return fs.readFileSync(path.join(charDir, matchedFile), "utf-8");
    }
  }
  
  return null;
}

function findReferenceContext(universe: string, query: string) {
  const universeDir = path.join(DATA_DIR, universe);
  if (!fs.existsSync(universeDir)) return null;

  const subdirs = ["Characters", "Events", "Locations", "Objects"];
  const matches: string[] = [];
  const queryLower = query.toLowerCase();
  const normalizedQueryFile = query.replace(/ /g, "_").toLowerCase() + ".txt";

  for (const subdir of subdirs) {
    const fullSubdir = path.join(universeDir, subdir);
    if (!fs.existsSync(fullSubdir)) continue;
    const files = fs.readdirSync(fullSubdir).filter(f => f.endsWith(".txt"));
    
    const perfectFile = files.find(f => f.toLowerCase() === normalizedQueryFile);
    if (perfectFile) {
      return fs.readFileSync(path.join(fullSubdir, perfectFile), "utf-8");
    }

    for (const file of files) {
      const fileLower = file.toLowerCase();
      if (fileLower.includes(queryLower)) {
        matches.push(path.join(fullSubdir, file));
      }
    }
  }

  const topFiles = fs.readdirSync(universeDir).filter(f => f.endsWith(".txt"));
  for (const file of topFiles) {
    const fileLower = file.toLowerCase();
    if (fileLower.includes(queryLower)) {
      matches.push(path.join(universeDir, file));
    }
  }

  if (matches.length > 0) {
    return matches.slice(0, 2)
      .map(p => `--- Context from ${path.basename(p, ".txt")} ---\n${fs.readFileSync(p, "utf-8")}`)
      .join("\n\n");
  }

  return null;
}

// 1. GET /api/universes
app.get("/api/universes", (req, res) => {
  try {
    const universes = listUniverses();
    res.json({ universes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/universes/:universe/characters
app.get("/api/universes/:universe/characters", (req, res) => {
  try {
    const { universe } = req.params;
    const universes = listUniverses();
    if (!universes.includes(universe)) {
      res.status(404).json({ error: `Unknown universe: ${universe}` });
      return;
    }
    const characters = listCharacters(universe);
    res.json({ characters });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for full universe ledger
function getUniverseLedger(universe: string) {
  const universeDir = path.join(DATA_DIR, universe);
  if (!fs.existsSync(universeDir)) return [];

  const ledger: { category: string; items: { name: string; filename: string; content: string }[] }[] = [];

  // Read subdirectories
  const itemsInDir = fs.readdirSync(universeDir);
  const subdirs = itemsInDir.filter(name => {
    const fullPath = path.join(universeDir, name);
    return fs.statSync(fullPath).isDirectory() && !name.startsWith(".");
  });

  for (const subdir of subdirs) {
    const subdirPath = path.join(universeDir, subdir);
    const files = fs.readdirSync(subdirPath).filter(f => f.endsWith(".txt"));
    const items = files.map(file => {
      const name = file.replace(/\.txt$/, "").replace(/_/g, " ");
      const content = fs.readFileSync(path.join(subdirPath, file), "utf-8");
      return { name, filename: file, content };
    });

    if (items.length > 0) {
      const categoryName = subdir.replace(/_/g, " ");
      ledger.push({
        category: categoryName,
        items
      });
    }
  }

  // Also read top-level files
  const topFiles = itemsInDir.filter(f => f.endsWith(".txt") && fs.statSync(path.join(universeDir, f)).isFile());
  if (topFiles.length > 0) {
    const items = topFiles.map(file => {
      const name = file.replace(/\.txt$/, "").replace(/_/g, " ");
      const content = fs.readFileSync(path.join(universeDir, file), "utf-8");
      return { name, filename: file, content };
    });
    ledger.push({
      category: "General Lore",
      items
    });
  }

  return ledger;
}

// GET /api/universes/:universe/ledger
app.get("/api/universes/:universe/ledger", (req, res) => {
  try {
    const { universe } = req.params;
    const universes = listUniverses();
    if (!universes.includes(universe)) {
      res.status(404).json({ error: `Unknown universe: ${universe}` });
      return;
    }
    const ledger = getUniverseLedger(universe);
    res.json({ ledger });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET /api/universes/:universe/characters/:character/graph
app.get("/api/universes/:universe/characters/:character/graph", async (req, res) => {
  try {
    const { universe, character } = req.params;
    const universes = listUniverses();
    if (!universes.includes(universe)) {
      res.status(404).json({ error: `Unknown universe: ${universe}` });
      return;
    }

    const charContent = getCharacterFileContent(universe, character);
    if (!charContent) {
      res.json({ character, edges: [] });
      return;
    }

    if (!apiKey) {
      // Return empty if no API key is set
      res.json({ character, edges: [] });
      return;
    }

    const prompt = `Read the following character lore document:
--- LORE DOCUMENT START ---
${charContent}
--- LORE DOCUMENT END ---

Extract the key relationships and connections of "${character}" to other characters, events, locations, or objects.
Respond with a text block containing a "Connections:" section followed by individual lines for each connection exactly in this format:
Connections:
<source> --[<relation_type>]--> <target> (explanation)

Example lines:
Harry Potter --[godson_of]--> Sirius Black (Sirius Black was revealed to be Harry's godfather)
Severus Snape --[enemy_of]--> Harry Potter (Snape frequently targeted Harry with hostility)

Rules:
- Ensure the query character ("${character}") is on either the source or target side of every connection line.
- Keep relation types simple, using lower snake_case (e.g. child_of, ally_of, member_of, enemy_of).
- Do NOT add markdown formatting around the output, just start with "Connections:" and list them (minimum 8 connections, maximum 15 connections).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const text = response.text || "";
    const edges: any[] = [];
    const characterNorm = character.trim().toLowerCase();

    const connectionsPart = text.split("Connections:")[1] || text;
    const lines = connectionsPart.split("\n");

    const pattern = /^(.*?)\s*--\[(.*?)\]-->\s*(.*?)(?:\s*\((.*)\))?$/;

    for (let line of lines) {
      line = line.trim();
      if (!line || !line.includes("-->")) continue;

      const match = line.match(pattern);
      if (!match) continue;

      const source = match[1].trim();
      const relation = match[2].trim();
      const target = match[3].trim();

      const sourceNorm = source.toLowerCase();
      const targetNorm = target.toLowerCase();

      let other = "";
      let direction = "";

      if (sourceNorm.includes(characterNorm)) {
        other = target;
        direction = "out";
      } else if (targetNorm.includes(characterNorm)) {
        other = source;
        direction = "in";
      } else {
        continue;
      }

      edges.push({
        source: direction === "out" ? character : other,
        target: direction === "out" ? other : character,
        relation: relation.replace(/_/g, " "),
        other: other.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        direction,
      });
    }

    res.json({ character, edges });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. POST /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { speaker, speaker_universe, question, reference_universe, reference_query } = req.body;

    const primaryContent = getCharacterFileContent(speaker_universe, speaker);
    if (!primaryContent) {
      res.status(404).json({ error: `Speaker ${speaker} not found in universe ${speaker_universe}` });
      return;
    }

    let referenceContent: string | null = null;
    if (reference_universe && reference_query) {
      referenceContent = findReferenceContext(reference_universe, reference_query);
    }

    if (!apiKey) {
      res.json({
        answer: "API Key is missing. Please set your GEMINI_API_KEY secret in the Secrets panel.",
        memory_trace: {
          primary: "Lore file is loaded but Gemini API Key is missing.",
          reference: referenceContent || "None"
        }
      });
      return;
    }

    // Generate response using Gemini
    let systemPrompt = `You are ${speaker}. Fully embody their personality, speech patterns, values, and worldview.

Known facts about you, grounded in your world's memory graph:
${primaryContent}

Rules: Stay completely in character. Never break the fourth wall or mention being an AI or a language model.
Use the facts naturally as lived experience, not as a recited list.
Match your canonical speech style, vocabulary, and tone exactly.
Keep responses focused, conversational, and impactful, not encyclopedic.`;

    if (referenceContent) {
      systemPrompt += `

You have just been told about a situation from another world, which you have no first-hand knowledge of beyond what's shared here:
${referenceContent}

Respond to it the way you genuinely would, filtered entirely through your own personality, values, and experience.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nQuestion/Statement from user: ${question}` }] }
      ],
      config: {
        temperature: 0.85,
      }
    });

    const answer = response.text || "";

    res.json({
      answer,
      memory_trace: {
        primary: primaryContent,
        reference: referenceContent || "No cross-universe context requested."
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.resolve(process.cwd(), "app/frontend")
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch(err => {
  console.error("Failed to start server:", err);
});
