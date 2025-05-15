import { supabase } from './supabase';

export const getActivities = async () => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        id, 
        title, 
        description, 
        location,
        activity_date,
        created_at,
        user_id, 
        profiles(id, username, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { activities: data, error: null };
  } catch (error) {
    return { activities: null, error };
  }
};

export const createActivity = async (userId, activityData) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        user_id: userId,
        ...activityData,
        created_at: new Date(),
      })
      .select();

    if (error) throw error;
    return { activity: data[0], error: null };
  } catch (error) {
    return { activity: null, error };
  }
};

export const updateActivity = async (activityId, activityData) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .update(activityData)
      .eq('id', activityId)
      .select();

    if (error) throw error;
    return { activity: data[0], error: null };
  } catch (error) {
    return { activity: null, error };
  }
};

export const deleteActivity = async (activityId) => {
  try {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', activityId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};