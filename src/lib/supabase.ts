import { createClient } from "@supabase/supabase-js";

const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://egszycbulbqgnaiuqdoq.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc3p5Y2J1bGJxZ25haXVxZG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTczODIsImV4cCI6MjEwMDg5MzM4Mn0.GzHZSp5kDsql-h2T7QEYG61uBE1Dx9I-9ECUEsLTtQo";

let supabaseUrl = rawUrl;

try {
  const parts = supabaseAnonKey.split('.');
  if (parts.length === 3) {
    const decoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (decoded && decoded.ref) {
      supabaseUrl = `https://${decoded.ref}.supabase.co`;
    }
  }
} catch (err) {
  console.warn("[Supabase] Impossible de décoder la clé, utilisation de l'URL par défaut :", err);
}

if (!(import.meta as any).env.VITE_SUPABASE_URL || !(import.meta as any).env.VITE_SUPABASE_ANON_KEY) {
  console.info(
    "Utilisation des identifiants Supabase par défaut pour le développement."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
