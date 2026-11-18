'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

const NAMES: Record<string, string> = {
  homeHero: 'Home hero', pageHero: 'Page banner', section: 'Section', band: 'Dark band', nextLinks: 'Keep reading', hero: 'Page heading', richText: 'Text', cards: 'Cards',
  figures: 'Key figures', faqs: 'FAQ', news: 'Latest news', publications: 'Publications', people: 'People', gallery: 'Gallery', video: 'Video', downloads: 'Downloads',
  callout: 'Note', cta: 'Call to action', table: 'Table', custom: 'Custom HTML/CSS',
  splitText: 'Photo and text', visionMission: 'Vision and mission', pcards: 'Cards', iCards: 'Icon cards', numberedList: 'Numbered list', statGrid: 'Numbers grid', orgChart: 'Org chart',
  board: 'Board', profiles: 'Profiles', crowd: 'Big number', rules: 'Coverage limit', compare: 'Covered / not covered', ticker: 'Member ticker', steps: 'Payout timeline',
  calcSection: 'Calculator', faqSplit: 'Questions + help', linkCards: 'Link cards', typeCards: 'Tick cards', exclPanel: 'Numbered panel', worked: 'Worked examples', faqPart: 'Questions',
  premiumCards: 'Premium cards', memberDirectory: 'Member directory', ledeSplit: 'Title + side content',
}

/** Row title in the page builder: what kind of block it is, and its heading, so editors can find their way. */
export default function BlockRowLabel() {
  const { data, rowNumber } = useRowLabel<any>()
  const kind = NAMES[data?.blockType] || data?.blockType || 'Block'
  const title = data?.head?.title || data?.title || data?.heading || data?.label || data?.eyebrow || data?.head?.eyebrow || data?.tagline || ''
  const hidden = data?.section?.hidden
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      <b style={{ opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>{String((rowNumber ?? 0) + 1).padStart(2, '0')}</b>
      <b>{kind}</b>
      {title && <span style={{ opacity: 0.75, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(title).slice(0, 70)}</span>}
      {hidden && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'var(--edif-gold)', color: '#14244f', fontWeight: 800 }}>HIDDEN</span>}
    </span>
  )
}
