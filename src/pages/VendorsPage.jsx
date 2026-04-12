import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';
import { VENDOR_CATEGORIES } from '../data/templates';
import { Plus, Trash2, Edit3, Phone, Mail, MapPin, Store, Search, Download, Filter } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'shortlisted', label: 'Shortlisted', variant: 'info' },
  { value: 'contacted', label: 'Contacted', variant: 'warning' },
  { value: 'booked', label: 'Booked', variant: 'success' },
  { value: 'paid', label: 'Fully Paid', variant: 'purple' },
  { value: 'completed', label: 'Completed', variant: 'default' },
];

export default function VendorsPage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch } = useApp();
  const { vendors } = state;

  const [showAdd, setShowAdd] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const emptyForm = {
    name: '', category: 'venue', contactPerson: '', phone: '', email: '',
    location: '', quotedAmount: '', advancePaid: '', nextPaymentDate: '', notes: '', status: 'shortlisted',
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = vendors.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.contactPerson?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat !== 'All' && v.category !== filterCat) return false;
    if (filterStatus !== 'All' && v.status !== filterStatus) return false;
    return true;
  });

  const totalQuoted = vendors.reduce((s, v) => s + (v.quotedAmount || 0), 0);
  const totalPaid = vendors.reduce((s, v) => s + (v.advancePaid || 0), 0);
  const totalBalance = totalQuoted - totalPaid;
  const booked = vendors.filter(v => ['booked', 'paid', 'completed'].includes(v.status)).length;

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...form,
      quotedAmount: Number(form.quotedAmount) || 0,
      advancePaid: Number(form.advancePaid) || 0,
    };
    if (editVendor) {
      dispatch({ type: 'UPDATE_VENDOR', payload: { id: editVendor.id, ...data } });
    } else {
      dispatch({ type: 'ADD_VENDOR', payload: data });
    }
    setForm(emptyForm);
    setEditVendor(null);
    setShowAdd(false);
  }

  function openEdit(v) {
    setEditVendor(v);
    setForm({
      name: v.name, category: v.category, contactPerson: v.contactPerson || '',
      phone: v.phone || '', email: v.email || '', location: v.location || '',
      quotedAmount: v.quotedAmount || '', advancePaid: v.advancePaid || '',
      nextPaymentDate: v.nextPaymentDate || '',
      notes: v.notes || '', status: v.status,
    });
    setShowAdd(true);
  }

  function exportCSV() {
    let csv = 'Name,Category,Contact,Phone,Email,Quoted,Paid,Balance,Next Payment,Status\n';
    vendors.forEach(v => {
      const cat = VENDOR_CATEGORIES.find(c => c.value === v.category)?.label || v.category;
      csv += `"${v.name}","${cat}","${v.contactPerson || ''}","${v.phone || ''}","${v.email || ''}",${v.quotedAmount || 0},${v.advancePaid || 0},${(v.quotedAmount || 0) - (v.advancePaid || 0)},"${v.nextPaymentDate || ''}","${v.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'vendors.csv'; a.click();
  }

  return (
    <>
      <TopBar title="Vendor Tracker" subtitle={`${vendors.length} vendors · ${booked} booked`} onMenuClick={onMenuClick} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 stagger-children">
        {[
          { label: 'Total Vendors', value: vendors.length, color: 'text-gray-900' },
          { label: 'Total Quoted', value: formatINR(totalQuoted), color: 'text-amber-600' },
          { label: 'Advance Paid', value: formatINR(totalPaid), color: 'text-rose-gold' },
          { label: 'Balance Due', value: formatINR(totalBalance), color: totalBalance > 0 ? 'text-red-500' : 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-xl font-serif font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 animate-fade-in-up">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm bg-white" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-rose-gold outline-none">
            <option value="All">All Categories</option>
            {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-rose-gold outline-none">
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => { setEditVendor(null); setForm(emptyForm); setShowAdd(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((v, idx) => {
          const cat = VENDOR_CATEGORIES.find(c => c.value === v.category);
          const balance = (v.quotedAmount || 0) - (v.advancePaid || 0);
          const statusOpt = STATUS_OPTIONS.find(s => s.value === v.status);

          return (
            <div key={v.id} className="glass-card-hover p-5" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat?.emoji || '📦'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{v.name}</h3>
                    <p className="text-xs text-gray-500">{cat?.label || v.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={statusOpt?.variant || 'default'}>{statusOpt?.label || v.status}</Badge>
                  <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (window.confirm(`Delete vendor "${v.name}"?`)) dispatch({ type: 'DELETE_VENDOR', payload: v.id }); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                {v.contactPerson && <span>👤 {v.contactPerson}</span>}
                {v.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {v.phone}</span>}
                {v.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {v.email}</span>}
                {v.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.location}</span>}
              </div>

              {/* Cost breakdown */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Quoted</p>
                  <p className="text-sm font-bold text-gray-900">{formatINR(v.quotedAmount || 0)}</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="text-sm font-bold text-emerald-600">{formatINR(v.advancePaid || 0)}</p>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-4">
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className={`text-sm font-bold ${balance > 0 ? 'text-red-500' : 'text-gray-400'}`}>{formatINR(balance)}</p>
                </div>
              </div>

              {v.nextPaymentDate && balance > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md mt-2 inline-block">
                  Next Payment Due: <span className="font-semibold">{new Date(v.nextPaymentDate).toLocaleDateString()}</span>
                </div>
              )}

              {v.notes && (
                <p className="text-xs text-gray-400 mt-2 truncate">📝 {v.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Store className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">{vendors.length === 0 ? 'No vendors yet' : 'No vendors match your filters'}</p>
          <p className="text-xs text-gray-300 mt-1">Add your first vendor to start tracking contacts and payments</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={editVendor ? 'Edit Vendor' : 'Add Vendor'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Business Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. Royal Caterers" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                {VENDOR_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. Mr. Sharma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. 9876543210" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Amount (₹)</label>
              <input type="number" value={form.quotedAmount} onChange={e => setForm({ ...form, quotedAmount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advance Paid (₹)</label>
              <input type="number" value={form.advancePaid} onChange={e => setForm({ ...form, advancePaid: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Payment Date</label>
              <input type="date" value={form.nextPaymentDate} onChange={e => setForm({ ...form, nextPaymentDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm resize-none"
              placeholder="e.g. Confirmed for 500 pax menu, 2 live counters" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              {editVendor ? 'Save' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
