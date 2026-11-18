import { benefits, boardSeats, functions, objectives, sources, strategicObjectives, themes, uses, values, yearStats } from '../src/site/data/content'

export async function build({ L, up, S, crumb }: any) {
  const stat = (s: any) => ({ prefix: s.pre || '', value: s.v, label: s.k, text: s.d })
  const hero = (o: any) => ({ blockType: 'pageHero', subnav: 'about', ...o })
  const next = (items: any[]) => ({ blockType: 'nextLinks', items: items.map(([url, kicker, title, text]) => ({ url, kicker, title, text })) })
  return {
    '/about': { title: 'About EDIF', layout: async () => [
      hero({ eyebrow: 'About EDIF', title: 'Ethiopia’s safety net', tagline: 'for every depositor.', lead: 'The Ethiopian Deposit Insurance Fund was established under Council of Ministers Regulation No. 482/2021 and began operating in April 2023. It is accountable to the National Bank of Ethiopia and reports to Parliament.', image: await up('stage.jpg') }),
      S('default', {}, [{ blockType: 'splitText', image: await up('hall.jpg', 'Participants at EDIF’s awareness and dialogue conference'), eyebrow: 'Why deposit insurance', title: 'Confidence keeps', em: 'banks steady',
        paragraphs: L(['A stable financial system allocates resources efficiently, manages risk and supports sustainable growth. It depends on a financial safety net: prudential regulation and supervision, resolution, a lender of last resort, and deposit insurance.', 'Deposit insurance is the most widely recognised part of that net. By guaranteeing that small depositors will be repaid, it removes the reason for a bank run and sustains public confidence in the financial system.']), bullets: L(objectives) }]),
      S('default', {}, [{ blockType: 'visionMission', items: [
        { eyebrow: 'Vision', big: 'To be a reliable and trusted Deposit Insurance Fund.' },
        { eyebrow: 'Mission', text: 'Contributing to financial system stability by protecting depositors through:', bullets: L(['Assessing and collecting premiums', 'Investing and managing the Fund’s resources', 'Reimbursing insured depositors']) },
        { eyebrow: 'Values', bullets: L(values) }] }], { flush: true }),
      S('ice', { eyebrow: 'Benefits', title: 'What deposit insurance', em: 'does for Ethiopia' }, [{ blockType: 'pcards', numbered: true, items: benefits.map((b) => ({ title: b.t, text: b.d })) }]),
      S('default', {}, [{ blockType: 'numberedList', variant: 'fns', eyebrow: 'Functions', title: 'What the Fund', em: 'does', lead: 'Eleven functions set out in Regulation No. 482/2021, from setting premiums to taking legal action against those responsible for a failure.', items: L(functions) }]),
      S('ice', { eyebrow: '2024/25 in numbers', title: 'A year of', em: 'growth', lead: 'As at June 30, 2025. Source: EDIF Annual Report 2024/25.' }, [{ blockType: 'statGrid', columns: '6', items: yearStats.map(stat), buttons: [{ label: 'Read the annual report', url: '/publications', style: 'navy' }] }]),
      next([['/about/governance', 'Governance', 'Board and management', 'Who oversees and runs the Fund.'], ['/about/organization', 'Organisation', 'How the Fund is structured', 'Directorates, teams and reporting lines.'], ['/about/strategy', 'Strategy', 'Strategy and finances', 'Objectives, where the money comes from and how it is used.']]),
    ] },
    '/about/governance': { title: 'Governance', layout: async () => [
      hero({ eyebrow: 'Governance', title: 'Independent,', tagline: 'and accountable.', lead: 'The Fund operates autonomously but is accountable to the National Bank of Ethiopia, given its role in supporting the Bank’s mandate. Its governing bodies are defined in Regulation No. 482/2021.', image: await up('chair.jpg'), pos: '50% 25%', ...crumb }),
      S('default', {}, [{ blockType: 'numberedList', variant: 'chain', eyebrow: 'Framework', title: 'How the Fund', em: 'is governed', lead: 'The governance framework is designed to ensure operational independence, prudent management of resources, transparency and accountability.', text: 'The Internal Audit Unit reports functionally to the Board of Directors and administratively to the Chief Executive Officer. It audits the Fund periodically for efficiency, the reliability of its information, and compliance with its policies and the law. Risk management is built into decision-making at every level.', items: L(['Board of Directors', 'Chief Executive Officer', 'Deputy Chief Executive Officer', 'Management and staff']) }]),
      S('ice', { eyebrow: 'Board of Directors', title: 'Five members,', em: 'regulators and industry', lead: 'The Board brings together the National Bank of Ethiopia and the associations of banks and microfinance institutions.' }, [{ blockType: 'board', group: 'board', seatsTitle: 'Seats on the Board', seats: L(boardSeats), note: 'Board composition as listed in the EDIF Annual Report 2024/25.' }]),
      S('default', { eyebrow: 'Management', title: 'Leading', em: 'the Fund' }, [{ blockType: 'profiles', group: 'management' }]),
      next([['/about/organization', 'Organisation', 'How the Fund is structured', 'Directorates, teams and reporting lines.'], ['/publications', 'Laws', 'Laws and directives', 'The Regulation and directives the Fund works under.'], ['/news', 'News', 'Latest from the Fund', 'Events, results and announcements.']]),
    ] },
    '/about/organization': { title: 'Organisation', layout: async () => [
      hero({ eyebrow: 'Organisation', title: 'A small team', tagline: 'with a national mandate.', lead: 'The Fund is organised into two directorates under the Chief Executive Officer and Deputy, with an Internal Audit Unit reporting to the Board.', image: await up('teamL.jpg'), pos: '50% 35%', ...crumb }),
      S('default', { eyebrow: 'Structure', title: 'Organisational', em: 'structure' }, [{ blockType: 'orgChart', board: 'Board of Directors', side: 'Internal Audit Unit', chain: L(['Chief Executive Officer', 'Deputy Chief Executive Officer']), branches: [
        { directorate: 'Operational Directorate', teams: L(['Policy and Examination Team', 'Fund Management and Deposit Payout Team']) },
        { directorate: 'Finance and Administration Directorate', teams: L(['Administration Team', 'Finance Team']) }] }]),
      S('ice', { eyebrow: 'What each part does', title: 'Directorates', em: 'and teams' }, [{ blockType: 'iCards', items: [
        { title: 'Operational Directorate', text: 'Home to the Policy and Examination Team and the Fund Management and Deposit Payout Team: the Fund’s core deposit insurance work.' },
        { title: 'Finance and Administration', text: 'Runs the Fund’s finances and administration through its Finance Team and Administration Team.' },
        { title: 'Internal Audit Unit', text: 'Independent assurance on operations, information and compliance, reporting functionally to the Board.' }] }]),
      S('default', {}, [{ blockType: 'splitText', image: await up('teamL.jpg', 'EDIF staff'), eyebrow: 'Our people', title: 'Building', em: 'capacity', paragraphs: L(['In 2024/25 the Fund recruited new staff, ran IFRS training for all employees and specialised courses for selected staff, and took part in international knowledge-sharing, including the IADI Africa Regional Committee conference in Uganda.', 'It has also prepared terms of reference to automate an integrated deposit insurance system, its internal processes through ERP, and an organisation and compensation review.']) }]),
      next([['/about/governance', 'Governance', 'Board and management', 'Who oversees and runs the Fund.'], ['/about/strategy', 'Strategy', 'Strategy and finances', 'Objectives, funding and how the money is used.'], ['/contact', 'Contact', 'Get in touch', 'Address, telephone and email.']]),
    ] },
    '/about/strategy': { title: 'Strategy and finances', layout: async () => [
      hero({ eyebrow: 'Strategy and finances', title: 'Funded by the industry,', tagline: 'invested for depositors.', lead: 'Member institutions pay premiums into the Fund. The Fund invests them, mainly in Government Treasury Bills, so that money is ready if a member ever fails.', image: await up('nbe.jpg'), pos: '50% 60%', ...crumb }),
      S('default', { eyebrow: 'Strategic themes', title: 'Three themes,', em: 'eight objectives' }, [{ blockType: 'iCards', darkMiddle: true, numbered: true, items: themes.map((t) => ({ title: t.t, text: t.d })) }, { blockType: 'numberedList', variant: 'grid', items: L(strategicObjectives) }]),
      S('ice', { eyebrow: 'Financial sources', title: 'Where the money', em: 'comes from' }, [{ blockType: 'pcards', items: sources.map((s) => ({ kicker: s.k, title: s.t, text: s.d })) }]),
      S('default', {}, [{ blockType: 'numberedList', variant: 'uses', eyebrow: 'Use of resources', title: 'How the money', em: 'is used', lead: 'The Regulation limits what the Fund may spend its resources on.', items: L(uses) }]),
      S('ice', { eyebrow: '2024/25', title: 'The Fund’s', em: 'position', lead: 'As at June 30, 2025. Source: EDIF Annual Report 2024/25.' }, [{ blockType: 'statGrid', columns: '4', items: yearStats.slice(0, 4).map(stat) }]),
      next([['/publications', 'Publications', 'Annual report', 'Audited accounts and the year’s results.'], ['/members', 'Members', 'Who pays premiums', 'The 93 banks and microfinance institutions.'], ['/about/governance', 'Governance', 'Board and management', 'Who oversees the Fund.']]),
    ] },
  }
}
