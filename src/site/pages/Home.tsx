'use client'
import { useEffect, useRef } from 'react'
import { Link } from '../router'
import Calculator from '../components/Calculator'
import { Compare, Crowd, FaqList, NewsCard, PubCard, Rules, Steps, Ticker } from '../components/sections'
import { Arrow, SecHead, TLink } from '../components/ui'
import { useCms } from '../cms-context'
import { img, latestDocs, tel } from '../data/content'

function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!, fmt = (n: number) => Math.round(n).toLocaleString('en-US')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to) + suffix; return }
    el.textContent = '0' + suffix
    let raf = 0
    const id = setTimeout(() => {
      const t0 = performance.now(), d = 1600
      const f = (t: number) => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(to * e) + suffix; if (k < 1) raf = requestAnimationFrame(f) }
      raf = requestAnimationFrame(f)
    }, 700)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [to, suffix])
  return <span ref={ref}>{to.toLocaleString('en-US') + suffix}</span>
}

export default function Home() {
  const { articles, docs, faqs, banks, microfinance, contact } = useCms()
  const total = banks.length + microfinance.length
  const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-bg"><img src={img('hallL.jpg')} alt="" /></div>
        <div className="container hero-inner">
          <h1>Ethiopian Deposit Insurance Fund</h1>
          <span className="tagline">Your savings, protected.</span>
          <p className="intro">If a licensed bank or microfinance institution in Ethiopia fails, EDIF repays each depositor up to Birr 100,000. Protection is automatic: you don’t register for it and you don’t pay for it.</p>
          <div className="partners"><span>Accountable to the National Bank of Ethiopia</span><span>Regulation No. 482/2021</span><span>Operating since 2023</span></div>
          <div className="btn-row">
            <Link className="btn btn--gold" to="/deposit-protection/calculator">Check your coverage <Arrow /></Link>
            <Link className="btn btn--outline-light" to="/members">Find your bank</Link>
          </div>
          <div className="ledger">
            <div><div className="big"><b className="num"><Count to={97} suffix="%" /></b><span className="tag">Depositors</span></div><strong>Fully covered</strong><p>About 171 million of 176 million depositors hold balances within the limit.</p></div>
            <div><div className="big"><b className="num"><small>Birr</small><Count to={100000} /></b><span className="tag">Coverage</span></div><strong>Per depositor</strong><p>At each member bank or microfinance institution, separately.</p></div>
            <div><div className="big"><b className="num"><Count to={total} /></b><span className="tag">Members</span></div><strong>Licensed institutions</strong><p>{banks.length} banks and {microfinance.length} microfinance institutions, all covered by law.</p></div>
          </div>
        </div>
      </section>

      <section className="section bg-ice" id="about">
        <div className="container">
          <div className="about">
            <div><div className="photo"><img src={img('stage.jpg')} alt="Panel discussion at EDIF’s deposit insurance awareness and dialogue conference, Addis Ababa, March 2024" /></div></div>
            <div className="about-copy">
              <span className="eyebrow left">About EDIF</span>
              <h2 className="h2">Ethiopia’s <em>safety net</em> for every depositor</h2>
              <p>EDIF was established under Council of Ministers Regulation No. 482/2021 and began operating in April 2023. It is accountable to the National Bank of Ethiopia, reports to Parliament, and is audited externally every year.</p>
              <p>A bank run starts with a rumour and a queue at the door. Deposit insurance removes the reason to run: small depositors know their money is safe, the financial system stays steady, and the cost of a failure is carried by the institutions that pay premiums, not by taxpayers.</p>
              <div className="btn-row">
                <Link className="btn btn--navy" to="/about">About the Fund <Arrow /></Link>
                <TLink to="/about/governance">Governance</TLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ice" id="covered">
        <div className="container">
          <SecHead eyebrow="Deposit protection" title="What your deposit insurance" em="covers" lead="The everyday accounts most people hold are covered. A few kinds of deposit are excluded by law." />
          <Crowd />
          <Rules />
          <Compare />
          <Ticker />
        </div>
      </section>

      <section className="section" id="estimate">
        <div className="container calc-wrap">
          <div className="calc-copy">
            <span className="eyebrow left">Coverage calculator</span>
            <h2 className="h2">How much of your money is <em>protected?</em></h2>
            <p className="lead">Enter each account you hold. Accounts at the same institution are added together, and each institution is protected separately, up to Birr 100,000.</p>
            <ol className="how">
              <li><b>01</b><span><strong>Choose the institution</strong> that holds the account.</span></li>
              <li><b>02</b><span><strong>Enter the balance</strong> in Birr, including interest. Convert foreign currency to Birr first.</span></li>
              <li><b>03</b><span><strong>Add every account</strong>, including several at the same institution.</span></li>
            </ol>
            <div className="calc-auto">
              <p><strong>Protection is automatic.</strong> You don’t need to apply, register or pay anything.</p>
              <TLink to="/deposit-protection">How coverage works</TLink>
            </div>
          </div>
          <Calculator />
        </div>
      </section>

      <section className="section bg-ice" id="payout">
        <div className="container">
          <SecHead eyebrow="Deposit payout" title="If an institution fails," em="this is what happens" lead="The timetable is set by Council of Ministers Regulation No. 482/2021. The failed institution’s own records are used to work out what each depositor is owed." />
          <Steps />
        </div>
      </section>

      <section className="section" id="news">
        <div className="container">
          <SecHead eyebrow="News and events" title="Latest from" em="the Fund" />
          <div className="news">{latest.map((a) => <NewsCard key={a.slug} a={a} />)}</div>
          <div className="faq-more"><TLink to="/news">All news</TLink></div>
        </div>
      </section>

      <section className="section bg-ice" id="publications">
        <div className="container">
          <SecHead eyebrow="Publications" title="Official" em="documents" lead="Annual reports, and the laws and directives behind deposit insurance in Ethiopia." />
          <div className="pubs">{latestDocs(docs, 3).map((d) => <PubCard key={d.url} d={d} />)}</div>
          <div className="faq-more"><TLink to="/publications">All publications</TLink></div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container faq-split">
          <div className="faq-side">
            <span className="eyebrow left">Questions</span>
            <h2 className="h2">What depositors <em>ask us most</em></h2>
            <p className="lead">Short answers to the questions we hear most. The full list is one click away.</p>
            <div className="faq-help">
              <span className="faq-help-k">Still have a question?</span>
              <b>Speak to the Fund</b>
              <a href={tel(contact.phones[0])}>{contact.phones[0]}</a>
              <a href={'mailto:' + contact.email}>{contact.email}</a>
              <Link className="btn btn--gold" to="/contact">Contact the Fund <Arrow /></Link>
            </div>
          </div>
          <div className="faq-main">
            <FaqList items={faqs.filter((f) => f.home)} />
            <div className="faq-more"><TLink to="/faq">All questions and answers</TLink></div>
          </div>
        </div>
      </section>
    </>
  )
}
