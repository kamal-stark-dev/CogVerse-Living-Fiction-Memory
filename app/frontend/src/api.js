// In production, set VITE_API_URL to your deployed backend URL (e.g. https://cogrealm-api.vercel.app).
// In local dev, it falls back to localhost:8000.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

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
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
