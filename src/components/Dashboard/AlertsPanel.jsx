import React from 'react';
import '../../styles/AlertsPanel.css';

// Icons pour les types d'alertes
const alertIcons = {
  inondation: "💧",
  earthquake: "🌋",
  cyber: "💻",
  tornado: "🌪️",
  pollution: "☁️",
  default: "⚠️"
};

function AlertsPanel({ alerts, predictions, selectedDistrict, onClearFilter, onSelectPrediction }) {
  const alertLevelClass = (level) => {
    switch (level) {
      case 'severe': 
      case 'critical': 
        return 'alert-severe';
      case 'moderate':
      case 'danger': 
        return 'alert-moderate';
      case 'light':
      case 'info': 
        return 'alert-light';
      case 'warning': 
        return 'alert-warning';
      default: 
        return '';
    }
  };

  // Combiner alertes et prédictions pour affichage
  const allItems = [
    ...alerts,
    ...(predictions || []).map(pred => ({
      ...pred,
      isPrediction: true // Marquer comme prédiction pour le style
    }))
  ];

  // Filtrer par district si nécessaire
  const filteredItems = selectedDistrict 
    ? allItems.filter(item => item.district === selectedDistrict || item.district === null) 
    : allItems;

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h3>
          {selectedDistrict 
            ? `Alertes dans le ${selectedDistrict}${selectedDistrict === 1 ? 'er' : 'ème'} arrondissement` 
            : 'Alertes dans tous les arrondissements'}
        </h3>
        
        {selectedDistrict && (
          <button onClick={onClearFilter} className="clear-filter-btn">
            Voir tout
          </button>
        )}
      </div>
      
      {filteredItems.length === 0 ? (
        <p className="no-alerts">
          {selectedDistrict 
            ? `Aucune alerte active dans le ${selectedDistrict}${selectedDistrict === 1 ? 'er' : 'ème'} arrondissement.` 
            : 'Aucune alerte active pour le moment.'}
        </p>
      ) : (
        <ul className="alerts-list">
          {filteredItems.map((item, index) => (
            <li 
              key={item.id || `pred-${index}`} 
              className={`alert-item ${alertLevelClass(item.level)} ${item.isPrediction ? 'prediction-item' : ''}`}
              onClick={() => item.isPrediction && onSelectPrediction && onSelectPrediction(item)}
            >
              <div className="alert-icon">
                {alertIcons[item.type] || alertIcons.default}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    {item.isPrediction && <span className="prediction-badge">Prédiction</span>}
                  </h4>
                  <span className="alert-district">{item.district}<sup>{item.district === 1 ? 'er' : 'ème'}</sup></span>
                </div>
                <p className="alert-description">{item.description}</p>
                {item.isPrediction && (
                  <div className="prediction-actions">
                    <button className="view-details-btn">Voir détails</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="alert-actions">
        <button className="subscribe-btn">S'abonner aux notifications</button>
        {predictions && predictions.length > 0 && (
          <span className="predictions-count">
            {predictions.length} prédiction{predictions.length > 1 ? 's' : ''} disponible{predictions.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;