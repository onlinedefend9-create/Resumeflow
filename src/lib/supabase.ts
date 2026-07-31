import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://egszycbulbqgnaiuqdoq.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "sb_publishable_E7ehb-ZDwbwxulDWaHsrzw_oLA6UcwP";

if (!(import.meta as any).env.VITE_SUPABASE_URL || !(import.meta as any).env.VITE_SUPABASE_ANON_KEY) {
  console.info(
    "Utilisation des identifiants Supabase par défaut pour le développement."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
