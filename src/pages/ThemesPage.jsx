import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Palette, Check, Eye, ExternalLink, CheckCircle, Sparkles,
  Heart, Crown, Gem, Flower2, Sun, Moon, Minus
} from 'lucide-react';

const THEMES = [
  {
    id: 'elegant',
    name: 'Elegant Rose',
    desc: 'A warm, romantic palette with rose-gold accents and soft plum highlights. Perfect for classic Indian weddings.',
    colors: { primary: '#B76E79', secondary: '#6B2D5E', bg: '#FAF8F6' },
    tags: ['Classic', 'Romantic'],
    icon: Heart,
    preview: { hero: 'linear-gradient(135deg, #6B2D5E 0%, #B76E79 100%)', card: '#FFFFFF', accent: '#B76E79' }
  },
  {
    id: 'classic',
    name: 'Classic Red',
    desc: 'Timeless deep red tones inspired by traditional Indian wedding colors. Bold and auspicious.',
    colors: { primary: '#8B1A1A', secondary: '#5C0E0E', bg: '#FFFFF8' },
    tags: ['Traditional', 'Bold'],
    icon: Crown,
    preview: { hero: 'linear-gradient(135deg, #5C0E0E 0%, #8B1A1A 100%)', card: '#FFFFF8', accent: '#8B1A1A' }
  },
  {
    id: 'modern',
    name: 'Modern Slate',
    desc: 'Clean and contemporary with cool slate tones. Ideal for urban, minimalist couples.',
    colors: { primary: '#334155', secondary: '#0F172A', bg: '#F8FAFC' },
    tags: ['Minimal', 'Urban'],
    icon: Minus,
    preview: { hero: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', card: '#FFFFFF', accent: '#334155' }
  },
  {
    id: 'royal',
    name: 'Royal Gold',
    desc: 'Regal dark backgrounds with rich gold accents. Grandeur meets sophistication.',
    colors: { primary: '#C9A96E', secondary: '#8B7355', bg: '#0D1B2A' },
    tags: ['Luxury', 'Dark'],
    icon: Crown,
    preview: { hero: 'linear-gradient(135deg, #0D1B2A 0%, #1B2D4A 100%)', card: '#1E293B', accent: '#C9A96E' }
  },
  {
    id: 'floral',
    name: 'Floral Garden',
    desc: 'Soft pinks and natural greens inspired by garden weddings. Fresh and dreamy.',
    colors: { primary: '#D4A5A5', secondary: '#9CAF88', bg: '#F5F2EE' },
    tags: ['Garden', 'Soft'],
    icon: Flower2,
    preview: { hero: 'linear-gradient(135deg, #9CAF88 0%, #D4A5A5 100%)', card: '#FFFFFF', accent: '#D4A5A5' }
  },
  {
    id: 'luxury_gold',
    name: 'Luxury Noir',
    desc: 'Black and gold for the ultimate luxury feel. Dramatic, opulent, and show-stopping.',
    colors: { primary: '#B8860B', secondary: '#8B6508', bg: '#0A0A0A' },
    tags: ['Premium', 'Dark'],
    icon: Gem,
    preview: { hero: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 100%)', card: '#1A1A1A', accent: '#B8860B' }
  },
  {
    id: 'minimal_white',
    name: 'Minimal White',
    desc: 'Pure white canvas with black typography. Let your photos and content speak for themselves.',
    colors: { primary: '#1A1A1A', secondary: '#404040', bg: '#FFFFFF' },
    tags: ['Clean', 'Photo-first'],
    icon: Sun,
    preview: { hero: 'linear-gradient(135deg, #1A1A1A 0%, #404040 100%)', card: '#FFFFFF', accent: '#1A1A1A' }
  },
];

export default function ThemesPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [currentTheme, setCurrentTheme] = useState('elegant');
  const [siteSlug, setSiteSlug] = useState('');
  const [siteId, setSiteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (!authLoading && !currentUser) navigate('/login');
    else if (currentUser) fetchSite();
  }, [currentUser, authLoading]);

  const fetchSite = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('wedding_sites').select('id, slug, theme').eq('couple_id', currentUser.id).single();
      if (data) { setSiteId(data.id); setCurrentTheme(data.theme || 'elegant'); setSiteSlug(data.slug || ''); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const applyTheme = async (themeId) => {
    if (!siteId) return;
    setSaving(true);
    setCurrentTheme(themeId);
    const { error } = await supabase.from('wedding_sites').update({ theme: themeId }).eq('id', siteId);
    setSaving(false);
    if (!error) showToast(`Theme changed to "${THEMES.find(t => t.id === themeId)?.name}"! ✨`);
    else showToast('Error updating theme');
  };

  if (loading || authLoading) return (
    <div className="h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-3 border-rose-gold border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading themes...</p>
      </div>
    </div>
  );

  const activeTheme = THEMES.find(t => t.id === currentTheme);
  const isDark = (id) => ['royal','luxury_gold'].includes(id);

  return (
    <div className="min-h-screen bg-ivory pb-20">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700">{toast}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[22px] font-bold text-plum flex items-center gap-2">
              Themes <Palette className="w-5 h-5 text-violet-400" />
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">
              Current: <strong className="text-gray-600">{activeTheme?.name}</strong>
            </p>
          </div>
          {siteSlug && (
            <a href={`/w/${siteSlug}`} target="_blank" rel="noreferrer" className="h-9 px-4 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
              <Eye className="w-3.5 h-3.5" /> Preview Live Page
            </a>
          )}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-6">

        {/* Current Theme Banner */}
        <div className="rounded-2xl overflow-hidden mb-8 shadow-md" style={{background: activeTheme?.preview.hero}}>
          <div className="px-8 py-10 flex items-center justify-between">
            <div>
              <div className="text-white/60 text-[11px] uppercase tracking-widest font-semibold mb-1">Active Theme</div>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">{activeTheme?.name}</h2>
              <p className="text-white/70 text-sm max-w-md">{activeTheme?.desc}</p>
              <div className="flex gap-2 mt-4">
                {activeTheme?.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-white/80">{tag}</span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex gap-3">
              {Object.values(activeTheme?.colors || {}).map((c, i) => (
                <div key={i} className="w-14 h-14 rounded-xl shadow-lg border-2 border-white/20" style={{background: c}} />
              ))}
            </div>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map(theme => {
            const isActive = currentTheme === theme.id;
            const dark = isDark(theme.id);
            const Icon = theme.icon;

            return (
              <div key={theme.id} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg group ${isActive ? 'border-plum shadow-md ring-2 ring-plum/10' : 'border-gray-100 hover:border-gray-200'}`}>

                {/* Mini Preview */}
                <div className="h-36 relative overflow-hidden" style={{background: theme.preview.hero}}>
                  {/* Fake page preview */}
                  <div className="absolute inset-x-4 bottom-3 flex flex-col items-center text-center">
                    <div className="text-white/40 text-6xl font-serif">&</div>
                    <div className="text-white text-lg font-serif font-medium -mt-3">Bride & Groom</div>
                    <div className="text-white/60 text-[10px] mt-1 tracking-wider uppercase">Your Wedding Date</div>
                  </div>

                  {isActive && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                      <Check className="w-4 h-4 text-plum" />
                    </div>
                  )}
                </div>

                {/* Content Cards Preview */}
                <div className="p-4" style={{backgroundColor: theme.colors.bg}}>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 h-6 rounded-lg" style={{background: theme.preview.card, border: '1px solid rgba(0,0,0,0.05)'}} />
                    <div className="flex-1 h-6 rounded-lg" style={{background: theme.preview.card, border: '1px solid rgba(0,0,0,0.05)'}} />
                  </div>
                  <div className="h-3 w-3/4 rounded" style={{background: theme.colors.primary, opacity: 0.2}} />
                </div>

                {/* Info */}
                <div className="px-5 py-4 border-t border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{color: theme.colors.primary}} />
                        {theme.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{theme.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Color swatches */}
                    <div className="flex gap-1.5">
                      {Object.values(theme.colors).map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-gray-200 shadow-sm" style={{background: c}} />
                      ))}
                    </div>

                    {isActive ? (
                      <span className="text-[11px] font-bold text-plum flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <button onClick={() => applyTheme(theme.id)} disabled={saving} className="h-8 px-4 text-[11px] font-bold rounded-lg transition hover:opacity-90 text-white" style={{background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`}}>
                        Apply Theme
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Upsell */}
        <div className="mt-8 bg-gradient-to-r from-plum/5 to-rose-gold/5 rounded-2xl border border-plum/10 p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-gray-800 mb-1">Want Custom Themes?</div>
            <p className="text-[12px] text-gray-400">Upgrade to Wedora Pro to unlock custom color pickers, custom fonts, and the ability to create your own theme from scratch.</p>
          </div>
          <button className="h-9 px-5 text-[12px] font-bold text-white rounded-lg shrink-0 hover:opacity-90 transition" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
            Upgrade to Pro
          </button>
        </div>

      </div>
    </div>
  );
}
