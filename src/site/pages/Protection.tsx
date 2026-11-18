'use client'
import { Link } from '../router'
import Calculator from '../components/Calculator'
import { Compare, FaqList, Rules, Steps } from '../components/sections'
import { Arrow, Bank, Calc, Check, Clock, Curves, NextLinks, PageHero, SecHead, Shield, SubNav, TLink, protectionNav } from '../components/ui'
import { useCms } from '../cms-context'
import { coveredDetail, exclusions, type Faq } from '../data/content'

const crumbs = [{ to: '/deposit-protection', label: 'Deposit protection' }]
const cat = (faqs: Faq[], c: string, n = 4) => faqs.filter((f) => f.cat === c).slice(0, n)

export function ProtectionOverview() {
  const { faqs } = useCms()
  return (
    <>
      <PageHero eyebrow="Deposit protection" title="Your deposits are protected" tagline="automatically, and at no cost to you."
        lead="Every bank and microfinance institution licensed by the National Bank of Ethiopia is a member of the Fund. If one fails, the Fund repays each depositor up to Birr 100,000."
        image="stage.jpg" />
      <SubNav label="Deposit protection" items={protectionNav} />

      <section className="section">
        <div className="container split">
          <div className="lede">
            <span className="eyebrow left">How it works</span>
            <h2 className="h2">Three rules <em>to remember</em></h2>
            <p className="lead">Deposit insurance is triggered when the National Bank of Ethiopia revokes the business licence of a failed member. From that moment, the Fund is responsible for repaying insured deposits.</p>
            <p>You don’t need to apply, register or pay anything. The Fund uses the failed institution’s own records to work out what each depositor is owed, and pays through an appointed bank.</p>
          </div>
          <div>
            <Rules />
            <div className="callout">
              <Shield />
              <p><strong>About 97% of depositors are fully covered.</strong> Around 171 million of the 176 million people with deposits at member institutions hold balances within the limit.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Find out more" title="Everything about" em="your protection" />
          <div className="icards">
            <Link className="icard" to="/deposit-protection/coverage">
              <span className="ic"><Check /></span>
              <h3>What’s covered</h3>
              <p>The eight types of account that are protected, the 11 exclusions, and interest-free deposits.</p>
              <span className="tlink">See coverage <Arrow /></span>
            </Link>
            <Link className="icard feature-dark" to="/deposit-protection/calculator">
              <Curves />
              <span className="ic"><Calc /></span>
              <h3>Coverage calculator</h3>
              <p>Add up your accounts and see how much of your money is protected at each institution.</p>
              <span className="tlink">Check your coverage <Arrow /></span>
            </Link>
            <Link className="icard" to="/deposit-protection/payout">
              <span className="ic"><Clock /></span>
              <h3>If an institution fails</h3>
              <p>The 90-day payout timetable, where you are paid, and how the Fund recovers its money.</p>
              <span className="tlink">See the process <Arrow /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section band">
        <Curves variant="c" />
        <div className="container band-inner">
          <div>
            <span className="eyebrow left light">Why a limit</span>
            <h2 className="h2 light">Small savers first</h2>
          </div>
          <div className="band-copy">
            <p>Deposit insurance exists to protect people who cannot easily judge a bank’s health. A limit of Birr 100,000 covers almost all of them in full.</p>
            <p>Depositors with larger balances, and institutions themselves, are expected to watch the health of the banks they use. That discipline, set out in international principles for deposit insurers, keeps the system safer for everyone.</p>
            <Link className="btn btn--gold" to="/members">Check your bank is a member <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Questions" title="Common questions" em="about protection" />
          <FaqList items={cat(faqs, 'Protection')} />
          <div className="faq-more"><TLink to="/faq">All questions and answers</TLink></div>
        </div>
      </section>
    </>
  )
}

export function Coverage() {
  return (
    <>
      <PageHero eyebrow="Deposit protection" title="What’s covered" tagline="and what isn’t."
        lead="The everyday accounts most people hold are covered, in Birr and in foreign currency. A short list of deposits is excluded by Council of Ministers Regulation No. 482/2021."
        image="hall.jpg" crumbs={crumbs} />
      <SubNav label="Deposit protection" items={protectionNav} />

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Covered" title="Eight kinds of account," em="all protected" lead="Each is protected at every member bank and microfinance institution, up to the Birr 100,000 limit per depositor." />
          <div className="types">
            {coveredDetail.map((c) => (
              <div className="type" key={c.t}>
                <Check />
                <span className="rule" />
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Not covered" title="The 11" em="exclusions" lead="These deposits are not insured, mainly because the depositor is a professional institution, the Government, or someone connected to the failed institution." />
          <div className="excl-panel">
            <Curves />
            <ol className="excl-grid">
              {exclusions.map((x, i) => (
                <li className="excl-row" key={x}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="interest-free">
        <div className="container split">
          <div className="lede">
            <span className="eyebrow left">Interest-free deposits</span>
            <h2 className="h2">Covered on <em>the same terms</em></h2>
            <p className="lead">Interest-free deposits are protected exactly like conventional ones: up to Birr 100,000 per depositor at each institution.</p>
            <p>The Fund keeps interest-free premiums apart. They are collected into a separate Interest-free Deposit Premium Account at the National Bank of Ethiopia and invested in line with Sharia principles, through Mudarabah deposits, to generate profit.</p>
          </div>
          <div className="mini-stats">
            <div className="stat"><b className="num"><small>Birr</small>650m</b><span>Interest-free premiums</span><p>Collected in 2024/25.</p></div>
            <div className="stat"><b className="num"><small>Birr</small>1.27bn</b><span>Mudarabah investment</span><p>As at June 30, 2025.</p></div>
            <div className="stat"><b className="num">15.6%</b><span>Of depositors</span><p>Hold interest-free deposits.</p></div>
            <div className="stat"><b className="num"><small>Birr</small>378bn</b><span>Interest-free deposits</span><p>Held at member institutions.</p></div>
          </div>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Counting your balance" title="How your insured amount" em="is worked out" />
          <div className="icards">
            <div className="icard"><span className="ic num">1</span><h3>Accounts are added up</h3><p>All your insurable deposits at the same institution are combined, including accrued interest.</p></div>
            <div className="icard"><span className="ic num">2</span><h3>Foreign currency is converted</h3><p>Deposits in foreign currency are converted into Birr at the buying exchange rate.</p></div>
            <div className="icard"><span className="ic num">3</span><h3>Loans are netted off</h3><p>Matured loans, and deposits held as collateral for them, are netted against your balance.</p></div>
          </div>
          <div className="faq-more"><Link className="btn btn--navy" to="/deposit-protection/calculator">Try the coverage calculator <Arrow /></Link></div>
        </div>
      </section>

      <NextLinks items={[
        { to: '/deposit-protection/payout', k: 'Payout', t: 'If an institution fails', d: 'When and where insured depositors are repaid.' },
        { to: '/members', k: 'Members', t: 'Is my bank a member?', d: 'Search all 93 member banks and microfinance institutions.' },
        { to: '/faq', k: 'Questions', t: 'Questions and answers', d: 'Straight answers to what depositors ask most.' },
      ]} />
    </>
  )
}

export function CalculatorPage() {
  const { faqs } = useCms()
  const examples = [
    { t: 'One account', rows: [['Savings at Bank A', 80000]], prot: 80000, over: 0, note: 'Below the limit, so all of it is protected.' },
    { t: 'Two accounts, same bank', rows: [['Savings at Bank A', 70000], ['Time deposit at Bank A', 50000]], prot: 100000, over: 20000, note: 'Added together: Birr 120,000. Birr 20,000 is above the limit.' },
    { t: 'Accounts at two banks', rows: [['Savings at Bank A', 90000], ['Savings at Bank B', 90000]], prot: 180000, over: 0, note: 'Each bank is protected separately, so both are covered in full.' },
  ] as const
  const f = (n: number) => n.toLocaleString('en-US')
  return (
    <>
      <PageHero eyebrow="Coverage calculator" title="How much of your money" tagline="is protected?"
        lead="Enter each account you hold. Accounts at the same institution are added together; each institution is protected separately, up to Birr 100,000."
        crumbs={crumbs} />
      <SubNav label="Deposit protection" items={protectionNav} />

      <section className="section">
        <div className="container calc-wrap">
          <div className="calc-copy">
            <span className="eyebrow left">Three steps</span>
            <h2 className="h2">Check your <em>coverage</em></h2>
            <ol className="how">
              <li><b>1</b><span><strong>Choose the institution</strong> that holds the account.</span></li>
              <li><b>2</b><span><strong>Enter the balance</strong> in Birr, including interest. Convert foreign currency to Birr first.</span></li>
              <li><b>3</b><span><strong>Add every account</strong>, including several at the same institution.</span></li>
            </ol>
            <p className="source">Nothing you enter leaves your device.</p>
          </div>
          <Calculator />
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Worked examples" title="How the limit" em="is applied" lead="The same rules the calculator uses, applied to three common situations." />
          <div className="ycards">
            {examples.map((e) => (
              <div className="ycard" key={e.t}>
                <h3>{e.t}</h3>
                <ul>{e.rows.map(([l, v]) => <li key={l}><span>{l}</span><b className="num">Birr {f(v)}</b></li>)}</ul>
                <div className="yres">
                  <div><span>Protected</span><b className="num">Birr {f(e.prot)}</b></div>
                  <div className={e.over ? 'warn' : ''}><span>Not protected</span><b className="num">Birr {f(e.over)}</b></div>
                </div>
                <p>{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Questions" title="About the" em="limit" />
          <FaqList items={faqs.filter((q) => ['How much is protected?', 'Why is the limit Birr 100,000?', 'What about foreign currency accounts?', 'Which deposits are not covered?'].includes(q.q))} />
        </div>
      </section>
    </>
  )
}

export function Payout() {
  const { faqs } = useCms()
  const tl = [
    { k: 'Day 0', t: 'A receiver is appointed', d: 'When the National Bank of Ethiopia revokes the licence of a failed member, it appoints a receiver to take control of the institution.' },
    { k: 'Within 14 days', t: 'Depositor records reach the Fund', d: 'The receiver submits the list of insured depositors, with supporting documents, within 14 days of being appointed.' },
    { k: 'Within the next 14 days', t: 'The start date is announced', d: 'The Fund announces when repayment will begin, within 14 days of receiving the records.' },
    { k: 'From the start date', t: 'Payment through a pay-agent bank', d: 'Repayment is made through a pay-agent bank the Fund has appointed and agreed with in advance, before any failure happens.' },
    { k: 'By day 90', t: 'Repayment is completed', d: 'Repayment should end within 90 days of the day the licence was revoked.' },
    { k: 'Up to five years', t: 'Late claims', d: 'Depositors who miss the 90 days can still claim their insured deposit within five years by presenting a justifiable reason.' },
  ]
  return (
    <>
      <PageHero eyebrow="Deposit payout" title="If an institution fails" tagline="this is what happens."
        lead="The timetable is set by Article 27 of Council of Ministers Regulation No. 482/2021. The Fund aims to start repaying insured depositors within 28 days and finish within 90."
        image="nbe.jpg" crumbs={crumbs} pos="50% 60%" />
      <SubNav label="Deposit protection" items={protectionNav} />

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="At a glance" title="Four stages," em="ninety days" />
          <Steps more={false} />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="lede sticky">
            <span className="eyebrow left">Step by step</span>
            <h2 className="h2">The payout <em>in detail</em></h2>
            <p className="lead">Every stage has a deadline in law, so depositors know when to expect their money.</p>
            <div className="callout"><Bank /><p><strong>Where you are paid.</strong> The pay-agent bank is chosen for its wide branch network across Ethiopia, its strong financial position and its administrative capacity.</p></div>
          </div>
          <ol className="timeline">
            {tl.map((s, i) => (
              <li className="tl-item" key={s.t}>
                <span className="tl-dot">{i + 1}</span>
                <span className="k">{s.k}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section band" id="recovery">
        <Curves variant="c" />
        <div className="container band-inner">
          <div>
            <span className="eyebrow left light">After the payout</span>
            <h2 className="h2 light">Recovering the money paid out</h2>
          </div>
          <div className="band-copy">
            <p>The Fund is entitled by law to recover everything it pays to insured depositors.</p>
            <p>When the failed institution is liquidated, the Fund takes the depositors’ place in the priority schedule and recovers up to the amount it has paid. Recovered money returns to the Fund, ready to protect depositors again.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Questions" title="About" em="payouts" />
          <FaqList items={cat(faqs, 'Payout', 5)} />
        </div>
      </section>

      <NextLinks items={[
        { to: '/deposit-protection/coverage', k: 'Coverage', t: 'What’s covered', d: 'The accounts that are protected and the 11 exclusions.' },
        { to: '/deposit-protection/calculator', k: 'Calculator', t: 'Check your coverage', d: 'See how much of your money is protected.' },
        { to: '/contact', k: 'Contact', t: 'Talk to the Fund', d: 'Call or write to us with your question.' },
      ]} />
    </>
  )
}
