// In production, set VITE_API_URL to your deployed backend URL (e.g. https://cogrealm-api.vercel.app).
// In local dev, it falls back to localhost:8000.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

import { GROQ_KEY_KEY } from "./utils/storageKeys";

export async function fetchUniverses() {
  const res = await fetch(`${BASE_URL}/universes`);
  if (!res.ok) throw new Error("Failed to load universes");
  return (await res.json()).universes;
}

export async function fetchCharacters(universe) {
  const res = await fetch(
    `${BASE_URL}/universes/${encodeURIComponent(universe)}/characters`,
  );
  if (!res.ok) throw new Error("Failed to load characters");
  return (await res.json()).characters;
}

export async function sendChat(payload) {
  // Attach the user-supplied Groq API key if one has been saved in localStorage.
  // The backend uses it for this request only; falls back to its env key if absent.
  const storedKey = localStorage.getItem(GROQ_KEY_KEY);
  const body = storedKey
    ? { ...payload, groq_api_key: storedKey }
    : payload;

  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

export async function fetchCharacterGraph(universe, character) {
  const res = await fetch(
    `${BASE_URL}/universes/${encodeURIComponent(universe)}/characters/${encodeURIComponent(character)}/graph`,
  );
  if (!res.ok) throw new Error("Failed to load relationship graph");
  return res.json();
}

