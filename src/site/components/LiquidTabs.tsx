'use client'
import { useId } from 'react'
import { MotionConfig, motion } from 'motion/react'

type Tab<T extends string> = [T, string, number?]

/** The filter switch used on the member directory: a navy pill glides between options with a soft spring. */
export default function LiquidTabs<T extends string>({ tabs, value, onChange, label }: { tabs: Tab<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  const id = useId()
  return (
    <MotionConfig reducedMotion="user">
      <div className="tabs liquid" role="tablist" aria-label={label}>
        {tabs.map(([k, l, n]) => (
          <button key={k} type="button" role="tab" aria-selected={value === k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>
            {value === k && <motion.span layoutId={id} className="liquid-pill" transition={{ type: 'spring', stiffness: 420, damping: 30 }} />}
            <span className="liquid-lbl">{l}{n !== undefined && <> <span className="num">{n}</span></>}</span>
          </button>
        ))}
      </div>
    </MotionConfig>
  )
}
