import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { INSPIRATION_CATEGORIES } from '../data/templates';
import { Plus, Trash2, Heart, X, Link2, Tag, ImagePlus, ExternalLink } from 'lucide-react';

export default function InspirationPage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch } = useApp();
  const { inspirations } = state;

  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('All');
  const [viewImg, setViewImg] = useState(null);

  const [form, setForm] = useState({ imageUrl: '', title: '', category: 'Decor', notes: '' });

  const filtered = filter === 'All' ? inspirations : inspirations.filter(ins => ins.category === filter);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.imageUrl.trim()) return;
    dispatch({
      type: 'ADD_INSPIRATION',
      payload: {
        imageUrl: form.imageUrl.trim(),
        title: form.title.trim(),
        category: form.category,
        notes: form.notes.trim(),
        liked: false,
      },
    });
    setForm({ imageUrl: '', title: '', category: 'Decor', notes: '' });
    setShowAdd(false);
  }

  function toggleLike(id) {
    const ins = inspirations.find(i => i.id === id);
    if (ins) {
      dispatch({ type: 'UPDATE_INSPIRATION', payload: { id, liked: !ins.liked } });
    }
  }

  // Count per category
  const categoryCounts = {};
  INSPIRATION_CATEGORIES.forEach(c => { categoryCounts[c] = inspirations.filter(ins => ins.category === c).length; });

  return (
    <>
      <TopBar title="Inspiration Board" subtitle={`${inspirations.length} saved ideas`} onMenuClick={onMenuClick} />

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in-up">
        <button onClick={() => setFilter('All')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'All' ? 'bg-rose-gold/10 text-rose-gold' : 'text-gray-500 hover:bg-gray-100'
          }`}>
          All ({inspirations.length})
        </button>
        {INSPIRATION_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === cat ? 'bg-rose-gold/10 text-rose-gold' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            {cat} {categoryCounts[cat] > 0 && `(${categoryCounts[cat]})`}
          </button>
        ))}

        <div className="ml-auto flex-shrink-0">
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Add Inspiration
          </button>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((ins, idx) => (
          <div key={ins.id} className="break-inside-avoid glass-card-hover overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
            {/* Image */}
            <div className="relative cursor-pointer" onClick={() => setViewImg(ins)}>
              <img
                src={ins.imageUrl}
                alt={ins.title || 'Wedding inspiration'}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://placehold.co/400x300/fdf2f0/b76e79?text=Image+Not+Found'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0">
                  {ins.title && <p className="text-sm font-semibold text-gray-900 truncate">{ins.title}</p>}
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-gold mt-0.5">
                    <Tag className="w-3 h-3" /> {ins.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button onClick={() => toggleLike(ins.id)}
                    className={`p-1.5 rounded-lg transition-colors ${ins.liked ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'}`}>
                    <Heart className="w-4 h-4" fill={ins.liked ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => dispatch({ type: 'DELETE_INSPIRATION', payload: ins.id })}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {ins.notes && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ins.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <ImagePlus className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">{inspirations.length === 0 ? 'No inspiration saved yet' : 'No matches for this category'}</p>
          <p className="text-xs text-gray-300 mt-1">Add image URLs from Pinterest, Instagram, or wedding blogs</p>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Inspiration">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              <Link2 className="w-4 h-4 text-rose-gold" /> Image URL *
            </label>
            <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
              placeholder="https://example.com/image.jpg" />
            <p className="text-xs text-gray-400 mt-1">Paste an image URL from Pinterest, Unsplash, or any website</p>
          </div>

          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-gray-200 max-h-48">
              <img src={form.imageUrl} alt="Preview" className="w-full h-48 object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/400x200/fee2e2/991b1b?text=Invalid+URL'; }} />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
              placeholder="e.g. Rose gold table setting" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
              {INSPIRATION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm"
              placeholder="e.g. Love this color palette!" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Image Lightbox */}
      {viewImg && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewImg(null)}>
          <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={viewImg.imageUrl} alt={viewImg.title} className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            <button onClick={() => setViewImg(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-600" />
            </button>
            {viewImg.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl">
                <p className="text-white font-semibold text-sm">{viewImg.title}</p>
                <p className="text-white/70 text-xs mt-0.5">{viewImg.category}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
