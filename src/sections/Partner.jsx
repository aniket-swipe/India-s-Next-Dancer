import Section from '../components/Section'
import { PARTNER_SCOPE } from '../content'

export default function Partner() {
  return (
    <Section id="partner" className="partner">
      <div>
        <h2 className="display">Event partners</h2>
        <p className="ask">
          We’re looking for a professional event management company to handle the complete on-ground
          execution of the show across 10 cities, ending with the Grand Finale in Mumbai in July 2027.
        </p>
        <p className="ask">
          Please share your company profile, previous event experience, scope of services and an
          estimated budget proposal.
        </p>
        <a className="btn" href="mailto:partners@kgilproductions.in?subject=India%E2%80%99s%20Next%20Dancer%202027%20%E2%80%94%20Event%20management%20proposal">
          Send a proposal
        </a>
      </div>
      <ol className="scope">
        {PARTNER_SCOPE.map(s => <li key={s}>{s}</li>)}
      </ol>
    </Section>
  )
}
