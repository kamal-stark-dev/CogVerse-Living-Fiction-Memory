const ACCENTS = ['#E8A33D', '#4FB286', '#D64550', '#4E8FE8', '#C77DD1', '#5FC9C0']

export function accentForUniverse(universe) {
  let hash = 0
  for (let i = 0; i < universe.length; i++) {
    hash = universe.charCodeAt(i) + ((hash << 5) - hash)
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length]
}
