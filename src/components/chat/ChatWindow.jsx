import React, { useState, useEffect, useRef } from 'react';
import { Send, Check, CheckCheck, Loader2 } from 'lucide-react';
import { fetchMessages, sendMessage, subscribeToMessages } from '../../lib/chat';

export default function ChatWindow({ conversationId, currentUserId, otherPartyName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    
    let isMounted = true;
    
    const loadMessages = async () => {
      setLoading(true);
      const data = await fetchMessages(conversationId);
      if (isMounted) {
        setMessages(data);
        setLoading(false);
      }
    };
    
    loadMessages();

    // Directly subscribe to the WebSockets! When ANYONE types, this instantly fires.
    const unsubscribe = subscribeToMessages(conversationId, (newMsg) => {
      if (isMounted) {
        setMessages(prev => {
          // Double check to prevent rare duplicates if the subscription fires twice
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [conversationId]);

  // Auto-scroll logic so the user always sees the newest message easily
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const { success, error } = await sendMessage(conversationId, currentUserId, newMessage);
    
    if (success) {
      setNewMessage('');
      // No need to manually insert into state here because the WebSocket catches our own INSERT
      // extremely quickly and fires the `onNewMessage` callback above!
    } else {
      console.error(error);
      alert('Network error while sending message.');
    }
    setSending(false);
  };

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <span className="text-4xl mb-3 opacity-50">💭</span>
        <p className="font-medium text-gray-500">Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      {/* Dynamic Chat Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center shadow-sm z-10 sticky top-0 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex flex-shrink-0 items-center justify-center text-white font-bold mr-3 shadow-md">
          {otherPartyName?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 leading-tight">{otherPartyName || 'Loading...'}</h3>
          <p className="text-[11px] text-emerald-500 font-semibold tracking-wide flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" style={{ 
            // A very subtle premium background pattern to instantly elevate the feel
            backgroundColor: '#fafafb',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
         }}>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-rose-gold opacity-50" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-white/80 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto backdrop-blur-sm mt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4 shadow-inner text-rose-500">
               <Send className="w-6 h-6 ml-1" />
            </div>
            <p className="text-gray-700 font-bold text-lg">Say hello to {otherPartyName}!</p>
            <p className="text-sm text-gray-500 mt-2 px-6">Send a message to discuss your wedding requirements securely on Wedora.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUserId;
            // Add extra space if previous message was from the other person
            const isFirstInSequence = idx === 0 || messages[idx - 1].sender_id !== msg.sender_id;
            
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isFirstInSequence ? 'mt-6' : 'mt-2'} animate-fade-in`}
              >
                <div 
                  className={`
                    max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl relative shadow-sm leading-relaxed
                    ${isMe 
                      ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-tr-md shadow-rose-200' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-md shadow-gray-100'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                </div>
                
                {/* Meta text (Time + Read receipt) */}
                <span className={`text-[10px] text-gray-400 mt-1.5 flex items-center gap-1.5 px-2 font-medium`}>
                  {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  {isMe && (
                    msg.is_read ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5" />
                  )}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-6" /> {/* Extra padding at bottom for easy scrolling */}
      </div>

      {/* Premium Input Engine */}
      <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 z-10 sticky bottom-0 shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 bg-gray-50/80 border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-rose-200 focus-within:border-rose-400 transition-all duration-200 shadow-sm hover:shadow-md">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-transparent p-3.5 max-h-32 min-h-[50px] text-[15px] outline-none resize-none hide-scrollbar text-gray-800 placeholder-gray-400"
              onKeyDown={(e) => {
                // Allows pressing Enter to send, Shift+Enter for new line
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              rows={Math.min(3, Math.max(1, newMessage.split('\n').length))}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 text-white flex-shrink-0 flex items-center justify-center hover:shadow-lg disabled:opacity-40 disabled:grayscale transition-all duration-200 shadow-md transform active:scale-95 group"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-1 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
