import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { formatDate, getDaysUntil } from '../utils/helpers';
import { Plus, Trash2, CheckCircle2, Circle, Clock, ListTodo, Edit3 } from 'lucide-react';

export default function TasksPage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch } = useApp();
  const { tasks } = state;

  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', deadline: '', priority: 'medium', status: 'pending' });

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filtered = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  }).sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (b.status === 'completed' && a.status !== 'completed') return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (editTask) {
      dispatch({ type: 'UPDATE_TASK', payload: { id: editTask.id, ...form } });
    } else {
      dispatch({ type: 'ADD_TASK', payload: form });
    }
    setForm({ title: '', description: '', deadline: '', priority: 'medium', status: 'pending' });
    setEditTask(null);
    setShowAdd(false);
  }

  function openEdit(task) {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description || '',
      deadline: task.deadline || '',
      priority: task.priority,
      status: task.status,
    });
    setShowAdd(true);
  }

  const priorityLabels = {
    high: { text: 'High', variant: 'bg-red-50 text-red-600' },
    medium: { text: 'Medium', variant: 'bg-amber-50 text-amber-600' },
    low: { text: 'Low', variant: 'bg-blue-50 text-blue-600' },
  };

  const filterCounts = {
    all: total,
    pending: pending,
    'in-progress': inProgress,
    completed: completed,
  };

  return (
    <>
      <TopBar title="Tasks & Checklist" subtitle={`${completed}/${total} tasks completed`} onMenuClick={onMenuClick} />

      {/* Progress */}
      <div className="glass-card p-6 mb-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-600">Wedding Planning Progress</p>
            <p className="text-xs text-gray-400 mt-0.5">{pending} pending · {inProgress} in progress · {completed} done</p>
          </div>
          <p className="text-3xl font-serif font-bold gradient-text">{pct}%</p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-gold to-plum rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{completed} done</span>
          <span>{total - completed} remaining</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex gap-1.5">
          {(['all', 'pending', 'in-progress', 'completed']).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${filter === f ? 'bg-rose-gold/10 text-rose-gold' : 'text-gray-500 hover:bg-gray-100'}`}>
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-rose-gold/20 text-rose-gold' : 'bg-gray-100 text-gray-400'}`}>
                {filterCounts[f]}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => { setEditTask(null); setForm({ title: '', description: '', deadline: '', priority: 'medium', status: 'pending' }); setShowAdd(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task, idx) => {
          const isCompleted = task.status === 'completed';
          const days = getDaysUntil(task.deadline);

          return (
            <div key={task.id}
              className={`glass-card flex items-center gap-4 p-4 transition-all ${isCompleted ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${idx * 40}ms` }}>
              <button onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                className="flex-shrink-0 group">
                {isCompleted
                  ? <CheckCircle2 className="w-6 h-6 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                  : <Circle className="w-6 h-6 text-gray-300 group-hover:text-rose-gold transition-colors" />
                }
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>{task.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityLabels[task.priority].variant}`}>
                    {priorityLabels[task.priority].text}
                  </span>
                </div>
                {task.description && <p className="text-xs text-gray-500 truncate">{task.description}</p>}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {task.deadline && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${days <= 0 && !isCompleted ? 'text-red-500' : days <= 7 && !isCompleted ? 'text-amber-500' : 'text-gray-500'}`}>
                    <Clock className="w-3 h-3" />
                    {formatDate(task.deadline)}
                  </span>
                )}
                {task.status === 'in-progress' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">In Progress</span>
                )}
                <button onClick={() => openEdit(task)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => { if (window.confirm(`Delete task "${task.title}"?`)) dispatch({ type: 'DELETE_TASK', payload: task.id }); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ListTodo className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">{filter === 'all' ? 'No tasks yet. Add your first task!' : 'No tasks match the filter'}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Task Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={editTask ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. Book DJ for reception" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
          </div>
          {editTask && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold outline-none text-sm bg-white">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              {editTask ? 'Save' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
