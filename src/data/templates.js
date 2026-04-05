// Default template data for new wedding setups (no mock expenses/guests — fresh start)

export const WEDDING_TYPES = [
  { value: 'hindu', label: 'Hindu Wedding', emoji: '🙏' },
  { value: 'muslim', label: 'Muslim Wedding (Nikah)', emoji: '🌙' },
  { value: 'christian', label: 'Christian Wedding', emoji: '⛪' },
  { value: 'sikh', label: 'Sikh Wedding (Anand Karaj)', emoji: '🪯' },
  { value: 'jain', label: 'Jain Wedding', emoji: '🕉️' },
  { value: 'buddhist', label: 'Buddhist Wedding', emoji: '☸️' },
  { value: 'civil', label: 'Civil / Court Marriage', emoji: '⚖️' },
  { value: 'destination', label: 'Destination Wedding', emoji: '✈️' },
  { value: 'interfaith', label: 'Interfaith Wedding', emoji: '💞' },
  { value: 'other', label: 'Other', emoji: '💍' },
];

export const DEFAULT_BUDGET_CATEGORIES = [
  { name: 'Venue & Reception', icon: '🏛️', color: '#c0392b', pct: 25 },
  { name: 'Catering & Food', icon: '🍽️', color: '#e67e22', pct: 20 },
  { name: 'Photography & Video', icon: '📸', color: '#f39c12', pct: 12 },
  { name: 'Flowers & Decoration', icon: '💐', color: '#27ae60', pct: 10 },
  { name: 'Jewellery', icon: '💍', color: '#2ecc71', pct: 8 },
  { name: 'Attire & Grooming', icon: '👗', color: '#9b59b6', pct: 8 },
  { name: 'Music & Entertainment', icon: '🎵', color: '#3498db', pct: 5 },
  { name: 'Invitations & Stationery', icon: '💌', color: '#e84393', pct: 3 },
  { name: 'Gifts & Favours', icon: '🎁', color: '#1abc9c', pct: 4 },
  { name: 'Transport & Logistics', icon: '🚗', color: '#636e72', pct: 3 },
  { name: 'Miscellaneous', icon: '📋', color: '#6c5ce7', pct: 2 },
];

export const DEFAULT_TASKS = [
  { title: 'Set wedding budget', description: 'Determine total budget and allocate to categories', deadline: -270, priority: 'high' },
  { title: 'Book wedding venue', description: 'Research, visit, and finalize wedding venue', deadline: -240, priority: 'high' },
  { title: 'Hire wedding planner', description: 'If needed, interview and book a wedding coordinator', deadline: -240, priority: 'medium' },
  { title: 'Create guest list', description: 'Draft initial guest list with family', deadline: -210, priority: 'high' },
  { title: 'Book photographer & videographer', description: 'Shortlist and book photography team', deadline: -180, priority: 'high' },
  { title: 'Book caterer', description: 'Finalize menu and book catering service', deadline: -180, priority: 'high' },
  { title: 'Shop for bridal outfit', description: 'Select and order bridal lehenga/saree/gown', deadline: -150, priority: 'high' },
  { title: 'Shop for groom outfit', description: 'Select and order groom sherwani/suit', deadline: -150, priority: 'medium' },
  { title: 'Book mehendi artist', description: 'Find and book mehendi artist for ceremonies', deadline: -120, priority: 'medium' },
  { title: 'Book DJ/Band', description: 'Book entertainment for sangeet and reception', deadline: -120, priority: 'medium' },
  { title: 'Design & order invitations', description: 'Design wedding cards and order printing', deadline: -90, priority: 'high' },
  { title: 'Buy wedding jewellery', description: 'Select and purchase bridal jewellery set', deadline: -90, priority: 'high' },
  { title: 'Send wedding invitations', description: 'Distribute wedding cards to all guests', deadline: -60, priority: 'high' },
  { title: 'Book decorator/florist', description: 'Finalize decoration theme and book florist', deadline: -60, priority: 'medium' },
  { title: 'Arrange guest accommodation', description: 'Book hotel rooms for outstation guests', deadline: -45, priority: 'medium' },
  { title: 'Finalize guest list & RSVP', description: 'Confirm final headcount with RSVPs', deadline: -30, priority: 'high' },
  { title: 'Book wedding car', description: 'Reserve decorated car for wedding day', deadline: -30, priority: 'low' },
  { title: 'Buy wedding rings', description: 'Select and purchase wedding bands', deadline: -30, priority: 'high' },
  { title: 'Plan honeymoon', description: 'Research, book flights and hotel for honeymoon', deadline: -21, priority: 'low' },
  { title: 'Final venue walkthrough', description: 'Visit venue for last check of arrangements', deadline: -7, priority: 'high' },
  { title: 'Confirm all vendors', description: 'Call all vendors to confirm timing and details', deadline: -3, priority: 'high' },
];

export const DEFAULT_EVENTS_HINDU = [
  { name: 'Roka / Engagement', description: 'Formal engagement ceremony', daysBefore: 120, time: '11:00' },
  { name: 'Mehendi', description: 'Mehendi ceremony with music and dance', daysBefore: 2, time: '16:00' },
  { name: 'Sangeet Night', description: 'Dance performances and dinner', daysBefore: 1, time: '19:00' },
  { name: 'Haldi Ceremony', description: 'Traditional haldi ritual', daysBefore: 0, time: '08:00' },
  { name: 'Wedding Ceremony', description: 'Main wedding pheras and rituals', daysBefore: 0, time: '20:00' },
  { name: 'Reception', description: 'Grand reception dinner and celebration', daysBefore: -1, time: '19:00' },
];

export const DEFAULT_EVENTS_GENERIC = [
  { name: 'Engagement Party', description: 'Celebrate the engagement with loved ones', daysBefore: 90, time: '18:00' },
  { name: 'Pre-Wedding Dinner', description: 'Rehearsal dinner with wedding party', daysBefore: 1, time: '19:00' },
  { name: 'Wedding Ceremony', description: 'The main wedding ceremony', daysBefore: 0, time: '16:00' },
  { name: 'Reception', description: 'Wedding reception and celebration', daysBefore: 0, time: '19:00' },
];

export const VENDOR_CATEGORIES = [
  { value: 'venue', label: 'Venue', emoji: '🏛️' },
  { value: 'photographer', label: 'Photographer', emoji: '📸' },
  { value: 'videographer', label: 'Videographer', emoji: '🎬' },
  { value: 'caterer', label: 'Caterer', emoji: '🍽️' },
  { value: 'decorator', label: 'Decorator', emoji: '🎨' },
  { value: 'florist', label: 'Florist', emoji: '💐' },
  { value: 'dj', label: 'DJ / Band', emoji: '🎵' },
  { value: 'mehendi', label: 'Mehendi Artist', emoji: '✋' },
  { value: 'makeup', label: 'Makeup Artist', emoji: '💄' },
  { value: 'jeweller', label: 'Jeweller', emoji: '💍' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'planner', label: 'Wedding Planner', emoji: '📋' },
  { value: 'invitation', label: 'Invitation Designer', emoji: '💌' },
  { value: 'cake', label: 'Cake / Desserts', emoji: '🎂' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export const INSPIRATION_CATEGORIES = [
  'Venue', 'Decor', 'Outfit', 'Jewellery', 'Flowers',
  'Food', 'Cake', 'Invitation', 'Photography', 'Other',
];

// Generate deadline dates relative to wedding date
export function generateTasks(weddingDate) {
  const wd = new Date(weddingDate);
  return DEFAULT_TASKS.map((t, i) => {
    const d = new Date(wd);
    d.setDate(d.getDate() + t.deadline);
    return {
      id: `task_${i}_${Date.now()}`,
      title: t.title,
      description: t.description,
      deadline: d.toISOString().split('T')[0],
      priority: t.priority,
      status: 'pending',
    };
  });
}

// Generate budget categories with allocated amounts
export function generateBudgetCategories(totalBudget) {
  return DEFAULT_BUDGET_CATEGORIES.map((c, i) => ({
    id: `cat_${i}_${Date.now()}`,
    name: c.name,
    icon: c.icon,
    color: c.color,
    allocated: Math.round((totalBudget * c.pct) / 100),
    spent: 0,
  }));
}

// Generate events relative to wedding date
export function generateEvents(weddingDate, weddingType) {
  const wd = new Date(weddingDate);
  const template = weddingType === 'hindu' ? DEFAULT_EVENTS_HINDU : DEFAULT_EVENTS_GENERIC;
  return template.map((ev, i) => {
    const d = new Date(wd);
    d.setDate(d.getDate() - ev.daysBefore);
    return {
      id: `ev_${i}_${Date.now()}`,
      name: ev.name,
      description: ev.description,
      date: d.toISOString().split('T')[0],
      time: ev.time,
      location: '',
    };
  });
}
