import React, { useState } from 'react';
import '../styles/HomePage.css';
import { useAuth } from '../contexts/AuthContext';
import LyonMap from '../components/Map/LyonMap';
import AlertsPanel from '../components/Dashboard/AlertsPanel';

// Données simulées des alertes par arrondissement
const MOCK_ALERTS = [
  { id: 1, district: 1, type: 'inondation', level: 'severe', description: 'Inondation majeure le long des quais du Rhône' },
  { id: 2, district: 3, type: 'cyber', level: 'moderate', description: 'Attaque informatique sur les services municipaux' },
  { id: 3, district: 7, type: 'earthquake', level: 'light', description: 'Secousses sismiques de faible amplitude' },
  { id: 4, district: 5, type: 'tornado', level: 'warning', description: 'Alerte météo: formation de tornades possibles' },
  { id: 5, district: 9, type: 'pollution', level: 'moderate', description: 'Pics de pollution atmosphérique' },
];

function HomePage() {
  const { user } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  
  const handleDistrictSelect = (districtId) => {
    setSelectedDistrict(districtId);
  };
  
  // Filtrer les alertes pour le district sélectionné
  const filteredAlerts = selectedDistrict 
    ? alerts.filter(alert => alert.district === selectedDistrict) 
    : alerts;

  return (
    <div className="home-page">
      <section className="welcome-banner">
        <h1>Bienvenue à Lyon 2180, {user?.name || "Explorateur"}</h1>
        <p>Surveillez les alertes et participez à la protection de notre mégapole</p>
      </section>
      
      <div className="main-content">
        <div className="map-container">
          <h2>Carte des Arrondissements</h2>
          <LyonMap 
            onSelectDistrict={handleDistrictSelect}
            alerts={alerts}
          />
        </div>
        
        <div className="alerts-container">
          <AlertsPanel 
            alerts={filteredAlerts} 
            selectedDistrict={selectedDistrict}
            onClearFilter={() => setSelectedDistrict(null)} 
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;