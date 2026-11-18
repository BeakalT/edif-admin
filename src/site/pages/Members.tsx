'use client'
import { useMemo, useState } from 'react'
import { Link } from '../router'
import { Arrow, Globe, Mail, PageHero, Phone, Pin, Search } from '../components/ui'
import { useCms } from '../cms-context'
import type { Member } from '../data/members'

type Tab = 'all' | 'bank' | 'mfi'
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export function MemberDirectory({ source = '' }: { source?: string }) {
  const { banks, microfinance } = useCms()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const all = useMemo(() => [
    ...banks.map((m) => ({ ...m, type: 'bank' as const })),
    ...microfinance.map((m) => ({ ...m, type: 'mfi' as const })),
  ], [])
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const list = all
    .filter((m) => tab === 'all' || m.type === tab)
    .filter((m) => !q || norm(m.name + m.location).includes(norm(q)))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'bank' ? -1 : 1))
  const tabs: [Tab, string, number][] = [['all', 'All', all.length], ['bank', 'Banks', banks.length], ['mfi', 'Microfinance', microfinance.length]]
  return (
    <>
    <div className="dir-tools">
      <label className="search">
        <Search />
        <span className="sr">Search members</span>
        <input type="search" placeholder="Search by name or town" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <div className="tabs" role="tablist" aria-label="Filter by type">
        {tabs.map(([k, l, n]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l} <span className="num">{n}</span></button>
        ))}
      </div>
    </div>
    <p className="dir-count" aria-live="polite">
      {list.length ? <>Showing <b>{list.length}</b> {list.length === 1 ? 'member' : 'members'}{q && <> matching “{q}”</>}</> : null}
    </p>
    {list.length ? (
      <ul className="mgrid">
        {list.map((m) => <MemberCard key={m.type + m.name} m={m} type={m.type} />)}
      </ul>
    ) : (
      <div className="empty">
        <h3>No member matches “{q}”</h3>
        <p>Check the spelling, or try part of the name. Every bank and microfinance institution licensed by the National Bank of Ethiopia is a member, so if an institution is licensed but missing here, your deposits are still protected.</p>
        <button className="btn btn--navy" onClick={() => { setQ(''); setTab('all') }}>Show all members</button>
      </div>
    )}
      {source && <p className="source">{source}</p>}
    </>
  )
}

export default function Members() {
  const { banks, microfinance } = useCms()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const all = useMemo(() => [
    ...banks.map((m) => ({ ...m, type: 'bank' as const })),
    ...microfinance.map((m) => ({ ...m, type: 'mfi' as const })),
  ], [])
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const list = all
    .filter((m) => tab === 'all' || m.type === tab)
    .filter((m) => !q || norm(m.name + m.location).includes(norm(q)))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'bank' ? -1 : 1))
  const tabs: [Tab, string, number][] = [['all', 'All', all.length], ['bank', 'Banks', banks.length], ['mfi', 'Microfinance', microfinance.length]]
  return (
    <>
      <PageHero eyebrow="Member institutions" title="Every licensed institution" tagline="is a member."
        lead="Membership is compulsory for all commercial banks and microfinance institutions licensed by the National Bank of Ethiopia. If yours is on this list, your eligible deposits are protected.">
        <div className="hero-figs">
          <div><b className="num">{banks.length}</b><span>Commercial banks</span></div>
          <div><b className="num">{microfinance.length}</b><span>Microfinance institutions</span></div>
          <div><b className="num">{all.length}</b><span>Members in total</span></div>
        </div>
      </PageHero>

      <section className="section dir-sec">
        <div className="container">
          <div className="dir-tools">
            <label className="search">
              <Search />
              <span className="sr">Search members</span>
              <input type="search" placeholder="Search by name or town" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="tabs" role="tablist" aria-label="Filter by type">
              {tabs.map(([k, l, n]) => (
                <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l} <span className="num">{n}</span></button>
              ))}
            </div>
          </div>
          <p className="dir-count" aria-live="polite">
            {list.length ? <>Showing <b>{list.length}</b> {list.length === 1 ? 'member' : 'members'}{q && <> matching “{q}”</>}</> : null}
          </p>
          {list.length ? (
            <ul className="mgrid">
              {list.map((m) => <MemberCard key={m.type + m.name} m={m} type={m.type} />)}
            </ul>
          ) : (
            <div className="empty">
              <h3>No member matches “{q}”</h3>
              <p>Check the spelling, or try part of the name. Every bank and microfinance institution licensed by the National Bank of Ethiopia is a member, so if an institution is licensed but missing here, your deposits are still protected.</p>
              <button className="btn btn--navy" onClick={() => { setQ(''); setTab('all') }}>Show all members</button>
            </div>
          )}
          <p className="source">Members: EDIF Annual Report 2024/25. Contact details: edif.gov.et member directory; some are not yet available.</p>
        </div>
      </section>

      <section className="section band">
        <div className="container band-inner">
          <div>
            <span className="eyebrow left light">For members</span>
            <h2 className="h2 light">Premiums and reporting</h2>
          </div>
          <div className="band-copy">
            <p>Members pay an initial premium of 0.04% of their March 2023 deposits and an annual premium of 0.3% of their average total deposits, assessed separately on conventional and interest-free deposits.</p>
            <p>They also provide single customer information so the Fund can repay depositors quickly if needed.</p>
            <Link className="btn btn--gold" to="/members/institutions">For member institutions <Arrow /></Link>
          </div>
        </div>
      </section>
    </>
  )
}

function MemberCard({ m, type }: { m: Member; type: 'bank' | 'mfi' }) {
  const phone = m.phone.split('/')[0]
  return (
    <li className="mcard">
      <span className={'mtype ' + type}>{type === 'bank' ? 'Bank' : 'Microfinance'}</span>
      <h3>{m.name}</h3>
      <ul className="mmeta">
        {m.location && <li><Pin /><span>{m.location}</span></li>}
        {m.phone && <li><Phone /><a href={'tel:' + phone.replace(/[^\d+]/g, '')}>{m.phone}</a></li>}
        {m.email && <li><Mail /><a href={'mailto:' + m.email}>{m.email}</a></li>}
        {m.website && <li><Globe /><a href={m.website} target="_blank" rel="noreferrer">{host(m.website)}</a></li>}
        {!m.phone && !m.email && !m.website && <li className="na">Contact details not yet published</li>}
      </ul>
    </li>
  )
}
