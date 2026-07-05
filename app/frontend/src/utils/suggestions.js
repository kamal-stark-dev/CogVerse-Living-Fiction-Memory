// Curate specific characters as you have time -- these override the generic
// list below. Anyone not listed here still gets sensible generic prompts,
// so this never breaks for new characters you haven't gotten to yet.
const CURATED = {
  'Tony Stark': [
    'Give me startup advice.',
    "What's the one thing you'd do differently?",
    'Roast my business plan.',
  ],
}

const GENERIC = [
  "What's the hardest lesson you've learned?",
  'Give me advice for the toughest day of my life.',
  'Roast me.',
  'What do you regret most?',
]

export function suggestedQuestions(character) {
  return CURATED[character] || GENERIC
}
