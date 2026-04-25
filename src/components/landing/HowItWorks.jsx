import React, { useState } from 'react';
import { UserPlus, LayoutDashboard, Settings2, Users, Store, Star, MessageSquareHeart, TrendingUp, Play, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('couple');

  // We have removed the demo states per user request

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
          <div className="mt-16 text-center space-y-4 sm:space-y-0 sm:space-x-4 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Link 
              to="/signup" 
              className={`px-8 py-4 bg-gradient-to-r ${themeGradient} text-white font-semibold rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2`}
            >
              Start Planning Free <Heart className="w-4 h-4 fill-current opacity-70" />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
