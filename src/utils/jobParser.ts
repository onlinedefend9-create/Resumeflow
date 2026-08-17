import { createClient } from '@supabase/supabase-js';

// Configuration Supabase à partir des variables client Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Type aligné sur le schéma de la base de données ResumeFlow
export interface JobOffer {
  title: string;
  company: string;
  country: string;
  region: string;
  city: string;
  contract_type: 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Remote';
  experience_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  skills: string[];
  description: string;
  is_remote: boolean;
}

const SYSTEM_PROMPT = `
Tu es le moteur d'ingestion et de structuration de données pour la plateforme ResumeFlow.
Ton rôle est de recevoir du texte brut ou du HTML d'annonces d'emploi et de le transformer en un tableau JSON STRICT, prêt à être inséré directement dans la base de données Supabase.

1. RÈGLES DE SORTIE (FORMAT STRICT)
- Tu dois répondre UNIQUEMENT avec un tableau JSON valide (Array of Objects).
- Ne rajoute AUCUN texte explicatif, ni introduction, ni conclusion.
- N'utilise PAS de balises Markdown. La réponse doit être du JSON brut.

2. SCHÉMA DU JSON ATTENDU
[
  {
    "title": "Titre du poste (string)",
    "company": "Nom de l'entreprise (string, ou 'Confidentiel' si absent)",
    "country": "Code ISO à 2 lettres (ex: 'MA', 'FR', 'US')",
    "region": "Nom exact de la région administrative (ex: 'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Fès-Meknès', 'Île-de-France')",
    "city": "Nom de la ville principale (ex: 'Casablanca', 'Rabat', 'Fès', 'Paris')",
    "contract_type": "Type de contrat ('CDI', 'CDD', 'Freelance', 'Stage', 'Remote')",
    "experience_level": "Niveau requis ('Junior', 'Mid', 'Senior', 'Lead')",
    "skills": ["Array", "de", "skills", "normalisés"],
    "description": "Résumé propre du poste en 2 à 3 phrases maximum (string)",
    "is_remote": true/false (boolean)
  }
]

3. RÈGLES DE NORMALISATION ET MAPPING DÉTERMINISTE
- GÉOLOCALISATION :
  - Casablanca, Mohammedia, Settat -> Region: "Casablanca-Settat", Country: "MA"
  - Rabat, Salé, Kénitra -> Region: "Rabat-Salé-Kénitra", Country: "MA"
  - Fès, Meknès -> Region: "Fès-Meknès", Country: "MA"
  - Tanger, Tétouan -> Region: "Tanger-Tétouan-Al Hoceïma", Country: "MA"
  - Marrakech -> Region: "Marrakech-Safi", Country: "MA"
  - Paris, Boulogne, Saint-Denis -> Region: "Île-de-France", Country: "FR"
- COMPÉTENCES : Harmonise les noms (ex: "React.js" -> "React", "Node" -> "Node.js", "TS" -> "TypeScript").
- NETTOYAGE : Supprime les caractères spéciaux et les numéros de téléphone.
`;

/**
 * Extrait et structure un texte brut d'offre d'emploi via le proxy serveur (Ollama / Phi-3.5 ou Gemini en secours)
 */
export async function parseRawJobText(rawText: string, endpointUrl = '/api/jobs/parse'): Promise<JobOffer[]> {
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText,
        ollamaUrl: 'http://localhost:11434/api/generate' // Permet au serveur de tenter l'Ollama local de l'utilisateur si disponible
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur de parsing: ${response.statusText}`);
    }

    const data = await response.json();
    return data as JobOffer[];
  } catch (error) {
    console.error('[ResumeFlow JobParser Error]:', error);
    return [];
  }
}

/**
 * Enregistre les offres structurées dans la table Supabase `jobs`
 */
export async function saveJobsToSupabase(jobs: JobOffer[]): Promise<boolean> {
  if (!jobs || jobs.length === 0) return false;

  const { error } = await supabase
    .from('jobs')
    .upsert(jobs, { onConflict: 'title,company,city' });

  if (error) {
    console.error('[Supabase Upsert Error]:', error);
    return false;
  }

  return true;
}
