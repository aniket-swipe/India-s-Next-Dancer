import { Suspense, lazy } from 'react'
import { EVENT } from '../content'

// Three.js stage lives only in the hero; loaded after first paint.
const GoldStage = lazy(() => import('../components/GoldStage'))

const srOnly = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }

export default function Hero() {
  return (
    <section className="hero" id="top">
      <Suspense fallback={null}><GoldStage /></Suspense>
      <div className="beams" />
      <h1 style={srOnly}>{EVENT.name} {EVENT.year} by {EVENT.presenter}</h1>
      <picture>
        <source type="image/webp" srcSet="/images/indias-next-dancer-2027-logo-600.webp 600w, /images/indias-next-dancer-2027-logo.webp 900w" sizes="(max-width: 700px) 92vw, 620px" />
        <img className="logo" src="/images/indias-next-dancer-2027-logo.jpg"
          srcSet="/images/indias-next-dancer-2027-logo-600.jpg 600w, /images/indias-next-dancer-2027-logo.jpg 900w" sizes="(max-width: 700px) 92vw, 620px"
          width="900" height="796" fetchpriority="high" decoding="async"
          alt={`${EVENT.name} ${EVENT.year} logo: a dancer mid-move inside a gold ring, by ${EVENT.presenter}`} />
      </picture>
      <div className="hero-copy">
        <p className="lede">
          A nationwide freestyle dance competition across {EVENT.cities} cities. Every age, every
          style, one national stage.
        </p>
        <div className="actions">
          <a className="btn" href="#notify">Get notified when registration opens</a>
          <a className="btn ghost" href="#categories">See categories</a>
        </div>
      </div>
    </section>
  )
}
