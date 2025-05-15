import supabase from '../lib/supabase';

export const getDistricts = async () => {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur de récupération des arrondissements:', error);
    throw error;
  }
};

export const getDistrictById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur de récupération de l\'arrondissement:', error);
    throw error;
  }
};

export const getDistrictAlerts = async (districtId) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('district', districtId)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur de récupération des alertes de l\'arrondissement:', error);
    throw error;
  }
};

export const getDistrictActivities = async (districtId) => {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        participants(id)
      `)
      .eq('district', districtId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    // Transformer les données pour compter les participants
    return data.map(activity => ({
      ...activity,
      participant_count: activity.participants ? activity.participants.length : 0,
      participants: undefined // Ne pas renvoyer les données des participants
    }));
  } catch (error) {
    console.error('Erreur de récupération des activités de l\'arrondissement:', error);
    throw error;
  }
};