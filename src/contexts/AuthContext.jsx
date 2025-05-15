import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simuler la vérification d'un token stocké lors du chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Fonction de login
  const login = (email, password) => {
    // Dans un vrai projet, vous feriez un appel API ici
    // Simulation d'une connexion réussie
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      avatar: `https://avatars.dicebear.com/api/initials/${email.split('@')[0]}.svg`
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Fonction d'inscription
  const register = (name, email, password) => {
    // Dans un vrai projet, vous feriez un appel API ici
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      avatar: `https://avatars.dicebear.com/api/initials/${name}.svg`
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}