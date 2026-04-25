import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserConversations } from '../../lib/chat';
import ChatWindow from '../../components/chat/ChatWindow';
import { MessageCircle, Search, Loader2 } from 'lucide-react';

export default function UserInboxPage() {
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let isMounted = true;
    
    const loadInbox = async () => {
      setLoading(true);
      const convos = await fetchUserConversations(currentUser.id, 'couple');
      if (isMounted) {
        setConversations(convos);
        setLoading(false);
      }
    };
    loadInbox();
    
    return () => { isMounted = false; };
  }, [currentUser, isAuthenticated, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 bg-[#fafafb]">
        <div className="pt-8 pb-8 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center h-[70vh]">
          <Loader2 className="w-10 h-10 animate-spin text-rose-gold opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#fafafb] flex flex-col">
      <div className="pt-4 pb-8 flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Your Messages</h1>
            <p className="text-sm text-gray-500">Live chat with your shortlisted vendors.</p>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center h-[500px] flex flex-col items-center justify-center animate-fade-in mt-6">
            <div className="w-20 h-20 bg-rose-50/50 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <MessageCircle className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No active conversations</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
              You haven't started chatting with any vendors yet. Head over to the Marketplace to discover and contact top wedding professionals.
            </p>
            <a href="/marketplace" className="inline-block px-6 py-3 rounded-xl bg-gray-900 text-white font-medium shadow hover:bg-gray-800 transition">
               Browse Marketplace
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 min-h-[600px] flex animate-fade-in relative z-0">
            {/* Left Sidebar: Conversation List */}
            <div className="w-1/3 sm:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-hidden shrink-0">
              <div className="p-4 border-b border-gray-100 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search vendors..." 
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {conversations.map(conv => {
                  const isActive = activeConversation?.id === conv.id;
                  const vendorInfo = conv.marketplace_vendors;
                  
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full text-left p-4 border-b border-gray-100 transition-all flex gap-3 items-center group
                        ${isActive ? 'bg-rose-50/80 border-l-4 border-l-rose-500' : 'hover:bg-gray-50 bg-transparent border-l-4 border-l-transparent'}`}
                    >
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0 shadow-sm border border-gray-200 group-hover:scale-105 transition-transform">
                        {vendorInfo?.cover_image ? (
                          <img src={vendorInfo.cover_image} alt={vendorInfo.business_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 font-bold">
                            {vendorInfo?.business_name?.charAt(0) || 'V'}
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-bold text-gray-900 text-[13px] truncate">{vendorInfo?.business_name || 'Vendor'}</p>
                          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">
                            {new Date(conv.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                           Tap to chat instantly
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Canvas: Chat Window */}
            <div className="flex-1 bg-[#fafafb] relative">
              <ChatWindow 
                conversationId={activeConversation?.id} 
                currentUserId={currentUser.id} 
                otherPartyName={activeConversation?.marketplace_vendors?.business_name} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
