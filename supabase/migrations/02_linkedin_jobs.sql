-- 1. Création de la table des offres d'emploi LinkedIn historisées
CREATE TABLE IF NOT EXISTS public.linkedin_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    city TEXT NOT NULL,
    date TEXT,
    salary TEXT,
    url TEXT UNIQUE NOT NULL, -- L'URL unique évite d'insérer deux fois la même offre
    logo TEXT,
    source TEXT DEFAULT 'LinkedIn',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Activation de la sécurité RLS
ALTER TABLE public.linkedin_jobs ENABLE ROW LEVEL SECURITY;

-- 3. Politiques d'accès publiques et d'écriture pour tout le monde (pour simplifier la synchronisation)
CREATE POLICY "Lecture publique pour tous sur linkedin_jobs" 
ON public.linkedin_jobs FOR SELECT USING (true);

CREATE POLICY "Insertion et modification autonomes sur linkedin_jobs" 
ON public.linkedin_jobs FOR ALL USING (true) WITH CHECK (true);

-- 4. Indexation pour les recherches rapides de mots-clés et de villes
CREATE INDEX IF NOT EXISTS idx_linkedin_jobs_title ON public.linkedin_jobs(title);
CREATE INDEX IF NOT EXISTS idx_linkedin_jobs_city ON public.linkedin_jobs(city);
CREATE INDEX IF NOT EXISTS idx_linkedin_jobs_created_at ON public.linkedin_jobs(created_at DESC);
