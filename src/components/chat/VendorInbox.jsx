import React, { useState, useEffect } from 'react';
import { fetchUserConversations } from '../../lib/chat';
import ChatWindow from './ChatWindow';
import { MessageCircle, Search, Loader2 } from 'lucide-react';

export default function VendorInbox({ vendorId }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadInbox = async () => {
      setLoading(true);
      const convos = await fetchUserConversations(vendorId, 'vendor');
      if (isMounted) {
        setConversations(convos);
        setLoading(false);
      }
    };
    loadInbox();
    return () => { isMounted = false; };
  }, [vendorId]);

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-rose-gold opacity-50" /></div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center h-[500px] flex flex-col items-center justify-center animate-fade-in">
        <div className="w-20 h-20 bg-rose-50/50 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <MessageCircle className="w-10 h-10 text-rose-300" />
        </div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Your Inbox is Quiet</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          When couples message you directly through your Wedora listing to discuss bookings, their live chats will appear right here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex animate-fade-in relative z-0">
      {/* Left Sidebar: Conversation List */}
      <div className="w-1/3 sm:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="font-bold text-gray-900 mb-3">Live Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/30 transition-all font-medium"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {conversations.map(conv => {
            const isActive = activeConversation?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full text-left p-4 border-b border-gray-100 transition-all flex gap-3 items-center group
                  ${isActive ? 'bg-rose-50/80 border-l-4 border-l-rose-500' : 'hover:bg-gray-50 bg-transparent border-l-4 border-l-transparent'}`}
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  C
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-bold text-gray-900 text-[13px] truncate">Couple Enquiry</p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(conv.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                    Click to view chat history
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
          currentUserId={vendorId} 
          otherPartyName="Couple Request" 
        />
      </div>
    </div>
  );
}
