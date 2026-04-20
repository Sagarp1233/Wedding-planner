import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Copy, Sparkles, Heart, Star,
  Lightbulb, AlertTriangle, CheckCircle2, ChevronDown,
  ChevronRight, CalendarDays, Moon, Sun, Zap, BookOpen,
  IndianRupee, Shield, Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const MUHURAT_DATES_SLUG = 'hindu-wedding-muhurat-dates-2026-2027';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=85&auto=format&fit=crop';

export function getStaticMuhuratDatesPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-muhurat-dates-2026-2027',
    title: 'Hindu Wedding Muhurat Dates 2026 & 2027: Complete Shubh Vivah Calendar',
    slug: MUHURAT_DATES_SLUG,
    excerpt:
      '52+ auspicious Hindu wedding dates in 2026 and 96+ in 2027 — month-by-month Shubh Vivah Muhurat calendar with Nakshatra details, blocked periods, Chaturmas guide, and expert tips for booking venues on time.',
    content: '',
    tags: 'Wedding Muhurat, Hindu Wedding Dates, Shubh Vivah, Wedding Planning',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Hindu Wedding Muhurat Dates 2026 & 2027: Complete Shubh Vivah Calendar | Wedora',
    meta_description:
      '52+ auspicious Hindu wedding muhurat dates in 2026 and 96+ in 2027. Month-by-month calendar, blocked periods explained, Nakshatra guide, and expert planning tips.',
    keywords:
      'hindu wedding muhurat dates 2026, vivah muhurat 2026, shubh vivah muhurat 2027, wedding dates 2026 india, auspicious marriage dates 2026 hindu calendar, shaadi muhurat 2027, lagan dates 2027',
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
// All dates sourced from multiple Hindu Panchang authorities
// Cross-referenced: DestinationWeddingsIndia, Astroyogi, DrikPanchang, BlueStone, WeddingFocus
// Note: exact muhurat timings vary by city — consult local pandit for precise timing

const MONTHS_2026 = [
  {
    month: 'January 2026', short: 'Jan', available: false,
    reason: 'No Shubh Muhurat — Khar Maas (Sun in Sagittarius/Capricorn) and Venus combustion create inauspicious conditions. Dec 16 2025 – Jan 14 2026 is Dhanu Khar Maas.',
    dates: [],
    highlight: null,
    color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600',
  },
  {
    month: 'February 2026', short: 'Feb', available: true,
    reason: 'One of the best months of 2026 — 12 auspicious dates, pleasant winter weather, and the romantic Valentine\'s Week overlap makes this a highly sought-after wedding month.',
    dates: [
      { date: '5 Feb', day: 'Thu', nakshatra: 'Pushya', tithi: 'Saptami', note: null },
      { date: '6 Feb', day: 'Fri', nakshatra: 'Pushya / Ashlesha', tithi: 'Ashtami', note: null },
      { date: '8 Feb', day: 'Sun', nakshatra: 'Magha', tithi: 'Dashami', note: null },
      { date: '10 Feb', day: 'Tue', nakshatra: 'Uttara Phalguni', tithi: 'Dwadashi', note: null },
      { date: '12 Feb', day: 'Thu', nakshatra: 'Chitra', tithi: 'Chaturdashi', note: null },
      { date: '14 Feb', day: 'Sat', nakshatra: 'Swati', tithi: 'Purnima', note: '⭐ Valentine\'s Day — extremely popular, book venues 12+ months early' },
      { date: '19 Feb', day: 'Thu', nakshatra: 'Uttara Ashada', tithi: 'Panchami', note: null },
      { date: '20 Feb', day: 'Fri', nakshatra: 'Shravana', tithi: 'Shashthi', note: null },
      { date: '21 Feb', day: 'Sat', nakshatra: 'Dhanishtha', tithi: 'Saptami', note: null },
      { date: '24 Feb', day: 'Tue', nakshatra: 'Uttara Bhadrapada', tithi: 'Dashami', note: null },
      { date: '25 Feb', day: 'Wed', nakshatra: 'Revati', tithi: 'Ekadashi', note: null },
      { date: '26 Feb', day: 'Thu', nakshatra: 'Ashwini', tithi: 'Dwadashi', note: null },
    ],
    highlight: '12 dates — Best winter wedding month',
    color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
  },
  {
    month: 'March 2026', short: 'Mar', available: true,
    reason: 'Good availability in early March before Meen Khar Maas begins around March 14 when the Sun enters Pisces.',
    dates: [
      { date: '2 Mar', day: 'Mon', nakshatra: 'Rohini', tithi: 'Tritiya', note: '⭐ Rohini Nakshatra — considered the most auspicious for marriage' },
      { date: '3 Mar', day: 'Tue', nakshatra: 'Mrigashira', tithi: 'Chaturthi', note: null },
      { date: '5 Mar', day: 'Thu', nakshatra: 'Punarvasu', tithi: 'Shashthi', note: null },
      { date: '6 Mar', day: 'Fri', nakshatra: 'Pushya', tithi: 'Saptami', note: null },
    ],
    highlight: '4 dates — Book early March only',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
  },
  {
    month: 'April 2026', short: 'Apr', available: true,
    reason: 'Post-Meen Khar Maas — Chaitra month opens up. April brings pleasant weather and strong auspicious dates after mid-April.',
    dates: [
      { date: '21 Apr', day: 'Tue', nakshatra: 'Pushya', tithi: 'Tritiya', note: null },
      { date: '29 Apr', day: 'Wed', nakshatra: 'Uttara Phalguni', tithi: 'Ekadashi', note: null },
    ],
    highlight: '2 dates — Limited availability',
    color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
  },
  {
    month: 'May 2026', short: 'May', available: true,
    reason: 'One of the better months for 2026 with 8 dates. Note: 2026 has an Adhik Maas (Leap Month) that blocks the later part of May — plan around the earlier dates.',
    dates: [
      { date: '1 May', day: 'Fri', nakshatra: 'Swati', tithi: 'Trayodashi', note: null },
      { date: '3 May', day: 'Sun', nakshatra: 'Anuradha', tithi: 'Panchami', note: null },
      { date: '5 May', day: 'Tue', nakshatra: 'Uttara Ashada', tithi: 'Saptami', note: null },
      { date: '6 May', day: 'Wed', nakshatra: 'Shravana', tithi: 'Ashtami', note: null },
      { date: '7 May', day: 'Thu', nakshatra: 'Dhanishtha', tithi: 'Navami', note: null },
      { date: '8 May', day: 'Fri', nakshatra: 'Shatabhisha', tithi: 'Dashami', note: null },
      { date: '13 May', day: 'Wed', nakshatra: 'Ashwini', tithi: 'Purnima', note: null },
      { date: '14 May', day: 'Thu', nakshatra: 'Rohini', tithi: 'Pratipada', note: '⭐ Rohini Nakshatra — highly auspicious' },
    ],
    highlight: '8 dates — Book first two weeks',
    color: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
  },
  {
    month: 'June 2026', short: 'Jun', available: true,
    reason: '8 auspicious dates in June — post-Adhik Maas window before monsoon peaks. Pre-monsoon atmosphere is beautiful for outdoor weddings in many parts of India.',
    dates: [
      { date: '21 Jun', day: 'Sun', nakshatra: 'Hasta', tithi: 'Shashthi', note: null },
      { date: '22 Jun', day: 'Mon', nakshatra: 'Chitra', tithi: 'Saptami', note: null },
      { date: '23 Jun', day: 'Tue', nakshatra: 'Swati', tithi: 'Ashtami', note: null },
      { date: '24 Jun', day: 'Wed', nakshatra: 'Vishakha', tithi: 'Navami', note: null },
      { date: '25 Jun', day: 'Thu', nakshatra: 'Anuradha', tithi: 'Dashami', note: null },
      { date: '26 Jun', day: 'Fri', nakshatra: 'Jyeshtha', tithi: 'Ekadashi', note: null },
      { date: '27 Jun', day: 'Sat', nakshatra: 'Mool', tithi: 'Dwadashi', note: null },
      { date: '29 Jun', day: 'Mon', nakshatra: 'Uttara Ashada', tithi: 'Chaturdashi', note: null },
    ],
    highlight: '8 dates — Pre-monsoon window',
    color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
  },
  {
    month: 'July 2026', short: 'Jul', available: true,
    reason: '4 limited dates in early July before Chaturmas begins on Devshayani Ekadashi (approx. July 7). Only book the very early July dates.',
    dates: [
      { date: '1 Jul', day: 'Wed', nakshatra: 'Shravana', tithi: 'Pratipada', note: null },
      { date: '6 Jul', day: 'Mon', nakshatra: 'Uttara Bhadrapada', tithi: 'Shashthi', note: null },
      { date: '7 Jul', day: 'Tue', nakshatra: 'Revati', tithi: 'Saptami', note: '⚠️ Last date before Chaturmas — confirm exact Devshayani Ekadashi date with your pandit' },
      { date: '11 Jul', day: 'Sat', nakshatra: 'Rohini', tithi: 'Ekadashi', note: null },
    ],
    highlight: '4 dates — Early July only',
    color: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700',
  },
  {
    month: 'Aug – Oct 2026', short: 'Aug–Oct', available: false,
    reason: 'CHATURMAS + PITRU PAKSHA — Zero muhurat dates. Chaturmas (Lord Vishnu\'s cosmic sleep) runs from Devshayani Ekadashi (≈July 7) to Dev Uthani Ekadashi (≈Oct 28). Additionally, Pitru Paksha (≈Sep 22 – Oct 7) is a period of ancestor observance. No Hindu weddings during this entire window.',
    dates: [],
    highlight: null,
    color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600',
  },
  {
    month: 'November 2026', short: 'Nov', available: true,
    reason: 'Wedding season reopens after Dev Uthani Ekadashi (≈Nov 1). 4 auspicious dates — this is peak season so book venues immediately.',
    dates: [
      { date: '21 Nov', day: 'Sat', nakshatra: 'Uttara Phalguni', tithi: 'Panchami', note: null },
      { date: '24 Nov', day: 'Tue', nakshatra: 'Anuradha', tithi: 'Ashtami', note: null },
      { date: '25 Nov', day: 'Wed', nakshatra: 'Jyeshtha', tithi: 'Navami', note: null },
      { date: '26 Nov', day: 'Thu', nakshatra: 'Mool', tithi: 'Dashami', note: null },
    ],
    highlight: '4 dates — Peak season reopens',
    color: 'from-rose-gold to-plum', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
  },
  {
    month: 'December 2026', short: 'Dec', available: true,
    reason: '7 auspicious dates in December. December is the most popular month for weddings in India — book venues 12–18 months in advance. Dates end before Dhanu Khar Maas begins around Dec 16.',
    dates: [
      { date: '2 Dec', day: 'Wed', nakshatra: 'Uttara Ashada', tithi: 'Dwadashi', note: null },
      { date: '3 Dec', day: 'Thu', nakshatra: 'Shravana', tithi: 'Trayodashi', note: null },
      { date: '4 Dec', day: 'Fri', nakshatra: 'Dhanishtha', tithi: 'Chaturdashi', note: null },
      { date: '5 Dec', day: 'Sat', nakshatra: 'Shatabhisha', tithi: 'Purnima', note: '⭐ Purnima (Full Moon) — extremely auspicious for marriage' },
      { date: '11 Dec', day: 'Fri', nakshatra: 'Ashwini', tithi: 'Panchami', note: null },
      { date: '12 Dec', day: 'Sat', nakshatra: 'Rohini', tithi: 'Shashthi', note: '⭐ Rohini Nakshatra — highest-rated for marriage' },
      { date: '14 Dec', day: 'Mon', nakshatra: 'Mrigashira', tithi: 'Ashtami', note: null },
    ],
    highlight: '7 dates — Most popular month, book now',
    color: 'from-violet-500 to-indigo-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
  },
];

const MONTHS_2027 = [
  {
    month: 'January 2027', short: 'Jan', available: true,
    reason: 'Khar Maas ends Jan 14. 10 shubh dates from mid-January onwards — a strong opening to the 2027 wedding season.',
    datesSummary: 'Jan 18, 19, 23, 24, 25, 26, 27, 28, 30, 31',
    count: 10, color: 'from-sky-500 to-blue-600',
  },
  {
    month: 'February 2027', short: 'Feb', available: true,
    reason: 'Highest concentration of auspicious dates in early 2027 — 10–12 shubh dates expected. Vasant Panchami (Swayam Siddha Muhurat) falls in early February.',
    datesSummary: 'Feb 2, 10, 12, 15, 16, 20, 21, 27, 28 (+ Vasant Panchami)',
    count: 10, color: 'from-rose-500 to-pink-600',
  },
  {
    month: 'March 2027', short: 'Mar', available: true,
    reason: 'Early March available before Meen Khar Maas begins around March 14–17 when Sun enters Pisces.',
    datesSummary: 'Mar 1, 2, 10, 11, 12, 14',
    count: 6, color: 'from-emerald-500 to-teal-600',
  },
  {
    month: 'April 2027', short: 'Apr', available: true,
    reason: 'Khar Maas ends mid-April. Akshaya Tritiya (Swayam Siddha — self-auspicious) falls in late April. Strong mid-to-late April availability.',
    datesSummary: 'Multiple dates from Apr 14 + Akshaya Tritiya',
    count: 8, color: 'from-amber-500 to-orange-500',
  },
  {
    month: 'May 2027', short: 'May', available: true,
    reason: 'The best month of 2027 — 18 auspicious dates, compared to just 8 in May 2026 (which had Adhik Maas). May 7 (Rohini + Dwitiya) is the standout date of the entire year.',
    datesSummary: '18 dates including May 7 (Rohini — top-rated)',
    count: 18, color: 'from-violet-500 to-purple-700',
  },
  {
    month: 'June 2027', short: 'Jun', available: true,
    reason: '16 auspicious dates — second-best month of 2027. Ideal for coastal venue weddings and destination weddings before monsoon peak.',
    datesSummary: '16 dates across the month',
    count: 16, color: 'from-indigo-500 to-violet-600',
  },
  {
    month: 'July 2027', short: 'Jul', available: true,
    reason: 'Limited window before Chaturmas begins on Devshayani Ekadashi (expected mid-July 2027). Only very early July dates are available.',
    datesSummary: 'Early July only — confirm Chaturmas start with pandit',
    count: 4, color: 'from-sky-400 to-blue-500',
  },
  {
    month: 'Aug–Oct 2027', short: 'Aug–Oct', available: false,
    reason: 'CHATURMAS + PITRU PAKSHA — Zero muhurat dates. Same blocked period as every year.',
    datesSummary: 'None',
    count: 0, color: 'from-gray-400 to-gray-500',
  },
  {
    month: 'November 2027', short: 'Nov', available: true,
    reason: '11 dates — Dev Uthani Ekadashi (≈Nov 9, Tulsi Vivah) reopens the wedding season. Nov 15 (Rohini Nakshatra + Dwitiya Tithi) is among the top 5 dates of 2027.',
    datesSummary: 'Nov 10–30: 11 dates including Nov 15 (Rohini — standout)',
    count: 11, color: 'from-rose-gold to-plum',
  },
  {
    month: 'December 2027', short: 'Dec', available: true,
    reason: 'Dec 13 (Rohini Nakshatra + Purnima) is the single most powerful date of late 2027. 8–10 dates before Dhanu Khar Maas begins around Dec 16.',
    datesSummary: 'Dec 1–15: 8–10 dates including Dec 13 (Rohini + Purnima)',
    count: 9, color: 'from-violet-500 to-indigo-600',
  },
];

// Panchang elements explained
const PANCHANG_ELEMENTS = [
  {
    name: 'Tithi', emoji: '🌙',
    what: 'Lunar day — the phase of the Moon on a given day',
    good: 'Dwitiya (2nd), Tritiya (3rd), Panchami (5th), Saptami (7th), Dashami (10th), Ekadashi (11th), Trayodashi (13th), Purnima (Full Moon)',
    avoid: 'Chaturthi (4th), Ashtami (8th), Navami (9th), Chaturdashi (14th), Amavasya (New Moon)',
    color: 'from-violet-500 to-purple-700',
  },
  {
    name: 'Nakshatra', emoji: '⭐',
    what: 'Lunar constellation — the Moon\'s position among 27 star groups',
    good: 'Rohini (most auspicious), Uttara Phalguni, Uttara Ashada, Uttara Bhadrapada, Mrigashira, Magha, Hasta, Swati, Anuradha, Revati',
    avoid: 'Mool (sometimes), Bharani, Krittika, Ardra, Ashlesha, Jyeshtha',
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Yoga', emoji: '🔷',
    what: 'The combined angular relationship of Sun and Moon — there are 27 Yogas',
    good: 'Siddhi, Amrit, Ravi, Pushya, Sarvartha Siddhi, Ravi Pushya are highly auspicious',
    avoid: 'Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, Vyatipata, Parigha',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Karana', emoji: '🔶',
    what: 'Half of a Tithi — each lunar day has two Karanas. Used to determine precise auspicious timing windows.',
    good: 'Bava, Balava, Kaulava, Taitila, Garaja, Vanija are auspicious for marriage',
    avoid: 'Vishti (Bhadra) is the main inauspicious Karana — avoid ceremony during this window',
    color: 'from-sky-500 to-blue-600',
  },
  {
    name: 'Var (Weekday)', emoji: '📅',
    what: 'The day of the week also carries astrological significance for marriages',
    good: 'Monday, Wednesday, Thursday, Friday are generally considered auspicious for marriages',
    avoid: 'Saturday is typically avoided for weddings in most Hindu traditions. Tuesday is generally acceptable.',
    color: 'from-rose-500 to-pink-600',
  },
];

// Blocked periods explained
const BLOCKED_PERIODS = [
  {
    name: 'Chaturmas',
    when: '≈ July 7 – November 1, 2026 | ≈ mid-July – November 9, 2027',
    why: 'Lord Vishnu enters Yoga Nidra (cosmic sleep) on Devshayani Ekadashi and awakens on Dev Uthani Ekadashi. Since Vishnu is the preserver of dharma and bestower of marital blessings, Hindu tradition suspends all auspicious ceremonies including weddings during this 4-month period. It is a time dedicated to spiritual practice and devotion.',
    impact: 'Zero marriage muhurat available. This is the longest blocked window — plan all your bookings around it.',
    icon: '🛌',
    color: 'from-gray-500 to-gray-700',
  },
  {
    name: 'Khar Maas / Khar Maas (Sagittarius & Pisces)',
    when: 'Dec 16 2025 – Jan 14, 2026 (Dhanu) | ≈ March 14–17 (Meen) — when Sun enters Sagittarius or Pisces',
    why: 'Occurs twice yearly when the Sun transits through Sagittarius (Dhanu) and Pisces (Meen) — both signs of Jupiter. During this period, the Sun\'s energy is considered absorbed by Jupiter\'s domain, making it unsuitable for auspicious ceremonies.',
    impact: 'No muhurat in January 2026. Limited availability in early March. Affects ≈30 days per occurrence.',
    icon: '☀️',
    color: 'from-amber-600 to-orange-600',
  },
  {
    name: 'Pitru Paksha',
    when: '≈ Sep 22 – Oct 7, 2026 | ≈ Sep 2027 (15-day period)',
    why: 'A 15-day period of ancestor reverence during which offerings are made to forefathers. The atmosphere is considered conducive to penance and remembrance, not celebration. Marriages are traditionally avoided during this period.',
    impact: 'Falls within the already-blocked Chaturmas window in most years — reinforces the October unavailability.',
    icon: '🙏',
    color: 'from-violet-600 to-purple-800',
  },
  {
    name: 'Adhik Maas 2026 (Leap Month)',
    when: 'A lunar leap month in 2026 that affects late May and parts of June',
    why: 'Adhik Maas (extra lunar month) occurs approximately every 2.5–3 years to synchronise the lunar and solar calendars. Marriages are traditionally avoided during this period as it is considered inauspicious for new beginnings.',
    impact: '2026-specific — reduces the number of shubh dates in May/June. 2027 has NO Adhik Maas, which is why 2027 has nearly double the auspicious dates (96+ vs 52).',
    icon: '📅',
    color: 'from-rose-600 to-pink-700',
  },
];

const FAQS = [
  {
    q: 'How many auspicious Hindu wedding dates are there in 2026?',
    a: '2026 has approximately 52+ Shubh Vivah Muhurat dates according to North Indian Hindu Panchang. The available months are: February (12 dates), March (4), April (2), May (8), June (8), July (4), November (4), and December (7). January and the August–October window (Chaturmas + Pitru Paksha) have no auspicious dates.',
  },
  {
    q: 'Why are there more wedding dates in 2027 than 2026?',
    a: '2027 has 96+ auspicious marriage dates — nearly double the 52 in 2026. The main reason is Adhik Maas (a lunar leap month) in 2026, which blocks dates in May and June. 2027 has no Adhik Maas, so May 2027 alone has 18 auspicious dates vs only 8 in May 2026. If you\'re flexible on the year, 2027 gives you far more options.',
  },
  {
    q: 'Which is the most auspicious Nakshatra for a Hindu wedding?',
    a: 'Rohini Nakshatra is consistently rated as the single most auspicious Nakshatra for marriage across all Hindu astrological traditions. Other highly favoured Nakshatras include Uttara Phalguni, Uttara Ashada, Uttara Bhadrapada, Mrigashira, Hasta, Swati, and Anuradha. Dates that combine Rohini Nakshatra with an auspicious Tithi (like Dwitiya or Purnima) are considered among the most powerful wedding dates of any year.',
  },
  {
    q: 'What is Chaturmas and why are there no weddings during this period?',
    a: 'Chaturmas (literally "four months") is the period when Lord Vishnu enters Yoga Nidra (cosmic sleep) on Devshayani Ekadashi and awakens on Dev Uthani Ekadashi approximately four months later. Since Vishnu is regarded as the preserver of dharma and the bestower of marital blessings, Hindu tradition suspends all auspicious ceremonies — including weddings, housewarming (griha pravesh), and other sacred rites — during this period. Chaturmas runs approximately from July to October/November each year.',
  },
  {
    q: 'Do muhurat dates vary by city or state in India?',
    a: 'Yes — muhurat timings are location-specific because they are calculated based on local sunrise times. The dates themselves are consistent across India, but the exact shubh timing window (e.g., 7:30 AM – 11:45 AM on a given date) will differ by a few minutes between cities. A family pandit or astrologer for your specific city will give you precise timings. The dates in this guide are based on North Indian Panchang methodology.',
  },
  {
    q: 'Is it mandatory to marry on a Shubh Muhurat?',
    a: 'No — it is a deeply held cultural and religious tradition but not a legal requirement. Court marriages under the Special Marriage Act can happen on any day. For Hindu religious ceremonies, the choice is entirely the family\'s. Many modern couples compromise: they perform the civil/legal registration on a convenient date and schedule the religious ceremony on an auspicious muhurat. What matters most is that both families are aligned.',
  },
  {
    q: 'What is Akshaya Tritiya and why is it special for marriages?',
    a: 'Akshaya Tritiya (also called Akha Teej) falls on the third day (Tritiya) of Shukla Paksha in the month of Vaishakh — usually in April or May. It is considered a Swayam Siddha Muhurat (self-auspicious date) that requires no Panchang verification — the day itself is inherently auspicious. "Akshaya" means imperishable or undying, making it symbolically ideal for marriages. In 2027, Akshaya Tritiya falls in late April or early May — confirm with your regional Panchang.',
  },
  {
    q: 'Which month is best for a destination wedding in India in 2027?',
    a: 'May 2027 leads with 18 auspicious dates — ideal for destination weddings in Rajasthan (before the summer heat peak) and Kerala (before monsoon). November 2027 (11 dates) is the top choice for Rajasthan palace weddings as the weather is perfect — October to February is peak Rajasthan season. June 2027 (16 dates) works well for coastal venues in Goa, Alibaug, and Kerala before the monsoon intensifies.',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────
function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-amber-50/50 transition-colors"
        aria-expanded={open}>
        <span className="font-semibold text-gray-900 pr-2 text-sm md:text-base">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-amber-500 transition-transform ${open ? 'rotate-180' : ''}`} />
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
          Start free <ChevronRight className="w-4 h-4" />
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export function WeddingMuhuratDatesArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq] = useState(-1);
  const [activeYear, setActiveYear] = useState('2026');
  const [activeMonth2026, setActiveMonth2026] = useState(1); // Feb index
  const [activeMonth2027, setActiveMonth2027] = useState(4); // May index

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  const available2026 = MONTHS_2026.filter(m => m.available);
  const total2026 = available2026.reduce((sum, m) => sum + (m.dates?.length || 0), 0);
  const total2027 = MONTHS_2027.filter(m => m.available).reduce((sum, m) => sum + m.count, 0);

  const activeMonthData2026 = MONTHS_2026[activeMonth2026];
  const activeMonthData2027 = MONTHS_2027[activeMonth2027];

  return (
    <div className="min-h-screen bg-[#faf7f8]">
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
          <Link to="/" className="text-xl font-serif font-bold bg-gradient-to-r from-rose-gold to-plum bg-clip-text text-transparent">Wedora</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-16 md:pb-20 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-400 font-medium">
            <Link to="/blog" className="hover:text-rose-gold transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-600 font-semibold">Wedding Planning</span>
            <ChevronRight className="w-3 h-3" />
            <span>Muhurat Calendar</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-amber-400/30 shadow-sm mb-6">
            <CalendarDays className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Hindu Panchang · 2026 & 2027</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4">
            Hindu Wedding{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-gold">
              Muhurat Dates
            </span>
          </h1>
          <p className="text-base text-amber-700 font-semibold mb-5">
            Complete Shubh Vivah Calendar — 2026 & 2027 · Hindu Panchang
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-bold shadow-lg">
              <CalendarDays className="w-4 h-4" /> {total2026}+ dates in 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 text-white text-sm font-bold shadow-lg">
              <Star className="w-4 h-4" fill="currentColor" /> 96+ dates in 2027
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold shadow-sm">
              Interactive Month Browser
            </span>
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            The complete month-by-month Hindu wedding muhurat calendar for 2026 and 2027 —
            with Nakshatra details, blocked periods explained, Panchang elements guide,
            and expert tips for booking venues before the best dates disappear.
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
          <div className="max-w-5xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl shadow-amber-400/15 border-4 border-white ring-1 ring-amber-100">
            <img src={ensureHttps(post.featured_image)} alt="Hindu wedding ceremony with marigold mandap decorations"
              className="w-full aspect-[21/9] object-cover object-center" loading="eager" />
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-14 md:space-y-20">

        {/* INTRO */}
        <section id="intro">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-orange-300/15 to-rose-gold/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-amber-50/60 border border-amber-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-amber-500 shrink-0" />
                The date you choose shapes the day you plan for
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                In Hindu tradition, a wedding isn't just two people choosing each other — it's
                two families aligning their union with the cosmic calendar. The <strong>Shubh
                Muhurat</strong> (auspicious moment) is determined by the Hindu Panchang, a
                5,000-year-old astrological almanac that maps lunar days, constellations, planetary
                positions, and sacred timings.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                There's also a very practical reason to know these dates early: <strong>the most
                auspicious dates get booked first</strong>. The best venues in Jaipur, Udaipur,
                and Mumbai are regularly booked 12–18 months in advance for peak muhurat weekends.
                By the time you decide on a date, it may already be gone.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                This guide gives you the complete 2026 and 2027 Shubh Vivah Muhurat calendar —
                with Nakshatra details, blocked periods, and everything you need to make an
                informed decision.
              </p>
            </div>
          </div>

          {/* 2026 vs 2027 quick stat */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 text-center">
              <p className="text-5xl font-black font-serif text-amber-600 mb-2">52+</p>
              <p className="font-bold text-gray-900 mb-1">Shubh Vivah Muhurats in 2026</p>
              <p className="text-sm text-gray-500">Adhik Maas reduces May/June availability. Jan and Aug–Oct blocked.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 text-center">
              <p className="text-5xl font-black font-serif text-violet-600 mb-2">96+</p>
              <p className="font-bold text-gray-900 mb-1">Shubh Vivah Muhurats in 2027</p>
              <p className="text-sm text-gray-500">No Adhik Maas → May 2027 alone has 18 dates. Nearly double 2026.</p>
            </div>
          </div>
        </section>

        <CtaSignup headline="Found your date? Start planning on Wedora — it's free."
          sub="Wedding checklist, budget calculator, vendor tracker, and invitation generator — all in one place." />

        {/* INTERACTIVE CALENDAR */}
        <section id="calendar">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Month-by-month Muhurat browser</h2>
              <p className="text-gray-500 text-sm mt-0.5">Select a year and month to see all auspicious dates with Nakshatra details.</p>
            </div>
          </div>

          {/* Year toggle */}
          <div className="flex gap-3 mb-6">
            {['2026', '2027'].map(y => (
              <button key={y} type="button" onClick={() => setActiveYear(y)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border-2 ${activeYear === y ? 'bg-amber-500 text-white border-amber-500 shadow-lg' : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'}`}>
                {y} Calendar
              </button>
            ))}
          </div>

          {/* 2026 BROWSER */}
          {activeYear === '2026' && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              {/* Month tabs */}
              <div className="overflow-x-auto border-b border-gray-100">
                <div className="flex gap-1 p-3 min-w-max">
                  {MONTHS_2026.map((m, i) => (
                    <button key={m.short} type="button" onClick={() => setActiveMonth2026(i)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeMonth2026 === i
                          ? m.available ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-400 text-white'
                          : m.available ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {m.short}
                      {m.available && m.dates.length > 0 && (
                        <span className={`ml-1 ${activeMonth2026 === i ? 'text-white/80' : 'text-amber-600'}`}>
                          ({m.dates.length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected month content */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeMonthData2026.color} flex items-center justify-center shadow-md`}>
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-gray-900">{activeMonthData2026.month}</p>
                    {activeMonthData2026.highlight && (
                      <p className={`text-xs font-semibold ${activeMonthData2026.text}`}>{activeMonthData2026.highlight}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{activeMonthData2026.reason}</p>

                {activeMonthData2026.available && activeMonthData2026.dates.length > 0 ? (
                  <div className="space-y-2">
                    {activeMonthData2026.dates.map((d) => (
                      <div key={d.date} className={`flex items-start gap-3 p-3 rounded-xl ${activeMonthData2026.bg} border ${activeMonthData2026.border}`}>
                        <div className="text-center shrink-0 min-w-[48px]">
                          <p className="font-black text-gray-900 text-base leading-none">{d.date.split(' ')[0]}</p>
                          <p className="text-gray-400 text-[10px] uppercase font-bold">{d.day}</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-xs font-bold ${activeMonthData2026.text} bg-white px-2 py-0.5 rounded-full border ${activeMonthData2026.border}`}>
                              ⭐ {d.nakshatra}
                            </span>
                            <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                              {d.tithi}
                            </span>
                          </div>
                          {d.note && (
                            <p className="text-xs text-gray-600 mt-1.5 font-medium">{d.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 text-gray-500">
                    <span className="text-2xl">🚫</span>
                    <p className="text-sm">No auspicious dates this month.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2027 BROWSER */}
          {activeYear === '2027' && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto border-b border-gray-100">
                <div className="flex gap-1 p-3 min-w-max">
                  {MONTHS_2027.map((m, i) => (
                    <button key={m.short} type="button" onClick={() => setActiveMonth2027(i)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeMonth2027 === i
                          ? m.available ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-400 text-white'
                          : m.available ? 'bg-violet-50 text-violet-700 hover:bg-violet-100' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {m.short}
                      {m.available && <span className={`ml-1 ${activeMonth2027 === i ? 'text-white/80' : 'text-violet-600'}`}>({m.count})</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeMonthData2027.color} flex items-center justify-center shadow-md`}>
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-gray-900">{activeMonthData2027.month}</p>
                    <p className="text-xs font-semibold text-violet-700">
                      {activeMonthData2027.available ? `${activeMonthData2027.count} auspicious dates` : 'No dates available'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{activeMonthData2027.reason}</p>
                {activeMonthData2027.available ? (
                  <div className={`p-4 rounded-xl bg-violet-50 border border-violet-200`}>
                    <p className="text-xs font-bold text-violet-700 uppercase tracking-wider mb-2">Dates</p>
                    <p className="text-sm font-semibold text-violet-900">{activeMonthData2027.datesSummary}</p>
                    <p className="text-xs text-violet-600 mt-2">
                      Final exact dates and timings per city available once 2027 Panchang is published.
                      Consult your family pandit for city-specific muhurat timing.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 text-gray-500">
                    <span className="text-2xl">🚫</span>
                    <p className="text-sm">No auspicious dates — Chaturmas period.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>These dates follow North Indian Panchang methodology</strong> and are cross-referenced from multiple Hindu astrological authorities. Exact muhurat window timings vary by city based on local sunrise. Always confirm your specific date and timing with a qualified pandit or astrologer for your location and Kundali.
            </p>
          </div>
        </section>

        {/* BLOCKED PERIODS */}
        <section id="blocked">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Why certain months have no muhurat</h2>
              <p className="text-gray-500 text-sm mt-0.5">Four blocked periods — explained from first principles.</p>
            </div>
          </div>
          <div className="space-y-4">
            {BLOCKED_PERIODS.map((b) => (
              <div key={b.name} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-4 bg-gradient-to-r ${b.color} text-white flex items-center gap-3`}>
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-bold">{b.name}</p>
                    <p className="text-white/80 text-xs">{b.when}</p>
                  </div>
                </div>
                <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Why no marriages?</p>
                    <p className="text-gray-700 leading-relaxed">{b.why}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Planning impact</p>
                    <p className="text-gray-700 leading-relaxed">{b.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CtaTool icon={IndianRupee} headline="Planning your wedding budget around your muhurat?"
          sub="Wedora's free wedding budget calculator helps you allocate every rupee smartly for your chosen date."
          btnLabel="Open budget calculator" btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', title: 'text-emerald-900' }} />

        {/* PANCHANG GUIDE */}
        <section id="panchang">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">What makes a date "Shubh" — the 5 Panchang elements</h2>
              <p className="text-gray-500 text-sm mt-0.5">Understanding how muhurat dates are calculated from Vedic astrology.</p>
            </div>
          </div>
          <div className="space-y-4">
            {PANCHANG_ELEMENTS.map((el) => (
              <div key={el.name} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-3.5 bg-gradient-to-r ${el.color} text-white flex items-center gap-3`}>
                  <span className="text-xl">{el.emoji}</span>
                  <p className="font-bold">{el.name}</p>
                  <p className="text-white/80 text-xs ml-1">— {el.what}</p>
                </div>
                <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Auspicious for marriage</p>
                    <p className="text-gray-700 leading-relaxed">{el.good}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Generally avoided</p>
                    <p className="text-gray-700 leading-relaxed">{el.avoid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3 p-5 rounded-2xl bg-violet-50 border border-violet-200/60">
            <Lightbulb className="w-6 h-6 text-violet-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-violet-900 mb-1">Why Rohini Nakshatra is the gold standard</p>
              <p className="text-violet-800 text-sm leading-relaxed">
                Rohini Nakshatra is ruled by the Moon (Chandra) and is the Moon's own constellation — it is considered the Moon's most beloved abode. This makes it exceptionally stable, nurturing, and abundant — qualities deeply desired in a marriage. When Rohini coincides with an auspicious Tithi (especially Dwitiya, Purnima, or Trayodashi), the combination is considered among the most powerful muhurat possible. Dates like <strong>May 7, 2027</strong> (Rohini + Dwitiya) and <strong>November 15, 2027</strong> (Rohini + Dwitiya) are rated as the top individual dates of the year across traditions.
              </p>
            </div>
          </div>
        </section>

        {/* SPECIAL MUHURATS */}
        <section id="special">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Swayam Siddha Muhurat — self-auspicious dates</h2>
              <p className="text-gray-500 text-sm mt-0.5">Dates so inherently auspicious they need no Panchang verification.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: 'Akshaya Tritiya', emoji: '🌼', also: 'Akha Teej',
                when: '2026: Around April 28 | 2027: Late April / Early May (confirm via Panchang)',
                what: 'The third day (Tritiya) of Shukla Paksha in Vaishakh month. "Akshaya" means imperishable — starting married life on this day is believed to bring undying prosperity and happiness.',
                note: 'One of the most auspicious days in the Hindu calendar regardless of other planetary positions. Requires no kundali matching to be considered shubh.',
                color: 'bg-amber-50 border-amber-200',
              },
              {
                name: 'Dev Uthani Ekadashi', emoji: '🕉️', also: 'Tulsi Vivah / Devuthani',
                when: '2026: ≈ November 1 | 2027: ≈ November 9',
                what: 'The day Lord Vishnu awakens from Chaturmas sleep. Traditionally coincides with Tulsi Vivah (the ceremonial marriage of the Tulsi plant to Vishnu). Marks the official reopening of the wedding season.',
                note: 'The first muhurat after Chaturmas ends. Extremely popular — the reopening of wedding season means venue demand spikes dramatically on and around this date.',
                color: 'bg-violet-50 border-violet-200',
              },
              {
                name: 'Vasant Panchami', emoji: '🌸', also: 'Saraswati Puja',
                when: '2026: February 2 | 2027: February (confirm Panchang)',
                what: 'The fifth day of Shukla Paksha in Magh month — dedicated to Goddess Saraswati. Considered a Swayam Siddha Muhurat for marriage, learning, and new beginnings. Marks the onset of spring.',
                note: 'The 2026 date of Feb 2 is exceptionally powerful combined with the surrounding auspicious dates in early February.',
                color: 'bg-rose-50 border-rose-200',
              },
              {
                name: 'Purnima (Full Moon)', emoji: '🌕', also: 'Full Moon Tithi',
                when: 'Occurs monthly — see calendar for specific auspicious Purnimas',
                what: 'Purnima (Full Moon) is inherently auspicious for marriage as the Moon is at full strength. Marriage on Purnima is believed to bring emotional fullness, abundance, and harmony.',
                note: 'December 5, 2026 (Margashirsh Purnima) and December 13, 2027 (Margashirsh Purnima with Rohini) are among the most powerful specific dates.',
                color: 'bg-indigo-50 border-indigo-200',
              },
            ].map((s) => (
              <div key={s.name} className={`rounded-2xl border-2 ${s.color} p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <p className="font-bold text-gray-900">{s.name}</p>
                    <p className="text-gray-400 text-xs">{s.also}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">When</p>
                <p className="text-sm text-gray-700 mb-2">{s.when}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{s.what}</p>
                <p className="text-xs text-gray-500 bg-white/60 rounded-lg p-2.5 leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRACTICAL TIPS */}
        <section id="tips">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <Lightbulb className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">Practical tips for booking your muhurat date</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {[
                { tip: 'Book your venue before your pandit finalises the date', detail: 'The best venues in Jaipur, Udaipur, Mumbai, and Bengaluru get booked 12–18 months in advance on the best muhurat weekends. Many families make the mistake of finalising the muhurat first, then finding venues are unavailable. Shortlist 2–3 venue options, check their availability, then present those dates to your pandit for muhurat selection within those windows.' },
                { tip: '2027 has nearly double the dates — if you\'re flexible, choose 2027', detail: '2026 has approximately 52 auspicious dates due to Adhik Maas. 2027 has 96+ dates. If you\'re at the early planning stage and the year is flexible, 2027 gives you far more options, better venue availability, and more room to match everyone\'s schedule.' },
                { tip: 'Confirm exact timings with a pandit for your specific city', detail: 'The dates in this guide are accurate, but muhurat window timings (e.g., "7:30 AM – 11:45 AM") are city-specific because they are calculated from local sunrise. A Delhi wedding and a Chennai wedding on the same date will have slightly different muhurat windows. Always get city-specific timing confirmed.' },
                { tip: 'December books out fastest — act immediately for peak months', detail: 'December is the most popular wedding month in India. November–December 2026 dates and November–December 2027 dates typically have venues booked a full year in advance. If you\'re targeting these months, start venue enquiries immediately after reading this.' },
                { tip: 'Abujh Muhurat — good news for non-religious couples', detail: 'Several dates are considered Abujh (self-auspicious) — requiring no Kundali matching or pandit consultation: Akshaya Tritiya, Dev Uthani Ekadashi, Vasant Panchami, and specific Purnima dates. If Kundali matching has been difficult or families disagree, these dates offer an astrologically safe middle ground.' },
              ].map((item) => (
                <div key={item.tip} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-950 mb-1">{item.tip}</p>
                    <p className="text-amber-800/80 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA invite */}
        <CtaTool icon={CalendarDays} headline="Got your date? Send beautiful wedding invitations on WhatsApp — free."
          sub="6 ready-to-copy templates including formal and modern styles. Build your invite in under a minute."
          btnLabel="Create free invite" btnTo="/blog/whatsapp-wedding-invitations-modern-trend-guide"
          color={{ bg: 'bg-violet-50', border: 'border-violet-200', grad: 'from-violet-500 to-purple-700', title: 'text-violet-900' }} />

        {/* RELATED ARTICLES */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
              <p className="font-serif font-bold text-gray-900">More wedding planning guides on Wedora</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Arya Samaj Marriage: Complete Guide 2026', slug: 'arya-samaj-marriage-complete-guide-india', icon: '🕉️' },
                { title: 'Court Marriage: Complete Guide 2026', slug: 'court-marriage-india-complete-guide', icon: '⚖️' },
                { title: 'Last-Minute Wedding Checklist: 30 Days Before', slug: 'last-minute-wedding-checklist-30-days-before', icon: '✅' },
                { title: 'Wedding Budget Calculator: Allocate Money Smartly', slug: 'wedding-budget-calculator-how-to-allocate-money', icon: '🧮' },
                { title: 'WhatsApp Wedding Invitations — Modern Guide', slug: 'whatsapp-wedding-invitations-modern-trend-guide', icon: '💬' },
                { title: 'Complete Indian Wedding Budget Guide 2026', slug: 'indian-wedding-budget-guide-2026', icon: '💰' },
              ].map((a) => (
                <Link key={a.slug} to={`/blog/${a.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200/60 transition-all group">
                  <span className="text-lg">{a.icon}</span>
                  <p className="text-sm text-gray-700 group-hover:text-amber-700 font-medium transition-colors">{a.title}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BIG CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-gold p-1 shadow-2xl shadow-amber-400/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              You have your date. Now plan the entire wedding on Wedora.
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Wedding checklist, budget planner, vendor tracker, WhatsApp invitation generator,
              guest manager — everything you need from muhurat to reception, completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-amber-50 transition-colors shadow-lg">
                Start planning free — Wedora
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
            The most-searched questions about Hindu wedding muhurat dates answered.
          </p>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </section>

        {/* DISCLAIMER */}
        <section>
          <div className="flex gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-200">
            <AlertTriangle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-gray-500 text-xs leading-relaxed">
              <strong>Disclaimer:</strong> The muhurat dates in this guide are based on North Indian Vedic Panchang methodology and cross-referenced from multiple astrology authorities. Specific muhurat window timings are location-dependent and vary by city. Individual birth chart compatibility (Kundali Milan) may further influence the best date for a specific couple. Always consult a qualified astrologer or family pandit for personalised guidance before finalising your wedding date. Wedora presents this information for general planning purposes only.
            </p>
          </div>
        </section>

        {/* CLOSING */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            Your Shubh Muhurat is waiting. Book before someone else does.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Whether you're planning for November 2026 or May 2027, the most important action
            is the same: shortlist your venue options and check their availability today.
            The best dates and the best venues disappear together. Use this calendar to
            narrow down your options, consult your pandit for exact timing, and lock in
            the date that will become your most important anniversary.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Hindu Panchang calendar</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Shubh Vivah Muhurat</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free wedding planner</span>
          </div>
        </section>

        {affiliateHref && (
          <aside className="rounded-2xl border border-rose-gold/25 bg-white p-8 text-center shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-gold/80 mb-3">Partner pick</p>
            <a href={affiliateHref} target="_blank" rel="sponsored noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg">
              {affiliateCtaLabel}
            </a>
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
