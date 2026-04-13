import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Copy,
  Sparkles,
  Heart,
  Star,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
  Phone,
  Users,
  CalendarDays,
  Shield,
  ScrollText,
  BadgeCheck,
  ChevronRight,
  Landmark,
  Scale,
  BookOpen,
  IndianRupee,
  ClipboardList,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

// ─── Slug & static post ──────────────────────────────────────────────────────

export const ARYA_SAMAJ_MARRIAGE_SLUG = 'arya-samaj-marriage-complete-guide-india';

// Unsplash: Indian wedding marigold mandap / ceremony decor — verified Indian content
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1586952518485-11b180e92764?w=1600&q=85&auto=format&fit=crop';

export function getStaticAryaSamajPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-arya-samaj-marriage-2026',
    title: 'Arya Samaj Marriage in India: Complete Guide (2026)',
    slug: ARYA_SAMAJ_MARRIAGE_SLUG,
    excerpt:
      'Everything you need to know about Arya Samaj marriage in India — eligibility, procedure, documents, certificate, legal validity, cost, and how to register. A complete 2026 guide.',
    content: '',
    tags: 'Arya Samaj Marriage, Marriage Registration, Indian Wedding, Legal Guide',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Arya Samaj Marriage in India: Complete Guide 2026 — Procedure, Documents & Registration | Wedora',
    meta_description:
      'Complete guide to Arya Samaj marriage in India 2026. Eligibility, step-by-step procedure, required documents, certificate validity, cost breakdown, and how to get your marriage legally registered.',
    keywords:
      'arya samaj marriage india, arya samaj vivah procedure, arya samaj marriage documents, arya samaj marriage certificate, arya samaj mandir marriage registration, arya samaj marriage validity india 2026',
    author: 'Wedora Wedding Planning Team',
    published_at: now,
    created_at: now,
    updated_at: now,
    status: 'published',
    affiliate_link: null,
    affiliate_label: null,
  };
}

// ─── Data ────────────────────────────────────────────────────────────────────

// Table of contents
const TOC = [
  { id: 'what-is',       label: 'What is Arya Samaj Marriage?' },
  { id: 'eligibility',   label: 'Eligibility Criteria' },
  { id: 'documents',     label: 'Documents Required' },
  { id: 'procedure',     label: 'Step-by-Step Procedure' },
  { id: 'ceremony',      label: 'The Vivah Ceremony — What Happens' },
  { id: 'certificate',   label: 'Marriage Certificate' },
  { id: 'legal',         label: 'Legal Validity & Acts' },
  { id: 'cost',          label: 'Cost Breakdown 2026' },
  { id: 'hma-vs-sma',    label: 'HMA vs Special Marriage Act' },
  { id: 'intercaste',    label: 'Inter-Caste & Inter-Religion Marriages' },
  { id: 'cities',        label: 'How to Find Arya Samaj Mandir Near You' },
  { id: 'mistakes',      label: 'Common Mistakes to Avoid' },
  { id: 'faq',           label: 'FAQs' },
];

// Eligibility criteria
const ELIGIBILITY = [
  { criterion: 'Minimum age — Bride', detail: '18 years (must have attained 18 before the wedding date)', icon: '👰' },
  { criterion: 'Minimum age — Groom', detail: '21 years (must have attained 21 before the wedding date)', icon: '🤵' },
  { criterion: 'Mental capacity', detail: 'Both parties must be of sound mind and capable of giving valid consent', icon: '🧠' },
  { criterion: 'Marital status', detail: 'Neither party should have a living spouse from a previous valid marriage', icon: '💍' },
  { criterion: 'Prohibited relationships', detail: 'The parties should not be within the degrees of prohibited relationship unless custom permits', icon: '🚫' },
  { criterion: 'Religion', detail: 'Traditionally both parties should be Hindu (Arya Samaj performs Hindu ceremonies). Inter-religion marriages can still use Arya Samaj but require Special Marriage Act registration for full legal validity', icon: '🕉️' },
];

// Documents for the ceremony
const CEREMONY_DOCS = [
  { doc: 'Proof of Age (Bride)',        examples: 'Birth certificate, Class 10 mark sheet, Aadhaar card, Passport',   required: true  },
  { doc: 'Proof of Age (Groom)',        examples: 'Birth certificate, Class 10 mark sheet, Aadhaar card, Passport',   required: true  },
  { doc: 'Proof of Identity (Bride)',   examples: 'Aadhaar card, Voter ID, Passport, PAN card',                       required: true  },
  { doc: 'Proof of Identity (Groom)',   examples: 'Aadhaar card, Voter ID, Passport, PAN card',                       required: true  },
  { doc: 'Proof of Address (Bride)',    examples: 'Aadhaar, utility bill, bank passbook, rental agreement',           required: true  },
  { doc: 'Proof of Address (Groom)',    examples: 'Aadhaar, utility bill, bank passbook, rental agreement',           required: true  },
  { doc: 'Passport-size photographs',   examples: '4–6 recent colour photographs each of bride and groom',            required: true  },
  { doc: 'Affidavit of marital status', examples: 'Sworn affidavit stating the party is unmarried / divorced / widowed', required: true },
  { doc: 'Witnesses (2 required)',      examples: 'Two witnesses with their Aadhaar cards / ID proof present at ceremony', required: true },
  { doc: 'Divorce decree (if applicable)', examples: 'Court-issued divorce decree for divorced parties',             required: false },
  { doc: 'Death certificate (if applicable)', examples: 'Spouse\'s death certificate for widowed parties',          required: false },
  { doc: 'No-objection letter (if applicable)', examples: 'Parental NOC for parties aged 18–21 (recommended)',     required: false },
];

// Step-by-step procedure
const STEPS = [
  {
    n: '01',
    title: 'Locate your nearest Arya Samaj Mandir',
    detail: 'Find a registered Arya Samaj Mandir in your city. Use the official Arya Samaj directory or search "[City] Arya Samaj Mandir" to find the nearest branch. Confirm they perform Vivah Sanskar ceremonies — most do, but calling ahead saves time.',
    color: 'from-violet-500 to-purple-700',
    tip: null,
  },
  {
    n: '02',
    title: 'Fix an appointment with the mandir secretary',
    detail: 'Visit the mandir in person or call the secretary to fix a date for the ceremony. Bring a rough idea of your preferred date — auspicious muhurtas are available from the mandir pandit. Most mandirs require at least 7–15 days\' notice.',
    color: 'from-sky-500 to-blue-600',
    tip: 'Ask the secretary for the exact list of documents they require at the time of booking — requirements vary slightly between mandirs.',
  },
  {
    n: '03',
    title: 'Submit documents for verification',
    detail: 'Submit all required documents (see list above) to the mandir office. They will verify age, identity, marital status, and relationship. Original documents must be brought for verification — attested photocopies are submitted.',
    color: 'from-emerald-500 to-teal-600',
    tip: 'Get all documents notarised/attested 2–3 days before. Mandirs do not attest documents themselves.',
  },
  {
    n: '04',
    title: 'Pre-ceremony Havan preparation',
    detail: 'On the wedding day, arrive at the mandir at the appointed time. The pandit will prepare the Havan Kund (sacred fire altar). Bring the required Havan Samagri — either purchase it from the mandir or from the list they provide. Most mandirs offer a complete samagri package.',
    color: 'from-amber-500 to-orange-500',
    tip: null,
  },
  {
    n: '05',
    title: 'Perform the Vivah Sanskar ceremony',
    detail: 'The complete Arya Samaj Vivah Sanskar ceremony is performed — Ganesh Puja, Kanya Daan, Panigrahana (hand-holding rite), Saptapadi (seven vows around the sacred fire), Sindoor Daan, and Mangalsutra ceremony. The entire ceremony typically takes 1.5–2.5 hours.',
    color: 'from-rose-500 to-pink-600',
    tip: null,
  },
  {
    n: '06',
    title: 'Receive the Arya Samaj Marriage Certificate',
    detail: 'After the ceremony, the mandir issues the Arya Samaj Marriage Certificate signed by the officiating priest and witnesses. This is your primary proof of the Arya Samaj ceremony. Keep multiple certified copies — you will need them for subsequent legal registration.',
    color: 'from-indigo-500 to-violet-600',
    tip: 'Request at least 3 certified copies of this certificate at the time of issue. Getting additional copies later can be cumbersome.',
  },
  {
    n: '07',
    title: 'Register under the Hindu Marriage Act (SDM Office)',
    detail: 'The Arya Samaj certificate alone is not sufficient for all legal purposes. For full legal recognition, you must register your marriage with the Sub-Divisional Magistrate (SDM) or Marriage Registrar within 30–90 days (varies by state). This gives you the Government of India Marriage Certificate.',
    color: 'from-teal-500 to-emerald-600',
    tip: 'This step is mandatory for passport, visa, property, and insurance purposes. Do not skip it.',
  },
  {
    n: '08',
    title: 'Receive the Government Marriage Certificate',
    detail: 'The SDM/Registrar verifies documents, the Arya Samaj certificate, and issues the official Government Marriage Certificate (under HMA 1955 or SMA 1954). This document is fully recognised by all courts, government departments, and foreign embassies.',
    color: 'from-rose-gold to-plum',
    tip: null,
  },
];

// The ceremony — what happens
const CEREMONY_RITUALS = [
  {
    name: 'Ganesh Puja & Havan Sankalp',
    duration: '15–20 min',
    desc: 'The ceremony begins with prayers to Lord Ganesh for blessings and the taking of a Sankalp (intention) before the sacred fire by the couple and their families.',
  },
  {
    name: 'Madhuparka & Kanya Daan',
    duration: '15–20 min',
    desc: 'The groom is welcomed with Madhuparka (honey and curd offering). The Kanya Daan ritual follows — the bride\'s parents formally give their daughter in marriage by placing her hands in the groom\'s. One of the most emotionally significant moments of the ceremony.',
  },
  {
    name: 'Vivah Homa (Sacred Fire)',
    duration: '20–25 min',
    desc: 'Oblations (offerings) are made to the sacred fire. The Havan Kund represents the divine witness to the marriage. Mantras from the Vedas are recited by the pandit as both parties participate.',
  },
  {
    name: 'Panigrahana',
    duration: '5 min',
    desc: 'The groom takes the bride\'s hand in the Panigrahana rite — symbolising his acceptance of responsibility for her well-being. This is considered the formal beginning of the marital bond.',
  },
  {
    name: 'Saptapadi (Seven Steps)',
    duration: '20–30 min',
    desc: 'The most significant rite — the couple takes seven steps together around the sacred fire, each step accompanied by a vow (one each for food, strength, wealth, happiness, children, health, and friendship/devotion). In Arya Samaj, these vows are exchanged in Sanskrit with Hindi explanation. The marriage is legally considered complete after the seventh step.',
  },
  {
    name: 'Sindoor Daan & Mangalsutra',
    duration: '5–10 min',
    desc: 'The groom applies sindoor in the parting of the bride\'s hair and ties the mangalsutra around her neck — the symbols of her married status in Hindu tradition.',
  },
  {
    name: 'Ashirvaad & Certificate',
    duration: '15–20 min',
    desc: 'Blessings are sought from elders and family. The officiating priest and witnesses sign the Arya Samaj Marriage Certificate, which is presented to the couple.',
  },
];

// Legal framework
const LEGAL_ACTS = [
  {
    act: 'Hindu Marriage Act, 1955 (HMA)',
    applies: 'When BOTH parties are Hindu (includes Sikhs, Buddhists, Jains)',
    validity: 'Fully valid. Arya Samaj ceremony qualifies as a Hindu ceremony under HMA.',
    registration: 'Register at SDM/Marriage Registrar office after the ceremony.',
    icon: '🕉️',
    color: 'from-amber-500 to-orange-500',
  },
  {
    act: 'Special Marriage Act, 1954 (SMA)',
    applies: 'For inter-religion marriages, or couples who want a civil marriage option',
    validity: 'Fully valid. The Arya Samaj ceremony is then the religious rite; SMA provides the legal registration.',
    registration: 'Apply 30 days in advance to the Marriage Registrar. Notice period mandatory.',
    icon: '⚖️',
    color: 'from-sky-500 to-blue-600',
  },
  {
    act: 'Foreign Marriage Act, 1969',
    applies: 'When one or both parties are Indian citizens marrying abroad',
    validity: 'The Arya Samaj certificate from India can be apostilled for use internationally.',
    registration: 'Register at the Indian Embassy / Consulate in the relevant country.',
    icon: '🌍',
    color: 'from-emerald-500 to-teal-600',
  },
];

// Cost breakdown 2026
const COST_ITEMS = [
  { item: 'Arya Samaj Mandir ceremony fee',    range: '₹2,000 – ₹5,000',   note: 'Varies by mandir and city. Includes pandit\'s dakshina and basic arrangements.' },
  { item: 'Havan Samagri (if purchased)',       range: '₹500 – ₹1,500',    note: 'Many mandirs include samagri in the ceremony fee. Ask when booking.' },
  { item: 'Arya Samaj Marriage Certificate',   range: 'Included / ₹500',   note: 'Usually included in the ceremony fee. Additional certified copies: ₹100–₹200 each.' },
  { item: 'Document notarisation / attestation', range: '₹200 – ₹500',   note: 'Per document. Get affidavits notarised by a Notary Public before the ceremony.' },
  { item: 'SDM/Registrar registration fee',    range: '₹100 – ₹1,000',    note: 'State-wise variation. Maharashtra ₹100, Delhi ₹150, UP ₹500 approx.' },
  { item: 'Stamp duty (state-dependent)',       range: '₹100 – ₹500',      note: 'Varies by state. Some states waive this entirely.' },
  { item: 'Tatkal / urgent registration',       range: '₹500 – ₹2,000',   note: 'Most states offer an expedited Tatkal service for faster certificate issuance.' },
  { item: 'Advocate / agent fees (optional)',   range: '₹2,000 – ₹8,000', note: 'If you hire a marriage registration agent to handle SDM paperwork. Not mandatory.' },
];

// HMA vs SMA comparison
const ACT_COMPARISON = [
  { point: 'Who can use it', hma: 'Both parties must be Hindu (incl. Sikh, Jain, Buddhist)', sma: 'Any two people regardless of religion' },
  { point: 'Notice period', hma: 'No mandatory notice period — can register immediately after ceremony', sma: '30-day mandatory public notice at the Registrar\'s office before marriage' },
  { point: 'Procedure', hma: 'Perform ceremony → collect Arya Samaj cert → register at SDM', sma: 'Apply 30 days before → notice period → ceremony (or just court) → certificate' },
  { point: 'Privacy', hma: 'More private — no public notice board display', sma: 'Public notice displayed at office for 30 days' },
  { point: 'Inter-religion couples', hma: 'Not applicable — both must be Hindu', sma: 'Ideal — explicitly designed for inter-religion marriages' },
  { point: 'NRI use', hma: 'Accepted internationally with apostille', sma: 'Widely accepted — explicitly civil in nature' },
  { point: 'Timeline', hma: '1 day (ceremony) + 7–30 days (SDM registration)', sma: '30+ days (notice) + ceremony + registration' },
];

// Mistakes to avoid
const MISTAKES = [
  {
    m: 'Assuming the Arya Samaj certificate alone is a legal marriage certificate',
    r: 'The Arya Samaj certificate proves the ceremony was performed under their auspices — but it is NOT the Government of India marriage certificate. You must still register at the SDM office to get the official legal document.',
  },
  {
    m: 'Bringing only photocopies — not originals — for document verification',
    r: 'Arya Samaj mandirs and SDM offices both require ORIGINAL documents for verification at the time of submission. Originals are returned, but they must be presented.',
  },
  {
    m: 'Not arranging witnesses in advance',
    r: 'Two witnesses must be present at the ceremony AND at the SDM registration. Both witnesses need to carry their own ID proof. Witnesses who forget their ID can delay or cancel the registration.',
  },
  {
    m: 'Missing the SDM registration deadline',
    r: 'Many states require registration within 30–90 days of the ceremony. Missing this window can require a court application, which is expensive and time-consuming. Register within 30 days of the ceremony without exception.',
  },
  {
    m: 'Choosing a mandir without verifying its registration status',
    r: 'Not all mandirs calling themselves "Arya Samaj" are registered with the official Arya Pradeshik Pratinidhi Sabha. An unregistered mandir\'s certificate may be questioned during SDM registration. Verify the mandir\'s registration first.',
  },
  {
    m: 'Inter-religion couples registering only under HMA',
    r: 'The Hindu Marriage Act applies only when both parties are Hindu. If one party is non-Hindu, you must use the Special Marriage Act. Attempting HMA registration in inter-religion cases will be rejected.',
  },
  {
    m: 'Not requesting multiple certified copies of the certificate',
    r: 'You will need the Arya Samaj certificate for SDM registration, passport applications, visa applications, and bank records. Request at least 3 certified copies at the time of issue.',
  },
];

const FAQS = [
  {
    q: 'Is an Arya Samaj marriage legally valid in India?',
    a: 'Yes — an Arya Samaj marriage is legally valid in India, provided it is registered under the Hindu Marriage Act, 1955 (for Hindu couples) or the Special Marriage Act, 1954 (for inter-religion couples). The Arya Samaj ceremony itself constitutes a valid Hindu marriage ceremony. However, for full legal recognition by courts, banks, passport offices, and government departments, you must also obtain the official marriage certificate from the Sub-Divisional Magistrate (SDM) or Marriage Registrar after the ceremony.',
  },
  {
    q: 'Can a non-Hindu (Christian, Muslim, Sikh) have an Arya Samaj marriage?',
    a: 'The Arya Samaj Vivah Sanskar is a Vedic Hindu ceremony designed for Hindus. In practice, some mandirs may perform the ceremony for non-Hindus willing to participate in the Vedic rites, but this is mandir-specific. For full legal validity when one or both parties are non-Hindu, the marriage must be registered under the Special Marriage Act, 1954 — not the Hindu Marriage Act. Inter-religion couples should consult a legal advisor and the specific mandir before proceeding.',
  },
  {
    q: 'How long does the entire Arya Samaj marriage process take?',
    a: 'The ceremony itself takes 1.5–2.5 hours. Document verification and booking typically takes 7–15 days of advance notice. The Arya Samaj Marriage Certificate is issued on the same day as the ceremony. SDM/Registrar registration (for the Government certificate) takes an additional 7–30 days depending on the state and whether you use the Tatkal service. End to end: plan for 2–4 weeks from first contact to receiving your official Government marriage certificate.',
  },
  {
    q: 'What is the difference between the Arya Samaj certificate and the Government marriage certificate?',
    a: 'The Arya Samaj Marriage Certificate is issued by the mandir and proves the religious ceremony was performed. It is signed by the officiating priest and witnesses. The Government Marriage Certificate is issued by the SDM/Marriage Registrar after you register under the Hindu Marriage Act or Special Marriage Act. The Government certificate is the official legal document recognised by courts, passport offices, banks, and foreign embassies. You need BOTH — the Arya Samaj certificate is used as proof of the ceremony when applying for the Government certificate.',
  },
  {
    q: 'Can we get married at an Arya Samaj Mandir on the same day we apply?',
    a: 'Technically possible but practically rare. Most mandirs require a minimum 7–15 days\' advance booking for document verification and muhurta (auspicious time) scheduling. Some mandirs may accommodate same-day or next-day ceremonies in genuine emergencies, particularly for court marriages or time-sensitive cases. Call the mandir directly to check availability.',
  },
  {
    q: 'Is an Arya Samaj marriage valid for visa and passport applications?',
    a: 'Yes — but only when accompanied by the official Government Marriage Certificate obtained from the SDM office. The Arya Samaj certificate alone is generally not accepted by passport offices, embassies, or immigration authorities as proof of marriage. You need the Government certificate (issued under HMA or SMA) for all official purposes including name change on passport, visa applications for a spouse, and joint property or insurance registrations.',
  },
  {
    q: 'What are the fees for an Arya Samaj marriage ceremony in 2026?',
    a: 'The Arya Samaj mandir ceremony fee typically ranges from ₹2,000 to ₹5,000 across India, varying by city and mandir. This usually includes the pandit\'s services, basic arrangements, and the Arya Samaj certificate. Havan samagri may be included or charged separately (₹500–₹1,500). SDM registration fees range from ₹100 to ₹1,000 depending on the state. The total all-in cost for the ceremony + legal registration typically ranges from ₹5,000 to ₹15,000.',
  },
  {
    q: 'Do both families need to be present for an Arya Samaj marriage?',
    a: 'No — only the bride, the groom, and two witnesses are legally required to be present. Family presence is not a legal requirement. Many couples choose Arya Samaj specifically because it can be performed with minimal attendance — just the couple, two witnesses, and the officiating priest. That said, having parents present for the Kanya Daan ceremony is emotionally significant and culturally preferred.',
  },
];

// City guide
const MAJOR_CITIES = [
  { city: 'Delhi / NCR', mandir: 'Arya Samaj Mandir, Karol Bagh; Arya Samaj Mandir, Kingsway Camp', contact: 'Search: Arya Pradeshik Pratinidhi Sabha Delhi' },
  { city: 'Mumbai', mandir: 'Arya Samaj Mandir, Dadar; Arya Samaj, Sion', contact: 'Search: Arya Samaj Mumbai official' },
  { city: 'Pune', mandir: 'Arya Samaj Mandir, Shivajinagar; Arya Samaj, Kothrud', contact: 'Search: Arya Samaj Mandir Pune ceremony' },
  { city: 'Hyderabad', mandir: 'Arya Samaj Mandir, Secunderabad; Arya Samaj, Ameerpet', contact: 'Search: Arya Samaj Mandir Hyderabad wedding' },
  { city: 'Bengaluru', mandir: 'Arya Samaj Mandir, Rajajinagar; Arya Samaj, Vijayanagar', contact: 'Search: Arya Samaj Mandir Bangalore' },
  { city: 'Jaipur', mandir: 'Arya Samaj Mandir, Sindhi Camp; Arya Samaj, Vaishali Nagar', contact: 'Search: Arya Samaj Jaipur marriage' },
  { city: 'Lucknow', mandir: 'Arya Samaj Mandir, Hazratganj; Arya Samaj, Aliganj', contact: 'Search: Arya Samaj Mandir Lucknow' },
  { city: 'Chennai', mandir: 'Arya Samaj Mandir, T. Nagar; Arya Samaj, Anna Nagar', contact: 'Search: Arya Samaj Chennai marriage ceremony' },
];

// ─── Reusable CTA Blocks ──────────────────────────────────────────────────────
// Three CTA variants used throughout the article

function CtaSignup({ headline, sub }) {
  return (
    <div className="my-8 rounded-2xl bg-gradient-to-r from-rose-gold to-plum p-px shadow-xl shadow-rose-gold/20">
      <div className="rounded-[calc(1rem-1px)] bg-white px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-serif font-bold text-gray-900 text-lg">{headline}</p>
          <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
        </div>
        <Link
          to="/signup"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
        >
          Get started free <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function CtaTool({ icon: Icon, headline, sub, btnLabel, btnTo, color }) {
  return (
    <div className={`my-8 rounded-2xl border-2 ${color.border} ${color.bg} p-5 flex flex-col sm:flex-row items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center shrink-0 shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${color.title} mb-0.5`}>{headline}</p>
        <p className="text-sm text-gray-500 leading-snug">{sub}</p>
      </div>
      <Link
        to={btnTo}
        className={`shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r ${color.grad} text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap`}
      >
        {btnLabel} <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function CtaInfoBox({ icon: Icon, title, body, color }) {
  return (
    <div className={`my-6 flex gap-4 p-5 rounded-2xl ${color.bg} border ${color.border}`}>
      <Icon className={`w-6 h-6 ${color.icon} shrink-0 mt-0.5`} />
      <div>
        <p className={`font-bold ${color.title} mb-1`}>{title}</p>
        <p className={`text-sm leading-relaxed ${color.body}`}>{body}</p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-rose-gold/5 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-gray-900 pr-2 text-sm md:text-base">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-rose-gold transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
          {item.a}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AryaSamajMarriageArticle({
  post,
  readTime,
  copied,
  onShare,
  affiliateHref,
  affiliateCtaLabel,
}) {
  const [openFaq, setOpenFaq]     = useState(-1);
  const [openStep, setOpenStep]   = useState(null);
  const [showToc, setShowToc]     = useState(false);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-400/15 to-orange-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100/60">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <Link to="/" className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent">
            Wedora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">

          {/* Cluster breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-400 font-medium">
            <Link to="/blog" className="hover:text-rose-gold transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-600 font-semibold">Marriage Registration Guide</span>
            <ChevronRight className="w-3 h-3" />
            <span>Arya Samaj</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-amber-400/30 shadow-sm mb-6 animate-fade-in-up">
            <Landmark className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Marriage Registration · Complete Guide
            </span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4 animate-fade-in-up">
            Arya Samaj Marriage{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-gold">
              in India
            </span>
          </h1>
          <p className="text-base text-amber-700 font-semibold mb-4">Complete Guide 2026 — Procedure, Documents, Certificate & Legal Registration</p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[
              { icon: '📋', label: 'Step-by-step procedure' },
              { icon: '📄', label: 'Documents checklist' },
              { icon: '⚖️', label: 'Legal validity explained' },
              { icon: '💰', label: '2026 cost breakdown' },
              { icon: '🏛️', label: 'HMA vs SMA guide' },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-200/60 text-gray-700 text-xs font-semibold shadow-sm">
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
          <div className="max-w-5xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl shadow-amber-400/15 border-4 border-white ring-1 ring-amber-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Indian bride at Hindu Vedic wedding ceremony — Arya Samaj Vivah Sanskar"
              className="w-full aspect-[21/9] object-cover object-center"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white border border-amber-100 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowToc(!showToc)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-amber-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-gray-900">Table of Contents</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TOC.length} sections</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} />
          </button>
          {showToc && (
            <div className="border-t border-gray-100 px-5 py-4 grid sm:grid-cols-2 gap-1">
              {TOC.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setShowToc(false)}
                  className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-amber-600 transition-colors group"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {i + 1}
                  </span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article body */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-14 md:space-y-20">

        {/* ── WHAT IS ARYA SAMAJ MARRIAGE ── */}
        <section id="what-is">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-300/15 to-rose-gold/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-amber-50/60 border border-amber-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-amber-500 shrink-0" />
                What is Arya Samaj Marriage?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Arya Samaj is a reform movement within Hinduism, founded by Swami Dayananda
                Saraswati in 1875. It advocates a return to the Vedas as the supreme authority
                and rejects idol worship, caste discrimination, and elaborate ritual in favour
                of simple, meaningful Vedic ceremonies.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                An <strong>Arya Samaj marriage</strong> — formally called <em>Vivah Sanskar</em> —
                is a Hindu wedding ceremony performed according to Vedic rites by an Arya Samaj
                Mandir. It is one of the most popular choices for couples in India who want a
                legally recognised, spiritually meaningful, and relatively simple wedding.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                It is particularly popular for <strong>inter-caste marriages</strong>, couples
                seeking a <strong>simple, affordable ceremony</strong>, and situations where
                families are not involved or supportive — since Arya Samaj mandirs are known
                for being inclusive and non-discriminatory.
              </p>
            </div>
          </div>

          {/* Why couples choose it */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🕉️', title: 'Vedic & Meaningful', desc: 'Based on the Vedas — every ritual has a clear meaning explained in Hindi by the pandit during the ceremony.' },
              { icon: '⚡', title: 'Simple & Fast', desc: 'Can be arranged in 7–15 days. Ceremony takes 2–3 hours. Certificate issued same day.' },
              { icon: '🤝', title: 'Inclusive & Non-Discriminatory', desc: 'Arya Samaj does not discriminate by caste or gotra. Particularly supportive of inter-caste couples.' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA 1: Signup ── */}
        <CtaSignup
          headline="Planning your Arya Samaj wedding? Wedora makes it effortless."
          sub="Track your documents, manage your ceremony timeline, and stay on top of every task — free."
        />

        {/* ── ELIGIBILITY ── */}
        <section id="eligibility">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Eligibility criteria</h2>
              <p className="text-gray-500 text-sm mt-0.5">Who can get married at an Arya Samaj Mandir?</p>
            </div>
          </div>

          <div className="space-y-3">
            {ELIGIBILITY.map((item) => (
              <div key={item.criterion} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.criterion}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <CtaInfoBox
            icon={Lightbulb}
            title="Key point on age proof"
            body="Both parties must have already attained the minimum age before the wedding date — not just be approaching it. The Arya Samaj mandir will verify this strictly. Bring a birth certificate or Class 10 mark sheet as age proof — these are the most accepted documents."
            color={{ bg: 'bg-amber-50', border: 'border-amber-200/60', icon: 'text-amber-600', title: 'text-amber-900', body: 'text-amber-800' }}
          />
        </section>

        {/* ── DOCUMENTS ── */}
        <section id="documents">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Documents required</h2>
              <p className="text-gray-500 text-sm mt-0.5">Bring originals + 2 attested photocopies of each.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">Document</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">Accepted examples</th>
                    <th className="px-4 py-3.5 font-semibold text-center w-20">Required?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CEREMONY_DOCS.map((row, i) => (
                    <tr key={row.doc} className={`hover:bg-sky-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-900 text-xs md:text-sm">{row.doc}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden sm:table-cell">{row.examples}</td>
                      <td className="px-4 py-3 text-center">
                        {row.required
                          ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Must</span>
                          : <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">If applicable</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA 2: Document checklist tool */}
          <CtaTool
            icon={ClipboardList}
            headline="Use Wedora's free document checklist tracker"
            sub="Tick off each document as you collect it. Never miss a piece of paperwork before your ceremony."
            btnLabel="Open checklist"
            btnTo="/signup"
            color={{
              bg: 'bg-sky-50',
              border: 'border-sky-200',
              grad: 'from-sky-500 to-blue-600',
              title: 'text-sky-900',
            }}
          />
        </section>

        {/* ── PROCEDURE ── */}
        <section id="procedure">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <ScrollText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Step-by-step procedure</h2>
              <p className="text-gray-500 text-sm mt-0.5">From first contact to Government certificate — complete.</p>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[1.3rem] top-4 bottom-4 w-0.5 bg-gradient-to-b from-violet-400 via-emerald-400 to-rose-gold hidden sm:block" />
            <div className="space-y-4">
              {STEPS.map((step) => (
                <div key={step.n} className="relative flex gap-4 sm:gap-6">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} text-white font-bold flex items-center justify-center shrink-0 shadow-lg z-10 text-sm`}>
                    {step.n}
                  </div>
                  <div className="flex-1 pb-1 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                    <p className="font-serif font-bold text-gray-900 mb-2">{step.title}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.detail}</p>
                    {step.tip && (
                      <div className="mt-3 flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-amber-800 text-xs leading-relaxed"><strong>Tip:</strong> {step.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CtaInfoBox
            icon={AlertTriangle}
            title="Do not skip Step 7 — SDM Registration"
            body="The most common and costly mistake couples make is stopping after the Arya Samaj ceremony and assuming their marriage is legally complete. The Arya Samaj certificate is PROOF OF CEREMONY — not the Government marriage certificate. You must register at the SDM office to obtain the legal document recognised by courts, passport offices, banks, and embassies."
            color={{ bg: 'bg-rose-50', border: 'border-rose-200/60', icon: 'text-rose-600', title: 'text-rose-900', body: 'text-rose-800' }}
          />
        </section>

        {/* ── CTA 3: WhatsApp invite generator ── */}
        <CtaTool
          icon={FileText}
          headline="Sending wedding invites after your Arya Samaj ceremony?"
          sub="Use Wedora's free WhatsApp invitation generator — 6 ready-to-copy templates including a formal Vedic ceremony invite."
          btnLabel="Create free invite"
          btnTo="/blog/whatsapp-wedding-invitations-modern-trend-guide"
          color={{
            bg: 'bg-violet-50',
            border: 'border-violet-200',
            grad: 'from-violet-500 to-purple-700',
            title: 'text-violet-900',
          }}
        />

        {/* ── CEREMONY ── */}
        <section id="ceremony">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">The Vivah Sanskar ceremony — what happens</h2>
              <p className="text-gray-500 text-sm mt-0.5">A complete breakdown of every ritual and its significance.</p>
            </div>
          </div>

          <div className="space-y-3">
            {CEREMONY_RITUALS.map((ritual, i) => (
              <div key={ritual.name} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-amber-200/60 transition-all">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <p className="font-semibold text-gray-900">{ritual.name}</p>
                    <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full font-medium">
                      ⏱ {ritual.duration}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{ritual.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <CtaInfoBox
            icon={Lightbulb}
            title="The Saptapadi is the legal moment of marriage"
            body="Under the Hindu Marriage Act, 1955, the Saptapadi (seven steps around the sacred fire) is the definitive moment at which the marriage is considered solemnised. Everything before it is preparation; everything after it is celebration. The marriage is legally complete when the seventh step is taken."
            color={{ bg: 'bg-amber-50', border: 'border-amber-200/60', icon: 'text-amber-600', title: 'text-amber-900', body: 'text-amber-800' }}
          />
        </section>

        {/* ── CERTIFICATE ── */}
        <section id="certificate">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/25">
              <BadgeCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Marriage Certificate — two types explained</h2>
              <p className="text-gray-500 text-sm mt-0.5">Understand the difference before you leave the mandir.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Arya Samaj cert */}
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 overflow-hidden">
              <div className="px-5 py-4 bg-amber-100 border-b border-amber-200 flex items-center gap-3">
                <Landmark className="w-6 h-6 text-amber-700" />
                <h3 className="font-serif font-bold text-amber-950">Arya Samaj Certificate</h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <p className="text-amber-900"><strong>Issued by:</strong> The Arya Samaj Mandir</p>
                <p className="text-amber-900"><strong>When issued:</strong> Same day as the ceremony</p>
                <p className="text-amber-900"><strong>Signed by:</strong> Officiating priest + 2 witnesses</p>
                <p className="text-amber-900"><strong>What it proves:</strong> That the Vivah Sanskar ceremony was performed under Arya Samaj auspices</p>
                <p className="text-amber-800 mt-2"><strong>Limitation:</strong> NOT the official Government marriage certificate. Cannot be used directly for passport, visa, or property purposes.</p>
                <div className="mt-2 p-3 rounded-xl bg-white border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700">✅ USE THIS DOCUMENT TO:</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-amber-800">
                    <li>• Apply for SDM/Registrar registration</li>
                    <li>• Proof of ceremony for social purposes</li>
                    <li>• Supporting document for name change</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Government cert */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden">
              <div className="px-5 py-4 bg-emerald-100 border-b border-emerald-200 flex items-center gap-3">
                <Scale className="w-6 h-6 text-emerald-700" />
                <h3 className="font-serif font-bold text-emerald-950">Government Marriage Certificate</h3>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <p className="text-emerald-900"><strong>Issued by:</strong> SDM/Marriage Registrar (Government of India)</p>
                <p className="text-emerald-900"><strong>When issued:</strong> 7–30 days after ceremony registration</p>
                <p className="text-emerald-900"><strong>Under:</strong> Hindu Marriage Act, 1955 or Special Marriage Act, 1954</p>
                <p className="text-emerald-900"><strong>What it proves:</strong> Your marriage is legally registered with the Government of India</p>
                <div className="mt-2 p-3 rounded-xl bg-white border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-700">✅ USE THIS DOCUMENT FOR:</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-emerald-800">
                    <li>• Passport application / name change</li>
                    <li>• Spouse visa applications</li>
                    <li>• Bank account / joint property</li>
                    <li>• Insurance nominations</li>
                    <li>• All court and legal purposes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA 4: Budget planner ── */}
        <CtaTool
          icon={IndianRupee}
          headline="Planning your post-ceremony celebration?"
          sub="Use Wedora's free wedding budget calculator — allocate every rupee smartly across your functions."
          btnLabel="Open budget calculator"
          btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            grad: 'from-emerald-500 to-teal-600',
            title: 'text-emerald-900',
          }}
        />

        {/* ── LEGAL VALIDITY ── */}
        <section id="legal">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Legal validity — which Act applies to you</h2>
              <p className="text-gray-500 text-sm mt-0.5">Three legal frameworks and when each applies.</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {LEGAL_ACTS.map((act) => (
              <div key={act.act} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-3.5 bg-gradient-to-r ${act.color} text-white flex items-center gap-3`}>
                  <span className="text-xl">{act.icon}</span>
                  <p className="font-bold text-base">{act.act}</p>
                </div>
                <div className="p-5 grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Applies when</p>
                    <p className="text-gray-700">{act.applies}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Validity</p>
                    <p className="text-gray-700">{act.validity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registration</p>
                    <p className="text-gray-700">{act.registration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COST ── */}
        <section id="cost">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Complete cost breakdown 2026</h2>
              <p className="text-gray-500 text-sm mt-0.5">All-in costs — ceremony + legal registration.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">Item</th>
                    <th className="px-4 py-3.5 font-semibold">Cost range</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COST_ITEMS.map((row, i) => (
                    <tr key={row.item} className={`hover:bg-emerald-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 text-gray-800 font-medium">{row.item}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 whitespace-nowrap">{row.range}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                  {/* Total */}
                  <tr className="bg-emerald-600 text-white">
                    <td className="px-4 py-4 font-bold text-base">💰 Total all-in estimate</td>
                    <td className="px-4 py-4 font-bold text-base">₹5,000 – ₹15,000</td>
                    <td className="px-4 py-4 text-white/80 text-xs hidden md:table-cell">Ceremony + legal registration. No advocate needed if you handle SDM yourself.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <CtaInfoBox
            icon={Lightbulb}
            title="Most affordable legal marriage option in India"
            body="An Arya Samaj marriage with full legal registration typically costs ₹5,000–₹15,000 all in — making it the most affordable route to a legally recognised Hindu marriage in India. Compare this to ₹50,000–₹5,00,000+ for a traditional wedding with a pandit, venue, and catering."
            color={{ bg: 'bg-emerald-50', border: 'border-emerald-200/60', icon: 'text-emerald-600', title: 'text-emerald-900', body: 'text-emerald-800' }}
          />
        </section>

        {/* ── HMA VS SMA ── */}
        <section id="hma-vs-sma">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Hindu Marriage Act vs Special Marriage Act</h2>
              <p className="text-gray-500 text-sm mt-0.5">Which one applies to your situation?</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold w-[35%]">Point of difference</th>
                    <th className="px-4 py-3.5 font-semibold">Hindu Marriage Act, 1955</th>
                    <th className="px-4 py-3.5 font-semibold">Special Marriage Act, 1954</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ACT_COMPARISON.map((row, i) => (
                    <tr key={row.point} className={`hover:bg-sky-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{row.point}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed">{row.hma}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed">{row.sma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── INTER-CASTE / INTER-RELIGION ── */}
        <section id="intercaste">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Inter-caste & inter-religion marriages</h2>
              <p className="text-gray-500 text-sm mt-0.5">Arya Samaj is a progressive choice for couples from different backgrounds.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🤝</span> Inter-caste Hindu marriages
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Arya Samaj does not recognise the caste system — it was founded explicitly to reject caste discrimination. Inter-caste marriages between Hindus are enthusiastically supported. The mandir will not ask for caste certificates or gotra details. The Hindu Marriage Act does not prohibit inter-caste marriages and neither does Arya Samaj.
              </p>
              <div className="flex gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-emerald-800 text-xs">Inter-caste Hindu couples can use Arya Samaj + Hindu Marriage Act. No special procedure required.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🕊️</span> Inter-religion marriages (Hindu + non-Hindu)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                If one partner is non-Hindu (Christian, Muslim, Parsi, etc.), the Hindu Marriage Act does not apply. The Arya Samaj ceremony can still be performed if both parties are willing to participate in the Vedic rites, but the legal registration must be done under the Special Marriage Act, 1954. The 30-day notice period under SMA is mandatory.
              </p>
              <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs"><strong>Important:</strong> Some states have laws that require notice to be given to the parents of interfaith couples during the SMA notice period. Be aware of your state's specific requirements and consult a lawyer if needed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA 5: Mid-article Signup ── */}
        <CtaSignup
          headline="Plan everything in one place — completely free"
          sub="Wedding checklist, budget planner, vendor tracker, invitation generator — Wedora has all your planning tools."
        />

        {/* ── CITIES GUIDE ── */}
        <section id="cities">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Finding Arya Samaj Mandir near you</h2>
              <p className="text-gray-500 text-sm mt-0.5">Major city references — always call ahead to confirm.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {MAJOR_CITIES.map((c) => (
              <div key={c.city} className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-violet-200 transition-all">
                <MapPin className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.city}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{c.mandir}</p>
                  <p className="text-violet-600 text-xs mt-1 italic">{c.contact}</p>
                </div>
              </div>
            ))}
          </div>

          <CtaInfoBox
            icon={Phone}
            title="How to verify a mandir is officially registered"
            body='Before booking, ask the mandir directly: "Are you registered with the Arya Pradeshik Pratinidhi Sabha or Sarvadeshik Arya Pratinidhi Sabha?" A registered mandir will have a certificate of affiliation. You can also verify on the official Arya Samaj websites. An unregistered mandir\'s certificate may not be accepted at the SDM office.'
            color={{ bg: 'bg-violet-50', border: 'border-violet-200/60', icon: 'text-violet-600', title: 'text-violet-900', body: 'text-violet-800' }}
          />
        </section>

        {/* ── MISTAKES ── */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                7 mistakes that complicate Arya Samaj marriages
              </h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {MISTAKES.map((item) => (
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

        {/* ── CLUSTER NAV — related articles ── */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <p className="font-serif font-bold text-gray-900">Marriage Registration Guide — More Articles</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Complete Indian Wedding Budget Guide (2026)', slug: 'indian-wedding-budget-guide-2026', icon: '💰' },
                { title: 'Wedding Budget Calculator: Allocate Your Money Smartly', slug: 'wedding-budget-calculator-how-to-allocate-money', icon: '🧮' },
                { title: 'Last-Minute Wedding Checklist: 30 Days Before', slug: 'last-minute-wedding-checklist-30-days-before', icon: '✅' },
                { title: 'WhatsApp Wedding Invitations: Modern Trend Guide', slug: 'whatsapp-wedding-invitations-modern-trend-guide', icon: '💬' },
                { title: 'Wedding Photography Checklist: 50 Must-Have Shots', slug: 'wedding-photography-checklist-must-have-shots', icon: '📷' },
                { title: 'Low Budget Wedding Ideas That Look Premium', slug: 'low-budget-wedding-ideas-india-look-premium', icon: '✨' },
              ].map((a) => (
                <Link
                  key={a.slug}
                  to={`/blog/${a.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200/60 transition-all group"
                >
                  <span className="text-lg">{a.icon}</span>
                  <p className="text-sm text-gray-700 group-hover:text-amber-700 font-medium transition-colors">{a.title}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOOLS CTA ── */}
        <section className="rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-gold p-1 shadow-2xl shadow-amber-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Plan your post-ceremony celebration on Wedora
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Once your Arya Samaj ceremony is done, it's time to celebrate. Use Wedora's free
              wedding planning tools — budget planner, invitation generator, vendor tracker,
              and checklist — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-amber-50 transition-colors shadow-lg">
                Start free with Wedora
              </Link>
              <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 text-center">
            Frequently asked questions
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            The most common questions about Arya Samaj marriage — answered completely.
          </p>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            Your Arya Samaj marriage is one of the best decisions you can make
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            It is simple, meaningful, legally valid, affordable, and deeply rooted in Vedic
            tradition — without the excess and obligation of a large ceremony. Gather your
            documents, find your nearest registered mandir, complete the ceremony, and register
            at the SDM office. From first call to Government certificate: 2–4 weeks and
            ₹5,000–₹15,000. No shortcuts required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Marriage registration guide</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Document checklist</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free planning tools</span>
          </div>
        </section>

        {affiliateHref && (
          <aside className="rounded-2xl border border-rose-gold/25 bg-white p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">Partner pick</p>
            <a href={affiliateHref} target="_blank" rel="sponsored noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">
              {affiliateCtaLabel}
            </a>
          </aside>
        )}
      </main>

      {/* Footer bar */}
      <div className="border-t border-rose-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Share:</span>
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative" title="Copy link">
              <Copy className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Copied!</span>
              )}
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
