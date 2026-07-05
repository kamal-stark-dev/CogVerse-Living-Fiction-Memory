import { accentForUniverse } from './colors'

// Curate these to match each universe's vibe. Any universe NOT listed here
// automatically falls back to the hash-based color from colors.js, so adding
// a new universe folder never breaks -- it just won't be custom-themed until
// you add an entry here.
const THEMES = {
  Harry_Potter: { accent: '#8B0000' }, // Gryffindor maroon
  MCU: { accent: '#ED1D24' }, // classic Marvel red
  Kung_Fu_Panda: { accent: '#2E8B57' }, // jade green
  The_Hangover: { accent: '#D4AF37' }, // Vegas gold
  Breaking_Bad: { accent: '#6AAE3E' }, // toxic green
}

function hexToRgba(hex, alpha) {
  const bigint = parseInt(hex.replace('#', ''), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getTheme(universe) {
  const accent = THEMES[universe]?.accent ?? accentForUniverse(universe)
  return {
    accent,
    soft: hexToRgba(accent, 0.18),
  }
}
