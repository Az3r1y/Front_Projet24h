import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase'; // Assurez-vous que ce chemin est correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier la session active
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error("Erreur vérification session:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Fonction de connexion
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
        return { error };
      }
      
      return { data };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
  try {
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Le trigger PostgreSQL se charge automatiquement de créer le profil
    // Vous n'avez donc plus besoin de le faire manuellement ici
    
    return { data };
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    setError(error.message);
    return { error };
  } finally {
    setLoading(false);
  }
};

  // Déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login avec Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error("Erreur Google Auth:", error);
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}