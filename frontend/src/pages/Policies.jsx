import { COMPANY, EVENT } from '../content'
import { Link } from '../router'
import { LegalDoc, PageHero } from './PageShell'

const UPDATED = 'Effective Date: 25 November 2026'
const SHOW = `${EVENT.name} ${EVENT.year}`

const Contact = ({ lead }) => (
  <>
    {lead && <p>{lead}</p>}
    <p>
      <b>{COMPANY.name}</b><br />
      203, Terminal-1, Tower B, Hinjewadi Phase 1,<br />
      Pune, Maharashtra – 411057, India.<br />
      Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br />
      Phone: <a href={COMPANY.phoneHref}>+91 98366 76837</a>
    </p>
  </>
)
const Terms = () => <Link to="/terms-and-conditions/">Terms &amp; Conditions</Link>
const Privacy = () => <Link to="/privacy-policy/">Privacy Policy</Link>

function Doc({ kicker, title, gold, intro, sections }) {
  return (
    <>
      <PageHero kicker={kicker} title={title} gold={gold} intro={intro} meta={UPDATED} />
      <LegalDoc sections={sections} />
    </>
  )
}

/* ---------------- Cookie Policy ---------------- */
const COOKIES = [
  { id: 'what-are-cookies', title: 'What cookies are', body: <>
    <p>Cookies are small text files stored on your device when you visit a website. Similar technologies, such as local storage, work in the same way. They help a website work properly, remember your preferences and understand how it is used.</p>
  </> },
  { id: 'how-we-use', title: 'How we use cookies', body: <>
    <p>The {SHOW} website may use cookies and similar technologies to:</p>
    <ul>
      <li><b>Keep the website working</b> — essential functions such as page navigation, security and form submission.</li>
      <li><b>Remember preferences</b> — for example, settings you choose while browsing.</li>
      <li><b>Understand usage</b> — anonymous or aggregated statistics on how visitors use the website, so we can improve it.</li>
    </ul>
    <p>We do not use cookies for targeted advertising directed at children.</p>
  </> },
  { id: 'third-party', title: 'Third-party services', body: <>
    <p>Some features rely on third-party services, such as web fonts, hosting, analytics or embedded social media content. These providers may set their own cookies or collect technical information, such as your IP address, under their own privacy policies.</p>
  </> },
  { id: 'managing-cookies', title: 'Managing cookies', body: <>
    <p>You can block or delete cookies through your browser settings, or through website controls where provided. Blocking essential cookies may stop some parts of the website from working correctly.</p>
  </> },
  { id: 'more-information', title: 'More information', body: <>
    <p>For details on how we handle personal information, please read our <Privacy />.</p>
  </> },
  { id: 'changes', title: 'Changes to this policy', body: <>
    <p>We may update this Cookie Policy from time to time. The latest version will always be published on this page with its effective date.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact lead="For questions about this Cookie Policy, please contact:" /> },
]

/* ---------------- Disclaimer ---------------- */
const DISCLAIMER = [
  { id: 'general', title: 'General information', body: <>
    <p>The information on this website is provided by {COMPANY.name} for general information about {SHOW}. We make reasonable efforts to keep it accurate and up to date, but we do not guarantee that it is complete, current or free from errors.</p>
  </> },
  { id: 'competition-details', title: 'Competition details may change', body: <>
    <p>Audition cities, dates, venues, schedules, formats, judges and other competition details are subject to change. Official details will be communicated through this website or our official communication channels. In case of any conflict, the official rules and the <Terms /> will apply.</p>
  </> },
  { id: 'no-guarantee', title: 'No guarantee of selection or results', body: <>
    <p>Signing up for notifications, registering or auditioning does not guarantee selection, progression to any round, a prize, a broadcast appearance or any career opportunity.</p>
  </> },
  { id: 'official-channels', title: 'Official channels and fraud warning', body: <>
    <p>{COMPANY.name} communicates only through this website, our official social media accounts, the support email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> and the phone number listed below. We never guarantee selection in exchange for money. If anyone claims to offer guaranteed selection, special access or results for a payment, please do not pay and report it to us.</p>
  </> },
  { id: 'external-links', title: 'External links', body: <>
    <p>This website may link to third-party websites or social media platforms. We do not control and are not responsible for their content, availability or privacy practices.</p>
  </> },
  { id: 'liability', title: 'Limitation of liability', body: <>
    <p>To the maximum extent permitted by law, {COMPANY.name} is not liable for any loss arising from reliance on the information on this website. Nothing in this Disclaimer limits any liability that cannot be excluded under applicable law.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact /> },
]

/* ---------------- Rules & Regulations ---------------- */
export const RULES = [
  { id: 'overview', title: 'Overview', body: <>
    <p>These rules apply to everyone taking part in {SHOW}. They should be read together with the <Terms />, the <Privacy /> and any registration guidelines or participation agreement issued by {COMPANY.name}.</p>
  </> },
  { id: 'categories', title: 'Categories and eligibility', body: <>
    <ul>
      <li><b>Kids:</b> Solo participants aged 5–12 years.</li>
      <li><b>Teens:</b> Solo participants aged 13–19 years.</li>
      <li><b>Adults:</b> Solo participants aged 20 years and above.</li>
      <li><b>Group:</b> Crews of 2–10 members.</li>
    </ul>
    <p>A participant may compete only in the category that matches their age, as on the age cut-off date stated in the registration guidelines. Age and identity proof may be required. Participants under 18 need valid consent from a parent or legal guardian.</p>
  </> },
  { id: 'format', title: 'Competition rounds', body: <>
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      <li>a. City auditions in {EVENT.cities} cities;</li>
      <li>b. City-level Semifinals; and</li>
      <li>c. A live National Grand Finale in Mumbai.</li>
    </ul>
    <p>Qualifying in one round does not guarantee selection in the next round.</p>
  </> },
  { id: 'performance', title: 'Performance rules', body: <>
    <ul>
      <li>The competition is freestyle — any dance form is allowed, subject to safety and performance guidelines.</li>
      <li>Performance duration, music format and stage requirements will be shared before each round. Participants must follow them.</li>
      <li>Music, choreography, costumes and props must not infringe anyone’s rights and must be appropriate for a family audience.</li>
      <li>Dangerous stunts, fire, sharp objects, liquids, glitter, powders or other items that could harm people or the stage are not allowed unless approved in advance.</li>
      <li>Costumes must be suitable for all ages. Participants are responsible for their own costumes, props and equipment.</li>
    </ul>
  </> },
  { id: 'group-entries', title: 'Group entries', body: <>
    <p>Each crew must nominate one authorised representative. Crew members registered for a round should be the ones who perform; changes to the line-up need approval from the Organiser. Parental consent is required for every member under 18.</p>
  </> },
  { id: 'reporting', title: 'Reporting and attendance', body: <>
    <p>Participants must report to the venue at the time given and carry the required documents. Late arrival or absence may lead to the slot being cancelled.</p>
  </> },
  { id: 'judging', title: 'Judging', body: <>
    <p>Performances are scored by a judging panel appointed by the Organiser. Criteria may include technique, creativity, choreography, expression, musicality and stage presence. The judges’ decisions are final and binding, subject to applicable law and the correction of any clear administrative error.</p>
  </> },
  { id: 'conduct', title: 'Conduct and disqualification', body: <>
    <p>Abusive, threatening, discriminatory, fraudulent, unsafe or disruptive behaviour by a participant, guardian, crew member or companion may lead to disqualification. So can giving false information, breaching these rules or interfering with judging.</p>
  </> },
  { id: 'prizes', title: 'Prizes', body: <>
    <p>In each category, 1st place wins ₹5,00,000 and 2nd place wins ₹2,00,000. Group prizes are awarded to the crew collectively. Prizes are subject to verification, required documents and applicable tax deductions.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact lead="For questions about these rules, please contact:" /> },
]

/* ---------------- Payment & Refund Policy ---------------- */
const PAYMENT = [
  { id: 'scope', title: 'Scope', body: <>
    <p>This policy explains how payments, if any, for {SHOW} are handled and when refunds may apply. Signing up for notifications on this website is free and does not involve any payment.</p>
  </> },
  { id: 'fees', title: 'Registration fees', body: <>
    <p>Any registration or participation fee, its amount and what it covers will be clearly announced when formal registration opens. A fee, if charged, will apply only after you have seen the amount and agreed to it.</p>
  </> },
  { id: 'payments', title: 'How payments are made', body: <>
    <p>Payments, where applicable, will be accepted only through the official payment method shown during registration on this website or in official communication from {COMPANY.name}. Do not pay anyone through personal accounts or unofficial links. Payment details are processed by authorised payment providers; we do not store full card details.</p>
    <p>Registration is confirmed only after successful payment, where applicable, and completion of the registration process.</p>
  </> },
  { id: 'refunds', title: 'Refunds', body: <>
    <ul>
      <li><b>Duplicate or failed payments:</b> where an amount is charged twice or debited without registration being completed, it will be refunded after verification.</li>
      <li><b>Cancellation by the Organiser:</b> if an audition or round is cancelled by the Organiser and no alternative is offered, the applicable fee will be refunded.</li>
      <li><b>Withdrawal or no-show:</b> withdrawal, absence or late arrival does not automatically entitle a participant to a refund.</li>
      <li><b>Disqualification:</b> fees are not refunded where a participant is disqualified for breaking the rules or giving false information.</li>
    </ul>
    <p>Any exceptions will be stated in the registration guidelines or required by applicable law.</p>
  </> },
  { id: 'process', title: 'How to request a refund', body: <>
    <p>Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with the participant’s name, registered mobile number, payment reference and the reason for the request. Approved refunds will be credited to the original payment method within the timelines of the payment provider and banks.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact /> },
]

/* ---------------- Cancellation Policy ---------------- */
const CANCELLATION = [
  { id: 'by-participant', title: 'Cancellation by a participant', body: <>
    <p>A participant (or, for minors, a parent or guardian) may withdraw from {SHOW} at any time by emailing <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> from their registered contact details. Refunds for withdrawals, if any, follow the <Link to="/payment-and-refund-policy/">Payment &amp; Refund Policy</Link>.</p>
  </> },
  { id: 'notifications', title: 'Stopping notifications', body: <>
    <p>If you signed up only to be notified, you can ask us at any time to stop sending updates and to delete your details, as described in our <Privacy />.</p>
  </> },
  { id: 'by-organiser', title: 'Changes or cancellation by the Organiser', body: <>
    <p>{COMPANY.name} may modify, postpone, relocate, suspend or cancel any part of the Competition because of operational needs, venue availability, public safety, government directions, insufficient participation, technical issues or events beyond its reasonable control.</p>
    <p>Where this happens, we will make reasonable efforts to inform registered participants through the website or their registered contact details, and will offer an alternative date or venue, or a refund where applicable.</p>
  </> },
  { id: 'slot-cancellation', title: 'Cancellation of a slot', body: <>
    <p>A participant’s slot may be cancelled if they do not report on time, do not provide the required documents or consents, or breach the competition rules.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact /> },
]

/* ---------------- Child Safety ---------------- */
const CHILD = [
  { id: 'commitment', title: 'Our commitment', body: <>
    <p>{SHOW} welcomes young dancers in the Kids (5–12) and Teens (13–19) categories, as well as minors in Group crews. The safety, dignity and wellbeing of every child come first at every audition, rehearsal, shoot and show.</p>
  </> },
  { id: 'consent', title: 'Parental consent', body: <>
    <ul>
      <li>Every participant under 18 must have registration and participation authorised by a parent or legal guardian.</li>
      <li>We may verify the child’s age and the guardian’s authority, and ask for supporting documents.</li>
      <li>Registrations without valid consent may be rejected or suspended.</li>
    </ul>
  </> },
  { id: 'supervision', title: 'Supervision at venues', body: <>
    <ul>
      <li>A parent, legal guardian or an adult authorised in writing must accompany each participant under 18 and stay at the venue.</li>
      <li>Parents and guardians remain responsible for the child’s supervision, welfare and travel unless otherwise agreed in writing.</li>
      <li>Children should not be left alone with crew members, and private one-to-one contact with minors is not permitted.</li>
    </ul>
  </> },
  { id: 'performances', title: 'Age-appropriate performances', body: <>
    <p>Music, lyrics, costumes, choreography and props for minors must be age-appropriate. Unsafe stunts are not allowed. We may stop or change any performance that is not suitable for a child.</p>
  </> },
  { id: 'wellbeing', title: 'Wellbeing and working hours', body: <>
    <p>We aim to keep schedules reasonable for children, provide breaks, water and a safe waiting area, and follow applicable laws on the participation of children in performances and shoots.</p>
  </> },
  { id: 'media', title: 'Photos, videos and privacy', body: <>
    <p>Images and recordings of minors are used only as permitted by the guardian’s consent and the applicable participation agreement. We do not knowingly track children for behavioural monitoring or show them targeted advertising. See our <Privacy /> for details.</p>
  </> },
  { id: 'reporting', title: 'Raising a concern', body: <>
    <p>If you see or suspect anything that puts a child at risk, tell an event official immediately or contact us using the details below. Every concern will be taken seriously, handled confidentially and, where required, reported to the appropriate authorities.</p>
    <p>In an emergency in India, call <a href="tel:112">112</a>. For a child in need of care and protection, you can also call the Childline helpline <a href="tel:1098">1098</a>.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact /> },
]

export const CookiePolicy = () => <Doc kicker="Cookie Policy" title="Cookie" gold="Policy" intro="How this website uses cookies and similar technologies." sections={COOKIES} />
export const Disclaimer = () => <Doc kicker="Disclaimer" title="Website" gold="Disclaimer" intro={`Important information about using this website and ${SHOW}.`} sections={DISCLAIMER} />
export const Rules = () => <Doc kicker="Rules & Regulations" title="Rules &" gold="Regulations" intro={`The competition rules every participant in ${SHOW} must follow.`} sections={RULES} />
export const PaymentRefund = () => <Doc kicker="Payment & Refund Policy" title="Payment &" gold="Refund Policy" intro="How registration payments and refunds are handled." sections={PAYMENT} />
export const Cancellation = () => <Doc kicker="Cancellation Policy" title="Cancellation" gold="Policy" intro="How withdrawals, changes and cancellations work." sections={CANCELLATION} />
export const ChildSafety = () => <Doc kicker="Child Safety" title="Child" gold="Safety" intro="How we protect young dancers at every stage of the competition." sections={CHILD} />
