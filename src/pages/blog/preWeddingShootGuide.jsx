import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Copy, Sparkles, Heart, Star,
  Lightbulb, AlertTriangle, CheckCircle2, ChevronDown,
  ChevronRight, Camera, MapPin, IndianRupee, Users,
  BookOpen, Shirt, Sun, Shield, Zap, Image,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const PRE_WEDDING_SHOOT_SLUG = 'pre-wedding-shoot-ideas-locations-india';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=85&auto=format&fit=crop';

export function getStaticPreWeddingShootPost() {
  const now = new Date().toISOString();
  return {
    id: 'static-pre-wedding-shoot-2026',
    title: 'Pre-Wedding Shoot Ideas, Locations & Planning Guide India (2026)',
    slug: PRE_WEDDING_SHOOT_SLUG,
    excerpt:
      'Complete pre-wedding shoot guide for Indian couples — 5 theme types, 15 best locations across India, outfit coordination, cost breakdown, pose ideas, and a checklist to plan your shoot perfectly.',
    content: '',
    tags: 'Pre-Wedding Shoot, Wedding Photography, Wedding Planning, Couple Photoshoot',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Pre-Wedding Shoot Ideas, Locations & Guide for Indian Couples 2026 | Wedora',
    meta_description:
      'Complete pre-wedding shoot guide 2026 — 5 theme types with pose ideas, 15 best locations in India, outfit tips, cost breakdown from ₹15,000–₹2.5L, and a photographer selection checklist.',
    keywords:
      'pre wedding shoot ideas india, pre wedding photoshoot locations india 2026, pre wedding shoot poses, pre wedding shoot cost india, pre wedding shoot themes, pre wedding photoshoot tips india',
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

const TOC = [
  { id: 'why',         label: 'Why a Pre-Wedding Shoot is Worth It' },
  { id: 'themes',      label: 'Theme Finder — 5 Styles for Every Couple' },
  { id: 'locations',   label: '15 Best Locations Across India' },
  { id: 'outfits',     label: 'Outfit Coordination Guide' },
  { id: 'poses',       label: 'Pose & Direction Ideas That Feel Natural' },
  { id: 'cost',        label: 'Cost Breakdown 2026' },
  { id: 'timing',      label: 'When to Book & Best Time of Day' },
  { id: 'checklist',   label: 'The Pre-Shoot Planning Checklist' },
  { id: 'photographer',label: 'How to Choose the Right Photographer' },
  { id: 'mistakes',    label: 'Mistakes That Ruin Pre-Wedding Shoots' },
  { id: 'faq',         label: 'FAQs' },
];

// 5 Theme types — the interactive feature
const THEMES = [
  {
    id: 'royal',
    label: 'Royal & Heritage',
    emoji: '👑',
    tagline: 'Palaces, forts, grand arches, regal outfits',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
    vibe: 'Grand, timeless, cinematic — you want photos that look like a period film. Heavy traditional outfits, dramatic architecture, golden hour light.',
    locations: ['Udaipur — Lake Palace, City Palace, Jagmandir', 'Jaipur — Amber Fort, Hawa Mahal, Nahargarh', 'Jodhpur — Mehrangarh Fort, Umaid Bhawan', 'Delhi — Humayun\'s Tomb, Qutub Minar, Lodhi Garden', 'Hyderabad — Chowmahalla Palace, Golconda Fort'],
    outfits: ['Bride: Heavy lehenga in deep jewel tones — burgundy, royal blue, forest green', 'Groom: Sherwani in ivory, cream, or coordinated colour with embroidery', 'Look 2: Saree in Kanjivaram or Banarasi with matching bandhgala for groom', 'Colour rule: Rich, saturated tones — avoid pastels at heritage monuments'],
    poses: ['Walking through archways — groom slightly ahead, bride hand in his', 'Seated regally on steps or carved thrones (if permitted)', 'Profile shot against the fort wall — bride looking out, groom gazing at her', 'Twirl moment in a grand courtyard — lets lehenga fan out dramatically', 'Close-up on jewellery and hands against textured stone walls'],
    tip: 'Book ASI monument shoots early — many require advance permits (₹2,000–₹5,000). Arrive at sunrise for best light and empty frame. Avoid weekends when crowds are thick. Shoulder season (October–March) gives the best weather.',
  },
  {
    id: 'romantic',
    label: 'Soft & Romantic',
    emoji: '🌸',
    tagline: 'Gardens, sunsets, pastel tones, intimate moments',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
    vibe: 'Dreamy, warm, emotionally intimate. Think flower fields, golden sunset light, soft laughter, and quiet moments between just the two of you.',
    locations: ['Ooty / Kodaikanal — tea gardens, misty hills, flower valleys', 'Munnar, Kerala — rolling green tea estates, cool air', 'Rishikesh — Ganges riverside, lush green hills, yoga retreat aesthetics', 'Valley of Flowers, Uttarakhand — July to September bloom season', 'Any local botanical garden at golden hour'],
    outfits: ['Bride: Flowy saree or lightweight lehenga in blush, peach, lilac, mint', 'Groom: Linen kurta or casual western in earthy tones — cream, sage, beige', 'Look 2: Matching western casuals — floral dress + chinos', 'Colour rule: Pastels and soft earth tones — the background IS the hero, let clothes complement'],
    poses: ['Walking together through a flower field, shot from behind', 'Forehead touch — standing face to face, eyes closed', 'Candid laughter — groom whispering something, bride covering her smile', 'Lying in a flower field, looking up at the camera from below', 'Silhouette at sunset — two figures against the golden sky'],
    tip: 'Golden hour (45 minutes after sunrise, 45 minutes before sunset) is non-negotiable for this theme. Brief your photographer to avoid staged poses — the magic is in candid, in-between moments. Carry a lightweight blanket or shawl for ground shots.',
  },
  {
    id: 'filmy',
    label: 'Filmy & Dramatic',
    emoji: '🎬',
    tagline: 'Rain sequences, dramatic lighting, cinematic storytelling',
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
    vibe: 'You want every frame to look like a Bollywood movie still. High drama, dynamic movement, rain sequences, colourful outfits, vintage vehicles. Zero subtlety.',
    locations: ['Mumbai — Marine Drive, Bandra sea face, old Bollywood studios', 'Kolkata — vintage trams, old mansions, Howrah Bridge', 'Varanasi — ghats, diyas, evening aarti backdrop', 'Pondicherry — French Quarter colonial streets, colourful walls', 'Any city: industrial warehouse, rooftop with cityscape at night'],
    outfits: ['Bride: Vibrant lehenga in bold red, electric blue, or hot pink — heavy dupatta', 'Groom: Well-fitted suit in dark navy or charcoal, or a bold-coloured bandhgala', 'Look 2: Classic white saree + contrast blouse for the iconic rain sequence', 'Colour rule: Go bold and contrasting — colours that pop in dramatic lighting'],
    poses: ['Rain sequence — dupatta flying, running through rain toward each other', 'Back-to-back pose looking away from each other (classic filmy)', 'Dip shot — groom holding bride in a dramatic lean-back', 'Running toward the camera — hand in hand, laughing', 'Close-up eye contact with moody backlight — shot from slightly below'],
    tip: 'A good film-look pre-wedding shoot needs a photographer who shoots cinematic video too — ask for a short reel alongside photos. Studio lighting setup can recreate dramatic indoor sequences at any time of day. The rain sequence requires planning — rent a controlled water sprinkler or use natural rain.',
  },
  {
    id: 'quirky',
    label: 'Quirky & Fun',
    emoji: '🎈',
    tagline: 'Playful, colourful, unconventional, your shared story',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
    vibe: 'You\'re the couple that doesn\'t take themselves too seriously. Shared hobby as the theme, fun locations, props, inside jokes, movement and genuine laughter.',
    locations: ['Your first date location — wherever it was', 'A local café, bookshop, or market that means something to you', 'Amusement park / themed café / colourful street market', 'Your college campus or workplace (where you met)', 'A sports ground, music venue, or any hobby-specific location'],
    outfits: ['Matching quirky coordinates — colour-blocking, prints, or complementary patterns', 'Couple hoodies + jeans for the casual indoor theme', 'Dress code based on your theme — chef aprons, artist overalls, sports jerseys', 'Colour rule: Bright, fun, coordinated but not identical'],
    poses: ['Cooking together — candid kitchen action shots', 'Playing a game you both love — chess, carrom, cricket', 'Piggyback shot — spontaneous and guaranteed laughs', 'Jumping on a bed / trampoline — movement creates energy', 'Looking at each other through a fun prop — coffee cups, books, cameras'],
    tip: 'Give your photographer a list of "things we do together" before the shoot — these become the script. The best quirky shoots have almost zero traditional poses. Tell your photographer: "When we\'re laughing at each other, shoot it." Authenticity > choreography every time.',
  },
  {
    id: 'intimate',
    label: 'Intimate & Home',
    emoji: '🏠',
    tagline: 'At-home, minimalist, real and unposed',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
    vibe: 'No travel, no heavy outfits, no staged locations. Just the two of you in your own space — cooking, reading, on the balcony, morning chai. Real intimacy > cinematic perfection.',
    locations: ['Your home — kitchen, bedroom, balcony, living room', 'A friend\'s beautifully designed flat or farmhouse', 'A boutique Airbnb or heritage homestay for aesthetic variety', 'A rooftop with plants and fairy lights', 'A quiet café or library that feels personal'],
    outfits: ['Comfortable coordinates — linen sets, matching loungewear, kurtas', 'Simple flowy dress + chinos — nothing heavy or structured', 'Look 2: Traditional home-style — cotton saree, simple kurta-pyjama', 'Colour rule: Neutrals, whites, soft pastels — let the space and connection be the hero'],
    poses: ['Morning chai on the balcony — both looking out, or at each other over the cup', 'Reading together — one reads, other watches with a smile', 'Cooking together — the stirring, the tasting, the laughing', 'Slow dance in the living room — no music needed for the photo', 'Lying together on the bed with morning light — candid and warm'],
    tip: 'Declutter the space before the photographer arrives — a tidy background lets the emotions be the focus. Natural window light is extraordinary for intimate shoots. Early morning light (8–9 AM) through a window is the most beautiful and flattering light for indoor couple photography.',
  },
];

// Top 15 locations in India
const LOCATIONS = [
  {
    name: 'Udaipur, Rajasthan',
    tag: '🏆 Most Popular 2026',
    why: 'The City of Lakes is India\'s undisputed pre-wedding capital. Lake Pichola, City Palace, Jagmandir Island, and Taj Lake Palace create an unmatched palette of royal water reflections and Rajput architecture.',
    best: 'October – March',
    cost: '₹60,000 – ₹1.5L (photographer + travel)',
    themes: ['Royal', 'Romantic'],
    tip: 'Book the Lake Palace boat ride in advance — it\'s the single most photographed pre-wedding shot in India. Arrive at blue hour for the lake reflection.',
  },
  {
    name: 'Jaipur, Rajasthan',
    tag: '⭐ Heritage & Culture',
    why: 'The Pink City\'s amber forts, coloured bazaars, and regal palaces make every frame feel like a film still. Amber Fort, Hawa Mahal, Patrika Gate (despite permit challenges), and Nahargarh are standouts.',
    best: 'October – February',
    cost: '₹50,000 – ₹1.2L',
    themes: ['Royal', 'Filmy'],
    tip: 'Patrika Gate is extremely crowded — go at 7 AM sharp. Amber Fort is best at golden hour on the maota lake side. A vintage Marwari dhola (hand-painted cart) is a standout prop.',
  },
  {
    name: 'Goa',
    tag: '🌊 Beach Vibes',
    why: 'Golden beaches, colonial Portuguese architecture in Panjim\'s Latin Quarter, spice plantations, and turquoise waters. Best for couples who want a relaxed, vibrant, vacation-style shoot.',
    best: 'November – February (avoid monsoon for beaches)',
    cost: '₹45,000 – ₹1L',
    themes: ['Romantic', 'Filmy', 'Quirky'],
    tip: 'Betul Beach and Butterfly Beach are far less crowded than Baga or Calangute. Fontainhas (Latin Quarter) alleys give extraordinary colour and depth. Sunset at Chapora Fort is an underused gem.',
  },
  {
    name: 'Manali / Shimla, HP',
    tag: '🏔️ Snow & Mountains',
    why: 'Snowy peaks, pine forests, apple orchards, and dramatic mountain light. Manali offers Solang Valley and Rohtang while Shimla provides colonial architecture and misty ridges.',
    best: 'December – February (snow), June – September (greenery)',
    cost: '₹50,000 – ₹1.2L',
    themes: ['Romantic', 'Filmy'],
    tip: 'For snow shots, Solang Valley requires 4WD vehicles to reach good depth. Layer outfits for warmth while keeping the top layer photogenic — thick shawls and stoles work perfectly.',
  },
  {
    name: 'Kashmir (Srinagar / Gulmarg)',
    tag: '❄️ Paradise on Earth',
    why: 'Dal Lake shikaras, Mughal gardens, Gulmarg\'s snow slopes, and Pahalgam\'s river meadows. No location in India delivers the visual drama of Kashmir for pre-wedding shoots.',
    best: 'April – June (flowers), October – November (colour), January – February (snow)',
    cost: '₹70,000 – ₹1.8L',
    themes: ['Romantic', 'Royal', 'Filmy'],
    tip: 'A shikara ride at sunrise on Dal Lake with a pheran-clad couple is among the most recognisable pre-wedding shots in India. Book houseboats well in advance — they fill up months ahead.',
  },
  {
    name: 'Munnar / Coorg, South India',
    tag: '🌿 Tea Gardens & Mist',
    why: 'Rolling green tea estates, misty mornings, waterfalls, and refreshing cool air. Munnar (Kerala) and Coorg (Karnataka) are the definitive romantic hill station choices for South Indian couples.',
    best: 'September – March',
    cost: '₹40,000 – ₹90,000',
    themes: ['Romantic', 'Intimate'],
    tip: 'The best tea estate shots are taken in the early morning mist before 8 AM. Wear light outfits in contrast to the deep green — white, cream, light yellow, or coral pop beautifully.',
  },
  {
    name: 'Pondicherry',
    tag: '🇫🇷 Colonial Charm',
    why: 'The French Quarter\'s yellow and white walls, bougainvillea cascades, and cobblestone streets create extraordinary depth and colour. Utterly unique to India and underused as a pre-wedding destination.',
    best: 'October – March',
    cost: '₹35,000 – ₹80,000',
    themes: ['Filmy', 'Romantic', 'Quirky'],
    tip: 'The best shots are in the 5 AM–8 AM window before the streets fill. The Promenade at sunrise and the Rock Beach at sunset are non-negotiable. The coloured door arches in the French Quarter are iconic.',
  },
  {
    name: 'Varanasi, UP',
    tag: '🪔 Spiritual & Cinematic',
    why: 'The ghats, the Ganga aarti, ancient temple alleys, and the extraordinary quality of early morning light make Varanasi a uniquely dramatic and soulful pre-wedding destination.',
    best: 'November – March (avoid summer heat)',
    cost: '₹35,000 – ₹75,000',
    themes: ['Filmy', 'Royal'],
    tip: 'A boat shoot on the Ganga at dawn with the ghats behind you is one of the most cinematic shots possible in India. The evening aarti as a backdrop gives extraordinary warm light and movement.',
  },
  {
    name: 'Mumbai',
    tag: '🌆 Urban & Modern',
    why: 'Marine Drive at night, Bandra sea face, century-old CST station, Art Deco Oval Maidan, and Bollywood studio backlots. The city is cinematic by nature — every lane has a story.',
    best: 'November – February (pleasant weather)',
    cost: '₹25,000 – ₹70,000',
    themes: ['Filmy', 'Quirky', 'Intimate'],
    tip: 'Marine Drive blue hour (after sunset) is one of India\'s most photographed spots — arrive when it\'s overcast for diffused, flattering light. Dharavi alleys and Chor Bazaar offer gritty-beautiful contrasts.',
  },
  {
    name: 'Jodhpur, Rajasthan',
    tag: '💙 The Blue City',
    why: 'The blue-washed houses of old Jodhpur, Mehrangarh Fort\'s imposing silhouette, and Umaid Bhawan Palace create an extraordinary contrast of cobalt and sandstone that photographs unlike anywhere else.',
    best: 'October – February',
    cost: '₹50,000 – ₹1.1L',
    themes: ['Royal', 'Filmy'],
    tip: 'The blue houses of Brahmpuri neighbourhood provide the most distinctive visual. Shooting from the fort walls at golden hour with the blue city below is considered one of the finest pre-wedding compositions in India.',
  },
  {
    name: 'Andaman Islands',
    tag: '🏝️ Tropical Escape',
    why: 'Radhanagar Beach, Elephant Beach, and Havelock Island offer turquoise water, white sand, and lush jungle that creates a truly exotic backdrop unlike anything on mainland India.',
    best: 'October – May (avoid monsoon)',
    cost: '₹80,000 – ₹2L (flights + ferry + accommodation)',
    themes: ['Romantic', 'Quirky'],
    tip: 'Radhanagar Beach consistently ranks among Asia\'s best. Sunrise shoots here with no crowds in October–November are extraordinary. Book permits for cellular jail and national park areas in advance.',
  },
  {
    name: 'Delhi',
    tag: '🏛️ Monuments & Mughal',
    why: 'Humayun\'s Tomb, Qutub Minar, Lodhi Garden, and the Sunder Nursery offer world-class heritage architecture within a single city. Best for couples who want royal without the travel.',
    best: 'October – March',
    cost: '₹20,000 – ₹60,000',
    themes: ['Royal', 'Romantic'],
    tip: 'Humayun\'s Tomb at sunrise (few crowds, extraordinary light) is vastly underused. Lodhi Garden\'s tree-canopy spots work beautifully for romantic themes. ASI monuments require advance permits — do not show up without them.',
  },
  {
    name: 'Kolkata',
    tag: '🚃 Vintage & Nostalgic',
    why: 'Vintage trams, colonial Howrah Bridge, marble-floored old mansions, Durga Puja pandals, and old Calcutta street life. The most distinctly nostalgic pre-wedding aesthetic in India.',
    best: 'October – February',
    cost: '₹25,000 – ₹65,000',
    themes: ['Filmy', 'Quirky', 'Romantic'],
    tip: 'A tram ride sequence through North Kolkata is a uniquely Kolkata shot. Victoria Memorial at blue hour, old Marble Palace mansion (contact in advance for access), and the Howrah Bridge silhouette are iconic.',
  },
  {
    name: 'Ooty / Kodaikanal, TN',
    tag: '🌺 Hill Station Romance',
    why: 'The Nilgiri hills, toy train (UNESCO heritage), botanical gardens, rose gardens, and Kodai Lake offer South India\'s most romantic hill station scenery.',
    best: 'April – June, September – November',
    cost: '₹30,000 – ₹75,000',
    themes: ['Romantic', 'Intimate'],
    tip: 'The Nilgiri Mountain Railway (toy train) sequence is uniquely photogenic — coordinate with the train schedule. Rose Garden in bloom season (April–May) is spectacular. Kodaikanal\'s misty lake at dawn is dreamlike.',
  },
  {
    name: 'International: Bali / Paris / Dubai',
    tag: '✈️ Destination Shoots',
    why: 'International pre-wedding shoots have grown 250% since 2022. Bali offers rice terraces + temples, Paris offers the Eiffel Tower + cobblestone streets, Dubai offers desert dunes + modern skyline.',
    best: 'Bali: April–October | Paris: April–June, September | Dubai: October–March',
    cost: '₹1L – ₹3.5L (photographer + flights + stays)',
    themes: ['Romantic', 'Filmy', 'Royal'],
    tip: 'For Bali, Tegalalang Rice Terraces and Tanah Lot temple at sunset are top shots. For Paris, 6 AM at Trocadero gives you the Eiffel Tower with zero tourists. For Dubai, Liwa desert dunes at sunrise are extraordinary.',
  },
];

// Outfit guide
const OUTFIT_LOOKS = [
  {
    look: 'Look 1 — The Statement (Traditional)',
    bride: 'Heavy lehenga or Kanjivaram saree in a deep or rich colour. Statement jewellery. Full hair styling.',
    groom: 'Sherwani in cream, ivory, or coordinated colour. Matching dupatta or stole. Mojris.',
    when: 'Use for the royal/heritage location — the most photographed and shared look from any shoot.',
    rule: 'Complement, don\'t match — bride in ruby red, groom in ivory. Bride in emerald, groom in ivory-gold.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    look: 'Look 2 — The Dreamy (Semi-Formal)',
    bride: 'Flowy lightweight lehenga or anarkali in pastel — blush, lilac, mint, dusty rose.',
    groom: 'Linen kurta or well-fitted bandhgala in earthy tones — beige, cream, dusty olive.',
    when: 'Gardens, misty hills, flower fields, balconies — the romantic location.',
    rule: 'Softer palette, flowy fabrics. The bride should be able to move, twirl, and walk comfortably.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    look: 'Look 3 — The Casual (Western / Coordinated)',
    bride: 'Floral midi dress, flowy skirt + crop top, or smart casual co-ord in a fun print.',
    groom: 'Well-fitted chinos + linen shirt in complementary colour. Loafers or clean white sneakers.',
    when: 'Urban locations, cafés, markets, home shoots, quirky themes.',
    rule: 'This is the most relaxed look — choose comfort above all. If you\'re both comfortable, it shows in the photos.',
    color: 'from-emerald-500 to-teal-600',
  },
];

// Cost breakdown
const COST_TABLE = [
  { type: 'City / local shoot (2–3 hrs)', cost: '₹15,000 – ₹40,000', includes: 'Photographer fees, basic editing, digital gallery. No travel.' },
  { type: 'Day trip destination (Jaipur/Udaipur/Goa)', cost: '₹40,000 – ₹1,00,000', includes: 'Photographer fees + travel + accommodation for photographer. 6–8 hrs shoot.' },
  { type: 'Extended destination (Kashmir/Andaman)', cost: '₹80,000 – ₹1,80,000', includes: 'Multi-day shoot, photographer travel + stay, permit fees, outfit changes.' },
  { type: 'International (Bali/Paris/Dubai)', cost: '₹1,00,000 – ₹3,50,000', includes: 'Flights, accommodation, visa support for photographer, full-day shoot.' },
  { type: 'Add-ons: Drone footage', cost: '+₹10,000 – ₹25,000', includes: 'Aerial shots — requires permit clearance at many locations.' },
  { type: 'Add-ons: Cinematic short film', cost: '+₹20,000 – ₹60,000', includes: 'A 3–5 minute edited video reel — increasingly popular as an Instagram deliverable.' },
  { type: 'Add-ons: MUA & styling for shoot', cost: '+₹8,000 – ₹25,000', includes: 'Makeup artist for the shoot day — worth it for multi-look shoots.' },
];

// Checklist
const CHECKLIST = [
  { phase: '8–12 weeks before', items: [
    'Finalise the theme and mood board — share with photographer before booking',
    'Book your photographer — confirm availability, deliverables, and timeline',
    'Choose and shortlist locations — check permit requirements early',
    'Plan outfit looks — one per location, maximum 3 looks total',
  ]},
  { phase: '4–6 weeks before', items: [
    'Confirm location permits (ASI monuments, national parks) — these take time',
    'Book makeup artist for the shoot day if using one',
    'Do a pre-shoot outfit trial — confirm all pieces fit and photograph well',
    'Finalise shoot timeline with the photographer — location sequence, travel gaps',
  ]},
  { phase: '1 week before', items: [
    'Steam and hang all outfits — no last-minute ironing',
    'Pack the shoot kit: touch-up makeup, blotting paper, hairpins, safety pins, water, snacks, phone charger',
    'Check weather forecast for the shoot day — plan backup option',
    'Share final mood board with photographer via WhatsApp — key poses, references, must-haves',
  ]},
  { phase: 'Day of shoot', items: [
    'Eat a proper breakfast — you\'ll be moving for hours',
    'Arrive 15–20 minutes early at the first location',
    'Have a "getting ready" plan — makeup done before you arrive at location 1',
    'Trust your photographer — stop directing yourself and let them create',
    'Carry the backup outfit change kit in a small bag for quick changes',
  ]},
];

// Photographer selection
const PHOTOGRAPHER_TIPS = [
  { tip: 'Review their actual portfolio for pre-wedding shoots — not just wedding day photos', detail: 'Pre-wedding photography and wedding day photography are different skills. Look specifically for pre-wedding work in your theme and preferred style. Ask to see 2–3 complete shoot galleries, not just highlight images.' },
  { tip: 'Meet or video-call before booking', detail: 'You\'ll spend 6–8 hours alone with this person in intimate moments. Comfort is essential. If the first call feels awkward or transactional, move on.' },
  { tip: 'Confirm the exact deliverables in writing', detail: 'How many edited photos? In how many days? Raw files or edited only? What format? Will they also shoot a reel? These must be in the contract — not assumed.' },
  { tip: 'Ask about their actual directing style', detail: '"Do you give pose directions or prefer pure candid?" Neither is wrong but it needs to match how natural you both feel in front of a camera. If you freeze when posed, you need someone who creates activities rather than poses.' },
  { tip: 'Confirm equipment backup', detail: 'A professional photographer brings a backup camera body and lens. Ask directly. A single camera failure should not lose your entire shoot day.' },
  { tip: 'Check their turnaround time on edits', detail: 'Industry standard is 2–4 weeks for a pre-wedding gallery. Some photographers take 2–3 months. If you need images for wedding décor, this timeline matters enormously.' },
];

// Mistakes
const MISTAKES = [
  { m: 'Booking the venue without checking permit requirements', r: 'ASI monuments (Humayun\'s Tomb, Qutub Minar, forts) require advance permits of ₹2,000–₹5,000 that must be booked days or weeks in advance. Showing up without a permit on shoot day means turning around and losing the entire day.' },
  { m: 'Wearing identical outfits instead of complementary ones', r: 'Matching couple outfits in the exact same colour look flat and childish in photos. The rule is complementary — if she wears blush, he wears cream. The visual contrast creates depth and makes both stand out.' },
  { m: 'Not doing a pre-shoot trial of the outfit', r: 'A lehenga that looks stunning in the shop can look stiff and unflattering on camera, or restrict movement for poses. Always do a full outfit trial — sit in it, walk in it, practice a twirl. Whatever doesn\'t work, exchange it before shoot day.' },
  { m: 'Scheduling the shoot in harsh midday sun', r: 'Midday light (10 AM – 3 PM) is the least flattering lighting condition for portraits — harsh shadows, squinting eyes, washed-out skin. The golden hour window (45 minutes after sunrise, 45 minutes before sunset) is when pre-wedding photographs truly shine.' },
  { m: 'Choosing a location because it\'s popular, not because it\'s meaningful', r: 'The most viewed pre-wedding photos are often from locations that mean something to the couple, not from the most Instagrammed spots. A shoot at your college, the restaurant where you proposed, or your parents\' home will always feel more alive than a generic palace backdrop.' },
  { m: 'Overthinking every pose and expression', r: 'Self-consciousness shows in every single photograph. The best results come from couples who trust their photographer, stop thinking about the camera, and focus entirely on each other. Brief your photographer: "If we\'re laughing or looking at each other naturally, shoot it immediately."' },
  { m: 'Forgetting to plan the timeline with enough travel buffer', r: 'Most pre-wedding shoots fail their schedule because couples underestimate outfit change time (30–45 minutes each), travel between locations, and setup time at each spot. Build 25% more time into your timeline than you think you need.' },
];

const FAQS = [
  {
    q: 'Is a pre-wedding shoot mandatory for Indian weddings?',
    a: 'No — it\'s entirely optional. However, 78% of Indian couples now include a pre-wedding shoot in their wedding plan (up from 45% in 2020). The practical reasons to do one: (1) Build comfort with your photographer before the wedding day; (2) Create personalised images for wedding décor — photo walls, table displays, video montages; (3) Save-the-date images for WhatsApp invitations; (4) A relaxed, unhurried photography experience away from the wedding day\'s crowd and schedule. If any of these matter to you, it\'s worth the investment.',
  },
  {
    q: 'How much does a pre-wedding shoot cost in India in 2026?',
    a: 'Costs range from ₹15,000–₹40,000 for a local city shoot (2–3 hours, photographer fees only) to ₹40,000–₹1,00,000 for a day-trip destination shoot (Jaipur, Udaipur, Goa) including photographer travel and accommodation, to ₹1,00,000–₹3,50,000 for international shoots (Bali, Paris, Dubai). The average spend for Indian couples doing a destination pre-wedding shoot is ₹80,000–₹1,50,000 all-in. Add ₹10,000–₹60,000 for drone footage or a cinematic reel.',
  },
  {
    q: 'What is the best time of day for a pre-wedding shoot?',
    a: 'Golden hour — the 45 minutes after sunrise and the 45 minutes before sunset — is universally considered the best time for pre-wedding photography. The light is warm, directional, and extraordinarily flattering. Blue hour (the 20–30 minutes just after sunset) is excellent for cityscape and architectural shots. Midday light (10 AM – 3 PM) creates harsh shadows and is avoided by professional photographers unless the shoot is indoors or overcast.',
  },
  {
    q: 'How many outfit changes should we plan for a pre-wedding shoot?',
    a: 'Three looks is the ideal number for a full-day shoot: (1) A traditional formal look for the heritage/royal location — heavy lehenga and sherwani; (2) A semi-formal dreamy look for the romantic location — flowy lightweight outfit; (3) A casual western or coordinated look for urban or quirky shots. Each change takes 30–45 minutes. More than three looks tend to rush the shoot and leave less time for actual photography at each location.',
  },
  {
    q: 'When should we book our pre-wedding shoot relative to the wedding?',
    a: 'The ideal window is 2–4 months before the wedding. This gives enough time for the images to be edited (2–4 weeks after shoot) and then used in wedding décor — photo walls, table centerpieces, save-the-date invitations, and wedding video montages. Booking too close to the wedding (under 6 weeks) creates stress and often means photos aren\'t ready for décor use. For destination shoots requiring travel planning, book 4–6 months in advance.',
  },
  {
    q: 'Do we need permits for pre-wedding shoots at heritage monuments in India?',
    a: 'Yes — most ASI (Archaeological Survey of India) protected monuments require advance photography permits. These typically cost ₹2,000–₹5,000 per day and must be booked 1–2 weeks in advance through the ASI website or the monument office directly. Key locations requiring permits: Humayun\'s Tomb, Qutub Minar, Amber Fort, Mehrangarh Fort, and most national park areas. Your photographer should be familiar with the permit process for their city — confirm this when booking.',
  },
  {
    q: 'What is the best pre-wedding shoot location in India?',
    a: 'The most popular location in 2026 is Udaipur — Lake Palace, Lake Pichola, and City Palace deliver unmatched royal + romantic imagery. For heritage and culture: Jaipur\'s Amber Fort and Mehrangarh Fort in Jodhpur. For beach shoots: Goa and Andaman. For snow: Manali, Shimla, and Kashmir. For mountains and greenery: Munnar and Coorg. For cinematic urban: Mumbai and Kolkata. For the most unique underrated location: Pondicherry\'s French Quarter and Varanasi\'s ghats.',
  },
  {
    q: 'Can we do a pre-wedding shoot without any formal photography experience?',
    a: 'Absolutely — most couples have never done a professional shoot before their pre-wedding. A good photographer will guide you through the entire session with activity prompts ("walk toward me holding hands", "whisper something funny in her ear") rather than rigid poses. The best advice: stop thinking about the camera, focus only on each other, and let the photographer worry about the frame. The 60–90 minutes of the shoot where you forget the camera is there produce the best images of the day.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FaqItem({ item, open, onToggle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white/90 overflow-hidden shadow-sm">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-rose-50/50 transition-colors"
        aria-expanded={open}>
        <span className="font-semibold text-gray-900 pr-2 text-sm md:text-base">{item.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-rose-gold transition-transform ${open ? 'rotate-180' : ''}`} />
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

// ─── Main Component ───────────────────────────────────────────────────────────
export function PreWeddingShootGuideArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq]       = useState(-1);
  const [showToc, setShowToc]       = useState(false);
  const [activeTheme, setActiveTheme] = useState('royal');
  const [activeLocation, setActiveLoc] = useState(null);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  const activeThemeData = THEMES.find(t => t.id === activeTheme);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-400/15 to-pink-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-violet-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl" />
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
            <span className="text-rose-gold font-semibold">Wedding Photography</span>
            <ChevronRight className="w-3 h-3" />
            <span>Pre-Wedding Shoot</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-rose-gold/30 shadow-sm mb-6">
            <Camera className="w-4 h-4 text-rose-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">2026 Guide · 5 Themes · 15 Locations</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4">
            Pre-Wedding Shoot{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold via-plum to-violet-500">
              Ideas & Guide
            </span>
          </h1>
          <p className="text-base text-rose-gold font-semibold mb-5">
            Themes · Locations · Outfits · Poses · Cost · Planning — India 2026
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[
              { icon: '🎨', label: '5 theme styles' },
              { icon: '📍', label: '15 best locations' },
              { icon: '👗', label: 'Outfit guide' },
              { icon: '📸', label: 'Pose ideas' },
              { icon: '💰', label: 'Cost breakdown' },
              { icon: '✅', label: 'Planning checklist' },
            ].map(p => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-gold/20 text-gray-700 text-xs font-semibold shadow-sm">
                {p.icon} {p.label}
              </span>
            ))}
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            78% of Indian couples now include a pre-wedding shoot — and the best ones aren't
            about perfect poses. They're about finding the right theme, the right location, and
            a photographer who lets you forget the camera exists.
            This guide covers everything.
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
          <div className="max-w-5xl mx-auto mt-10 rounded-3xl overflow-hidden shadow-2xl shadow-rose-gold/15 border-4 border-white ring-1 ring-rose-100">
            <img src={ensureHttps(post.featured_image)} alt="Pre-wedding shoot ideas for Indian couples 2026"
              className="w-full aspect-[21/9] object-cover object-center" loading="eager" />
          </div>
        )}
      </header>

      {/* TOC */}
      <div className="max-w-4xl mx-auto px-4 lg:px-8 mb-8">
        <div className="rounded-2xl bg-white border border-rose-100 shadow-sm overflow-hidden">
          <button type="button" onClick={() => setShowToc(!showToc)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-rose-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-rose-gold" />
              <span className="font-semibold text-gray-900">Table of Contents</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{TOC.length} sections</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showToc ? 'rotate-180' : ''}`} />
          </button>
          {showToc && (
            <div className="border-t border-gray-100 px-5 py-4 grid sm:grid-cols-2 gap-1">
              {TOC.map((item, i) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setShowToc(false)}
                  className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-rose-gold transition-colors group">
                  <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-gold text-[10px] font-bold flex items-center justify-center shrink-0 group-hover:bg-rose-gold group-hover:text-white transition-colors">{i + 1}</span>
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 lg:px-8 pb-24 space-y-14 md:space-y-20">

        {/* WHY */}
        <section id="why">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-gold/20 via-plum/15 to-violet-300/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-rose-50/60 border border-rose-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-rose-gold shrink-0" />
                Why a pre-wedding shoot is worth it
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                The pre-wedding shoot is the one photography experience that belongs entirely
                to you. No family choreography, no ritual timelines, no 500 guests watching.
                Just the two of you, your photographer, and a beautiful setting chosen
                specifically for your story.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                But beyond the aesthetics, there's a practical reason most photographers
                recommend it: <strong>it builds comfort before the wedding day</strong>.
                Couples who have done a pre-wedding shoot with their photographer consistently
                look more relaxed and natural in their wedding photographs — because they've
                already been through the initial awkwardness and learned to trust the lens.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                And the photos themselves? They end up on photo walls, video montages,
                invitation cards, table centrepieces, and Instagram posts that their family
                forwards to every group for the next decade.
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '📸', title: '78% of Indian couples now do it', desc: 'Up from 45% in 2020. The pre-wedding shoot has become a standard part of the Indian wedding plan.' },
              { icon: '💫', title: 'Your photos, your story', desc: 'Used in wedding décor, video montages, save-the-dates, and as cherished prints for decades.' },
              { icon: '🤝', title: 'Builds photographer rapport', desc: 'The single biggest predictor of great wedding photos is comfort with your photographer. The shoot builds this naturally.' },
            ].map(c => (
              <div key={c.title} className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-3xl">{c.icon}</span>
                <p className="font-semibold text-gray-900">{c.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <CtaSignup headline="Planning your pre-wedding shoot? Wedora keeps all your wedding planning organised."
          sub="Checklist, budget planner, vendor tracker, and invitation generator — all free." />

        {/* THEME FINDER — INTERACTIVE */}
        <section id="themes">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Theme finder — 5 styles for every couple</h2>
              <p className="text-gray-500 text-sm mt-0.5">Pick your personality. Get your locations, outfits, and poses.</p>
            </div>
          </div>

          {/* Theme selector */}
          <div className="flex flex-wrap gap-2 mb-5">
            {THEMES.map(t => (
              <button key={t.id} type="button" onClick={() => setActiveTheme(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeTheme === t.id
                    ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                <span>{t.emoji}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Theme content */}
          {activeThemeData && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-5 py-4 bg-gradient-to-r ${activeThemeData.color} text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeThemeData.emoji}</span>
                  <div>
                    <p className="font-serif font-bold text-xl">{activeThemeData.label}</p>
                    <p className="text-white/80 text-sm">{activeThemeData.tagline}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Vibe */}
                <div className={`p-4 rounded-xl ${activeThemeData.bg} border ${activeThemeData.border}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${activeThemeData.text}`}>The Vibe</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{activeThemeData.vibe}</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Locations */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Best Locations
                    </p>
                    <ul className="space-y-1.5">
                      {activeThemeData.locations.map(l => (
                        <li key={l} className={`text-xs leading-relaxed ${activeThemeData.text} flex gap-1.5`}>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />{l}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outfits */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Shirt className="w-3.5 h-3.5" /> Outfit Ideas
                    </p>
                    <ul className="space-y-1.5">
                      {activeThemeData.outfits.map(o => (
                        <li key={o} className="text-xs text-gray-600 leading-relaxed flex gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />{o}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Poses */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> Pose / Direction Ideas
                    </p>
                    <ul className="space-y-1.5">
                      {activeThemeData.poses.map(p => (
                        <li key={p} className="text-xs text-gray-600 leading-relaxed flex gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tip */}
                <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-sm leading-relaxed">{activeThemeData.tip}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* LOCATIONS */}
        <section id="locations">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">15 best pre-wedding shoot locations in India</h2>
              <p className="text-gray-500 text-sm mt-0.5">From royal Rajasthan to tropical Andaman — with cost, best season, and insider tips.</p>
            </div>
          </div>

          <div className="space-y-3">
            {LOCATIONS.map((loc, i) => (
              <div key={loc.name}
                onClick={() => setActiveLoc(activeLocation === i ? null : i)}
                className={`rounded-2xl border overflow-hidden cursor-pointer transition-all hover:shadow-md ${activeLocation === i ? 'border-rose-gold/40 shadow-md' : 'border-gray-100 bg-white shadow-sm'}`}>
                <div className={`flex items-center justify-between px-5 py-4 ${activeLocation === i ? 'bg-rose-50/60' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-gold text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div>
                      <p className="font-bold text-gray-900">{loc.name}</p>
                      <span className="text-xs font-semibold text-rose-gold">{loc.tag}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{loc.cost}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeLocation === i ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {activeLocation === i && (
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-3">
                    <p className="text-gray-600 text-sm leading-relaxed">{loc.why}</p>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="font-bold text-amber-700 mb-1">🗓 Best season</p>
                        <p className="text-amber-800">{loc.best}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-3">
                        <p className="font-bold text-emerald-700 mb-1">💰 Approx cost</p>
                        <p className="text-emerald-800">{loc.cost}</p>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-3">
                        <p className="font-bold text-violet-700 mb-1">🎨 Best themes</p>
                        <p className="text-violet-800">{loc.themes.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-amber-800 leading-relaxed">{loc.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <CtaTool icon={Camera} headline="Track your photographer shortlist and shoot timeline on Wedora"
          sub="Vendor tracker, appointment notes, payment milestones — free wedding planning tools."
          btnLabel="Open free tracker" btnTo="/signup"
          color={{ bg: 'bg-rose-50', border: 'border-rose-200', grad: 'from-rose-gold to-plum', title: 'text-rose-900' }} />

        {/* OUTFITS */}
        <section id="outfits">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Outfit coordination guide</h2>
              <p className="text-gray-500 text-sm mt-0.5">Three looks, three stories — how to coordinate without matching.</p>
            </div>
          </div>

          <div className="space-y-4">
            {OUTFIT_LOOKS.map(look => (
              <div key={look.look} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className={`px-5 py-3.5 bg-gradient-to-r ${look.color} text-white`}>
                  <p className="font-bold">{look.look}</p>
                  <p className="text-white/80 text-xs mt-0.5">{look.when}</p>
                </div>
                <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">👰 Bride</p>
                    <p className="text-gray-700 leading-relaxed">{look.bride}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">🤵 Groom</p>
                    <p className="text-gray-700 leading-relaxed">{look.groom}</p>
                  </div>
                </div>
                <div className="mx-5 mb-5 flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-800"><strong>Colour rule:</strong> {look.rule}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3 p-5 rounded-2xl bg-rose-50 border border-rose-200/60">
            <Lightbulb className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900 mb-1">The golden outfit rule</p>
              <p className="text-rose-800 text-sm leading-relaxed">
                <strong>Coordinate, don't match.</strong> Identical couple outfits look flat in photographs — they lose the visual depth that comes from complementary contrast. If she wears deep red, he wears ivory. If she wears blush, he wears cream. If she wears emerald, he wears ivory-gold. The contrast makes both individuals stand out while creating visual harmony in the frame.
              </p>
            </div>
          </div>
        </section>

        {/* POSES */}
        <section id="poses">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-violet-200/80 bg-gradient-to-br from-violet-50 to-purple-50/40 shadow-xl">
            <div className="px-6 py-4 bg-violet-100/80 border-b border-violet-200 flex items-center gap-3">
              <Camera className="w-7 h-7 text-violet-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-violet-950">Pose & direction ideas that feel natural</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <p className="text-violet-800 text-sm leading-relaxed">
                <strong>The secret professional photographers don't say out loud:</strong> the best shots
                in any pre-wedding shoot are never the perfectly posed ones. They are the
                in-between moments — the adjustment laugh, the look back, the leaning in to hear
                something. These directions create those moments intentionally.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { cat: '💬 Conversation prompts', items: ['"Whisper your favourite memory about each other"', '"Tell her/him one thing you\'re looking forward to about the wedding"', '"What did you think the first time you saw each other?"', '"Tell each other your most embarrassing habit"'] },
                  { cat: '🚶 Movement directions', items: ['Walk toward me slowly, holding hands — don\'t look at the camera', 'Twirl her around once, then pull her in close', 'Walk away from me, then she looks back over her shoulder', 'Run toward each other from 20 feet apart — slow-mo moment'] },
                  { cat: '💑 Closeness directions', items: ['Forehead to forehead, eyes closed — breathe together', 'He wraps arms from behind, she leans back into him', 'Sit close, she rests head on his shoulder — both look out', 'Nose-to-nose, not quite kissing — hold the tension'] },
                  { cat: '😄 Spontaneous moments', items: ['Both look at the sky and point at something (creates natural profile)', 'He tickles her — shoot the reaction, not the pose', 'Both look at a phone photo and react — share a real laugh', 'She fixes his collar or he adjusts her dupatta — intimate and real'] },
                ].map(section => (
                  <div key={section.cat} className="bg-white/80 rounded-xl p-4">
                    <p className="font-bold text-violet-900 mb-2 text-sm">{section.cat}</p>
                    <ul className="space-y-1.5">
                      {section.items.map(item => (
                        <li key={item} className="text-xs text-violet-800 flex gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 p-4 rounded-xl bg-white border border-violet-200/60">
                <Zap className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <p className="text-violet-700 text-sm leading-relaxed">
                  <strong>The single best instruction you can give your photographer:</strong>
                  "When we forget you're there — that's when you shoot." Brief this before the session.
                  The first 30–60 minutes of any shoot is always awkward as couples warm up.
                  The last 2 hours are when the magic happens. Stay until the end.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COST */}
        <section id="cost">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Cost breakdown 2026</h2>
              <p className="text-gray-500 text-sm mt-0.5">From city shoots to international destinations — all-in costs explained.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">Shoot type</th>
                    <th className="px-4 py-3.5 font-semibold">Cost range</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">What's included</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COST_TABLE.map((row, i) => (
                    <tr key={row.type} className={`hover:bg-emerald-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 whitespace-nowrap">{row.cost}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.includes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 p-5 rounded-2xl bg-emerald-50 border border-emerald-200/60">
            <Lightbulb className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900 mb-1">Budget vs Value: where to spend and where to save</p>
              <p className="text-emerald-800 text-sm leading-relaxed">
                <strong>Spend on:</strong> The photographer — this is not where to cut corners. A great photographer at a simple location delivers better photos than a mediocre photographer at Udaipur Palace.
                <strong className="ml-1">Save on:</strong> Props, elaborate decor setups, unnecessary outfit accessories. The best pre-wedding shots are almost always the uncluttered ones. Three good outfits beat ten mediocre ones.
              </p>
            </div>
          </div>
        </section>

        <CtaTool icon={IndianRupee} headline="Use Wedora's budget calculator to plan your shoot budget"
          sub="Add your pre-wedding shoot to your overall wedding budget and see the full picture instantly."
          btnLabel="Open budget calculator" btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{ bg: 'bg-sky-50', border: 'border-sky-200', grad: 'from-sky-500 to-blue-600', title: 'text-sky-900' }} />

        {/* TIMING */}
        <section id="timing">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">When to book & best time of day</h2>
              <p className="text-gray-500 text-sm mt-0.5">Timing decisions that directly affect the quality of your photographs.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'When to book relative to the wedding',
                icon: '📅',
                color: 'bg-amber-50 border-amber-200',
                points: [
                  'Ideal: 2–4 months before the wedding — images ready for décor',
                  'Minimum: 6 weeks before — for basic editing and delivery',
                  'For destination shoots: 4–6 months before to allow travel planning',
                  'Book the photographer 4–6 months ahead for peak-season availability',
                ],
              },
              {
                title: 'Best time of day for the shoot',
                icon: '🌅',
                color: 'bg-rose-50 border-rose-200',
                points: [
                  'Golden hour (45 min after sunrise): warmest, most flattering light of the day',
                  'Golden hour (45 min before sunset): equally beautiful, warmer palette',
                  'Blue hour (20 min after sunset): magic for cities and architectural shots',
                  'Avoid 10 AM – 3 PM: harsh shadows, squinting, unflattering skin tones',
                ],
              },
              {
                title: 'Best months for outdoor shoots in India',
                icon: '🌤️',
                color: 'bg-emerald-50 border-emerald-200',
                points: [
                  'October – March: best for most of India — Rajasthan, South India, coastal areas',
                  'April – June: hill stations and mountains (Manali, Shimla, Ooty)',
                  'July – September: Valley of Flowers, lush green monsoon landscapes',
                  'December – February: snow destinations (Kashmir, Manali, Auli)',
                ],
              },
              {
                title: 'How long should a shoot take?',
                icon: '⏱️',
                color: 'bg-violet-50 border-violet-200',
                points: [
                  '2–3 hours: local city shoot, 1 location, 1–2 outfit changes',
                  '6–8 hours: destination day shoot, 2–3 locations, 2–3 outfits',
                  '1–2 days: multi-day shoot, multiple locations across a city or region',
                  'Build 25% more time than needed — travel + changes always take longer',
                ],
              },
            ].map(card => (
              <div key={card.title} className={`rounded-2xl border ${card.color} p-5`}>
                <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">{card.icon}</span>{card.title}
                </p>
                <ul className="space-y-2">
                  {card.points.map(p => (
                    <li key={p} className="flex gap-2 text-gray-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CHECKLIST */}
        <section id="checklist">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">The pre-shoot planning checklist</h2>
              <p className="text-gray-500 text-sm mt-0.5">Phase by phase — from booking to the day itself.</p>
            </div>
          </div>

          <div className="space-y-4">
            {CHECKLIST.map(phase => (
              <div key={phase.phase} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                  <p className="font-bold">{phase.phase}</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-2.5">
                    {phase.items.map(item => (
                      <li key={item} className="flex gap-3 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-md bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0 mt-0.5"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PHOTOGRAPHER */}
        <section id="photographer">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">How to choose the right photographer</h2>
              <p className="text-gray-500 text-sm mt-0.5">6 things that matter more than price.</p>
            </div>
          </div>

          <div className="space-y-3">
            {PHOTOGRAPHER_TIPS.map((item, i) => (
              <div key={item.tip} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-rose-gold/25 hover:shadow-md transition-all">
                <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{item.tip}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MISTAKES */}
        <section id="mistakes">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 shadow-xl">
            <div className="px-6 py-4 bg-amber-100/80 border-b border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">7 mistakes that ruin pre-wedding shoots</h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              {MISTAKES.map(item => (
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

        <CtaSignup headline="Got your shoot done? Plan the rest of your wedding on Wedora — free."
          sub="Checklist, budget planner, WhatsApp invitation builder, vendor tracker — your complete wedding planning toolkit." />

        {/* RELATED */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Star className="w-5 h-5 text-rose-gold" fill="currentColor" />
              <p className="font-serif font-bold text-gray-900">More wedding planning guides on Wedora</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Wedding Photography Checklist: 50 Must-Have Shots', slug: 'wedding-photography-checklist-must-have-shots', icon: '📷' },
                { title: 'Last-Minute Wedding Checklist: 30 Days Before', slug: 'last-minute-wedding-checklist-30-days-before', icon: '✅' },
                { title: 'Hindu Wedding Muhurat Dates 2026 & 2027', slug: 'hindu-wedding-muhurat-dates-2026-2027', icon: '🗓️' },
                { title: 'WhatsApp Wedding Invitations — Modern Guide', slug: 'whatsapp-wedding-invitations-modern-trend-guide', icon: '💬' },
                { title: 'Wedding Budget Calculator: Allocate Money Smartly', slug: 'wedding-budget-calculator-how-to-allocate-money', icon: '🧮' },
                { title: 'Low Budget Wedding Ideas That Look Premium', slug: 'low-budget-wedding-ideas-india-look-premium', icon: '✨' },
              ].map(a => (
                <Link key={a.slug} to={`/blog/${a.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-gold/25 transition-all group">
                  <span className="text-lg">{a.icon}</span>
                  <p className="text-sm text-gray-700 group-hover:text-rose-gold font-medium transition-colors">{a.title}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-gold shrink-0 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BIG CTA */}
        <section className="rounded-[2rem] bg-gradient-to-br from-rose-gold via-plum to-violet-600 p-1 shadow-2xl shadow-rose-gold/30">
          <div className="rounded-[1.85rem] bg-gray-900 px-8 py-12 md:px-12 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
              Plan your entire wedding journey on Wedora — completely free
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              From your pre-wedding shoot planning to the last-minute checklist, wedding budget
              to WhatsApp invitations — Wedora has every tool you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-rose-50 transition-colors shadow-lg">
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
            Every question Indian couples ask about pre-wedding shoots — answered.
          </p>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </section>

        {/* CLOSING */}
        <section className="text-center max-w-2xl mx-auto pb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
            The best pre-wedding photos are the ones where you forgot the camera was there
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Find a theme that feels like you. Choose a location that means something.
            Book a photographer you actually like spending time with. Wear outfits you
            can move in. And then — trust the process. The laughter that happens when
            the direction makes no sense, the moment you both catch each other's eye
            and forget everything else — those are the photographs that end up in frames.
            The ones that outlast everything.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Pre-wedding shoot guide</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Best locations India 2026</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free planning tools</span>
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
            <button type="button" onClick={onShare} className="p-2 rounded-full hover:bg-rose-gold/10 text-gray-500 transition-colors relative">
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
