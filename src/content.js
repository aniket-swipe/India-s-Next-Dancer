export const EVENT = {
  name: 'India’s Next Dancer',
  year: '2027',
  presenter: 'KGIL Productions',
  finaleISO: '2027-07-24T00:00:00+05:30',
  finaleLabel: '24 July 2027',
  venue: 'Jio World Convention Centre, Mumbai',
  cities: 10,
  prizePool: '₹28,00,000',
}

export const CATEGORIES = [
  { key: 'kids',   title: 'Kids',   age: '5–12',  sub: 'years old',        format: 'Solo' },
  { key: 'teens',  title: 'Teens',  age: '13–19', sub: 'years old',        format: 'Solo' },
  { key: 'adults', title: 'Adults', age: '20+',   sub: 'years and above',  format: 'Solo' },
  { key: 'group',  title: 'Group',  age: '2–10',  sub: 'members per crew', format: 'Group' },
]

export const PRIZES = [
  { place: '2nd', amount: '₹2,00,000', cls: 'b2' },
  { place: '1st', amount: '₹5,00,000', cls: 'b1' },
]

export const STEPS = [
  { n: 1, title: 'City Auditions',        body: 'Auditions run in 10 major cities across India. Come prepared, dance your style and perform for the panel.' },
  { n: 2, title: 'City Semifinals',       body: 'Selected performers from the auditions move on to the city-level semifinal.' },
  { n: 3, title: 'National Grand Finale', body: 'Finalists from every city perform live in Mumbai in front of celebrity judges.' },
]

export const FINALE_HIGHLIGHTS = [
  'National Grand Finale',
  'Celebrity judges',
  'Live performances',
  'Winners announced on stage',
]

export const PARTNER_SCOPE = [
  'Venue booking and management',
  'City-wise audition arrangements',
  'Semifinal and grand finale management',
  'Stage, LED, lighting and sound setup',
  'Celebrity judges and anchor coordination',
  'Contestant and audience management',
  'Security, hospitality and logistics',
  'Complete event-day coordination',
]

export const COMPANY = {
  name: 'KGIL Productions',
  phone: '+91 98366 76837',
  phoneHref: 'tel:+919836676837',
  email: 'support@kgilproduction.com',
  address: ['KGIL Productions', '203, Terminal-1, Tower B', 'Hinjewadi Phase 1', 'Pune, Maharashtra 411057'],
  registeredIn: 'Pune',
  parent: 'Kgil Productions',
  social: [
    { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/p/19v2WUnPec/' },
    { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/p/DgCHuL6SNMm/' },
  ],
}
