import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/helpers';
import { Plus, Trash2, Edit3, ChevronDown, ChevronUp, AlertTriangle, Download, RefreshCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function BudgetPage() {
  const { onMenuClick } = useOutletContext();
  const { state, dispatch } = useApp();
  const { wedding, budgetCategories, expenses } = state;

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAutoAllocate, setShowAutoAllocate] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);
  const [selectedCatId, setSelectedCatId] = useState(null);

  const [catForm, setCatForm] = useState({ name: '', icon: '📦', color: '#c0392b', allocated: '' });
  const [expForm, setExpForm] = useState({ name: '', amount: '', vendor: '', notes: '', paid: false });

  const totalBudget = wedding.totalBudget;
  const enrichedCategories = budgetCategories.map(c => {
    const spent = expenses.filter(e => e.categoryId === c.id).reduce((sum, e) => sum + Number(e.amount), 0);
    return { ...c, spent };
  });

  const totalAllocated = enrichedCategories.reduce((s, c) => s + c.allocated, 0);
  const totalSpent = enrichedCategories.reduce((s, c) => s + c.spent, 0);
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;
  const isOverAllocated = totalAllocated > totalBudget;

  const chartData = enrichedCategories.filter(c => c.allocated > 0).map(c => ({ name: c.name, value: c.allocated, color: c.color }));
  const barData = enrichedCategories.map(c => ({ name: c.name.split(' ')[0], allocated: c.allocated, spent: c.spent }));

  function handleAddCategory(e) {
    e.preventDefault();
    const data = { name: catForm.name, icon: catForm.icon, color: catForm.color, allocated: Number(catForm.allocated) || 0 };
    if (editCategory) {
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id: editCategory.id, ...data } });
    } else {
      dispatch({ type: 'ADD_CATEGORY', payload: data });
    }
    setCatForm({ name: '', icon: '📦', color: '#c0392b', allocated: '' });
    setEditCategory(null);
    setShowAddCategory(false);
  }

  function handleAddExpense(e) {
    e.preventDefault();
    const amt = Number(expForm.amount) || 0;
    dispatch({ type: 'ADD_EXPENSE', payload: { categoryId: selectedCatId, name: expForm.name, amount: amt, vendor: expForm.vendor, notes: expForm.notes, paid: expForm.paid } });
    setExpForm({ name: '', amount: '', vendor: '', notes: '', paid: false });
    setShowAddExpense(false);
  }

  function openEditCategory(cat) {
    setEditCategory(cat);
    setCatForm({ name: cat.name, icon: cat.icon, color: cat.color, allocated: cat.allocated });
    setShowAddCategory(true);
  }

  function openAddExpense(catId) {
    setSelectedCatId(catId);
    setExpForm({ name: '', amount: '', vendor: '', notes: '', paid: false });
    setShowAddExpense(true);
  }

  function exportBudgetCSV() {
    let csv = 'Category,Allocated,Spent,Remaining,Items\n';
    budgetCategories.forEach(cat => {
      const catExp = expenses.filter(e => e.categoryId === cat.id);
      const items = catExp.map(e => e.name).join('; ');
      csv += `"${cat.name}",${cat.allocated},${cat.spent},${cat.allocated - cat.spent},"${items}"\n`;
    });
    csv += `\n"TOTAL",${totalAllocated},${totalSpent},${totalAllocated - totalSpent},""\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'wedding_budget.csv';
    a.click();
  }

  function handleAutoAllocate() {
    if (totalBudget === 0) {
      alert("Set a total budget in Settings first.");
      setShowAutoAllocate(false);
      return;
    }
    
    // Calculate new allocations proportionally, or evenly if current is 0
    let totalCurrentAllocated = budgetCategories.reduce((s, c) => s + c.allocated, 0);
    
    enrichedCategories.forEach(cat => {
      let newAllocated = 0;
      if (totalCurrentAllocated > 0) {
        newAllocated = Math.round(totalBudget * (cat.allocated / totalCurrentAllocated));
      } else {
        newAllocated = Math.round(totalBudget / enrichedCategories.length);
      }
      dispatch({ type: 'UPDATE_CATEGORY', payload: { id: cat.id, allocated: newAllocated } });
    });
    
    setShowAutoAllocate(false);
  }

  return (
    <>
      <TopBar title="Budget Tracker" subtitle="Manage your wedding finances" onMenuClick={onMenuClick} />

      {/* Over Budget Warning */}
      {(isOverBudget || isOverAllocated) && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 flex items-center gap-3 animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">
              {isOverBudget ? 'Over Budget!' : 'Over-Allocated!'}
            </p>
            <p className="text-xs text-red-600">
              {isOverBudget
                ? `You've spent ${formatINR(Math.abs(remaining))} more than your total budget.`
                : `You've allocated ${formatINR(totalAllocated - totalBudget)} more than your total budget.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 stagger-children">
        {[
          { label: 'Total Budget', value: formatINR(totalBudget), color: 'text-gray-900' },
          { label: 'Allocated', value: formatINR(totalAllocated), color: isOverAllocated ? 'text-red-600' : 'text-amber-600' },
          { label: 'Spent', value: formatINR(totalSpent), color: 'text-rose-gold' },
          { label: 'Remaining', value: formatINR(remaining), color: remaining >= 0 ? 'text-emerald-600' : 'text-red-600' },
        ].map((item, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
            <p className={`text-xl font-serif font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 animate-fade-in-up">
          <h3 className="text-base font-serif font-bold text-gray-900 mb-4">Allocation Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-base font-serif font-bold text-gray-900 mb-4">Spent vs Allocated</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000)}k`} />
                <Tooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="allocated" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Allocated" />
                <Bar dataKey="spent" fill="#b76e79" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Categories Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-serif font-bold text-gray-900">Categories</h3>
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <button onClick={() => setShowAutoAllocate(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCcw className="w-4 h-4" /> Reset Proportions
          </button>
          <button onClick={exportBudgetCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => { setEditCategory(null); setCatForm({ name: '', icon: '📦', color: '#c0392b', allocated: '' }); setShowAddCategory(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {enrichedCategories.map(cat => {
          const pct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
          const catExpenses = expenses.filter(e => e.categoryId === cat.id);
          const isOpen = expandedCat === cat.id;
          const isOverSpent = cat.spent > cat.allocated;

          return (
            <div key={cat.id} className="glass-card overflow-hidden">
              <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpandedCat(isOpen ? null : cat.id)}>
                <div className="w-1 h-10 rounded-full mr-3" style={{ backgroundColor: cat.color }} />
                <span className="text-xl mr-3">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-48">
                      <div className={`h-full rounded-full transition-all duration-500 ${isOverSpent ? 'bg-red-400' : ''}`} style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: isOverSpent ? undefined : cat.color }} />
                    </div>
                    <span className={`text-xs ${isOverSpent ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{pct}%</span>
                  </div>
                </div>
                <div className="text-right mr-4 min-w-[120px]">
                  <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider">Estimated</p>
                  <p className="text-base font-bold text-gray-900">{formatINR(cat.allocated)}</p>
                  <p className={`text-xs mt-1 font-medium ${isOverSpent ? 'text-red-500' : 'text-emerald-600'}`}>
                    Spent: {formatINR(cat.spent)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); openEditCategory(cat); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_CATEGORY', payload: cat.id }); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3 bg-gray-50/30 animate-fade-in">
                  {catExpenses.length > 0 ? (
                    <div className="space-y-2">
                      {catExpenses.map(exp => (
                        <div key={exp.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{exp.name}</p>
                            {exp.vendor && <p className="text-xs text-gray-500">{exp.vendor}</p>}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => dispatch({ type: 'UPDATE_EXPENSE', payload: { id: exp.id, paid: !exp.paid } })}
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${exp.paid ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                            >
                              {exp.paid ? '✓ Paid' : 'Unpaid'}
                            </button>
                            <p className="text-sm font-bold text-gray-900">{formatINR(exp.amount)}</p>
                            <button onClick={() => dispatch({ type: 'DELETE_EXPENSE', payload: exp.id })}
                              className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 py-2">No expenses yet</p>
                  )}
                  <button onClick={() => openAddExpense(cat.id)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-rose-gold hover:underline">
                    <Plus className="w-3.5 h-3.5" /> Add Expense
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {budgetCategories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No budget categories yet. Add your first category!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      <Modal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} title={editCategory ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })}
                className="w-full h-[42px] rounded-xl border border-gray-200 cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Amount (₹)</label>
            <div className="relative">
              <input type="number" value={catForm.allocated} onChange={e => setCatForm({ ...catForm, allocated: e.target.value })}
                className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
              {totalBudget > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  {Math.round(((Number(catForm.allocated) || 0) / totalBudget) * 100)}%
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddCategory(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              {editCategory ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Expense">
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={expForm.name} onChange={e => setExpForm({ ...expForm, name: e.target.value })} required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" placeholder="e.g. Venue Deposit" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input type="number" value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input value={expForm.vendor} onChange={e => setExpForm({ ...expForm, vendor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20 outline-none transition-all text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="expPaid" checked={expForm.paid} onChange={e => setExpForm({ ...expForm, paid: e.target.checked })} className="rounded" />
            <label htmlFor="expPaid" className="text-sm text-gray-700">Already paid</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddExpense(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-gold to-plum text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">Add Expense</button>
          </div>
        </form>
      </Modal>

      {/* Auto Allocate Modal */}
      <Modal isOpen={showAutoAllocate} onClose={() => setShowAutoAllocate(false)} title="Reset Proportions">
        <div className="py-2 space-y-4">
          <p className="text-sm text-gray-600">
            This will recalculate the budgets for <b>all existing categories</b> to match your total budget of <b>{formatINR(totalBudget)}</b>.
          </p>
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-xl border border-blue-100">
            If you have manually changed allocations and they no longer add up, this will reset them to scale proportionally based on your Total Budget.
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowAutoAllocate(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button onClick={handleAutoAllocate} className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
              Recalculate Now
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
