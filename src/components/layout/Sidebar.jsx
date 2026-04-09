import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, Users, CheckSquare, CalendarHeart, Heart, Settings, Store, Camera, LogOut, User, PenTool, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getDaysUntil } from '../../utils/helpers';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/guests', label: 'Guests', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/timeline', label: 'Timeline', icon: CalendarHeart },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/inspiration', label: 'Inspiration', icon: Camera },
];

export default function Sidebar({ isOpen, onClose }) {
  const { state } = useApp();
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const daysLeft = getDaysUntil(state.wedding.weddingDate);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 z-50 glass-sidebar flex flex-col
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Brand */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-lg shadow-rose-gold/20">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-gray-900">Wedora</h1>
              <p className="text-xs text-gray-500 font-medium">
                {state.wedding.partner1 && state.wedding.partner2
                  ? `${state.wedding.partner1} & ${state.wedding.partner2}`
                  : 'Your Wedding'}
              </p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        {state.wedding.weddingDate && (
          <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-rose-gold/10 to-plum/5 border border-rose-gold/10">
            <p className="text-xs font-semibold text-rose-gold uppercase tracking-wider mb-1">Wedding Day</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-serif font-bold text-gray-900 animate-count-pulse">{daysLeft > 0 ? daysLeft : 0}</p>
              <span className="text-sm font-sans font-medium text-gray-500">days to go</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(state.wedding.weddingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {state.wedding.location && (
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                📍 {state.wedding.location}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-1">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-rose-gold/15 to-rose-gold/5 text-rose-gold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600/15 to-blue-500/5 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Shield className="w-[18px] h-[18px]" />
              Admin Dashboard
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin/blog"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600/15 to-blue-500/5 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <PenTool className="w-[18px] h-[18px]" />
              Admin Blog
            </NavLink>
          )}

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-gradient-to-r from-rose-gold/15 to-rose-gold/5 text-rose-gold shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </NavLink>

          {/* User info */}
          {currentUser && (
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-gold/20 to-plum/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-rose-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{currentUser.user_metadata?.full_name || currentUser.name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <p className="text-[10px] text-gray-300 text-center mt-1 mb-1">Wedora v2.0</p>
        </div>
      </aside>
    </>
  );
}
