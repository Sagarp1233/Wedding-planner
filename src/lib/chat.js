import { supabase } from './supabase';

/**
 * Ensures a conversation exists between a couple and a vendor, or creates one.
 */
export async function getOrCreateConversation(coupleId, vendorId, listingId = null, coupleName = 'Couple Request') {
  const { data: existing, error: fetchError } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('vendor_id', vendorId)
    .maybeSingle();

  if (fetchError) {
    console.error('[Chat] fetch error:', fetchError);
    return { success: false, error: fetchError.message };
  }

  if (existing) {
    return { success: true, conversation: existing };
  }

  const { data: newConvo, error: insertError } = await supabase
    .from('chat_conversations')
    .insert({
      couple_id: coupleId,
      vendor_id: vendorId,
      listing_id: listingId,
      couple_name: coupleName
    })
    .select()
    .single();

  if (insertError) {
    console.error('[Chat] insert error:', insertError);
    return { success: false, error: insertError.message };
  }

  return { success: true, conversation: newConvo };
}

/**
 * Fetch all conversations for a user
 */
export async function fetchUserConversations(userId, role) {
  const column = role === 'vendor' ? 'vendor_id' : 'couple_id';
  
  // We fetch standard relationships. The frontend might need to fetch auth.users profiles manually 
  // depending on Supabase auth schema constraints, but we can grab listing data.
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*, marketplace_vendors(business_name, cover_image)')
    .eq(column, userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[Chat] fetch conversations error:', error);
    return [];
  }
  return data || [];
}

/**
 * Fetch messages for a specific conversation
 */
export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Chat] fetch messages error:', error);
    return [];
  }
  return data || [];
}

/**
 * Send a new message
 */
export async function sendMessage(conversationId, senderId, content) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim()
    })
    .select()
    .single();

  if (error) {
    console.error('[Chat] send err:', error);
    return { success: false, error: error.message };
  }

  // Touch updated_at on conversation to push it to the top of inbox
  await supabase
    .from('chat_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return { success: true, message: data };
}

/**
 * Subscribe to new messages via WebSockets
 */
export function subscribeToMessages(conversationId, onNewMessage) {
  const channel = supabase
    .channel(`chat_${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        onNewMessage(payload.new);
      }
    )
    .subscribe();

  // Return unsubscribe cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}
