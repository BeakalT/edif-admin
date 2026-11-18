'use client'
import { Link } from '../router'
import { Arrow, DocIcon, Download, PageHero, SecHead, TLink } from '../components/ui'
import { useCms } from '../cms-context'
import { tel } from '../data/content'

export default function Institutions() {
  const { docs, banks, microfinance, contact } = useCms()
  const memberDocs = docs.filter((d) => ['Regulation', 'Directive', 'Reporting'].includes(d.kind))
  return (
    <>
      <PageHero eyebrow="For member institutions" title="Membership, premiums" tagline="and reporting."
        crumbs={[{ to: '/members', label: 'Members' }]}
        lead="What the Fund requires of the banks and microfinance institutions it protects: who must join, the premiums members pay, and the depositor information they provide." />

      <section className="section">
        <div className="container split">
          <div className="lede">
            <span className="eyebrow left">Membership</span>
            <h2 className="h2">Every licensed institution <em>is a member</em></h2>
            <p className="lead">Membership is compulsory for every commercial bank and microfinance institution licensed by the National Bank of Ethiopia.</p>
            <p>Members must meet the Fund’s requirements, including paying the prescribed premiums.</p>
            <div className="btn-row">
              <TLink to="/members">See the member directory</TLink>
            </div>
          </div>
          <ul className="mi-figs">
            <li><b className="num">{banks.length}</b><span>Commercial banks</span></li>
            <li><b className="num">{microfinance.length}</b><span>Microfinance institutions</span></li>
            <li><b className="num">{banks.length + microfinance.length}</b><span>Members in total</span></li>
          </ul>
        </div>
      </section>

      <section className="section bg-ice" id="premiums">
        <div className="container">
          <SecHead eyebrow="Premiums" title="What members" em="contribute" lead="Premiums are assessed separately on conventional and interest-free deposits." />
          <div className="mi-prem">
            <div className="mi-p">
              <span className="k">Initial premium</span>
              <b className="num">0.04%</b>
              <p>A one-off contribution, based on each member’s total deposits in March 2023.</p>
            </div>
            <div className="mi-p">
              <span className="k">Annual premium</span>
              <b className="num">0.3%</b>
              <p>Of average total deposits, paid every year by each member bank and microfinance institution.</p>
            </div>
            <div className="mi-p mi-p--if">
              <span className="k">Interest-free deposits</span>
              <b>Kept separate</b>
              <p>Interest-free premiums are collected into a separate account at the National Bank of Ethiopia and invested in line with Sharia principles.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="reporting">
        <div className="container split">
          <div className="lede">
            <span className="eyebrow left">Reporting</span>
            <h2 className="h2">Single customer <em>information</em></h2>
            <p className="lead">Members collect and provide information on each depositor, so the Fund can repay insured depositors quickly if an institution fails.</p>
            <p>The rules for premiums and member obligations, and the information members must provide, are set out in the documents here.</p>
          </div>
          <ul className="docs">
            {memberDocs.map((d) => (
              <li key={d.url}><a className="doc" href={d.url} target="_blank" rel="noreferrer">
                <span className="ic"><DocIcon /></span>
                <span><span className="k">{d.kind}</span><strong>{d.title}</strong><span className="d">{d.desc}</span></span>
                <span className="dl"><Download /></span>
              </a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band">
        <div className="container band-inner">
          <div>
            <span className="eyebrow left light">Contact</span>
            <h2 className="h2 light">Questions from members</h2>
          </div>
          <div className="band-copy">
            <p>For questions about membership, premiums or reporting, contact the Fund.</p>
            <p className="mi-contact"><a href={'mailto:' + contact.email}>{contact.email}</a><a href={tel(contact.phones[0])}>{contact.phones[0]}</a></p>
            <Link className="btn btn--gold" to="/contact">Contact the Fund <Arrow /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
