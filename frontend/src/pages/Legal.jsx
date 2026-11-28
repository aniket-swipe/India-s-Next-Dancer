import { COMPANY, EVENT } from '../content'
import { LegalDoc, PageHero } from './PageShell'

const UPDATED = 'Effective Date: 25 November 2026'
const L = ({ items }) => <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
const Contact = ({ after }) => (
  <>
    <p>
      <b>{COMPANY.name}</b><br />
      203, Terminal-1, Tower B, Hinjewadi Phase 1,<br />
      Pune, Maharashtra – 411057, India.<br />
      Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br />
      Phone: <a href={COMPANY.phoneHref}>+91 8956479160</a>
    </p>
    {after && <p>{after}</p>}
  </>
)

export const PRIVACY = [
  { id: 'who-we-are', title: 'Who we are', body: <>
    <p>This website is operated by KGIL Productions (“Company”, “we”, “us” or “our”), registered in Pune, Maharashtra, India. The Company organises and manages India’s Next Dancer 2027 (“Competition”).</p>
    <p>This Privacy Policy explains how we collect, use, store, process and disclose personal information through our website, registration forms, audition processes and related Competition activities.</p>
    <p>By accessing the website, submitting your details or registering for the Competition, you acknowledge this Privacy Policy. Where consent is required, we will obtain it separately through an appropriate consent mechanism.</p>
  </> },
  { id: 'information-we-collect', title: 'Information we collect', body: <>
    <p>The information we collect depends on how you interact with our website and Competition.</p>
    <h3>A. Notification and Early-Interest Registration</h3>
    <p>If you request to be notified when registrations open, we may collect:</p>
    <L items={['Full name;', 'Mobile number;', 'Preferred audition city; and', 'Interested participation category.']} />
    <p>Providing these details does not constitute formal registration or guarantee participation in the Competition.</p>
    <h3>B. Competition Registration and Auditions</h3>
    <p>If you subsequently register or participate in auditions, we may collect additional information, including:</p>
    <L items={['Full name, age and date of birth;', 'Mobile number and email address;', 'Residential city and address, where required;', 'Identity and age-verification documents;', 'Parent or legal guardian details and consent for participants below 18 years;', 'Category and participation details;', 'Group name and details of crew members for Group entries;', 'Photographs, audio recordings and audition videos;', 'Dance performances, choreography details and relevant experience;', 'Other information reasonably required to administer the Competition.']} />
    <h3>C. Technical Information</h3>
    <p>When you visit our website, certain technical information may be collected automatically, including IP address, browser type, device information, access logs, cookies and website interaction data.</p>
  </> },
  { id: 'how-we-use', title: 'How we use your information', body: <>
    <p>We may use the information collected for the following purposes:</p>
    <L items={['To notify interested individuals when registrations open.', 'To communicate audition dates, locations and other relevant updates for their preferred city.', 'To receive and manage Competition registrations.', 'To verify participant identity, age and category eligibility.', 'To process and evaluate audition submissions.', 'To coordinate auditions,  National Semifinals and the Grand Finale.', 'To communicate schedules, selection results, announcements and prizes.', 'To coordinate with judges, event organisers, venues and production teams.', 'To record, produce and promote Competition-related content, subject to applicable permissions and participant agreements.', 'To maintain records and address complaints or disputes.', 'To protect the security and integrity of the website and Competition.', 'To comply with applicable legal requirements.']} />
    <p>We do not sell your personal data.</p>
  </> },
  { id: 'recordings', title: 'Photographs, videos and performance recordings', body: <>
    <p>Photographs, audio recordings and videos submitted by participants may be used for audition evaluation, shortlisting and Competition administration.</p>
    <p>Where a participant is selected or participates in recorded activities, the Company may use photographs, videos, performance recordings, interviews and related materials for Competition-related publicity, promotional campaigns, official social media accounts, websites and other authorised distribution channels, subject to the participant’s applicable consent and signed participation or performer release agreements.</p>
    <p>The specific rights relating to recording, editing, broadcasting, reproduction and commercial exploitation shall be governed by the applicable participation agreement or performer release.</p>
    <p>Submission of an audition video alone shall not automatically transfer ownership of all intellectual property rights in the submitted material.</p>
  </> },
  { id: 'sharing', title: 'Sharing of information', body: <>
    <p>We may share personal information only where reasonably necessary for organising and administering the Competition, including with:</p>
    <L items={['Venue owners and venue-management partners;', 'Event-management companies;', 'Production houses and production personnel;', 'Judges, choreographers and audition evaluators;', 'Messaging and communication service providers;', 'Website hosting, cloud storage and technical service providers;', 'Legal, professional and compliance advisers;', 'Government authorities or law enforcement agencies where legally required.']} />
    <p>Such service providers and authorised partners may process information only for the purposes for which it is shared and subject to appropriate confidentiality and security obligations.</p>
    <p>We do not authorise these service providers to independently use participant information for unrelated purposes.</p>
  </> },
  { id: 'minors', title: 'Children and minor participants', body: <>
    <p>India’s Next Dancer 2027 may include the following categories:</p>
    <L items={['Kids: 5–12 years;', 'Teens: 13–19 years;', 'Group: As specified in the official Competition rules.']} />
    <p>Participants below 18 years of age must have their registration and participation authorised by a parent or legal guardian.</p>
    <p>For such participants:</p>
    <L items={['Parent or guardian details and consent must be provided.', 'The Company may verify the age of the participant and the authority of the parent or guardian.', 'The Company may request supporting documents where reasonably necessary.', 'Personal information of minors will be processed in accordance with applicable child-protection and data-protection requirements.', 'The Company will not knowingly engage in prohibited tracking or behavioural monitoring of children or targeted advertising directed at children.']} />
    <p>The Company reserves the right to reject or suspend registrations where the required consent or verification is not provided.</p>
  </> },
  { id: 'retention', title: 'Data retention', body: <>
    <p>We retain personal information only for as long as reasonably necessary for the purposes for which it was collected.</p>
    <ul>
      <li><b>Notification details:</b> Retained until registration opens and for a reasonable period thereafter to facilitate relevant follow-up communications.</li>
      <li><b>Registration details:</b> Retained for the duration necessary to administer the Competition, including auditions,  National Semifinals and the Grand Finale.</li>
      <li><b>Competition records:</b> Retained for prize administration, dispute resolution, archival purposes where authorised and compliance with applicable legal obligations.</li>
      <li><b>Photographs and videos:</b> Retained and used in accordance with the applicable participant consent, release and content-licensing arrangements.</li>
    </ul>
    <p>Once the information is no longer required, it will be deleted or anonymised, subject to applicable legal retention requirements.</p>
  </> },
  { id: 'security', title: 'Data security', body: <>
    <p>We implement reasonable technical and organisational safeguards to protect personal information against unauthorised access, disclosure, alteration, misuse or destruction.</p>
    <p>These safeguards may include restricted access, password protection, secure hosting and appropriate internal controls.</p>
    <p>However, no method of electronic transmission or storage is completely secure. Accordingly, absolute security cannot be guaranteed.</p>
  </> },
  { id: 'cookies', title: 'Cookies and website technologies', body: <>
    <p>Our website may use cookies and similar technologies to maintain website functionality, understand visitor interactions, improve performance and analyse website traffic.</p>
    <p>Users may manage available cookie preferences through their browser settings or website controls, where provided.</p>
  </> },
  { id: 'third-party-services', title: 'Third-party services', body: <>
    <p>Our website may contain links to third-party websites, social media platforms or external services.</p>
    <p>The Company does not control the privacy practices or security policies of such third parties. Users are encouraged to review their respective privacy policies before sharing information with them.</p>
  </> },
  { id: 'your-rights', title: 'Your rights and requests', body: <>
    <p>Subject to applicable law, you may request:</p>
    <L items={['Access to information about your personal data and its processing;', 'Correction or updating of inaccurate information;', 'Erasure of personal information where legally permissible;', 'Withdrawal of consent for processing based on consent;', 'Cessation of optional notification or promotional communications;', 'Resolution of privacy-related grievances.']} />
    <p>For minor participants, such requests may be submitted by their parent or legal guardian, as applicable.</p>
    <p>Requests may be sent to the contact details provided below. We may require reasonable verification before processing a request.</p>
    <p>Withdrawal of consent may affect our ability to process a registration or facilitate continued participation in the Competition.</p>
  </> },
  { id: 'communications', title: 'Communications and notifications', body: <>
    <p>Individuals who submit their details for early notification may receive communications relating to registration openings, audition dates and relevant Competition updates.</p>
    <p>Such notifications will be limited to the purposes for which the information was collected, unless additional consent is obtained for other communications.</p>
    <p>You may request that we stop sending optional updates by contacting us at the email address below.</p>
  </> },
  { id: 'changes', title: 'Changes to this Privacy Policy', body: <>
    <p>We may update this Privacy Policy from time to time to reflect changes in the Competition, website functionality, business operations or applicable laws.</p>
    <p>The latest version will be published on this website along with the updated date.</p>
  </> },
  { id: 'governing-law', title: 'Governing law', body: <>
    <p>This Privacy Policy shall be governed by the laws of India and interpreted in accordance with applicable Indian data-protection and privacy legislation.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <>
    <p>For privacy-related requests, questions or grievances, please contact:</p>
    <Contact after="We will endeavour to address requests and grievances within the timelines prescribed under applicable law." />
  </> },
]

export const TERMS = [
  { id: 'about-the-competition', title: 'About the Competition', body: <>
    <p>These Terms and Conditions (“Terms”) govern the use of the website and participation in India’s Next Dancer 2027 (“Competition”), organised by KGIL Productions, having its office at 203, Terminal-1, Tower B, Hinjewadi Phase 1, Pune, Maharashtra 411057 (“Organiser”, “we”, “us” or “our”).</p>
    <p>By accessing the Website, submitting a registration form or participating in the Competition, you agree to these Terms and the applicable Privacy Policy and Competition guidelines.</p>
  </> },
  { id: 'eligibility', title: 'Categories and eligibility', body: <>
    <p>The Competition shall have the following categories:</p>
    <ul>
      <li><b>Kids:</b> Solo participants aged 5–12 years.</li>
      <li><b>Teens:</b> Solo participants aged 13–19 years.</li>
      <li><b>Adults:</b> Solo participants aged 20 years and above.</li>
      <li><b>Group:</b> Crews comprising 2–10 members.</li>
    </ul>
    <p>The Organiser may require age and identity proof to verify eligibility. Participants below 18 years must submit valid consent from their parent or legal guardian. Group entries must nominate an authorised representative and provide the required details and consents of all members, including parental consent for minors.</p>
    <p>The Organiser reserves the right to reject or disqualify entries that do not satisfy the eligibility requirements or contain incomplete, false or misleading information. The applicable age cut-off date shall be specified in the registration guidelines.</p>
  </> },
  { id: 'format', title: 'Competition format', body: <>
    <p>The Competition is proposed to be conducted through:</p>
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      <li>a. City auditions in 10 cities;</li>
      <li>b. City-level  National Semifinals; and</li>
      <li>c. A live National Grand Finale in Mumbai.</li>
    </ul>
    <p>Audition cities, dates, venues, schedules, performance duration and other details shall be announced through the Website or official communication channels. The Competition shall follow a freestyle dance format, permitting any dance form subject to applicable safety and performance guidelines.</p>
    <p>The Organiser reserves the right to modify the format, rounds, schedules, venues, selection process or other arrangements as reasonably required.</p>
  </> },
  { id: 'registration', title: 'Registration', body: <>
    <p>Submitting a notification or enquiry form on the Website constitutes only an expression of interest and does not amount to formal registration or guarantee participation or selection.</p>
    <p>Formal registration shall be subject to the registration process, eligibility criteria, required documents, deadlines and fees, if any, announced by the Organiser. Participants must provide accurate and complete information. Registration shall be confirmed only upon completion of the prescribed process and payment, wherever applicable.</p>
    <p>The Organiser may reject incomplete or invalid applications, close registration upon reaching capacity and prescribe or modify registration requirements, subject to applicable law.</p>
  </> },
  { id: 'judging', title: 'Judging and selection', body: <>
    <p>Performances shall be evaluated by a judging panel appointed by the Organiser based on criteria determined for the relevant round, which may include technique, creativity, choreography, expression, musicality and stage presence.</p>
    <p>The judges’ decisions regarding scoring, ranking, selection and winners shall be final and binding for Competition purposes, subject to applicable law and correction of any demonstrable administrative error.</p>
    <p>Participation in an audition or any round does not guarantee selection for the subsequent round. The Organiser may disqualify participants for misconduct, misrepresentation, breach of rules or interference with the fairness or integrity of the Competition.</p>
  </> },
  { id: 'prizes', title: 'Prizes', body: <>
    <p>The prizes in each category shall be:</p>
    <ul>
      <li><b>1st Place:</b> ₹5,00,000</li>
      <li><b>2nd Place:</b> ₹2,00,000</li>
    </ul>
    <p>For Group entries, the prize shall be awarded to the crew collectively. Distribution among crew members shall be their responsibility, and the Organiser shall not be liable for internal disputes regarding prize allocation.</p>
    <p>Prize disbursement shall be subject to identity and eligibility verification, submission of required documents and applicable tax deductions. Prizes are non-transferable and cannot be exchanged for other benefits unless approved by the Organiser or required by law.</p>
    <p>The Organiser may withhold or cancel a prize where eligibility cannot be verified, information is fraudulent or the winner has breached the Competition rules.</p>
  </> },
  { id: 'media', title: 'Recording, media and intellectual property', body: <>
    <p>Auditions,  National Semifinals and the Grand Finale may be photographed, filmed, recorded, broadcast or otherwise documented by the Organiser or its authorised partners.</p>
    <p>Any permission or licence for using a participant’s name, image, likeness, voice, performance or recordings for promotional, commercial, broadcast or other purposes shall be governed by a separate participation agreement, performer release or consent form, as applicable.</p>
    <p>Participants must ensure that music, choreography, costumes, props and other materials used in their performances do not infringe third-party rights and must obtain all necessary permissions and licences. The Organiser may refuse or stop any performance involving unlawful, infringing, unsafe or inappropriate content.</p>
    <p>Nothing in these Terms shall be construed as an unlimited assignment or waiver of statutory intellectual property or performer rights.</p>
  </> },
  { id: 'conduct', title: 'Conduct and safety', body: <>
    <p>Participants, guardians, crew members and accompanying persons must comply with venue rules, safety instructions and reasonable directions issued by the Organiser and its authorised representatives.</p>
    <p>Abusive, threatening, discriminatory, fraudulent, unsafe or disruptive conduct, damage to property, use of prohibited items and interference with the judging or Competition process are prohibited.</p>
    <p>Participants are responsible for their costumes, props, equipment, personal belongings and fitness to perform. The Organiser may issue warnings, restrict access, remove individuals or disqualify participants where necessary.</p>
    <p>Parents or legal guardians remain responsible for the supervision, welfare and travel arrangements of minor participants unless otherwise agreed in writing.</p>
  </> },
  { id: 'expenses', title: 'Expenses and participation', body: <>
    <p>Unless expressly communicated otherwise in writing, participants shall bear their own travel, accommodation, food, costumes, preparation and other participation-related expenses.</p>
    <p>Participants must report at the designated venue and time. Failure to attend or comply with the schedule may result in cancellation of the participant’s slot or disqualification.</p>
    <p>Registration fees, if applicable, shall be governed by the published registration and refund policy. Withdrawal, non-attendance or disqualification shall not automatically entitle a participant to a refund, except where required by applicable law or the applicable refund policy.</p>
  </> },
  { id: 'changes', title: 'Changes, postponement and cancellation', body: <>
    <p>The Organiser reserves the right to modify, postpone, relocate, suspend or cancel any part of the Competition due to operational requirements, venue availability, public safety, government directions, insufficient participation, technical issues or circumstances beyond its reasonable control.</p>
    <p>Reasonable efforts shall be made to notify registered participants of material changes through the Website or their registered contact details. Any applicable refund or alternative arrangement shall be governed by the published policy and applicable law.</p>
  </> },
  { id: 'privacy', title: 'Privacy and personal information', body: <>
    <p>The Organiser may collect and process personal information, including contact details, age proof, guardian details, photographs, audio, videos and payment information, for registration, eligibility verification, Competition administration, communication, prize disbursement and related purposes.</p>
    <p>Such information may be shared with authorised event, production, venue, communication and service partners where necessary for administering the Competition or where required by law. Personal information shall be handled in accordance with the Organiser’s Privacy Policy and applicable data protection laws. The Organiser does not sell personal information in the ordinary course of operating the Competition.</p>
  </> },
  { id: 'liability', title: 'Liability and indemnity', body: <>
    <p>To the maximum extent permitted by law, the Organiser shall not be liable for indirect or consequential losses, loss of opportunity, loss or damage to personal belongings, third-party service interruptions or expenses voluntarily incurred by participants.</p>
    <p>Participants shall be responsible for claims, losses or damages arising directly from their breach of these Terms, fraudulent information, infringement of third-party rights, unlawful conduct or damage caused by their negligent or wrongful acts.</p>
    <p>Nothing in these Terms shall exclude liability that cannot legally be excluded, including applicable statutory rights and liability arising from fraud, wilful misconduct or negligence to the extent such exclusion is prohibited by law.</p>
  </> },
  { id: 'force-majeure', title: 'Force majeure', body: <>
    <p>The Organiser shall not be liable for delay, modification, postponement or cancellation caused by events beyond its reasonable control, including natural disasters, epidemics, fire, flood, government restrictions, public safety concerns, strikes, venue closure or technical failures. The Organiser shall communicate revised arrangements, where reasonably practicable, subject to applicable law.</p>
  </> },
  { id: 'website-general', title: 'Website and general conditions', body: <>
    <p>The Organiser makes reasonable efforts to maintain accurate Website information but does not guarantee uninterrupted, error-free or secure access. The Organiser may update, modify or discontinue Website content or features as reasonably required.</p>
    <p>The Organiser may engage third-party vendors, production agencies and service providers for Competition administration. Third-party websites or services, where linked, shall be governed by their respective terms and policies.</p>
    <p>These Terms, together with the Privacy Policy, registration guidelines and applicable participation agreements, constitute the terms governing the Website and Competition. Any specific written participation agreement shall prevail over these Terms regarding the subject matter it specifically addresses, to the extent legally permissible.</p>
    <p>The Organiser may amend these Terms by publishing an updated version on the Website. Where fresh consent is required by law, such consent shall be obtained appropriately. If any provision is held unenforceable, the remaining provisions shall continue to apply.</p>
  </> },
  { id: 'governing-law', title: 'Governing law and jurisdiction', body: <>
    <p>These Terms shall be governed by the laws of India. Subject to applicable statutory rights and the jurisdiction of competent authorities or forums that cannot legally be excluded, the courts at Pune, Maharashtra shall have jurisdiction over disputes arising under these Terms.</p>
  </> },
  { id: 'contact', title: 'Contact us', body: <Contact after="By using the Website or proceeding with formal registration, you acknowledge that you have read, understood and agreed to these Terms and the applicable Competition rules." /> },
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
