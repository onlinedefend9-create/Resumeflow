-- 1. Création de la table des offres d'emploi
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT 'Confidentiel',
    country VARCHAR(2) NOT NULL DEFAULT 'MA',
    region TEXT NOT NULL,
    city TEXT NOT NULL,
    contract_type TEXT CHECK (contract_type IN ('CDI', 'CDD', 'Freelance', 'Stage', 'Remote')),
    experience_level TEXT CHECK (experience_level IN ('Junior', 'Mid', 'Senior', 'Lead')),
    skills TEXT[] DEFAULT '{}',
    description TEXT,
    is_remote BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    CONSTRAINT unique_job_offer UNIQUE (title, company, city)
);

-- 2. Activation RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 3. Politiques d'accès
CREATE POLICY "Lecture publique pour tous" 
ON public.jobs FOR SELECT USING (true);

CREATE POLICY "Insertion et modification autonomes" 
ON public.jobs FOR ALL USING (true) WITH CHECK (true);

-- 4. Index
CREATE INDEX IF NOT EXISTS idx_jobs_region ON public.jobs(region);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
