
import React, { useState } from 'react';
import { createActivity } from '../../services/activities';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
`;

const FormTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff5252;
  margin-bottom: 15px;
`;

const CreateActivity = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    activity_date: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Vous devez être connecté pour proposer une activité.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    const { activity, error } = await createActivity(user.id, formData);
    
    if (error) {
      setError(error.message);
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        activity_date: new Date().toISOString().slice(0, 16),
      });
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (!user) {
    return (
      <FormContainer>
        <FormTitle>Proposer une activité</FormTitle>
        <p>Vous devez être connecté pour proposer une activité.</p>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Proposer une nouvelle activité</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <div style={{ color: 'green', marginBottom: '15px' }}>Activité créée avec succès!</div>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Titre</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Ex: Surf dans le 2e arrondissement inondé"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Décrivez votre activité en détail..."
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="location">Lieu</Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Ex: Place Bellecour, 2e arrondissement"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="activity_date">Date et heure</Label>
          <Input
            type="datetime-local"
            id="activity_date"
            name="activity_date"
            value={formData.activity_date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer l\'activité'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default CreateActivity;