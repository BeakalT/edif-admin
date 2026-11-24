'use client'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

export type BoardPerson = { name: string; jobTitle: string; photo?: string; bio?: ReactNode }

const initials = (name: string) => name.replace(/^(Ato|Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?|H\.E\.?)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

function Card({ p, reduce }: { p: BoardPerson; reduce: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const uid = useId()
  const [role, ...org] = p.jobTitle.split(', ')
  // The card turns over on mouse hover or when its button has focus; the button also toggles it for touch and keyboard.
  const hide = !reduce
  return (
    <li className={'bc' + (flipped ? ' is-flipped' : '')}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setFlipped(true) }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setFlipped(false) }}>
      <div className="bc-inner">
        <div className="bc-face bc-front" aria-hidden={hide && flipped ? true : undefined}>
          <div className="bc-photo">{p.photo ? <img src={p.photo} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(p.name)}</span>}</div>
          <h3>{p.name}</h3>
          <p className="bc-role">{p.jobTitle}</p>
        </div>
        <div className="bc-face bc-back" aria-hidden={hide && !flipped ? true : undefined} id={uid}>
          <span className="bc-k">{role}</span>
          <h3>{p.name}</h3>
          {org.length > 0 && <p className="bc-org">{org.join(', ')}</p>}
          <div className="bc-bio" {...(flipped || reduce ? { tabIndex: 0, role: 'region', 'aria-label': `About ${p.name}` } : {})}>
            {p.bio ?? <p>A biography will be published here soon.</p>}
          </div>
        </div>
      </div>
      <button type="button" className="bc-btn" aria-expanded={flipped} aria-controls={uid}
        onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)} onClick={() => setFlipped((v) => !v)}>
        {flipped ? 'Back' : 'About'}<span className="sr-only"> {p.name}</span>
      </button>
    </li>
  )
}

/** Board members as cards that turn over on hover or focus to show the role and biography; a button does the same on touch screens. With reduced motion both sides are shown in plain view. */
export function BoardCards({ people }: { people: BoardPerson[] }) {
  const reduce = !!useReducedMotion()
  return <ul className="bc-grid">{people.map((p) => <Card key={p.name} p={p} reduce={reduce} />)}</ul>
}
