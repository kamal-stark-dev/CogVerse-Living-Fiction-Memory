import { useState } from 'react'

const DISMISS_KEY = 'cogrealm_notice_dismissed_v1'

export default function NoticeBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === 'true')

  if (dismissed) return null

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="notice-banner">
      <span>
        ⚡ Running on free-tier hosting — the backend may take 30–60s to wake up if it's been idle, and
        responses use Groq's free API tier, so occasional rate limits are possible. Thanks for your patience,
        and enjoy exploring the realms!
      </span>
      <button type="button" className="notice-dismiss" onClick={handleDismiss} aria-label="Dismiss notice">
        ✕
      </button>
    </div>
  )
}
