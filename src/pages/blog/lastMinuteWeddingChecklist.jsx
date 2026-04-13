import { Link } from 'react-router-dom';
import BlogInternalLinks from '../../components/landing/BlogInternalLinks';
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
  CalendarDays,
  Phone,
  Package,
  Shirt,
  Camera,
  Flower2,
  Users,
  MapPin,
  Bell,
  Sun,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

// ─── Slug & static post ──────────────────────────────────────────────────────

export const LAST_MINUTE_CHECKLIST_SLUG = 'last-minute-wedding-checklist-30-days-before';

// Unsplash: Indian wedding celebration — rings and festive details
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85&auto=format&fit=crop';

export function getStaticLastMinuteChecklistPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-last-minute-checklist-2026',
    title: 'Last-Minute Wedding Checklist: 30 Days Before Your Wedding',
    slug: LAST_MINUTE_CHECKLIST_SLUG,
    excerpt:
      "30 days to go and your heart is racing? Don't panic. This week-by-week Indian wedding checklist covers every task from 30 days out to the morning of — so nothing slips through the cracks.",
    content: '',
    tags: 'Wedding Checklist, Wedding Planning, Indian Wedding, Last Minute',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Last-Minute Wedding Checklist: 30 Days Before Your Indian Wedding | Wedora',
    meta_description:
      "30 days before your wedding and panicking? This complete week-by-week Indian wedding checklist covers every task you need to finish — from vendor confirmations to the morning of.",
    keywords:
      'last minute wedding checklist india, 30 days before wedding checklist, wedding countdown checklist, things to do before wedding india, wedding planning checklist 2026, wedora',
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

// Week-by-week task groups. Each task has an id (unique), category, urgency
const WEEKS = [
  {
    id: 'w30',
    label: '30 Days Out',
    sublabel: 'Confirmations & final counts',
    icon: CalendarDays,
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    tasks: [
      { id: 't1',  cat: 'Vendors',   text: 'Call every vendor and reconfirm date, time, venue address, and your contact number',                     urgent: true  },
      { id: 't2',  cat: 'Vendors',   text: 'Request written final confirmations from: venue, caterer, photographer, decorator, mehendi, DJ',          urgent: true  },
      { id: 't3',  cat: 'Catering',  text: 'Give your caterer a firm guest headcount — this locks in the food quantity and final invoice',              urgent: true  },
      { id: 't4',  cat: 'Catering',  text: 'Confirm menu, special dietary needs (diabetic, Jain, allergies), and serving style with the caterer',       urgent: true  },
      { id: 't5',  cat: 'Venue',     text: 'Do a final venue walkthrough — check entry, mandap position, seating layout, parking, and washrooms',       urgent: true  },
      { id: 't6',  cat: 'Venue',     text: 'Confirm backup generator, PA/sound system, and AC/fans are working at the venue',                          urgent: true  },
      { id: 't7',  cat: 'Guests',    text: 'Send a final digital reminder to all guests with date, time, venue address, and parking details',           urgent: true  },
      { id: 't8',  cat: 'Guests',    text: 'Collect final RSVPs — update your caterer and venue with any last-minute additions or cancellations',       urgent: false },
      { id: 't9',  cat: 'Payments',  text: 'Review all vendor payment schedules — identify which payments are due this week and next',                  urgent: true  },
      { id: 't10', cat: 'Payments',  text: 'Pay any outstanding advances to vendors who need to purchase materials (decor, flowers, fabric)',           urgent: true  },
      { id: 't11', cat: 'Outfits',   text: 'Try on all wedding outfits — confirm fit, check for alterations, and send them for any fixes immediately', urgent: true  },
      { id: 't12', cat: 'Outfits',   text: 'Try on bridal shoes and practice walking for at least 20 minutes — broken-in shoes prevent blisters',      urgent: false },
      { id: 't13', cat: 'Beauty',    text: 'Book bridal makeup trial if not already done — bring the actual outfit for colour matching',                urgent: true  },
      { id: 't14', cat: 'Documents', text: 'Verify marriage registration paperwork (if doing civil registration) — confirm dates and requirements',     urgent: true  },
      { id: 't15', cat: 'Transport', text: 'Book bridal car and any shuttle transport for out-of-town guests — confirm pickup times and locations',     urgent: true  },
    ],
  },
  {
    id: 'w21',
    label: '21 Days Out',
    sublabel: 'Logistics, guests & tiny details',
    icon: Package,
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    tasks: [
      { id: 't16', cat: 'Photography', text: 'Share your shot list and full day timeline with your photographer — discuss non-negotiable moments',       urgent: true  },
      { id: 't17', cat: 'Photography', text: 'Assign a family "shot wrangler" to help the photographer gather people for group shots',                  urgent: false },
      { id: 't18', cat: 'Decor',       text: 'Review decor layout and colour scheme with your decorator — request a mood board if not already done',    urgent: true  },
      { id: 't19', cat: 'Decor',       text: 'Confirm flower types and colours with the florist — check if chosen flowers are in season for your date', urgent: true  },
      { id: 't20', cat: 'Mehendi',     text: 'Do a mehendi design trial — share reference images and confirm the date, time, and duration with artist', urgent: true  },
      { id: 't21', cat: 'Guests',      text: 'Finalise seating arrangement and create a seating chart for the reception dinner',                         urgent: false },
      { id: 't22', cat: 'Guests',      text: 'Coordinate hotel/accommodation bookings for outstation guests — share addresses and check-in times',      urgent: true  },
      { id: 't23', cat: 'Guests',      text: 'Confirm special transport arrangements for elderly relatives and guests with mobility needs',              urgent: false },
      { id: 't24', cat: 'Outfits',     text: 'Collect all altered outfits from tailor — do a final fitting and confirm no further changes are needed',  urgent: true  },
      { id: 't25', cat: 'Beauty',      text: 'Confirm bridal makeup schedule — exact arrival time, duration, and what products the MUA is bringing',   urgent: true  },
      { id: 't26', cat: 'Beauty',      text: 'Book parlour appointment for pre-wedding facial, threading, and waxing (at least 4–5 days before)',       urgent: false },
      { id: 't27', cat: 'Gifts',       text: 'Order wedding favours or return gifts if giving them — confirm delivery date allows time for packaging',  urgent: false },
      { id: 't28', cat: 'Music',       text: 'Finalise song lists with the DJ: first dance, entry songs, dinner playlist, and any songs to avoid',     urgent: false },
      { id: 't29', cat: 'Ceremony',    text: 'Meet or call the pandit/qazi — confirm rituals, timing, materials needed (samagri list), and language',  urgent: true  },
      { id: 't30', cat: 'Emergency',   text: 'Prepare an emergency contact sheet: all vendor numbers, venue manager, and key family members on one page', urgent: true },
    ],
  },
  {
    id: 'w14',
    label: '14 Days Out',
    sublabel: 'Pre-wedding functions & wellness',
    icon: Flower2,
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    tasks: [
      { id: 't31', cat: 'Ceremony',   text: 'Purchase all pooja samagri items — check the pandit\'s list twice and get extras of consumables',          urgent: true  },
      { id: 't32', cat: 'Venue',      text: 'Reconfirm venue access times for decorator setup — ensure they can enter at least 4–6 hours before guests', urgent: true },
      { id: 't33', cat: 'Vendors',    text: 'Share the final wedding day timeline with all vendors: arrival times, setup windows, ceremony start, meals', urgent: true },
      { id: 't34', cat: 'Catering',   text: 'Plan the catering setup for pre-wedding home functions: mehendi, haldi, morning breakfast arrangements',   urgent: false },
      { id: 't35', cat: 'Beauty',     text: 'Start your pre-wedding skincare routine if not already done — hydration, sunscreen, no new products now',   urgent: false },
      { id: 't36', cat: 'Beauty',     text: 'Pre-wedding facial and cleanup appointment — schedule 5–6 days before the wedding, never 1–2 days before', urgent: false },
      { id: 't37', cat: 'Outfits',    text: 'Steam or dry-clean all wedding outfits — store them in dust-free covers, hanging where possible',           urgent: true  },
      { id: 't38', cat: 'Jewellery',  text: 'Polish and check all jewellery — inspect clasps, chains, and settings. Collect rented pieces by now.',     urgent: true  },
      { id: 't39', cat: 'Documents',  text: 'Prepare an envelope with important documents: Aadhaar, marriage certificate, hotel bookings, passports',   urgent: true  },
      { id: 't40', cat: 'Guests',     text: 'Send a WhatsApp update to family groups: schedule of events, dress codes, parking, and key timings',       urgent: false },
      { id: 't41', cat: 'Wellness',   text: 'Commit to sleeping 7–8 hours per night for the next 2 weeks — no skincare fix beats genuine rest',         urgent: false },
      { id: 't42', cat: 'Payments',   text: 'Process second-tranche payments to vendors as per your agreed schedule — keep all payment receipts',       urgent: true  },
    ],
  },
  {
    id: 'w7',
    label: '7 Days Out',
    sublabel: 'Final prep — one week to go',
    icon: Bell,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    tasks: [
      { id: 't43', cat: 'Vendors',    text: 'Call every vendor one final time — reconfirm exact arrival time, entrance address, and your number',        urgent: true  },
      { id: 't44', cat: 'Catering',   text: 'Reconfirm final headcount with caterer — add a 5–10% buffer to avoid running short on food',               urgent: true  },
      { id: 't45', cat: 'Payments',   text: 'Prepare cash for final vendor payments on the wedding day — sort into labelled envelopes per vendor',       urgent: true  },
      { id: 't46', cat: 'Outfits',    text: 'Prepare a wedding day outfit bag: all pieces for every function in one place, labelled by function',        urgent: true  },
      { id: 't47', cat: 'Emergency',  text: 'Pack a wedding day emergency kit (see list below) — give it to a trusted bridesmaid or family member',     urgent: true  },
      { id: 't48', cat: 'Mehendi',    text: 'Mehendi function — give the artist a final confirming call. Prepare seating, lighting, and refreshments.',  urgent: true  },
      { id: 't49', cat: 'Beauty',     text: 'Do NOT try any new skincare products, hair treatments, or waxing this week — stick to your routine',       urgent: true  },
      { id: 't50', cat: 'Guests',     text: 'Send final arrival instructions to out-of-town guests: airport pickup plan, hotel check-in contact',        urgent: false },
      { id: 't51', cat: 'Venue',      text: 'Reconfirm decorator setup time and do a final check of decor materials list with them',                    urgent: true  },
      { id: 't52', cat: 'Music',      text: 'Share final confirmed song list with DJ — include the exact entry song for the bride, groom, and couple',   urgent: true  },
      { id: 't53', cat: 'Wellness',   text: 'Eat light, hydrate well, avoid eating out — food poisoning the week of the wedding is a real risk',        urgent: true  },
      { id: 't54', cat: 'Documents',  text: 'Double-check marriage registration paperwork, ring box location, and all vendor contracts are accessible',  urgent: true  },
    ],
  },
  {
    id: 'w3',
    label: '3 Days Out',
    sublabel: 'Almost there — deep breath',
    icon: Sun,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    tasks: [
      { id: 't55', cat: 'Venue',      text: 'Confirm decorator has access to venue and is aware of setup timeline — do a final check-call',              urgent: true  },
      { id: 't56', cat: 'Catering',   text: 'Confirm caterer arrival time, number of serving staff, and serving start time',                             urgent: true  },
      { id: 't57', cat: 'Beauty',     text: 'Bridal waxing, threading, and cleanup appointment today (not tomorrow — give skin time to settle)',         urgent: true  },
      { id: 't58', cat: 'Outfits',    text: 'Do one final outfit check: lehenga pressed and hung, all accessories in one box, shoes polished',          urgent: true  },
      { id: 't59', cat: 'Wellness',   text: 'Early dinner, no alcohol, no late nights — your skin and energy levels depend on this',                    urgent: true  },
      { id: 't60', cat: 'Family',     text: 'Confirm family member roles: who handles which vendor, who receives guests, who is with the bride',        urgent: true  },
      { id: 't61', cat: 'Payments',   text: 'Confirm cash envelopes are prepared and ready — who carries them and when to hand each over',              urgent: true  },
      { id: 't62', cat: 'Emergency',  text: 'Hand over the emergency kit to your designated bridesmaid or family member — brief them on where things are', urgent: true },
      { id: 't63', cat: 'Photography', text: 'Remind your shot-wrangler family member of the group shot list — give them a printed copy',               urgent: false },
      { id: 't64', cat: 'Wellness',   text: 'Sleep by 10 PM — this is the most important beauty and wellness task of the entire checklist',            urgent: true  },
    ],
  },
  {
    id: 'wday1',
    label: 'Day Before',
    sublabel: 'Final confirmations — then rest',
    icon: CalendarDays,
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    tasks: [
      { id: 't65', cat: 'Vendors',    text: 'Final call to all vendors — venue, caterer, photographer, decorator, DJ, transport. Confirm all is go.',    urgent: true  },
      { id: 't66', cat: 'Venue',      text: 'Check in with the venue manager — confirm they are set up or on track for setup completion tonight',        urgent: true  },
      { id: 't67', cat: 'Outfits',    text: 'Lay out every item you will wear tomorrow: lehenga, blouse, dupatta, shoes, jewellery, bangles, nath',     urgent: true  },
      { id: 't68', cat: 'Beauty',     text: 'Confirm MUA arrival time for tomorrow morning — what time they arrive, how long makeup takes, when done',   urgent: true  },
      { id: 't69', cat: 'Documents',  text: 'Place all documents in one bag: rings, marriage documents, vendor payment envelopes, pandit dakshina',     urgent: true  },
      { id: 't70', cat: 'Family',     text: 'Brief all key family members one final time: their role, their timings, their location in the morning',     urgent: true  },
      { id: 't71', cat: 'Wellness',   text: 'Light meal — avoid heavy, oily, or unfamiliar food tonight. Hydrate well.',                                urgent: true  },
      { id: 't72', cat: 'Wellness',   text: 'Phone down by 9 PM. No social media, no last-minute planning. In bed by 10 PM at the absolute latest.',   urgent: true  },
      { id: 't73', cat: 'Phone',      text: 'Charge your phone fully. Share your number with venue, caterer, and photographer as the day-of contact.',  urgent: true  },
      { id: 't74', cat: 'Emergency',  text: 'Emergency kit confirmed with bridesmaid: safety pins, thread, tape, painkillers, lip colour, snack bar',   urgent: true  },
    ],
  },
  {
    id: 'wmorning',
    label: 'Wedding Morning',
    sublabel: 'The day is here — stay calm',
    icon: Sparkles,
    color: 'from-rose-gold to-plum',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    tasks: [
      { id: 't75', cat: 'Start',      text: 'Wake up at least 3 hours before you need to leave — rushing is the enemy of the entire day',               urgent: true  },
      { id: 't76', cat: 'Beauty',     text: 'Eat a proper breakfast before makeup begins — you will not eat for hours. Include protein.',               urgent: true  },
      { id: 't77', cat: 'Beauty',     text: 'Makeup begins. Phone on silent. One trusted person in the room. Relax and let the MUA work.',             urgent: true  },
      { id: 't78', cat: 'Family',     text: 'Designated family member heads to venue for vendor coordination — venue, caterer, decorator final checks', urgent: true  },
      { id: 't79', cat: 'Vendors',    text: 'Photographer arrives and begins bridal prep shots — jewellery flat-lay, outfit detail, getting ready',     urgent: true  },
      { id: 't80', cat: 'Transport',  text: 'Bridal car confirmed ready — double check driver has venue address and arrival time',                      urgent: true  },
      { id: 't81', cat: 'Payments',   text: 'Hand over vendor payment envelopes to designated family member at venue — not you, not your mother',       urgent: true  },
      { id: 't82', cat: 'Wellness',   text: 'Drink water. Eat something small before leaving. You cannot run on adrenaline all day.',                  urgent: true  },
      { id: 't83', cat: 'Presence',   text: 'Put the checklist down. Trust your planning. Be present — this is the day you prepared for.',             urgent: false },
    ],
  },
];

// Emergency kit contents
const EMERGENCY_KIT = [
  { item: 'Safety pins (20+)',           why: 'Dupatta slips, blouse hooks fail, hem falls — safety pins fix everything' },
  { item: 'Clear fashion tape',          why: 'For necklines, hem edges, and anything fabric that needs to stay exactly where it is' },
  { item: 'Needle and thread (red, gold, white)', why: 'For last-minute stitching fixes on the lehenga or blouse' },
  { item: 'Painkiller and antacid',      why: 'Stress headaches and food reactions happen on wedding days' },
  { item: 'Lip colour (same as bridal)', why: 'Touch-ups after eating, crying, or the 50th photo' },
  { item: 'Blotting paper + setting spray', why: 'Keeps the bridal look intact through a full day of emotion' },
  { item: 'Phone charger + power bank',  why: 'Your phone will be at 10% by noon. The power bank is non-negotiable.' },
  { item: 'Snack bar or dry fruits',     why: 'Brides and grooms often miss meals on the wedding day — this prevents fainting' },
  { item: 'Small water bottle',          why: 'Hydration is beauty. Stay sipping all day.' },
  { item: 'Spare bindis and hair pins',  why: 'Both disappear mysteriously within the first hour of any Indian wedding' },
  { item: 'Stain remover wipe',          why: 'One drop of chai or gulal and the outfit is at risk without these' },
  { item: 'Dupatta pin or brooch',       why: 'For securing the dupatta in the exact draping style you want without it moving' },
];

// Vendor confirmation script
const VENDOR_CALL_SCRIPT = [
  { q: 'Date and time', s: '"Just confirming — you have us on [DATE] at [TIME]?"' },
  { q: 'Venue address', s: '"The venue address is [ADDRESS] — do you have this confirmed in your calendar?"' },
  { q: 'Your contact number', s: '"My number on the day is [YOUR NUMBER] — please call this if anything changes."' },
  { q: 'Their arrival time', s: '"What time will you arrive / begin setup?"' },
  { q: 'Outstanding payments', s: '"We have [AMOUNT] remaining — we\'ll have that ready in [CASH/BANK TRANSFER] on the day."' },
  { q: 'Any concerns or questions', s: '"Is there anything you need from us before the wedding?"' },
];

// Stress survival tips
const STRESS_TIPS = [
  { tip: 'Delegate, don\'t do everything yourself', detail: 'Write a list of 10 tasks and assign each to a specific person by name. "Can someone handle it?" means nobody will.' },
  { tip: 'Accept that one thing will go wrong', detail: 'Every wedding has one thing that doesn\'t go to plan. It will not ruin the day. The guests will never know.' },
  { tip: 'Create a no-decisions morning', detail: 'Make every decision about the wedding morning the night before. Clothes laid out. Timings confirmed. The morning should be zero decisions.' },
  { tip: 'Eat every meal in the last 3 days', detail: 'Skipping meals because you\'re busy or nervous is the fastest route to a migraine on your wedding day.' },
  { tip: 'Stop checking Instagram and Pinterest', detail: 'Comparing your wedding to highlight reels in the final week is the single biggest source of last-minute anxiety. The plan is set. Trust it.' },
  { tip: 'Give yourself a "done" deadline', detail: 'Planning must stop 2 days before the wedding. Whatever isn\'t done by then will either be handled by someone else or won\'t matter.' },
];

const FAQS = [
  {
    q: 'What is the most important thing to do 30 days before an Indian wedding?',
    a: "The single most important task at 30 days is reconfirming every vendor in writing and locking the final guest headcount. These two actions set every other task in motion — your caterer cannot finalise food quantity, your venue cannot confirm seating, and your decorator cannot plan without a confirmed guest number. Do these first, on day 30.",
  },
  {
    q: 'What should be in a wedding day emergency kit?',
    a: "Your emergency kit should have: safety pins (20+), clear fashion tape, needle and thread, a painkiller and antacid, lip colour matching the bridal look, blotting paper and setting spray, a power bank and charger, a snack bar, a small water bottle, spare bindis and hair pins, a stain remover wipe, and a dupatta pin or brooch. Assign this kit to a bridesmaid — not the bride.",
  },
  {
    q: 'How early should the bridal makeup artist arrive on the wedding day?',
    a: "For a full bridal look (base, eyes, contouring, and final touches), allow 2.5–3 hours. If the MUA is doing multiple people (bride + mother + sisters), add 45–60 minutes per additional person. If your ceremony starts at 11 AM, your MUA should arrive by 7–7:30 AM at the latest. Always build in a 30-minute buffer.",
  },
  {
    q: "I'm planning the wedding last-minute (less than 30 days). What should I prioritise?",
    a: "With under 30 days, lock these in immediately in this order: (1) Venue — nothing else can be confirmed without it. (2) Caterer — most need 3+ weeks notice for large orders. (3) Photographer — good photographers book out first. (4) Pandit/officiant — non-negotiable. Everything else — decor, DJ, invitations — can be simplified or handled in the final week.",
  },
  {
    q: 'Should I have a wedding day coordinator or can family handle it?',
    a: "For weddings over 200 guests or with 3+ functions, a day-of coordinator (₹8,000–₹20,000) is worth every rupee — they manage vendor arrivals, handle crises, and keep the timeline running. For smaller intimate weddings, one calm, organised family member (not a parent, not the bride or groom) designated as the 'day manager' works very well.",
  },
  {
    q: 'When should I stop planning and just enjoy the wedding?',
    a: "The planning must stop 48 hours before the wedding. Make a firm rule: after that point, you will only execute what\'s already planned, not create new plans. Whatever isn\'t organised at that stage will either be handled by others or will simply not matter in the photos. The day will be beautiful. Let it.",
  },
];

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
        <span className="font-semibold text-gray-900 pr-2">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-rose-gold transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
          {item.a}
        </div>
      )}
    </div>
  );
}

// Week card with tickable tasks
function WeekCard({ week, checked, onToggle }) {
  const [expanded, setExpanded] = useState(true);
  const doneCount  = week.tasks.filter((t) => checked.has(t.id)).length;
  const totalCount = week.tasks.length;
  const allDone    = doneCount === totalCount;

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all ${allDone ? 'border-emerald-300 bg-emerald-50/30' : `border-gray-100 bg-white`}`}>
      {/* Week header — always visible, clickable to expand/collapse */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
        aria-expanded={expanded}
      >
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${week.color} flex items-center justify-center shrink-0 shadow-md`}>
          <week.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif font-bold text-lg text-gray-900 leading-snug flex items-center gap-2">
            {week.label}
            {allDone && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">{week.sublabel}</p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <div className="text-right">
            <span className={`text-sm font-bold ${allDone ? 'text-emerald-600' : 'text-gray-400'}`}>
              {doneCount}/{totalCount}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Task list */}
      {expanded && (
        <div className="border-t border-gray-100">
          <ul className="divide-y divide-gray-50">
            {week.tasks.map((task) => {
              const done = checked.has(task.id);
              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => onToggle(task.id)}
                    className={`w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50/80 ${done ? 'bg-emerald-50/40' : ''}`}
                  >
                    {/* Checkbox */}
                    <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'}`}>
                      {done && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>

                    {/* Category pill */}
                    <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${week.bg} ${week.text} border ${week.border}`}>
                      {task.cat}
                    </span>

                    {/* Task text */}
                    <span className={`flex-1 text-sm leading-relaxed transition-colors ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {task.text}
                    </span>

                    {/* Urgent badge */}
                    {task.urgent && !done && (
                      <span className="shrink-0 self-start mt-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-rose-gold/10 text-rose-gold border border-rose-gold/20">
                        Key
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LastMinuteChecklistArticle({
  post,
  readTime,
  copied,
  onShare,
  affiliateHref,
  affiliateCtaLabel,
}) {
  const [openFaq, setOpenFaq]   = useState(0);
  const [checked, setChecked]   = useState(new Set());

  const allTasks    = WEEKS.flatMap((w) => w.tasks);
  const totalTasks  = allTasks.length;
  const totalDone   = checked.size;
  const progressPct = Math.round((totalDone / totalTasks) * 100);

  function toggleTask(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function resetAll() { setChecked(new Set()); }

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-gold/20 to-plum/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-200/20 blur-3xl" />
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
      <header className="relative pt-24 pb-16 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-rose-gold/30 shadow-sm mb-6 animate-fade-in-up">
            <CalendarDays className="w-4 h-4 text-rose-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold/90">
              2026 Guide · Wedding Countdown
            </span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            Last-Minute{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold via-plum to-amber-500">
              Wedding Checklist
            </span>
          </h1>

          {/* Count pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-gold text-white text-sm font-bold shadow-lg">
              <CalendarDays className="w-4 h-4" /> 30 Days to Go
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-bold shadow-lg">
              ✓ {totalTasks} Tasks Across 7 Stages
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              Interactive & Tickable
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            30 days out and your heart is racing. Every family member has a new request, vendors
            are calling, and the to-do list keeps growing. This checklist breaks it all down —
            week by week, task by task — so you reach your wedding day calm and in control.
          </p>

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
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-rose-gold/15 border-4 border-white ring-1 ring-rose-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="Indian wedding celebration — last-minute planning guide"
              className="w-full aspect-[21/9] object-cover object-center"
              loading="eager"
            />
          </div>
        )}
      </header>

      {/* Article body */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-16 md:space-y-24">

        {/* Intro hook */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-gold/20 via-plum/15 to-amber-200/20 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-rose-50/60 border border-rose-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-rose-gold shrink-0" />
              30 days out — and the panic is real
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              One month before the wedding feels like a different world. The big decisions — venue,
              caterer, photographer — are done. But a new kind of pressure arrives: a hundred small
              tasks that all feel urgent, all feel important, and all feel like they're happening
              simultaneously. The mehendi needs confirming. The alterations aren't back. Your
              mother-in-law has added fifteen people to the guest list.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              The couples who arrive at their wedding day calm and happy aren't the ones who had
              the easiest weddings. They're the ones who had a plan for the final 30 days.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              This checklist is that plan. Work through it week by week. Tick every task as you go.
              By the time you reach the morning of your wedding, the only thing left to do is
              get dressed and feel beautiful.
            </p>
          </div>
        </section>

        {/* ── INTERACTIVE CHECKLIST ─────────────────────────────────────── */}
        <section id="checklist">

          {/* Sticky progress header */}
          <div className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-bold text-gray-900">{totalDone} of {totalTasks} tasks</span>
                  <span className="text-gray-400 text-sm ml-2">completed</span>
                </div>
                <div className="flex items-center gap-3">
                  {totalDone > 0 && (
                    <button type="button" onClick={resetAll} className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">
                      Reset all
                    </button>
                  )}
                  <span className={`text-sm font-bold ${progressPct === 100 ? 'text-emerald-600' : 'text-rose-gold'}`}>
                    {progressPct}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-gold via-plum to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {progressPct === 100 && (
                <p className="text-center text-emerald-600 text-xs font-semibold mt-2">
                  🎉 All done — you are completely ready!
                </p>
              )}
            </div>
          </div>

          {/* Week cards */}
          <div className="space-y-4">
            {WEEKS.map((week) => (
              <WeekCard key={week.id} week={week} checked={checked} onToggle={toggleTask} />
            ))}
          </div>
        </section>

        {/* Emergency kit */}
        <section id="emergency-kit">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                The wedding day emergency kit
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Pack this bag 3 days before. Give it to your bridesmaid — not your mother.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {EMERGENCY_KIT.map((item, i) => (
              <div key={item.item} className="flex gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-rose-gold/25 hover:shadow-md transition-all">
                <span className="w-7 h-7 rounded-lg bg-rose-gold/10 text-rose-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.item}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vendor call script */}
        <section id="vendor-script">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                The vendor confirmation call script
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Use these exact questions for every vendor call in the final 30 days.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {VENDOR_CALL_SCRIPT.map((row, i) => (
                <div key={row.q} className="flex gap-4 px-5 py-4">
                  <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{row.q}</p>
                    <p className="text-gray-800 text-sm font-medium italic">{row.s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200/60 mt-4">
            <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-sky-900 text-sm leading-relaxed">
              <strong>Always follow up calls with a WhatsApp message.</strong> "Hi [Name], just confirming our call — date is [DATE], venue is [VENUE], you'll arrive by [TIME]. My number on the day is [YOUR NUMBER]. Thank you!" A written record protects you if anything is disputed.
            </p>
          </div>
        </section>

        {/* Stress survival */}
        <section id="stress">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-violet-200/80 bg-gradient-to-br from-violet-50 to-purple-50/50 shadow-xl">
            <div className="px-6 py-4 bg-violet-100/80 border-b border-violet-200 flex items-center gap-3">
              <Heart className="w-7 h-7 text-violet-700" fill="currentColor" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-violet-950">
                Surviving the final 30 days without losing your mind
              </h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {STRESS_TIPS.map((item) => (
                <div key={item.tip} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-violet-950 mb-1">{item.tip}</p>
                    <p className="text-violet-800/80 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common mistakes */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                Last-minute mistakes Indian couples regret most
              </h2>
            </div>
            <ul className="p-6 md:p-8 space-y-4">
              {[
                { m: 'No written vendor reconfirmation', r: 'Verbal confirmations are forgotten. A vendor who swears they remembered may still arrive 2 hours late. Always follow every call with a WhatsApp message.' },
                { m: 'Guest count not locked early enough', r: 'Every extra guest confirmed in the final week costs double — last-minute catering additions are charged at premium rates by most caterers.' },
                { m: 'Skipping the final venue walkthrough', r: "Venues look different when set up vs empty. The seating may not work as planned. The generator may not have been tested. Visit in person 7–10 days before." },
                { m: 'Leaving bridal alterations too late', r: 'Tailors in the final week charge 2–3× extra and rush jobs compromise fit. All outfits should be finalised 2 weeks before the wedding.' },
                { m: 'No day-of emergency kit assigned', r: "Without an assigned kit and an assigned kit-keeper, emergency items don't get used. They stay in someone's bag while the bride searches for a safety pin." },
                { m: 'Planning until the night before', r: "Couples who plan until 11 PM the night before arrive at the wedding exhausted. Planning closes 48 hours out. The rest is execution." },
                { m: 'Not eating properly in the final week', r: 'Low blood sugar causes anxiety, headaches, and tears at the worst possible moments. Eat every meal, no matter how busy you are.' },
              ].map((row) => (
                <li key={row.m} className="flex gap-3 text-amber-950/90 list-none">
                  <span className="text-amber-600 font-bold text-lg leading-snug shrink-0">×</span>
                  <span className="leading-relaxed"><strong>{row.m}:</strong> {row.r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pro tip */}
        <section>
          <div className="flex gap-4 p-6 md:p-8 rounded-2xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-2 text-lg">The "wedding day manager" rule</p>
              <p className="text-amber-800 leading-relaxed">
                Designate <strong>one person</strong> as the wedding day manager — not the bride,
                not the groom, not either set of parents. This is a calm, responsible family member
                or close friend whose only job on the wedding day is to coordinate vendors, handle
                emergencies, and protect the couple from logistics. Brief them with the vendor list,
                timeline, emergency kit, and payment envelopes 3 days before. This one decision
                removes 80% of wedding day stress from the couple.
              </p>
            </div>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-rose-gold via-rose-600 to-plum p-1 shadow-2xl shadow-rose-gold/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Track your entire wedding checklist on Wedora
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Automated reminders, vendor management, and a real-time checklist — so nothing slips
              through the cracks in the final 30 days. Free to use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-rose-50 transition-colors shadow-lg">
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
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Frequently asked questions
          </h2>
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

        {/* Closing */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            30 days is plenty. You've got this.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The couples who enjoy their wedding day the most are not the ones with the biggest
            budgets or the most elaborate plans. They're the ones who finished their planning
            two days before — and spent the final 48 hours resting, connecting with family,
            and simply being present. Work through this checklist. Tick every box. Then put
            it down and enjoy every moment of the day you've been planning for.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free wedding checklist</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Vendor tracker</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Budget planner</span>
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
        <BlogInternalLinks currentSlug="last-minute-wedding-checklist" />
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
