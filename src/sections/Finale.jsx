import Section from '../components/Section'
import { EVENT, FINALE_HIGHLIGHTS } from '../content'

export default function Finale() {
  return (
    <Section id="finale" className="finale">
      <h2 className="display metal date">{EVENT.finaleLabel}</h2>
      <p className="venue">{EVENT.venue}</p>
      <ul>{FINALE_HIGHLIGHTS.map(h => <li key={h}>{h}</li>)}</ul>
    </Section>
  )
}
