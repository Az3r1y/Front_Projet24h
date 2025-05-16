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
const RIVERS_DATA = [];

// SVG logos pour les types d'alertes
const AlertIcons = {
  inondation: ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#3498db">
      <path d="M12,20C8.69,20 6,17.31 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14C18,17.31 15.31,20 12,20Z" />
    </svg>
  ),
  earthquake: ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#e74c3c">
      <path d="M8,18L12,14L16,18L18,12L22,8L16.36,10.35L10.35,16.36L8,22V18M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12Z" />
    </svg>
  ),
  cyber: ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#9b59b6">
      <path d="M8,2A1,1 0 0,1 9,3V5H11V3A1,1 0 0,1 12,2A1,1 0 0,1 13,3V5H15V3A1,1 0 0,1 16,2A1,1 0 0,1 17,3V5H19V7H21A1,1 0 0,1 22,8A1,1 0 0,1 21,9H19V11H21A1,1 0 0,1 22,12A1,1 0 0,1 21,13H19V15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H19V19A2,2 0 0,1 17,21H7A2,2 0 0,1 5,19V17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15H5V13H3A1,1 0 0,1 2,12A1,1 0 0,1 3,11H5V9H3A1,1 0 0,1 2,8A1,1 0 0,1 3,7H5V5H7V3A1,1 0 0,1 8,2M7,7V9H9V7H7M11,7V9H13V7H11M15,7V9H17V7H15M7,11V13H9V11H7M11,11V13H13V11H11M15,11V13H17V11H15M7,15V17H9V15H7M11,15V17H13V15H11M15,15V17H17V15H15Z" />
    </svg>
  ),
  tornado: ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#7f8c8d">
      <path d="M4,3H20A1,1 0 0,1 21,4A1,1 0 0,1 20,5H4A1,1 0 0,1 3,4A1,1 0 0,1 4,3M6,7H18A1,1 0 0,1 19,8A1,1 0 0,1 18,9H6A1,1 0 0,1 5,8A1,1 0 0,1 6,7M8,11H16A1,1 0 0,1 17,12A1,1 0 0,1 16,13H8A1,1 0 0,1 7,12A1,1 0 0,1 8,11M10,15H14A1,1 0 0,1 15,16A1,1 0 0,1 14,17H10A1,1 0 0,1 9,16A1,1 0 0,1 10,15M12,19A1,1 0 0,1 13,20A1,1 0 0,1 12,21A1,1 0 0,1 11,20A1,1 0 0,1 12,19Z" />
    </svg>
  ),
  pollution: ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#95a5a6">
      <path d="M3,4H6V8H3V4M7,4H10V8H7V4M11,4H14V8H11V4M15,4H18V8H15V4M3,9H6V13H3V9M7,9H10V13H7V9M11,9H14V13H11V9M15,9H18V13H15V9M3,14H6V18H3V14M7,14H10V18H7V14M11,14H14V18H11V14M15,14H18V18H15V14Z" />
    </svg>
  ),
  default: ({ width = 24, height = 24 }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="#f1c40f">
      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
    </svg>
  )
};

// Données pour la légende des types de catastrophes
const DISASTER_TYPES = [
  { type: "inondation", label: "Inondation" },
  { type: "earthquake", label: "Tremblement de terre" },
  { type: "cyber", label: "Attaque informatique" },
  { type: "tornado", label: "Tornade" },
  { type: "pollution", label: "Pollution" }
];

// Nouveau composant pour le formulaire d'alerte
function AlertForm({ district, onSubmit, onCancel }) {
  const [alertData, setAlertData] = useState({
    type: 'default',
    description: '',
    level: 'warning' // niveau par défaut
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlertData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      district: district,
      type: alertData.type,
      description: alertData.description,
      level: alertData.level,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="alert-form-container">
      <div className="alert-form-header">
        <h3>Nouvelle alerte - {district}<sup>{district === 1 ? 'er' : 'ème'}</sup> arrondissement</h3>
        <button className="close-btn" onClick={onCancel}>×</button>
      </div>
      <form onSubmit={handleSubmit} className="alert-form">
        <div className="form-group">
          <label htmlFor="alert-type">Type d'alerte:</label>
          <select 
            id="alert-type" 
            name="type" 
            value={alertData.type} 
            onChange={handleChange}
            required
          >
            <option value="default">Choisir un type</option>
            <option value="inondation">Inondation</option>
            <option value="earthquake">Tremblement de terre</option>
            <option value="cyber">Attaque informatique</option>
            <option value="tornado">Tornade</option>
            <option value="pollution">Pollution</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="alert-description">Description:</label>
          <textarea 
            id="alert-description" 
            name="description" 
            value={alertData.description} 
            onChange={handleChange}
            rows="3"
            placeholder="Décrivez l'alerte..."
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="alert-level">Niveau de gravité:</label>
          <select 
            id="alert-level" 
            name="level" 
            value={alertData.level} 
            onChange={handleChange}
            required
          >
            <option value="info">Information</option>
            <option value="warning">Avertissement</option>
            <option value="danger">Danger</option>
            <option value="critical">Critique</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Annuler</button>
          <button type="submit" className="submit-btn">Créer l'alerte</button>
        </div>
      </form>
    </div>
  );
}

function LyonMap({ onSelectDistrict, alerts = [], onAddAlert }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtInfo, setDistrictInfo] = useState(null);
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);

  // Fonction pour gérer le clic sur un arrondissement
  const handleDistrictClick = (district) => {
    if (isAddingAlert) {
      // Si en mode ajout d'alerte, afficher le formulaire d'alerte
      setSelectedDistrict(district.id);
      setShowAlertForm(true);
    } else {
      // Comportement normal
      setSelectedDistrict(district.id);
      setDistrictInfo(district);
      if (onSelectDistrict) {
        onSelectDistrict(district.id);
      }
    }
  };

  const closeInfo = () => {
    setDistrictInfo(null);
    setSelectedDistrict(null);
    if (onSelectDistrict) {
      onSelectDistrict(null);
    }
  };

  const toggleAddAlertMode = () => {
    setIsAddingAlert(!isAddingAlert);
    // Si on quitte le mode ajout, fermer le formulaire s'il est ouvert
    if (isAddingAlert) {
      setShowAlertForm(false);
    }
  };

  const handleAlertSubmit = (newAlert) => {
    if (onAddAlert) {
      onAddAlert(newAlert);
    }
    setShowAlertForm(false);
    setIsAddingAlert(false);
  };

  const cancelAlertCreation = () => {
    setShowAlertForm(false);
  };

  // Récupère les alertes pour un arrondissement donné
  const getDistrictAlerts = (districtId) => {
    return alerts.filter(alert => alert.district === districtId);
  };

  // Rendu d'une icône d'alerte
  const renderAlertIcon = (type, options = {}) => {
    const IconComponent = AlertIcons[type] || AlertIcons.default;
    return <IconComponent {...options} />;
  };

  return (
    <div className="lyon-map-container">
      <div className="map-controls">
        <button 
          className={`add-alert-btn ${isAddingAlert ? 'active' : ''}`} 
          onClick={toggleAddAlertMode}
        >
          {isAddingAlert ? 'Annuler l\'ajout' : 'Ajouter une alerte'}
        </button>
        {isAddingAlert && (
          <div className="add-alert-instructions">
            Cliquez sur un arrondissement pour ajouter une alerte
          </div>
        )}
      </div>
      
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
                className={`district-clickable ${isAddingAlert ? 'adding-alert' : ''}`}
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
                
                {/* Icônes SVG pour les catastrophes */}
                {districtAlerts.length > 0 && (
                  <foreignObject 
                    x={district.labelPosition[0] + 5} 
                    y={district.labelPosition[1] - 30}
                    width="30" 
                    height="30"
                    className="alert-indicator"
                  >
                    {renderAlertIcon(districtAlerts[0].type, { width: 30, height: 30 })}
                  </foreignObject>
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
      {districtInfo && !showAlertForm && (
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
                      <div className="alert-icon-mini" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                        {renderAlertIcon(alert.type, { width: 20, height: 20 })}
                      </div>
                      <span>{alert.description}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Formulaire d'ajout d'alerte */}
      {showAlertForm && (
        <AlertForm 
          district={selectedDistrict}
          onSubmit={handleAlertSubmit}
          onCancel={cancelAlertCreation}
        />
      )}
      
      <div className="map-legend">
        <h4>Légende</h4>
        <div className="legend-section">
          <h5>Types de catastrophes</h5>
          {DISASTER_TYPES.map(disaster => (
            <div key={disaster.type} className="legend-item">
              <div className="legend-icon" style={{display: 'inline-block', width: '24px', marginRight: '20px'}}>
                {renderAlertIcon(disaster.type)}
              </div>
              <span className="legend-text">{disaster.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LyonMap;