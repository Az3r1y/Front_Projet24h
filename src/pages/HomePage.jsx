import React, { useState } from 'react';
import '../styles/HomePage.css';
import { useAuth } from '../contexts/AuthContext';
import LyonMap from '../components/Map/LyonMap';
import AlertsPanel from '../components/Dashboard/AlertsPanel';
import PredictionResult from '../components/Prediction/PredictionResult';

// Fonction utilitaire pour générer des ID uniques
const generateUniqueId = (prefix = '') => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}-${random}`;
};

// Données simulées des alertes par arrondissement
const MOCK_ALERTS = [
  { id: 1, district: 1, type: 'inondation', level: 'severe', description: 'Inondation majeure le long des quais du Rhône' },
  { id: 2, district: 3, type: 'cyber', level: 'moderate', description: 'Attaque informatique sur les services municipaux' },
  { id: 3, district: 7, type: 'earthquake', level: 'light', description: 'Secousses sismiques de faible amplitude' },
  { id: 4, district: 5, type: 'tornado', level: 'warning', description: 'Alerte météo: formation de tornades possibles' },
  { id: 5, district: 9, type: 'pollution', level: 'moderate', description: 'Pics de pollution atmosphérique' },
];

// Exemple de prédictions
const MOCK_PREDICTIONS = [
  { 
    id: 'pred-1', 
    district: 2, 
    type: 'inondation', 
    level: 'warning', 
    description: "Risque d'inondation prévu dans les 48 heures, probabilité 75%",
    timestamp: new Date().toISOString()
  },
  { 
    id: 'pred-2', 
    district: 4, 
    type: 'pollution', 
    level: 'info', 
    description: "Augmentation prévue des particules fines, probabilité 65%",
    timestamp: new Date().toISOString()
  }
];

function HomePage() {
  const auth = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [predictions, setPredictions] = useState(MOCK_PREDICTIONS);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  
  // Extraction sécurisée des données utilisateur
  const username = auth?.user?.name || auth?.user?.email?.split('@')[0] || "Explorateur";
  
  const handleDistrictSelect = (districtId) => {
    setSelectedDistrict(districtId);
    console.log(`District sélectionné: ${districtId}`);
  };
  
  const handlePredictionSelect = (prediction) => {
    setSelectedPrediction(prediction);
  };
  
  const handlePredictionClose = () => {
    setSelectedPrediction(null);
  };
  
  const handlePredictionSave = (prediction) => {
    // Convertir la prédiction en alerte et l'ajouter à la liste
    const newAlert = {
      ...prediction,
      id: generateUniqueId('alert-'),
      saved: true,
      isPrediction: false // Convertir en alerte réelle
    };
    setAlerts(prev => [...prev, newAlert]);
    setPredictions(prev => prev.filter(p => p.id !== prediction.id));
    setSelectedPrediction(null);
  };
  
  // Gérer l'ajout d'une nouvelle alerte depuis la carte
  const handleAddAlert = (newAlert) => {
    // Garantir que l'alerte a un ID
    const alertId = newAlert.id || generateUniqueId(newAlert.isPrediction ? 'pred-' : 'alert-');
    const alertWithId = {
      ...newAlert,
      id: alertId
    };
    
    // Déterminer si c'est une prédiction ou une alerte régulière
    if (newAlert.isPrediction) {
      // Vérifier que cette prédiction n'existe pas déjà avant de l'ajouter
      setPredictions(prev => {
        // Si l'ID existe déjà, ne pas ajouter de doublon
        if (prev.some(p => p.id === alertWithId.id)) {
          return prev;
        }
        return [...prev, alertWithId];
      });
      
      // Afficher les détails de la prédiction
      setSelectedPrediction(alertWithId);
    } else {
      // Vérifier que cette alerte n'existe pas déjà avant de l'ajouter
      setAlerts(prev => {
        // Si l'ID existe déjà, ne pas ajouter de doublon
        if (prev.some(a => a.id === alertWithId.id)) {
          return prev;
        }
        return [...prev, alertWithId];
      });
    }
    
    console.log('Nouvel élément ajouté:', alertWithId);
  };

  return (
    <div className="home-page">
      <section className="welcome-banner">
        <h1>Bienvenue à Lyon 2180, {username}</h1>
        <p>Surveillez les alertes et participez à la protection de notre mégapole</p>
      </section>
      
      <div className="main-content">
        <div className="map-container">
          <h2>Carte des Arrondissements</h2>
          {typeof LyonMap === 'function' ? (
            <LyonMap 
              onSelectDistrict={handleDistrictSelect}
              alerts={[...alerts]}
              predictions={[...predictions]}
              onAddAlert={handleAddAlert} // Passer la fonction qui mettra à jour l'état
              selectedDistrict={selectedDistrict}
            />
          ) : (
            <div className="map-error">
              Erreur: Impossible de charger la carte
            </div>
          )}
        </div>
        
        <div className="alerts-container">
          <AlertsPanel 
            alerts={alerts} 
            predictions={predictions}
            selectedDistrict={selectedDistrict}
            onClearFilter={() => setSelectedDistrict(null)}
            onSelectPrediction={handlePredictionSelect}
          />
        </div>
      </div>
      
      {/* Modal pour afficher les détails de prédiction */}
      {selectedPrediction && (
        <PredictionResult
          result={selectedPrediction}
          onClose={handlePredictionClose}
          onSave={handlePredictionSave}
        />
      )}
    </div>
  );
}

export default HomePage;