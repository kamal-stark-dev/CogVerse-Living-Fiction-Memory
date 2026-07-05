import { useState } from 'react'
import { accentForUniverse } from '../utils/colors'

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

export default function Avatar({ universe, character, size = 32 }) {
  const [extIndex, setExtIndex] = useState(0)
  const [exhausted, setExhausted] = useState(false)

  if (!universe || !character) return null

  const accent = accentForUniverse(universe)

  const handleError = () => {
    if (extIndex < EXTENSIONS.length - 1) {
      setExtIndex((i) => i + 1)
    } else {
      setExhausted(true)
    }
  }

  if (exhausted) {
    const initial = character[0]?.toUpperCase() ?? '?'
    return (
      <div
        className="avatar avatar-fallback"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.42,
          borderColor: accent,
          color: accent,
        }}
      >
        {initial}
      </div>
    )
  }

  const slug = character.replace(/ /g, '_')
  const src = `/characters/${universe}/${slug}.${EXTENSIONS[extIndex]}`

  return (
    <img
      key={src}
      className="avatar"
      src={src}
      alt={character}
      style={{ width: size, height: size }}
      onError={handleError}
    />
  )
}
