'use client'
import { useRef, useState, useSyncExternalStore } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { Check } from './ui'

type Item = { title: string; text?: string }

const QUERY = '(max-width: 800px)'
const subscribe = (cb: () => void) => { const m = matchMedia(QUERY); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb) }
const useNarrow = () => useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false)

/** Deposit-type cards: the existing grid on wide screens, a draggable carousel with Previous / Next buttons on phones. */
export default function DepositTypes({ items }: { items: Item[] }) {
  const narrow = useNarrow()
  if (!items.length) return null
  if (!narrow) {
    return (
      <div className="types">
        {items.map((c, i) => <div className="type" key={i}><Check /><span className="rule" /><h3>{c.title}</h3><p>{c.text}</p></div>)}
      </div>
    )
  }
  return <Carousel items={items} />
}

function Carousel({ items }: { items: Item[] }) {
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const x = useMotionValue(0)
  const [i, setI] = useState(0)
  const last = items.length - 1

  const step = () => {
    const c = track.current?.children
    if (!c || !c[0]) return 1
    return c[1] ? (c[1] as HTMLElement).offsetLeft - (c[0] as HTMLElement).offsetLeft : (c[0] as HTMLElement).offsetWidth
  }
  const goTo = (n: number) => {
    const k = Math.max(0, Math.min(last, n))
    const room = Math.max(0, (track.current?.scrollWidth ?? 0) - (wrap.current?.clientWidth ?? 0))
    animate(x, -Math.min(k * step(), room), reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 36 })
    setI(k)
  }

  return (
    <div className="dt" role="region" aria-roledescription="carousel" aria-label="Types of covered deposit">
      <div className="dt-view" ref={wrap}>
        <motion.ul className="dt-track" ref={track} style={{ x }} drag="x" dragConstraints={wrap} dragElastic={0.12} dragMomentum={false}
          onDragEnd={(_, info) => goTo(Math.round(-(x.get() + info.velocity.x * 0.12) / step()))}>
          {items.map((c, n) => (
            <li className="dt-card" key={n} aria-roledescription="slide" aria-label={`${n + 1} of ${items.length}`}>
              <Check /><span className="rule" /><h3>{c.title}</h3><p>{c.text}</p>
            </li>
          ))}
        </motion.ul>
      </div>
      <div className="dt-bar">
        <button type="button" className="dt-btn" aria-label="Previous type" disabled={i === 0} onClick={() => goTo(i - 1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <p className="dt-status" aria-live="polite">{i + 1} of {items.length}</p>
        <button type="button" className="dt-btn" aria-label="Next type" disabled={i === last} onClick={() => goTo(i + 1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}
