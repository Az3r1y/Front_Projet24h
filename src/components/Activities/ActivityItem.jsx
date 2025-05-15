import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateActivity, deleteActivity } from '../../services/activities';
import styled from 'styled-components';

const ActivityCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  margin: 0;
  color: #333;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color || '#ccc'};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const Description = styled.p`
  color: #444;
  line-height: 1.5;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: ${props => props.variant === 'danger' ? '#ff5252' : 
                              props.variant === 'edit' ? '#2196f3' : '#4caf50'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ActivityItem = ({ activity, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState({
    title: activity.title,
    description: activity.description,
    location: activity.location,
    activity_date: activity.activity_date,
  });
  const [error, setError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedActivity({
      title: activity.title,
      description: activity.description,
      location: activity.location,
      activity_date: activity.activity_date,
    });
  };

  const handleSave = async () => {
    const { error } = await updateActivity(activity.id, editedActivity);
    
    if (error) {
      setError(error.message);
    } else {
      setIsEditing(false);
      setError('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) {
      const { error } = await deleteActivity(activity.id);
      
      if (error) {
        setError(error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Génère une couleur basée sur le username pour l'avatar
  const getAvatarColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const username = activity.profiles?.username || 'Anonyme';
  const avatarColor = getAvatarColor(username);

  return (
    <ActivityCard>
      {error && <div className="error-message">{error}</div>}
      
      <ActivityHeader>
        {isEditing ? (
          <input
            type="text"
            value={editedActivity.title}
            onChange={(e) => setEditedActivity({...editedActivity, title: e.target.value})}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        ) : (
          <Title>{activity.title}</Title>
        )}
        
        <UserInfo>
          <Avatar color={avatarColor}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
          {username}
        </UserInfo>
      </ActivityHeader>
      
      {isEditing ? (
        <>
          <textarea
            value={editedActivity.description}
            onChange={(e) => setEditedActivity({...editedActivity, description: e.target.value})}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
          />
          
          <div style={{ marginBottom: '10px' }}>
            <label>Lieu: </label>
            <input
              type="text"
              value={editedActivity.location}
              onChange={(e) => setEditedActivity({...editedActivity, location: e.target.value})}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Date: </label>
            <input
              type="datetime-local"
              value={new Date(editedActivity.activity_date).toISOString().slice(0, 16)}
              onChange={(e) => setEditedActivity({...editedActivity, activity_date: e.target.value})}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </>
      ) : (
        <>
          <Description>{activity.description}</Description>
          
          <Details>
            <span>📍 {activity.location}</span>
            <span>🗓️ {formatDate(activity.activity_date)}</span>
          </Details>
        </>
      )}
      
      {isOwner && (
        <ButtonGroup>
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Enregistrer</Button>
              <Button variant="edit" onClick={handleCancel}>Annuler</Button>
            </>
          ) : (
            <>
              <Button variant="edit" onClick={handleEdit}>Modifier</Button>
              <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
            </>
          )}
        </ButtonGroup>
      )}
    </ActivityCard>
  );
};

export default ActivityItem;