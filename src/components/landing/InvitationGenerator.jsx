import { useState, useRef, useCallback } from 'react';
import { Download, Share2, Eye, Sparkles, ChevronRight, Check } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'hindu',
    label: 'Hindu',
    emoji: '🕉️',
    image: '/templates/hindu.png',
    textColor: '#fef3c7',
    accentColor: '#d4a843',
    fontFamily: "'Playfair Display', serif",
    overlayGradient: 'linear-gradient(180deg, rgba(100,20,20,0.55) 0%, rgba(60,10,10,0.70) 100%)',
    inviteTitle: 'Shubh Vivah',
    subtitle: 'Together with their families',
    datePrefix: 'Auspicious Date',
  },
  {
    id: 'christian',
    label: 'Christian',
    emoji: '⛪',
    image: '/templates/christian.png',
    textColor: '#1f2937',
    accentColor: '#b8860b',
    fontFamily: "'Playfair Display', serif",
    overlayGradient: 'linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(255,248,240,0.60) 100%)',
    inviteTitle: 'Holy Matrimony',
    subtitle: 'Together with their families invite you to celebrate',
    datePrefix: 'On the day of',
  },
  {
    id: 'muslim',
    label: 'Muslim',
    emoji: '☪️',
    image: '/templates/muslim.png',
    textColor: '#fef9e7',
    accentColor: '#d4a843',
    fontFamily: "'Playfair Display', serif",
    overlayGradient: 'linear-gradient(180deg, rgba(10,60,40,0.50) 0%, rgba(5,40,25,0.65) 100%)',
    inviteTitle: 'Bismillah',
    subtitle: 'Request the honor of your presence at the Nikah ceremony of',
    datePrefix: 'Date',
  },
  {
    id: 'telugu',
    label: 'Telugu',
    emoji: '🪔',
    image: '/templates/telugu.png',
    textColor: '#7c2d12',
    accentColor: '#c2410c',
    fontFamily: "'Playfair Display', serif",
    overlayGradient: 'linear-gradient(180deg, rgba(255,245,220,0.55) 0%, rgba(255,235,200,0.60) 100%)',
    inviteTitle: 'Shubha Vivahamu',
    subtitle: 'With the blessings of the Almighty',
    datePrefix: 'Muhurtham',
  },
  {
    id: 'modern',
    label: 'Modern',
    emoji: '✨',
    image: '/templates/modern.png',
    textColor: '#374151',
    accentColor: '#b76e79',
    fontFamily: "'Inter', sans-serif",
    overlayGradient: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(253,242,240,0.55) 100%)',
    inviteTitle: "We're Getting Married!",
    subtitle: 'You are cordially invited to celebrate',
    datePrefix: 'Save the Date',
  },
];

export default function InvitationGenerator({ hideUpsell }) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venue, setVenue] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);
  const canvasRef = useRef(null);

  const displayBride = brideName || 'Bride Name';
  const displayGroom = groomName || 'Groom Name';
  const displayDate = weddingDate
    ? new Date(weddingDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Wedding Date';
  const displayVenue = venue || 'Venue';

  const hasData = brideName && groomName && weddingDate;

  const handleGenerate = () => {
    if (hasData) setShowPreview(true);
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    const w = 600, h = 850;
    canvas.width = w;
    canvas.height = h;

    // Draw template background
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedTemplate.image;
    await new Promise(r => { img.onload = r; img.onerror = r; });
    ctx.drawImage(img, 0, 0, w, h);

    // Overlay
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (selectedTemplate.id === 'hindu' || selectedTemplate.id === 'muslim') {
      grad.addColorStop(0, 'rgba(0,0,0,0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0.65)');
    } else {
      grad.addColorStop(0, 'rgba(255,255,255,0.5)');
      grad.addColorStop(1, 'rgba(255,255,255,0.6)');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const isLight = ['christian', 'telugu', 'modern'].includes(selectedTemplate.id);
    const textColor = isLight ? '#1f2937' : '#fef3c7';
    const accentColor = selectedTemplate.accentColor;

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = accentColor;
    ctx.font = 'italic 18px Playfair Display, serif';
    ctx.fillText(selectedTemplate.inviteTitle, w / 2, 180);

    // Subtitle
    ctx.fillStyle = textColor;
    ctx.font = '14px Inter, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText(selectedTemplate.subtitle, w / 2, 220);
    ctx.globalAlpha = 1;

    // Couple names
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px Playfair Display, serif';
    ctx.fillText(displayBride, w / 2, 320);

    ctx.fillStyle = accentColor;
    ctx.font = 'italic 22px Playfair Display, serif';
    ctx.fillText('&', w / 2, 365);

    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px Playfair Display, serif';
    ctx.fillText(displayGroom, w / 2, 410);

    // Divider
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, 445);
    ctx.lineTo(w / 2 + 80, 445);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Date
    ctx.fillStyle = accentColor;
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(selectedTemplate.datePrefix.toUpperCase(), w / 2, 490);
    ctx.fillStyle = textColor;
    ctx.font = '18px Playfair Display, serif';
    ctx.fillText(displayDate, w / 2, 520);

    // Venue
    if (venue) {
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.7;
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(displayVenue, w / 2, 560);
      ctx.globalAlpha = 1;
    }

    // Wedora watermark
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.3;
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Made with ❤ on Wedora.in', w / 2, h - 30);
    ctx.globalAlpha = 1;

    // Download
    const link = document.createElement('a');
    link.download = `wedding-invitation-${selectedTemplate.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [selectedTemplate, displayBride, displayGroom, displayDate, displayVenue, venue]);

  const handleShareWhatsApp = () => {
    const text = `💌 You're Invited!\n\n${selectedTemplate.inviteTitle}\n\n${displayBride} & ${displayGroom}\n\n📅 ${displayDate}${venue ? `\n📍 ${displayVenue}` : ''}\n\nCreate your own invitation free: https://wedora.in`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="invitation-generator" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-rose-gold/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-plum/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-gold/10 to-plum/10 border border-rose-gold/20 mb-4">
            <Sparkles className="w-4 h-4 text-rose-gold" />
            <span className="text-xs sm:text-sm font-semibold text-rose-gold">Viral Invitation Tool — 100% Free</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
            Create Stunning Wedding{' '}
            <span className="gradient-text">Invitations</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Choose from beautiful templates, customize in seconds, and share with your loved ones on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Form */}
          <div className="glass-card p-6 sm:p-8 space-y-6">
            {/* Template selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Template Style</label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTemplate(t); setShowPreview(false); }}
                    className={`relative flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 ${selectedTemplate.id === t.id
                      ? 'border-rose-gold bg-rose-gold/5 shadow-md shadow-rose-gold/10'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {selectedTemplate.id === t.id && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-gold flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-xl sm:text-2xl">{t.emoji}</span>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Bride's Name *</label>
                <input
                  type="text"
                  value={brideName}
                  onChange={e => setBrideName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Groom's Name *</label>
                <input
                  type="text"
                  value={groomName}
                  onChange={e => setGroomName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Wedding Date *</label>
              <input
                type="date"
                value={weddingDate}
                onChange={e => setWeddingDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Venue (Optional)</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Grand Palace, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 transition-all text-sm"
              />
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!hasData}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${hasData
                ? 'bg-gradient-to-r from-rose-gold to-plum text-white shadow-lg shadow-rose-gold/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Eye className="w-4 h-4" />
              Generate Preview
            </button>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col items-center gap-6">
            <div
              ref={previewRef}
              className="relative w-full max-w-[380px] rounded-2xl overflow-hidden shadow-2xl shadow-black/15 border border-white/30"
              style={{ aspectRatio: '600/850' }}
            >
              {/* Template background */}
              <img
                src={selectedTemplate.image}
                alt={`${selectedTemplate.label} wedding invitation template`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{ background: selectedTemplate.overlayGradient }}
              />
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
                {/* Invite title */}
                <p className="text-sm italic mb-1 opacity-90" style={{ color: selectedTemplate.accentColor, fontFamily: selectedTemplate.fontFamily }}>
                  {selectedTemplate.inviteTitle}
                </p>
                {/* Subtitle */}
                <p className="text-xs mb-8 opacity-70 max-w-[240px]" style={{ color: selectedTemplate.textColor }}>
                  {selectedTemplate.subtitle}
                </p>
                {/* Couple names */}
                <h3 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: selectedTemplate.textColor, fontFamily: "'Playfair Display', serif" }}>
                  {displayBride}
                </h3>
                <span className="text-lg italic my-1" style={{ color: selectedTemplate.accentColor, fontFamily: "'Playfair Display', serif" }}>&</span>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: selectedTemplate.textColor, fontFamily: "'Playfair Display', serif" }}>
                  {displayGroom}
                </h3>
                {/* Divider */}
                <div className="w-20 h-px mb-6" style={{ backgroundColor: selectedTemplate.accentColor, opacity: 0.5 }} />
                {/* Date */}
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: selectedTemplate.accentColor }}>
                  {selectedTemplate.datePrefix}
                </p>
                <p className="text-sm font-medium mb-4" style={{ color: selectedTemplate.textColor, fontFamily: "'Playfair Display', serif" }}>
                  {displayDate}
                </p>
                {/* Venue */}
                {(venue || !hasData) && (
                  <p className="text-xs opacity-60" style={{ color: selectedTemplate.textColor }}>
                    📍 {displayVenue}
                  </p>
                )}
                {/* Watermark */}
                <p className="absolute bottom-4 text-[9px] opacity-25" style={{ color: selectedTemplate.textColor }}>
                  Made with ❤ on Wedora.in
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {showPreview && hasData && (
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[380px] animate-fade-in-up">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" /> Download Image
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg"
                >
                  <Share2 className="w-4 h-4" /> Share WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        {!hideUpsell && (
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-sm text-gray-500 mb-4">Want to save your invitation & access planning tools?</p>
            <a href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-gold to-plum text-white font-semibold shadow-xl shadow-rose-gold/25 hover:shadow-2xl hover:-translate-y-1 transition-all">
              Sign Up Free <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
