import React from 'react';
import { UserPlus, LayoutDashboard, Settings2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
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

  return (
    <section id="how-it-works" className="py-20 bg-white relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-rose-gold/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-plum/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-rose-gold font-medium tracking-wide uppercase text-sm mb-3">
            No spreadsheets. No stress. Just Wedora.
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
            Plan Your Wedding in 4 Easy Steps <span role="img" aria-label="ring">💍</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Wedora helps you stay organized, save time, and plan stress-free.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[2px] bg-slate-100 -z-10"></div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative group text-center flex flex-col items-center">
              {/* Step Circle */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center mb-6 relative group-hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-rose-gold to-plum text-white text-sm font-bold flex items-center justify-center shadow-lg border-[3px] border-white">
                  {step.id}
                </div>
                {step.icon}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-2">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center space-x-0 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-center justify-center">
          <Link 
            to="/signup" 
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-gold to-plum text-white font-medium rounded-full shadow-[0_8px_30px_rgba(225,29,72,0.2)] hover:shadow-[0_8px_30px_rgba(225,29,72,0.3)] hover:-translate-y-0.5 transition-all w-fit"
          >
            Start Planning Free
          </Link>
          <button 
            onClick={() => {
              // Mock action or scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 font-medium rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-rose-gold/30 hover:text-rose-gold transition-all w-fit"
          >
            See Demo
          </button>
        </div>

      </div>
    </section>
  );
}
