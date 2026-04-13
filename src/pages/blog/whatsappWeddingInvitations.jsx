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
  MessageCircle,
  Smartphone,
  Palette,
  Send,
  Users,
  ThumbsUp,
  ThumbsDown,
  Video,
  Image,
  FileText,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

// ─── Slug & static post ──────────────────────────────────────────────────────

export const WHATSAPP_INVITE_SLUG = 'whatsapp-wedding-invitations-modern-trend-guide';

// Unsplash: person holding phone — modern digital communication
const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=85&auto=format&fit=crop';

export function getStaticWhatsAppInvitePost() {
  const now = new Date().toISOString();
  return {
    id: 'static-whatsapp-invite-2026',
    title: 'WhatsApp Wedding Invitations: The Modern Trend Guide for Indian Weddings',
    slug: WHATSAPP_INVITE_SLUG,
    excerpt:
      'WhatsApp invitations are now the first choice for modern Indian weddings. Get ready-to-use message templates, design tips, etiquette rules, and a free message builder — all in one guide.',
    content: '',
    tags: 'WhatsApp Invitations, Digital Wedding Invites, Indian Wedding, Wedding Trends',
    featured_image: FEATURED_IMAGE,
    meta_title: 'WhatsApp Wedding Invitations: Modern Trend Guide for Indian Weddings 2026 | Wedora',
    meta_description:
      'Everything about WhatsApp wedding invitations for Indian weddings. Ready-to-use templates, design tips, timing guide, etiquette rules, and a free message builder.',
    keywords:
      'whatsapp wedding invitation india, digital wedding invitation whatsapp, whatsapp wedding invite message, wedding invitation on whatsapp, modern wedding invitation india 2026, wedora',
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

// Ready-to-use message templates
const TEMPLATES = [
  {
    id: 'formal-hindu',
    label: 'Formal Hindu Wedding',
    tone: 'Traditional & Formal',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    icon: '🪔',
    message: `🌸 *With the blessings of God and our families* 🌸

We joyfully announce the wedding of

*[BRIDE'S NAME]* 🌺
daughter of [Bride's Father] & [Bride's Mother]

with

*[GROOM'S NAME]* ✨
son of [Groom's Father] & [Groom's Mother]

━━━━━━━━━━━━━━━

📅 *Date:* [WEDDING DATE]
⏰ *Time:* [TIME] onwards
📍 *Venue:* [VENUE NAME]
[VENUE ADDRESS]

*Functions:*
🌿 Mehendi – [DATE], [TIME]
💛 Haldi – [DATE], [TIME]
💍 Pheras – [DATE], [TIME]
🎊 Reception – [DATE], [TIME]

━━━━━━━━━━━━━━━

Your presence will make our celebration complete. 🙏

*RSVP by [DATE] to:*
📞 [CONTACT NUMBER]`,
  },
  {
    id: 'modern-casual',
    label: 'Modern & Casual',
    tone: 'Friendly & Contemporary',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    icon: '💜',
    message: `Hey! 👋

Big news — we're getting married! 🎉💍

*[BRIDE'S NAME] & [GROOM'S NAME]*

We'd love for you to be there as we begin this new chapter together.

📅 *[WEDDING DATE]*
⏰ *[TIME]*
📍 *[VENUE]*

It's going to be a beautiful day full of love, laughter, and amazing food 😄🍽️

Please save the date and let us know you're coming!

Reply here or call *[CONTACT NUMBER]* to RSVP 💌

Can't wait to celebrate with you! 🥂`,
  },
  {
    id: 'muslim-nikah',
    label: 'Muslim Nikah',
    tone: 'Traditional Islamic',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    icon: '🌙',
    message: `*بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ*
_In the name of Allah, the Most Gracious, the Most Merciful_

With immense joy and gratitude to Allah (SWT), we invite you to celebrate the Nikah of

*[BRIDE'S NAME]* 🌸
daughter of [Bride's Father] & [Bride's Mother]

with

*[GROOM'S NAME]* ✨
son of [Groom's Father] & [Groom's Mother]

━━━━━━━━━━━━━━━

🕌 *Nikah Ceremony*
📅 [DATE] | ⏰ [TIME]
📍 [VENUE / MASJID NAME]

🎊 *Walima (Reception)*
📅 [DATE] | ⏰ [TIME]
📍 [VENUE]

━━━━━━━━━━━━━━━

_"And of His signs is that He created for you from yourselves mates that you may find tranquility in them"_ — Quran 30:21

Your duas and presence will be our greatest blessing. 🤲

RSVP: *[CONTACT NUMBER]*`,
  },
  {
    id: 'south-indian',
    label: 'South Indian Wedding',
    tone: 'Traditional South Indian',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    icon: '🌺',
    message: `🌺 *Vanakkam / Namaskara* 🌺

With the blessings of Almighty and our elders, we are delighted to invite you to the wedding celebration of

*[BRIDE'S NAME]* 💛
daughter of [Bride's Father] & [Bride's Mother]

with

*[GROOM'S NAME]* 🌿
son of [Groom's Father] & [Groom's Mother]

━━━━━━━━━━━━━━━

🪷 *Muhurtham (Wedding)*
📅 [DATE]
⏰ [AUSPICIOUS TIME] – Shubh Muhurtham
📍 [VENUE], [CITY]

🌸 *Reception*
📅 [DATE] | ⏰ [TIME] onwards

━━━━━━━━━━━━━━━

*Dress Code:* [SILK SAREE / TRADITIONAL]

We seek your blessings and look forward to your warm presence. 🙏

RSVP: *[CONTACT NUMBER]*
[GOOGLE MAPS LINK]`,
  },
  {
    id: 'destination',
    label: 'Destination Wedding',
    tone: 'Exciting & Wanderlust',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    icon: '✈️',
    message: `✈️ You're invited to pack your bags! 🎊

*[BRIDE'S NAME] & [GROOM'S NAME]*
are getting married — and they want you there!

📍 *Destination:* [CITY / VENUE]
📅 *Wedding Weekend:* [DATE RANGE]

*The Celebration:*
🌅 Welcome Dinner – [DATE], [TIME]
💐 Mehendi Evening – [DATE], [TIME]  
🎊 Wedding Ceremony – [DATE], [TIME]
🥂 Reception Night – [DATE], [TIME]

━━━━━━━━━━━━━━━

*Stay Details:*
🏨 [HOTEL NAME]
Book by *[DATE]* for the group rate
Reservation link: [LINK]

━━━━━━━━━━━━━━━

RSVP by *[DATE]* — we're finalising rooms and transport 🚌

Contact: *[NAME]* at *[NUMBER]*

We can't do this without you there! 🥹🎉`,
  },
  {
    id: 'sikh-anand-karaj',
    label: 'Sikh Anand Karaj',
    tone: 'Traditional Sikh',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: '🪯',
    message: `🙏 *Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh* 🙏

With the grace of Waheguru and the blessings of our families, we joyfully announce the Anand Karaj of

*[BRIDE'S NAME]* 💛
daughter of [Bride's Father] & [Bride's Mother]

with

*[GROOM'S NAME]* ✨
son of [Groom's Father] & [Groom's Mother]

━━━━━━━━━━━━━━━

🪯 *Anand Karaj*
📅 [DATE] | ⏰ [TIME]
📍 [GURUDWARA NAME & ADDRESS]

🎊 *Reception*
📅 [DATE] | ⏰ [TIME]
📍 [VENUE]

━━━━━━━━━━━━━━━

_"Kar kirpa prabh mil mere pyaare"_

Your presence and blessings will make our day truly special. 🙏

RSVP: *[CONTACT NUMBER]*`,
  },
];

// WhatsApp invite design formats
const INVITE_FORMATS = [
  {
    id: 'text',
    icon: FileText,
    title: 'Formatted Text Message',
    pros: ['Zero cost', 'Works on every phone', 'Fast to personalise', 'Can be forwarded easily', 'No download required'],
    cons: ['Less visual impact', 'No photos or graphics', 'Easy to scroll past'],
    bestFor: 'Close family, elderly relatives, and anyone with basic smartphones',
    cost: '₹0',
    rating: 4,
  },
  {
    id: 'image',
    icon: Image,
    title: 'Designed Image Card',
    pros: ['Visually striking', 'Brand-consistent', 'Works offline once downloaded', 'Screenshot-shareable'],
    cons: ['Requires a designer or app', 'May not display well on small screens', 'Can look generic if not customised'],
    bestFor: 'Main invite for all guests — the most popular format in India right now',
    cost: '₹0 (Canva) to ₹3,000 (designer)',
    rating: 5,
  },
  {
    id: 'video',
    icon: Video,
    title: 'Animated Video Invite',
    pros: ['Highest recall', 'Premium feel', 'Shareable on Instagram / Status', 'Guests often screenshot and share'],
    cons: ['Costs ₹1,500–₹5,000', 'Large file size — may not send on slow connections', 'Takes 3–5 days to create'],
    bestFor: 'Main wedding invite for close friends and family who will share it widely',
    cost: '₹1,500 – ₹5,000',
    rating: 5,
  },
  {
    id: 'pdf',
    icon: FileText,
    title: 'PDF e-Invite',
    pros: ['Multiple pages possible', 'Includes map, schedule, dress code', 'Professional appearance', 'Printable'],
    cons: ['Not everyone opens PDFs on mobile', 'Larger file size', 'Less shareable than images'],
    bestFor: 'Corporate colleagues, formal guests, and out-of-town guests who need full event details',
    cost: '₹0 (Canva) to ₹2,000',
    rating: 3,
  },
];

// Timing guide
const TIMING_GUIDE = [
  { days: '90–120 days before', action: 'Save the Date', format: 'Short text or simple image', note: 'Out-of-station guests and close family. Keep it brief — date, city, and a note that full invite follows.' },
  { days: '30–45 days before', action: 'Main Invitation', format: 'Designed image or video invite', note: 'Your primary invite to all guests. Include all function details, venue, and RSVP instructions.' },
  { days: '14–21 days before', action: 'Function-Specific Reminders', format: 'Short text message', note: 'Separate reminders for mehendi, haldi, and reception with specific timings and dress codes.' },
  { days: '3–5 days before', action: 'Final Reminder', format: 'Concise text + venue map link', note: 'A brief "we can\'t wait to see you" with parking info and Google Maps link. Not a resend of the full invite.' },
  { days: 'Day before', action: 'Practical Reminder', format: 'Very short text', note: 'Just timing confirmation + dress code. "Tomorrow! Pheras at 10 AM sharp. Dress code: traditional. See you there! 🥰"' },
];

// Etiquette rules — dos and don'ts
const DOS = [
  { rule: 'Always send to individuals, not broadcast lists', detail: 'A broadcast message shows up as a text from a contact, not as a group message — but people know it\'s mass-sent. For close family and VIPs, personalise with their name in the first line.' },
  { rule: 'Include a Google Maps link in every invite', detail: 'Even if the venue is well-known, not everyone knows the exact gate or parking entrance. A pin saves enormous confusion on the day.' },
  { rule: 'Specify the dress code clearly', detail: '"Traditional attire" is vague. "Ladies: saree or anarkali. Gentlemen: kurta or suit" is helpful. Guests genuinely appreciate the clarity.' },
  { rule: 'Create function-specific group chats', detail: 'A "Mehendi Friends" group and a "Reception Family" group lets you send targeted reminders without spamming everyone with every detail.' },
  { rule: 'Send a PDF or image invite for elderly guests', detail: 'Follow up every digital invite to relatives over 65 with a phone call. "Auntyji, I sent the invite on WhatsApp — did you receive it? Let me know if you need help opening it."' },
  { rule: 'Request acknowledgement, not just delivery ticks', detail: 'Two blue ticks mean delivered, not confirmed. Add "Please reply with ✅ to confirm" so you actually know who has received and noted the invite.' },
];

const DONTS = [
  { rule: "Don't add guests to groups without permission", detail: 'Adding someone to a wedding WhatsApp group without asking is considered intrusive. Always message first: "Is it okay if I add you to the wedding group?"' },
  { rule: "Don't send invites after 9 PM or before 8 AM", detail: 'Late-night notifications read as inconsiderate. Schedule your sends during morning or early evening hours.' },
  { rule: "Don't use low-resolution images", detail: 'A blurry or pixelated invite looks unprofessional. Export from Canva at the highest resolution — 1080×1080px minimum for image invites.' },
  { rule: "Don't over-message", detail: 'Three reminders maximum: main invite, one week before, and day before. More than that becomes spam and people mute the chat.' },
  { rule: "Don't rely only on WhatsApp for elderly relatives", detail: 'Always print 20–30 physical cards for grandparents, elderly relatives, and family members without smartphones. Digital does not replace physical for this audience.' },
  { rule: "Don't ignore RSVP management", detail: 'Sending the invite is step one. Tracking who has confirmed, who hasn\'t replied, and following up is step two. Keep a simple list.' },
];

// Canva template tips
const DESIGN_TIPS = [
  { tip: 'Stick to 2–3 colours matching your wedding palette', detail: 'If your wedding colours are deep red and gold, your digital invite should reflect that. Consistency makes the invite feel premium and intentional.' },
  { tip: 'Use a serif font for names, sans-serif for details', detail: 'Serif fonts (like Playfair Display or Cormorant) give a premium feel for the couple\'s names. Clean sans-serifs (like DM Sans or Lato) keep event details readable.' },
  { tip: 'Leave generous white space', detail: 'The most common design mistake is cramming everything in. White space makes the invite look expensive. If it feels empty, that\'s usually correct.' },
  { tip: '1080×1920px for WhatsApp Status, 1080×1080px for messages', detail: 'Use portrait format for WhatsApp Status sharing (stories format). Square format works best as a direct message attachment.' },
  { tip: 'Keep text to a minimum on image cards', detail: 'An image invite should have: couple names, date, time, venue, and one line of context. Full event details belong in the accompanying text message.' },
  { tip: 'Test on an actual phone before sending', detail: 'What looks good on a laptop can be unreadable on a 5-inch phone screen. Send a test to yourself and check both the thumbnail and the full image before bulk sending.' },
];

// Common mistakes
const MISTAKES = [
  { m: 'Sending a wall of text with no formatting', r: 'Unformatted WhatsApp messages look like spam. Use *bold*, line breaks, and emoji sparingly to create visual hierarchy and make key info scannable.' },
  { m: 'Forgetting to include a venue map link', r: 'The most-asked question on every wedding day is "what is the exact address?" Save yourself 200 phone calls by adding a Google Maps pin to every invite.' },
  { m: 'Sending the invite to people you haven\'t confirmed are invited', r: 'Once someone receives a wedding invite, they expect to attend. Confirm your guest list before sending. There is no graceful way to uninvite someone.' },
  { m: 'Making the video invite file too large to send', r: 'WhatsApp compresses videos above 16MB. Use a compressed export or share via Google Drive link for video invites. Test send before bulk sending.' },
  { m: 'Not managing RSVP confirmations', r: 'An invite without RSVP tracking is a wasted opportunity. Keep a simple spreadsheet or use Wedora\'s guest management tool to track who has confirmed.' },
  { m: 'Using a generic Canva template without personalisation', r: 'The most popular Canva wedding templates are used by thousands of couples every month. Customise the colours, fonts, and layout to make it feel uniquely yours.' },
];

const FAQS = [
  {
    q: 'Are WhatsApp wedding invitations acceptable for all guests in India?',
    a: "Yes — for most guests. WhatsApp invitations are now fully socially accepted across all age groups in urban and semi-urban India. The only group that still benefits from a physical card is elderly relatives (65+) and senior family members for whom a printed card carries cultural and emotional significance. A common approach: digital for 90% of guests, 20–30 printed cards for elders.",
  },
  {
    q: 'How much does a WhatsApp wedding invitation cost?',
    a: "Costs range from ₹0 to ₹5,000 depending on format. A text message costs nothing. A designed image created on Canva costs ₹0. A custom-designed image from a professional costs ₹800–₹2,000. An animated video invite typically costs ₹1,500–₹5,000 from a freelancer or Fiverr designer. A PDF e-invite created on Canva costs ₹0.",
  },
  {
    q: 'How early should I send WhatsApp wedding invitations?',
    a: "Send the Save the Date 90–120 days before for out-of-station guests, and 45–60 days before for local guests. Send the main invitation 30–45 days before the wedding. Follow up with function-specific reminders 14–21 days before. Send a final reminder 3–5 days before. The day before, send a brief timing confirmation. Five touchpoints total is the right amount.",
  },
  {
    q: 'What should I include in a WhatsApp wedding invitation?',
    a: "The essential elements are: couple's full names, wedding date and time, venue name and address, Google Maps link, RSVP contact number and deadline, and dress code. For multi-function weddings, include a mini schedule of all functions with their individual dates and times. For destination weddings, also include accommodation details and a booking deadline.",
  },
  {
    q: 'Can I use WhatsApp broadcast lists to send wedding invitations?',
    a: "Technically yes, but use them carefully. Broadcast messages only go to contacts who have saved your number — if they haven't, they won't receive it. Broadcasts also don't let you see who has read and who hasn't individually. For VIPs and close family, a direct personal message with their name is always more appropriate and more likely to get an RSVP.",
  },
  {
    q: 'What is the best app to design a WhatsApp wedding invitation?',
    a: "Canva is the most widely used and the best for most couples — it's free, has hundreds of Indian wedding templates, and exports at high resolution. For animated video invites, InShot or CapCut work well for self-made videos. For professional-quality animated invites, platforms like WedMeGood, ShaadiSaga, or a Fiverr graphic designer deliver better results than DIY.",
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

// Star rating component
function StarRating({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? 'text-amber-400' : 'text-gray-200'}`} fill={i <= n ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

// Template card with copy button
function TemplateCard({ tpl }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function copyMessage() {
    navigator.clipboard.writeText(tpl.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Preview: first 3 lines
  const lines  = tpl.message.split('\n');
  const preview = lines.slice(0, 4).join('\n');

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className={`px-5 py-4 bg-gradient-to-r ${tpl.color} text-white flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tpl.icon}</span>
          <div>
            <p className="font-serif font-bold text-base leading-snug">{tpl.label}</p>
            <p className="text-white/80 text-xs">{tpl.tone}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={copyMessage}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Message preview */}
      <div className={`p-5 ${tpl.bg}`}>
        {/* WhatsApp-style message bubble */}
        <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 max-w-sm">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {expanded ? tpl.message : preview + (lines.length > 4 ? '\n...' : '')}
          </pre>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <p className={`text-xs font-medium ${tpl.text}`}>
              Replace all [BRACKETED] fields with your details
            </p>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={`text-xs font-semibold ${tpl.text} hover:underline`}
            >
              {expanded ? 'Show less' : 'Show full'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive message builder
function MessageBuilder() {
  const [form, setForm] = useState({
    brideName: '',
    groomName: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    rsvpName: '',
    rsvpNumber: '',
    mapsLink: '',
    tone: 'warm',
  });
  const [copied, setCopied] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const isReady = form.brideName && form.groomName && form.date && form.venue;

  function buildMessage() {
    const names = `${form.brideName} & ${form.groomName}`;
    const salutation = form.tone === 'formal'
      ? `With joyful hearts and the blessings of our families,\nwe invite you to celebrate the wedding of\n\n*${names}*`
      : form.tone === 'warm'
      ? `We have some wonderful news — we're getting married! 💍\n\n*${names}*`
      : `Big day alert! 🎉\n\n*${names}* are tying the knot!`;

    return `${salutation}

━━━━━━━━━━━━━━━

📅 *Date:* ${form.date || '[DATE]'}
⏰ *Time:* ${form.time || '[TIME]'} onwards
📍 *Venue:* ${form.venue || '[VENUE]'}${form.city ? `, ${form.city}` : ''}${form.mapsLink ? `\n🗺️ *Map:* ${form.mapsLink}` : ''}

━━━━━━━━━━━━━━━

${form.tone === 'formal' ? 'Your presence will be our greatest joy. 🙏' : form.tone === 'warm' ? 'We cannot wait to celebrate with you! 🥂' : 'Come party with us! 🥳'}

${form.rsvpName || form.rsvpNumber ? `RSVP${form.rsvpName ? ` to ${form.rsvpName}` : ''}${form.rsvpNumber ? `: *${form.rsvpNumber}*` : ''}` : 'Please RSVP to confirm your attendance.'}`;
  }

  function copyBuilt() {
    navigator.clipboard.writeText(buildMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Builder header */}
      <div className="px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-700 text-white">
        <p className="font-serif font-bold text-lg flex items-center gap-2">
          <Zap className="w-5 h-5" /> Quick Message Builder
        </p>
        <p className="text-white/80 text-sm mt-0.5">Fill in your details — your invite generates instantly below.</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Form grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'brideName',   label: "Bride's Name",    placeholder: 'e.g. Priya Sharma' },
            { key: 'groomName',   label: "Groom's Name",    placeholder: 'e.g. Arjun Mehta' },
            { key: 'date',        label: 'Wedding Date',    placeholder: 'e.g. Sunday, 15th March 2026' },
            { key: 'time',        label: 'Start Time',      placeholder: 'e.g. 6:00 PM' },
            { key: 'venue',       label: 'Venue Name',      placeholder: 'e.g. The Grand Ballroom' },
            { key: 'city',        label: 'City',            placeholder: 'e.g. Pune' },
            { key: 'rsvpName',    label: 'RSVP Contact Name', placeholder: 'e.g. Rahul (bride\'s brother)' },
            { key: 'rsvpNumber',  label: 'RSVP Phone Number', placeholder: 'e.g. 98765 43210' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {f.label}
              </label>
              <input
                type="text"
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none text-sm text-gray-900 placeholder-gray-300 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Maps link */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Google Maps Link (optional but recommended)
          </label>
          <input
            type="text"
            value={form.mapsLink}
            onChange={(e) => set('mapsLink', e.target.value)}
            placeholder="Paste your Google Maps short link here"
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-gray-200 focus:border-violet-400 focus:outline-none text-sm text-gray-900 placeholder-gray-300 transition-colors"
          />
        </div>

        {/* Tone selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Message Tone
          </label>
          <div className="flex gap-3 flex-wrap">
            {[
              { k: 'formal', label: '🙏 Formal & Traditional' },
              { k: 'warm',   label: '💌 Warm & Friendly' },
              { k: 'fun',    label: '🎉 Fun & Casual' },
            ].map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => set('tone', t.k)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  form.tone === t.k
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        {isReady && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Your invite — ready to copy
            </label>
            {/* WhatsApp bubble */}
            <div className="bg-[#ECE5DD] rounded-2xl p-4">
              <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 max-w-sm">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {buildMessage()}
                </pre>
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-gray-400">✓✓</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={copyBuilt}
              className={`mt-4 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-violet-500 to-purple-700 text-white hover:shadow-xl'
              }`}
            >
              <Copy className="w-4 h-4" />
              {copied ? '✅ Copied to clipboard!' : 'Copy this invite message'}
            </button>
          </div>
        )}

        {!isReady && (
          <div className="text-center py-6 text-gray-400 text-sm">
            Fill in at least Bride's Name, Groom's Name, Date, and Venue to generate your invite →
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WhatsAppInviteArticle({
  post,
  readTime,
  copied,
  onShare,
  affiliateHref,
  affiliateCtaLabel,
}) {
  const [openFaq, setOpenFaq]         = useState(0);
  const [activeFormat, setActiveFormat] = useState(null);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-400/15 to-purple-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-emerald-200/15 blur-3xl" />
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
      <header className="relative pt-24 pb-16 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-violet-400/30 shadow-sm mb-6 animate-fade-in-up">
            <MessageCircle className="w-4 h-4 text-violet-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
              2026 Guide · Digital Invitations
            </span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.08] mb-6 animate-fade-in-up">
            WhatsApp Wedding{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-rose-gold">
              Invitations
            </span>
          </h1>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-bold shadow-lg">
              <MessageCircle className="w-4 h-4" /> 6 Ready-to-Use Templates
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-gold text-white text-sm font-bold shadow-lg">
              <Zap className="w-4 h-4" /> Free Message Builder
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              Etiquette Guide Included
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Over 70% of Indian wedding invitations in 2026 are sent on WhatsApp. This guide
            covers everything — formats, templates, timing, design, and the etiquette rules
            that make your invite stand out.
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
          <div className="max-w-5xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-violet-400/15 border-4 border-white ring-1 ring-violet-100">
            <img
              src={ensureHttps(post.featured_image)}
              alt="WhatsApp wedding invitation on mobile phone"
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
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/20 via-purple-300/15 to-rose-gold/20 rounded-[2rem] blur-xl opacity-60" />
          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-violet-50/60 border border-violet-100/80 p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-violet-500 shrink-0" />
              The printed card had a good run. WhatsApp took over.
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Not too long ago, a wedding invitation was a physical object — heavy card stock, embossed
              lettering, a silk bow, and a box of dry fruits. It was handed over in person or posted
              weeks in advance. And honestly? It was beautiful.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              But in 2026, your cousin hears about your wedding date on a WhatsApp group before
              the printed cards are even designed. Your college friends RSVP on a voice note.
              Your mother's entire kitty party gets the invite on the family group. And your
              out-of-station guests receive a video invite that they screenshot and share on
              their own Status.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              WhatsApp wedding invitations are not a compromise — they are a genuinely better
              communication tool for most of your guests. This guide shows you how to do them
              properly: the right format, the right timing, ready-to-use templates, and the
              etiquette rules that keep it personal and thoughtful.
            </p>
          </div>
        </section>

        {/* Why WhatsApp won */}
        <section id="why">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Why WhatsApp became the default</h2>
              <p className="text-gray-500 text-sm mt-1">The numbers are not even close anymore.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { stat: '500M+',   label: 'WhatsApp users in India', sub: 'More than anywhere else in the world', color: 'bg-violet-600', icon: '📱' },
              { stat: '70%+',    label: 'Indian wedding invites now sent digitally', sub: 'Up from under 20% in 2020', color: 'bg-emerald-600', icon: '📩' },
              { stat: '₹0',      label: 'Cost of a perfectly formatted text invite', sub: 'vs ₹30–₹150 per printed card', color: 'bg-rose-gold', icon: '💰' },
              { stat: '< 2 min', label: 'Time to send 200 invites on WhatsApp', sub: 'vs 2–3 weeks for printed + posted cards', color: 'bg-sky-600', icon: '⚡' },
            ].map((s) => (
              <div key={s.label} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-3xl shrink-0">{s.icon}</span>
                <div>
                  <p className={`text-2xl font-black font-serif ${s.color === 'bg-rose-gold' ? 'text-rose-gold' : s.color === 'bg-violet-600' ? 'text-violet-600' : s.color === 'bg-emerald-600' ? 'text-emerald-600' : 'text-sky-600'}`}>
                    {s.stat}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 p-5 rounded-2xl bg-violet-50 border border-violet-200/60">
            <Lightbulb className="w-6 h-6 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-violet-900 text-sm leading-relaxed">
              <strong>The hybrid approach works best:</strong> Send WhatsApp invitations to 90–95% of
              your guest list. Print 20–30 physical cards for grandparents, elderly relatives, and
              senior family members for whom a physical card carries emotional significance.
              You save ₹15,000–₹40,000 in printing costs and get better reach.
            </p>
          </div>
        </section>

        {/* Format guide */}
        <section id="formats">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">4 WhatsApp invite formats compared</h2>
              <p className="text-gray-500 text-sm mt-1">Pick the right format for each audience.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {INVITE_FORMATS.map((fmt) => {
              const isOpen = activeFormat === fmt.id;
              return (
                <div key={fmt.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setActiveFormat(isOpen ? null : fmt.id)}
                    className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <fmt.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{fmt.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating n={fmt.rating} />
                        <span className="text-xs text-gray-400">{fmt.cost}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" /> Pros
                          </p>
                          <ul className="space-y-1">
                            {fmt.pros.map((p) => (
                              <li key={p} className="text-xs text-emerald-800 flex gap-1.5">
                                <span className="shrink-0 mt-0.5">✓</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-rose-50 rounded-xl p-3">
                          <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ThumbsDown className="w-3 h-3" /> Cons
                          </p>
                          <ul className="space-y-1">
                            {fmt.cons.map((c) => (
                              <li key={c} className="text-xs text-rose-800 flex gap-1.5">
                                <span className="shrink-0 mt-0.5">×</span>{c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-amber-50 rounded-xl px-3 py-2.5">
                        <p className="text-xs text-amber-800">
                          <strong>Best for:</strong> {fmt.bestFor}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Message builder */}
        <section id="builder">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Build your WhatsApp invite in 60 seconds</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in your details. Copy the message. Done.</p>
            </div>
          </div>
          <MessageBuilder />
        </section>

        {/* Templates */}
        <section id="templates">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/25">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">6 ready-to-use templates</h2>
              <p className="text-gray-500 text-sm mt-1">
                Copy any template, replace the [BRACKETED] fields, and send.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {TEMPLATES.map((tpl) => (
              <TemplateCard key={tpl.id} tpl={tpl} />
            ))}
          </div>
        </section>

        {/* Timing guide */}
        <section id="timing">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">When to send each message</h2>
              <p className="text-gray-500 text-sm mt-1">The 5-touchpoint timeline every Indian wedding needs.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-left">
                    <th className="px-4 py-4 font-semibold whitespace-nowrap">When</th>
                    <th className="px-4 py-4 font-semibold">What to send</th>
                    <th className="px-4 py-4 font-semibold hidden sm:table-cell">Format</th>
                    <th className="px-4 py-4 font-semibold hidden md:table-cell">Key note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TIMING_GUIDE.map((row, i) => (
                    <tr key={row.days} className={`hover:bg-amber-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-amber-700 whitespace-nowrap">{row.days}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.action}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{row.format}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Design tips */}
        <section id="design">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Design tips for image & video invites</h2>
              <p className="text-gray-500 text-sm mt-1">What separates a beautiful invite from a forgettable one.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {DESIGN_TIPS.map((item, i) => (
              <div key={item.tip} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-300/40 hover:shadow-md transition-all">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{item.tip}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Etiquette — dos and don'ts */}
        <section id="etiquette">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3 text-center">
            WhatsApp invitation etiquette
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm max-w-xl mx-auto">
            Digital invitations have their own social norms. These are the unwritten rules that
            experienced Indian wedding planners follow.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dos */}
            <div className="rounded-2xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-teal-50/50 overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-emerald-100/80 border-b border-emerald-200 flex items-center gap-3">
                <ThumbsUp className="w-6 h-6 text-emerald-700" />
                <h3 className="font-serif font-bold text-emerald-950 text-lg">Always do this</h3>
              </div>
              <ul className="p-5 space-y-4">
                {DOS.map((item) => (
                  <li key={item.rule} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-950 text-sm">{item.rule}</p>
                      <p className="text-emerald-800/80 text-xs leading-relaxed mt-0.5">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="rounded-2xl border-2 border-rose-200/80 bg-gradient-to-br from-rose-50 to-pink-50/50 overflow-hidden shadow-lg">
              <div className="px-5 py-4 bg-rose-100/80 border-b border-rose-200 flex items-center gap-3">
                <ThumbsDown className="w-6 h-6 text-rose-700" />
                <h3 className="font-serif font-bold text-rose-950 text-lg">Never do this</h3>
              </div>
              <ul className="p-5 space-y-4">
                {DONTS.map((item) => (
                  <li key={item.rule} className="flex gap-3">
                    <span className="text-rose-500 font-bold text-base leading-snug shrink-0">×</span>
                    <div>
                      <p className="font-semibold text-rose-950 text-sm">{item.rule}</p>
                      <p className="text-rose-800/80 text-xs leading-relaxed mt-0.5">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Mistakes */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">
                Common WhatsApp invite mistakes to avoid
              </h2>
            </div>
            <ul className="p-6 md:p-8 space-y-4">
              {MISTAKES.map((row) => (
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
          <div className="flex gap-4 p-6 md:p-8 rounded-2xl bg-violet-50 border border-violet-200/60">
            <Lightbulb className="w-7 h-7 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-violet-900 mb-2 text-lg">The "personal first line" rule</p>
              <p className="text-violet-800 leading-relaxed">
                For your closest 20–30 people — immediate family, best friends, childhood friends —
                start the message with their name: <em>"Hey Riya! You're one of the first people
                we're telling — we'd love for you to be at our wedding..."</em> Then the formal
                invite follows. This one sentence transforms a broadcast message into a personal
                invitation. These are the people whose memories of your wedding matter most.
                Give them the feeling that they were personally invited.
              </p>
            </div>
          </div>
        </section>

        {/* Tools CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-violet-500 via-purple-600 to-rose-gold p-1 shadow-2xl shadow-violet-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Manage your entire guest list on Wedora
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Track RSVPs, manage guest confirmations, and keep your invitation follow-ups
              organised — all in one place. Free to use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-violet-50 transition-colors shadow-lg">
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
            A great invitation sets the tone for a great wedding
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Your WhatsApp invitation is the first impression of your wedding day. Done right —
            with the right format, the right words, and the right timing — it builds excitement,
            confirms attendance, and makes every guest feel genuinely wanted. Use the templates
            above, build your message with the generator, and send with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free wedding checklist</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Guest manager</span>
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
        <BlogInternalLinks currentSlug="best-whatsapp-wedding-invitation-messages" />
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
