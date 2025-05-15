import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ActivitiesPage.css';

// Données simulées des activités
const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: 'Surf urbain dans le 7ème',
    description: 'Suite aux inondations, venez surfer sur les vagues artificielles créées dans le 7ème arrondissement. Équipement fourni sur place!',
    author: 'Thomas',
    authorAvatar: 'https://avatars.dicebear.com/api/initials/thomas.svg',
    date: '2025-05-14',
    district: 7,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    participants: 8,
    category: 'Sport'
  },
  {
    id: 2,
    title: 'Atelier réparation de drones de secours',
    description: 'Apprenez à réparer et programmer les drones qui participent aux opérations de secours. Niveau débutant accepté.',
    author: 'Émilie',
    authorAvatar: 'https://avatars.dicebear.com/api/initials/emilie.svg',
    date: '2025-05-17',
    district: 3,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    participants: 12,
    category: 'Tech'
  },
  {
    id: 3,
    title: 'Exploration souterraine des bunkers anti-séismes',
    description: 'Visite guidée des installations souterraines de protection contre les tremblements de terre. Découvrez comment la technologie nous protège.',
    author: 'Julien',
    authorAvatar: 'https://avatars.dicebear.com/api/initials/julien.svg',
    date: '2025-05-20',
    district: 5,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    participants: 6,
    category: 'Visite'
  },
  {
    id: 4,
    title: 'Concert flottant sur le Rhône',
    description: 'Musique électronique sur des plateformes flottantes anti-inondation. Une expérience sonore et visuelle unique.',
    author: 'Sophie',
    authorAvatar: 'https://avatars.dicebear.com/api/initials/sophie.svg',
    date: '2025-05-22',
    district: 6,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    participants: 50,
    category: 'Culturel'
  },
];

// Liste des catégories pour le filtre
const CATEGORIES = ['Tous', 'Sport', 'Tech', 'Visite', 'Culturel', 'Formation', 'Entraide'];

function ActivitiesPage() {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedDistrict, setSelectedDistrict] = useState(0);

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'Tous' || activity.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 0 || activity.district === selectedDistrict;
    return matchesCategory && matchesDistrict;
  });

  return (
    <div className="activities-page">
      <section className="activities-header">
        <h1>Activités à Lyon 2180</h1>
        <p>Découvrez et rejoignez les activités proposées par la communauté!</p>
        <Link to="/activities/new" className="create-activity-btn">
          Proposer une activité
        </Link>
      </section>
      
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="category-filter">Catégorie:</label>
          <select 
            id="category-filter" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="district-filter">Arrondissement:</label>
          <select 
            id="district-filter" 
            value={selectedDistrict} 
            onChange={(e) => setSelectedDistrict(parseInt(e.target.value))}
          >
            <option value={0}>Tous</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(district => (
              <option key={district} value={district}>
                {district}{district === 1 ? 'er' : 'ème'}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="activities-grid">
        {filteredActivities.length === 0 ? (
          <div className="no-activities">
            <p>Aucune activité ne correspond à vos critères.</p>
          </div>
        ) : (
          filteredActivities.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-image" style={{ backgroundImage: `url(${activity.image})` }}>
                <span className="activity-category">{activity.category}</span>
              </div>
              
              <div className="activity-content">
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-location">
                  {activity.district}<sup>{activity.district === 1 ? 'er' : 'ème'}</sup> arrondissement
                </p>
                <p className="activity-date">
                  {new Date(activity.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="activity-description">{activity.description}</p>
              </div>
              
              <div className="activity-footer">
                <div className="activity-author">
                  <img src={activity.authorAvatar} alt={activity.author} className="author-avatar" />
                  <span>Par {activity.author}</span>
                </div>
                <div className="activity-participants">
                  <span>{activity.participants} participant{activity.participants > 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <button className="join-activity-btn">Participer</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivitiesPage;