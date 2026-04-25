import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, ArrowLeft } from 'lucide-react';
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
        <div className="flex items-center gap-4 pl-2 sm:border-l sm:border-gray-200">
            <div className="hidden sm:block text-right">
               <p className="text-sm font-bold text-gray-900 leading-tight">{currentUser?.user_metadata?.first_name ? `${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name || ''}` : 'Business Profile'}</p>
               <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-lg text-gray-600 border border-gray-300 shadow-sm shrink-0">
              {currentUser?.user_metadata?.first_name?.charAt(0) || 'V'}
            </div>
            
            <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0">
              <LogOut className="w-4 h-4" /> 
              <span className="hidden md:block">Sign Out</span>
            </button>
        </div>

      </div>
    </nav>
  );
}
