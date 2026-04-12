import { Menu, Bell, AlertTriangle, AlertCircle, CalendarClock, ChevronRight, Crown, ArrowLeftRight, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';
import InviteModal from '../ui/InviteModal';

export default function TopBar({ title, subtitle, onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { notifications, count } = useNotifications();
  const { isPro } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   return (
    <>
    <header className="flex items-center justify-between gap-3 mb-6 lg:mb-8 relative z-30">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5 hidden sm:block truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Share / Invite Partner button */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:text-plum hover:border-plum/30 hover:bg-plum/5 transition-all shadow-sm group"
          title="Share Invite"
        >
          <Users className="w-4 h-4 text-gray-400 group-hover:text-plum transition-colors" />
          <span className="hidden sm:inline ml-1.5">Share Invite</span>
        </button>

        {/* Switch Plan button */}
        <button
          onClick={() => navigate('/weddings')}
          className="inline-flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-md shadow-amber-200/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          title="Switch Wedding Plan"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="hidden sm:inline ml-1.5">Switch Wedding Plan</span>
        </button>

        {/* Upgrade to Pro CTA — only shown to free users */}
        {!isPro && (
          <a
            href="mailto:support@wedora.in?subject=Upgrade%20to%20Wedora%20Pro&body=Hi%2C%20I%20would%20like%20to%20upgrade%20my%20Wedora%20account%20to%20Pro."
            className="inline-flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-md shadow-amber-200/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            title="Upgrade to Pro"
          >
            <Crown className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Upgrade to Pro</span>
          </a>
        )}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2.5 rounded-xl hover:bg-white transition-all duration-300">
            <Bell className="w-[22px] h-[22px] text-gray-600" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#FAF9F7] animate-pulse"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 glass-card p-2 origin-top-right animate-fade-in z-50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 py-2">Alerts</h3>
              {count === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-1">
                  {notifications.map(alert => (
                    <div key={alert.id} onClick={() => { navigate(alert.link); setShowDropdown(false); }}
                      className="p-3 rounded-xl hover:bg-white cursor-pointer transition-colors flex gap-3 group">
                      <div className="mt-0.5">
                        {alert.type.includes('overdue') ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : alert.type.includes('vendor') ? (
                          <AlertCircle className="w-4 h-4 text-rose-gold" />
                        ) : (
                          <CalendarClock className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${alert.isUrgent ? 'text-gray-900' : 'text-gray-700'}`}>{alert.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
    <InviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </>
  );
}
