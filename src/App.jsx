import './App.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import ActivitiesPage from './pages/ActivitiesPage'
import NewActivityPage from './pages/NewActivityPage'

// Créez le client Supabase avec vos clés d'API
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Vérifiez que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Variables d'environnement Supabase manquantes!")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Composant de route protégée qui utilise la session Supabase
const ProtectedRoute = ({ children, session }) => {
  if (!session) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // S'abonner aux changements de session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Configuration avancée pour Auth UI
  const authOptions = {
    providers: ['google'], // Ajouter d'autres fournisseurs au besoin
    redirectTo: `${window.location.origin}/`,
    onlyThirdPartyProviders: false,
    magicLink: false,
    appearance: { 
      theme: ThemeSupa,
      variables: {
        default: {
          colors: {
            brand: '#3b82f6',
            brandAccent: '#2563eb',
          },
        },
      },
      // Personnaliser les labels si nécessaire
      labels: {
        button: {
          sign_in: 'Se connecter',
          sign_up: 'S\'inscrire',
        },
        input: {
          email: 'Email',
          password: 'Mot de passe',
        },
        message: {
          // Messages personnalisés ici
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header session={session} supabase={supabase} />
        <main className="content">
          {!session ? (
            <div className="auth-container">
              <div className="auth-form">
                <h2>Bienvenue</h2>
                <Auth
                  supabaseClient={supabase}
                  {...authOptions}
                />
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat" element={
                <ProtectedRoute session={session}>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/activities" element={
                <ProtectedRoute session={session}>
                  <ActivitiesPage />
                </ProtectedRoute>
              } />
              <Route path="/activities/new" element={
                <ProtectedRoute session={session}>
                  <NewActivityPage />
                </ProtectedRoute>
              } />
            </Routes>
          )}
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}