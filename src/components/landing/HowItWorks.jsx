import React, { useState } from 'react';
import { UserPlus, LayoutDashboard, Settings2, Users, Store, Star, MessageSquareHeart, TrendingUp, Play, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('couple');
  const [showDemo, setShowDemo] = useState(false);

  const coupleSteps = [
    {
      id: 1,
      title: 'Create Your Free Account',
      description: 'Sign up in seconds and enter your wedding date and city.',
      icon: <UserPlus className="w-6 h-6 text-rose-gold" />,
    },
    {
      id: 2,
      title: 'Get Your Wedding Dashboard',
      description: 'Instantly receive your personal wedding planner with checklist and timeline.',
      icon: <LayoutDashboard className="w-6 h-6 text-rose-gold" />,
    },
    {
      id: 3,
      title: 'Add Your Wedding Details',
      description: 'Set your budget, guest count, venue, and preferences anytime.',
      icon: <Settings2 className="w-6 h-6 text-rose-gold" />,
    },
    {
      id: 4,
      title: 'Explore Vendors & Manage Guests',
      description: 'Find trusted vendors, create your wedding page, and collect RSVPs.',
      icon: <Users className="w-6 h-6 text-rose-gold" />,
    }
  ];

  const vendorSteps = [
    {
      id: 1,
      title: 'Create Business Profile',
      description: 'Sign up and showcase your portfolio, services, and pricing to couples.',
      icon: <Store className="w-6 h-6 text-violet-500" />,
    },
    {
      id: 2,
      title: 'Get Discovered',
      description: 'Appear beautifully in Wedora\'s premium vendor marketplace.',
      icon: <Star className="w-6 h-6 text-violet-500" />,
    },
    {
      id: 3,
      title: 'Receive Inquiries',
      description: 'Get direct leads and messages from engaged couples actively planning.',
      icon: <MessageSquareHeart className="w-6 h-6 text-violet-500" />,
    },
    {
      id: 4,
      title: 'Grow Your Business',
      description: 'Manage bookings, track your deals, and build your reputation with reviews.',
      icon: <TrendingUp className="w-6 h-6 text-violet-500" />,
    }
  ];

  const currentSteps = activeTab === 'couple' ? coupleSteps : vendorSteps;
  const themeColor = activeTab === 'couple' ? 'rose-gold' : 'violet-500';
  const themeGradient = activeTab === 'couple' ? 'from-rose-gold to-plum' : 'from-violet-500 to-purple-600';
  const themeBgLight = activeTab === 'couple' ? 'bg-rose-50/50' : 'bg-violet-50/50';

  return (
    <>
      <section id="how-it-works" className={`py-20 bg-white relative overflow-hidden font-sans transition-colors duration-500 ${themeBgLight}`}>
        {/* Background Decor */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className={`absolute top-1/2 left-0 w-80 h-80 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 transition-colors duration-700 ${activeTab === 'couple' ? 'bg-rose-gold/10' : 'bg-violet-500/10'}`}></div>
        <div className={`absolute top-1/2 right-0 w-80 h-80 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 transition-colors duration-700 ${activeTab === 'couple' ? 'bg-plum/10' : 'bg-purple-600/10'}`}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header & Toggle Section */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className={`font-medium tracking-wide uppercase text-xs sm:text-sm mb-4 transition-colors duration-300 ${activeTab === 'couple' ? 'text-rose-gold' : 'text-violet-600'}`}>
              {activeTab === 'couple' ? 'No spreadsheets. No stress. Just Wedora.' : 'For Wedding Professionals & Venues'}
            </p>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
              {activeTab === 'couple' ? 'Plan Your Wedding in 4 Easy Steps' : 'Grow Your Wedding Business'}
              <span className="inline-block ml-2 group-hover:rotate-12 transition-transform" role="img" aria-label="icon">
                {activeTab === 'couple' ? '💍' : '🚀'}
              </span>
            </h2>

            {/* Smart Role Toggle */}
            <div className="inline-flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-full overflow-x-auto">
              <button
                onClick={() => setActiveTab('couple')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'couple' 
                    ? 'bg-gradient-to-r from-rose-gold to-plum text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${activeTab === 'couple' ? 'text-white' : 'text-gray-400'}`} />
                For Couples
              </button>
              <button
                onClick={() => setActiveTab('vendor')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'vendor' 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Store className={`w-4 h-4 ${activeTab === 'vendor' ? 'text-white' : 'text-gray-400'}`} />
                For Vendors
              </button>
            </div>
            
            <p className="text-slate-500 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
              {activeTab === 'couple' 
                ? 'Wedora helps you stay organized, save time, and plan stress-free.' 
                : 'Connect with thousands of engaged couples to turn inquiries into bookings effortlessly.'}
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-4 gap-6 sm:gap-8 relative my-16">
            
            {/* Connecting Line for Desktop */}
            <div className={`hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[2px] -z-10 transition-colors duration-500 ${activeTab === 'couple' ? 'bg-rose-100' : 'bg-violet-100'}`}>
              {/* Animated Progress Indicator */}
              <div className={`h-full opacity-50 bg-gradient-to-r ${themeGradient} w-1/3 animate-pulse rounded-full`}></div>
            </div>
            
            {currentSteps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative group text-center flex flex-col items-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Circle with Hover Effect */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col items-center justify-center mb-6 relative transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_15px_40px_rgb(0,0,0,0.1)] group-hover:border-transparent">
                  
                  {/* Glowing ring on hover */}
                  <div className={`absolute inset-[-4px] rounded-full bg-gradient-to-br ${themeGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                  
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br ${themeGradient} text-white text-sm font-bold flex items-center justify-center shadow-lg border-[3px] border-white z-10 transition-transform duration-300 group-hover:scale-110`}>
                    {step.id}
                  </div>
                  
                  <div className="transform transition-transform duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center justify-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Link 
              to="/signup" 
              className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${themeGradient} text-white font-semibold rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2`}
            >
              Start Planning Free <Heart className="w-4 h-4 fill-current opacity-70" />
            </Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              See Interactive Demo
            </button>
          </div>

        </div>
      </section>

      {/* Demo Modal Overlay */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in">
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => setShowDemo(false)}
            aria-label="Close demo"
          />
          
          <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeGradient} flex items-center justify-center shadow-inner`}>
                  <Play className="w-4 h-4 text-white" fill="white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Wedora Platform Demo</h3>
                  <p className="text-xs text-gray-500">{activeTab === 'couple' ? 'Couple Dashboard Experience' : 'Vendor Management Portal'}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDemo(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Player Placeholder */}
            <div className="aspect-video bg-slate-900 relative group flex items-center justify-center">
              {/* Optional: You can put an actual YouTube iframe here in the future. Example:
                 <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameBorder="0" allowFullScreen></iframe> 
              */}
              
              {/* Decorative Mock Player UI */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black overflow-hidden flex flex-col items-center justify-center text-center px-6">
                
                {/* Visual Elements inside player */}
                <div className={`absolute top-1/2 left-1/2 w-96 h-96 blur-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full ${activeTab === 'couple' ? 'bg-rose-gold/30' : 'bg-violet-600/30'}`} />
                
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-[-10px_10px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                  <Play className="w-8 h-8 text-white ml-2" fill="white" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-serif text-white mb-3">
                  {activeTab === 'couple' ? 'Your Dream Wedding Starts Here' : 'Scale Your Wedding Business'}
                </h4>
                <p className="text-slate-400 max-w-lg">
                  Click play to see exactly how Wedora's premium tools can transform your {activeTab === 'couple' ? 'planning experience' : 'sales pipeline'}.
                </p>
              </div>

              {/* Fake player controls */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-full flex items-center gap-4">
                  <Play className="w-4 h-4 text-white hover:text-rose-gold cursor-pointer" fill="white" />
                  <div className="flex-1 h-1 bg-white/20 rounded-full relative cursor-pointer group/bar">
                     <div className={`absolute left-0 top-0 h-full rounded-full w-1/3 bg-gradient-to-r ${themeGradient}`} />
                     <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-white/70 font-medium">1:24 / 3:45</div>
                  <Settings2 className="w-4 h-4 text-white hover:text-white/80 cursor-pointer" />
                </div>
              </div>
            </div>
            
            {/* Modal Footer / CTA */}
            <div className="px-6 py-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Ready to experience it for yourself?
              </p>
              <Link 
                to="/signup" 
                onClick={() => setShowDemo(false)}
                className={`px-6 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 transition-transform hover:-translate-y-0.5 bg-gradient-to-r ${themeGradient}`}
              >
                Create Free Account
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
