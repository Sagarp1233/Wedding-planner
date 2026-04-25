import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, MapPin, Clock, ChevronDown, CheckCircle, 
  XCircle, HelpCircle, Phone, ArrowLeft, Heart, MessageCircle, Map as MapIcon, Compass
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ensureHttps } from '../utils/ensureHttps';

const THEMES = {
  elegant: { primary: '#B76E79', secondary: '#6B2D5E', background: '#FAF8F6', textDark: '#0A0A0A', textLight: '#FFFFFF', isDark: false },
  classic: { primary: '#8B1A1A', secondary: '#5C0E0E', background: '#FFFFF8', textDark: '#0A0A0A', textLight: '#FFFFFF', isDark: false },
  modern: { primary: '#334155', secondary: '#0F172A', background: '#F8FAFC', textDark: '#1E293B', textLight: '#F8FAFC', isDark: false },
  royal: { primary: '#C9A96E', secondary: '#8B7355', background: '#0D1B2A', textDark: '#FFFFFF', textLight: '#0D1B2A', isDark: true },
  floral: { primary: '#D4A5A5', secondary: '#9CAF88', background: '#F5F2EE', textDark: '#2C3E2D', textLight: '#FFFFFF', isDark: false },
  luxury_gold: { primary: '#B8860B', secondary: '#8B6508', background: '#0A0A0A', textDark: '#FFFFFF', textLight: '#0A0A0A', isDark: true },
  minimal_white: { primary: '#1A1A1A', secondary: '#404040', background: '#FFFFFF', textDark: '#1A1A1A', textLight: '#FFFFFF', isDark: false }
};

export default function WeddingWebsitePage() {
  const { weddingSlug } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Layout & UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isPast, setIsPast] = useState(false);
  const [galleryModalImage, setGalleryModalImage] = useState(null);

  // RSVP Form States
  const [rsvpStatus, setRsvpStatus] = useState(''); // 'confirmed', 'declined', 'maybe'
  const [rsvpFormData, setRsvpFormData] = useState({
    guest_name: '', guest_phone: '', guest_email: '', guest_count: 1,
    events_attending: [], meal_preference: 'No Preference',
    guest_side: 'Friend of Bride', message_to_couple: ''
  });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState('');
  const [alreadyRsvped, setAlreadyRsvped] = useState(false);

  useEffect(() => {
    fetchSiteData();
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [weddingSlug]);

  useEffect(() => {
    if (site?.wedding_date) {
      const timer = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [site?.wedding_date]);

  const fetchSiteData = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('wedding_sites')
        .select('*')
        .eq('slug', weddingSlug)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error("Site not found");

      setSite(data);

      // Initialize selected events
      if (data.events && Array.isArray(data.events)) {
        const defaultEvents = data.events
          .filter(e => e.name?.toLowerCase().includes('wedding') || e.name?.toLowerCase().includes('reception'))
          .map(e => e.name);
        setRsvpFormData(prev => ({ ...prev, events_attending: defaultEvents }));
      }

      // Check if logged in user is the owner
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id === data.couple_id) {
        setIsOwner(true);
      }

      // Check LocalStorage for RSVP
      const storedRsvp = localStorage.getItem(`rsvp_${data.id}`);
      if (storedRsvp) {
        setAlreadyRsvped(true);
      }

    } catch (err) {
      console.error(err);
      setError(err.message === "Site not found" ? "not_found" : (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    if (!site?.wedding_date) return;
    const difference = new Date(site.wedding_date) - new Date();
    
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / 1000 / 60) % 60),
        secs: Math.floor((difference / 1000) % 60)
      });
      setIsPast(false);
    } else {
      setIsPast(true);
      setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
    }
  };

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setRsvpError('');
    
    if (!rsvpStatus) {
      setRsvpError("Please select your attendance status.");
      return;
    }

    try {
      setRsvpSubmitting(true);
      const payload = {
        wedding_site_id: site.id,
        guest_name: rsvpFormData.guest_name,
        guest_phone: rsvpFormData.guest_phone,
        guest_email: rsvpFormData.guest_email || null,
        guest_count: parseInt(rsvpFormData.guest_count),
        attendance_status: rsvpStatus,
        events_attending: rsvpFormData.events_attending,
        meal_preference: rsvpFormData.meal_preference,
        guest_side: rsvpFormData.guest_side,
        message_to_couple: rsvpFormData.message_to_couple || null
      };

      // Smart Merge: Check if couple added this guest manually via phone number
      const { data: existingGuest } = await supabase
        .from('rsvp_responses')
        .select('id')
        .eq('wedding_site_id', site.id)
        .eq('guest_phone', rsvpFormData.guest_phone)
        .maybeSingle();

      if (existingGuest) {
        // Update the existing record instead of creating a duplicate
        const { error: updateError } = await supabase
          .from('rsvp_responses')
          .update({
            ...payload,
            is_manual_add: true // Preserve manual flag if it was set
          })
          .eq('id', existingGuest.id);
        if (updateError) throw updateError;
      } else {
        // Insert a new record
        const { error: insertError } = await supabase
          .from('rsvp_responses')
          .insert([payload]);
        if (insertError) throw insertError;
      }

      setRsvpSuccess(true);
      localStorage.setItem(`rsvp_${site.id}`, 'true');
      setAlreadyRsvped(true);
    } catch (err) {
      console.error(err);
      setRsvpError("Something went wrong saving your RSVP. Please try again.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6]">
        <div className="text-center animate-pulse-soft">
          <Heart className="w-12 h-12 text-[#B76E79] mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 font-serif text-xl">Loading Love Story...</p>
        </div>
      </div>
    );
  }

  if (error || !site || (!site.is_published && !isOwner)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F6] text-center px-4">
        <h1 className="text-4xl font-serif text-gray-800 mb-4">Page Not Found</h1>
        {error && error !== 'not_found' ? (
          <p className="text-red-500 mb-8">An error occurred while loading this page: {error}</p>
        ) : (
          <p className="text-gray-600 mb-8">This wedding website either doesn't exist or isn't published yet.</p>
        )}
        <Link to="/" className="px-6 py-3 bg-[#0D1B2A] text-white rounded-full font-medium hover:bg-opacity-90 transition">
          Return to Wedora
        </Link>
      </div>
    );
  }

  const themeConfig = THEMES[site.theme] || THEMES.elegant;
  const isDark = themeConfig.isDark;
  
  // Custom properties for overriding index.css tokens
  const styleVars = {
    '--color-rose-gold': themeConfig.primary,
    '--color-plum': themeConfig.secondary,
    '--bg-color': themeConfig.background,
    '--text-dark': themeConfig.textDark,
    '--text-light': themeConfig.textLight,
    backgroundColor: 'var(--bg-color)',
    color: isDark ? 'var(--text-light)' : 'var(--text-dark)'
  };

  const formattedDate = site.wedding_date 
    ? new Intl.DateTimeFormat('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(site.wedding_date))
    : '';

  const rsvpDeadline = site.rsvp_deadline ? new Date(site.rsvp_deadline) : null;
  const isRsvpClosed = rsvpDeadline && rsvpDeadline < new Date();
  const daysToDeadline = rsvpDeadline ? Math.max(0, Math.ceil((rsvpDeadline - new Date()) / (1000 * 60 * 60 * 24))) : null;
  const rsvpClosingSoon = daysToDeadline !== null && daysToDeadline <= 7 && daysToDeadline > 0;

  const hasHeroImage = !!(site.hero_image_url && site.hero_image_url.trim().startsWith('http'));

  return (
    <div style={styleVars} className={`min-h-screen font-sans ${`theme-${site.theme}`}`}>
      <Helmet>
        <title>{site.bride_name} & {site.groom_name} — {formattedDate} | Wedora</title>
        <meta name="description" content={`Join ${site.bride_name} & ${site.groom_name} as they celebrate their wedding. RSVP online.`} />
        <meta property="og:title" content={`${site.bride_name} & ${site.groom_name} Wedding 💍`} />
        <meta property="og:description" content="We joyfully invite you to celebrate our wedding. RSVP now!" />
        {site.hero_image_url && <meta property="og:image" content={site.hero_image_url} />}
        <meta property="og:url" content={`https://wedora.in/w/${site.slug}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* Force loading fonts right header */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
        <style>
          {`
            .font-serif { font-family: 'Cormorant Garamond', serif !important; }
            .font-sans { font-family: 'DM Sans', sans-serif !important; }
            
            .petal {
               position: absolute;
               background: ${themeConfig.primary};
               border-radius: 15% 85% 15% 85%;
               opacity: 0.8;
               pointer-events: none;
               animation: fall linear infinite, sway ease-in-out infinite alternate;
               z-index: 10;
            }
            @keyframes fall {
               0% { top: -10%; transform: rotate(0deg); opacity: 0; }
               10% { opacity: 0.8; }
               90% { opacity: 0.8; }
               100% { top: 110%; transform: rotate(360deg); opacity: 0; }
            }
            @keyframes sway {
               0% { margin-left: 0px; }
               100% { margin-left: 50px; }
            }
          `}
        </style>
      </Helmet>

      {/* Admin Warning Banner */}
      {!site.is_published && isOwner && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-sm text-center font-medium sticky top-0 z-50">
          Viewing draft mode. This wedding page is not yet published. 
          <Link to="/dashboard" className="underline ml-2">Go to Dashboard</Link>
        </div>
      )}

      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? (isDark ? 'bg-[#0D1B2A]/90 text-white' : 'bg-white/90 text-gray-900') + ' backdrop-blur-md shadow-sm py-3' 
        : 'bg-transparent py-6 text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-wide">
            Wedora
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button onClick={() => scrollToElement('story')} className="hover:opacity-70 transition">Our Story</button>
            <button onClick={() => scrollToElement('events')} className="hover:opacity-70 transition">Events</button>
            <button onClick={() => scrollToElement('venue')} className="hover:opacity-70 transition">Venue</button>
            <button onClick={() => scrollToElement('gallery')} className="hover:opacity-70 transition">Gallery</button>
            <button 
              onClick={() => scrollToElement('rsvp')} 
              className="bg-gradient-to-r from-rose-gold to-plum text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              💌 RSVP Now
            </button>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => scrollToElement('rsvp')} 
              className="bg-gradient-to-r from-rose-gold to-plum text-white px-4 py-2 rounded-full text-sm font-medium shadow-md"
            >
              RSVP
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0D1B2A]">
        {hasHeroImage ? (
          <div className="absolute inset-0 w-full h-full">
            <img src={ensureHttps(site.hero_image_url)} alt="Couple" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[${themeConfig.background}]/90`} />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0" style={{background: `linear-gradient(135deg, ${themeConfig.secondary} 0%, ${themeConfig.primary} 50%, #2D1B2A 100%)`}} />
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)'}} />
            {/* Floating hearts decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[[15,20,'❤️','8s'],[75,35,'💕','12s'],[45,70,'💍','10s'],[85,65,'✨','7s'],[25,80,'💐','14s'],[60,15,'💗','9s']].map(([l,t,e,d], i) => (
                <span key={i} className="absolute text-3xl opacity-30 animate-pulse" style={{left:`${l}%`,top:`${t}%`,animationDuration:d,animationDelay:`${i*0.5}s`}}>{e}</span>
              ))}
            </div>
          </div>
        )}

        {/* Falling Petals (pure CSS via Helmet styles) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="petal" 
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 15 + 10}px`,
              height: `${Math.random() * 15 + 10}px`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }} 
          />
        ))}

        <div className="relative z-10 text-center px-4 flex flex-col items-center animate-fade-in-up mt-20">
          {/* Giant background & symbol removed to ensure text readability */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-white leading-tight mb-2 drop-shadow-lg">
            {site.bride_name} <br className="md:hidden"/> <span className="italic text-rose-gold font-medium">&</span> <br className="md:hidden"/>{site.groom_name}
          </h1>
          
          <div className="w-24 h-px bg-white/40 my-6 mx-auto" />
          
          <p className="text-xl md:text-3xl font-serif text-white/90 drop-shadow flex flex-col items-center">
            <span>{formattedDate}</span>
            {site.venue_city && <span className="text-lg md:text-xl text-white/70 mt-2 tracking-widest uppercase">{site.venue_city}</span>}
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => scrollToElement('rsvp')} className="bg-gradient-to-r from-rose-gold to-plum text-white px-8 py-3.5 rounded-full font-medium text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              💌 RSVP Now
            </button>
            <button onClick={() => scrollToElement('events')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded-full font-medium text-lg transition-all">
              View Schedule
            </button>
          </div>

          <div className="mt-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white text-center max-w-lg w-full animate-slide-up shadow-2xl" style={{ animationDelay: '0.4s' }}>
            {isPast ? (
              <p className="text-2xl font-serif">The celebrations have begun! 🎉</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 md:gap-4 divide-x divide-white/20">
                <div className="px-2">
                  <span className="block text-3xl md:text-4xl font-serif font-medium">{timeLeft.days}</span>
                  <span className="text-xs uppercase tracking-wider text-white/70">Days</span>
                </div>
                <div className="px-2">
                  <span className="block text-3xl md:text-4xl font-serif font-medium">{timeLeft.hours}</span>
                  <span className="text-xs uppercase tracking-wider text-white/70">Hours</span>
                </div>
                <div className="px-2">
                  <span className="block text-3xl md:text-4xl font-serif font-medium">{timeLeft.mins}</span>
                  <span className="text-xs uppercase tracking-wider text-white/70">Mins</span>
                </div>
                <div className="px-2">
                  <span className="block text-3xl md:text-4xl font-serif font-medium">{timeLeft.secs}</span>
                  <span className="text-xs uppercase tracking-wider text-white/70">Secs</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 text-white/50 animate-bounce cursor-pointer z-20" onClick={() => scrollToElement('story')}>
          <ChevronDown className="w-8 h-8 mx-auto" />
        </div>
      </section>

      {/* Our Story Section */}
      {site.story_text && (
        <section id="story" className="py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-full md:w-1/2 relative group">
            <div className="aspect-[3/4] rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl relative border-8 border-white">
              {hasHeroImage ? (
                <img src={ensureHttps(site.hero_image_url)} alt="Couple" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative" style={{background: `linear-gradient(180deg, rgba(183,110,121,0.08) 0%, rgba(183,110,121,0.18) 100%)`}}>
                  <div className="text-center">
                    <span className="block text-[120px] leading-none mb-2">👫</span>
                    <span className="block text-5xl animate-pulse">💍</span>
                    <p className="text-sm text-gray-400 mt-4 font-medium">Upload your photo in the Page Builder</p>
                  </div>
                </div>
              )}
            </div>
            {/* Decorative frame */}
            <div className="absolute -inset-4 border border-[var(--color-rose-gold)] rounded-t-[1000px] rounded-b-[40px] opacity-30 select-none pointer-events-none -z-10" />
          </div>
          
          <div className="w-full md:w-1/2">
            <span className="text-[var(--color-rose-gold)] uppercase tracking-widest text-sm font-semibold mb-2 block">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-[var(--text-dark)] leading-tight">How it all began</h2>
            <div className="text-[var(--text-dark)] opacity-80 space-y-4 font-sans leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: site.story_text.replace(/\n/g, '<br/>') }} />
            
            <div className="mt-8 inline-block px-4 py-2 bg-[var(--color-rose-gold)]/10 text-[var(--color-rose-gold)] rounded-full font-medium shadow-sm border border-[var(--color-rose-gold)]/20">
               Together Forever 💍
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {site.events && site.events.length > 0 && (
        <section id="events" className="py-24 px-4 md:px-8 bg-[#0D1B2A] text-white relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-rose-gold)]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-plum)]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
               <div className="w-12 h-px bg-white/20"></div>
               <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-semibold">EVENTS SCHEDULE</span>
               <div className="w-12 h-px bg-white/20"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-16 font-light">
              Join us for <span className="italic text-[var(--color-rose-gold)] font-medium">every</span> celebration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {site.events.map((event, index) => {
                const isLastOdd = site.events.length % 2 !== 0 && index === site.events.length - 1;
                
                return (
                  <div key={index} className={`bg-white/5 border border-white/10 rounded-2xl p-8 hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 text-left ${isLastOdd ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                    <div className="text-3xl mb-5 drop-shadow-md">{event.emoji || '✨'}</div>
                    <h3 className="text-2xl font-serif font-medium mb-3">{event.name}</h3>
                    
                    <div className="space-y-4 text-white/80 text-sm font-sans mt-4">
                      {event.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          <span className="font-medium">{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(event.date))}</span>
                        </div>
                      )}
                      {event.time && (
                        <div className="inline-flex items-center gap-2 bg-[var(--color-rose-gold)]/20 px-3 py-1.5 rounded-full border border-[var(--color-rose-gold)]/30">
                          <Clock className="w-3.5 h-3.5 text-[var(--color-rose-gold)]" />
                          <span className="text-xs font-bold tracking-wide text-white/90">{event.time}</span>
                        </div>
                      )}
                      <div className="pt-2"></div>
                      {event.venue && (
                        <div className="text-xs opacity-50 leading-relaxed font-medium">
                          {event.venue}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Venue Section */}
      {(site.venue_name || site.venue_address) && (
        <section id="venue" className="py-24 px-4 md:px-8 max-w-5xl mx-auto text-center">
          <span className="text-[var(--color-rose-gold)] uppercase tracking-widest text-sm font-semibold mb-2 block">Location</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-12 text-[var(--text-dark)]">Join Us Here</h2>
          
          <div className={`rounded-3xl shadow-xl overflow-hidden ${isDark ? 'bg-[#1E293B]' : 'bg-white'} border border-opacity-10 border-gray-500 max-w-3xl mx-auto`}>
            {/* Map placeholder */}
            <div className="h-64 bg-gray-100 flex items-center justify-center relative border-b border-gray-200">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <div className="relative z-10 text-center animate-bounce mt-4">
                  <div className="text-5xl">📍</div>
               </div>
            </div>
            
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-serif font-bold mb-2 text-[var(--text-dark)]">{site.venue_name}</h3>
              <p className="text-[var(--text-dark)] opacity-70 mb-8 max-w-lg mx-auto">{site.venue_address}</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {site.venue_maps_url && (
                  <a href={ensureHttps(site.venue_maps_url)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[var(--color-rose-gold)] text-white rounded-full font-medium hover:bg-opacity-90 transition w-full sm:w-auto justify-center shadow-lg">
                    <MapIcon className="w-5 h-5" /> Open in Maps
                  </a>
                )}
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.venue_address || site.venue_name)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-rose-gold)] text-[var(--color-rose-gold)] rounded-full font-medium hover:bg-[var(--color-rose-gold)] hover:text-white transition w-full sm:w-auto justify-center">
                  <Compass className="w-5 h-5" /> Get Directions
                </a>
              </div>
              
              {site.dress_code && (
                <div className="mt-10 inline-block px-5 py-2 bg-yellow-50 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                  <span className="font-bold">Dress Code:</span> {site.dress_code}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[var(--color-rose-gold)] uppercase tracking-widest text-sm font-semibold mb-2 block">Memories</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[var(--text-dark)]">Gallery</h2>
        </div>
        
        {site.gallery_images && site.gallery_images.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {site.gallery_images.filter(img => img && img.trim() !== '').map((img, i) => (
              <div key={i} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-md border border-[var(--bg-color)]/10" onClick={() => setGalleryModalImage(img)}>
                <img 
                  src={ensureHttps(img)} 
                  alt={`Gallery Image ${i + 1}`} 
                  onError={(e) => { e.target.closest('div').style.display = 'none'; }} 
                  className="w-full h-auto transform group-hover:scale-105 transition duration-500" 
                  loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-plum)]/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
              </div>
            ))}
          </div>
        ) : (
          isOwner && (
            <div className="text-center p-12 border-2 border-dashed border-[var(--text-dark)]/20 rounded-3xl opacity-70">
              <div className="text-4xl mb-4">📸</div>
              <p className="text-[var(--text-dark)] font-medium">Add photos in your Wedora Dashboard to share them here.</p>
            </div>
          )
        )}
      </section>

      {/* Contacts Section */}
      {(site.bride_contact_name || site.groom_contact_name) && (
        <section id="contact" className={`py-16 px-4 md:px-8 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif text-center mb-10 text-[var(--text-dark)]">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {site.bride_contact_name && (
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1E293B]' : 'bg-white'} shadow-md border-t-4`} style={{ borderTopColor: 'var(--color-rose-gold)' }}>
                  <h3 className="font-serif text-xl font-bold mb-1 text-[var(--text-dark)]">Bride's Family</h3>
                  <p className="text-[var(--text-dark)]/70 mb-4">{site.bride_contact_name}</p>
                  <div className="flex gap-3">
                    {site.bride_contact_phone && (
                      <>
                        <a href={`tel:${site.bride_contact_phone}`} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-800 transition">
                          <Phone className="w-4 h-4" /> Call
                        </a>
                        <a href={`https://wa.me/${site.bride_contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
              {site.groom_contact_name && (
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-[#1E293B]' : 'bg-white'} shadow-md border-t-4`} style={{ borderTopColor: 'var(--color-plum)' }}>
                  <h3 className="font-serif text-xl font-bold mb-1 text-[var(--text-dark)]">Groom's Family</h3>
                  <p className="text-[var(--text-dark)]/70 mb-4">{site.groom_contact_name}</p>
                  <div className="flex gap-3">
                    {site.groom_contact_phone && (
                      <>
                        <a href={`tel:${site.groom_contact_phone}`} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-800 transition">
                          <Phone className="w-4 h-4" /> Call
                        </a>
                        <a href={`https://wa.me/${site.groom_contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition">
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 px-4 md:px-8 relative bg-gradient-to-br from-[var(--color-rose-gold)]/10 via-[var(--bg-color)] to-[var(--color-plum)]/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
             <h2 className="text-5xl font-serif text-[var(--text-dark)] mb-4">Will you be joining us?</h2>
             {site.rsvp_deadline && !isRsvpClosed && (
               <p className="text-[var(--text-dark)]/80">Kindly respond by {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long' }).format(new Date(site.rsvp_deadline))}</p>
             )}
          </div>

          <div className={`${isDark ? 'bg-[#1E293B] text-white' : 'bg-white text-gray-900'} rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden border border-gray-100`}>
            
            {isRsvpClosed ? (
               <div className="text-center py-12">
                   <div className="text-5xl mb-4">⏳</div>
                   <h3 className="text-2xl font-serif font-bold mb-2">RSVP Closed</h3>
                   <p className="text-gray-500">The deadline to RSVP has passed. Please contact the couple directly if you have any questions.</p>
               </div>
            ) : alreadyRsvped && !rsvpSuccess ? (
               <div className="text-center py-12">
                  <div className="text-5xl mb-4">💌</div>
                  <h3 className="text-2xl font-serif font-bold mb-2">You've already RSVPed</h3>
                  <p className="text-gray-500 mb-6">Thank you for letting us know! We have received your response.</p>
                  <button onClick={() => setAlreadyRsvped(false)} className="text-[var(--color-rose-gold)] underline font-medium">
                     Update my response
                  </button>
               </div>
            ) : rsvpSuccess ? (
               <div className="text-center py-16 animate-fade-in">
                  <div className="text-6xl mb-6 inline-block animate-bounce">🎉</div>
                  <h3 className="text-3xl font-serif font-bold mb-4 text-[var(--color-rose-gold)]">You're Confirmed!</h3>
                  <p className="text-lg opacity-80 mb-2">Thank you, {rsvpFormData.guest_name.split(' ')[0]}.</p>
                  <p className="opacity-60 text-sm">We can't wait to celebrate with you.</p>
               </div>
            ) : (
               <form onSubmit={handleRsvpSubmit} className="space-y-8 relative z-10">
                  {rsvpClosingSoon && (
                     <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl flex items-start gap-3 border border-yellow-200">
                        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">RSVP closes in {daysToDeadline} days! Please confirm your attendance soon.</p>
                     </div>
                  )}
                  
                  {rsvpError && (
                     <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                        {rsvpError}
                     </div>
                  )}

                  {/* Attendance Toggle */}
                  <div>
                     <label className="block text-sm font-medium mb-4 uppercase tracking-wider text-center">Are you attending?</label>
                     <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button type="button" onClick={() => setRsvpStatus('confirmed')} className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition flex items-center justify-center gap-2 ${rsvpStatus === 'confirmed' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                           <CheckCircle className="w-5 h-5" /> Yes, Accepting
                        </button>
                        <button type="button" onClick={() => setRsvpStatus('declined')} className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition flex items-center justify-center gap-2 ${rsvpStatus === 'declined' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                           <XCircle className="w-5 h-5" /> Can't Make It
                        </button>
                        <button type="button" onClick={() => setRsvpStatus('maybe')} className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition flex items-center justify-center gap-2 ${rsvpStatus === 'maybe' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                           <HelpCircle className="w-5 h-5" /> Maybe
                        </button>
                     </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <input type="text" required value={rsvpFormData.guest_name} onChange={e => setRsvpFormData(prev => ({...prev, guest_name: e.target.value}))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 focus:ring-rose-gold text-white' : 'bg-gray-50 border-gray-200 focus:ring-rose-gold/30 focus:border-rose-gold'}`} placeholder="John Doe" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <input type="tel" required value={rsvpFormData.guest_phone} onChange={e => setRsvpFormData(prev => ({...prev, guest_phone: e.target.value}))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 focus:ring-rose-gold text-white' : 'bg-gray-50 border-gray-200 focus:ring-rose-gold/30 focus:border-rose-gold'}`} placeholder="+91 98765 43210" />
                     </div>
                  </div>

                  {rsvpStatus !== 'declined' && (
                     <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium mb-2">Email Address (Optional)</label>
                              <input type="email" value={rsvpFormData.guest_email} onChange={e => setRsvpFormData(prev => ({...prev, guest_email: e.target.value}))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="john@example.com" />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-2">Number of Guests</label>
                              <select value={rsvpFormData.guest_count} onChange={e => setRsvpFormData(prev => ({...prev, guest_count: e.target.value}))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}>
                                 {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                                 <option value="6">6+ Guests (Please message couple)</option>
                              </select>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-sm font-medium mb-2">You are celebrating with:</label>
                              <select value={rsvpFormData.guest_side} onChange={e => setRsvpFormData(prev => ({...prev, guest_side: e.target.value}))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}>
                                 <option value="Friend of Bride">Friend of Bride</option>
                                 <option value="Friend of Groom">Friend of Groom</option>
                                 <option value="Family of Bride">Family of Bride</option>
                                 <option value="Family of Groom">Family of Groom</option>
                                 <option value="Colleague">Colleague / Other</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-2">Meal Preference</label>
                              <select value={rsvpFormData.meal_preference} onChange={e => setRsvpFormData(prev => ({...prev, meal_preference: e.target.value}))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}>
                                 <option value="Vegetarian">Vegetarian</option>
                                 <option value="Non-Vegetarian">Non-Vegetarian</option>
                                 <option value="Jain">Jain / No Onion Garlic</option>
                                 <option value="No Preference">No Preference</option>
                              </select>
                           </div>
                        </div>

                        {site.events && site.events.length > 0 && (
                           <div>
                              <label className="block text-sm font-medium mb-3">Which events will you attend?</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {site.events.map((e, i) => (
                                    <label key={i} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200'}`}>
                                       <input 
                                          type="checkbox" 
                                          checked={rsvpFormData.events_attending.includes(e.name)}
                                          onChange={(evt) => {
                                             if (evt.target.checked) setRsvpFormData(prev => ({ ...prev, events_attending: [...prev.events_attending, e.name] }));
                                             else setRsvpFormData(prev => ({ ...prev, events_attending: prev.events_attending.filter(n => n !== e.name) }));
                                          }}
                                          className="w-5 h-5 rounded border-gray-300 text-[var(--color-rose-gold)] focus:ring-[var(--color-rose-gold)]"
                                       />
                                       <span className="font-medium text-sm">{e.name}</span>
                                    </label>
                                 ))}
                              </div>
                           </div>
                        )}
                     </>
                  )}

                  <div>
                     <label className="block text-sm font-medium mb-2">Message to the Couple (Optional)</label>
                     <textarea value={rsvpFormData.message_to_couple} onChange={e => setRsvpFormData(prev => ({...prev, message_to_couple: e.target.value}))} rows="3" className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:outline-none transition ${isDark ? 'bg-[#0D1B2A] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} placeholder="Share your wishes..."></textarea>
                  </div>

                  <button type="submit" disabled={rsvpSubmitting} className="w-full py-4 rounded-xl font-bold text-white text-lg transition shadow-lg hover:shadow-xl disabled:opacity-70 bg-gradient-to-r from-[var(--color-rose-gold)] to-[var(--color-plum)]">
                     {rsvpSubmitting ? 'Sending...' : 'Confirm My Attendance'}
                  </button>
               </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0A0A0A] text-white/50 text-center text-sm font-sans">
         <div className="font-serif text-2xl text-white/80 mb-2">{site.bride_name} & {site.groom_name}</div>
         <div>{formattedDate}</div>
         
         {site.show_wedora_branding !== false && (
            <div className="mt-8 pt-8 border-t border-white/10 max-w-md mx-auto">
               <p className="flex items-center justify-center gap-2">
                  Created with <Link to="/" className="text-white hover:text-rose-gold font-medium transition">Wedora</Link> 💍
               </p>
               <p className="mt-1 text-xs">Planning your wedding? <Link to="/signup" className="text-rose-gold/80 hover:text-rose-gold transition">Start free at wedora.in</Link></p>
            </div>
         )}
      </footer>

      {/* Mobile Sticky CTA */}
      {!alreadyRsvped && !isRsvpClosed && (
         <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 transform transition-transform">
            <button onClick={() => scrollToElement('rsvp')} className="w-full py-3.5 rounded-full font-bold text-white text-lg transition shadow-lg bg-gradient-to-r from-[var(--color-rose-gold)] to-[var(--color-plum)]">
               💌 RSVP Now
            </button>
         </div>
      )}

      {/* Image Modal */}
      {galleryModalImage && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in" onClick={() => setGalleryModalImage(null)}>
            <div className="relative max-w-5xl max-h-screen w-full">
               <button className="absolute -top-12 right-0 text-white hover:text-gray-300" onClick={() => setGalleryModalImage(null)}>
                  <XCircle className="w-10 h-10" />
               </button>
               <img src={ensureHttps(galleryModalImage)} alt="Gallery Full" className="w-full h-auto max-h-[85vh] object-contain rounded-lg" />
            </div>
         </div>
      )}
    </div>
  );
}
