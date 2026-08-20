-- Activation de l'extension pgcrypto pour générer des UUID si nécessaire et faire des hashs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Création de la table des offres scrapées historisées
CREATE TABLE IF NOT EXISTS public.scraped_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source TEXT NOT NULL DEFAULT 'LinkedIn',
    source_url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT,
    country TEXT,
    contract_type TEXT,
    experience_level TEXT,
    description TEXT,
    skills TEXT[],
    salary TEXT,
    company_rating NUMERIC,
    logo TEXT,
    is_remote BOOLEAN DEFAULT false,
    content_hash TEXT NOT NULL,
    scraped_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    meta JSONB DEFAULT '{}'::jsonb
);

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.scraped_jobs ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès (Policies) pour permettre la lecture publique et l'écriture complète par le service_role
CREATE POLICY "Lecture publique pour tous sur scraped_jobs" 
ON public.scraped_jobs FOR SELECT USING (true);

CREATE POLICY "Insertion et modification par le service_role sur scraped_jobs" 
ON public.scraped_jobs FOR ALL USING (true) WITH CHECK (true);

-- Index pour accélérer les performances de filtrage et de tri
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_source ON public.scraped_jobs(source);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_city ON public.scraped_jobs(city);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_scraped_at ON public.scraped_jobs(scraped_at DESC);
