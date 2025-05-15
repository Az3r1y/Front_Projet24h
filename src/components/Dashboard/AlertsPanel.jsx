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

function AlertsPanel({ alerts, selectedDistrict, onClearFilter }) {
  const alertLevelClass = (level) => {
    switch (level) {
      case 'severe': return 'alert-severe';
      case 'moderate': return 'alert-moderate';
      case 'light': return 'alert-light';
      case 'warning': return 'alert-warning';
      default: return '';
    }
  };

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
      
      {alerts.length === 0 ? (
        <p className="no-alerts">
          {selectedDistrict 
            ? `Aucune alerte active dans le ${selectedDistrict}${selectedDistrict === 1 ? 'er' : 'ème'} arrondissement.` 
            : 'Aucune alerte active pour le moment.'}
        </p>
      ) : (
        <ul className="alerts-list">
          {alerts.map(alert => (
            <li key={alert.id} className={`alert-item ${alertLevelClass(alert.level)}`}>
              <div className="alert-icon">
                {alertIcons[alert.type] || alertIcons.default}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</h4>
                  <span className="alert-district">{alert.district}<sup>{alert.district === 1 ? 'er' : 'ème'}</sup></span>
                </div>
                <p className="alert-description">{alert.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="alert-actions">
        <button className="subscribe-btn">S'abonner aux notifications</button>
      </div>
    </div>
  );
}

export default AlertsPanel;