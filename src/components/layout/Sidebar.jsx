import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Wallet, Users, CheckSquare, CalendarHeart, Heart, Settings, Store, Camera, LogOut, User, PenTool, Shield, Newspaper, ArrowLeftRight, Crown, Mail, MessageCircle, ShoppingBag, Briefcase, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getDaysUntil } from '../../utils/helpers';

export default function Sidebar({ isOpen, onClose }) {
  const { state } = useApp();
  const { currentUser, logout, isAdmin, isPro, weddings } = useAuth();
  const navigate = useNavigate();
  const daysLeft = getDaysUntil(state.wedding.weddingDate);
  const [pendingRsvps, setPendingRsvps] = useState(0);

  // Fetch initial pending RSVP count
  useEffect(() => {
    async function fetchPendingCount() {
      if (!currentUser) return;
      try {
        // Query to get the wedding sites mapping to this couple
        const { data: site } = await supabase
          .from('wedding_sites')
          .select('id')
          .eq('couple_id', currentUser.id)
          .single();
          
        if (site) {
          const { count } = await supabase
            .from('rsvp_responses')
            .select('*', { count: 'exact', head: true })
            .eq('wedding_site_id', site.id)
            .eq('attendance_status', 'pending');
          setPendingRsvps(count || 0);

          // Listen for live updates
          const channel = supabase.channel('sidebar_rsvp_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvp_responses', filter: `wedding_site_id=eq.${site.id}` }, payload => {
              if (payload.new && payload.new.attendance_status === 'pending') {
                setPendingRsvps(prev => prev + 1);
              } else if (payload.old && payload.old.attendance_status === 'pending' && payload.new?.attendance_status !== 'pending') {
                setPendingRsvps(prev => Math.max(0, prev - 1));
              }
            })
            .subscribe();
            
          return () => {
            supabase.removeChannel(channel);
          };
        }
      } catch (err) {
        console.error('Failed fetching pending RSVPs', err);
      }
    }
    fetchPendingCount();
  }, [currentUser]);

  const NAV_SECTIONS = [
    {
      label: 'MY WEDDING',
      items: [
        { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/budget', label: 'Budget Planner', icon: Wallet },
        { to: '/tasks', label: 'Checklist', icon: CheckSquare },
        { to: '/timeline', label: 'Timeline', icon: CalendarHeart },
        { to: '/vendors', label: 'My Vendors', icon: Store },
      ]
    },
    {
      label: 'WEDDING WEBSITE',
      items: [
        { to: '/my-website', label: 'My Wedding Page', icon: Globe },
        { to: '/dashboard/rsvp', label: 'Guests & RSVPs', icon: Users, badge: pendingRsvps > 0 ? pendingRsvps : null },
        { to: '/send-reminders', label: 'Send Invitations', icon: MessageCircle },
        { to: '/themes', label: 'Themes', icon: Camera },
      ]
    },
    {
      label: 'ACCOUNT',
      items: [
        { to: '/settings', label: 'Settings', icon: Settings },
        { to: '/upgrade', label: 'Upgrade Premium', icon: Crown },
      ]
    },
  ];

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

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="px-4 py-1 flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{section.label}</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>
              <div className="space-y-1">
                {section.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r from-rose-gold/15 to-rose-gold/5 text-rose-gold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        <item.icon className="w-[18px] h-[18px]" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
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

          {isAdmin && (
            <NavLink
              to="/admin/vendors"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-blue-600/15 to-blue-500/5 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              Vendor Moderation
            </NavLink>
          )}

          <NavLink
            to="/vendor/dashboard"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-gradient-to-r from-rose-gold/15 to-rose-gold/5 text-rose-gold shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Briefcase className="w-[18px] h-[18px]" />
            My Vendor Listing
          </NavLink>

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
