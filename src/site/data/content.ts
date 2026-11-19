const BASE = '/'
export const img = (name: string) => (/^(\/|https?:)/.test(name) ? name : `${BASE}images/${name}`)

export const LIMIT = 100000

export const tel = (p: string) => 'tel:' + p.replace(/\s/g, '')

export const covered = [
  'Current and checking accounts',
  'Savings accounts',
  'Time deposits',
  'Joint accounts',
  'Trust accounts',
  'Foreign currency deposits, converted to Birr',
  'Voluntary savings accounts',
  'Compulsory savings accounts',
]

export const coveredDetail: { t: string; d: string }[] = [
  { t: 'Current and checking accounts', d: 'Demand deposits you can draw on at any time.' },
  { t: 'Savings accounts', d: 'Ordinary savings, with interest earned up to the day of failure.' },
  { t: 'Time deposits', d: 'Fixed-term deposits, including interest accrued so far.' },
  { t: 'Joint accounts', d: 'Accounts held in two or more names.' },
  { t: 'Trust accounts', d: 'Money held in trust on behalf of someone else.' },
  { t: 'Foreign currency deposits', d: 'Converted to Birr at the buying exchange rate.' },
  { t: 'Voluntary savings', d: 'A savings product common at microfinance institutions.' },
  { t: 'Compulsory savings', d: 'Also covered, as listed in Regulation No. 482/2021.' },
]

export const mainExclusions = [
  { t: 'Deposits held as collateral for a loan', d: 'Money the institution holds as security for your own loan.' },
  { t: 'Deposits frozen by a court', d: 'Money held under a court freezing order.' },
  { t: 'Institutional money', d: 'Deposits of banks, MFIs, insurers, capital lease companies and the Federal Government.' },
  { t: 'Insiders of the failed institution', d: 'Its directors, senior executives, influential shareholders and their close family.' },
]

export const exclusions = [
  'Deposits of an insurance company',
  'Deposits of a capital lease company',
  'Deposits of a commercial bank held in another bank or microfinance institution',
  'Deposits of a microfinance institution held in another bank or microfinance institution',
  'Money of the Federal Government or any Federal Government agency',
  'Deposits of the institution’s external auditor and the auditor’s partner',
  'Deposits frozen by a court decision',
  'Deposits serving as collateral for a loan',
  'Deposits of influential shareholders, directors, the CEO and senior executive officers, their first-degree relatives, and legal entities in which they hold more than 10% of the voting rights',
  'Deposits of a person the Fund believes profited from the institution’s failure',
  'Other deposits the Fund may specify from time to time',
]

export const payoutSteps = [
  { day: 'Day 0', t: 'The licence is revoked', d: 'The National Bank of Ethiopia closes the institution and appoints a receiver.' },
  { day: 'Within 14 days', t: 'Records reach the Fund', d: 'The receiver sends the list of insured depositors and their balances.' },
  { day: 'Next 14 days', t: 'The payout is announced', d: 'EDIF publishes when repayment starts and which pay-agent bank will make it.' },
  { day: 'Up to day 90', t: 'You collect your money', d: 'Go to a branch of the pay-agent bank to receive your insured deposit.' },
]

export type Faq = { q: string; a: string; cat: 'Protection' | 'Payout' | 'The Fund'; home?: boolean }
export const benefits = [
  { t: 'Financial stability', d: 'Depositors who know their money is safe have no reason to run on a bank, so one failure does not spread to others.' },
  { t: 'Consumer protection', d: 'Small depositors, who cannot easily judge a bank’s health, are shielded from losing their savings.' },
  { t: 'Taxpayers’ money protected', d: 'Banks and MFIs pay premiums to fund repayments, instead of the Government paying from the public purse.' },
  { t: 'Fair competition', d: 'Depositors are protected equally at every member, so small banks are not at a disadvantage against large or state-owned ones.' },
  { t: 'Financial inclusion', d: 'Confidence in banks and MFIs encourages more people to save with them.' },
]

export const objectives = [
  'Protect small depositors who find it hard to obtain and analyse information about the financial condition of banks and microfinance institutions.',
  'Contribute to financial stability by preventing depositor panic and bank runs.',
  'Reduce the Government’s financial obligation and protect taxpayers’ money when a deposit-taking institution fails.',
]

export const functions = [
  'Set the initial and annual premiums members contribute',
  'Collect premiums and deposit them in the Fund’s account',
  'Invest and manage the Fund’s resources',
  'Assess claims and pay eligible depositors up to the insured amount',
  'Recover payouts from the liquidation of a failed member',
  'Issue the directives the Fund needs to operate',
  'Raise public awareness of deposit insurance',
  'Collect information from members and prepare periodic reports',
  'Work with local and international stakeholders',
  'Borrow from the Government and other sources if funds fall short',
  'Take legal action against parties at fault in a member’s failure',
]

export const values = ['Integrity', 'Competence', 'Teamwork', 'Accountability', 'Transparency', 'Confidentiality', 'Adaptability', 'Dynamism']

export const themes = [
  { t: 'Enhance stakeholders’ confidence', d: 'Earn the trust of depositors, members, the National Bank and the public.' },
  { t: 'Protect depositors', d: 'Be ready to repay insured depositors quickly and accurately.' },
  { t: 'Build organisational capacity', d: 'Develop the people, systems and processes the Fund needs.' },
]

export const strategicObjectives = [
  'Improve depositors’ confidence',
  'Improve stakeholders’ satisfaction',
  'Enhance financial performance',
  'Enhance operational efficiency and effectiveness',
  'Increase public awareness',
  'Promote good corporate governance and controls',
  'Improve automation of business processes',
  'Improve board and staff knowledge and skills',
]

export const sources = [
  { k: 'Government', t: 'Birr 200 million initial capital', d: 'Birr 140 million released by June 30, 2025; the remaining Birr 60 million is expected in due course.' },
  { k: 'Initial premium', t: '0.04% of deposits', d: 'One-off contribution from members, based on their total deposits in March 2023.' },
  { k: 'Annual premium', t: '0.3% of average deposits', d: 'Paid every year by each member bank and microfinance institution.' },
  { k: 'Investments', t: 'Investment income', d: 'Mainly from Government Treasury Bills, plus Mudarabah deposits for interest-free premiums.' },
  { k: 'Recoveries', t: 'Asset recovery', d: 'Money recovered from the liquidation of a failed member after a payout.' },
  { k: 'Backstop', t: 'Borrowing', d: 'The Fund may borrow from the Government and other sources if it runs short.' },
]

export const uses = [
  'Reimbursing insured depositors of a failed member',
  'Investing in Government securities, Government-guaranteed securities and other securities approved by the Board',
  'Capital expenditure and running costs',
  'Servicing any loans the Fund has taken',
]

export const yearStats = [
  { v: '15.17bn', pre: 'Birr', k: 'Investment portfolio', d: 'Birr 13.9bn in Treasury Bills and Birr 1.27bn in Mudarabah deposits.' },
  { v: '7.34bn', pre: 'Birr', k: 'Premiums in 2024/25', d: 'Birr 6.48bn conventional, Birr 650m interest-free and Birr 212m initial premiums.' },
  { v: '8.24bn', pre: 'Birr', k: 'Surplus for the year', d: 'Added to the Fund’s reserves.' },
  { v: '1.14bn', pre: 'Birr', k: 'Investment income', d: 'Earned on the Fund’s portfolio during the year.' },
  { v: '176m', pre: '', k: 'Depositors at members', d: 'Up 9.3% on the year before.' },
  { v: '3.55tn', pre: 'Birr', k: 'Deposits at members', d: 'Up 40.6% on the year before.' },
]

export const board = [
  { name: 'Ato Solomon Desta', role: 'Chairman', org: 'Vice Governor, Financial Institutions Supervision, National Bank of Ethiopia', photo: 'chair.jpg' },
  { name: 'Ato Frezer Ayalew', role: 'Member', org: '' },
  { name: 'Ato Sintayehu Desalegn', role: 'Member', org: '' },
  { name: 'Ato Teshome Kebede', role: 'Member', org: '' },
  { name: 'Ato Demessew Kassa', role: 'Member', org: '' },
]

export const boardSeats = [
  'Vice Governor for Financial Institutions Supervision, National Bank of Ethiopia (Chairman)',
  'Director, Banking Supervision Directorate, National Bank of Ethiopia',
  'Director, Microfinance Institutions Supervision Directorate, National Bank of Ethiopia',
  'Executive Director, Association of Ethiopian Microfinance Institutions',
  'Secretary General, Ethiopian Bankers Association',
]

export const management = [
  { name: 'Desalegn Ambaw (Ph.D.)', role: 'Chief Executive Officer', photo: 'ceo.jpg', bio: 'Dr Desalegn has served as a State Minister in several sectors of the Government and as Executive Director of the Institute of Foreign Affairs.' },
  { name: 'Ato Merga Wakweya', role: 'Director, Operations Directorate', photo: 'merga.jpg', bio: 'Ato Merga held several senior posts at the National Bank of Ethiopia, including Director of the Microfinance Institution Supervision Directorate, Advisor to the Vice Governor, and Principal Bank Examiner.' },
]

export type Doc = { kind: 'Report' | 'Law' | 'Regulation' | 'Directive' | 'Reporting'; title: string; desc: string; date?: string; url: string; featured?: boolean; sortKey?: string; stats?: { v: string; l: string }[] }
export const docKinds: Record<Doc['kind'], string> = { Report: 'Reports', Law: 'Laws', Regulation: 'Regulations', Directive: 'Directives', Reporting: 'Reporting' }

export type Contact = { email: string; phones: string[]; poBox: string; address: string[] }

/** Newest first by publication date. Add a document in the admin and it moves to the top. */
export const sortDocs = (docs: Doc[]) => [...docs].sort((a, b) => (b.sortKey || '').localeCompare(a.sortKey || ''))
export const latestDocs = (docs: Doc[], n: number) => sortDocs(docs).sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, n)
