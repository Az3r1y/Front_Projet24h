import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Lyon 2180</Link>
      </div>
      
      {user && (
        <nav className="nav-links">
          <Link to="/" className="nav-link">Carte</Link>
          <Link to="/chat" className="nav-link">Chat Local</Link>
          <Link to="/activities" className="nav-link">Activités</Link>
        </nav>
      )}
      
      <div className="user-area">
        {user ? (
          <div className="user-info">
            <img src={user.avatar} alt={user.name} className="avatar" />
            <span className="username">{user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn">Se connecter</Link>
            <Link to="/register" className="auth-btn register">S'inscrire</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;