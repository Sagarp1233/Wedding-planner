import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Save, ExternalLink, Eye, Plus, Trash2, X, CheckCircle,
  Heart, Type, BookOpen, CalendarHeart, MapPin, Image, Phone, Settings2,
  Palette, Globe, Clock, ChevronRight, Sparkles, AlertCircle,
  Share2, Copy, MessageCircle, QrCode, Link2
} from 'lucide-react';

const THEMES = [
  { id: 'elegant', name: 'Elegant Rose', colors: ['#B76E79','#6B2D5E','#FAF8F6'], desc: 'Warm rose-gold & plum' },
  { id: 'classic', name: 'Classic Red', colors: ['#8B1A1A','#5C0E0E','#FFFFF8'], desc: 'Timeless deep red' },
  { id: 'modern', name: 'Modern Slate', colors: ['#334155','#0F172A','#F8FAFC'], desc: 'Clean & contemporary' },
  { id: 'royal', name: 'Royal Gold', colors: ['#C9A96E','#8B7355','#0D1B2A'], desc: 'Regal dark & gold' },
  { id: 'floral', name: 'Floral Garden', colors: ['#D4A5A5','#9CAF88','#F5F2EE'], desc: 'Soft pinks & greens' },
  { id: 'luxury_gold', name: 'Luxury Noir', colors: ['#B8860B','#8B6508','#0A0A0A'], desc: 'Black & gold luxury' },
  { id: 'minimal_white', name: 'Minimal White', colors: ['#1A1A1A','#404040','#FFFFFF'], desc: 'Pure & minimal' },
];

const TABS = [
  { id: 'basics',   label: 'Basics',   icon: Heart },
  { id: 'story',    label: 'Our Story', icon: BookOpen },
  { id: 'events',   label: 'Events',   icon: CalendarHeart },
  { id: 'venue',    label: 'Venue',    icon: MapPin },
  { id: 'gallery',  label: 'Gallery',  icon: Image },
  { id: 'contacts', label: 'Contacts', icon: Phone },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

export default function MyWeddingPageBuilder() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [activeTab, setActiveTab] = useState('basics');
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Form state — mirrors wedding_sites columns
  const [form, setForm] = useState({
    slug: '',
    bride_name: '',
    groom_name: '',
    wedding_date: '',
    rsvp_deadline: '',
    hero_image_url: '',
    story_text: '',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    venue_maps_url: '',
    dress_code: '',
    theme: 'elegant',
    show_wedora_branding: true,
    is_published: false,
    bride_contact_name: '',
    bride_contact_phone: '',
    bride_contact_relation: 'Father of the Bride',
    groom_contact_name: '',
    groom_contact_phone: '',
    groom_contact_relation: 'Father of the Groom',
    events: [],
    gallery_images: [],
  });

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // --- Unsaved changes guard ---
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  // --- Ctrl+S keyboard shortcut ---
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && siteId) handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hasChanges, siteId]);

  useEffect(() => {
    if (!authLoading && !currentUser) navigate('/login');
    else if (currentUser) fetchSite();
  }, [currentUser, authLoading]);

  // --- Share helpers ---
  const pageUrl = form.slug ? `https://wedora.in/w/${form.slug}` : '';
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(`💍 You're invited to ${form.bride_name} & ${form.groom_name}'s wedding!\n\nRSVP here: ${pageUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const fetchSite = async () => {
    try {
      setLoading(true);
      const { data, error: e } = await supabase
        .from('wedding_sites')
        .select('*')
        .eq('couple_id', currentUser.id)
        .single();

      if (e && e.code === 'PGRST116') {
        // No site exists — we'll show create CTA
        setLoading(false);
        return;
      }
      if (e) throw e;

      setSiteId(data.id);
      setForm({
        slug: data.slug || '',
        bride_name: data.bride_name || '',
        groom_name: data.groom_name || '',
        wedding_date: data.wedding_date ? new Date(data.wedding_date).toISOString().slice(0, 16) : '',
        rsvp_deadline: data.rsvp_deadline ? new Date(data.rsvp_deadline).toISOString().slice(0, 16) : '',
        hero_image_url: data.hero_image_url || '',
        story_text: data.story_text || '',
        venue_name: data.venue_name || '',
        venue_address: data.venue_address || '',
        venue_city: data.venue_city || '',
        venue_maps_url: data.venue_maps_url || '',
        dress_code: data.dress_code || '',
        theme: data.theme || 'elegant',
        show_wedora_branding: data.show_wedora_branding !== false,
        is_published: data.is_published || false,
        bride_contact_name: data.bride_contact_name || '',
        bride_contact_phone: data.bride_contact_phone || '',
        bride_contact_relation: data.bride_contact_relation || 'Father of the Bride',
        groom_contact_name: data.groom_contact_name || '',
        groom_contact_phone: data.groom_contact_phone || '',
        groom_contact_relation: data.groom_contact_relation || 'Father of the Groom',
        events: Array.isArray(data.events) ? data.events : [],
        gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async () => {
    const slug = `${(form.bride_name || 'bride').toLowerCase()}-and-${(form.groom_name || 'groom').toLowerCase()}`.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
    const { data, error: e } = await supabase.from('wedding_sites').insert([{
      couple_id: currentUser.id,
      slug,
      bride_name: form.bride_name || 'Bride',
      groom_name: form.groom_name || 'Groom',
      theme: 'elegant',
      is_published: false,
    }]).select().single();
    if (e) { showToast('Error creating site: ' + e.message); return; }
    setSiteId(data.id);
    setForm(prev => ({ ...prev, slug: data.slug, bride_name: data.bride_name, groom_name: data.groom_name }));
    showToast('Wedding page created! Start customizing.');
  };

  const handleSave = async () => {
    if (!siteId) return;
    try {
      setSaving(true);
      const payload = {
        ...form,
        wedding_date: form.wedding_date ? new Date(form.wedding_date).toISOString() : null,
        rsvp_deadline: form.rsvp_deadline ? new Date(form.rsvp_deadline).toISOString() : null,
        updated_at: new Date().toISOString(),
      };
      const { error: e } = await supabase.from('wedding_sites').update(payload).eq('id', siteId);
      if (e) throw e;
      setHasChanges(false);
      showToast('All changes saved!');
    } catch (err) {
      showToast('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    const next = !form.is_published;
    updateField('is_published', next);
    if (siteId) {
      await supabase.from('wedding_sites').update({ is_published: next }).eq('id', siteId);
      showToast(next ? 'Your wedding page is now live! 🎉' : 'Page unpublished.');
    }
  };

  // ---- Events array helpers ----
  const addEvent = () => {
    updateField('events', [...form.events, { name: '', date: '', time: '', venue: '', emoji: '✨' }]);
  };
  const updateEvent = (idx, key, value) => {
    const updated = [...form.events];
    updated[idx] = { ...updated[idx], [key]: value };
    updateField('events', updated);
  };
  const removeEvent = (idx) => {
    updateField('events', form.events.filter((_, i) => i !== idx));
  };

  // ---- Gallery helpers ----
  const addGalleryImage = () => updateField('gallery_images', [...form.gallery_images, '']);
  const updateGalleryImage = (idx, val) => {
    const updated = [...form.gallery_images];
    updated[idx] = val;
    updateField('gallery_images', updated);
  };
  const removeGalleryImage = (idx) => updateField('gallery_images', form.gallery_images.filter((_, i) => i !== idx));

  // ---- Loading / Error ----
  if (loading || authLoading) return (
    <div className="h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-3 border-rose-gold border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading your page builder...</p>
      </div>
    </div>
  );

  // ---- No Site Yet ----
  if (!siteId) return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">Create Your Wedding Website</h2>
        <p className="text-gray-400 text-sm mb-6">Build a beautiful, shareable page with RSVP, your story, events & more.</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Bride's Name</label>
            <input value={form.bride_name} onChange={e => updateField('bride_name', e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm" placeholder="Abhineethi" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Groom's Name</label>
            <input value={form.groom_name} onChange={e => updateField('groom_name', e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm" placeholder="Sumanth" />
          </div>
        </div>
        <button onClick={handleCreateSite} className="w-full h-11 text-sm font-bold text-white rounded-lg shadow-md hover:opacity-90 transition" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
          <Plus className="w-4 h-4 inline mr-2" /> Create My Wedding Page
        </button>
      </div>
    </div>
  );

  // ---- Main Builder ----
  return (
    <div className="min-h-screen bg-ivory">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700">{toast}</span>
        </div>
      )}

      {/* ===== STICKY TOP BAR ===== */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[20px] font-bold text-plum flex items-center gap-2">
              My Wedding Page <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">
              wedora.in/w/{form.slug}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {form.slug && (
              <a href={`/w/${form.slug}`} target="_blank" rel="noreferrer" className="h-9 px-4 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
            )}
            <button onClick={handleSave} disabled={saving || !hasChanges} className={`h-9 px-5 text-[13px] font-bold rounded-lg shadow-md flex items-center gap-2 transition ${hasChanges ? 'text-white hover:opacity-90' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed shadow-none'}`} style={hasChanges ? {background: 'linear-gradient(135deg, #b76e79, #4a2040)'} : {}}>
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleTogglePublish} className={`h-9 px-4 text-[13px] font-bold rounded-lg flex items-center gap-2 transition shadow-sm border ${form.is_published ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${form.is_published ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              {form.is_published ? 'Published' : 'Draft'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto flex">

        {/* ===== LEFT NAV TABS ===== */}
        <nav className="w-56 shrink-0 border-r border-gray-100 bg-white/50 min-h-[calc(100vh-57px)] p-4 space-y-1 hidden md:block sticky top-[57px] self-start">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${isActive ? 'bg-plum/10 text-plum' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </button>
            );
          })}

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-400">
            <div className="flex justify-between"><span>Events</span><span className="font-bold text-gray-600">{form.events.length}</span></div>
            <div className="flex justify-between"><span>Gallery Photos</span><span className="font-bold text-gray-600">{form.gallery_images.filter(Boolean).length}</span></div>
            <div className="flex justify-between"><span>Theme</span><span className="font-bold text-gray-600 capitalize">{form.theme}</span></div>
            <div className="flex justify-between"><span>Status</span><span className={`font-bold ${form.is_published ? 'text-emerald-600' : 'text-amber-500'}`}>{form.is_published ? 'Live' : 'Draft'}</span></div>
          </div>
        </nav>

        {/* Mobile Tab Selector */}
        <div className="md:hidden sticky top-[57px] z-20 bg-white border-b border-gray-100 overflow-x-auto">
          <div className="flex px-4 py-2 gap-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[12px] font-semibold transition ${activeTab === tab.id ? 'bg-plum text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 p-6 md:p-8 max-w-3xl">

          {/* BASICS */}
          {activeTab === 'basics' && (
            <Section title="Basic Details" desc="Your names, date, and page URL.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Bride's Name" value={form.bride_name} onChange={v => updateField('bride_name', v)} placeholder="Abhineethi" />
                <Field label="Groom's Name" value={form.groom_name} onChange={v => updateField('groom_name', v)} placeholder="Sumanth" />
              </div>
              <Field label="Wedding Date & Time" type="datetime-local" value={form.wedding_date} onChange={v => updateField('wedding_date', v)} />
              <Field label="Page URL Slug" value={form.slug} onChange={v => updateField('slug', v.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="sumanth-and-abhineethi" hint={`Your page will be at wedora.in/w/${form.slug}`} />
              <Field label="Hero Image URL" value={form.hero_image_url} onChange={v => updateField('hero_image_url', v)} placeholder="https://example.com/your-photo.jpg" hint="Paste a direct link to your hero banner photo." />
              {form.hero_image_url && (
                <div className="rounded-xl overflow-hidden border border-gray-200 h-40 mt-2">
                  <img src={form.hero_image_url} alt="Hero preview" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                </div>
              )}

              {/* ===== SHARE & QR CODE ===== */}
              {form.slug && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-2">
                  <h3 className="text-[13px] font-bold text-gray-700 flex items-center gap-2 mb-4">
                    <Share2 className="w-4 h-4 text-rose-gold" /> Share Your Wedding Page
                  </h3>

                  {/* URL Display + Copy */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 overflow-hidden">
                      <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-[13px] text-gray-600 font-medium truncate">{pageUrl}</span>
                    </div>
                    <button onClick={handleCopyLink} className={`h-10 px-4 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition shrink-0 ${copied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                      {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button onClick={handleWhatsAppShare} className="h-10 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20BD58] transition shadow-sm">
                      <MessageCircle className="w-4 h-4" /> Share via WhatsApp
                    </button>
                    <a href={`/w/${form.slug}`} target="_blank" rel="noreferrer" className="h-10 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition">
                      <ExternalLink className="w-4 h-4" /> Open Live Page
                    </a>
                  </div>

                  {/* QR Code */}
                  <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <QRCodeCanvas value={pageUrl} size={120} />
                    <div className="text-center sm:text-left">
                      <div className="text-[13px] font-semibold text-gray-700 mb-1">Scan to RSVP</div>
                      <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">Print this QR code on your physical invitations so guests can RSVP instantly from their phones.</p>
                      <button onClick={() => {
                        const canvas = document.querySelector('#qr-canvas');
                        if (canvas) { const a = document.createElement('a'); a.download = `wedding-qr-${form.slug}.png`; a.href = canvas.toDataURL(); a.click(); }
                      }} className="mt-2 text-[11px] font-bold text-plum hover:underline">
                        Download QR Code ↓
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* STORY */}
          {activeTab === 'story' && (
            <Section title="Our Story" desc="Tell guests about your love story. This appears on your wedding page.">
              <div>
                <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Your Story</label>
                <textarea value={form.story_text} onChange={e => { updateField('story_text', e.target.value); }} rows={10} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-gold/20 focus:border-rose-gold placeholder:text-gray-300 leading-relaxed resize-y" placeholder="We met during our college years and have been inseparable ever since..." />
                <p className="text-[11px] text-gray-400 mt-1">{form.story_text.length} characters · Line breaks will be preserved.</p>
              </div>
            </Section>
          )}

          {/* EVENTS */}
          {activeTab === 'events' && (
            <Section title="Wedding Events" desc="Add all your ceremony events — Mehendi, Sangeet, Wedding, Reception, etc.">
              <div className="space-y-4">
                {form.events.map((ev, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 relative group">
                    <button onClick={() => removeEvent(idx)} className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-gray-50 hover:bg-rose-50 flex items-center justify-center text-gray-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Emoji</label>
                        <input value={ev.emoji || ''} onChange={e => updateEvent(idx, 'emoji', e.target.value)} className="w-14 h-10 text-center text-xl border border-gray-200 rounded-lg" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Event Name</label>
                        <input value={ev.name || ''} onChange={e => updateEvent(idx, 'name', e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm" placeholder="Sangeet & Mehendi" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Date</label>
                        <input type="datetime-local" value={ev.date ? new Date(ev.date).toISOString().slice(0,16) : ''} onChange={e => updateEvent(idx, 'date', e.target.value ? new Date(e.target.value).toISOString() : '')} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Display Time</label>
                        <input value={ev.time || ''} onChange={e => updateEvent(idx, 'time', e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm" placeholder="7:00 PM" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Venue</label>
                        <input value={ev.venue || ''} onChange={e => updateEvent(idx, 'venue', e.target.value)} className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm" placeholder="Grand Ballroom" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addEvent} className="mt-4 w-full h-11 border-2 border-dashed border-gray-200 hover:border-rose-gold/30 rounded-xl text-sm font-semibold text-gray-400 hover:text-rose-gold transition flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </Section>
          )}

          {/* VENUE */}
          {activeTab === 'venue' && (
            <Section title="Venue Details" desc="Where the celebrations will take place.">
              <Field label="Venue Name" value={form.venue_name} onChange={v => updateField('venue_name', v)} placeholder="Taj Falaknuma Palace" />
              <Field label="Full Address" value={form.venue_address} onChange={v => updateField('venue_address', v)} placeholder="Engine Bowli, Falaknuma, Hyderabad" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City" value={form.venue_city} onChange={v => updateField('venue_city', v)} placeholder="Hyderabad" />
                <Field label="Dress Code (optional)" value={form.dress_code} onChange={v => updateField('dress_code', v)} placeholder="Traditional Indian" />
              </div>
              <Field label="Google Maps Link" value={form.venue_maps_url} onChange={v => updateField('venue_maps_url', v)} placeholder="https://maps.google.com/..." hint="Guests will see an 'Open in Maps' button linking here." />
            </Section>
          )}

          {/* GALLERY */}
          {activeTab === 'gallery' && (
            <Section title="Photo Gallery" desc="Add image URLs to showcase on your wedding page.">
              <div className="space-y-3">
                {form.gallery_images.map((url, idx) => (
                  <div key={idx} className="flex gap-3 items-start group">
                    {url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img src={url} alt="" className="w-full h-full object-cover" onError={e => { e.target.src=''; e.target.parentElement.style.display='none'; }} />
                      </div>
                    )}
                    <input value={url} onChange={e => updateGalleryImage(idx, e.target.value)} className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm placeholder:text-gray-300" placeholder="https://example.com/photo.jpg" />
                    <button onClick={() => removeGalleryImage(idx)} className="w-10 h-10 rounded-lg bg-gray-50 hover:bg-rose-50 flex items-center justify-center text-gray-300 hover:text-rose-500 transition shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addGalleryImage} className="mt-4 w-full h-11 border-2 border-dashed border-gray-200 hover:border-rose-gold/30 rounded-xl text-sm font-semibold text-gray-400 hover:text-rose-gold transition flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Photo URL
              </button>
              {form.gallery_images.filter(Boolean).length > 0 && (
                <p className="text-[11px] text-gray-400 mt-2">{form.gallery_images.filter(Boolean).length} photo{form.gallery_images.filter(Boolean).length !== 1 ? 's' : ''} added</p>
              )}
            </Section>
          )}

          {/* CONTACTS */}
          {activeTab === 'contacts' && (
            <Section title="Contact Information" desc="Provide contact details so guests can reach out with questions.">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h4 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-2">👰 Bride's Family Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Contact Person Name" value={form.bride_contact_name} onChange={v => updateField('bride_contact_name', v)} placeholder="Mrs. Lakshmi" compact />
                  <Field label="Phone Number" value={form.bride_contact_phone} onChange={v => updateField('bride_contact_phone', v)} placeholder="+91 98765 43210" compact />
                </div>
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Relationship to Bride</label>
                  <select
                    value={form.bride_contact_relation}
                    onChange={e => updateField('bride_contact_relation', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-plum/20 focus:border-plum focus:outline-none"
                  >
                    <option value="Father of the Bride">Father of the Bride</option>
                    <option value="Mother of the Bride">Mother of the Bride</option>
                    <option value="Brother of the Bride">Brother of the Bride</option>
                    <option value="Sister of the Bride">Sister of the Bride</option>
                    <option value="Uncle of the Bride">Uncle of the Bride</option>
                    <option value="Aunt of the Bride">Aunt of the Bride</option>
                    <option value="Guardian of the Bride">Guardian of the Bride</option>
                    <option value="Family Representative (Bride's Side)">Family Representative (Bride's Side)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h4 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-2">🤵 Groom's Family Contact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Contact Person Name" value={form.groom_contact_name} onChange={v => updateField('groom_contact_name', v)} placeholder="Mr. Venkata Rao" compact />
                  <Field label="Phone Number" value={form.groom_contact_phone} onChange={v => updateField('groom_contact_phone', v)} placeholder="+91 91234 56789" compact />
                </div>
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Relationship to Groom</label>
                  <select
                    value={form.groom_contact_relation}
                    onChange={e => updateField('groom_contact_relation', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-plum/20 focus:border-plum focus:outline-none"
                  >
                    <option value="Father of the Groom">Father of the Groom</option>
                    <option value="Mother of the Groom">Mother of the Groom</option>
                    <option value="Brother of the Groom">Brother of the Groom</option>
                    <option value="Sister of the Groom">Sister of the Groom</option>
                    <option value="Uncle of the Groom">Uncle of the Groom</option>
                    <option value="Aunt of the Groom">Aunt of the Groom</option>
                    <option value="Guardian of the Groom">Guardian of the Groom</option>
                    <option value="Family Representative (Groom's Side)">Family Representative (Groom's Side)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </Section>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <Section title="Page Settings" desc="Theme, RSVP deadline, branding and publishing.">
              {/* Theme Picker */}
              <div>
                <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-3 block flex items-center gap-2"><Palette className="w-3.5 h-3.5" /> Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {THEMES.map(t => (
                    <button key={t.id} onClick={() => updateField('theme', t.id)} className={`rounded-xl border-2 p-3 text-left transition-all ${form.theme === t.id ? 'border-plum shadow-md ring-1 ring-plum/20' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="flex gap-1 mb-2">
                        {t.colors.map((c, i) => <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{background: c}} />)}
                      </div>
                      <div className="text-[12px] font-bold text-gray-700">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Field label="RSVP Deadline" type="datetime-local" value={form.rsvp_deadline} onChange={v => updateField('rsvp_deadline', v)} hint="After this date, the RSVP form will close on the public page." />

              {/* Toggles */}
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <div className="text-[13px] font-semibold text-gray-700">Show Wedora Branding</div>
                    <div className="text-[11px] text-gray-400">Display "Created with Wedora" in footer</div>
                  </div>
                  <ToggleSwitch on={form.show_wedora_branding} onChange={() => updateField('show_wedora_branding', !form.show_wedora_branding)} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-[13px] font-semibold text-gray-700">Publish Website</div>
                    <div className="text-[11px] text-gray-400">Make your page visible to anyone with the link</div>
                  </div>
                  <ToggleSwitch on={form.is_published} onChange={handleTogglePublish} />
                </div>
              </div>

              {form.is_published && form.slug && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <Globe className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[13px] font-semibold text-emerald-700 mb-1">Your page is live!</div>
                    <a href={`/w/${form.slug}`} target="_blank" rel="noreferrer" className="text-[12px] text-emerald-600 underline font-medium">wedora.in/w/{form.slug} ↗</a>
                  </div>
                </div>
              )}
            </Section>
          )}

        </main>
      </div>
    </div>
  );
}

/* ================ Sub-Components ================ */

function Section({ title, desc, children }) {
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="font-serif text-xl font-bold text-gray-800">{title}</h2>
        {desc && <p className="text-[13px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, hint, compact }) {
  return (
    <div>
      <label className={`${compact ? 'text-[11px]' : 'text-[12px]'} font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block`}>{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={`w-full ${compact ? 'h-9' : 'h-10'} px-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-gold/20 focus:border-rose-gold placeholder:text-gray-300 text-gray-700`} />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function ToggleSwitch({ on, onChange }) {
  return (
    <button type="button" onClick={onChange} className={`w-11 h-6 rounded-full relative shrink-0 transition-colors duration-200 cursor-pointer ${on ? 'bg-emerald-400' : 'bg-gray-200'}`}>
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-200 ${on ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  );
}

/* ---- QR Code Generator (pure Canvas, no deps) ---- */
function QRCodeCanvas({ value, size = 120 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!value || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Simple QR-like pattern using the URL as seed
    // For production: use a QR library. This generates a visual QR via the QR API.
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
    };
    img.onerror = () => {
      // Fallback: draw a placeholder
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', size/2, size/2);
    };
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&margin=8&format=png`;
  }, [value, size]);

  return <canvas ref={canvasRef} id="qr-canvas" width={size} height={size} className="rounded-xl border border-gray-200 shadow-sm" style={{ width: size, height: size }} />;
}
