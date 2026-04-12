import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { formatDate, formatTime, getDaysUntil } from '../utils/helpers';
import { Plus, Trash2, Edit3, MapPin, Clock, CalendarDays, PartyPopper } from 'lucide-react';

const EVENT_COLORS = [
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-violet-500',
  'from-rose-gold to-plum',
];

const EVENT_BG_COLORS = [
  'bg-rose-50/50 border-rose-100',
  'bg-amber-50/50 border-amber-100',
  'bg-emerald-50/50 border-emerald-100',
  'bg-blue-50/50 border-blue-100',
  'bg-purple-50/50 border-purple-100',
  'bg-pink-50/50 border-pink-100',
];

export default function TimelinePage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch } = useApp();
  const { events } = state;

  const [showAdd, setShowAdd] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', date: '', time: '', location: '' });

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastEvents = sorted.filter(ev => getDaysUntil(ev.date) < 0).length;
  const upcomingCount = sorted.length - pastEvents;

  function handleSubmit(e) {
    e.preventDefault();
    if (editEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: { id: editEvent.id, ...form } });
    } else {
      dispatch({ type: 'ADD_EVENT', payload: form });
    }
    setForm({ name: '', description: '', date: '', time: '', location: '' });
    setEditEvent(null);
    setShowAdd(false);
  }

  function openEdit(ev) {
    setEditEvent(ev);
    setForm({ name: ev.name, description: ev.description, date: ev.date, time: ev.time, location: ev.location });
    setShowAdd(true);
  }

  return (
    <>
      <TopBar title="Wedding Timeline" subtitle={`${events.length} events · ${upcomingCount} upcoming`} onMenuClick={onMenuClick} />

      <div className="flex justify-between items-center mb-6 animate-fade-in-up">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {pastEvents > 0 && (
            <span className="flex items-center gap-1">
              <PartyPopper className="w-4 h-4 text-emerald-500" />
              {pastEvents} completed
            </span>
          )}
          {upcomingCount > 0 && (
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-rose-gold" />
              {upcomingCount} upcoming
            </span>
          )}
        </div>
        <button onClick={() => { setEditEvent(null); setForm({ name: '', description: '', date: '', time: '', location: '' }); setShowAdd(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-gold/30 via-plum/20 to-transparent hidden sm:block" />

        <div className="space-y-6">
          {sorted.map((ev, i) => {
            const daysLeft = getDaysUntil(ev.date);
            const isPast = daysLeft < 0;
            const isToday = daysLeft === 0;
            const colorGradient = EVENT_COLORS[i % EVENT_COLORS.length];
            const bgColor = EVENT_BG_COLORS[i % EVENT_BG_COLORS.length];

            return (
              <div key={ev.id} className="relative flex gap-6 sm:pl-16 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                {/* Timeline dot */}
                <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-white shadow-md bg-gradient-to-br ${colorGradient} hidden sm:block ${isToday ? 'ring-4 ring-rose-gold/20' : ''}`} />

                {/* Card */}
                <div className={`flex-1 glass-card-hover p-6 ${isPast ? 'opacity-50' : ''} ${isToday ? 'ring-2 ring-rose-gold/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isPast ? 'text-gray-400' : 'text-rose-gold'}`}>
                          {formatDate(ev.date)}
                        </span>
                        {isToday && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-gold text-white animate-pulse-soft">
                            Today! 🎉
                          </span>
                        )}
                        {daysLeft > 0 && daysLeft <= 30 && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${daysLeft <= 7 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                            {daysLeft} days
                          </span>
                        )}
                        {isPast && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500">✓ Done</span>}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{ev.name}</h3>
                      {ev.description && <p className="text-sm text-gray-600 mb-3">{ev.description}</p>}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {ev.time && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50">
                            <Clock className="w-4 h-4 text-rose-gold" /> {formatTime(ev.time)}
                          </span>
                        )}
                        {ev.location && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50">
                            <MapPin className="w-4 h-4 text-rose-gold" /> {ev.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button onClick={() => openEdit(ev)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if (window.confirm(`Delete event "${ev.name}"?`)) dispatch({ type: 'DELETE_EVENT', payload: ev.id }); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No events yet</p>
            <p className="text-xs text-gray-300 mt-1">Add your first wedding event to start building your timeline</p>
          </div>
        )}
      </div>

      {/* Add/Edit Event Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={editEvent ? 'Edit Event' : 'Add Event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. Sangeet Night" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. Taj Lake Palace, Udaipur" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              {editEvent ? 'Save' : 'Add Event'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
