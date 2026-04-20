import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Copy, Sparkles, Heart, Star, Lightbulb,
  AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
  FileText, MapPin, Users, Scale, BookOpen, IndianRupee,
  ClipboardList, BadgeCheck, Landmark, ScrollText, Download,
  ExternalLink, Phone, Shield, CalendarDays,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const COURT_MARRIAGE_SLUG = 'court-marriage-india-complete-guide';
const FEATURED_IMAGE = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85&auto=format&fit=crop';

export function getStaticCourtMarriagePost() {
  const now = new Date().toISOString();
  return {
    id: 'static-court-marriage-guide-2026',
    title: 'Court Marriage in India: Complete Step-by-Step Guide (2026)',
    slug: COURT_MARRIAGE_SLUG,
    excerpt: 'Everything about court marriage in India under the Special Marriage Act, 1954 — eligibility, complete documents list, 6-step procedure, official forms to download, state-wise online portals, cost breakdown, and 9 FAQs.',
    content: '',
    tags: 'Court Marriage, Special Marriage Act, Marriage Registration, Legal Guide',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Court Marriage in India: Complete Guide 2026 — Procedure, Documents & Forms | Wedora',
    meta_description: 'Complete guide to court marriage in India 2026 under the Special Marriage Act. Step-by-step procedure, documents checklist, official forms, state-wise portals, cost breakdown.',
    keywords: 'court marriage india, court marriage procedure india 2026, court marriage documents required, special marriage act 1954, court marriage certificate india, court marriage cost india, court marriage registration online',
    author: 'Wedora Wedding Planning Team',
    published_at: now, created_at: now, updated_at: now,
    status: 'published', affiliate_link: null, affiliate_label: null,
  };
}

const TOC = [
  { id: 'what-is', label: 'What is Court Marriage?' },
  { id: 'eligibility', label: 'Eligibility Criteria' },
  { id: 'documents', label: 'Complete Documents Checklist' },
  { id: 'forms', label: 'Official Forms to Download' },
  { id: 'procedure', label: '6-Step Procedure' },
  { id: 'notice', label: 'The 30-Day Notice Period Explained' },
  { id: 'certificate', label: 'Marriage Certificate' },
  { id: 'portals', label: 'State-Wise Online Portals' },
  { id: 'cost', label: 'Cost Breakdown 2026' },
  { id: 'vs-arya', label: 'Court Marriage vs Arya Samaj' },
  { id: 'nri', label: 'NRI & Foreign National Marriages' },
  { id: 'mistakes', label: 'Common Mistakes to Avoid' },
  { id: 'faq', label: 'FAQs' },
];

const ELIGIBILITY = [
  { icon: '👰', label: 'Minimum age — Bride', rule: '18 years completed', detail: 'The bride must have completed 18 years on or before the date of marriage. A bill to raise this to 21 is pending as of 2026 — check current status.', legal: 'Section 4(c), SMA 1954' },
  { icon: '🤵', label: 'Minimum age — Groom', rule: '21 years completed', detail: 'The bridegroom must have completed 21 years on or before the date of marriage. Both must prove age with original documents.', legal: 'Section 4(c), SMA 1954' },
  { icon: '💍', label: 'No living spouse', rule: 'No current valid marriage', detail: 'Neither party should have a living husband or wife from a previous valid marriage. Divorced persons must produce a court-issued decree of divorce.', legal: 'Section 4(a), SMA 1954' },
  { icon: '🧠', label: 'Sound mind & valid consent', rule: 'Capable of giving valid consent', detail: 'Both parties must be capable of giving valid consent — not suffering from a mental disorder making them unfit for marriage or prone to recurrent attacks of insanity.', legal: 'Section 4(b), SMA 1954' },
  { icon: '🚫', label: 'No prohibited relationship', rule: 'Not within prohibited degrees', detail: 'The parties must not be related within the degrees of prohibited relationship listed in the First Schedule of the Act, unless custom permits.', legal: 'Section 4(d), SMA 1954' },
  { icon: '🌍', label: 'Religion', rule: 'Open to ALL — any religion or none', detail: 'The Special Marriage Act applies to ALL citizens of India regardless of religion — Hindu, Muslim, Christian, Sikh, Jain, Buddhist, Parsi, atheist, or any community. This is its defining feature.', legal: 'Preamble & Section 4, SMA 1954' },
];

const DOCS_COUPLE = [
  { doc: 'Notice of Intended Marriage (Second Schedule form)', examples: 'Form available at the Marriage Officer\'s office or downloadable from official state portals. Signed by both parties.', required: true, tip: 'This is the actual application form. Get it from the SDM office or download from your state\'s e-district portal. It is always free.' },
  { doc: 'Proof of Date of Birth', examples: 'Birth certificate / Class 10 (Matriculation) certificate / Passport', required: true, tip: 'Class 10 mark sheet is most widely accepted. The name must match your ID proof exactly.' },
  { doc: 'Proof of Residence — 30-day residency in the district', examples: 'Aadhaar card / Voter ID / Driving licence / Ration card / Utility bill (not older than 3 months) / Passport', required: true, tip: 'At least one party must have lived in the Marriage Officer\'s district for 30+ continuous days before filing. Address on document must match the district.' },
  { doc: 'Proof of Identity', examples: 'Aadhaar card / Voter ID / Passport / PAN card / Driving licence', required: true, tip: null },
  { doc: 'Passport-size photographs', examples: '4–6 recent colour photographs each of bride and groom', required: true, tip: 'White background. Some states require Gazetted Officer attestation — confirm locally.' },
  { doc: 'Separate Affidavit of Marital Status (each party)', examples: 'Notarised affidavit on stamp paper: full name, DOB, marital status (unmarried/divorced/widowed), nationality, no prohibited relationship declaration', required: true, tip: 'Notarised by a Notary Public BEFORE visiting the SDM office. Costs ₹50–₹200 per affidavit. The SDM cannot notarise documents for you.' },
  { doc: 'Application fee receipt', examples: 'Receipt of fee paid at the SDM/Marriage Officer office counter', required: true, tip: 'Keep the original receipt — required on the day of solemnisation.' },
  { doc: 'Divorce decree (if divorced)', examples: 'Original court-issued final decree of divorce', required: false, tip: 'Must clearly state the marriage has been legally dissolved.' },
  { doc: 'Death certificate of previous spouse (if widowed)', examples: 'Original death certificate issued by municipal authority or hospital', required: false, tip: null },
];

const DOCS_WITNESSES = [
  { doc: 'Proof of Identity (each witness)', examples: 'Aadhaar card / Voter ID / Passport / PAN card — original required' },
  { doc: 'Proof of Address (each witness)', examples: 'Aadhaar / Voter ID / utility bill' },
  { doc: 'Passport-size photographs', examples: '2–4 photographs each' },
  { doc: 'Must be adults aged 18+', examples: 'Any valid age proof — witnesses must be adults' },
];

const OFFICIAL_FORMS = [
  {
    icon: '📋',
    name: 'Notice of Intended Marriage',
    schedule: 'Second Schedule — Special Marriage Act, 1954',
    purpose: 'The primary application form. Both parties sign and submit this to the Marriage Officer at least 30 days before the intended marriage date. This triggers the mandatory notice period.',
    where: 'Obtain in person at the SDM/Marriage Officer office, OR submit online via your state\'s official e-district portal.',
    downloadNote: 'Delhi: revenue.delhi.gov.in → Marriage Registration\nMaharashtra: adjudication.igrmaharashtra.gov.in/eMarriage2.0\nKarnataka: kaveri.karnataka.gov.in\nOther states: search "[state name] e-district marriage registration"',
    color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200',
  },
  {
    icon: '✍️',
    name: 'Declaration by Parties & Witnesses',
    schedule: 'Third Schedule — Special Marriage Act, 1954',
    purpose: 'Signed by both parties and all three witnesses in front of the Marriage Officer on the day of solemnisation. This is the formal consent declaration — countersigned by the Marriage Officer.',
    where: 'Provided by the Marriage Officer on the day of solemnisation. You do NOT need to bring or print this form in advance.',
    downloadNote: 'This form is issued and countersigned by the Marriage Officer at the ceremony — it is not submitted in advance and cannot be pre-downloaded.',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
  },
  {
    icon: '🏛️',
    name: 'Government Marriage Certificate',
    schedule: 'Fourth Schedule — Special Marriage Act, 1954',
    purpose: 'The official Government of India marriage certificate. Issued by the Marriage Officer after solemnisation. Signed by both parties, three witnesses, and the Marriage Officer. This is the definitive legal proof of marriage.',
    where: 'Issued by the Marriage Officer on the day of solemnisation or within 3–7 working days depending on the state.',
    downloadNote: 'Cannot be downloaded or printed in advance. Issued by the Marriage Officer with their official seal and signature after solemnisation.',
    color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', border: 'border-rose-200',
  },
  {
    icon: '📄',
    name: 'Affidavit of Marital Status',
    schedule: 'Not a scheduled form — prepared by parties before visiting',
    purpose: 'Each party separately swears that they are unmarried/divorced/widowed, their nationality, DOB, and that the marriage does not fall within prohibited degrees. Required by the Marriage Officer before accepting the notice.',
    where: 'Prepared on stamp paper (₹10–₹20) and notarised by a Notary Public near any District Court. Draft templates are available from verified legal portals.',
    downloadNote: 'Template drafts available at: edistrict.delhigovt.nic.in (Delhi)\nadjudication.igrmaharashtra.gov.in (Maharashtra)\ncleartax.in (search "affidavit for court marriage")\nOr ask a typist near any court complex — they will have a standard template.',
    color: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', border: 'border-violet-200',
  },
];

const STEPS = [
  { n: '01', title: 'Confirm 30-day residency and identify your Marriage Officer', detail: 'At least one party must have lived continuously in the district for 30 days before filing. Identify the Sub-Divisional Magistrate (SDM) or Marriage Officer appointed for your district. Visit the office to confirm working hours (typically 9:30 AM – 1:00 PM on working days) and collect or download the Notice of Intended Marriage form.', legal: 'Section 5, SMA 1954', color: 'from-violet-500 to-purple-700', tip: 'Delhi: revenue.delhi.gov.in to find your SDM | Mumbai: Joint Sub-Registrar of your area | Bengaluru: kaveri.karnataka.gov.in | Other cities: search "marriage officer [your city/district]"' },
  { n: '02', title: 'Prepare all documents and get affidavits notarised', detail: 'Collect originals and make 2 self-attested photocopies of every document. Both parties get their separate affidavits of marital status notarised by a Notary Public. Purchase stamp paper (₹10–₹20), get the affidavit typed by a typist near any court complex, and have it notarised. This cannot be done at the SDM office.', legal: 'Section 5, SMA 1954', color: 'from-sky-500 to-blue-600', tip: 'Notary Public offices are found near District Court buildings. Bring original Aadhaar + the typed affidavit text. Notarisation: ₹50–₹200 per affidavit. Total document preparation: ₹200–₹600.' },
  { n: '03', title: 'File the Notice of Intended Marriage at the SDM office', detail: 'Both parties appear together at the Marriage Officer/SDM office. Submit the signed Notice of Intended Marriage form, all supporting documents, and the application fee. The Marriage Officer verifies documents, enters the notice in the Marriage Notice Book, gives you a receipt, and affixes the notice on the office notice board — starting the 30-day period.', legal: 'Sections 5 & 6, SMA 1954', color: 'from-amber-500 to-orange-500', tip: 'Several states (Delhi, Maharashtra, Karnataka) allow online notice submission via their e-district portals — check your state first to save a trip. Physical presence is still mandatory on solemnisation day.' },
  { n: '04', title: '30-day public notice and objection period', detail: 'The notice is publicly displayed at the Marriage Officer\'s office for 30 days. Any person can file an objection, but ONLY on legal grounds from Section 7 — e.g., one party has a living spouse, or the parties are within prohibited degrees. Personal or family objections are legally invalid. If no valid objection is received, the process continues.', legal: 'Sections 6, 7 & 8, SMA 1954', color: 'from-indigo-500 to-violet-600', tip: 'If an objection is filed, the Marriage Officer must investigate within 30 days. Either party can appeal a refusal to the District Court within 30 days of the decision.' },
  { n: '05', title: 'Appear before the Marriage Officer for solemnisation', detail: 'After the 30-day period with no valid objection, both parties and ALL THREE WITNESSES appear before the Marriage Officer. Both parties sign the Declaration (Third Schedule) which the Marriage Officer countersigns. The couple exchanges verbal consent. The marriage is solemnised — no religious ceremony, no rituals. The entire solemnisation takes under an hour.', legal: 'Sections 11, 12 & 13, SMA 1954', color: 'from-emerald-500 to-teal-600', tip: 'Inform the Marriage Officer of all three witness names at least one working day in advance. All three witnesses MUST bring original ID on the day.' },
  { n: '06', title: 'Receive the official Government Marriage Certificate', detail: 'Immediately after solemnisation, the Marriage Officer issues the official marriage certificate, signed by both parties, all three witnesses, and the Marriage Officer, with the official seal. This is entered in the Marriage Certificate Book. The certificate is valid nationwide and internationally — accepted by every court, government office, embassy, and bank in India.', legal: 'Section 13, SMA 1954', color: 'from-rose-500 to-pink-600', tip: 'Request at least 2 certified copies on the day. You will need them separately for passport office, bank KYC, insurance, and property records. Getting additional copies later requires a formal application.' },
];

const STATE_PORTALS = [
  { state: 'Delhi', portal: 'edistrict.delhigovt.nic.in', url: 'https://edistrict.delhigovt.nic.in', fee_hma: '₹100', fee_sma: '₹150', tatkal: '₹10,000 (HMA only)', notes: 'Online notice submission available. Tatkal under HMA only — not SMA.' },
  { state: 'Maharashtra', portal: 'adjudication.igrmaharashtra.gov.in/eMarriage2.0', url: 'https://adjudication.igrmaharashtra.gov.in/eMarriage2.0/', fee_hma: '₹100', fee_sma: '₹200', tatkal: 'Not available', notes: 'Full online notice with Aadhaar-based identity verification.' },
  { state: 'Karnataka', portal: 'kaveri.karnataka.gov.in', url: 'https://kaveri.karnataka.gov.in', fee_hma: '₹5 + ₹30 cert', fee_sma: '₹200', tatkal: 'Not available', notes: 'Certificate downloadable online with QR code and digital signature.' },
  { state: 'Tamil Nadu', portal: 'tnreginet.gov.in', url: 'https://tnreginet.gov.in', fee_hma: '₹100', fee_sma: '₹200', tatkal: 'Not available', notes: 'Online registration. Certificate issued in 3–5 working days.' },
  { state: 'Uttar Pradesh', portal: 'igrsup.gov.in', url: 'https://igrsup.gov.in', fee_hma: '₹10', fee_sma: '₹500', tatkal: 'Not available', notes: 'Online application. Physical presence at Sub-Registrar for verification.' },
  { state: 'Telangana', portal: 'registration.telangana.gov.in', url: 'https://registration.telangana.gov.in', fee_hma: '₹200', fee_sma: '₹500', tatkal: 'Not available', notes: 'Via Mee Seva centres or Sub-Registrar offices.' },
  { state: 'West Bengal', portal: 'wbregistration.gov.in', url: 'https://wbregistration.gov.in', fee_hma: '₹25', fee_sma: '₹200', tatkal: 'Not available', notes: 'Online appointment booking available.' },
  { state: 'Rajasthan', portal: 'pehchan.raj.nic.in', url: 'https://pehchan.raj.nic.in', fee_hma: '₹20', fee_sma: '₹200', tatkal: 'Not available', notes: 'Registration through Pehchan portal.' },
];

const COST_ITEMS = [
  { item: 'Notice of Intended Marriage — Application fee (SMA)', range: '₹100 – ₹500', notes: 'Delhi ₹150 | Maharashtra ₹200 | Karnataka ₹200 | UP ₹500. Paid at the SDM/Marriage Officer office.' },
  { item: 'Affidavit preparation — notarisation (per person)', range: '₹50 – ₹200', notes: 'Stamp paper ₹10–₹20 + typing + Notary fee. Both parties need separate affidavits.' },
  { item: 'Document photocopying and attestation', range: '₹100 – ₹300', notes: 'Photocopies + self-attestation + any Gazetted Officer attestation if required.' },
  { item: 'Marriage certificate (additional certified copies)', range: 'Included / ₹50–₹200 each', notes: 'First certificate included in fee. Additional certified copies ₹50–₹200 each.' },
  { item: 'Advocate/agent fees (entirely optional)', range: '₹2,000 – ₹10,000', notes: 'NOT mandatory. The entire process can be done by the couple themselves using this guide.' },
  { item: 'Tatkal service — Delhi, HMA registrations only', range: '₹10,000', notes: 'Delhi Revenue Dept Tatkal under HMA only. No tatkal available under the Special Marriage Act.' },
];

const COMPARISON = [
  { point: 'Legal framework', court: 'Special Marriage Act, 1954', arya: 'Arya Samaj ceremony + Hindu Marriage Act / SMA registration' },
  { point: 'Religion requirement', court: 'None — any religion or none', arya: 'Both parties traditionally Hindu; inter-religion requires SMA' },
  { point: 'Notice period', court: '30-day mandatory public notice (cannot be shortened)', arya: 'No notice period under HMA — can register same day' },
  { point: 'Ceremony', court: 'No religious ceremony — civil verbal declaration only', arya: 'Full Vedic ceremony with fire, vows, saptapadi (2–3 hrs)' },
  { point: 'Witnesses', court: '3 witnesses (mandatory)', arya: '2 witnesses (Arya Samaj) + SDM registration' },
  { point: 'Privacy', court: 'Notice displayed publicly on board for 30 days', arya: 'More private — no public notice under HMA' },
  { point: 'Total timeline', court: '35–45 days (30-day notice + processing)', arya: '1 day ceremony + 7–30 days SDM registration' },
  { point: 'DIY cost', court: '₹500 – ₹2,000', arya: '₹5,000 – ₹15,000 (ceremony + registration)' },
  { point: 'Best for', court: 'Inter-religion couples, NRIs, couples wanting civil process', arya: 'Hindu couples wanting religious ceremony with legal validity' },
];

const FAQS = [
  { q: 'Is court marriage valid for all purposes in India — passport, visa, property?', a: 'Yes, completely. The marriage certificate issued after court marriage under the Special Marriage Act, 1954 is the official Government of India marriage certificate. It is accepted by all courts, passport offices (for spouse name endorsement), consulates and embassies for visa applications, banks for KYC, insurance companies for nominations, and property registration offices. It is the strongest legal proof of marriage in India.' },
  { q: 'Can court marriage be done in one day in India?', a: 'No — not under the Special Marriage Act, 1954. The 30-day public notice period is mandated by law (Section 6) and cannot be shortened. The complete process takes 35–45 days minimum. What is marketed as "same-day court marriage" is either the Delhi government\'s Tatkal service under the Hindu Marriage Act (a different act, for already-performed Hindu ceremonies), or an Arya Samaj ceremony. Neither is the same as an SMA court marriage.' },
  { q: 'Do parents need to give consent for a court marriage?', a: 'No. Under the Special Marriage Act, 1954, parental consent is NOT required if both parties meet the minimum age requirements (bride 18+, groom 21+). During the 30-day notice period, anyone including parents can file an objection — but ONLY on specific legal grounds under Section 4 (e.g., one party has a living spouse). A family\'s personal or social disapproval is not a valid legal ground and will be dismissed.' },
  { q: 'What is the 30-day notice period and can it be avoided?', a: 'The notice period is a mandatory 30-day public display of your intention to marry, as required by Section 6 of the SMA 1954. It cannot be shortened or avoided under the SMA. The only way to avoid a notice period is to marry under the Hindu Marriage Act (requires both parties to be Hindu) — HMA registration of a religious ceremony does not require a public notice period.' },
  { q: 'Can an inter-religion couple get court married in India?', a: 'Yes — this is the primary purpose of the Special Marriage Act. It applies to all citizens of India regardless of religion. A Hindu and a Muslim, a Christian and a Sikh, or any combination can marry under the SMA with full legal validity. Neither party needs to convert or perform any religious ceremony.' },
  { q: 'How many witnesses are required for court marriage?', a: 'THREE witnesses are required under Section 12 of the Special Marriage Act, 1954 — one more than the two required for Arya Samaj or HMA registration. All three must be adults (18+), present in person at the SDM office on the day of solemnisation, and carry their original identity proof (Aadhaar/Voter ID/Passport). Witnesses can be friends, colleagues, or family members.' },
  { q: 'Can an NRI or foreign national get court married in India?', a: 'Yes. For a foreign national marrying in India under the SMA, the foreign national must have lived in India for at least 30 days before filing notice. Additional documents required include: valid foreign passport, valid Indian visa, proof of 30-day stay (hotel/rental/SHO letter), marital status certificate or NOC from their home country\'s embassy in India, and certified translations of foreign documents if not in English.' },
  { q: 'What happens if someone objects during the 30-day notice period?', a: 'Under Section 7, the Marriage Officer records the objection and investigates within 30 days. The objection must allege violation of a Section 4 eligibility condition — for example, that one party has a living spouse. A family member\'s personal objection is not legally valid. If the Marriage Officer finds the objection baseless, the marriage proceeds. If they refuse, either party can appeal to the District Court within 30 days.' },
  { q: 'What is the difference between court marriage and marriage registration?', a: 'Court marriage (SMA) is the solemnisation of the marriage itself — the couple gets legally married at the SDM office in a civil ceremony. Marriage registration (HMA) is the recording of a marriage that was already solemnised elsewhere in a religious ceremony. Court marriage produces both the ceremony and the certificate in one unified process. Marriage registration under HMA simply records an already-performed ceremony.' },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-sky-50/50 transition-colors" aria-expanded={open}>
        <span className="font-semibold text-gray-900 pr-2 text-sm md:text-base">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-sky-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{item.a}</div>}
    </div>
  );
}

function CtaSignup({ headline, sub }) {
  return (
    <div className="my-10 rounded-2xl bg-gradient-to-r from-rose-gold to-plum p-px shadow-xl shadow-rose-gold/20">
      <div className="rounded-[calc(1rem-1px)] bg-white px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-serif font-bold text-gray-900 text-lg leading-snug">{headline}</p>
          <p className="text-sm text-gray-500 mt-1">{sub}</p>
        </div>
        <Link to="/signup" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
          Get started free <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function CtaTool({ icon: Icon, headline, sub, btnLabel, btnTo, color }) {
  return (
    <div className={`my-10 rounded-2xl border-2 ${color.border} ${color.bg} p-5 flex flex-col sm:flex-row items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center shrink-0 shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className={`font-semibold ${color.title} mb-0.5`}>{headline}</p>
        <p className="text-sm text-gray-500 leading-snug">{sub}</p>
      </div>
      <Link to={btnTo} className={`shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r ${color.grad} text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap`}>
        {btnLabel} <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function CtaInfoBox({ icon: Icon, title, body, color }) {
  return (
    <div className={`my-6 flex gap-4 p-5 rounded-2xl ${color.bg} border ${color.border}`}>
      <Icon className={`w-5 h-5 ${color.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`font-bold ${color.title} mb-1 text-sm`}>{title}</p>
        <p className={`text-sm leading-relaxed ${color.body}`}>{body}</p>
      </div>
    </div>
  );
}

export function CourtMarriageGuideArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq] = useState(-1);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-400/15 to-blue-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/60">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <Link to="/" className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent">Wedora</Link>
        </div>
      </nav>

      <header className="relative pt-24 pb-16 md:pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-400 font-medium">
            <Link to="/blog" className="hover:text-rose-gold transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-sky-600 font-semibold">Marriage Registration Guide</span>
            <ChevronRight className="w-3 h-3" />
            <span>Court Marriage</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-sky-400/30 shadow-sm mb-6">
            <Scale className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">Special Marriage Act 1954 · Complete Legal Guide</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4">
            Court Marriage{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600">in India</span>
          </h1>
          <p className="text-base text-sky-700 font-semibold mb-5">Complete Step-by-Step Guide 2026 · Special Marriage Act, 1954</p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[
              { icon: '⚖️', label: 'Legally accurate — SMA 1954' },
              { icon: '📋', label: '6-step procedure' },
              { icon: '📄', label: 'Full documents list' },
              { icon: '⬇️', label: 'Official forms guide' },
              { icon: '🗺️', label: 'State-wise portals' },
              { icon: '💰', label: '2026 cost breakdown' },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-sky-200/60 text-gray-700 text-xs font-semibold shadow-sm">
                {p.icon} {p.label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              <Clock className="w-4 h-4 text-rose-gold" />{readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              <Heart className="w-4 h-4 text-rose-gold" fill="currentColor" />{post.author || 'Wedora Team'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
              Updated {new Date(post.published_at || post.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {post.featured_image && (
          <div className="max-w-5xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl shadow-sky-400/15 border-4 border-white ring-1 ring-sky-100">
            <img src={ensureHttps(post.featured_image)} alt="Court marriage India — legal guide 2026" className="w-full aspect-[21/9] object-cover object-center" loading="eager" />
          </div>
        )}
      </header>

      {/* TOC */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white border border-sky-100 shadow-sm overflow-hidden">
          <button type="button" onClick={() => setShowToc(!showToc)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-sky-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-gray-900">Table of Contents</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TOC.length} sections</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} />
          </button>
          {showToc && (
            <div className="border-t border-gray-100 px-5 py-4 grid sm:grid-cols-2 gap-1">
              {TOC.map((item, i) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setShowToc(false)} className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-sky-600 transition-colors group">
                  <span className="w-5 h-5 rounded-md bg-sky-50 text-sky-600 text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">{i + 1}</span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-14 md:space-y-20">

        {/* WHAT IS */}
        <section id="what-is">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400/20 via-blue-300/15 to-violet-300/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-sky-50/60 border border-sky-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-sky-500 shrink-0" /> What is Court Marriage?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Court marriage — officially called <strong>solemnisation of marriage under the Special Marriage Act, 1954</strong> — is a legally recognised form of marriage in India that requires no religious ceremony, rituals, or customs of any kind.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                It takes place before a <strong>Marriage Officer</strong> (the Sub-Divisional Magistrate or an officer appointed by the state government) and <strong>three witnesses</strong>. The couple gives verbal consent, signs a declaration in the Third Schedule form, and receives a Government of India marriage certificate valid nationwide and internationally.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                The Special Marriage Act, 1954 was specifically enacted to allow <strong>any two people to marry regardless of religion, caste, or community</strong> — making it the definitive choice for inter-religion couples, couples preferring a purely civil process, and NRIs marrying in India.
              </p>
            </div>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🌍', title: 'Any religion — no exceptions', desc: 'Hindu + Muslim, Christian + Sikh, atheist + anyone. The SMA explicitly has no religion requirement. This is its defining feature.' },
              { icon: '⚖️', title: 'Strongest legal standing', desc: 'The SMA marriage certificate is the definitive legal document — accepted by every court, embassy, passport office, and government institution.' },
              { icon: '🤝', title: 'No ceremony needed', desc: 'No pandit, priest, or rituals. Just the couple, three witnesses, and the Marriage Officer. Solemnisation takes under an hour.' },
            ].map((c) => (
              <div key={c.title} className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-3xl">{c.icon}</span>
                <p className="font-semibold text-gray-900">{c.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <CtaSignup headline="Planning your court marriage? Wedora keeps you organised." sub="Track documents, follow your 30-day timeline, manage everything — all in one free tool." />

        {/* ELIGIBILITY */}
        <section id="eligibility">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg"><Users className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Eligibility criteria</h2>
              <p className="text-gray-500 text-sm mt-0.5">Section 4, Special Marriage Act, 1954</p>
            </div>
          </div>
          <div className="space-y-3">
            {ELIGIBILITY.map((item) => (
              <div key={item.label} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-violet-200/60 transition-all">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200/60">{item.rule}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                  <p className="text-xs text-gray-400 mt-1 italic">{item.legal}</p>
                </div>
              </div>
            ))}
          </div>
          <CtaInfoBox icon={Lightbulb} title="No parental consent required — legally"
            body="Under the Special Marriage Act, parental consent is not a legal requirement if both parties are above the minimum age. During the notice period, anyone can file an objection — but only on specific legal grounds under Section 4. Personal family disapproval is not a valid legal ground and will be dismissed by the Marriage Officer."
            color={{ bg: 'bg-violet-50', border: 'border-violet-200/60', icon: 'text-violet-600', title: 'text-violet-900', body: 'text-violet-800' }} />
        </section>

        {/* DOCUMENTS */}
        <section id="documents">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg"><ClipboardList className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Complete documents checklist</h2>
              <p className="text-gray-500 text-sm mt-0.5">Bring originals + 2 self-attested photocopies of every document.</p>
            </div>
          </div>

          <h3 className="font-serif font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">A</span>
            Bride & Groom — documents required from each party
          </h3>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white mb-6">
            <div className="divide-y divide-gray-50">
              {DOCS_COUPLE.map((row, i) => (
                <div key={row.doc} className={`p-4 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${row.required ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {row.required ? '✓' : '?'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{row.doc}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${row.required ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {row.required ? 'Required' : 'If applicable'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed">{row.examples}</p>
                      {row.tip && (
                        <div className="mt-2 flex gap-1.5 text-xs text-sky-700 bg-sky-50 rounded-lg px-3 py-2">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-500" />
                          <span>{row.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="font-serif font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">B</span>
            All 3 Witnesses — documents required from each
          </h3>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white mb-4">
            <div className="divide-y divide-gray-50">
              {DOCS_WITNESSES.map((row, i) => (
                <div key={row.doc} className={`flex items-start gap-3 p-4 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{row.doc}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{row.examples}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CtaInfoBox icon={AlertTriangle} title="Bring originals — photocopies alone will be rejected"
            body="The Marriage Officer physically verifies all original documents before accepting the application. Originals are returned to you immediately, but they must be presented in person. Arriving with only photocopies will result in your notice being rejected on the spot."
            color={{ bg: 'bg-rose-50', border: 'border-rose-200/60', icon: 'text-rose-600', title: 'text-rose-900', body: 'text-rose-800' }} />
        </section>

        <CtaTool icon={ClipboardList} headline="Track every document with Wedora's free checklist"
          sub="Tick off each document as you collect it. Share with your partner and all three witnesses."
          btnLabel="Open free checklist" btnTo="/signup"
          color={{ bg: 'bg-sky-50', border: 'border-sky-200', grad: 'from-sky-500 to-blue-600', title: 'text-sky-900' }} />

        {/* FORMS */}
        <section id="forms">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"><Download className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Official forms — what to download & where</h2>
              <p className="text-gray-500 text-sm mt-0.5">All forms sourced from Special Marriage Act 1954 Schedules and official state government portals.</p>
            </div>
          </div>
          <div className="space-y-4">
            {OFFICIAL_FORMS.map((form) => (
              <div key={form.name} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className={`px-5 py-4 bg-gradient-to-r ${form.color} text-white flex items-center gap-3`}>
                  <span className="text-2xl">{form.icon}</span>
                  <div>
                    <p className="font-bold text-base">{form.name}</p>
                    <p className="text-white/80 text-xs">{form.schedule}</p>
                  </div>
                </div>
                <div className={`p-5 ${form.bg} border-b ${form.border}`}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Purpose</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{form.purpose}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Where to get it</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{form.where}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 flex items-start gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{form.downloadNote}</p>
                </div>
              </div>
            ))}
          </div>
          <CtaInfoBox icon={Lightbulb} title="Can't find the form online? Just go in person."
            body="If state portals are down or the form isn't listed online, walk into the SDM/Marriage Officer office during working hours (typically 9:30 AM – 1:00 PM on working days). The Notice of Intended Marriage form is always available at the office counter. It is always free — never pay for any government form."
            color={{ bg: 'bg-amber-50', border: 'border-amber-200/60', icon: 'text-amber-600', title: 'text-amber-900', body: 'text-amber-800' }} />
        </section>

        {/* PROCEDURE */}
        <section id="procedure">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"><ScrollText className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">6-step procedure — notice to certificate</h2>
              <p className="text-gray-500 text-sm mt-0.5">Total timeline: 35–45 days. DIY cost: ₹500–₹2,000. No advocate needed.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-[1.3rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-violet-400 via-emerald-400 to-rose-400 hidden sm:block" />
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div key={step.n} className="relative flex gap-4 sm:gap-6">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold flex items-center justify-center shrink-0 shadow-lg z-10 text-sm`}>{step.n}</div>
                  <div className="flex-1 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-serif font-bold text-gray-900">{step.title}</p>
                      <span className="shrink-0 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{step.legal}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.detail}</p>
                    {step.tip && (
                      <div className="mt-3 flex gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                        <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-emerald-800 text-xs leading-relaxed">{step.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaTool icon={FileText} headline="Done with the court marriage? Send digital invitations free."
          sub="Wedora's WhatsApp invite builder has 6 ready templates — including a formal civil ceremony style."
          btnLabel="Create free invite" btnTo="/blog/whatsapp-wedding-invitations-modern-trend-guide"
          color={{ bg: 'bg-violet-50', border: 'border-violet-200', grad: 'from-violet-500 to-purple-700', title: 'text-violet-900' }} />

        {/* 30-DAY NOTICE */}
        <section id="notice">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-sky-200/80 bg-gradient-to-br from-sky-50 to-blue-50/40 shadow-xl">
            <div className="px-6 py-4 bg-sky-100/80 border-b border-sky-200 flex items-center gap-3">
              <CalendarDays className="w-7 h-7 text-sky-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-sky-950">The 30-day notice period — everything you need to know</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5 text-sm text-sky-900/90">
              {[
                { q: 'What exactly happens during the notice period?', a: 'Under Section 6, the Marriage Officer affixes a copy of your notice to a conspicuous place in the office (public notice board) and sends a copy by registered post to both parties at their given addresses. The notice contains your full names, ages, addresses, and the intended marriage date — visible to anyone who visits the office.' },
                { q: 'Who can object, and on what grounds?', a: 'Any person can file an objection within 30 days (Section 7). But the objection MUST allege a specific legal violation — e.g., one party has a living spouse, the parties are within prohibited degrees of relationship, or a party does not meet the age requirement. Personal, family, or social objections ("we don\'t approve of the match") are not valid legal grounds and will be dismissed.' },
                { q: 'What happens if an objection is filed?', a: 'The Marriage Officer must investigate within 30 days of receiving the objection (Section 8). During investigation, the marriage cannot proceed. After investigation, the Marriage Officer decides whether to proceed or refuse. Either party can appeal a refusal to the District Court within 30 days of the officer\'s decision.' },
                { q: 'Can the 30-day period be shortened?', a: 'No. Section 6 of the SMA 1954 mandates this period and it cannot be shortened by any court or government officer. The only way to avoid the public notice period is to marry under the Hindu Marriage Act (requires both parties to be Hindu) — HMA registration of a religious ceremony does not require a 30-day public notice.' },
                { q: 'Can I file the notice online without visiting the SDM office?', a: 'Several states now allow online notice submission — Delhi (edistrict.delhigovt.nic.in), Maharashtra (adjudication.igrmaharashtra.gov.in/eMarriage2.0), and Karnataka (kaveri.karnataka.gov.in) among others. However, physical presence is mandatory on the day of solemnisation when both parties and witnesses appear before the Marriage Officer.' },
              ].map((item) => (
                <div key={item.q} className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sky-950 mb-1">{item.q}</p>
                    <p className="text-sky-800/90 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATE */}
        <section id="certificate">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg"><BadgeCheck className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">The Marriage Certificate — what it contains and where it's valid</h2>
              <p className="text-gray-500 text-sm mt-0.5">Section 13, Special Marriage Act, 1954</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 mb-4">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-bold text-gray-900 mb-3">What the certificate contains</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Full names of both parties', 'Date and place of marriage', 'Names, addresses and signatures of 3 witnesses', 'Signature of both parties', 'Signature and official seal of Marriage Officer', 'Certificate number for official records'].map((item) => (
                    <li key={item} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-3">Accepted for all these purposes</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {['Passport — spouse name endorsement', 'Visa applications (all countries)', 'Bank accounts — joint KYC', 'Property registration — joint ownership', 'Insurance — spouse nomination', 'All Indian courts and legal proceedings', 'Foreign embassy documentation'].map((item) => (
                    <li key={item} className="flex gap-2"><ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <CtaInfoBox icon={Lightbulb} title="Request at least 2 certified copies on the day"
            body="You will need the certificate simultaneously for passport office, bank KYC, insurance nomination, and property records — often at the same time. Request at least 2 certified copies from the Marriage Officer on the day of solemnisation. Getting additional copies later requires a formal application and additional time."
            color={{ bg: 'bg-emerald-50', border: 'border-emerald-200/60', icon: 'text-emerald-600', title: 'text-emerald-900', body: 'text-emerald-800' }} />
        </section>

        {/* STATE PORTALS */}
        <section id="portals">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg"><MapPin className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">State-wise official online portals</h2>
              <p className="text-gray-500 text-sm mt-0.5">All portals are official government sources — verified April 2026.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">State</th>
                    <th className="px-4 py-3.5 font-semibold">Official Portal</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">HMA Fee</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">SMA Fee</th>
                    <th className="px-4 py-3.5 font-semibold hidden lg:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {STATE_PORTALS.map((row, i) => (
                    <tr key={row.state} className={`hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.state}</td>
                      <td className="px-4 py-3">
                        <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 text-xs">
                          {row.portal} <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-600 hidden sm:table-cell">{row.fee_hma}</td>
                      <td className="px-4 py-3 font-medium text-sky-600 hidden md:table-cell">{row.fee_sma}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden lg:table-cell">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <CtaInfoBox icon={Lightbulb} title="Portal not working? Visit the SDM office directly."
            body="State government portals frequently experience downtime. If you can't access yours, visit the SDM/Marriage Officer office directly during working hours (9:30 AM – 1:00 PM on working days). The physical and online processes are identical — bring the same documents either way."
            color={{ bg: 'bg-indigo-50', border: 'border-indigo-200/60', icon: 'text-indigo-600', title: 'text-indigo-900', body: 'text-indigo-800' }} />
        </section>

        {/* COST */}
        <section id="cost">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"><IndianRupee className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Complete cost breakdown 2026</h2>
              <p className="text-gray-500 text-sm mt-0.5">No agent or lawyer required. The entire process is DIY-friendly.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">Item</th>
                    <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Cost</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COST_ITEMS.map((row, i) => (
                    <tr key={row.item} className={`hover:bg-emerald-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 text-gray-800 font-medium text-sm">{row.item}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 whitespace-nowrap">{row.range}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.notes}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-600 text-white">
                    <td className="px-4 py-4 font-bold">💰 Total DIY (no advocate)</td>
                    <td className="px-4 py-4 font-bold">₹500 – ₹2,000</td>
                    <td className="px-4 py-4 text-white/80 text-xs hidden md:table-cell">The most affordable legally recognised marriage route in India.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <CtaInfoBox icon={Shield} title="Do NOT pay touts near court complexes"
            body='People in "advocate dress" outside SDM offices routinely offer to expedite court marriages for ₹5,000–₹20,000. This is unnecessary — the 30-day notice cannot legally be shortened by anyone. The process is straightforward. Follow this guide and handle it yourself, or engage a verified registered advocate if you genuinely need legal assistance.'
            color={{ bg: 'bg-rose-50', border: 'border-rose-200/60', icon: 'text-rose-600', title: 'text-rose-900', body: 'text-rose-800' }} />
        </section>

        <CtaTool icon={IndianRupee} headline="Celebrating after court marriage? Plan it on Wedora."
          sub="Free budget calculator — allocate every rupee smartly across your post-marriage celebration."
          btnLabel="Open budget calculator" btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', title: 'text-emerald-900' }} />

        {/* VS ARYA SAMAJ */}
        <section id="vs-arya">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"><Scale className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Court Marriage vs Arya Samaj — which is right for you?</h2>
              <p className="text-gray-500 text-sm mt-0.5">Side-by-side comparison to help you decide.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold w-[28%]">Point</th>
                    <th className="px-4 py-3.5 font-semibold">⚖️ Court Marriage (SMA)</th>
                    <th className="px-4 py-3.5 font-semibold">🕉️ Arya Samaj + HMA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COMPARISON.map((row, i) => (
                    <tr key={row.point} className={`hover:bg-amber-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-xs md:text-sm">{row.point}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed">{row.court}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed">{row.arya}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Choose Court Marriage (SMA)</strong> for inter-religion couples, NRIs, or when you prefer a civil process with no ceremony.
              <strong className="ml-1">Choose Arya Samaj + HMA</strong> if both parties are Hindu, you want a Vedic ceremony, and privacy matters to you.
              <Link to="/blog/arya-samaj-marriage-complete-guide-india" className="text-amber-700 font-semibold underline ml-1">Read our full Arya Samaj guide →</Link>
            </p>
          </div>
        </section>

        {/* NRI */}
        <section id="nri">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-violet-50/40 shadow-xl">
            <div className="px-6 py-4 bg-indigo-100/80 border-b border-indigo-200 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-indigo-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-950">NRI & foreign national court marriages</h2>
            </div>
            <div className="p-6 md:p-8 space-y-4 text-sm text-indigo-900/90">
              <p className="leading-relaxed">The Special Marriage Act applies to all Indian citizens including NRIs, and foreign nationals marrying Indian citizens in India. Additional documents apply:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'For NRI (Indian citizen residing abroad)', items: ['Valid Indian passport', 'Current Indian visa or OCI/PIO card', 'Proof of 30-day continuous stay in India (hotel records, rental agreement, or SHO letter)', 'Notarised affidavit of marital status (same as resident Indians)', 'All standard documents listed in the checklist above'] },
                  { title: 'For foreign national marrying an Indian', items: ['Valid foreign passport', 'Valid Indian visa showing 30+ days\' stay', 'Proof of Indian address (hotel/rental agreement/SHO letter)', 'No-Objection Certificate or Marital Status Certificate from home country\'s Embassy in India', 'Certified English translation of all foreign-language documents'] },
                ].map((block) => (
                  <div key={block.title} className="bg-white/80 rounded-xl p-4">
                    <p className="font-bold text-indigo-900 mb-2 text-xs uppercase tracking-wider">{block.title}</p>
                    <ul className="space-y-1.5">
                      {block.items.map((item) => (
                        <li key={item} className="flex gap-2 text-indigo-800 text-xs"><ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 p-4 rounded-xl bg-white border border-indigo-200/60">
                <Phone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-indigo-700 text-xs leading-relaxed"><strong>Tip:</strong> NRIs and foreign nationals should contact the SDM/Marriage Officer office by phone or email in advance to confirm the exact document requirements — these can vary by state and officer. Allow 45–60 days total for the process. Embassy document processing alone can take 2–3 weeks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MISTAKES */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">8 mistakes that delay or derail court marriages</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {[
                { m: 'Not having 30 days\' continuous residency before filing', r: 'At least one party must have lived in the Marriage Officer\'s district for a continuous 30 days BEFORE the notice is filed — not 30 days before the wedding. If you just moved or are staying temporarily, the Marriage Officer can reject the application. Confirm your residency start date before booking your appointment.' },
                { m: 'Filing the notice without both parties present', r: 'Both the bride and groom must appear together in person when filing the Notice of Intended Marriage at the SDM office. One party cannot represent both. Sending a representative or only one party will result in rejection of the notice.' },
                { m: 'Arriving with unnotarised affidavits', r: 'The affidavit of marital status must be notarised by a Notary Public BEFORE visiting the SDM office. The Marriage Officer\'s office cannot notarise documents. Arriving with un-notarised affidavits means the notice will be rejected and you will need to return — losing time.' },
                { m: 'Bringing only 2 witnesses instead of 3', r: 'The SMA requires exactly 3 witnesses — one more than most people expect. If only 2 witnesses appear on the day of solemnisation, the marriage cannot be solemnised. All three must be adults with original ID proof. Confirm with all three witnesses the day before.' },
                { m: 'Witnesses not carrying their original ID proof', r: 'Witnesses must present original identity documents (Aadhaar, Voter ID, or Passport). Photocopies, digital screenshots, or phone images are not accepted. The Marriage Officer verifies originals. Brief all three witnesses on this requirement in advance.' },
                { m: 'Believing "tatkal court marriage" shortens the 30-day period', r: 'There is no tatkal or expedited service under the Special Marriage Act, 1954. The 30-day notice period cannot legally be shortened by any agent, tout, or advocate. What is sold as "tatkal court marriage" is either the Delhi HMA Tatkal service (a different act) or an Arya Samaj ceremony — neither is an SMA court marriage.' },
                { m: 'Not informing the Marriage Officer of witness names in advance', r: 'The Delhi SDM office explicitly advises submitting the names of all three witnesses at least one working day before solemnisation. Other states follow similar practice. Arriving with witnesses whose names haven\'t been filed can cause delays on the solemnisation day.' },
                { m: 'Collecting only one certified copy of the marriage certificate', r: 'Most couples need the certificate simultaneously for their passport, bank KYC, insurance nomination, and property registration. If you only take one copy, you will need to make a formal application for additional copies later — which takes additional time. Always request at least 2 certified copies on the day of solemnisation.' },
              ].map((item) => (
                <div key={item.m} className="flex gap-3">
                  <span className="text-amber-600 font-bold text-lg leading-snug shrink-0">×</span>
                  <div>
                    <p className="font-semibold text-amber-950 mb-1">{item.m}</p>
                    <p className="text-amber-800/80 text-sm leading-relaxed">{item.r}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaSignup headline="Ready to start? Wedora's checklist tracks every document and deadline." sub="Court marriage document tracker, celebration planning, invitation generator — all free on Wedora." />

        {/* RELATED ARTICLES */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Shield className="w-5 h-5 text-sky-600" />
              <p className="font-serif font-bold text-gray-900">Marriage Registration Cluster — More Guides</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Arya Samaj Marriage: Complete Guide 2026', slug: 'arya-samaj-marriage-complete-guide-india', icon: '🕉️' },
                { title: 'WhatsApp Wedding Invitations — Modern Guide', slug: 'whatsapp-wedding-invitations-modern-trend-guide', icon: '💬' },
                { title: 'Last-Minute Wedding Checklist: 30 Days Before', slug: 'last-minute-wedding-checklist-30-days-before', icon: '✅' },
                { title: 'Wedding Budget Calculator: Allocate Money Smartly', slug: 'wedding-budget-calculator-how-to-allocate-money', icon: '🧮' },
                { title: 'Wedding Photography Checklist: 50 Must-Have Shots', slug: 'wedding-photography-checklist-must-have-shots', icon: '📷' },
                { title: 'Complete Indian Wedding Budget Guide 2026', slug: 'indian-wedding-budget-guide-2026', icon: '💰' },
              ].map((a) => (
                <Link key={a.slug} to={`/blog/${a.slug}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-200/60 transition-all group">
                  <span className="text-lg">{a.icon}</span>
                  <p className="text-sm text-gray-700 group-hover:text-sky-700 font-medium transition-colors">{a.title}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-sky-500 shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BIG CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 p-1 shadow-2xl shadow-sky-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">Plan your celebration after court marriage — on Wedora</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Invitation generator, budget planner, checklist, guest manager — all the tools you need for your post-court-marriage celebration, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-sky-50 transition-colors shadow-lg">
                Start free with Wedora
              </Link>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 text-center">Frequently asked questions</h2>
          <p className="text-center text-gray-500 mb-8 text-sm max-w-2xl mx-auto">
            The most-searched questions about court marriage in India — answered with legally accurate information sourced from the Special Marriage Act, 1954.
          </p>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">Court marriage is simpler than most people think</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The entire process costs under ₹2,000, requires no advocate, and is completely self-serviceable. File the notice, wait 30 days, appear with three witnesses, sign the declaration, receive your certificate. Follow this guide, download the correct form from your state portal, get your affidavits notarised, and walk in. Your Government of India marriage certificate will be in hand within 35–45 days.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Special Marriage Act 1954</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Legal marriage guide India</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free planning tools</span>
          </div>
        </section>

        {affiliateHref && (
          <aside className="rounded-2xl border border-rose-gold/25 bg-white p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">Partner pick</p>
            <a href={affiliateHref} target="_blank" rel="sponsored noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">{affiliateCtaLabel}</a>
          </aside>
        )}
      </main>

      <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Share:</span>
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative" title="Copy link">
              <Copy className="w-4 h-4" />
              {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Copied!</span>}
            </button>
          </div>
          <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
            Plan your wedding free — Wedora
          </Link>
        </div>
      </div>
    </div>
  );
}
