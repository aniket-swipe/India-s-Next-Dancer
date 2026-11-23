import { COMPANY, EVENT } from '../content'
import { LegalDoc, PageHero } from './PageShell'

const UPDATED = 'Last updated: 24 November 2026'
const Contact = () => (
  <p>
    {COMPANY.name}, {COMPANY.address.slice(1).join(', ')} · <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> ·{' '}
    <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
  </p>
)

const PRIVACY = [
  { id: 'who-we-are', title: 'Who we are', body: <>
    <p>This website is operated by {COMPANY.name} (“we”, “us”), registered in {COMPANY.registeredIn}, which organises {EVENT.name} {EVENT.year} (the “Competition”).</p>
    <p>This policy explains what personal data we collect through this website and the Competition, why we collect it and the choices you have.</p>
  </> },
  { id: 'what-we-collect', title: 'Information we collect', body: <>
    <p>When you ask to be notified about registration, we collect:</p>
    <ul><li>your full name</li><li>your mobile number</li><li>the city you’d like to audition in</li><li>the category you’re interested in</li></ul>
    <p>If you later register or audition, we may collect further details needed to run the Competition, such as age, proof of age, a parent or guardian’s details for participants under 18, crew members for Group entries, and photos, audio and video of performances.</p>
  </> },
  { id: 'how-we-use', title: 'How we use your information', body: <>
    <ul>
      <li>to tell you when registration opens and share the audition date for your city</li>
      <li>to manage registrations, auditions, semifinals and the Grand Finale</li>
      <li>to check eligibility for a category, such as age</li>
      <li>to contact participants about schedules, results and prizes</li>
      <li>to promote the Competition using performance recordings, where you have agreed to this in the participation terms</li>
    </ul>
    <p>We do not sell your personal data.</p>
  </> },
  { id: 'sharing', title: 'Who we share it with', body: <>
    <p>We share information only where needed to run the Competition — for example with venue, event-management, production and messaging partners working on our behalf — and where required by law. These partners may use the information only for the purpose we give them.</p>
  </> },
  { id: 'minors', title: 'Children and minors', body: <>
    <p>The Kids (5–12) and Teens (13–19) categories include participants under 18. For anyone under 18, a parent or legal guardian must provide or approve their details and consent to their participation.</p>
  </> },
  { id: 'retention', title: 'How long we keep it', body: <>
    <p>We keep notification details until registration opens and for a reasonable period afterwards, and Competition records for as long as needed to run the Competition, award prizes and meet legal obligations. After that we delete or anonymise them.</p>
  </> },
  { id: 'security', title: 'Security', body: <>
    <p>We use reasonable technical and organisational measures to protect your data. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
  </> },
  { id: 'your-rights', title: 'Your rights', body: <>
    <p>You can ask us to access, correct or delete your personal data, or to stop sending you updates, by contacting us using the details below. We will respond within a reasonable time and as required by applicable Indian law.</p>
  </> },
  { id: 'changes', title: 'Changes to this policy', body: <>
    <p>We may update this policy from time to time. The latest version will always be on this page, with the date it was last updated.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact /> },
]

const TERMS = [
  { id: 'about-these-terms', title: 'About these terms', body: <>
    <p>These terms apply to your use of this website and your participation in {EVENT.name} {EVENT.year} (the “Competition”), organised by {COMPANY.name} (“we”, “us”). By using the website or entering the Competition you agree to them.</p>
  </> },
  { id: 'eligibility', title: 'Eligibility and categories', body: <>
    <ul>
      <li><b>Kids</b> — solo, 5 to 12 years old</li>
      <li><b>Teens</b> — solo, 13 to 19 years old</li>
      <li><b>Adults</b> — solo, 20 years and above</li>
      <li><b>Group</b> — crews of 2 to 10 members</li>
    </ul>
    <p>We may ask for proof of age. Participants under 18 need the consent of a parent or legal guardian. We may refuse or cancel an entry that does not meet the eligibility rules.</p>
  </> },
  { id: 'format', title: 'Competition format', body: <>
    <p>The Competition runs in three rounds: city auditions in {EVENT.cities} cities, city-level semifinals and a live National Grand Finale in Mumbai. Audition cities, dates and venues will be announced when registration opens. The dance style is freestyle — any dance form is welcome.</p>
  </> },
  { id: 'registration', title: 'Registration', body: <>
    <p>Signing up for notifications on this website is not a registration for the Competition. Registration details, any fees and deadlines will be published when registration opens. You must give accurate information when you register.</p>
  </> },
  { id: 'judging', title: 'Judging', body: <>
    <p>Performances are assessed by the judging panel at each round. The judges’ decisions are final. We may disqualify any participant for unsafe, offensive or dishonest conduct.</p>
  </> },
  { id: 'prizes', title: 'Prizes', body: <>
    <p>In each of the four categories, the 1st place winner receives ₹5,00,000 and the 2nd place winner receives ₹2,00,000. For Group entries the prize is awarded to the crew. Prizes are subject to applicable taxes, verification of eligibility and any deductions required by law, and are not transferable.</p>
  </> },
  { id: 'media', title: 'Recording and media', body: <>
    <p>Auditions, semifinals and the Grand Finale may be photographed, filmed and broadcast. By participating you agree that we may use these recordings, your name and likeness to promote the Competition. Further details will be in the participation agreement at registration.</p>
  </> },
  { id: 'conduct', title: 'Conduct and safety', body: <>
    <p>Participants and audiences must follow venue rules, safety instructions and the reasonable directions of our team. You are responsible for your own costumes, props and equipment.</p>
  </> },
  { id: 'changes', title: 'Changes and cancellation', body: <>
    <p>We may change dates, venues, rounds or other arrangements, or postpone or cancel any part of the Competition, if circumstances require. We will communicate changes on this website and to registered participants.</p>
  </> },
  { id: 'liability', title: 'Liability', body: <>
    <p>To the extent permitted by law, we are not liable for indirect losses, or for loss of or damage to personal property, arising from use of the website or participation in the Competition.</p>
  </> },
  { id: 'law', title: 'Governing law', body: <>
    <p>These terms are governed by the laws of India, and the courts at {COMPANY.registeredIn} have jurisdiction.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact /> },
]

export function Privacy() {
  return (
    <>
      <PageHero kicker="Privacy Policy" title="Privacy" gold="Policy" intro="How we collect, use and protect your information." meta={UPDATED} />
      <LegalDoc sections={PRIVACY} />
    </>
  )
}

export function Terms() {
  return (
    <>
      <PageHero kicker="Terms & Conditions" title="Terms &" gold="Conditions" intro={`The rules for using this website and taking part in ${EVENT.name} ${EVENT.year}.`} meta={UPDATED} />
      <LegalDoc sections={TERMS} />
    </>
  )
}
