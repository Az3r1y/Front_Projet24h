import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/PredictionResult.css';

function PredictionResult({ result, onClose, onSave }) {
  // Déterminer l'icône en fonction du type d'alerte
  const getAlertIcon = (type) => {
    switch (type) {
      case 'inondation': return '💧';
      case 'cyber': return '🖥️';
      case 'earthquake': return '🌋';
      case 'tornado': return '🌪️';
      case 'pollution': return '☁️';
      default: return '⚠️';
    }
  };

  // Déterminer la classe CSS en fonction du niveau d'alerte
  const alertClass = `prediction-result alert-${result.level}`;
  
  // Formater la date d'affichage
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="prediction-result-container">
      <div className={alertClass}>
        <div className="result-header">
          <div className="result-title">
            <span className="alert-icon">{getAlertIcon(result.type)}</span>
            <h3>Prédiction: {result.type.charAt(0).toUpperCase() + result.type.slice(1)}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="result-content">
          <div className="result-info">
            <p className="alert-description">{result.description}</p>
            <p className="district-info">
              Arrondissement: {result.district}
              <sup>{result.district === 1 ? 'er' : 'ème'}</sup>
            </p>
            <p className="alert-time">Généré le: {formatDate(result.timestamp)}</p>
            <p className="alert-severity">
              Niveau d'alerte: 
              <span className={`severity-badge ${result.level}`}>
                {result.level === 'info' && 'Informative'}
                {result.level === 'warning' && 'Avertissement'}
                {result.level === 'danger' && 'Danger'}
                {result.level === 'critical' && 'Critique'}
                {result.level === 'severe' && 'Sévère'}
                {result.level === 'moderate' && 'Modérée'}
                {result.level === 'light' && 'Légère'}
              </span>
            </p>
          </div>
        </div>

        <div className="result-actions">
          <button className="action-btn cancel" onClick={onClose}>
            Fermer
          </button>
          <button className="action-btn save" onClick={() => onSave(result)}>
            Enregistrer l'alerte
          </button>
        </div>
      </div>
    </div>
  );
}

PredictionResult.propTypes = {
  result: PropTypes.shape({
    district: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default PredictionResult;