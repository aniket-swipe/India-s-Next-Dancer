import { useEffect } from 'react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Register, { BattleRegister } from './pages/Register'
import { Privacy, Terms } from './pages/Legal'
import { CookiePolicy, Disclaimer, Rules, PaymentRefund, Cancellation, ChildSafety } from './pages/Policies'
import { usePath } from './router'
import { NOT_FOUND, PAGES, SITE, abs } from './seo'

const ROUTES = {
  '/': Home,
  '/about/': About,
  '/register/': Register,
  '/battle-register/': BattleRegister,
  '/privacy-policy/': Privacy,
  '/terms-and-conditions/': Terms,
  '/cookie-policy/': CookiePolicy,
  '/disclaimer/': Disclaimer,
  '/rules-and-regulations/': Rules,
  '/payment-and-refund-policy/': PaymentRefund,
  '/cancellation-policy/': Cancellation,
  '/child-safety/': ChildSafety,
}

/** Keep head tags in sync when navigating on the client (the first load already has them from the prerender). */
function syncHead(path) {
  const page = PAGES[path] || NOT_FOUND
  document.title = page.title
  const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el && val != null) el.setAttribute(attr, val) }
  set('meta[name="description"]', 'content', page.description)
  set('link[rel="canonical"]', 'href', PAGES[path] ? abs(path) : null)
  set('meta[property="og:url"]', 'content', PAGES[path] ? abs(path) : null)
  set('meta[property="og:title"]', 'content', page.title)
  set('meta[name="twitter:title"]', 'content', page.title)
  set('meta[property="og:description"]', 'content', page.description)
  set('meta[name="twitter:description"]', 'content', page.description)
  set('meta[name="robots"]', 'content', PAGES[path] ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : NOT_FOUND.robots)
}

export default function App() {
  const path = usePath()
  const Page = ROUTES[path] || NotFound

  useEffect(() => {
    syncHead(path)
    const id = location.hash.slice(1)
    if (id) requestAnimationFrame(() => setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50))
    else scrollTo({ top: 0 })
  }, [path])

  return (
    <div className="app">
      <Nav />
      <main key={path} className="page-enter" id="main">
        <Page />
      </main>
      <Footer />
    </div>
  )
}

export { ROUTES, SITE }
