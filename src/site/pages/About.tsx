'use client'
import { Link } from '../router'
import { Arrow, Curves, NextLinks, PageHero, SecHead, SubNav, aboutNav } from '../components/ui'
import { benefits, board, boardSeats, functions, img, management, objectives, sources, strategicObjectives, themes, uses, values, yearStats } from '../data/content'

const crumbs = [{ to: '/about', label: 'About' }]

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About EDIF" title="Ethiopia’s safety net" tagline="for every depositor."
        lead="The Ethiopian Deposit Insurance Fund was established under Council of Ministers Regulation No. 482/2021 and began operating in April 2023. It is accountable to the National Bank of Ethiopia and reports to Parliament."
        image="stage.jpg" />
      <SubNav label="About" items={aboutNav} />

      <section className="section">
        <div className="container about">
          <div><div className="photo"><img src={img('hall.jpg')} alt="Participants at EDIF’s awareness and dialogue conference" /></div></div>
          <div className="about-copy">
            <span className="eyebrow left">Why deposit insurance</span>
            <h2 className="h2">Confidence keeps <em>banks steady</em></h2>
            <p>A stable financial system allocates resources efficiently, manages risk and supports sustainable growth. It depends on a financial safety net: prudential regulation and supervision, resolution, a lender of last resort, and deposit insurance.</p>
            <p>Deposit insurance is the most widely recognised part of that net. By guaranteeing that small depositors will be repaid, it removes the reason for a bank run and sustains public confidence in the financial system.</p>
            <ul className="objs">
              {objectives.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section vmv-sec">
        <div className="container vmv">
          <div className="vm">
            <Curves />
            <span className="eyebrow left light">Vision</span>
            <p className="big">To be a reliable and trusted Deposit Insurance Fund.</p>
          </div>
          <div className="vm">
            <span className="eyebrow left light">Mission</span>
            <p>Contributing to financial system stability by protecting depositors through:</p>
            <ul><li>Assessing and collecting premiums</li><li>Investing and managing the Fund’s resources</li><li>Reimbursing insured depositors</li></ul>
          </div>
          <div className="vm values">
            <span className="eyebrow left light">Values</span>
            <ul>{values.map((v) => <li key={v}>{v}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Benefits" title="What deposit insurance" em="does for Ethiopia" />
          <div className="pcards">
            {benefits.map((b, i) => (
              <div className="pcard" key={b.t}><span className="n num">{String(i + 1).padStart(2, '0')}</span><h3>{b.t}</h3><p>{b.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="lede sticky">
            <span className="eyebrow left">Functions</span>
            <h2 className="h2">What the Fund <em>does</em></h2>
            <p className="lead">Eleven functions set out in Regulation No. 482/2021, from setting premiums to taking legal action against those responsible for a failure.</p>
          </div>
          <ol className="fns">
            {functions.map((f, i) => <li className="fn" key={f}><b className="num">{String(i + 1).padStart(2, '0')}</b><span>{f}</span></li>)}
          </ol>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="2024/25 in numbers" title="A year of" em="growth" lead="As at June 30, 2025. Source: EDIF Annual Report 2024/25." />
          <div className="stats six">
            {yearStats.map((s) => (
              <div className="stat" key={s.k}><b className="num">{s.pre && <small>{s.pre}</small>}{s.v}</b><span>{s.k}</span><p>{s.d}</p></div>
            ))}
          </div>
          <div className="faq-more"><Link className="btn btn--navy" to="/publications">Read the annual report <Arrow /></Link></div>
        </div>
      </section>

      <NextLinks items={[
        { to: '/about/governance', k: 'Governance', t: 'Board and management', d: 'Who oversees and runs the Fund.' },
        { to: '/about/organization', k: 'Organisation', t: 'How the Fund is structured', d: 'Directorates, teams and reporting lines.' },
        { to: '/about/strategy', k: 'Strategy', t: 'Strategy and finances', d: 'Objectives, where the money comes from and how it is used.' },
      ]} />
    </>
  )
}

export function Governance() {
  return (
    <>
      <PageHero eyebrow="Governance" title="Independent," tagline="and accountable."
        lead="The Fund operates autonomously but is accountable to the National Bank of Ethiopia, given its role in supporting the Bank’s mandate. Its governing bodies are defined in Regulation No. 482/2021."
        image="chair.jpg" pos="50% 25%" crumbs={crumbs} />
      <SubNav label="About" items={aboutNav} />

      <section className="section">
        <div className="container split">
          <div className="lede">
            <span className="eyebrow left">Framework</span>
            <h2 className="h2">How the Fund <em>is governed</em></h2>
            <p className="lead">The governance framework is designed to ensure operational independence, prudent management of resources, transparency and accountability.</p>
            <p>The Internal Audit Unit reports functionally to the Board of Directors and administratively to the Chief Executive Officer. It audits the Fund periodically for efficiency, the reliability of its information, and compliance with its policies and the law. Risk management is built into decision-making at every level.</p>
          </div>
          <ol className="gov-chain">
            {['Board of Directors', 'Chief Executive Officer', 'Deputy Chief Executive Officer', 'Management and staff'].map((g, i) => (
              <li key={g}><b className="num">{i + 1}</b><span>{g}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Board of Directors" title="Five members," em="regulators and industry" lead="The Board brings together the National Bank of Ethiopia and the associations of banks and microfinance institutions." />
          <div className="board">
            <div className="mcard-hero">
              <div className="pimg"><img src={img(board[0].photo!)} alt={board[0].name} /></div>
              <div>
                <span className="k">{board[0].role}</span>
                <h3>{board[0].name}</h3>
                <p>{board[0].org}</p>
              </div>
            </div>
            <ul className="members-list">
              {board.slice(1).map((b) => (
                <li key={b.name}><span className="initials">{b.name.replace('Ato ', '').split(' ').map((w) => w[0]).join('')}</span><div><strong>{b.name}</strong><span>{b.role}</span></div></li>
              ))}
            </ul>
          </div>
          <div className="board-seats">
            <h3>Seats on the Board</h3>
            <ul>{boardSeats.map((s) => <li key={s}>{s}</li>)}</ul>
            <p className="source">Board composition as listed in the EDIF Annual Report 2024/25.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Management" title="Leading" em="the Fund" />
          <div className="people">
            {management.map((m) => (
              <article className="person" key={m.name}>
                <div className="pimg"><img src={img(m.photo)} alt={m.name} /></div>
                <div className="pbody">
                  <span className="k">{m.role}</span>
                  <h3>{m.name}</h3>
                  <p>{m.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <NextLinks items={[
        { to: '/about/organization', k: 'Organisation', t: 'How the Fund is structured', d: 'Directorates, teams and reporting lines.' },
        { to: '/publications', k: 'Laws', t: 'Laws and directives', d: 'The Regulation and directives the Fund works under.' },
        { to: '/news', k: 'News', t: 'Latest from the Fund', d: 'Events, results and announcements.' },
      ]} />
    </>
  )
}

export function Organization() {
  return (
    <>
      <PageHero eyebrow="Organisation" title="A small team" tagline="with a national mandate."
        lead="The Fund is organised into two directorates under the Chief Executive Officer and Deputy, with an Internal Audit Unit reporting to the Board."
        image="teamL.jpg" pos="50% 35%" crumbs={crumbs} />
      <SubNav label="About" items={aboutNav} />

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Structure" title="Organisational" em="structure" />
          <div className="org" role="img" aria-label="Organisation chart: Board of Directors, with Internal Audit Unit; CEO; Deputy CEO; Operational Directorate with Policy and Examination Team and Fund Management and Deposit Payout Team; Finance and Administration Directorate with Administration Team and Finance Team.">
            <div className="org-row top">
              <div className="node lead">Board of Directors</div>
              <div className="node side">Internal Audit Unit</div>
            </div>
            <div className="org-line" />
            <div className="node lead">Chief Executive Officer</div>
            <div className="org-line" />
            <div className="node">Deputy Chief Executive Officer</div>
            <div className="org-line" />
            <div className="org-split">
              <div className="branch">
                <div className="node dir">Operational Directorate</div>
                <div className="teams"><div className="node team">Policy and Examination Team</div><div className="node team">Fund Management and Deposit Payout Team</div></div>
              </div>
              <div className="branch">
                <div className="node dir">Finance and Administration Directorate</div>
                <div className="teams"><div className="node team">Administration Team</div><div className="node team">Finance Team</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="What each part does" title="Directorates" em="and teams" />
          <div className="icards">
            <div className="icard"><h3>Operational Directorate</h3><p>Home to the Policy and Examination Team and the Fund Management and Deposit Payout Team: the Fund’s core deposit insurance work.</p></div>
            <div className="icard"><h3>Finance and Administration</h3><p>Runs the Fund’s finances and administration through its Finance Team and Administration Team.</p></div>
            <div className="icard"><h3>Internal Audit Unit</h3><p>Independent assurance on operations, information and compliance, reporting functionally to the Board.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about">
          <div><div className="photo"><img src={img('teamL.jpg')} alt="EDIF staff" /></div></div>
          <div className="about-copy">
            <span className="eyebrow left">Our people</span>
            <h2 className="h2">Building <em>capacity</em></h2>
            <p>In 2024/25 the Fund recruited new staff, ran IFRS training for all employees and specialised courses for selected staff, and took part in international knowledge-sharing, including the IADI Africa Regional Committee conference in Uganda.</p>
            <p>It has also prepared terms of reference to automate an integrated deposit insurance system, its internal processes through ERP, and an organisation and compensation review.</p>
          </div>
        </div>
      </section>

      <NextLinks items={[
        { to: '/about/governance', k: 'Governance', t: 'Board and management', d: 'Who oversees and runs the Fund.' },
        { to: '/about/strategy', k: 'Strategy', t: 'Strategy and finances', d: 'Objectives, funding and how the money is used.' },
        { to: '/contact', k: 'Contact', t: 'Get in touch', d: 'Address, telephone and email.' },
      ]} />
    </>
  )
}

export function Strategy() {
  return (
    <>
      <PageHero eyebrow="Strategy and finances" title="Funded by the industry," tagline="invested for depositors."
        lead="Member institutions pay premiums into the Fund. The Fund invests them, mainly in Government Treasury Bills, so that money is ready if a member ever fails."
        image="nbe.jpg" pos="50% 60%" crumbs={crumbs} />
      <SubNav label="About" items={aboutNav} />

      <section className="section">
        <div className="container">
          <SecHead eyebrow="Strategic themes" title="Three themes," em="eight objectives" />
          <div className="icards">
            {themes.map((t, i) => (
              <div className={'icard' + (i === 1 ? ' feature-dark' : '')} key={t.t}>
                {i === 1 && <Curves />}
                <span className="ic num">{i + 1}</span><h3>{t.t}</h3><p>{t.d}</p>
              </div>
            ))}
          </div>
          <ol className="objgrid">
            {strategicObjectives.map((o, i) => <li key={o}><b className="num">{String(i + 1).padStart(2, '0')}</b>{o}</li>)}
          </ol>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Financial sources" title="Where the money" em="comes from" />
          <div className="pcards">
            {sources.map((s) => (
              <div className="pcard" key={s.k}><span className="k">{s.k}</span><h3>{s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="lede">
            <span className="eyebrow left">Use of resources</span>
            <h2 className="h2">How the money <em>is used</em></h2>
            <p className="lead">The Regulation limits what the Fund may spend its resources on.</p>
          </div>
          <ul className="uses">{uses.map((u) => <li key={u}>{u}</li>)}</ul>
        </div>
      </section>

      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="2024/25" title="The Fund’s" em="position" lead="As at June 30, 2025. Source: EDIF Annual Report 2024/25." />
          <div className="stats six four">
            {yearStats.slice(0, 4).map((s) => (
              <div className="stat" key={s.k}><b className="num">{s.pre && <small>{s.pre}</small>}{s.v}</b><span>{s.k}</span><p>{s.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <NextLinks items={[
        { to: '/publications', k: 'Publications', t: 'Annual report', d: 'Audited accounts and the year’s results.' },
        { to: '/members', k: 'Members', t: 'Who pays premiums', d: 'The 93 banks and microfinance institutions.' },
        { to: '/about/governance', k: 'Governance', t: 'Board and management', d: 'Who oversees the Fund.' },
      ]} />
    </>
  )
}
