import { Menu, Bell, AlertTriangle, AlertCircle, CalendarClock, ChevronRight, Crown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../context/AuthContext';

export default function TopBar({ title, subtitle, onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
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
    <header className="flex items-center justify-between mb-6 lg:mb-8 relative z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Upgrade to Pro CTA — only shown to free users */}
        {!isPro && (
          <a
            href="mailto:support@wedora.in?subject=Upgrade%20to%20Wedora%20Pro&body=Hi%2C%20I%20would%20like%20to%20upgrade%20my%20Wedora%20account%20to%20Pro."
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-md shadow-amber-200/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Crown className="w-3.5 h-3.5" /> Upgrade to Pro
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
  );
}
