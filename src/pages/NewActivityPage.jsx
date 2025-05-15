import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NewActivityPage.css';

// Liste des catégories disponibles
const CATEGORIES = [
  { id: 'sport', name: 'Sport' },
  { id: 'tech', name: 'Technologie' },
  { id: 'rescue', name: 'Sauvetage' },
  { id: 'culture', name: 'Culture' },
  { id: 'formation', name: 'Formation' },
  { id: 'entraide', name: 'Entraide' },
  { id: 'aventure', name: 'Aventure Extrême' },
];

// Liste des niveaux de difficulté
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Facile - Accessible à tous' },
  { id: 'medium', name: 'Moyen - Condition physique requise' },
  { id: 'hard', name: 'Difficile - Expérience nécessaire' },
  { id: 'extreme', name: 'Extrême - Experts uniquement' },
];

// État initial du formulaire
const initialFormState = {
  title: '',
  description: '',
  category: '',
  district: '',
  date: '',
  time: '10:00',
  duration: 2,
  maxParticipants: 10,
  difficulty: 'medium',
  equipmentProvided: false,
  equipmentNeeded: '',
  requiresTraining: false,
  locationDetails: '',
  image: null,
  imagePreview: null
};

function NewActivityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate] = useState(() => {
    const now = new Date('2025-05-15T10:23:42');
    return now.toISOString().split('T')[0];
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Traiter différemment selon le type d'entrée
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Réinitialiser l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La description doit comporter au moins 50 caractères';
    }
    
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }
    
    if (!formData.district) {
      newErrors.district = 'Veuillez sélectionner un arrondissement';
    }
    
    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date(currentDate);
      if (selectedDate < today) {
        newErrors.date = 'La date doit être dans le futur';
      }
    }
    
    if (!formData.locationDetails.trim()) {
      newErrors.locationDetails = 'Les détails du lieu sont requis';
    }
    
    if (formData.requiresTraining && !formData.equipmentNeeded.trim()) {
      newErrors.equipmentNeeded = 'Précisez l\'équipement nécessaire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Simuler l'envoi des données à un backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Format des données à envoyer (dans un cas réel, ce serait envoyé à votre API)
        const activityData = {
          ...formData,
          author: user?.name || 'Utilisateur anonyme',
          authorId: user?.id || 'anonymous',
          authorAvatar: user?.avatar || 'https://avatars.dicebear.com/api/initials/anon.svg',
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        
        console.log('Nouvelle activité créée:', activityData);
        
        // Rediriger vers la page des activités
        navigate('/activities');
      } catch (error) {
        console.error('Erreur lors de la création de l\'activité:', error);
        setErrors({
          submit: 'Une erreur est survenue. Veuillez réessayer plus tard.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Adaptation du formulaire en fonction de la catégorie
  useEffect(() => {
    if (formData.category === 'rescue') {
      setFormData(prev => ({ 
        ...prev, 
        requiresTraining: true,
      }));
    }
  }, [formData.category]);

  return (
    <div className="new-activity-page">
      <div className="form-container">
        <h1>Proposer une activité pour Lyon 2180</h1>
        <p className="form-subtitle">
          Organisez des activités inédites adaptées à notre mégapole en transformation
        </p>
        
        {errors.submit && (
          <div className="error-alert">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="activity-form">
          <div className="form-group">
            <label htmlFor="title">Titre de l'activité*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Surf urbain dans les zones inondées du 7ème"
              className={errors.title ? 'has-error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Catégorie*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'has-error' : ''}
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="district">Arrondissement*</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={errors.district ? 'has-error' : ''}
              >
                <option value="">Sélectionner un arrondissement</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(district => (
                  <option key={district} value={district}>
                    {district}{district === 1 ? 'er' : 'ème'} arrondissement
                  </option>
                ))}
              </select>
              {errors.district && <span className="error-message">{errors.district}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date de l'activité*</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={currentDate}
                className={errors.date ? 'has-error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Heure de début</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="duration">Durée (heures)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="0.5"
                max="12"
                step="0.5"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="maxParticipants">Nombre max. de participants</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Niveau de difficulté</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="locationDetails">Détails du lieu*</label>
            <input
              type="text"
              id="locationDetails"
              name="locationDetails"
              value={formData.locationDetails}
              onChange={handleChange}
              placeholder="Adresse précise ou point de rendez-vous"
              className={errors.locationDetails ? 'has-error' : ''}
            />
            {errors.locationDetails && <span className="error-message">{errors.locationDetails}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description de l'activité*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre activité en détail, son déroulement, l'intérêt pour les participants..."
              rows="6"
              className={errors.description ? 'has-error' : ''}
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
            <span className="char-count">{formData.description.length} / 500 caractères</span>
          </div>
          
          <div className="form-row checkbox-row">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="equipmentProvided"
                name="equipmentProvided"
                checked={formData.equipmentProvided}
                onChange={handleChange}
              />
              <label htmlFor="equipmentProvided">Équipement fourni sur place</label>
            </div>
            
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="requiresTraining"
                name="requiresTraining"
                checked={formData.requiresTraining}
                onChange={handleChange}
              />
              <label htmlFor="requiresTraining">Formation ou briefing préalable</label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="equipmentNeeded">Équipement à apporter</label>
            <textarea
              id="equipmentNeeded"
              name="equipmentNeeded"
              value={formData.equipmentNeeded}
              onChange={handleChange}
              placeholder="Équipement que les participants doivent apporter..."
              rows="3"
              className={errors.equipmentNeeded ? 'has-error' : ''}
            ></textarea>
            {errors.equipmentNeeded && <span className="error-message">{errors.equipmentNeeded}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image d'illustration</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              <label htmlFor="image" className="image-upload-button">
                {formData.imagePreview ? 'Changer d\'image' : 'Choisir une image'}
              </label>
              {formData.imagePreview && (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Aperçu" />
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/activities')} 
              className="cancel-button"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publication en cours...' : 'Publier l\'activité'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="form-sidebar">
        <div className="tips-card">
          <h3>Conseils pour une bonne activité:</h3>
          <ul>
            <li>Soyez précis sur les conditions de participation</li>
            <li>Mentionnez les risques potentiels liés aux catastrophes</li>
            <li>Précisez si une expérience préalable est nécessaire</li>
            <li>Indiquez si l'activité est adaptée aux débutants</li>
            <li>Expliquez les mesures de sécurité prévues</li>
            <li>Décrivez le matériel fourni et celui à apporter</li>
          </ul>
        </div>
        
        <div className="safety-notice">
          <h3>Rappel de sécurité</h3>
          <p>Toutes les activités proposées doivent respecter les protocoles de sécurité de Lyon 2180 et être compatibles avec le niveau d'alerte en vigueur.</p>
          <p className="safety-warning">L'organisateur est responsable de la sécurité des participants.</p>
        </div>
        
        <div className="author-preview">
          <h3>Votre activité sera publiée par:</h3>
          <div className="author-info">
            <img 
              src={user?.avatar || 'https://avatars.dicebear.com/api/initials/anon.svg'} 
              alt={user?.name || 'Anonyme'} 
              className="author-avatar" 
            />
            <span className="author-name">{user?.name || 'Anonyme'}</span>
          </div>
          <p className="date-preview">Aujourd'hui à {new Date('2025-05-15T10:23:42').toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
        </div>
      </div>
    </div>
  );
}

export default NewActivityPage;