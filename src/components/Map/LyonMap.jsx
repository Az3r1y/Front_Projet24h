import React, { useState } from 'react';
import '../../styles/LyonMap.css';

// Données sur les arrondissements de Lyon avec chemins SVG
const DISTRICTS_DATA = [
  {
    id: 1, 
    name: "1er",
    path: "M320,180 L340,140 L360,120 L390,130 L400,160 L380,200 L340,210 Z",
    color: "#E8DAEF", // couleur pastel violet clair
    labelPosition: [360, 170],
    description: "Le 1er arrondissement est le quartier historique des Pentes de la Croix-Rousse, connu pour son passé de tissage de la soie.",
    population: "28 500 habitants",
    attractions: ["Place des Terreaux", "Opéra de Lyon", "Jardin des Plantes"]
  },
  {
    id: 2, 
    name: "2ème",
    path: "M320,180 L340,210 L380,200 L390,240 L370,260 L340,290 L310,260 L300,230 L310,200 Z",
    color: "#FADBD8", // couleur pastel rose
    labelPosition: [340, 230],
    description: "Le 2ème arrondissement est le centre de Lyon avec la place Bellecour et la presqu'île entre Rhône et Saône.",
    population: "30 200 habitants",
    attractions: ["Place Bellecour", "Rue de la République", "Confluence"]
  },
  {
    id: 3, 
    name: "3ème",
    path: "M400,160 L440,140 L500,150 L510,190 L500,240 L460,270 L420,280 L390,240 L380,200 Z",
    color: "#FCF3CF", // couleur pastel jaune
    labelPosition: [450, 210],
    description: "Le 3ème est le plus grand arrondissement, abritant la Part-Dieu et son centre commercial.",
    population: "103 000 habitants",
    attractions: ["Tour Part-Dieu (Crayon)", "Gare de Lyon Part-Dieu", "Préfecture"]
  },
  {
    id: 4, 
    name: "4ème",
    path: "M320,180 L340,140 L310,110 L280,90 L240,100 L220,140 L250,160 L280,170 Z",
    color: "#FADBD8", // couleur pastel rose
    labelPosition: [270, 130],
    description: "Le 4ème arrondissement englobe le plateau de la Croix-Rousse avec ses traboules et son ambiance village.",
    population: "36 100 habitants",
    attractions: ["Boulevard de la Croix-Rousse", "Mur des Canuts", "Gros Caillou"]
  },
  {
    id: 5, 
    name: "5ème",
    path: "M250,160 L220,140 L180,160 L160,190 L180,230 L210,250 L240,270 L270,280 L300,230 L310,200 L310,180 L280,170 Z",
    color: "#D5F5E3", // couleur pastel vert clair
    labelPosition: [230, 220],
    description: "Le 5ème arrondissement inclut le Vieux Lyon et la colline de Fourvière, avec des vestiges romains.",
    population: "47 600 habitants",
    attractions: ["Basilique Notre-Dame de Fourvière", "Théâtres romains", "Cathédrale Saint-Jean"]
  },
  {
    id: 6, 
    name: "6ème",
    path: "M400,160 L440,140 L460,110 L450,70 L420,50 L380,60 L360,80 L350,110 L360,120 L390,130 Z",
    color: "#D6EAF8", // couleur pastel bleu clair
    labelPosition: [410, 110],
    description: "Le 6ème arrondissement est un quartier bourgeois avec le parc de la Tête d'Or et de belles avenues.",
    population: "51 500 habitants",
    attractions: ["Parc de la Tête d'Or", "Musée d'Art Contemporain", "Place Maréchal Lyautey"]
  },
  {
    id: 7, 
    name: "7ème",
    path: "M390,240 L420,280 L460,270 L480,290 L490,320 L470,350 L430,360 L390,340 L370,300 L370,260 Z",
    color: "#D5F5E3", // couleur pastel vert clair
    labelPosition: [430, 310],
    description: "Le 7ème arrondissement est un ancien quartier industriel en pleine transformation urbaine.",
    population: "82 000 habitants",
    attractions: ["Université Jean Moulin", "Parc de Gerland", "Halle Tony Garnier"]
  },
  {
    id: 8, 
    name: "8ème",
    path: "M460,270 L500,240 L520,250 L550,270 L560,300 L550,330 L520,350 L490,360 L470,350 L490,320 L480,290 Z",
    color: "#FADBD8", // couleur pastel rose
    labelPosition: [510, 310],
    description: "Le 8ème arrondissement est un quartier résidentiel avec le pôle hospitalier de Lyon-Est.",
    population: "84 700 habitants",
    attractions: ["Hôpital Édouard Herriot", "Manufacture des Tabacs", "Institut Lumière"]
  },
  {
    id: 9, 
    name: "9ème",
    path: "M220,140 L240,100 L210,70 L170,60 L130,80 L110,110 L120,150 L150,170 L180,160 Z",
    color: "#FCF3CF", // couleur pastel jaune
    labelPosition: [170, 120],
    description: "Le 9ème arrondissement comprend Vaise, la Duchère et Saint-Rambert avec des zones très contrastées.",
    population: "51 000 habitants",
    attractions: ["Île Barbe", "Quartier de l'Industrie", "Parc de Valmy"]
  }
];

// Données pour les rivières
const RIVERS_DATA = [
//   {
//     name: "Rhône",
//     path: "M400,60 C410,100 410,150 405,200 C400,240 390,280 380,340",
//     color: "#AED6F1", // bleu clair
//     width: 15
//   },
//   {
//     name: "Saône",
//     path: "M170,60 C180,100 190,140 210,180 C230,220 250,250 270,280 C290,310 310,340 330,370",
//     color: "#85C1E9", // bleu un peu plus foncé
//     width: 12
//   }
];

// Icônes pour les types d'alertes (utilisant des emojis)
const alertIcons = {
  inondation: "💧",
  earthquake: "🌋",
  cyber: "💻",
  tornado: "🌪️",
  pollution: "☁️",
  default: "⚠️"
};

// Données pour la légende des types de catastrophes
const DISASTER_TYPES = [
  { type: "inondation", label: "Inondation" },
  { type: "earthquake", label: "Tremblement de terre" },
  { type: "cyber", label: "Attaque informatique" },
  { type: "tornado", label: "Tornade" },
  { type: "pollution", label: "Pollution" }
];

function LyonMap({ onSelectDistrict, alerts = [] }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtInfo, setDistrictInfo] = useState(null);

  // Fonction pour gérer le clic sur un arrondissement
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district.id);
    setDistrictInfo(district);
    if (onSelectDistrict) {
      onSelectDistrict(district.id);
    }
  };

  const closeInfo = () => {
    setDistrictInfo(null);
    setSelectedDistrict(null);
    if (onSelectDistrict) {
      onSelectDistrict(null);
    }
  };

  // Récupère les alertes pour un arrondissement donné
  const getDistrictAlerts = (districtId) => {
    return alerts.filter(alert => alert.district === districtId);
  };

  return (
    <div className="lyon-map-container">
      <div className="map-interactive">
        <svg 
          className="lyon-map-svg" 
          viewBox="100 40 460 330"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Fond de carte */}
          <rect x="100" y="40" width="460" height="330" fill="#FEF9E7" />
          
          {/* Dessiner les arrondissements */}
          {DISTRICTS_DATA.map(district => {
            const isSelected = selectedDistrict === district.id;
            const districtAlerts = getDistrictAlerts(district.id);
            
            return (
              <g 
                key={district.id} 
                onClick={() => handleDistrictClick(district)}
                className="district-clickable"
              >
                <path 
                  d={district.path} 
                  fill={district.color}
                  stroke="#5D6D7E" 
                  strokeWidth="1.5"
                  className={`district-area ${isSelected ? 'selected' : ''}`}
                />
                
                {/* Numéro d'arrondissement */}
                <text
                  x={district.labelPosition[0]}
                  y={district.labelPosition[1]}
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#34495E"
                >
                  {district.id}
                </text>
                
                {/* Emojis pour les catastrophes */}
                {districtAlerts.length > 0 && (
                  <text
                    x={district.labelPosition[0] + 20}
                    y={district.labelPosition[1] - 10}
                    textAnchor="middle"
                    fontSize="24"
                    className="alert-emoji"
                  >
                    {alertIcons[districtAlerts[0].type] || alertIcons.default}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Dessiner les rivières au-dessus des arrondissements */}
          {RIVERS_DATA.map((river, index) => (
            <path 
              key={river.name}
              d={river.path}
              fill="none"
              stroke={river.color}
              strokeWidth={river.width}
              strokeLinecap="round"
              className="river"
              filter="url(#river-shadow)"
            />
          ))}
          
          {/* Effets pour les rivières */}
          <defs>
            <filter id="river-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="1" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge> 
                <feMergeNode />
                <feMergeNode in="SourceGraphic" /> 
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
      
      {/* Affichage des informations du district sélectionné */}
      {districtInfo && (
        <div className="district-info-panel">
          <div className="info-header">
            <h3>{districtInfo.id}<sup>{districtInfo.id === 1 ? 'er' : 'ème'}</sup> arrondissement</h3>
            <button className="close-btn" onClick={closeInfo}>×</button>
          </div>
          <p className="info-description">{districtInfo.description}</p>
          <div className="info-details">
            <p><strong>Population:</strong> {districtInfo.population}</p>
            <div className="attractions">
              <strong>Points d'intérêt:</strong>
              <ul>
                {districtInfo.attractions.map((attraction, index) => (
                  <li key={index}>{attraction}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {alerts.filter(alert => alert.district === districtInfo.id).length > 0 && (
            <div className="district-alerts">
              <h4>Alertes actuelles:</h4>
              <ul>
                {alerts
                  .filter(alert => alert.district === districtInfo.id)
                  .map((alert, index) => (
                    <li key={index} className={`alert-item-mini alert-${alert.level}`}>
                      <span className="alert-emoji-mini">
                        {alertIcons[alert.type] || alertIcons.default}
                      </span>
                      <span>{alert.description}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="map-legend">
        <h4>Légende</h4>
        <div className="legend-section">
          <h5>Types de catastrophes</h5>
          {DISASTER_TYPES.map(disaster => (
            <div key={disaster.type} className="legend-item">
              <span className="legend-emoji">{alertIcons[disaster.type]}</span>
              <span>{disaster.label}</span>
            </div>
          ))}
        </div>
              
        {/* <div className="legend-section">
          <h5>Éléments géographiques</h5>
          <div className="legend-item">
            <span className="legend-line" style={{backgroundColor: '#AED6F1'}}></span>
            <span className="legend-text">Rhône</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{backgroundColor: '#85C1E9'}}></span>
            <span className="legend-text">Saône</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default LyonMap;