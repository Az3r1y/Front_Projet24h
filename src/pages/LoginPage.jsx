import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, signIn, signInWithGoogle } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Connexion</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            Se connecter
          </button>
        </form>
        
        <div className="divider">OU</div>
        
        <button onClick={handleGoogleSignIn} className="google-button">
          Se connecter avec Google
        </button>
        
        <div className="auth-footer">
          <p>Pas de compte? <Link to="/register">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;