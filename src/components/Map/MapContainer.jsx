import React, { useState } from 'react';
import LyonMap from './LyonMap';

function MapContainer() {
  // État pour stocker les alertes
  const [alerts, setAlerts] = useState([
    // Exemples d'alertes initiales
    {
      district: 1,
      type: 'inondation',
      description: 'Risque d\'inondation mineure à proximité du Rhône',
      level: 'warning',
      timestamp: '2025-05-15T10:30:00Z'
    },
    {
      district: 5,
      type: 'pollution',
      description: 'Pollution atmosphérique dépassant les seuils normaux',
      level: 'info',
      timestamp: '2025-05-14T15:20:00Z'
    }
  ]);
  
  // Fonction pour ajouter une nouvelle alerte
  const handleAddAlert = (newAlert) => {
    setAlerts(prevAlerts => [...prevAlerts, newAlert]);
  };
  
  return (
    <div className="map-container">
      <h2>Carte des alertes - Lyon</h2>
      <LyonMap 
        alerts={alerts}
        onAddAlert={handleAddAlert}
      />
    </div>
  );
}

export default MapContainer;