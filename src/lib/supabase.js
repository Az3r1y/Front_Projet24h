import { createClient } from "@supabase/supabase-js";

// Vérifiez le préfixe correct selon votre bundler (REACT_APP_ pour Create React App, VITE_ pour Vite)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Ajout de vérifications pour faciliter le débogage
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erreur: Variables d'environnement Supabase manquantes!");
  console.log("SUPABASE_URL:", supabaseUrl ? "défini" : "manquant");
  console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "défini" : "manquant");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);