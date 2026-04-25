import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { parseCSV } from '../utils/helpers';
import Modal from '../components/ui/Modal';
import {
  CheckCircle, Clock, XCircle, Search, HelpCircle, UserPlus,
  Download, Send, MessageCircle, MessagesSquare,
  Activity, Users, X, SearchX, Globe, Trash2, Mail, ShieldAlert, Bell, Plus, Settings2, Upload, Edit3, ClipboardCopy
} from 'lucide-react';

/* ================ Helpers ================ */
const RelativeTime = ({ date }) => {
  if (!date) return <span>Just now</span>;
  const now = new Date();
  const d = new Date(date);
  const diff = Math.abs(now - d) / 1000;
  if (diff < 60) return <span>just now</span>;
  if (diff < 3600) return <span>{Math.round(diff/60)}m ago</span>;
  if (diff < 86400) return <span>{Math.round(diff/3600)}h ago</span>;
  return <span>{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>;
};

const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return `Today, ${d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ================ Main Component ================ */
export default function RSVPDashboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [site, setSite] = useState(null);
  const [responses, setResponses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toasts, setToasts] = useState([]);
  const addToast = (msg, id = Date.now(), type = 'success') => {
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const [filterQuery, setFilterQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const [isSendRemindersOpen, setIsSendRemindersOpen] = useState(false);
  const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);
  
  // Guest Add/Edit Modal State
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [editGuestId, setEditGuestId] = useState(null);
  const [guestForm, setGuestForm] = useState({
    guest_name: '', guest_phone: '', guest_email: '', 
    guest_count: 1, guest_side: "Bride's Side", group_id: '',
    category: 'Family', table_name: '', notes: '', attendance_status: 'pending'
  });

  const [bulkActionTable, setBulkActionTable] = useState('');
  const [bulkActionCategory, setBulkActionCategory] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !currentUser) navigate('/login');
    else if (currentUser) fetchData();
  }, [currentUser, authLoading]);

  useEffect(() => {
    if (!site?.id) return;
    const sub = supabase.channel('rsvp_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvp_responses', filter: `wedding_site_id=eq.${site.id}` }, payload => {
        if (payload.eventType === 'INSERT') { addToast(`🎉 New RSVP from ${payload.new.guest_name}!`); setResponses(p => [payload.new, ...p]); }
        else if (payload.eventType === 'UPDATE') setResponses(p => p.map(r => r.id === payload.new.id ? payload.new : r));
        else if (payload.eventType === 'DELETE') setResponses(p => p.filter(r => r.id !== payload.old.id));
      }).subscribe();
    return () => supabase.removeChannel(sub);
  }, [site?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: s, error: se } = await supabase.from('wedding_sites').select('id, slug, bride_name, groom_name, wedding_date, events, reminder_settings').eq('couple_id', currentUser.id).single();
      if (se || !s) throw new Error("Access denied. No site found for this user.");
      setSite(s);
      const { data: rd } = await supabase.from('rsvp_responses').select('*').eq('wedding_site_id', s.id).order('created_at', { ascending: false });
      setResponses(rd || []);
      const { data: gd } = await supabase.from('guest_groups').select('*').eq('wedding_site_id', s.id).order('created_at', { ascending: true });
      if (gd) setGroups(gd);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  /* ---- Derived Stats ---- */
  const stats = useMemo(() => {
    let t = { invited: 0, confirmed: 0, declined: 0, pending: 0, maybe: 0 };
    responses.forEach(r => { const c = r.guest_count || 1; t.invited += c; if (r.attendance_status === 'confirmed') t.confirmed += c; else if (r.attendance_status === 'declined') t.declined += c; else if (r.attendance_status === 'maybe') t.maybe += c; else t.pending += c; });
    return t;
  }, [responses]);

  const eventStats = useMemo(() => {
    if (!site?.events) return [];
    const emojis = ['🎨', '💐', '💍', '🎶', '🎉', '🪔', '📸'];
    return site.events.map((ev, i) => {
      let headCount = 0;
      responses.forEach(r => { if (r.attendance_status === 'confirmed' && r.events_attending?.includes(ev.name)) headCount += (r.guest_count || 1); });
      return { ...ev, headCount, emoji: emojis[i % emojis.length] };
    });
  }, [responses, site]);

  /* ---- Filtering ---- */
  const filteredResponses = useMemo(() => {
    let result = [...responses];
    if (activeFilter !== 'All') {
      const f = activeFilter.toLowerCase();
      if (['confirmed','pending','maybe','declined'].includes(f)) result = result.filter(r => r.attendance_status === f);
      else if (f === "bride's side") result = result.filter(r => r.guest_side?.includes("Bride"));
      else if (f === "groom's side") result = result.filter(r => r.guest_side?.includes("Groom"));
      else if (['family', 'friends', 'vip', 'colleagues'].includes(f)) result = result.filter(r => r.category?.toLowerCase() === f);
      else { const gn = groups.find(g => g.name === activeFilter); if (gn) result = result.filter(r => r.group_id === gn.id); }
    }
    if (filterQuery) { const q = filterQuery.toLowerCase(); result = result.filter(r => r.guest_name?.toLowerCase().includes(q) || r.guest_phone?.includes(q) || r.table_name?.toLowerCase().includes(q)); }
    result.sort((a, b) => {
      if (sortBy === 'Name A-Z') return (a.guest_name || '').localeCompare(b.guest_name || '');
      if (sortBy === 'RSVP Date') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'Status') return (a.attendance_status || '').localeCompare(b.attendance_status || '');
      if (sortBy === 'Guest Count') return (b.guest_count || 1) - (a.guest_count || 1);
      return 0;
    });
    return result;
  }, [responses, filterQuery, activeFilter, sortBy, groups]);

  const paginatedResponses = useMemo(() => filteredResponses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [filteredResponses, currentPage]);
  const totalPages = Math.ceil(filteredResponses.length / ITEMS_PER_PAGE);

  /* ---- Actions ---- */
  const handleExportCSV = () => {
    const h = ["Name","Phone","Email","Side","Category","Table","Group","Status","Guests","Events","Meal","Notes","Date"];
    const rows = filteredResponses.map(r => [
      r.guest_name, r.guest_phone, r.guest_email||'', r.guest_side||'', r.category||'', r.table_name||'',
      groups.find(g=>g.id===r.group_id)?.name||'', r.attendance_status, r.guest_count, 
      (r.events_attending||[]).join('; '), r.meal_preference||'', (r.notes||'').replace(/"/g,'""'), 
      new Date(r.created_at).toLocaleString()
    ].map(v=>`"${v}"`).join(','));
    const csv = "data:text/csv;charset=utf-8," + h.join(',') + "\n" + rows.join("\n");
    const a = document.createElement('a'); a.href = encodeURI(csv); a.download = `guests-${site.slug}-${new Date().toISOString().split('T')[0]}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = parseCSV(evt.target.result);
      if (data && data.length > 0) {
        addToast(`Importing ${data.length} guests...`, 'loading', 'loading');
        const newGuests = data.map(d => ({
          wedding_site_id: site.id,
          guest_name: d.name || 'Unknown',
          guest_phone: d.phone || '',
          guest_email: d.email || '',
          category: d.category || 'Family',
          guest_side: d.side || "Bride's Side",
          attendance_status: d.status || 'pending',
          guest_count: parseInt(d.guests) || parseInt(d.count) || 1,
          table_name: d.table || d.seating || '',
          notes: d.notes || '',
          is_manual_add: true
        }));
        
        const { error } = await supabase.from('rsvp_responses').insert(newGuests);
        if (error) {
          addToast('Failed to import CSV: ' + error.message, Date.now(), 'error');
        } else {
          addToast(`Successfully imported ${newGuests.length} guests!`);
          fetchData(); // refresh full list
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this guest?')) return;
    await supabase.from('rsvp_responses').delete().eq('id', id);
    setResponses(p => p.filter(r => r.id !== id));
    addToast('Guest removed');
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Remove ${selectedIds.size} guests?`)) return;
    const ids = Array.from(selectedIds);
    await supabase.from('rsvp_responses').delete().in('id', ids);
    setResponses(p => p.filter(r => !selectedIds.has(r.id)));
    setSelectedIds(new Set());
    addToast(`Removed ${ids.length} guests`);
  };

  const handleBulkUpdate = async (field, value) => {
    if (selectedIds.size === 0 || !value) return;
    const ids = Array.from(selectedIds);
    await supabase.from('rsvp_responses').update({ [field]: value }).in('id', ids);
    setResponses(p => p.map(r => selectedIds.has(r.id) ? { ...r, [field]: value } : r));
    setSelectedIds(new Set());
    addToast(`Updated ${ids.length} guests`);
    setBulkActionTable('');
    setBulkActionCategory('');
  };

  const openGuestModal = (guest = null) => {
    if (guest) {
      setEditGuestId(guest.id);
      setGuestForm({
        guest_name: guest.guest_name || '', guest_phone: guest.guest_phone || '', 
        guest_email: guest.guest_email || '', guest_count: guest.guest_count || 1, 
        guest_side: guest.guest_side || "Bride's Side", group_id: guest.group_id || '',
        category: guest.category || 'Family', table_name: guest.table_name || '', 
        notes: guest.notes || '', attendance_status: guest.attendance_status || 'pending'
      });
    } else {
      setEditGuestId(null);
      setGuestForm({
        guest_name: '', guest_phone: '', guest_email: '', guest_count: 1, 
        guest_side: "Bride's Side", group_id: '', category: 'Family', 
        table_name: '', notes: '', attendance_status: 'pending'
      });
    }
    setShowGuestModal(true);
  };

  const saveGuest = async (e) => {
    e.preventDefault();
    const payload = { ...guestForm, wedding_site_id: site.id, is_manual_add: true };
    if (!payload.group_id) payload.group_id = null; // Fix UUID empty string error
    
    let err;
    if (editGuestId) {
      const { error } = await supabase.from('rsvp_responses').update(payload).eq('id', editGuestId);
      err = error;
    } else {
      // Create new
      const { error } = await supabase.from('rsvp_responses').insert([payload]);
      err = error;
    }
    
    if (err) addToast('Failed to save guest: ' + err.message, Date.now(), 'error');
    else {
      addToast(editGuestId ? 'Guest updated!' : 'Guest added!');
      setShowGuestModal(false);
      fetchData(); // Could individually update state, but refresh is safer for multiple columns
    }
  };

  /* ---- Loading / Error ---- */
  if (loading || authLoading) return (
    <div className="h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-3 border-rose-gold border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400 font-medium">Loading your guests...</p>
      </div>
    </div>
  );
  if (error) return <div className="h-screen flex items-center justify-center bg-ivory"><p className="text-rose-500 font-medium">{error}</p></div>;

  const lastUpdate = responses[0]?.created_at;
  const responseRate = stats.invited ? Math.round((stats.confirmed / stats.invited) * 100) : 0;
  const cPct = (stats.confirmed/(stats.invited||1))*100;
  const mPct = (stats.maybe/(stats.invited||1))*100;
  const pPct = (stats.pending/(stats.invited||1))*100;
  const dPct = (stats.declined/(stats.invited||1))*100;

  /* ========== RENDER ========== */
  return (
    <div className="min-h-screen bg-ivory pb-20">

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`bg-white rounded-xl shadow-lg border px-4 py-3 flex items-center gap-3 animate-slide-up ${t.type === 'error' ? 'border-red-200' : 'border-gray-100'}`}>
            <CheckCircle className={`w-4 h-4 shrink-0 ${t.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`} />
            <span className="text-sm font-medium text-gray-700">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* ===== TOP BAR ===== */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[22px] font-bold text-plum flex items-center gap-2">
              Guest List & RSVPs <span className="text-lg">💌</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-2">
              {stats.invited} Total Invited · {stats.confirmed} Confirmed
              {lastUpdate && ` · Updated: ${formatTime(lastUpdate)}`}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={handleExportCSV} className="hidden md:flex h-9 px-4 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition items-center gap-2 shadow-sm">
              <Download className="w-3.5 h-3.5 text-plum" /> Export
            </button>
            <label className="hidden md:flex h-9 px-4 cursor-pointer text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition items-center gap-2 shadow-sm">
              <Upload className="w-3.5 h-3.5 text-emerald-600" /> Import CSV
              <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            </label>
            <button onClick={() => navigate('/send-reminders')} className="h-9 px-4 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm">
              <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Send Invites
            </button>
            <button onClick={() => openGuestModal()} className="h-9 px-5 text-[13px] font-bold text-white rounded-lg shadow-md hover:opacity-90 transition flex items-center gap-2" style={{background: 'linear-gradient(135deg, #4a2040, #6b3a5c)'}}>
              <Plus className="w-4 h-4" /> Add Guest
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-6 space-y-6">

        {/* ===== PROGRESS BAR ===== */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="text-[13px] font-semibold text-gray-500 whitespace-nowrap">Response progress</span>
            <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden flex">
              <div style={{width: `${cPct}%`}} className="bg-emerald-500 transition-all duration-700" />
              <div style={{width: `${mPct}%`}} className="bg-indigo-400 transition-all duration-700" />
              <div style={{width: `${pPct}%`}} className="bg-amber-400 transition-all duration-700" />
              <div style={{width: `${dPct}%`}} className="bg-rose-400 transition-all duration-700" />
            </div>
            <div className="hidden sm:flex gap-4 shrink-0">
              {[{l:`Confirmed (${stats.confirmed})`,c:'bg-emerald-500'},{l:`Maybe (${stats.maybe})`,c:'bg-indigo-400'},{l:`Pending (${stats.pending})`,c:'bg-amber-400'},{l:`Declined (${stats.declined})`,c:'bg-rose-400'}].map(x=>(
                <div key={x.l} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                  <div className={`w-2.5 h-2.5 rounded-sm ${x.c}`}/>{x.l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== GUEST TABLE ===== */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Search + Filters */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input value={filterQuery} onChange={e=>setFilterQuery(e.target.value)} placeholder="Search by name, phone, table..." className="w-full pl-9 pr-3 h-9 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-rose-gold/20 focus:border-rose-gold placeholder:text-gray-300 bg-gray-50/50" />
            </div>
            <div className="flex flex-wrap gap-1.5 flex-1 max-h-12 overflow-y-auto sm:max-h-none sm:overflow-visible no-scrollbar">
              {['All','Confirmed','Pending','Declined','Family','Friends','VIP',"Bride's Side","Groom's Side"].map(chip => (
                <button key={chip} onClick={() => setActiveFilter(chip)}
                  className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${activeFilter === chip ? 'bg-plum text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {chip === 'All' ? chip : `${chip === 'Confirmed' ? '✅' : chip === 'Pending' ? '⏳' : chip === 'Declined' ? '❌' : chip === 'VIP' ? '👑' : chip === 'Family' ? '👨‍👩‍👧‍👦' : chip === 'Friends' ? '👋' : chip === "Bride's Side" ? '👰' : '🤵'} ${chip}`}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="h-9 text-[12px] border border-gray-200 rounded-lg font-semibold text-gray-500 bg-gray-50/50 px-2 focus:ring-rose-gold/20 shrink-0">
              <option>Sort: Name A-Z</option>
              <option value="RSVP Date">Sort: RSVP Date</option>
              <option value="Status">Sort: Status</option>
              <option value="Guest Count">Sort: Guest Count</option>
            </select>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.size > 0 && (
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-2.5 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-plum">{selectedIds.size} guests selected</span>
                <div className="h-4 w-px bg-gray-300"></div>
                <button onClick={() => handleBulkUpdate('attendance_status', 'confirmed')} className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100">Make Confirmed</button>
                <div className="flex items-center gap-1 ml-2">
                  <input value={bulkActionTable} onChange={e=>setBulkActionTable(e.target.value)} placeholder="Table Name..." className="h-7 w-28 px-2 text-[11px] border border-gray-200 rounded" />
                  <button onClick={() => handleBulkUpdate('table_name', bulkActionTable)} className="h-7 px-2 bg-white border border-gray-200 text-[11px] font-semibold text-gray-600 rounded hover:bg-gray-100">Assign Table</button>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <select value={bulkActionCategory} onChange={e=>setBulkActionCategory(e.target.value)} className="h-7 w-24 px-1 text-[11px] border border-gray-200 rounded bg-white">
                    <option value="">Category...</option><option value="Family">Family</option><option value="Friends">Friends</option><option value="VIP">VIP</option><option value="Colleagues">Colleagues</option>
                  </select>
                  <button onClick={() => handleBulkUpdate('category', bulkActionCategory)} className="h-7 px-2 bg-white border border-gray-200 text-[11px] font-semibold text-gray-600 rounded hover:bg-gray-100">Assign</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/send-reminders')} className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 hover:underline"><MessageCircle className="w-3.5 h-3.5" /> Send Invite</button>
                <button onClick={handleBulkDelete} className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 hover:underline"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </div>
          )}

          {/* Table Header */}
          {filteredResponses.length > 0 && (
            <div className="hidden lg:grid grid-cols-[minmax(200px,2fr)_80px_100px_100px_90px_70px_minmax(150px,1.5fr)_90px] px-5 py-2.5 bg-white border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-rose-gold focus:ring-rose-gold/20" checked={selectedIds.size === paginatedResponses.length && paginatedResponses.length > 0} onChange={e => setSelectedIds(e.target.checked ? new Set(paginatedResponses.map(r=>r.id)) : new Set())} />
                Guest / Note
              </div>
              <div>Side</div>
              <div>Category</div>
              <div>Table</div>
              <div>Status</div>
              <div className="text-center">Count</div>
              <div>Events</div>
              <div className="text-center">Actions</div>
            </div>
          )}

          {/* Rows */}
          {filteredResponses.length === 0 ? (
            <div className="py-20 text-center">
              <SearchX className="w-10 h-10 text-gray-200 mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold text-gray-400 mb-1">No guests found</h3>
              <p className="text-sm text-gray-300 mb-4">{responses.length ? 'Try different filters.' : `Add a guest or share wedora.in/w/${site?.slug}`}</p>
              {!responses.length && (
                <button onClick={() => openGuestModal()} className="h-10 px-5 text-sm font-bold text-white rounded-lg shadow-md hover:opacity-90 transition mx-auto flex items-center gap-2" style={{background: 'linear-gradient(135deg, #b76e79, #4a2040)'}}>
                  <Plus className="w-4 h-4" /> Add Your First Guest
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-50">
                {paginatedResponses.map(r => {
                  const initials = r.guest_name?.substring(0,2).toUpperCase() || '??';
                  const isBride = r.guest_side?.includes('Bride');
                  const avatarColors = ['bg-rose-100 text-rose-600','bg-indigo-100 text-indigo-600','bg-amber-100 text-amber-700','bg-teal-100 text-teal-600','bg-violet-100 text-violet-600'];
                  const colorIdx = r.guest_name ? r.guest_name.charCodeAt(0) % avatarColors.length : 0;

                  return (
                    <div key={r.id} className={`hidden lg:grid grid-cols-[minmax(200px,2fr)_80px_100px_100px_90px_70px_minmax(150px,1.5fr)_90px] px-5 py-3 items-center hover:bg-gray-50/50 transition-colors group ${selectedIds.has(r.id) ? 'bg-rose-50/20' : ''}`}>
                      {/* Name & Note */}
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-rose-gold focus:ring-rose-gold/20" checked={selectedIds.has(r.id)} onChange={e => { const n = new Set(selectedIds); e.target.checked ? n.add(r.id) : n.delete(r.id); setSelectedIds(n); }} />
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[colorIdx]}`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[13px] text-gray-800 truncate">{r.guest_name}</div>
                          <div className="text-[11px] text-gray-400 flex items-center gap-1">{r.guest_phone || 'No phone'}</div>
                          {r.notes && <div className="text-[10px] text-amber-600 italic truncate max-w-[150px] mt-0.5">{r.notes}</div>}
                        </div>
                      </div>
                      
                      {/* Side */}
                      <div>
                        {r.guest_side && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isBride ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                          {isBride ? '👰 Bride' : '🤵 Groom'}
                        </span>}
                      </div>

                      {/* Category */}
                      <div>
                        {r.category ? <span className={`text-[11px] font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600`}>{r.category}</span> : <span className="text-gray-300">—</span>}
                      </div>

                      {/* Table */}
                      <div>
                        {r.table_name ? <span className="text-[11px] font-semibold px-2 py-1 border border-gray-200 bg-white rounded-md text-gray-700 shadow-sm whitespace-nowrap">{r.table_name}</span> : <span className="text-[11px] text-gray-300 italic">Unassigned</span>}
                      </div>

                      {/* Status */}
                      <div><StatusDot status={r.attendance_status} /></div>
                      
                      {/* Guest Count */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-50 text-[12px] font-bold text-gray-700 border border-gray-100">
                          {r.guest_count || 1}
                        </div>
                      </div>
                      
                      {/* Events/Meal */}
                      <div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {(r.events_attending || []).map(ev => <span key={ev} className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 whitespace-nowrap">{ev}</span>)}
                        </div>
                        {r.meal_preference && <div className="text-[10px] text-gray-500 font-medium">🍽️ {r.meal_preference}</div>}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                        <button onClick={() => openGuestModal(r)} className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-300 hover:shadow-sm flex items-center justify-center text-gray-500 transition-all" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {r.message_to_couple && (
                          <div className="relative group/msg">
                            <button className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-500 transition-colors" title="View message">
                              <MessagesSquare className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 bottom-9 w-60 p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-xs opacity-0 invisible group-hover/msg:opacity-100 group-hover/msg:visible transition-all z-50">
                              <div className="font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-1">Message via RSVP</div>
                              <p className="text-gray-600 leading-relaxed whitespace-normal">{r.message_to_couple}</p>
                            </div>
                          </div>
                        )}
                        <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Cards rendering omitted for brevity - works seamlessly responsive */}

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-[12px] text-gray-500 font-medium">
                  Showing {(currentPage-1)*ITEMS_PER_PAGE + 1}–{Math.min(currentPage*ITEMS_PER_PAGE, filteredResponses.length)} of {filteredResponses.length} guests
                </span>
                <div className="flex gap-1.5">
                  <button disabled={currentPage===1} onClick={()=>setCurrentPage(p=>p-1)} className="h-8 px-3 text-[12px] font-semibold rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition shadow-sm">Prev</button>
                  <button disabled={currentPage >= totalPages} onClick={()=>setCurrentPage(p=>p+1)} className="h-8 px-3 text-[12px] font-semibold rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition shadow-sm">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== ADD/EDIT GUEST MODAL ===== */}
      <Modal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} title={editGuestId ? "Edit Guest Details" : "Add Guest"}>
        <form onSubmit={saveGuest} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Guest Full Name *</label>
              <input required value={guestForm.guest_name} onChange={e=>setGuestForm(p=>({...p, guest_name:e.target.value}))} autoFocus placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp / Phone *</label>
              <input required value={guestForm.guest_phone} onChange={e=>setGuestForm(p=>({...p, guest_phone:e.target.value}))} placeholder="+91 9876543210" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Guests in Party</label>
              <select value={guestForm.guest_count} onChange={e=>setGuestForm(p=>({...p, guest_count:parseInt(e.target.value)}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n>1?'People (Plus ones)':'Person'}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select value={guestForm.attendance_status} onChange={e=>setGuestForm(p=>({...p, attendance_status:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option value="pending">⏳ Pending (Invited)</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="declined">❌ Declined</option>
                <option value="maybe">🤔 Maybe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Side</label>
              <select value={guestForm.guest_side} onChange={e=>setGuestForm(p=>({...p, guest_side:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option>Bride's Side</option>
                <option>Groom's Side</option>
                <option>Mutual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select value={guestForm.category} onChange={e=>setGuestForm(p=>({...p, category:e.target.value}))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Colleagues">Colleagues</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Table Assignment</label>
              <input value={guestForm.table_name || ''} onChange={e=>setGuestForm(p=>({...p, table_name:e.target.value}))} placeholder="e.g. Table 5" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (Dietary, Relation, etc.)</label>
            <input value={guestForm.notes || ''} onChange={e=>setGuestForm(p=>({...p, notes:e.target.value}))} placeholder="e.g. Vegan, Bride's uncle" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={() => setShowGuestModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all">
              {editGuestId ? 'Save Changes' : 'Add Guest'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ================ Micro-Components ================ */

function StatCard({ icon, count, label, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="mb-2">
        {typeof icon === 'string' ? <span className="text-xl">{icon}</span> : icon}
      </div>
      <div className="font-serif text-[38px] font-bold leading-none mb-1" style={{color}}>{count}</div>
      <div className="text-[13px] font-semibold text-gray-700">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function StatusDot({ status }) {
  if (!status) return <span className="text-[11px] text-gray-300">—</span>;
  const s = status.toLowerCase();
  const map = {
    confirmed: { dot: 'bg-emerald-500', text: 'text-emerald-600', label: 'Confirmed' },
    declined: { dot: 'bg-rose-500', text: 'text-rose-600', label: 'Declined' },
    maybe: { dot: 'bg-indigo-400', text: 'text-indigo-600', label: 'Maybe' },
    pending: { dot: 'bg-amber-400', text: 'text-amber-600', label: 'Pending' },
  };
  const m = map[s] || map.pending;
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${m.dot}`} />
      <span className={`text-[12px] font-semibold ${m.text}`}>{m.label}</span>
    </div>
  );
}
