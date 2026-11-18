export type Article = {
  slug: string
  date: string
  title: string
  short: string
  summary: string
  kind: 'Report' | 'Event' | 'Results' | 'Media' | 'Announcement'
  image?: string
  imageAlt?: string
  gallery?: { src: string; alt: string }[]
  body: (string | { h: string } | { list: string[] } | { quote: string; by: string })[]
  pdf?: string
  source: string
}

export const articles: Article[] = [
  {
    slug: 'annual-report-2024-25',
    date: '2026-05-07',
    kind: 'Report',
    title: 'EDIF Annual Report 2024/25',
    short: 'The 2024/25 Annual Report is out',
    summary: 'Premiums, investments, coverage and audited accounts for the year to June 30, 2025.',
    pdf: 'https://edif.gov.et/wp-content/uploads/2026/05/ANNUAL-REPORT-2024-25.pdf',
    source: 'https://edif.gov.et/2026/05/07/edif-annual-report-2024-26/',
    body: [
      'The Fund has published its Annual Report and audited financial statements for the fiscal year ending June 30, 2025. The report covers the Fund’s performance against its plan, its financial position, statistics on deposits at member institutions, and the full list of members.',
      { h: 'Highlights of the year' },
      { list: [
        'Annual plan implementation rate of 95.35%.',
        'Premiums of Birr 7.34 billion: Birr 6.48 billion from conventional deposits and Birr 650.26 million from interest-free deposits, and Birr 212.32 million in initial premiums.',
        'A surplus of Birr 8.24 billion for the year.',
        'Investments of Birr 15.17 billion: Birr 13.9 billion in Government Treasury Bills and Birr 1.27 billion in Mudarabah deposits.',
        'Investment income of Birr 1.14 billion.',
        '176 million depositors at member institutions, up 9.3%, holding Birr 3.55 trillion.',
      ] },
      'The report also sets out the Fund’s focus for the coming year: strengthening its reserves, expanding public awareness, automating its processes and payout system, and building specialised technical capacity.',
    ],
  },
  {
    slug: 'kenya-deposit-insurance-corporation-visit',
    date: '2026-01-30',
    kind: 'Event',
    title: 'EDIF team concludes experience-sharing visit to the Kenya Deposit Insurance Corporation',
    short: 'What our team learned from Kenya’s deposit insurer',
    summary: 'An exposure and experience-sharing visit to the Kenya Deposit Insurance Corporation in Nairobi.',
    image: 'kdic1.jpg',
    imageAlt: 'EDIF and KDIC teams in a working session in Nairobi',
    gallery: [
      { src: 'kdic2.jpg', alt: 'A participant during the sessions at KDIC in Nairobi' },
      { src: 'kdic3.jpg', alt: 'A participant at the experience-sharing sessions' },
    ],
    source: 'https://edif.gov.et/2026/01/30/the-ethiopian-deposit-insurance-fund-team-has-concluded-its-exposure-and-experience-visit-of-the-kenya-deposit-insurance-corporation-in-nairobi-kenya/',
    body: [
      'During the exposure and experience-sharing sessions at the Kenya Deposit Insurance Corporation (KDIC), the EDIF team gained practical insights from the Corporation. The visit concluded on January 22, 2026 at KDIC’s headquarters, in the presence of the Corporation’s Chief Executive Officer.',
      { quote: 'This wouldn’t be the last.', by: 'Hellen Chepkwony, CEO, Kenya Deposit Insurance Corporation' },
      'In her concluding remarks, Ms Chepkwony noted that although the team came to Kenya to learn, KDIC had also learned about Ethiopia. She invited the Fund to join the International Association of Deposit Insurers (IADI) and its Africa Regional Committee, saying membership would help the Fund with documentation and knowledge sharing.',
      'EDIF Board member and team leader Ato Teshome Kebede thanked KDIC for sharing its experience, reaffirmed that the relationship would continue, and said the question of membership would be tabled for discussion by the Board of Directors.',
      { h: 'Topics covered' },
      { list: ['Overview of deposit insurance', 'Governance structure', 'Investment strategy for a deposit insurance scheme', 'Risk management', 'Fund size and coverage', 'Premium assessment and collection', 'Crisis communication', 'The reimbursement process'] },
    ],
  },
  {
    slug: 'stakeholder-awareness-workshop-2025',
    date: '2025-07-16',
    kind: 'Event',
    title: 'EDIF hosts awareness workshop for key stakeholders',
    short: 'Banks, MFIs and partners meet the Fund',
    summary: 'A half-day workshop in Addis Ababa on international principles, the Fund’s legal framework and its results so far.',
    image: 'workshop.jpg',
    imageAlt: 'Representatives of banks and microfinance institutions at the July 2025 workshop',
    gallery: [
      { src: 'drdesalegn.jpg', alt: 'Dr Desalegn Ambaw, CEO of EDIF, speaking at the workshop' },
    ],
    source: 'https://edif.gov.et/2025/07/16/deposit-insurance-awareness-workshop-for-key-stakeholders/',
    body: [
      'The Ethiopian Deposit Insurance Fund hosted a half-day workshop on July 10, 2025 at the Skylight Hotel in Addis Ababa. Participants came from commercial banks, microfinance institutions and strategic partners including the Ministry of Finance and the National Bank of Ethiopia.',
      'The workshop set out to help participants understand international deposit insurance principles and best practice, the Fund’s legal framework, its operational and financial achievements, and its challenges and direction.',
      'Ato Solomon Desta, Board Chairman of the Fund and Vice Governor of the National Bank of Ethiopia, emphasised the role of deposit insurance in safeguarding depositors’ money, protecting taxpayers and contributing to financial stability. He outlined the Fund’s strategic priorities: automating the deposit payout process, strengthening its financial position, and raising public awareness.',
      'Dr Desalegn Ambaw, the Fund’s Chief Executive Officer, reported that total premiums of Birr 13.85 billion had been collected to date and that the investment portfolio had reached Birr 15.14 billion.',
      'Dr Julia Oyet, Chairperson of the IADI Africa Regional Committee and CEO of the Deposit Protection Fund of Uganda, presented international deposit insurance principles and the experience of African deposit insurers. Ato Merga Wakweya, Director of the Operations Directorate, then briefed participants on the Fund’s legal framework, strategic plan, results, challenges and direction.',
      'In a question-and-answer session participants raised areas where the Fund should improve. Closing the workshop, Ato Frezer Ayalew of the EDIF Board identified three priorities: building institutional capacity, moving to automated systems, and acting on participants’ feedback.',
    ],
  },
  {
    slug: 'premiums-first-nine-months-2024-25',
    date: '2025-04-15',
    kind: 'Results',
    title: 'Fund collects Birr 5.2 billion in premiums in the first nine months of 2024/25',
    short: 'Birr 5.2 billion in premiums in nine months',
    summary: 'Premium collection up 8.3% on the same period a year earlier, with investments reaching Birr 12.11 billion.',
    source: 'https://edif.gov.et/2025/04/15/https-edif-gov-et/',
    body: [
      'The Fund collected Birr 5.2 billion in premiums in the first nine months of the 2024/25 fiscal year, an increase of 8.3% on the same period the year before. The result strengthens the Fund’s capacity to protect depositors.',
      { h: 'Where premiums came from' },
      { list: ['Private banks: Birr 2.67 billion (51.3%)', 'Commercial Bank of Ethiopia: Birr 2.47 billion (47.5%)', 'Microfinance institutions: Birr 59.49 million (1.2%)', '91% from conventional deposits and 9% from interest-free deposits'] },
      { h: 'Investments' },
      'The investment portfolio grew to Birr 12.11 billion: Birr 11.17 billion in Government Treasury Bills and Birr 944.29 million in Mudarabah time deposits. Investment income for the period was Birr 689.45 million, and total income reached Birr 5.89 billion.',
      { quote: 'The Fund’s strong performance in both premium collection and investment management during the first nine months highlights our unwavering commitment to fulfilling our fundamental mandate.', by: 'Desalegn Ambaw (Ph.D.), CEO' },
      'The CEO thanked member institutions for paying their premiums promptly. The Fund also continued to strengthen its data management, staff development and capacity-building programmes.',
    ],
  },
  {
    slug: 'addis-gebeya-programme',
    date: '2025-05-21',
    kind: 'Media',
    title: 'EDIF discusses depositor protection on EBC’s Addis Gebeya programme',
    short: 'Talking deposit protection on national television',
    summary: 'Senior management explain the Fund’s role on the Ethiopian Broadcasting Corporation’s business programme.',
    source: 'https://edif.gov.et/2025/05/21/edif-discusses-depositor-protection-financial-stability-growth-on-ebcs-addis-gebya-program/',
    body: [
      'The Fund’s senior management team discussed its role in protecting depositors, supporting financial stability and contributing to economic growth on Addis Gebeya, the business programme of the Ethiopian Broadcasting Corporation.',
      'Dr Desalegn Ambaw, CEO, and Ato Merga Wakweya, Director of the Operations Directorate, explained how deposit insurance works and what it means for ordinary savers. The Fund has also appeared on NBC’s weekly business programme and on EBS Television as part of its public awareness work.',
    ],
  },
  {
    slug: 'new-website-launch',
    date: '2024-08-19',
    kind: 'Announcement',
    title: 'EDIF launches its website to boost public awareness',
    short: 'A message from the CEO on our new website',
    summary: 'A new channel for information on deposit insurance, the Fund’s progress and its members.',
    image: 'ceo.jpg',
    imageAlt: 'Dr Desalegn Ambaw, Chief Executive Officer of EDIF',
    source: 'https://edif.gov.et/2024/08/19/edif-launches-new-website-to-boost-public-awareness/',
    body: [
      'It gives me great pleasure to welcome you to our website, one of our digital channels for sharing public information.',
      'The Ethiopian Deposit Insurance Fund was established under Council of Ministers Regulation No. 482/2021 and is accountable to the National Bank of Ethiopia. Its role is to contribute to financial system stability by protecting depositors if a bank or microfinance institution fails to meet its obligations to them.',
      'We will use this website to share important information about the country’s deposit insurance system, including its benefits and limitations, the Fund’s progress, its member institutions and its publications. We do not want it to be one-way: please use the contact page to send us feedback, comments and suggestions. I also ask member institutions to link to this website from their own, so that information reaches the public.',
      { quote: 'Thank you.', by: 'Dr Desalegn Ambaw, CEO' },
    ],
  },
  {
    slug: 'awareness-and-dialogue-conference-2024',
    date: '2024-07-24',
    kind: 'Event',
    title: 'EDIF holds awareness and dialogue conference',
    short: 'Awareness and dialogue conference',
    summary: 'The Fund sets out its mandate and coverage at a conference at the Skylight Hotel.',
    image: 'hall.jpg',
    imageAlt: 'Participants at EDIF’s awareness and dialogue conference',
    gallery: [{ src: 'stage.jpg', alt: 'Panel on stage at the conference' }],
    source: 'https://edif.gov.et/2024/07/24/edif-holds-awareness-dialogue-conference/',
    body: [
      'On March 22, 2024 the Fund held an awareness and dialogue conference at the Skylight Hotel. Ato Solomon Desta, Vice Governor of the National Bank of Ethiopia and Board Chairman of the Fund, set out the Fund’s founding objectives and progress, including the systematic collection of premiums from members and the prudent investment of those funds.',
      'Dr Desalegn Ambaw, the Fund’s CEO, explained how the Fund protects depositors and which accounts it covers, including current, savings, time, joint and trust accounts, up to Birr 100,000 for each depositor at each institution.',
      'At the time, 80 institutions — 31 banks and 49 microfinance institutions — were members, and by December 2023 they had contributed Birr 2.8 billion in annual premiums.',
    ],
  },
  {
    slug: 'stakeholders-consultation-meeting-2024',
    date: '2024-07-24',
    kind: 'Event',
    title: 'EDIF holds stakeholders’ consultation meeting',
    short: 'Members review the Fund’s first full year',
    summary: 'Member banks and MFIs review the Fund’s 2023/24 results and plans at the National Bank of Ethiopia.',
    image: 'nbe.jpg',
    imageAlt: 'National Bank of Ethiopia headquarters, Addis Ababa',
    source: 'https://edif.gov.et/2024/07/24/edif-conducted-stakeholders-consultation-meeting/',
    body: [
      'On July 5, 2024 the Fund held a stakeholders’ consultation meeting for the 2023/24 fiscal year at the National Bank of Ethiopia. Representatives of member banks and microfinance institutions attended, along with a representative of the National Bank.',
      'CEO Dr Desalegn Ambaw said the meeting aimed to update members on the year’s performance and next year’s plan, hear their feedback, and build a strong working partnership between the Fund and its members.',
      { h: 'What the Fund achieved in 2023/24' },
      { list: [
        'Set up its structure, pay scale and benefits, and its human, financial and material resources.',
        'Received Birr 50 million from the Ministry of Finance towards its initial capital.',
        'Developed the directives, policies and procedures needed to run the Fund.',
        'Collected Birr 480 million in initial premiums and Birr 6.03 billion in annual premiums, Birr 6.51 billion in total.',
        'Invested Birr 5.94 billion in Government Treasury Bills and Birr 540 million in a Mudarabah investment account.',
        'Signed a memorandum of understanding with the National Bank for information sharing and cooperation.',
        'Prepared agreements with the Ministry of Finance for back-up funding and with the Commercial Bank of Ethiopia for payout services.',
      ] },
      'Ato Merga Wakweya, Director of the Operations Directorate, also described the challenges the Fund faced, including limited expertise in deposit insurance, the absence of a payout mechanism, and a lack of precise data on insured and uninsured deposits. Plans for the coming year focused on raising at least Birr 6 billion in premiums and automating internal systems and the payout process.',
      'Participants asked the Fund to explain clearly how interest-free premiums are collected and invested, and encouraged it to keep up its pace of premium collection.',
    ],
  },
]

export const fmtDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
