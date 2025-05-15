import supabase from '../lib/supabase';

export const getActivities = async (filters = {}) => {
  try {
    let query = supabase
      .from('activities')
      .select(`
        *,
        districts(id, name),
        participants(id, user_id)
      `);
    
    // Appliquer les filtres
    if (filters.district) {
      query = query.eq('district', filters.district);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.date) {
      query = query.gte('date', filters.date);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transformer les données pour compter les participants
    return data.map(activity => ({
      ...activity,
      participant_count: activity.participants ? activity.participants.length : 0,
      participants: undefined // Ne pas renvoyer les données des participants
    }));
  } catch (error) {
    console.error('Erreur de récupération des activités:', error);
    throw error;
  }
};

export const getActivityById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        districts(id, name),
        participants(
          id, 
          user_id,
          status,
          profiles:user_id(name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur de récupération de l\'activité:', error);
    throw error;
  }
};

export const createActivity = async (activityData) => {
  try {
    // Si une image est fournie, l'uploader d'abord
    let imageUrl = null;
    if (activityData.image) {
      const file = activityData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `activity_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('activity_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('activity_images')
        .getPublicUrl(filePath);
        
      imageUrl = data.publicUrl;
    }
    
    // Créer l'activité avec l'URL de l'image si disponible
    const { data, error } = await supabase
      .from('activities')
      .insert([{
        ...activityData,
        image: undefined, // Supprimer le fichier de l'objet
        image_url: imageUrl,
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erreur de création d\'activité:', error);
    throw error;
  }
};

export const updateActivity = async (id, updateData) => {
  try {
    // Gérer le téléchargement d'image si une nouvelle est fournie
    if (updateData.image) {
      const file = updateData.image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `activity_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('activity_images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('activity_images')
        .getPublicUrl(filePath);
        
      updateData.image_url = data.publicUrl;
    }
    
    // Mettre à jour l'activité
    const { data, error } = await supabase
      .from('activities')
      .update({
        ...updateData,
        image: undefined, // Supprimer le fichier de l'objet
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erreur de mise à jour d\'activité:', error);
    throw error;
  }
};

export const joinActivity = async (activityId, userId) => {
  try {
    const { data, error } = await supabase
      .from('participants')
      .insert([{
        user_id: userId,
        activity_id: activityId,
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erreur d\'inscription à l\'activité:', error);
    throw error;
  }
};

export const leaveActivity = async (activityId, userId) => {
  try {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('user_id', userId)
      .eq('activity_id', activityId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur de désinscription de l\'activité:', error);
    throw error;
  }
};