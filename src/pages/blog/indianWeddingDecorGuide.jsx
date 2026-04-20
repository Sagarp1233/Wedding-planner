import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Copy, Sparkles, Heart, Star,
  Lightbulb, AlertTriangle, CheckCircle2, ChevronDown,
  ChevronRight, IndianRupee, Flower2, Sun, Zap,
  Layers, BookOpen, Palette, Shield, Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { clearFaqPageJsonLd, setFaqPageJsonLd } from '../../lib/seo';
import { ensureHttps } from '../../utils/ensureHttps';

export const DECOR_GUIDE_SLUG = 'indian-wedding-decoration-ideas-mandap-guide-2026';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=85&auto=format&fit=crop';

export function getStaticDecorGuidePost() {
  const now = new Date().toISOString();
  return {
    id: 'static-decor-guide-2026',
    title: 'Indian Wedding Decoration Ideas 2026: Mandap, Stage, Flowers & Budget Guide',
    slug: DECOR_GUIDE_SLUG,
    excerpt:
      'Complete Indian wedding decoration guide 2026 — mandap design styles, function-wise décor ideas, flower guide, lighting tips, cost breakdown from ₹2L–₹25L, and the mistakes that drain décor budgets.',
    content: '',
    tags: 'Wedding Decoration, Mandap Design, Wedding Decor Ideas, Wedding Planning',
    featured_image: FEATURED_IMAGE,
    meta_title: 'Indian Wedding Decoration Ideas 2026: Mandap, Stage & Budget Guide | Wedora',
    meta_description:
      'Complete Indian wedding decoration ideas guide 2026 — mandap design styles, function décor, flower selection, lighting guide, realistic cost breakdown, and expert tips to save 20–30%.',
    keywords:
      'indian wedding decoration ideas 2026, mandap decoration ideas india, wedding decor ideas india, wedding stage decoration india, wedding mandap design 2026, wedding decoration cost india, mehendi decor ideas india',
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
  { id: 'why-decor',    label: 'Why Décor Deserves Strategic Planning' },
  { id: 'mandap',       label: 'Mandap Designs — 8 Styles for 2026' },
  { id: 'function',     label: 'Function-Wise Décor Ideas (Interactive)' },
  { id: 'flowers',      label: 'Flower Guide — Best Blooms for Every Budget' },
  { id: 'lighting',     label: 'Lighting — The Most Underrated Décor Element' },
  { id: 'colour',       label: '2026 Colour Palettes & Themes' },
  { id: 'cost',         label: 'Cost Breakdown 2026' },
  { id: 'decorator',    label: 'Choosing & Managing Your Decorator' },
  { id: 'save',         label: '8 Ways to Cut Décor Costs Without Showing It' },
  { id: 'mistakes',     label: 'Mistakes That Drain Décor Budgets' },
  { id: 'faq',          label: 'FAQs' },
];

// 8 Mandap styles
const MANDAP_STYLES = [
  {
    name: 'Floral Arch Mandap',
    emoji: '🌸',
    desc: 'The most popular style in 2026. An open structure with cascading flowers — roses, orchids, or seasonal blooms — forming the canopy and columns. Clean lines, maximalist florals.',
    bestFor: 'All wedding types. Works equally well indoors (banquet halls) and outdoors (gardens, farmhouses).',
    cost: '₹80,000 – ₹2,50,000',
    tip: 'Use local seasonal flowers for the bulk fill and reserve imported blooms (orchids, lisianthus) only for the focal centrepiece — cuts cost by 30–40% with no visible difference.',
    trend: '⭐ Most popular',
    color: 'from-rose-500 to-pink-600',
  },
  {
    name: 'Geometric Modern Mandap',
    emoji: '🔷',
    desc: 'Minimalist metal or wooden frame in triangular, hexagonal, or abstract geometric forms. Draped with sheer fabric and accented with spot florals. Very photogenic — creates clean architectural lines.',
    bestFor: 'Contemporary couples, urban venues, air-conditioned banquet halls, intimate weddings.',
    cost: '₹60,000 – ₹1,80,000',
    tip: 'A geometric mandap with good draping and strategic lighting looks ₹5L for ₹1L. The structure is often rentable from décor companies — ask your decorator.',
    trend: '📈 Rising fast',
    color: 'from-violet-500 to-purple-700',
  },
  {
    name: 'Traditional Temple Mandap',
    emoji: '🏛️',
    desc: 'Ornately carved wooden or FRP (fibre-reinforced polymer) columns and canopy, inspired by South or North Indian temple architecture. Gold and burgundy tones, brass detailing.',
    bestFor: 'Traditional families, Hindu ceremonies, South Indian weddings, Brahmin weddings.',
    cost: '₹1,00,000 – ₹3,50,000',
    tip: 'FRP mandaps are significantly cheaper than hand-carved wood while looking nearly identical. Ask your decorator if they have FRP temple mandap stock.',
    trend: '✅ Timeless',
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Eco-Friendly / Sustainable Mandap',
    emoji: '🌿',
    desc: 'Bamboo or cane frame with potted plants, dried botanicals, woven jute, and locally sourced seasonal flowers. Zero plastic, minimal waste, extraordinarily photogenic in natural light.',
    bestFor: 'Eco-conscious couples, outdoor weddings, farmhouse weddings, destination weddings.',
    cost: '₹50,000 – ₹1,50,000',
    tip: 'Sustainable mandaps are often cost-neutral or cheaper than floral mandaps because they use potted plants and dried botanicals rather than expensive imported cut flowers. The plants can be gifted to guests or donated after the wedding.',
    trend: '🌱 Trending strongly',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Acrylic / Transparent Mandap',
    emoji: '💎',
    desc: 'Crystal-clear acrylic columns and frame with minimal floral accents and dramatic uplighting. Creates a floating, ethereal look where the venue or outdoor landscape becomes the backdrop.',
    bestFor: 'Luxury weddings, rooftop ceremonies, beach weddings, venues with beautiful natural backdrops.',
    cost: '₹1,50,000 – ₹4,00,000',
    tip: 'An acrylic mandap requires good lighting to achieve its signature look — the investment in uplighting (₹30,000–₹70,000) is non-negotiable with this style. Without lighting it looks like a furniture showroom.',
    trend: '✨ Ultra-premium',
    color: 'from-sky-500 to-blue-600',
  },
  {
    name: 'Rajasthani Royal Mandap',
    emoji: '👑',
    desc: 'Inspired by Mughal and Rajput architecture — domed canopy, jharokha-style arched windows, mirror work, brass lanterns, and a palette of deep reds, golds, and ivory. Statement marigold strings.',
    bestFor: 'Royal Rajasthani themes, heritage venue weddings, destination weddings in palaces and forts.',
    cost: '₹1,20,000 – ₹4,50,000',
    tip: 'Marigold strings (genda phool) are extraordinarily cheap and visually powerful — a Rajasthani mandap with marigolds costs half of one with roses and photographs better.',
    trend: '🏰 Heritage favourite',
    color: 'from-amber-600 to-yellow-500',
  },
  {
    name: 'South Indian Banana & Brass Mandap',
    emoji: '🌴',
    desc: 'Traditional South Indian style — banana tree trunks as columns, mango leaves (thoranam), banana flower clusters, brass uruli lamps, white and yellow flowers, minimal structural decoration.',
    bestFor: 'South Indian (Tamil, Kannadiga, Telugu, Malayali) wedding ceremonies, traditional families.',
    cost: '₹40,000 – ₹1,20,000',
    tip: 'South Indian traditional mandaps are among the most cost-effective and visually authentic styles in Indian weddings. The natural elements — banana, mango leaves, kolam — create a sacred atmosphere that no synthetic decoration can replicate.',
    trend: '🕉️ Cultural classic',
    color: 'from-lime-500 to-green-600',
  },
  {
    name: 'Forest / Boho Mandap',
    emoji: '🌳',
    desc: 'Driftwood or raw wood arch frame entwined with pampas grass, hanging dried botanicals, macramé drapes, wildflowers, and warm Edison bulbs. An earthy, free-spirited, intimate aesthetic.',
    bestFor: 'Nature-loving couples, outdoor garden weddings, Goa and hill station destination weddings.',
    cost: '₹60,000 – ₹1,80,000',
    tip: 'Pampas grass is one of the most cost-effective filler materials for boho mandaps — it photographs beautifully and is a fraction of the cost of flowers. Source locally from wholesale flower markets (not from the decorator) and negotiate supply-only.',
    trend: '🌾 Modern boho',
    color: 'from-stone-500 to-amber-600',
  },
];

// Function-wise decor — interactive feature
const FUNCTION_DECOR = [
  {
    id: 'mehendi',
    label: 'Mehendi',
    emoji: '🌿',
    timing: 'Day function, outdoor or semi-outdoor',
    vibe: 'Vibrant, colourful, relaxed — guests are seated, everyone is mingling',
    color: 'from-emerald-500 to-lime-500',
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
    elements: [
      { item: 'Seating', detail: 'Low cushioned floor seating with bolster pillows — bright yellows, greens, pinks. Creates the candid, intimate mehendi vibe.' },
      { item: 'Canopy / ceiling', detail: 'Marigold strings hung ceiling to floor as a dense backdrop. Alternatively: hanging floral chandeliers or a fabric ceiling in saffron and yellow.' },
      { item: 'Backdrop', detail: 'Genda phool (marigold) backdrop — cheapest and most visually impactful option. Works as the photo backdrop for all mehendi photos.' },
      { item: 'Entrance', detail: 'Flower-strung archway in bright colours with "Mehendi" neon sign or wooden letter board. Very Instagram-friendly and inexpensive.' },
      { item: 'Table / prop styling', detail: 'Small earthen pots (matkas) with fresh flowers as table centrepieces. Mehendi cones displayed artfully. Handmade signs and personal touches.' },
    ],
    budget: '₹50,000 – ₹2,00,000',
    saveTip: 'Marigold is the mehendi function\'s best friend — an all-marigold mehendi setup is visually stunning and costs 40% of what a rose setup would cost.',
  },
  {
    id: 'haldi',
    label: 'Haldi',
    emoji: '💛',
    timing: 'Morning, intimate family gathering',
    vibe: 'Warm, joyful, very intimate — usually just close family',
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700',
    elements: [
      { item: 'Seating', detail: 'Jute mats, floor seating, or low wooden stools with minimal cushions — intimate and informal.' },
      { item: 'Backdrop', detail: 'Marigold garland backdrop in yellows and oranges. Raw floral wall with sunflowers. Keep it simple — this is the most casual function.' },
      { item: 'Stage / focal point', detail: 'A simple decorated chair or jhoola (swing) for the bride/groom. Decorated with flowers and fabric, not over-structured.' },
      { item: 'Props', detail: 'Clay matkas filled with haldi paste. Flower petal rangoli on the floor. Small brass diyas. Keep everything natural and artisanal.' },
      { item: 'Lighting', detail: 'Natural light is ideal. If artificial light is needed, warm Edison bulbs or string lights. No stage lighting required for this function.' },
    ],
    budget: '₹20,000 – ₹80,000',
    saveTip: 'Haldi décor is where you should spend the least. A beautiful marigold backdrop and some fresh flowers cost ₹15,000–₹25,000 and photograph just as well as a ₹1,00,000 setup.',
  },
  {
    id: 'sangeet',
    label: 'Sangeet',
    emoji: '🎶',
    timing: 'Evening function, high energy',
    vibe: 'Celebratory, dramatic, photography and performance focused',
    color: 'from-violet-500 to-purple-700',
    bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700',
    elements: [
      { item: 'Stage / backdrop', detail: 'The stage is the focal point for performances. LED digital backdrop with couple\'s name works well. Alternatively: floral wall with dramatic uplighting, or a chandelier installation.' },
      { item: 'Seating arrangement', detail: 'Theatre-style for performances, transitioning to dinner. Consider a mix of dining tables and lounge seating for an upscale feel.' },
      { item: 'Lighting', detail: 'This is where you invest in lighting. DJ wash lights, gobo lights projecting patterns, pin spots on the stage, and ambient coloured LED uplighting. Lighting IS the sangeet décor.' },
      { item: 'Entrance', detail: 'Dramatic floral tunnel or LED tunnel at the entrance — creates the first impression moment that guests photograph immediately.' },
      { item: 'Ceiling treatment', detail: 'Fabric draping or hanging installations (suspended flowers, lanterns, fairy lights) fills the vertical space that guests see while dancing.' },
    ],
    budget: '₹1,50,000 – ₹6,00,000',
    saveTip: 'Invest in lighting for sangeet rather than flowers — ₹80,000 in lighting vs ₹80,000 in flowers will produce dramatically better results for a night function. Lighting is everything after 7 PM.',
  },
  {
    id: 'wedding',
    label: 'Wedding Day',
    emoji: '🌸',
    timing: 'The main ceremony',
    vibe: 'Sacred, significant, the most photographed and remembered function',
    color: 'from-rose-gold to-plum',
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700',
    elements: [
      { item: 'Mandap', detail: 'The centrepiece of wedding décor — choose a mandap style that reflects your aesthetic (see Mandap Styles above). This is where to invest the most.' },
      { item: 'Aisle', detail: 'Flower petal aisle or a floral-runner aisle. Flanked by small arrangements or diyas. The bride\'s walk down the aisle is one of the most photographed moments.' },
      { item: 'Phoolon ki chaadar', detail: 'The floral canopy held over the bride during her entry — roses, marigolds, or mixed blooms. Carried by brothers or bridesmaids. Essential and high-impact.' },
      { item: 'Stage for reception of guests', detail: 'A smaller, secondary stage for the couple to receive family blessings — decorated consistently with the mandap theme.' },
      { item: 'Floral centrepieces', detail: 'Each table should have a cohesive floral arrangement — height and proportion matter. Tall centrepieces work for high-ceiling venues, low for intimate halls.' },
    ],
    budget: '₹2,00,000 – ₹10,00,000',
    saveTip: 'Repurpose phoolon ki chaadar flowers into the mandap after the bride\'s entry — a smart decorator will plan this in advance. Don\'t pay for two separate floral setups.',
  },
  {
    id: 'reception',
    label: 'Reception',
    emoji: '🥂',
    timing: 'Evening dinner function, often the largest guest count',
    vibe: 'Glamorous, guest-hospitality focused, photo-driven',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700',
    elements: [
      { item: 'Stage / backdrop', detail: 'The couple\'s receiving stage is the focal point — usually more elaborate than the wedding day stage. LED digital backdrop, custom name arch, or dramatic floral installation.' },
      { item: 'Entrance design', detail: 'Floral arch, LED tunnel, or chandelier-draped entry. First impression for guests arriving throughout the evening — worth investing in.' },
      { item: 'Table centrepieces', detail: 'Usually the largest décor line item for receptions. Consistent theme — matching colour palette, height, and style across all tables.' },
      { item: 'Lighting', detail: 'Pin spots on centrepieces, warm ambient lighting, coloured LED uplighting on walls, gobos projecting patterns on the dance floor. Lighting sets the entire mood.' },
      { item: 'Personalised elements', detail: 'Name boards, couple\'s photo display, seating charts, custom signage, neon signs with couple initials — small personal touches that make the reception uniquely yours.' },
    ],
    budget: '₹2,00,000 – ₹8,00,000',
    saveTip: 'Reception flowers are often overkill. Invest heavily in lighting and one dramatic focal element (stage backdrop). Reduce table centrepiece complexity — guests notice the entrance, the stage, and the lighting most.',
  },
];

// Flowers guide
const FLOWERS = [
  { flower: 'Marigold (Genda Phool)', cost: '₹30–₹60/kg', best: 'Mehendi, Haldi, Rajasthani themes, mandap strings', why: 'The most iconic Indian wedding flower. Cheap, abundant, visually stunning in mass. Creates that quintessential Indian wedding warmth.', seasonal: 'Year-round in India', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { flower: 'Rose', cost: '₹8–₹25/stem (local), ₹60–₹150/stem (imported)', best: 'Stage backdrops, mandap canopies, bridal bouquet, centrepieces', why: 'Versatile across all themes and colour palettes. Indian red/pink roses are affordable; imported garden roses cost 5–8× more for minimal visual difference at distance.', seasonal: 'Year-round, best October–March', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { flower: 'Mogra / Jasmine', cost: '₹200–₹600/kg string', best: 'Bridal haar (garland), hair flowers, mandap fragrance, varmala', why: 'The scent of mogra IS the Indian wedding experience. Cannot be replicated by any other flower. Essential for traditional weddings.', seasonal: 'March–September peak, available year-round', color: 'bg-white border-gray-200 text-gray-700' },
  { flower: 'Orchid', cost: '₹80–₹200/stem', best: 'Premium mandaps, reception stage, luxury centrepieces', why: 'Long-lasting (7–10 days), highly photogenic, available in a wide colour range. The go-to premium flower when roses need a visual upgrade.', seasonal: 'Imported, year-round availability', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  { flower: 'Tuberose (Rajnigandha)', cost: '₹15–₹30/stem', best: 'Garlands, table runners, fragrance accents', why: 'Extraordinarily fragrant, white, elegant. Frequently used in wedding garlands and aisle decor. Very budget-friendly for the visual and olfactory impact.', seasonal: 'Year-round, best during summer', color: 'bg-slate-50 border-slate-200 text-slate-700' },
  { flower: 'Lotus', cost: '₹50–₹120/stem', best: 'Pooja thali decorations, floating arrangements, South Indian weddings', why: 'Sacred significance in Hindu and Buddhist weddings. Floats beautifully in uruli brass bowls. Uniquely Indian and deeply meaningful.', seasonal: 'June–September, limited availability', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { flower: 'Carnation', cost: '₹10–₹25/stem', best: 'Bulk fill, table centrepieces, boutonnieres', why: 'Longest-lasting cut flower (2 weeks). Available in every colour. Ideal for large quantity needs where rose prices would blow the budget.', seasonal: 'Year-round, best October–February', color: 'bg-red-50 border-red-200 text-red-700' },
  { flower: 'Sunflower', cost: '₹40–₹80/stem', best: 'Haldi décor, boho mandaps, vibrant reception centrepieces', why: 'Bold, cheerful, distinctly beautiful. Makes an immediate statement in limited quantity. Works perfectly for rustic and boho aesthetics.', seasonal: 'October–March peak', color: 'bg-amber-50 border-amber-200 text-amber-700' },
];

// Lighting guide
const LIGHTING_TYPES = [
  { type: 'Fairy Lights / String Lights', cost: '₹5,000–₹20,000', impact: '⭐⭐⭐⭐⭐', when: 'Outdoor/garden functions, ceiling treatments, mehendi canopy, boho setups. Creates warm, romantic ambience at minimal cost.' },
  { type: 'LED Uplighting (coloured)', cost: '₹15,000–₹50,000', impact: '⭐⭐⭐⭐⭐', when: 'Wall uplighting for reception and sangeet. Transforms blank walls into colour washes — complete venue transformation for the investment.' },
  { type: 'Pin Spotlights', cost: '₹10,000–₹30,000', impact: '⭐⭐⭐⭐', when: 'Focus spotlight on mandap, centrepieces, and stage. Makes flowers and décor "pop" for photography. Essential for mandap photography.' },
  { type: 'Gobos (pattern projectors)', cost: '₹15,000–₹40,000', impact: '⭐⭐⭐⭐', when: 'Projects monogram, florals, or patterns on walls, floor, ceiling. Very photogenic — guests and photographers both love these.' },
  { type: 'Chandeliers (real/faux)', cost: '₹20,000–₹1,50,000', impact: '⭐⭐⭐⭐', when: 'Reception ceiling focal point. Hung over the stage or dance floor. Creates immediate luxury impression. Rentable from décor companies.' },
  { type: 'Candles / Tea Lights', cost: '₹3,000–₹15,000', impact: '⭐⭐⭐⭐', when: 'Table centrepieces, aisle lining, reception atmosphere. Creates the warmest, most intimate lighting possible — unbeatable for evening receptions.' },
  { type: 'Neon Signs', cost: '₹8,000–₹25,000', impact: '⭐⭐⭐', when: 'Couple\'s initials, hashtag, or a short phrase. Extremely popular 2026 trend. Works as the backdrop focal point for the couple\'s stage.' },
];

// Colour palettes 2026
const COLOUR_PALETTES = [
  { name: 'Dusty Blush & Sage', hex: ['#D4A5A5', '#9CAF88', '#F5EFE8'], trending: true, desc: 'The quietluxury palette of 2026. Soft, sophisticated, works beautifully in natural light. Pairs with neutral linens and greenery.' },
  { name: 'Deep Jewel Tones', hex: ['#6B2D5E', '#1B4F72', '#5B3000'], trending: true, desc: 'Emerald, burgundy, sapphire — rich and dramatic for evening functions. Gold metallic accents complete the look.' },
  { name: 'Classic Red & Gold', hex: ['#8B0000', '#FFD700', '#FFFFF0'], trending: false, desc: 'The eternal Indian wedding palette. Timeless and deeply cultural. Still the most widely chosen by traditional families.' },
  { name: 'Peach & Coral Ombre', hex: ['#FFCBA4', '#FF6B6B', '#FFF0E8'], trending: true, desc: 'Warm and photogenic — works beautifully from mehendi through reception. Very popular for summer and beach weddings.' },
  { name: 'Ivory & Gold Minimalist', hex: ['#FFFFF0', '#CFB53B', '#D2C8C8'], trending: true, desc: 'The quiet luxury minimalist palette — no colour, all texture and metallic. Extremely photogenic, feels elevated and modern.' },
  { name: 'Marigold & Fuschia', hex: ['#FF9900', '#FF007F', '#FFF200'], trending: false, desc: 'The classic Rajasthani palette — bold, unapologetic, vibrantly Indian. Suits large outdoor weddings and heritage venues.' },
];

// Cost breakdown
const COST_BY_SCALE = [
  {
    tier: 'Budget', range: '₹2L – ₹4L', guests: '100–250', per: 'for the main wedding day + basic mehendi',
    includes: ['Simple floral mandap (local flowers)', 'Basic stage with fabric backdrop', 'Marigold canopy/backdrop for mehendi', 'String light ceiling treatment', 'Simple table flowers'],
    avoid: 'Imported flowers, elaborate hanging installations, professional lighting rigs',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700',
  },
  {
    tier: 'Standard', range: '₹6L – ₹12L', guests: '200–400', per: 'for all 4 functions (mehendi, haldi, wedding, reception)',
    includes: ['Premium floral mandap with mix of flowers', 'Decorated stage for wedding + reception', 'Entrance arch + aisle décor', 'Coloured LED uplighting for sangeet/reception', 'Matching centrepieces across all tables'],
    avoid: 'Acrylic mandaps, hanging flower installations, live plant walls',
    color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', text: 'text-sky-700',
  },
  {
    tier: 'Mid-Premium', range: '₹12L – ₹20L', guests: '300–500', per: 'for all 5 functions including sangeet',
    includes: ['Designer mandap (geometric/acrylic/premium floral)', 'Full stage production with lighting', 'Floral tunnel entrance', 'Hanging ceiling installations', 'Coordinated decor across all 5 functions', 'Pin spots + gobos + chandeliers'],
    avoid: 'None — everything is possible; focus on quality over quantity',
    color: 'from-violet-500 to-purple-700', bg: 'bg-violet-50', text: 'text-violet-700',
  },
  {
    tier: 'Premium', range: '₹20L – ₹50L+', guests: '400–800', per: 'for multi-day wedding across all functions',
    includes: ['Custom designer mandap', 'LED wall + digital stage productions', 'Drone light show', 'Live floral installations', 'Projection mapping on mandap/walls', 'Full venue transformation across all functions'],
    avoid: 'Nothing — pure vision execution',
    color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700',
  },
];

// Cost by function (per function, standalone)
const COST_PER_FUNCTION = [
  { fn: 'Mehendi', budget: '₹50K–₹2L', standard: '₹1.5L–₹4L', premium: '₹4L–₹10L' },
  { fn: 'Haldi', budget: '₹20K–₹80K', standard: '₹80K–₹2L', premium: '₹2L–₹5L' },
  { fn: 'Sangeet', budget: '₹1L–₹3L', standard: '₹3L–₹8L', premium: '₹8L–₹20L' },
  { fn: 'Wedding Ceremony', budget: '₹1.5L–₹4L', standard: '₹4L–₹12L', premium: '₹12L–₹30L' },
  { fn: 'Reception', budget: '₹1L–₹3L', standard: '₹3L–₹10L', premium: '₹10L–₹25L' },
];

// Save money tips
const SAVE_TIPS = [
  { tip: 'Use local seasonal flowers for bulk fill — save imported blooms for the focal point only', saving: 'Save 30–40%', detail: 'A mandap built with local marigolds, tuberose, and carnations as the fill and orchids only at the top focal point photographs identically to an all-orchid mandap at 40% of the cost.' },
  { tip: 'Repurpose flowers across functions — plan a flow from earlier to later functions', saving: 'Save 15–25%', detail: 'Fresh flowers from mehendi can be refreshed and reused for haldi the next day. Phoolon ki chaadar flowers move to mandap decorations. A decorator who plans repurposing reduces your flower bill significantly.' },
  { tip: 'Invest in lighting rather than flowers for evening functions', saving: 'Save 20–35%', detail: 'For sangeet and reception (evening functions), ₹1L in lighting beats ₹1L in flowers every time. Flowers fade under harsh lighting; great lighting makes ₹50K of flowers look like ₹2L.' },
  { tip: 'Rent your mandap structure — don\'t buy or custom-build', saving: 'Save 40–60% on structure', detail: 'Most professional decorators have a library of mandap frames, acrylic structures, and backdrops available for rent. Insisting on a custom-built mandap adds enormously to the cost with often zero visible benefit.' },
  { tip: 'Book your decorator 6–8 months in advance — early booking gets you priority pricing', saving: 'Save 10–20%', detail: 'Decorators charge peak-season premiums (November–February, May). Booking early locks in off-peak rates and prevents last-minute premium charges. Never book a decorator within 6 weeks of the wedding.' },
  { tip: 'Negotiate a multi-function package for all 4–5 functions with one decorator', saving: 'Save 15–25%', detail: 'A decorator doing 4 functions at your wedding has significantly lower mobilisation and logistics costs than individual vendors for each. Ask for a package discount of at least 15% for the full wedding package.' },
  { tip: 'Source flowers directly from wholesale markets — not through the decorator', saving: 'Save 20–40% on florals', detail: 'Ask your decorator if you can source flowers from the wholesale mandai (flower market) directly and supply them on the day. The decorator marks up flowers by 40–100%. This works best for bulk flowers (marigold, rose).' },
  { tip: 'Use pampas grass, dried botanicals, and potted plants as cost-effective alternatives', saving: 'Save 30–50% on fills', detail: 'Pampas grass, dried palm leaves, potted ferns, and dried lunaria are fraction-of-the-cost alternatives to fresh flower fills. They last longer, photograph beautifully, and are increasingly trendy in 2026.' },
];

// Mistakes
const MISTAKES = [
  { m: 'Over-decorating smaller functions to match the wedding day', r: 'Haldi and mehendi don\'t need ₹3L of décor. They are intimate, joyful functions where a simple marigold setup creates a better atmosphere than an over-designed one. Most overspending happens when the same decorator treats every function like the main wedding.' },
  { m: 'Underinvesting in lighting and overinvesting in flowers', r: 'For evening functions, lighting is décor. A ₹50K lighting rig makes ₹40K of flowers look extraordinary. The same ₹90K spent only on flowers for an evening function will look flat in photographs.' },
  { m: 'Not visiting the venue with the decorator before finalising the décor plan', r: 'A decorator who designs your decor without seeing the venue will miss ceiling height, column placements, natural light direction, and load-bearing points for hanging installations. Always do a site visit together.' },
  { m: 'Choosing a decorator based solely on Instagram portfolio', r: 'Instagram only shows the best angles of the best weddings. Ask for references from the past 3 months and speak to at least 2 couples whose weddings they decorated. Ask specifically: "Did the final look match what was quoted? Were there hidden charges?"' },
  { m: 'Accepting a quote that\'s lump-sum without line items', r: 'A professional decorator will give you a line-item quote: mandap structure, floral cost, lighting, labour, setup/teardown. A lump-sum quote with no breakdown is a red flag — you cannot identify where costs are inflated or what\'s being cut.' },
  { m: 'Booking the decorator too close to the wedding date', r: 'Good decorators in Mumbai, Delhi, and Bengaluru are booked 6–10 months in advance for peak season (November–February). If you\'re booking 2–3 months before, you get the decorators who couldn\'t fill their calendar — not the ones you saw on Instagram.' },
];

const FAQS = [
  {
    q: 'How much does wedding decoration cost in India in 2026?',
    a: 'Decoration costs for a standard Indian wedding (300–500 guests, 4–5 functions) range from: ₹2–4 lakh for budget (main wedding day + simple mehendi), ₹6–12 lakh for standard (all 4 functions), ₹12–20 lakh for mid-premium (all 5 functions with professional lighting), and ₹20–50 lakh+ for premium multi-day weddings. Decoration typically represents 20–30% of the total wedding budget.',
  },
  {
    q: 'What is the cost of mandap decoration in India?',
    a: 'Mandap decoration costs range from ₹40,000 for a simple local-flower setup to ₹2,00,000 for a premium floral mandap, ₹3,50,000–₹4,50,000 for designer mandaps (acrylic, geometric, custom), and up to ₹8,00,000+ for luxury custom builds. The most popular range in 2026 is ₹80,000–₹2,50,000 for a full floral arch mandap with mixed local and imported flowers.',
  },
  {
    q: 'What is the most popular mandap style for Indian weddings in 2026?',
    a: 'The floral arch mandap is the most popular style in 2026 — an open structure with cascading flowers (roses, orchids, seasonal blooms) forming the canopy and columns. The geometric modern mandap is the fastest-rising style, particularly among urban and contemporary couples. The eco-friendly bamboo/sustainable mandap is emerging strongly as environmental consciousness grows.',
  },
  {
    q: 'Which flowers are best for Indian wedding decoration?',
    a: 'For cost-effective bulk fill: marigolds (₹30–60/kg), carnations (₹10–25/stem), tuberose (₹15–30/stem). For focal statement elements: roses (₹8–25/stem for Indian, ₹60–150 for imported), orchids (₹80–200/stem). For fragrance: mogra/jasmine (non-negotiable for traditional weddings). The golden rule: use local seasonal flowers for 70% of the volume and reserve imported flowers for 30% at focal points.',
  },
  {
    q: 'Should I invest more in flowers or lighting?',
    a: 'For daytime functions (mehendi, haldi, wedding ceremony): flowers dominate because natural light makes them beautiful. For evening functions (sangeet, reception): lighting is more impactful than flowers. Great lighting for sangeet and reception consistently produces better photographs and guest experience than the equivalent budget spent on flowers after 7 PM.',
  },
  {
    q: 'How far in advance should I book a wedding decorator?',
    a: 'For peak season dates (November–February, May): book 6–9 months in advance. Top decorators in major cities are fully booked for the entire November–February wedding season by June–July. For off-peak dates: 3–4 months minimum. Never book a decorator less than 6 weeks before the wedding — you will be left with whoever has availability, not whoever is good.',
  },
  {
    q: 'How can I cut wedding décor costs without compromising the look?',
    a: 'The four highest-impact ways to cut décor costs: (1) Use local seasonal flowers for bulk fill, reserve imports only for focal points — saves 30–40% on florals; (2) Invest in lighting rather than flower quantity for evening functions — same budget, dramatically better results; (3) Negotiate a multi-function package with one decorator — typically 15–25% cheaper than individual bookings; (4) Source bulk flowers directly from wholesale flower markets — eliminates the decorator\'s 40–100% markup on florals.',
  },
  {
    q: 'What are the 2026 trending colour palettes for Indian weddings?',
    a: 'The five most popular 2026 wedding colour palettes in India are: (1) Dusty blush and sage — the "quiet luxury" palette; (2) Deep jewel tones — emerald, burgundy, sapphire for evening functions; (3) Peach and coral ombre — warm, photogenic, beach-wedding friendly; (4) Ivory and gold minimalist — no colour, all texture and metallic; (5) Classic red and gold — timeless and still the most widely chosen by traditional families.',
  },
];

// ─── Components ───────────────────────────────────────────────────────────────
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

// ─── Main Component ────────────────────────────────────────────────────────────
export function IndianWeddingDecorGuideArticle({ post, readTime, copied, onShare, affiliateHref, affiliateCtaLabel }) {
  const [openFaq, setOpenFaq]           = useState(-1);
  const [showToc, setShowToc]           = useState(false);
  const [activeFunction, setActiveFn]   = useState('wedding');
  const [activeMandap, setActiveMandap] = useState(null);

  const activeFnData = FUNCTION_DECOR.find(f => f.id === activeFunction);

  useEffect(() => {
    setFaqPageJsonLd(FAQS);
    return () => clearFaqPageJsonLd();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f8]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-rose-400/15 to-pink-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-violet-200/20 blur-3xl" />
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
            <span className="text-rose-gold font-semibold">Wedding Planning</span>
            <ChevronRight className="w-3 h-3" />
            <span>Decoration Guide</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-rose-gold/30 shadow-sm mb-6">
            <Flower2 className="w-4 h-4 text-rose-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-gold">2026 Guide · Mandap · Flowers · Budget</span>
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.08] mb-4">
            Indian Wedding{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-gold via-plum to-violet-600">
              Decoration Guide
            </span>
          </h1>
          <p className="text-base text-rose-gold font-semibold mb-5">
            Mandap Styles · Function Décor · Flowers · Lighting · Cost Breakdown · 2026
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[
              { icon: '🏛️', label: '8 mandap styles' },
              { icon: '🌿', label: 'Function-wise décor' },
              { icon: '🌸', label: 'Flower guide' },
              { icon: '💡', label: 'Lighting tips' },
              { icon: '💰', label: 'Cost breakdown' },
              { icon: '✂️', label: '8 money-saving hacks' },
            ].map(p => (
              <span key={p.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-rose-gold/20 text-gray-700 text-xs font-semibold shadow-sm">
                {p.icon} {p.label}
              </span>
            ))}
          </div>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Décor is 20–35% of your wedding budget and the first thing guests see, photograph,
            and remember. Getting it right means knowing which elements to invest in, which to
            scale back, and how to make every rupee visible on the day.
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
            <img src={ensureHttps(post.featured_image)} alt="Indian wedding decoration ideas — mandap, flowers, and decor guide 2026"
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

        {/* WHY DECOR */}
        <section id="why-decor">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-rose-gold/20 via-plum/15 to-violet-300/15 rounded-[2rem] blur-xl opacity-60" />
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-white via-white to-rose-50/60 border border-rose-100/80 p-8 md:p-10 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-rose-gold shrink-0" />
                The décor mindset that separates beautiful weddings from memorable ones
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Decoration is the first thing every guest sees when they arrive, the backdrop
                of every photograph taken that day, and the setting within which all the
                rituals unfold. At 20–30% of the total wedding budget, it is the second or
                third largest expense — and the one where the most money is routinely wasted.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                The shift in 2026 is away from <em>maximalist volume</em> — the era of
                flowers-on-every-surface — toward <strong>intentional focal points</strong>:
                one extraordinary mandap, one dramatic entrance, and lighting that transforms
                everything else. Fewer elements, chosen with precision, consistently outperform
                elaborate setups spread too thin.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                This guide will help you decide which elements deserve your budget, which can
                be scaled back without anyone noticing, and how to get décor that looks
                worth twice what you spent.
              </p>
            </div>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: '📸', title: 'Every photo has décor in the frame', desc: 'Decoration is in the background of 100% of your wedding photographs. It is the most photographed element of the entire day.' },
              { icon: '💰', title: '20–30% of total wedding budget', desc: 'For a ₹20L wedding, décor is ₹4–6L. Understanding where it goes prevents the most common form of wedding overspending.' },
              { icon: '🎯', title: 'Focal points beat volume every time', desc: 'One extraordinary mandap, one dramatic entrance, and good lighting photographs better than flowers spread thinly across the entire venue.' },
            ].map(c => (
              <div key={c.title} className="flex flex-col gap-2 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <span className="text-3xl">{c.icon}</span>
                <p className="font-semibold text-gray-900">{c.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <CtaSignup headline="Tracking your wedding décor budget? Wedora keeps it all organised."
          sub="Budget planner, vendor tracker, checklist — free wedding planning tools." />

        {/* MANDAP STYLES */}
        <section id="mandap">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Mandap designs — 8 styles for 2026</h2>
              <p className="text-gray-500 text-sm mt-0.5">Click any style to see cost, best use, and expert tip.</p>
            </div>
          </div>

          <div className="space-y-3">
            {MANDAP_STYLES.map((style, i) => (
              <div key={style.name}
                onClick={() => setActiveMandap(activeMandap === i ? null : i)}
                className={`rounded-2xl border overflow-hidden cursor-pointer transition-all hover:shadow-md ${activeMandap === i ? 'border-rose-gold/40 shadow-md' : 'border-gray-100 bg-white shadow-sm'}`}>
                <div className={`flex items-center justify-between px-5 py-4 ${activeMandap === i ? 'bg-rose-50/50' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{style.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">{style.name}</p>
                        <span className="text-xs font-semibold text-rose-gold bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">{style.trend}</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">{style.desc.substring(0, 70)}…</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block text-xs font-bold text-emerald-600">{style.cost}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${activeMandap === i ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {activeMandap === i && (
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-3">
                    <p className="text-gray-600 text-sm leading-relaxed">{style.desc}</p>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-rose-50 rounded-xl p-3">
                        <p className="font-bold text-rose-700 mb-1">💰 Cost range</p>
                        <p className="text-rose-800 font-semibold">{style.cost}</p>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-3">
                        <p className="font-bold text-violet-700 mb-1">✅ Best for</p>
                        <p className="text-violet-800 leading-relaxed">{style.bestFor}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3">
                        <p className="font-bold text-amber-700 mb-1">💡 Expert tip</p>
                        <p className="text-amber-800 leading-relaxed">{style.tip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FUNCTION DECOR — INTERACTIVE */}
        <section id="function">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Function-wise décor ideas</h2>
              <p className="text-gray-500 text-sm mt-0.5">Select a function to see the recommended décor elements and budget range.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {FUNCTION_DECOR.map(fn => (
              <button key={fn.id} type="button" onClick={() => setActiveFn(fn.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                  activeFunction === fn.id
                    ? `bg-gradient-to-r ${fn.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                <span>{fn.emoji}</span>{fn.label}
              </button>
            ))}
          </div>

          {activeFnData && (
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className={`px-5 py-4 bg-gradient-to-r ${activeFnData.color} text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeFnData.emoji}</span>
                  <div>
                    <p className="font-serif font-bold text-xl">{activeFnData.label} — Décor Guide</p>
                    <p className="text-white/80 text-sm">{activeFnData.timing} · {activeFnData.vibe}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {activeFnData.elements.map(el => (
                  <div key={el.item} className={`flex gap-3 p-3.5 rounded-xl ${activeFnData.bg} border ${activeFnData.border}`}>
                    <span className={`font-bold text-xs uppercase tracking-wider ${activeFnData.text} shrink-0 w-24 pt-0.5`}>{el.item}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{el.detail}</p>
                  </div>
                ))}

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1 bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-emerald-700 mb-1">💰 Budget range</p>
                    <p className="text-emerald-800 font-bold text-sm">{activeFnData.budget}</p>
                  </div>
                  <div className="flex-1 bg-amber-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-amber-700 mb-1">💡 Save tip</p>
                    <p className="text-amber-800 text-xs leading-relaxed">{activeFnData.saveTip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <CtaTool icon={IndianRupee} headline="Use Wedora's budget calculator to plan your décor spend"
          sub="Allocate your total wedding budget across décor, catering, venue, photography and more."
          btnLabel="Open budget calculator" btnTo="/blog/wedding-budget-calculator-how-to-allocate-money"
          color={{ bg: 'bg-emerald-50', border: 'border-emerald-200', grad: 'from-emerald-500 to-teal-600', title: 'text-emerald-900' }} />

        {/* FLOWERS */}
        <section id="flowers">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Flower guide — best blooms for every budget</h2>
              <p className="text-gray-500 text-sm mt-0.5">Cost, best use, and what makes each flower worth it.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">Flower</th>
                    <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Cost</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">Best for</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">Why it works</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {FLOWERS.map((row, i) => (
                    <tr key={row.flower} className={`hover:bg-rose-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.flower}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 whitespace-nowrap text-xs">{row.cost}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed hidden sm:table-cell">{row.best}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed hidden md:table-cell">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 p-5 rounded-2xl bg-rose-50 border border-rose-200/60">
            <Lightbulb className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900 mb-1">The 70/30 flower rule</p>
              <p className="text-rose-800 text-sm leading-relaxed">
                Use <strong>local seasonal flowers for 70%</strong> of the total volume (marigolds, carnations, tuberose) and
                <strong className="ml-1">imported or premium flowers for 30%</strong> at focal visual points only (orchids at the mandap top, imported roses for the bridal bouquet).
                At viewing distance, guests and photographers cannot tell the difference between a carnation fill and a rose fill.
                The 70/30 rule consistently saves 35–45% on the total flower budget.
              </p>
            </div>
          </div>
        </section>

        {/* LIGHTING */}
        <section id="lighting">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">Lighting — the most underrated décor element</h2>
              <p className="text-gray-500 text-sm mt-0.5">What each type costs and when it creates the most impact.</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {LIGHTING_TYPES.map(l => (
              <div key={l.type} className="flex gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-amber-200/60 transition-all">
                <div className="shrink-0 text-center min-w-[52px]">
                  <p className="text-2xl mb-1">💡</p>
                  <p className="text-[10px] text-amber-600 font-bold">{l.impact}</p>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{l.type}</p>
                    <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">{l.cost}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{l.when}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200/60">
            <Zap className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-1">The lighting principle that transforms weddings</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                For evening functions, allocate at minimum 20–25% of the total décor budget for that function to lighting.
                A reception with ₹80,000 in lighting and ₹1,20,000 in flowers will photograph more beautifully than one
                with ₹2,00,000 in flowers and no professional lighting. Every ₹1 spent on lighting at night produces
                more visible return than ₹1 spent on flowers.
              </p>
            </div>
          </div>
        </section>

        {/* COLOUR PALETTES */}
        <section id="colour">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">2026 colour palettes & themes</h2>
              <p className="text-gray-500 text-sm mt-0.5">The 6 dominant colour directions for Indian weddings this year.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {COLOUR_PALETTES.map(p => (
              <div key={p.name} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-1.5 shrink-0 mt-1">
                  {p.hex.map(h => (
                    <div key={h} className="w-6 h-16 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: h }} />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{p.name}</p>
                    {p.trending && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200/60 px-1.5 py-0.5 rounded-full">📈 Trending</span>}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
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
              <p className="text-gray-500 text-sm mt-0.5">By scale and by individual function — realistic market data.</p>
            </div>
          </div>

          {/* By scale */}
          <h3 className="font-serif font-bold text-lg text-gray-900 mb-4">By total wedding scale</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {COST_BY_SCALE.map(tier => (
              <div key={tier.tier} className={`rounded-2xl border-2 ${tier.bg} overflow-hidden`}>
                <div className={`px-5 py-4 bg-gradient-to-r ${tier.color} text-white`}>
                  <p className="font-bold text-lg">{tier.tier}</p>
                  <p className="text-white/80 text-sm">{tier.range} · {tier.guests} guests · {tier.per}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">What's included</p>
                  <ul className="space-y-1 mb-3">
                    {tier.includes.map(item => (
                      <li key={item} className="flex gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                  {tier.avoid !== 'Nothing — pure vision execution' && (
                    <p className="text-xs text-gray-500"><span className="font-bold text-amber-600">Skip:</span> {tier.avoid}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Per function */}
          <h3 className="font-serif font-bold text-lg text-gray-900 mb-4">Per function cost (standalone)</h3>
          <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-left">
                    <th className="px-4 py-3.5 font-semibold">Function</th>
                    <th className="px-4 py-3.5 font-semibold">Budget</th>
                    <th className="px-4 py-3.5 font-semibold hidden sm:table-cell">Standard</th>
                    <th className="px-4 py-3.5 font-semibold hidden md:table-cell">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {COST_PER_FUNCTION.map((row, i) => (
                    <tr key={row.fn} className={`hover:bg-emerald-50/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.fn}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium">{row.budget}</td>
                      <td className="px-4 py-3 text-sky-600 font-medium hidden sm:table-cell">{row.standard}</td>
                      <td className="px-4 py-3 text-violet-600 font-medium hidden md:table-cell">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DECORATOR GUIDE */}
        <section id="decorator">
          <div className="rounded-[1.75rem] overflow-hidden border-2 border-sky-200/80 bg-gradient-to-br from-sky-50 to-blue-50/40 shadow-xl">
            <div className="px-6 py-4 bg-sky-100/80 border-b border-sky-200 flex items-center gap-3">
              <Users className="w-7 h-7 text-sky-700" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-sky-950">Choosing & managing your decorator</h2>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              {[
                { q: 'Review their real portfolio — not just hero shots', a: 'Instagram shows the best angle of the best weddings. Request 2–3 complete wedding galleries (not highlight reels) and ask to see work for your budget range and venue type. The difference between "our luxury work" and "work at your budget" is often significant.' },
                { q: 'Always ask for a line-item quote', a: 'A professional decorator will break down: mandap structure, floral cost (type and quantity), lighting, stage, centrepieces, labour, setup/teardown. A lump-sum quote with no breakdown hides where you\'re being charged 3× the actual cost.' },
                { q: 'Do a venue walkthrough with your decorator before finalising anything', a: 'The decorator must see your venue before designing the décor plan. Ceiling height, column positions, natural light direction, and venue restrictions (no nails, no anchoring) all dramatically affect what\'s possible and what costs more.' },
                { q: 'Negotiate a multi-function package', a: 'If the same decorator is handling mehendi, wedding, and reception, their logistics and mobilisation costs drop significantly. Ask for 15–20% off the total for a package booking. This is standard practice and most decorators will agree.' },
                { q: 'Confirm the decorator\'s own team vs outsourced labour', a: 'Ask directly: "Will your own team execute this, or will you subcontract?" Subcontracted labour teams (common with busy decorators in peak season) have inconsistent quality. The beautiful portfolio may be their work; your wedding may be executed by a contractor.' },
              ].map(item => (
                <div key={item.q} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sky-950 mb-1">{item.q}</p>
                    <p className="text-sky-800/80 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAVE MONEY */}
        <section id="save">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900">8 ways to cut décor costs without showing it</h2>
              <p className="text-gray-500 text-sm mt-0.5">Each saves 15–50% on that specific element.</p>
            </div>
          </div>

          <div className="space-y-3">
            {SAVE_TIPS.map(item => (
              <div key={item.tip} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-emerald-200/60 hover:shadow-md transition-all">
                <span className="shrink-0 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold whitespace-nowrap">{item.saving}</span>
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
              <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950">Mistakes that drain décor budgets</h2>
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

        <CtaSignup headline="Ready to plan your wedding décor? Start tracking it all on Wedora."
          sub="Budget planner, vendor tracker, and checklist — your complete free wedding planning toolkit." />

        {/* RELATED */}
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <Star className="w-5 h-5 text-rose-gold" fill="currentColor" />
              <p className="font-serif font-bold text-gray-900">More wedding planning guides on Wedora</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Indian Wedding Budget Guide 2026', slug: 'indian-wedding-budget-guide-2026', icon: '💰' },
                { title: 'Wedding Budget Calculator', slug: 'wedding-budget-calculator-how-to-allocate-money', icon: '🧮' },
                { title: 'Indian Wedding Catering Guide 2026', slug: 'indian-wedding-catering-guide-cost-menu-tips', icon: '🍛' },
                { title: 'Hindu Wedding Muhurat Dates 2026 & 2027', slug: 'hindu-wedding-muhurat-dates-2026-2027', icon: '🗓️' },
                { title: 'Wedding Photography Checklist: 50 Must-Have Shots', slug: 'wedding-photography-checklist-must-have-shots', icon: '📷' },
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
              Plan your entire wedding on Wedora — completely free
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
              From décor budget planning to vendor tracking, muhurat calendar to WhatsApp
              invitations — every tool you need in one place, all free.
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
            Every question Indian couples ask about wedding decoration — answered with real 2026 data.
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
            One extraordinary mandap beats a hundred ordinary arrangements
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            The best-decorated weddings are not the most expensive ones — they are the ones
            where every rupee is spent on what guests actually see and photograph. Choose
            your mandap style deliberately. Invest in lighting for evening functions.
            Apply the 70/30 flower rule. Negotiate a multi-function package.
            And book your decorator six months before, not six weeks.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Wedding decoration guide</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Mandap design 2026</span>
            <span className="px-3 py-1 rounded-full bg-white border border-gray-100">Free budget planner</span>
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
