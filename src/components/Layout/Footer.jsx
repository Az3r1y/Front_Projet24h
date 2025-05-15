import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Lyon 2180</h3>
          <p>Protection futuriste de notre mégapole contre les catastrophes naturelles et technologiques.</p>
        </div>
        
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/chat">Chat Local</Link></li>
            <li><Link to="/activities">Activités</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Services d'urgence</h3>
          <ul>
            <li>Centre de commandement: 112-2180</li>
            <li>Alerte inondation: 118-2180</li>
            <li>Défense cyber: 120-2180</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Rejoignez-nous</h3>
          <div className="social-links">
            <a href="#" className="social-link">📱</a>
            <a href="#" className="social-link">💻</a>
            <a href="#" className="social-link">📡</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2180 Lyon Mégapole - Site fictif créé pour un projet</p>
      </div>
    </footer>
  );
}

export default Footer;