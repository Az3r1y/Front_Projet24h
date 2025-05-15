import React, { useState, useEffect } from 'react';
import { getActivities } from '../../services/activities';
import ActivityItem from './ActivityItem';
import { useAuth } from '../../contexts/AuthContext';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      const { activities, error } = await getActivities();
      
      if (error) {
        setError(error.message);
      } else {
        setActivities(activities);
      }
      
      setLoading(false);
    };

    loadActivities();

    // S'abonner aux changements en temps réel
    const subscription = supabase
      .channel('public:activities')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activities' 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setActivities(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setActivities(prev => 
            prev.map(activity => 
              activity.id === payload.new.id ? payload.new : activity
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setActivities(prev => 
            prev.filter(activity => activity.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) return <div>Chargement des activités...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="activity-list">
      <h2>Activités proposées</h2>
      {activities.length === 0 ? (
        <p>Aucune activité n'a encore été proposée.</p>
      ) : (
        activities.map(activity => (
          <ActivityItem 
            key={activity.id} 
            activity={activity}
            isOwner={user && activity.user_id === user.id}
          />
        ))
      )}
    </div>
  );
};

export default ActivityList;