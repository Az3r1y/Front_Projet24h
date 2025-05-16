import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email) {
      setErrorMessage('Veuillez entrer votre adresse email');
      return;
    }
    
    const success = await resetPassword(email);
    
    if (success) {
      setSuccessMessage('Un email de réinitialisation a été envoyé à votre adresse email');
      setEmail('');
    } else {
      setErrorMessage('Impossible d\'envoyer l\'email de réinitialisation');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Réinitialiser le mot de passe</h2>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>
        
        <div className="reset-password-footer">
          <p>
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;