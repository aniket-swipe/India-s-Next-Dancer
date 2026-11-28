import { CATEGORIES, COMPANY, EVENT } from './content'

/** Single source of truth for SEO. Paths use a trailing slash (one canonical form per page). */
export const SITE = {
  url: 'https://indiasnextdancer.com',
  name: `${EVENT.name} ${EVENT.year}`,
  locale: 'en_IN',
  ogImage: '/images/indias-next-dancer-2027-og.jpg',
  ogImageAlt: `${EVENT.name} ${EVENT.year} logo — a dancer in gold light, by ${COMPANY.name}`,
}

export const abs = path => SITE.url + path

const DESC_HOME = `${EVENT.name} ${EVENT.year} is a nationwide freestyle dance competition by ${COMPANY.name}. Auditions in ${EVENT.cities} cities, ${CATEGORIES.length} categories (Kids, Teens, Adults, Group) and a ${EVENT.prizePool} prize pool, with a live Grand Finale in Mumbai.`

export const PAGES = {
  '/': {
    title: `${EVENT.name} ${EVENT.year} | National Freestyle Dance Competition by ${COMPANY.name}`,
    description: DESC_HOME,
    crumbs: null,
  },
  '/about/': {
    title: `About ${EVENT.name} ${EVENT.year} | ${COMPANY.name}`,
    description: `About ${EVENT.name} ${EVENT.year}: a nationwide freestyle dance competition presented by ${COMPANY.name}, open to every age and every dance style, with auditions in ${EVENT.cities} cities.`,
    crumbs: [['Home', '/'], ['About', '/about/']],
  },
  '/register/': {
    title: `Register | ${EVENT.name} ${EVENT.year} Auditions`,
    description: `Register for ${EVENT.name} ${EVENT.year} auditions. Choose your city and category, add your dance link and pay the ₹590 registration fee (incl. GST) securely online.`,
    crumbs: [['Home', '/'], ['Register', '/register/']],
  },
  '/battle-register/': {
    title: `Battle Registration | India’s Next Battle ${EVENT.year}`,
    description: `Register for India’s Next Battle ${EVENT.year} by ${COMPANY.name}. Choose your city and category, add your dance link and pay the ₹590 registration fee (incl. GST) securely online.`,
    crumbs: [['Home', '/'], ['Battle Registration', '/battle-register/']],
  },
  '/privacy-policy/': {
    title: `Privacy Policy | ${EVENT.name} ${EVENT.year}`,
    description: `How ${COMPANY.name} collects, uses and protects personal information for ${EVENT.name} ${EVENT.year} notifications, registrations and auditions.`,
    crumbs: [['Home', '/'], ['Privacy Policy', '/privacy-policy/']],
  },
  '/terms-and-conditions/': {
    title: `Terms & Conditions | ${EVENT.name} ${EVENT.year}`,
    description: `Rules for ${EVENT.name} ${EVENT.year}: eligibility, the four categories, competition format, judging, prizes of ₹5,00,000 and ₹2,00,000 per category, and website terms.`,
    crumbs: [['Home', '/'], ['Terms & Conditions', '/terms-and-conditions/']],
  },
  '/cookie-policy/': {
    title: `Cookie Policy | ${EVENT.name} ${EVENT.year}`,
    description: `How the ${EVENT.name} ${EVENT.year} website uses cookies and similar technologies, and how you can manage them.`,
    crumbs: [['Home', '/'], ['Cookie Policy', '/cookie-policy/']],
  },
  '/disclaimer/': {
    title: `Disclaimer | ${EVENT.name} ${EVENT.year}`,
    description: `Website disclaimer for ${EVENT.name} ${EVENT.year} by ${COMPANY.name}: accuracy of information, changes to competition details, official channels and fraud warning.`,
    crumbs: [['Home', '/'], ['Disclaimer', '/disclaimer/']],
  },
  '/rules-and-regulations/': {
    title: `Rules & Regulations | ${EVENT.name} ${EVENT.year}`,
    description: `Competition rules for ${EVENT.name} ${EVENT.year}: categories and age groups, rounds, performance rules, group entries, judging, conduct and prizes.`,
    crumbs: [['Home', '/'], ['Rules & Regulations', '/rules-and-regulations/']],
  },
  '/payment-and-refund-policy/': {
    title: `Payment & Refund Policy | ${EVENT.name} ${EVENT.year}`,
    description: `How registration payments, if any, and refunds are handled for ${EVENT.name} ${EVENT.year}, and how to request a refund.`,
    crumbs: [['Home', '/'], ['Payment & Refund Policy', '/payment-and-refund-policy/']],
  },
  '/cancellation-policy/': {
    title: `Cancellation Policy | ${EVENT.name} ${EVENT.year}`,
    description: `How participants can withdraw from ${EVENT.name} ${EVENT.year}, and how changes or cancellations by the organiser are handled.`,
    crumbs: [['Home', '/'], ['Cancellation Policy', '/cancellation-policy/']],
  },
  '/child-safety/': {
    title: `Child Safety | ${EVENT.name} ${EVENT.year}`,
    description: `How ${COMPANY.name} protects young dancers in ${EVENT.name} ${EVENT.year}: parental consent, supervision, age-appropriate performances and reporting concerns.`,
    crumbs: [['Home', '/'], ['Child Safety', '/child-safety/']],
  },
}

export const NOT_FOUND = {
  title: `Page not found | ${EVENT.name} ${EVENT.year}`,
  description: `The page you were looking for doesn’t exist on ${EVENT.name} ${EVENT.year}.`,
  robots: 'noindex, follow',
}

/** Normalise a pathname to its canonical form: lowercase, single slashes, trailing slash. */
export function canonicalPath(pathname) {
  let p = (pathname || '/').toLowerCase().replace(/\/{2,}/g, '/')
  if (!p.endsWith('/')) p += '/'
  return p
}

const ORG_ID = `${SITE.url}/#organization`
const SITE_ID = `${SITE.url}/#website`

/** JSON-LD for a page. Only schema that matches visible content. */
export function schemaFor(path) {
  const page = PAGES[path]
  const graph = [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: COMPANY.name,
      url: SITE.url + '/',
      logo: { '@type': 'ImageObject', url: abs('/images/indias-next-dancer-icon-192.png'), width: 192, height: 192 },
      email: COMPANY.email,
      telephone: COMPANY.phone.replace(/\s/g, ''),
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY.address.slice(1, 3).join(', '),
        addressLocality: 'Pune',
        addressRegion: 'Maharashtra',
        postalCode: '411057',
        addressCountry: 'IN',
      },
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: COMPANY.email, telephone: COMPANY.phone.replace(/\s/g, ''), areaServed: 'IN', availableLanguage: ['en', 'hi'] }],
      sameAs: COMPANY.social.map(s => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      url: SITE.url + '/',
      name: SITE.name,
      description: DESC_HOME,
      inLanguage: 'en-IN',
      publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'WebPage',
      '@id': abs(path) + '#webpage',
      url: abs(path),
      name: page.title,
      description: page.description,
      isPartOf: { '@id': SITE_ID },
      inLanguage: 'en-IN',
      primaryImageOfPage: { '@type': 'ImageObject', url: abs(SITE.ogImage) },
    },
  ]
  if (page.crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: page.crumbs.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** <head> tags for a route (used by the prerenderer). */
export function headTags(path, { noindex = false } = {}) {
  const nf = !PAGES[path]
  const page = nf ? NOT_FOUND : PAGES[path]
  const robots = noindex ? 'noindex, nofollow' : nf ? NOT_FOUND.robots : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  const url = abs(path)
  const t = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<meta name="robots" content="${robots}">`,
  ]
  if (!nf) {
    t.push(
      `<link rel="canonical" href="${url}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="${esc(SITE.name)}">`,
      `<meta property="og:locale" content="${SITE.locale}">`,
      `<meta property="og:url" content="${url}">`,
      `<meta property="og:title" content="${esc(page.title)}">`,
      `<meta property="og:description" content="${esc(page.description)}">`,
      `<meta property="og:image" content="${abs(SITE.ogImage)}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta property="og:image:alt" content="${esc(SITE.ogImageAlt)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(page.title)}">`,
      `<meta name="twitter:description" content="${esc(page.description)}">`,
      `<meta name="twitter:image" content="${abs(SITE.ogImage)}">`,
      `<script type="application/ld+json">${JSON.stringify(schemaFor(path)).replace(/</g, '\\u003c')}</script>`,
    )
  }
  return t.join('\n    ')
}
