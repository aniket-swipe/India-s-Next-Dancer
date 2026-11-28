import { Link } from '../router'
import { PageHero, Reveal } from './PageShell'

export default function NotFound() {
  return (
    <>
      <PageHero kicker="404" title="Page" gold="not found" intro="The page you were looking for doesn’t exist or may have moved." />
      <section className="pg-body">
        <div className="wrap">
          <Reveal className="ab-cta">
            <div className="ab-cta-btns">
              <Link className="btn" to="/">Go to the home page</Link>
              <Link className="btn ghost" to="/#categories">See categories</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
