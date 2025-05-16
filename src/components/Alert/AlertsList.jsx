import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/AlertsList.css';

function AlertsList({ alerts }) {
  // Si pas d'alertes, afficher un message
  if (alerts.length === 0) {
    return (
      <div className="alerts-list empty">
        <p>Aucune alerte enregistrée pour le moment.</p>
      </div>
    );
  }

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
  
  // Formater la date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="alerts-section">
      <h2>Alertes enregistrées</h2>
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card alert-${alert.level}`}>
            <div className="alert-card-header">
              <div className="alert-icon-container">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-header-content">
                <h3>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</h3>
                <span className="alert-district">
                  {alert.district}<sup>{alert.district === 1 ? 'er' : 'ème'}</sup> arrondissement
                </span>
              </div>
              <span className={`alert-badge ${alert.level}`}>
                {alert.level === 'info' && 'Info'}
                {alert.level === 'warning' && 'Attention'}
                {alert.level === 'danger' && 'Danger'}
                {alert.level === 'critical' && 'Critique'}
              </span>
            </div>
            <div className="alert-card-body">
              <p>{alert.description}</p>
              <div className="alert-meta">
                <span className="alert-time">
                  {formatDate(alert.timestamp)}
                </span>
                {alert.isPrediction && (
                  <span className="prediction-badge">Prédiction</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

AlertsList.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      district: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
      isPrediction: PropTypes.bool
    })
  ).isRequired
};

export default AlertsList;