import React from 'react';
import '../../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <p>&copy; {currentYear} Lyon 2180 - Tous droits réservés</p>
        </div>
        <div className="footer-links">
          <a href="/">Confidentialité</a>
          <span className="divider">•</span>
          <a href="/">Conditions</a>
          <span className="divider">•</span>
          <a href="/">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;