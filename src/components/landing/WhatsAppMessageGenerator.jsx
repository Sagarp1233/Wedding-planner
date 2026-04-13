import { useState } from 'react';
import { Copy, Send, Check, MessageCircle, Heart, PartyPopper, Briefcase } from 'lucide-react';

const TEMPLATE_STYLES = [
  { id: 'emotional', label: 'Emotional', emoji: '💕', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'formal', label: 'Formal', emoji: '🎩', icon: Briefcase, color: 'from-gray-700 to-gray-900' },
  { id: 'fun', label: 'Fun', emoji: '🎉', icon: PartyPopper, color: 'from-amber-400 to-orange-500' },
];

const TEMPLATES = {
  emotional: (b, g, d, v, m) =>
`💕 *With hearts full of joy and love…*

We are thrilled to share that our beloved
✨ *${b}* & *${g}* ✨
are tying the knot! 🎀

📅 *Date:* ${d}
${v ? `📍 *Venue:* ${v}\n` : ''}
${m ? `💌 ${m}\n` : ''}
Your presence would make this day even more special!
We can't wait to celebrate this beautiful beginning with you. 🥂

With love and blessings,
The families of ${b} & ${g} 💝

_Create your own wedding invitation for free:_
🔗 https://wedora.in`,

  formal: (b, g, d, v, m) =>
`🕊️ *Wedding Invitation*

With the blessings of the Almighty and our respected elders,

We cordially invite you to the auspicious wedding ceremony of

*${b}*
with
*${g}*

📅 *Date:* ${d}
${v ? `📍 *Venue:* ${v}\n` : ''}
${m ? `\n${m}\n` : ''}
Your gracious presence would be a blessing.

With warm regards,
The families of ${b} & ${g}

_Plan your wedding with Wedora:_
🔗 https://wedora.in`,

  fun: (b, g, d, v, m) =>
`🎉🎊 *WOOT WOOT! Wedding Alert!* 🎊🎉

Guess what?! 
*${b}* 💍 *${g}*
are officially getting MARRIED! 🥳

📅 ${d}
${v ? `📍 ${v}\n` : ''}
${m ? `\n💬 ${m}\n` : ''}
Get ready to dance, eat, and celebrate like there's no tomorrow! 💃🕺

Dress code: Your best outfit + your biggest smile 😁

Don't you dare miss it! 
RSVP with a 🎉 right now!

_Make your own invite free:_
🔗 https://wedora.in`
};

export default function WhatsAppMessageGenerator() {
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');
  const [copied, setCopied] = useState(false);

  const displayDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Your Wedding Date';
  const b = brideName || 'Bride';
  const g = groomName || 'Groom';
  const v = venue;
  const m = customMessage;

  const message = TEMPLATES[selectedStyle](b, g, displayDate, v, m);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="whatsapp-generator" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-[#dcf8c6]/20 via-white to-[#25D366]/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 mb-4">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span className="text-xs sm:text-sm font-semibold text-[#25D366]">Free WhatsApp Invite Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3">
            Create WhatsApp Wedding{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#25D366] to-[#128C7E]">Invite Message</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Generate beautiful, pre-written invitation messages. Copy and share instantly with everyone on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="glass-card p-6 sm:p-8 space-y-5">
            {/* Template style */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Message Style</label>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATE_STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${selectedStyle === s.id
                      ? 'border-[#25D366] bg-[#25D366]/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Bride's Name</label>
                <input
                  type="text"
                  value={brideName}
                  onChange={e => setBrideName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Groom's Name</label>
                <input
                  type="text"
                  value={groomName}
                  onChange={e => setGroomName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Wedding Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Venue (Optional)</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. The Grand Palace, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Custom Message (Optional)</label>
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="Add a personal touch..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col gap-4">
            <div className="glass-card p-5 sm:p-6 bg-gradient-to-br from-white to-[#dcf8c6]/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Message Preview</p>
                  <p className="text-[10px] text-gray-400">This is how your message will look</p>
                </div>
              </div>
              {/* WhatsApp-style chat bubble */}
              <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed shadow-sm max-h-[420px] overflow-y-auto">
                {message}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all shadow-md"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Message'}
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-all shadow-md"
              >
                <Send className="w-4 h-4" /> Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
