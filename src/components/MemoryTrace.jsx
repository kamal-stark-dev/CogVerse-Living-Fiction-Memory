import { useState } from 'react'

function toLines(context) {
  if (!context) return []
  if (typeof context === 'string') return context.split('\n').filter(Boolean)
  if (Array.isArray(context)) return context.flatMap(toLines)
  if (typeof context === 'object') return Object.entries(context).map(([k, v]) => `${k}: ${v}`)
  return [String(context)]
}

export default function MemoryTrace({ primary, reference }) {
  const [open, setOpen] = useState(false)
  const primaryLines = toLines(primary)
  const referenceLines = toLines(reference)
  const total = primaryLines.length + referenceLines.length

  if (total === 0) return null

  return (
    <div className="memory-trace">
      <button className="memory-trace-toggle" onClick={() => setOpen(!open)}>
        {open ? '▾' : '▸'} memory trace ({total} facts retrieved)
      </button>
      <div className={`memory-trace-body ${open ? 'expanded' : ''}`}>
        {primaryLines.map((line, i) => (
          <div key={`p-${i}`} className="trace-line">
            &gt; {line}
          </div>
        ))}
        {referenceLines.length > 0 && (
          <>
            <div className="trace-divider">— referenced world —</div>
            {referenceLines.map((line, i) => (
              <div key={`r-${i}`} className="trace-line trace-ref">
                &gt; {line}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
