// Mock data for development — replace with Supabase calls later

export const WEDDING_DATA = {
  id: 'w1',
  partner1: 'Priya',
  partner2: 'Rahul',
  weddingDate: '2026-12-15',
  location: 'Udaipur, Rajasthan',
  totalBudget: 2500000,
};

export const BUDGET_CATEGORIES = [
  { id: 'b1', name: 'Venue & Reception', icon: '🏛️', color: '#c0392b', allocated: 625000, spent: 200000 },
  { id: 'b2', name: 'Photography & Video', icon: '📸', color: '#e67e22', allocated: 300000, spent: 150000 },
  { id: 'b3', name: 'Flowers & Decoration', icon: '💐', color: '#f1c40f', allocated: 250000, spent: 80000 },
  { id: 'b4', name: 'Jewellery', icon: '💍', color: '#2ecc71', allocated: 375000, spent: 375000 },
  { id: 'b5', name: 'Attire & Grooming', icon: '👗', color: '#9b59b6', allocated: 250000, spent: 120000 },
  { id: 'b6', name: 'Music & Entertainment', icon: '🎵', color: '#3498db', allocated: 125000, spent: 0 },
  { id: 'b7', name: 'Invitations', icon: '💌', color: '#e84393', allocated: 75000, spent: 50000 },
  { id: 'b8', name: 'Gifts & Favours', icon: '🎁', color: '#1abc9c', allocated: 125000, spent: 30000 },
  { id: 'b9', name: 'Transport', icon: '🚗', color: '#636e72', allocated: 125000, spent: 0 },
  { id: 'b10', name: 'Miscellaneous', icon: '📋', color: '#6c5ce7', allocated: 250000, spent: 45000 },
];

export const EXPENSES = [
  { id: 'e1', categoryId: 'b1', name: 'Venue Booking - Taj Lake Palace', amount: 150000, paid: true, vendor: 'Taj Hotels', notes: 'Confirmed for Dec 15' },
  { id: 'e2', categoryId: 'b1', name: 'Catering Advance', amount: 50000, paid: true, vendor: 'Royal Caterers', notes: '300 guests' },
  { id: 'e3', categoryId: 'b2', name: 'Photographer Booking', amount: 100000, paid: true, vendor: 'Weddings By Knotty', notes: '2 day coverage' },
  { id: 'e4', categoryId: 'b2', name: 'Drone Videography', amount: 50000, paid: true, vendor: 'SkyView Films', notes: 'Includes editing' },
  { id: 'e5', categoryId: 'b3', name: 'Stage Decoration', amount: 50000, paid: true, vendor: 'Bloom Studio', notes: '' },
  { id: 'e6', categoryId: 'b3', name: 'Floral Arrangements', amount: 30000, paid: false, vendor: 'Bloom Studio', notes: 'Roses & Marigold' },
  { id: 'e7', categoryId: 'b4', name: 'Bridal Jewellery Set', amount: 300000, paid: true, vendor: 'Tanishq', notes: 'Gold + Diamond' },
  { id: 'e8', categoryId: 'b4', name: 'Wedding Rings', amount: 75000, paid: true, vendor: 'CaratLane', notes: '' },
  { id: 'e9', categoryId: 'b5', name: 'Bridal Lehenga', amount: 80000, paid: true, vendor: 'Sabyasachi', notes: '' },
  { id: 'e10', categoryId: 'b5', name: 'Groom Sherwani', amount: 40000, paid: false, vendor: 'Manyavar', notes: '' },
  { id: 'e11', categoryId: 'b7', name: 'Wedding Cards (300)', amount: 50000, paid: true, vendor: 'PrintVenue', notes: 'Gold foil cards' },
];

export const GUESTS = [
  { id: 'g1', name: 'Anita Sharma', phone: '9876543210', email: 'anita@email.com', category: 'Family', rsvp: 'accepted', plusOne: true, notes: "Bride's mother" },
  { id: 'g2', name: 'Rajesh Sharma', phone: '9876543211', email: 'rajesh@email.com', category: 'Family', rsvp: 'accepted', plusOne: false, notes: "Bride's father" },
  { id: 'g3', name: 'Vikram Patel', phone: '9876543212', email: 'vikram@email.com', category: 'Family', rsvp: 'accepted', plusOne: true, notes: "Groom's brother" },
  { id: 'g4', name: 'Neha Gupta', phone: '9876543213', email: 'neha@email.com', category: 'Friends', rsvp: 'accepted', plusOne: false, notes: 'College friend' },
  { id: 'g5', name: 'Amit Kumar', phone: '9876543214', email: 'amit@email.com', category: 'Friends', rsvp: 'pending', plusOne: true, notes: '' },
  { id: 'g6', name: 'Sunita Devi', phone: '9876543215', email: 'sunita@email.com', category: 'Family', rsvp: 'accepted', plusOne: false, notes: 'Aunt' },
  { id: 'g7', name: 'Mr. R. K. Mehta', phone: '9876543216', email: 'mehta@email.com', category: 'VIP', rsvp: 'accepted', plusOne: true, notes: 'Family friend — chief guest' },
  { id: 'g8', name: 'Priyanka Singh', phone: '9876543217', email: 'priyanka@email.com', category: 'Friends', rsvp: 'declined', plusOne: false, notes: 'Work colleague' },
  { id: 'g9', name: 'Deepak Joshi', phone: '9876543218', email: 'deepak@email.com', category: 'Friends', rsvp: 'pending', plusOne: false, notes: '' },
  { id: 'g10', name: 'Kavita Reddy', phone: '9876543219', email: 'kavita@email.com', category: 'VIP', rsvp: 'accepted', plusOne: true, notes: 'Business associate' },
  { id: 'g11', name: 'Sanjay Verma', phone: '9876543220', email: 'sanjay@email.com', category: 'Family', rsvp: 'pending', plusOne: false, notes: 'Cousin' },
  { id: 'g12', name: 'Ritu Agarwal', phone: '9876543221', email: 'ritu@email.com', category: 'Friends', rsvp: 'accepted', plusOne: false, notes: '' },
];

export const TASKS = [
  { id: 't1', title: 'Book wedding venue', description: 'Finalize and book the main wedding venue', deadline: '2026-06-01', status: 'completed', priority: 'high' },
  { id: 't2', title: 'Hire photographer', description: 'Select and book wedding photographer', deadline: '2026-07-01', status: 'completed', priority: 'high' },
  { id: 't3', title: 'Send wedding invitations', description: 'Design, print, and distribute wedding cards', deadline: '2026-10-15', status: 'completed', priority: 'high' },
  { id: 't4', title: 'Book wedding caterer', description: 'Finalize menu and book catering service', deadline: '2026-08-01', status: 'in-progress', priority: 'high' },
  { id: 't5', title: 'Order bridal lehenga', description: 'Select and order bridal outfit', deadline: '2026-09-01', status: 'completed', priority: 'high' },
  { id: 't6', title: 'Book wedding car', description: 'Reserve decorated car for wedding day', deadline: '2026-11-01', status: 'pending', priority: 'medium' },
  { id: 't7', title: 'Finalize guest list', description: 'Confirm final headcount', deadline: '2026-10-01', status: 'in-progress', priority: 'high' },
  { id: 't8', title: 'Book mehendi artist', description: 'Hire mehendi artist for sangeet event', deadline: '2026-11-01', status: 'pending', priority: 'medium' },
  { id: 't9', title: 'Arrange accommodation for outstation guests', description: 'Book hotel rooms', deadline: '2026-11-15', status: 'pending', priority: 'medium' },
  { id: 't10', title: 'Plan honeymoon', description: 'Research and book honeymoon destination', deadline: '2026-11-20', status: 'pending', priority: 'low' },
  { id: 't11', title: 'Buy wedding rings', description: 'Select and purchase wedding bands', deadline: '2026-11-01', status: 'completed', priority: 'high' },
  { id: 't12', title: 'Hire DJ/Band for sangeet', description: 'Book entertainment for sangeet night', deadline: '2026-11-10', status: 'pending', priority: 'medium' },
];

export const EVENTS = [
  { id: 'ev1', name: 'Engagement Ceremony', description: 'Ring exchange ceremony with close family', date: '2026-08-20', time: '11:00', location: 'Home — Jaipur' },
  { id: 'ev2', name: 'Mehendi', description: 'Mehendi function with dance and music', date: '2026-12-13', time: '16:00', location: 'Poolside — Taj Lake Palace' },
  { id: 'ev3', name: 'Sangeet Night', description: 'Dance performances, DJ, and dinner', date: '2026-12-14', time: '19:00', location: 'Ballroom — Taj Lake Palace' },
  { id: 'ev4', name: 'Haldi Ceremony', description: 'Traditional haldi ritual', date: '2026-12-15', time: '08:00', location: 'Garden — Taj Lake Palace' },
  { id: 'ev5', name: 'Wedding Ceremony', description: 'Main wedding pheras and rituals', date: '2026-12-15', time: '20:00', location: 'Grand Lawn — Taj Lake Palace' },
  { id: 'ev6', name: 'Reception', description: 'Grand reception dinner', date: '2026-12-16', time: '19:00', location: 'Ballroom — Taj Lake Palace' },
];
