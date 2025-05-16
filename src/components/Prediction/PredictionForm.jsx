import React, { useState, useEffect } from 'react';
import '../../styles/PredictionForm.css';
import PropTypes from 'prop-types';

function PredictionForm({ onSubmit, onCancel, district }) {
  const currentDate = new Date();
  
  const [formData, setFormData] = useState({
    temperature: 20,
    humidite: 60,
    force_moyenne_du_vecteur_de_vent: 10,
    force_du_vecteur_de_vent_max: 15,
    pluie_intensite_max: 0,
    sismicite: 0,
    concentration_gaz: 400,
    pluie_totale: 0,
    Month: currentDate.getMonth() + 1,
    Day: currentDate.getDate(),
    quartier_1: 0,
    quartier_2: 0,
    quartier_3: 0,
    quartier_4: 0,
    quartier_5: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialiser le quartier sélectionné
  useEffect(() => {
    const newFormData = { ...formData };
    
    // Réinitialiser tous les quartiers
    for (let i = 1; i <= 5; i++) {
      newFormData[`quartier_${i}`] = 0;
    }
    
    // Activer le quartier sélectionné s'il est entre 1 et 5
    if (district >= 1 && district <= 5) {
      newFormData[`quartier_${district}`] = 1;
    }
    
    setFormData(newFormData);
  }, [district]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convertir en nombre pour les champs numériques
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapper la prédiction à un type d'alerte et une description
      const alertInfo = mapPredictionToAlert(data.prediction, district);
      
      // Passer les résultats de prédiction au composant parent
      onSubmit(alertInfo);
    } catch (err) {
      console.error('Erreur lors de la prédiction:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour convertir la prédiction en information d'alerte
  const mapPredictionToAlert = (prediction, district) => {
    // Valeurs de prédiction et types d'alertes correspondants (à adapter selon votre modèle)
    const alertTypes = ['inondation', 'cyber', 'earthquake', 'tornado', 'pollution'];
    const alertLevels = ['info', 'warning', 'danger', 'critical'];
    
    // Exemple simple: on suppose que la prédiction est un indice entre 0 et 1
    // qui indique la probabilité d'un événement (plus c'est élevé, plus c'est grave)
    let alertType = alertTypes[Math.min(Math.floor(prediction * alertTypes.length), alertTypes.length - 1)];
    let level = alertLevels[Math.min(Math.floor(prediction * alertLevels.length), alertLevels.length - 1)];
    
    // Description basée sur les données du formulaire
    let description = `Alerte ${alertType} prédite `;
    
    if (formData.temperature > 30) {
      description += `avec température élevée (${formData.temperature}°C)`;
    } else if (formData.pluie_totale > 20) {
      description += `avec précipitations importantes (${formData.pluie_totale}mm)`;
    } else if (formData.sismicite > 2) {
      description += `avec activité sismique (${formData.sismicite})`;
    } else {
      description += `avec probabilité de ${Math.round(prediction * 100)}%`;
    }
    
    return {
      district,
      type: alertType,
      level,
      description,
      timestamp: new Date().toISOString(),
      isPrediction: true
    };
  };

  return (
    <div className="prediction-form-container">
      <div className="prediction-form-header">
        <h3>Prédiction - {district}<sup>{district === 1 ? 'er' : 'ème'}</sup> arrondissement</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="temperature">Température (°C):</label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="humidite">Humidité (%):</label>
            <input
              type="number"
              id="humidite"
              name="humidite"
              value={formData.humidite}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="force_moyenne_du_vecteur_de_vent">Force moyenne du vent (km/h):</label>
            <input
              type="number"
              id="force_moyenne_du_vecteur_de_vent"
              name="force_moyenne_du_vecteur_de_vent"
              value={formData.force_moyenne_du_vecteur_de_vent}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="force_du_vecteur_de_vent_max">Force max. du vent (km/h):</label>
            <input
              type="number"
              id="force_du_vecteur_de_vent_max"
              name="force_du_vecteur_de_vent_max"
              value={formData.force_du_vecteur_de_vent_max}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pluie_intensite_max">Intensité max. de pluie (mm/h):</label>
            <input
              type="number"
              id="pluie_intensite_max"
              name="pluie_intensite_max"
              value={formData.pluie_intensite_max}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pluie_totale">Pluie totale (mm):</label>
            <input
              type="number"
              id="pluie_totale"
              name="pluie_totale"
              value={formData.pluie_totale}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sismicite">Activité sismique (échelle):</label>
            <input
              type="number"
              id="sismicite"
              name="sismicite"
              value={formData.sismicite}
              onChange={handleChange}
              min="0"
              step="0.1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="concentration_gaz">Concentration de gaz (ppm):</label>
            <input
              type="number"
              id="concentration_gaz"
              name="concentration_gaz"
              value={formData.concentration_gaz}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Month">Mois:</label>
            <input
              type="number"
              id="Month"
              name="Month"
              value={formData.Month}
              onChange={handleChange}
              min="1"
              max="12"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="Day">Jour:</label>
            <input
              type="number"
              id="Day"
              name="Day"
              value={formData.Day}
              onChange={handleChange}
              min="1"
              max="31"
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Annuler</button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Prédiction en cours...' : 'Générer la prédiction'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Définition des propTypes pour la validation des props
PredictionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  district: PropTypes.number.isRequired
};

export default PredictionForm;