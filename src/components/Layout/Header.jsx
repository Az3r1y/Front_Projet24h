import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Header.css';

function Header({ session, supabase }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Détecter le défilement pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">🌍</span>
            <span className="logo-text">Lyon 2180</span>
          </Link>
        </div>
        
        <button 
          className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu principal"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`nav-container ${menuOpen ? 'open' : ''}`}>
          {session ? (
            <>
              <nav className="main-nav">
                <ul>
                  <li className={location.pathname === '/' ? 'active' : ''}>
                    <Link to="/">
                      <span className="nav-icon">🏠</span>
                      Accueil
                    </Link>
                  </li>
                  <li className={location.pathname === '/chat' ? 'active' : ''}>
                    <Link to="/chat">
                      <span className="nav-icon">💬</span>
                      Chat
                    </Link>
                  </li>
                  <li className={location.pathname.includes('/activities') ? 'active' : ''}>
                    <Link to="/activities">
                      <span className="nav-icon">📊</span>
                      Activités
                    </Link>
                  </li>
                </ul>
              </nav>
              
              <div className="user-menu">
                <div className="user-info">
                  <div className="avatar">
                    {session.user.user_metadata?.avatar_url ? (
                      <img 
                        src={session.user.user_metadata.avatar_url} 
                        alt="Avatar" 
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {(session.user.email?.charAt(0) || 'U').toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="username">
                      {session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Utilisateur'}
                    </span>
                    <span className="user-email">{session.user.email}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="logout-button">
                  <span className="logout-icon">⏻</span>
                  <span className="logout-text">Déconnexion</span>
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <p>Connectez-vous pour accéder à toutes les fonctionnalités</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;