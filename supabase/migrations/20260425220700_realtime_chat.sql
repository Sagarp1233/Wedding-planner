-- Create conversations table
CREATE TABLE public.chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_id UUID REFERENCES auth.users(id) NOT NULL,
    vendor_id UUID REFERENCES auth.users(id) NOT NULL,
    listing_id UUID REFERENCES public.marketplace_vendors(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(couple_id, vendor_id)
);

-- Create messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for Conversations
CREATE POLICY "Users can view their own conversations" 
ON public.chat_conversations FOR SELECT 
USING ( auth.uid() = couple_id OR auth.uid() = vendor_id );

CREATE POLICY "Users can insert conversations they belong to" 
ON public.chat_conversations FOR INSERT 
WITH CHECK ( auth.uid() = couple_id OR auth.uid() = vendor_id );

-- Policies for Messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.chat_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c 
    WHERE c.id = chat_messages.conversation_id 
    AND (c.couple_id = auth.uid() OR c.vendor_id = auth.uid())
  )
);

CREATE POLICY "Users can insert messages to their conversations" 
ON public.chat_messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chat_conversations c 
    WHERE c.id = chat_messages.conversation_id 
    AND (c.couple_id = auth.uid() OR c.vendor_id = auth.uid())
  )
);

CREATE POLICY "Users can update (mark read) messages"
ON public.chat_messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c 
    WHERE c.id = chat_messages.conversation_id 
    AND (c.couple_id = auth.uid() OR c.vendor_id = auth.uid())
  )
);

-- Set up realtime publication on chat_messages so WebSockets can broadcast INSERTs
begin;
  -- remove the supabase_realtime publication if it exists to recreate it cleanly, but usually we just alter.
  -- Supabase manages a special publication called 'supabase_realtime'.
  alter publication supabase_realtime add table public.chat_messages;
commit;
