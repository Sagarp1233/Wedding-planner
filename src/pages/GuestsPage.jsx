import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { parseCSV } from '../utils/helpers';
import { Plus, Trash2, Edit3, Search, Download, Phone, Mail, Users, UserCheck, UserX, Clock, Upload, MessageCircle, Settings, X, CheckSquare, Send, Calendar } from 'lucide-react';

export default function GuestsPage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch } = useApp();
  const { guests } = state;

  const [showAdd, setShowAdd] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showBulkSendModal, setShowBulkSendModal] = useState(false);
  const [whatsappTemplate, setWhatsappTemplate] = useState(state.wedding.whatsappTemplate || 'Hi {name}, you have been invited to {partner1} and {partner2}\'s wedding! We would love for you to join us on {date}. Please let us know if you can make it.');
  
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterRsvp, setFilterRsvp] = useState('All');

  const [selectedGuests, setSelectedGuests] = useState([]);
  const [bulkTableInput, setBulkTableInput] = useState('');

  const [form, setForm] = useState({ name: '', phone: '', email: '', category: 'Family', rsvp: 'pending', plusOne: false, notes: '', table: '' });

  const filtered = guests.filter(g => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat !== 'All' && g.category !== filterCat) return false;
    if (filterRsvp !== 'All' && g.rsvp !== filterRsvp) return false;
    return true;
  });

  const rsvpBadge = (rsvp) => {
    const map = { accepted: 'success', pending: 'warning', declined: 'danger' };
    return <Badge variant={map[rsvp] || 'default'}>{rsvp.charAt(0).toUpperCase() + rsvp.slice(1)}</Badge>;
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (editGuest) {
      dispatch({ type: 'UPDATE_GUEST', payload: { id: editGuest.id, ...form } });
    } else {
      dispatch({ type: 'ADD_GUEST', payload: form });
    }
    setForm({ name: '', phone: '', email: '', category: 'Family', rsvp: 'pending', plusOne: false, notes: '', table: '' });
    setEditGuest(null);
    setShowAdd(false);
  }

  function openEdit(g) {
    setEditGuest(g);
    setForm({ name: g.name, phone: g.phone, email: g.email, category: g.category, rsvp: g.rsvp, plusOne: g.plusOne, notes: g.notes || '', table: g.table || '' });
    setShowAdd(true);
  }

  function exportCSV() {
    let csv = 'Name,Phone,Email,Category,RSVP,Plus One,Table,Notes\n';
    guests.forEach(g => { csv += `"${g.name}","${g.phone}","${g.email}","${g.category}","${g.rsvp}","${g.plusOne ? 'Yes' : 'No'}","${g.table || ''}","${g.notes || ''}"\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'guest_list.csv'; a.click();
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = parseCSV(evt.target.result);
      if (data && data.length > 0) {
        const newGuests = data.map(d => ({
          name: d.name || 'Unknown',
          phone: d.phone || '',
          email: d.email || '',
          category: d.category || 'Family',
          rsvp: ['accepted', 'pending', 'declined'].includes(d.rsvp?.toLowerCase()) ? d.rsvp.toLowerCase() : 'pending',
          plusOne: d['plus one']?.toLowerCase() === 'yes' || d.plusone?.toLowerCase() === 'yes',
          notes: d.notes || '',
          table: d.table || d.seating || ''
        }));
        // Use bulk add
        dispatch({ type: 'ADD_GUESTS', payload: newGuests });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  }

  function saveWhatsappTemplate(e) {
    e.preventDefault();
    dispatch({ type: 'UPDATE_WEDDING', payload: { whatsappTemplate } });
    setShowWhatsappModal(false);
  }

  function sendWhatsapp(guest) {
    if (!guest.phone) {
      alert("This guest doesn't have a phone number.");
      return;
    }
    let msg = whatsappTemplate
      .replace(/{name}/g, guest.name)
      .replace(/{partner1}/g, state.wedding.partner1 || 'us')
      .replace(/{partner2}/g, state.wedding.partner2 || '')
      .replace(/{date}/g, state.wedding.weddingDate || 'our special day');
    
    // Cleanup double spaces if partner2 is missing
    msg = msg.replace(/ and 's/g, "'s");

    const phoneNum = guest.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // Bulk Actions
  function handleSelectAll(e) {
    if (e.target.checked) setSelectedGuests(filtered.map(g => g.id));
    else setSelectedGuests([]);
  }

  function handleSelectRow(id) {
    setSelectedGuests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  function handleBulkRsvp(status) {
    selectedGuests.forEach(id => dispatch({ type: 'UPDATE_GUEST', payload: { id, rsvp: status } }));
    setSelectedGuests([]);
  }

  function handleBulkDelete() {
    if (confirm(`Are you sure you want to delete ${selectedGuests.length} guests?`)) {
      selectedGuests.forEach(id => dispatch({ type: 'DELETE_GUEST', payload: id }));
      setSelectedGuests([]);
    }
  }

  function handleBulkTable() {
    selectedGuests.forEach(id => dispatch({ type: 'UPDATE_GUEST', payload: { id, table: bulkTableInput } }));
    setBulkTableInput('');
    setSelectedGuests([]);
  }

  const stats = {
    total: guests.length,
    accepted: guests.filter(g => g.rsvp === 'accepted').length,
    pending: guests.filter(g => g.rsvp === 'pending').length,
    declined: guests.filter(g => g.rsvp === 'declined').length,
    plusOnes: guests.filter(g => g.plusOne).length,
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: Users, color: 'from-gray-500 to-gray-600' },
    { label: 'Accepted', value: stats.accepted, icon: UserCheck, color: 'from-emerald-500 to-teal-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Declined', value: stats.declined, icon: UserX, color: 'from-red-400 to-red-500' },
  ];

  return (
    <>
      <TopBar title="Guest Management" subtitle={`${stats.total} guests invited · ${stats.total + stats.plusOnes} with plus-ones`} onMenuClick={onMenuClick} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 stagger-children">
        {statCards.map((s, i) => (
          <div key={i} className="glass-card-hover p-4 text-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-serif font-bold text-gray-900">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 animate-fade-in-up">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guests..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-rose-gold outline-none">
            <option value="All">All Categories</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="VIP">VIP</option>
          </select>
          <select value={filterRsvp} onChange={e => setFilterRsvp(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-rose-gold outline-none">
            <option value="All">All RSVP</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button onClick={() => setShowWhatsappModal(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors">
            <MessageCircle className="w-4 h-4" /> Message Setup
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" /> Bulk Import
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
          <button onClick={() => { setEditGuest(null); setForm({ name: '', phone: '', email: '', category: 'Family', rsvp: 'pending', plusOne: false, notes: '' }); setShowAdd(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Add Guest
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedGuests.length > 0 && (
        <div className="bg-white border rounded-xl shadow-lg p-3 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 whitespace-nowrap">
            <CheckSquare className="w-5 h-5 text-rose-gold" />
            {selectedGuests.length} selected
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleBulkRsvp('accepted')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">Mark Accepted</button>
            <button onClick={() => handleBulkRsvp('declined')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Mark Declined</button>
            <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-1">
              <input value={bulkTableInput} onChange={e => setBulkTableInput(e.target.value)} placeholder="Table # or Name" className="w-32 px-2 py-1.5 text-xs border rounded-lg outline-none" />
              <button onClick={handleBulkTable} className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">Assign</button>
            </div>
            <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>
            <button onClick={() => setShowBulkSendModal(true)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">Bulk WhatsApp</button>
            <button onClick={handleBulkDelete} className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 w-10">
                  <input type="checkbox" checked={filtered.length > 0 && selectedGuests.length === filtered.length} onChange={handleSelectAll} className="rounded border-gray-300" />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name & Table</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">RSVP</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedGuests.includes(g.id) ? 'bg-rose-50/30' : ''}`}>
                  <td className="px-5 py-3">
                    <input type="checkbox" checked={selectedGuests.includes(g.id)} onChange={() => handleSelectRow(g.id)} className="rounded border-gray-300" />
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{g.name}</p>
                      <div className="flex gap-2 items-center mt-0.5">
                        {g.plusOne && <span className="text-xs text-rose-gold font-medium">+1</span>}
                        {g.table && <Badge variant="info">Table: {g.table}</Badge>}
                      </div>
                      {g.notes && <p className="text-xs text-gray-400 mt-1 truncate max-w-[150px]">{g.notes}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      {g.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {g.phone}</span>}
                      {g.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {g.email}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={g.category === 'VIP' ? 'purple' : g.category === 'Family' ? 'rose' : 'info'}>
                      {g.category}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => {
                        const nextRsvp = g.rsvp === 'pending' ? 'accepted' : g.rsvp === 'accepted' ? 'declined' : 'pending';
                        dispatch({ type: 'UPDATE_GUEST', payload: { id: g.id, rsvp: nextRsvp } });
                      }}
                      className="cursor-pointer"
                    >
                      {rsvpBadge(g.rsvp)}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => sendWhatsapp(g)} title="Send Message" className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(g)} title="Edit Guest" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete guest "${g.name}"?`)) dispatch({ type: 'DELETE_GUEST', payload: g.id }); }} title="Delete Guest" className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Users className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">{search || filterCat !== 'All' || filterRsvp !== 'All' ? 'No guests match your filters' : 'No guests yet. Add your first guest!'}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Guest Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={editGuest ? 'Edit Guest' : 'Add Guest'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option>Family</option><option>Friends</option><option>VIP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RSVP Status</label>
              <select value={form.rsvp} onChange={e => setForm({ ...form, rsvp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option value="pending">Pending</option><option value="accepted">Accepted</option><option value="declined">Declined</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
              placeholder="e.g. Bride's cousin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Table Assignment</label>
            <input value={form.table} onChange={e => setForm({ ...form, table: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
              placeholder="e.g. Table 1, VIP" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="plusOne" checked={form.plusOne} onChange={e => setForm({ ...form, plusOne: e.target.checked })} className="rounded" />
            <label htmlFor="plusOne" className="text-sm text-gray-700">Plus One</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              {editGuest ? 'Save' : 'Add Guest'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Whatsapp Configuration Modal */}
      <Modal isOpen={showWhatsappModal} onClose={() => setShowWhatsappModal(false)} title="WhatsApp Message Setup">
        <form onSubmit={saveWhatsappTemplate} className="space-y-4">
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-sm">
            Configure the message that will be PRE-FILLED when you click the WhatsApp button next to a guest.
            Available placeholders: <br/> <b>{'{name}'}</b>, <b>{'{partner1}'}</b>, <b>{'{partner2}'}</b>, <b>{'{date}'}</b>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
            <textarea value={whatsappTemplate} onChange={e => setWhatsappTemplate(e.target.value)} required rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm resize-none" />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowWhatsappModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Save Template
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Send Campaign Modal */}
      <Modal isOpen={showBulkSendModal} onClose={() => setShowBulkSendModal(false)} title="Bulk Send WhatsApp" size="sm">
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs border border-amber-100">
            <strong>Browser Restriction Notice:</strong> Auto-opening {selectedGuests.length} tabs at once will trigger browser popup blockers. 
            This tool will show you a queue. Click "Send" for each guest one-by-one to safely open their chat.
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {guests.filter(g => selectedGuests.includes(g.id)).map((g) => (
              <div key={g.id} className="flex items-center justify-between p-2.5 border rounded-lg text-sm bg-white">
                <div>
                  <span className="font-medium text-gray-900">{g.name}</span>
                  {g.phone ? (
                    <span className="text-xs text-gray-500 block">{g.phone}</span>
                  ) : (
                    <span className="text-xs text-red-500 block">No phone number</span>
                  )}
                </div>
                <button 
                  onClick={() => sendWhatsapp(g)} 
                  disabled={!g.phone}
                  className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Send
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowBulkSendModal(false)} className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">Done</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
