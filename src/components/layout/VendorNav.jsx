import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VendorNav() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Left Actions */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-gold to-plum flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="hidden sm:block text-xl font-serif font-bold text-gray-900">Wedora <span className="text-sm text-rose-gold font-sans font-medium uppercase tracking-widest pl-1">For Business</span></span>
          </Link>
          
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          
          <Link to="/marketplace" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
            <LayoutDashboard className="w-4 h-4 text-gray-500" /> Couple Dashboard
          </Link>

          <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-sm text-gray-600 border border-gray-300">
              {currentUser?.user_metadata?.first_name?.charAt(0) || 'V'}
            </div>
            
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> 
              <span className="hidden sm:block">Log Out</span>
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}
