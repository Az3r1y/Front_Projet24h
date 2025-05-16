import React, { useState } from 'react';
import LyonMap from './LyonMap';

function MapContainer() {
  // État pour stocker les alertes
  const [alerts, setAlerts] = useState([
    // Exemples d'alertes initiales
    {
      id: 1,
      district: 1,
      type: 'inondation',
      description: 'Risque d\'inondation mineure à proximité du Rhône',
      level: 'warning',
      timestamp: '2025-05-15T10:30:00Z',
      isPrediction: false
    },
    {
      id: 2,
      district: 5,
      type: 'pollution',
      description: 'Pollution atmosphérique dépassant les seuils normaux',
      level: 'info',
      timestamp: '2025-05-14T15:20:00Z',
      isPrediction: false
    }
  ]);
  
  // Fonction pour ajouter une nouvelle alerte ou prédiction
  const handleAddAlert = (newAlert) => {
    const alertWithId = {
      ...newAlert,
      id: alerts.length + 1 // Générer un ID simple pour cette démo
    };
    setAlerts(prevAlerts => [...prevAlerts, alertWithId]);
  };
  
  return (
    <div className="map-container">
      <h2>Carte des alertes et prédictions - Lyon</h2>
      <LyonMap 
        alerts={alerts}
        onAddAlert={handleAddAlert}
      />

      <div className="alerts-legend">
        <div className="legend-item">
          <span className="legend-color" style={{background: '#e74c3c'}}></span>
          <span>Alerte réelle</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: '#9b59b6'}}></span>
          <span>Prédiction</span>
        </div>
      </div>
    </div>
  );
}

export default MapContainer;