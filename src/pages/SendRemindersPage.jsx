import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Send, MessageCircle, Mail, Users, CheckCircle, Clock,
  Search, Bell, Sparkles, Copy, ArrowRight, X, Play,
  Pause, SkipForward, ChevronRight, ExternalLink, Eye,
  ClipboardCopy, RotateCcw, Info
} from 'lucide-react';

export default function SendRemindersPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [site, setSite] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // Compose state
  const [selectedGuests, setSelectedGuests] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');

  // Sequential send state
  const [sendMode, setSendMode] = useState(false); // true = sending wizard active
  const [sendQueue, setSendQueue] = useState([]);
  const [sendIndex, setSendIndex] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) navigate('/login');
    else if (currentUser) fetchData();
  }, [currentUser, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: s } = await supabase
        .from('wedding_sites')
        .select('id, slug, bride_name, groom_name, wedding_date, events, venue_name, venue_address')
        .eq('couple_id', currentUser.id).single();
      if (!s) throw new Error('No site');
      setSite(s);
      setMessageTemplate(
        `Hi {name}! 💍\n\nYou're warmly invited to ${s.bride_name} & ${s.groom_name}'s wedding!\n\n📅 View details, schedule & RSVP:\nhttps://wedora.in/w/${s.slug}\n\nWe'd love to celebrate with you! 🎉`
      );
      const { data: r } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('wedding_site_id', s.id)
        .order('created_at', { ascending: false });
      setResponses(r || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const weddingUrl = site ? `https://wedora.in/w/${site.slug}` : '';

  const filteredGuests = useMemo(() => {
    let list = [...responses];
    if (filterStatus !== 'all') list = list.filter(r => r.attendance_status === filterStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.guest_name?.toLowerCase().includes(q) || r.guest_phone?.includes(q));
    }
    return list;
  }, [responses, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const s = { total: responses.length, pending: 0, confirmed: 0, declined: 0, maybe: 0 };
    responses.forEach(r => {
      if (r.attendance_status === 'confirmed') s.confirmed++;
      else if (r.attendance_status === 'declined') s.declined++;
      else if (r.attendance_status === 'maybe') s.maybe++;
      else s.pending++;
    });
    return s;
  }, [responses]);

  const toggleGuest = (id) => {
    setSelectedGuests(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => {
    if (selectedGuests.size === filteredGuests.length) setSelectedGuests(new Set());
    else setSelectedGuests(new Set(filteredGuests.map(g => g.id)));
  };

  const personalizeMsg = (guestName) => {
    const firstName = guestName?.split(' ')[0] || 'Guest';
    return messageTemplate.replace(/{name}/g, firstName);
  };

  // ---- Sequential Send ----
  const startSending = () => {
    if (selectedGuests.size === 0) { showToast('Select at least one guest', 'error'); return; }
    const queue = responses.filter(r => selectedGuests.has(r.id));
    setSendQueue(queue);
    setSendIndex(0);
    setSentCount(0);
    setSkippedCount(0);
    setSendMode(true);
  };

  const currentGuest = sendQueue[sendIndex] || null;

  const sendToCurrentGuest = () => {
    if (!currentGuest) return;
    const phone = currentGuest.guest_phone?.replace(/\D/g, '');
    if (phone) {
      const msg = personalizeMsg(currentGuest.guest_name);
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      setSentCount(prev => prev + 1);
    }
    // Auto-advance after short delay
    setTimeout(() => {
      if (sendIndex < sendQueue.length - 1) {
        setSendIndex(prev => prev + 1);
      }
    }, 500);
  };

  const skipCurrentGuest = () => {
    setSkippedCount(prev => prev + 1);
    if (sendIndex < sendQueue.length - 1) {
      setSendIndex(prev => prev + 1);
    }
  };

  const finishSending = () => {
    setSendMode(false);
    setSendQueue([]);
    setSelectedGuests(new Set());
    showToast(`Done! Sent to ${sentCount} guest${sentCount !== 1 ? 's' : ''}${skippedCount > 0 ? `, skipped ${skippedCount}` : ''}`);
  };

  // ---- Copy helpers ----
  const handleCopyMessage = () => {
    const msg = personalizeMsg('Guest');
    navigator.clipboard.writeText(msg).then(() => showToast('Message copied! Paste in WhatsApp Broadcast'));
  };

  const handleCopyAllMessages = () => {
    const selected = responses.filter(r => selectedGuests.has(r.id));
    const lines = selected.map(g => {
      const phone = g.guest_phone?.replace(/\D/g, '') || 'N/A';
      return `📱 ${g.guest_name} (+${phone})\n${personalizeMsg(g.guest_name)}\n`;
    }).join('\n---\n\n');
    navigator.clipboard.writeText(lines).then(() => showToast(`Copied personalized messages for ${selected.length} guests!`));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(weddingUrl).then(() => showToast('Wedding link copied!'));
  };

  const avatarColors = ['bg-rose-100 text-rose-600','bg-indigo-100 text-indigo-600','bg-amber-100 text-amber-700','bg-teal-100 text-teal-600','bg-purple-100 text-purple-600'];
  const statusConfig = {
    confirmed: { c: 'text-emerald-600 bg-emerald-50', l: '✅ Confirmed' },
    declined: { c: 'text-rose-600 bg-rose-50', l: '❌ Declined' },
    maybe: { c: 'text-violet-600 bg-violet-50', l: '🤔 Maybe' },
    pending: { c: 'text-amber-600 bg-amber-50', l: '⏳ Pending' },
  };

  if (loading || authLoading) return (
    <div className="h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-3 border-rose-gold border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading reminders...</p>
      </div>
    </div>
  );

  // ============================================================
  //  SEND MODE WIZARD (Full-screen overlay)
  // ============================================================
  if (sendMode) {
    const progress = sendQueue.length > 0 ? ((sendIndex + 1) / sendQueue.length) * 100 : 0;
    const isLast = sendIndex >= sendQueue.length - 1;
    const currentMsg = currentGuest ? personalizeMsg(currentGuest.guest_name) : '';
    const currentPhone = currentGuest?.guest_phone?.replace(/\D/g, '') || '';

    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        {/* Toast */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-[100] bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3 animate-slide-up">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700">{toast.msg}</span>
          </div>
        )}

        {/* Top Progress Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100">
          <div className="h-1 bg-gray-100">
            <div className="h-full transition-all duration-500 rounded-r-full" style={{width: `${progress}%`, background: 'linear-gradient(90deg, #b76e79, #4a2040)'}} />
          </div>
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background: 'linear-gradient(135deg, #25D366, #128C7E)'}}>
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-800">Sending Invitations</div>
                <div className="text-[11px] text-gray-400">Guest {sendIndex + 1} of {sendQueue.length} • {sentCount} sent • {skippedCount} skipped</div>
              </div>
            </div>
            <button onClick={finishSending} className="text-[12px] font-semibold text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> {isLast ? 'Finish' : 'Stop & Exit'}
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">

            {/* Guest Card */}
            {currentGuest && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

                {/* Guest Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${avatarColors[currentGuest.guest_name?.charCodeAt(0) % avatarColors.length || 0]}`}>
                    {currentGuest.guest_name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-800">{currentGuest.guest_name}</div>
                    <div className="text-sm text-gray-400">{currentGuest.guest_phone || 'No phone'}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${(statusConfig[currentGuest.attendance_status] || statusConfig.pending).c}`}>
                    {(statusConfig[currentGuest.attendance_status] || statusConfig.pending).l}
                  </span>
                </div>

                {/* Message Preview */}
                <div className="px-6 py-5">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Message Preview</div>
                  <div className="bg-[#E8F5E9] rounded-2xl rounded-tl-md p-4 text-[13px] text-gray-700 leading-relaxed whitespace-pre-line shadow-sm relative">
                    {/* WhatsApp-style bubble */}
                    <div className="absolute -top-1 -left-1 text-[#E8F5E9] text-2xl">◤</div>
                    {currentMsg}
                    <div className="text-right mt-2 text-[10px] text-gray-400">
                      {new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} ✓✓
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                  {currentPhone ? (
                    <button
                      onClick={sendToCurrentGuest}
                      className="flex-1 h-12 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition"
                      style={{background: 'linear-gradient(135deg, #25D366, #128C7E)'}}
                    >
                      <Send className="w-4 h-4" /> Send via WhatsApp
                    </button>
                  ) : (
                    <div className="flex-1 h-12 rounded-xl text-[13px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 flex items-center justify-center gap-2">
                      <Info className="w-4 h-4" /> No phone number
                    </div>
                  )}

                  {!isLast ? (
                    <button onClick={skipCurrentGuest} className="h-12 px-5 rounded-xl text-[13px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2">
                      <SkipForward className="w-4 h-4" /> Skip
                    </button>
                  ) : (
                    <button onClick={finishSending} className="h-12 px-5 rounded-xl text-[13px] font-bold text-white flex items-center gap-2 shadow-md" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
                      <CheckCircle className="w-4 h-4" /> Done
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Guest Queue Preview (scrollable) */}
            <div className="mt-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 text-[11px] font-semibold text-gray-500 flex items-center justify-between">
                <span>Up Next</span>
                <span>{sendQueue.length - sendIndex - 1} remaining</span>
              </div>
              <div className="max-h-32 overflow-y-auto divide-y divide-gray-50">
                {sendQueue.slice(sendIndex + 1, sendIndex + 5).map((g, i) => (
                  <div key={g.id} className="px-4 py-2 flex items-center gap-3 text-[12px]">
                    <span className="text-gray-400 w-5 text-center font-mono">{sendIndex + 2 + i}</span>
                    <span className="font-semibold text-gray-700 truncate flex-1">{g.guest_name}</span>
                    <span className="text-gray-400">{g.guest_phone}</span>
                  </div>
                ))}
                {sendQueue.length - sendIndex - 1 > 4 && (
                  <div className="px-4 py-2 text-[11px] text-gray-400 text-center">
                    +{sendQueue.length - sendIndex - 5} more...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  //  MAIN PAGE
  // ============================================================
  return (
    <div className="min-h-screen bg-ivory pb-20">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[100] bg-white rounded-xl shadow-lg border px-4 py-3 flex items-center gap-3 animate-slide-up ${toast.type === 'error' ? 'border-red-200' : 'border-gray-100'}`}>
          <CheckCircle className={`w-4 h-4 ${toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`} />
          <span className="text-sm font-medium text-gray-700">{toast.msg}</span>
        </div>
      )}

      {/* Message Preview Overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-gray-800">Message Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5">
              {/* Phone mockup */}
              <div className="bg-[#ECE5DD] rounded-xl p-4 mx-auto max-w-sm">
                <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-md p-4 text-[13px] text-gray-800 leading-relaxed whitespace-pre-line shadow-sm">
                  {personalizeMsg('Rahul')}
                  <div className="text-right mt-2 text-[10px] text-gray-500">
                    {new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })} ✓✓
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { handleCopyMessage(); setShowPreview(false); }} className="flex-1 h-10 rounded-lg text-[12px] font-bold text-white flex items-center justify-center gap-2" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
                  <Copy className="w-3.5 h-3.5" /> Copy Message
                </button>
                <button onClick={() => { handleCopyLink(); setShowPreview(false); }} className="h-10 px-4 rounded-lg text-[12px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" /> Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[22px] font-bold text-plum flex items-center gap-2">
              Send Invitations <Bell className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">
              Share your wedding page with guests via WhatsApp
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(true)} className="h-9 px-4 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
              <Eye className="w-3.5 h-3.5" /> Preview Message
            </button>
            <button
              onClick={startSending}
              disabled={selectedGuests.size === 0}
              className={`h-9 px-5 text-[13px] font-bold rounded-lg shadow-md flex items-center gap-2 transition ${selectedGuests.size > 0 ? 'text-white hover:opacity-90' : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed shadow-none'}`}
              style={selectedGuests.size > 0 ? {background: 'linear-gradient(135deg, #25D366, #128C7E)'} : {}}
            >
              <Send className="w-3.5 h-3.5" />
              Start Sending ({selectedGuests.size})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-6 space-y-6">

        {/* Wedding Link Banner */}
        <div className="rounded-2xl overflow-hidden shadow-md" style={{background: 'linear-gradient(135deg, #4a2040 0%, #b76e79 100%)'}}>
          <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-white/60 text-[10px] uppercase tracking-widest font-semibold mb-1">Your Wedding Invitation Link</div>
              <div className="text-white text-lg font-bold font-serif">{weddingUrl}</div>
              <div className="text-white/50 text-[11px] mt-1">This link will be included in every invitation you send</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handleCopyLink} className="h-9 px-4 rounded-lg text-[12px] font-bold bg-white/15 text-white hover:bg-white/25 transition flex items-center gap-2 border border-white/20">
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </button>
              <a href={`/w/${site?.slug}`} target="_blank" rel="noreferrer" className="h-9 px-4 rounded-lg text-[12px] font-bold bg-white text-plum hover:bg-white/90 transition flex items-center gap-2 shadow-sm">
                <ExternalLink className="w-3.5 h-3.5" /> Open Page
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Guests', count: stats.total, icon: '👥', color: '#4a2040', key: 'all' },
            { label: 'Confirmed', count: stats.confirmed, icon: '✅', color: '#10b981', key: 'confirmed' },
            { label: 'Pending', count: stats.pending, icon: '⏳', color: '#f59e0b', key: 'pending' },
            { label: 'Maybe', count: stats.maybe, icon: '🤔', color: '#8b5cf6', key: 'maybe' },
            { label: 'Declined', count: stats.declined, icon: '❌', color: '#f43f5e', key: 'declined' },
          ].map((s, i) => (
            <button key={i} onClick={() => setFilterStatus(s.key === 'all' ? 'all' : s.key)} className={`bg-white rounded-xl border shadow-sm p-4 text-left transition-all hover:shadow-md ${filterStatus === s.key ? 'border-plum/30 ring-1 ring-plum/10' : 'border-gray-100'}`}>
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="font-serif text-2xl font-bold" style={{color: s.color}}>{s.count}</div>
              <div className="text-[11px] text-gray-400 font-medium">{s.label}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* ===== LEFT: Guest Selection ===== */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Search + Filter */}
            <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm placeholder:text-gray-300 bg-gray-50/50 focus:ring-rose-gold/20 focus:border-rose-gold" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['all','pending','confirmed','maybe','declined'].map(f => (
                  <button key={f} onClick={() => setFilterStatus(f)} className={`h-8 px-3 rounded-full text-[11px] font-semibold transition ${filterStatus === f ? 'bg-plum text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Select All */}
            <div className="px-5 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[12px] font-semibold text-gray-500">
                <input type="checkbox" className="rounded border-gray-300 text-rose-gold focus:ring-rose-gold/20" checked={selectedGuests.size === filteredGuests.length && filteredGuests.length > 0} onChange={selectAll} />
                Select All ({filteredGuests.length})
              </label>
              {selectedGuests.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-plum">{selectedGuests.size} selected</span>
                  <button onClick={() => setSelectedGuests(new Set())} className="text-[10px] text-gray-400 hover:text-gray-600 underline">Clear</button>
                </div>
              )}
            </div>

            {/* Guest List */}
            {filteredGuests.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-400">No guests found</p>
                <p className="text-xs text-gray-300 mt-1">Add guests via the Guests List page first</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
                {filteredGuests.map(g => {
                  const initials = g.guest_name?.substring(0,2).toUpperCase() || '??';
                  const colorIdx = g.guest_name ? g.guest_name.charCodeAt(0) % avatarColors.length : 0;
                  const st = statusConfig[g.attendance_status] || statusConfig.pending;
                  const hasPhone = !!(g.guest_phone && g.guest_phone.trim());

                  return (
                    <label key={g.id} className={`flex items-center gap-3 px-5 py-3 transition cursor-pointer ${selectedGuests.has(g.id) ? 'bg-rose-50/40' : 'hover:bg-gray-50/50'}`}>
                      <input type="checkbox" checked={selectedGuests.has(g.id)} onChange={() => toggleGuest(g.id)} className="rounded border-gray-300 text-rose-gold focus:ring-rose-gold/20" />
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[colorIdx]}`}>{initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-gray-800 truncate">{g.guest_name}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                          {hasPhone ? g.guest_phone : <span className="text-amber-500">No phone number</span>}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.c}`}>{st.l}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* ===== RIGHT: Compose & Tools Panel ===== */}
          <div className="space-y-5">

            {/* How It Works */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> How It Works
              </h3>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Select guests from the list', icon: '✅' },
                  { step: '2', text: 'Click "Start Sending"', icon: '🚀' },
                  { step: '3', text: 'Opens WhatsApp one guest at a time', icon: '💬' },
                  { step: '4', text: 'Hit Send in WhatsApp, then "Next"', icon: '➡️' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-plum/5 flex items-center justify-center text-sm shrink-0">{s.icon}</div>
                    <span className="text-[12px] text-gray-600">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Template */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500" /> Message Template
              </h3>
              <textarea value={messageTemplate} onChange={e => setMessageTemplate(e.target.value)} rows={7} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-gold/20 focus:border-rose-gold placeholder:text-gray-300 leading-relaxed resize-y" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-gray-400">Use <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">{'{name}'}</code> to personalize</p>
                <span className="text-[10px] text-gray-400">{messageTemplate.length} chars</span>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Quick Templates
              </h3>
              <div className="space-y-2">
                {[
                  { label: '💌 RSVP Invite', msg: `Hi {name}! 💍\n\nYou're warmly invited to ${site?.bride_name} & ${site?.groom_name}'s wedding!\n\n📅 View details & RSVP:\n${weddingUrl}\n\nKindly confirm at your earliest. 🙏` },
                  { label: '⏰ Last Call', msg: `Hey {name}! Just a gentle reminder — RSVP for ${site?.bride_name} & ${site?.groom_name}'s wedding closes soon! 🎊\n\nRSVP now: ${weddingUrl}` },
                  { label: '🎉 Countdown', msg: `Hi {name}! Only a few days left until ${site?.bride_name} & ${site?.groom_name}'s wedding! 🎉\n\nWe can't wait to celebrate with you!\n\n📍 Details: ${weddingUrl}` },
                  { label: '📍 Venue Details', msg: `Hi {name}! Here are the venue details for ${site?.bride_name} & ${site?.groom_name}'s wedding:\n\n🏛️ ${site?.venue_name || 'Venue TBA'}\n📍 ${site?.venue_address || 'Address TBA'}\n\nFull schedule & map: ${weddingUrl}\n\nSee you there! ✨` },
                ].map((t, i) => (
                  <button key={i} onClick={() => setMessageTemplate(t.msg)} className="w-full text-left px-3 py-2.5 rounded-lg text-[12px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition truncate">
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Shortcut */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-gray-700 mb-3 flex items-center gap-2">
                <ClipboardCopy className="w-4 h-4 text-violet-500" /> WhatsApp Broadcast Shortcut
              </h3>
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">For 50+ guests, use WhatsApp's built-in Broadcast feature. Copy the message below and paste it into a Broadcast List on WhatsApp Business app.</p>
              <div className="space-y-2">
                <button onClick={handleCopyMessage} className="w-full h-10 rounded-lg text-[12px] font-bold text-white flex items-center justify-center gap-2" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
                  <Copy className="w-3.5 h-3.5" /> Copy Invitation Message
                </button>
                {selectedGuests.size > 0 && (
                  <button onClick={handleCopyAllMessages} className="w-full h-10 rounded-lg text-[12px] font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 transition">
                    <ClipboardCopy className="w-3.5 h-3.5" /> Copy All ({selectedGuests.size}) Personalized Messages
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
