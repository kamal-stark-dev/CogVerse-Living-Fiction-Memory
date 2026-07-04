const BASE_URL = 'http://localhost:8000'

export async function fetchUniverses() {
  const res = await fetch(`${BASE_URL}/universes`)
  if (!res.ok) throw new Error('Failed to load universes')
  return (await res.json()).universes
}

export async function fetchCharacters(universe) {
  const res = await fetch(`${BASE_URL}/universes/${encodeURIComponent(universe)}/characters`)
  if (!res.ok) throw new Error('Failed to load characters')
  return (await res.json()).characters
}

export async function sendChat(payload) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Chat request failed')
  return res.json()
}
