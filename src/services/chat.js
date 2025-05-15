import { supabase } from './supabase';

export const getMessages = async (channelId = 'general') => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id, 
        content, 
        created_at, 
        channel_id,
        profiles(id, username, avatar_url)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    return { messages: data, error: null };
  } catch (error) {
    return { messages: null, error };
  }
};

export const sendMessage = async (userId, content, channelId = 'general') => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        content,
        channel_id: channelId,
        created_at: new Date(),
      })
      .select();

    if (error) throw error;
    return { message: data[0], error: null };
  } catch (error) {
    return { message: null, error };
  }
};

export const subscribeToMessages = (channelId = 'general', callback) => {
  const subscription = supabase
    .channel(`messages:${channelId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `channel_id=eq.${channelId}` 
      }, 
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
};