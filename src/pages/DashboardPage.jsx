import { useOutletContext } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import { useApp } from '../context/AppContext';
import { formatINR, getDaysUntil, formatDate } from '../utils/helpers';
import { Wallet, Users, CheckSquare, CalendarHeart, TrendingDown, ArrowRight, AlertTriangle, MapPin, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { onMenuClick } = useOutletContext();
  const { state } = useApp();
  const { wedding, budgetCategories, expenses, guests, tasks, events } = state;

  const totalBudget = wedding.totalBudget;
  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalAllocated = budgetCategories.reduce((s, c) => s + c.allocated, 0);
  const remaining = totalBudget - totalSpent;
  const isOverBudget = remaining < 0;

  const totalGuests = guests.length;
  const acceptedGuests = guests.filter(g => g.rsvp === 'accepted').length;
  const pendingGuests = guests.filter(g => g.rsvp === 'pending').length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const upcomingTasks = tasks.filter(t => t.status !== 'completed').sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);
  const upcomingEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

  const chartData = budgetCategories.filter(c => c.allocated > 0).map(c => ({ name: c.name, value: c.allocated, color: c.color }));

  const daysLeft = getDaysUntil(wedding.weddingDate);

  // Countdown breakdown
  const months = Math.floor(daysLeft / 30);
  const weeks = Math.floor((daysLeft % 30) / 7);
  const days = daysLeft % 7;

  const summaryCards = [
    { title: 'Total Budget', value: formatINR(totalBudget), sub: `${formatINR(Math.abs(remaining))} ${remaining >= 0 ? 'remaining' : 'over'}`, icon: Wallet, color: 'from-emerald-500 to-teal-600' },
    { title: 'Total Spent', value: formatINR(totalSpent), sub: `${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget`, icon: TrendingDown, color: 'from-rose-gold to-rose-gold-light' },
    { title: 'Guests', value: totalGuests, sub: `${acceptedGuests} accepted, ${pendingGuests} pending`, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { title: 'Tasks Done', value: `${taskProgress}%`, sub: `${completedTasks}/${totalTasks} completed`, icon: CheckSquare, color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <>
      <TopBar title="Dashboard" subtitle={`Welcome back — ${daysLeft > 0 ? daysLeft : 0} days until the big day!`} onMenuClick={onMenuClick} />

      {/* Over Budget Warning */}
      {isOverBudget && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 flex items-center gap-3 animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">Over Budget Alert!</p>
            <p className="text-xs text-red-600">You've exceeded your budget by {formatINR(Math.abs(remaining))}. Consider reviewing your expenses.</p>
          </div>
          <Link to="/budget" className="ml-auto text-sm font-semibold text-red-600 hover:underline whitespace-nowrap">
            Review →
          </Link>
        </div>
      )}

      {/* Wedding Countdown Hero */}
      <div className="mb-8 relative overflow-hidden rounded-3xl animate-fade-in-up">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-gold via-[#c77d8a] to-plum" />
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-white/5 blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/5" />

        <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10 text-center">
          {/* Couple Names */}
          <div className="mb-1">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-3">The Wedding of</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
              {wedding.partner1}
              <span className="inline-block mx-2 sm:mx-3">
                <CalendarHeart className="w-5 h-5 sm:w-6 sm:h-6 inline-block text-white/70 -mt-1" />
              </span>
              {wedding.partner2}
            </h2>
          </div>

          {/* Date & Location badges */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium">
              <CalendarHeart className="w-3.5 h-3.5 text-white/80" />
              {formatDate(wedding.weddingDate)}
            </span>
            {wedding.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-white/80" />
                {wedding.location}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-6">
            <div className="h-px w-12 bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="h-px w-12 bg-white/20" />
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            {daysLeft > 30 && (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-white">{months}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60 mt-2">Months</span>
              </div>
            )}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white">{daysLeft > 30 ? weeks : Math.floor(daysLeft / 7)}</span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60 mt-2">Weeks</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white">{daysLeft > 30 ? days : daysLeft % 7}</span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60 mt-2">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {summaryCards.map((card, i) => (
          <div key={i} className="glass-card-hover p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-serif font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Budget Chart */}
        <div className="lg:col-span-1 glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Budget Breakdown</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(val) => formatINR(val)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {chartData.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{formatINR(d.value)}</span>
              </div>
            ))}
          </div>
          <Link to="/budget" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-gold hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-1 glass-card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Upcoming Tasks</h3>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map(task => {
                const daysTillDeadline = getDaysUntil(task.deadline);
                return (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(task.deadline)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${daysTillDeadline <= 7 ? 'bg-red-50 text-red-600' : daysTillDeadline <= 30 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {daysTillDeadline}d
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <CheckSquare className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">All tasks completed! 🎉</p>
            </div>
          )}
          <Link to="/tasks" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-gold hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* RSVP Summary */}
        <div className="lg:col-span-1 glass-card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Guest RSVP</h3>
          <div className="space-y-4">
            {[
              { label: 'Accepted', count: acceptedGuests, color: 'bg-emerald-500', pct: totalGuests > 0 ? (acceptedGuests / totalGuests * 100) : 0 },
              { label: 'Pending', count: pendingGuests, color: 'bg-amber-400', pct: totalGuests > 0 ? (pendingGuests / totalGuests * 100) : 0 },
              { label: 'Declined', count: guests.filter(g => g.rsvp === 'declined').length, color: 'bg-red-400', pct: totalGuests > 0 ? (guests.filter(g => g.rsvp === 'declined').length / totalGuests * 100) : 0 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-gold/10 to-plum/5 text-center">
            <p className="text-3xl font-serif font-bold text-gray-900">{totalGuests}</p>
            <p className="text-xs text-gray-500 font-medium">Total Guests</p>
          </div>
          <Link to="/guests" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-gold hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-gray-900">Upcoming Events</h3>
          <Link to="/timeline" className="text-sm font-semibold text-rose-gold hover:underline">View Timeline</Link>
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {upcomingEvents.map(ev => {
              const evDaysLeft = getDaysUntil(ev.date);
              return (
                <div key={ev.id} className="p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-rose-gold uppercase tracking-wider">{formatDate(ev.date)}</span>
                    {evDaysLeft > 0 && <span className="text-xs font-bold text-gray-400">{evDaysLeft}d</span>}
                  </div>
                  <p className="font-serif font-bold text-gray-900">{ev.name}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {ev.location}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <CalendarHeart className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No events yet. Add your first wedding event!</p>
          </div>
        )}
      </div>
    </>
  );
}
