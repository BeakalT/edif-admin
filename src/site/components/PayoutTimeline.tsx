'use client'
import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { payoutSteps } from '../data/content'

/**
 * "Four stages, ninety days": a vertical timeline whose line draws as you scroll. Each stage is a button that expands its detail (Enter or Space, Tab between stages).
 * With reduced motion everything is shown statically: line complete, every stage open, no buttons to press.
 */
export function PayoutTimeline() {
  const reduce = useReducedMotion()
  const uid = useId()
  const list = useRef<HTMLOListElement>(null)
  const [open, setOpen] = useState<number | null>(0)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 55%'] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])
  const last = payoutSteps.length - 1

  return (
    <div className="pt">
      <ol className="pt-list" ref={list}>
        <span className="pt-rail" aria-hidden="true">
          <motion.span className="pt-fill" style={{ scaleY: reduce ? 1 : fill }} />
        </span>
        {payoutSteps.map((s, i) => {
          const expanded = reduce ? true : open === i
          const panel = `${uid}-p${i}`
          const head = `${uid}-h${i}`
          return (
            <li key={s.t} className={'pt-step' + (i === last ? ' is-last' : '') + (expanded ? ' is-open' : '')}>
              <span className="pt-node" aria-hidden="true">{i + 1}</span>
              <div className="pt-body">
                <span className="pt-day">{s.day}</span>
                <h3 id={head}>
                  {reduce ? s.t : (
                    <button type="button" aria-expanded={expanded} aria-controls={panel} onClick={() => setOpen(expanded ? null : i)}>
                      <span>{s.t}</span><i aria-hidden="true" />
                    </button>
                  )}
                </h3>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div key="p" id={panel} role="region" aria-labelledby={head} className="pt-panel"
                      initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}>
                      <p>{s.d}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          )
        })}
      </ol>
      <div className="pt-late">
        <p><strong>Missed the 90 days?</strong> You can still claim for up to five years by giving a justifiable reason for the delay.</p>
      </div>
    </div>
  )
}
