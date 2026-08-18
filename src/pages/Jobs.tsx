import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { JobOffer, parseRawJobText, saveJobsToSupabase } from '../utils/jobParser';
import { 
  Briefcase, 
  Sparkles, 
  Building2, 
  Globe, 
  Filter
} from 'lucide-react';

// Subcomponents
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { AiIngestModal } from '../components/jobs/AiIngestModal';
import { JobFiltersBar } from '../components/jobs/JobFiltersBar';
import { StatsDashboard } from '../components/jobs/StatsDashboard';
import { ExternalJob, UnifiedJob } from '../components/jobs/types';

// Helper to extract numeric salary for sorting
function parseSalary(salary: string | undefined | null): number {
  if (!salary) return 0;
  // Nettoyer la chaîne pour ne garder que les chiffres
  const clean = salary.replace(/\s/g, '').toLowerCase();
  const numbers = clean.match(/\d+/g);
  if (!numbers) return 0;
  
  // Convertir en entiers
  const parsed = numbers.map(n => parseInt(n, 10));
  // S'il y a une fourchette (ex: "12 000 MAD - 15 000 MAD"), retourner la moyenne
  if (parsed.length > 1) {
    return (parsed[0] + parsed[1]) / 2;
  }
  return parsed[0] || 0;
}

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Tabs: 'local' (Annonces ResumeFlow) or 'external' (Moteur Multi-Source Adzuna, Jooble, Glassdoor)
  const [activeTab, setActiveTab] = useState<'local' | 'external'>('local');

  // local jobs state
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showImporter, setShowImporter] = useState(false);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  
  // Selected Job for Modal details
  const [selectedJob, setSelectedJob] = useState<UnifiedJob | null>(null);

  // External search states
  const [extKeywords, setExtKeywords] = useState('React');
  const [extLocation, setExtLocation] = useState('Casablanca');
  const [extCountry, setExtCountry] = useState('MA');
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [extLoading, setExtLoading] = useState(false);
  const [extSourceFilter, setExtSourceFilter] = useState<'all' | 'Adzuna' | 'Jooble' | 'Glassdoor'>('all');
  const [importingIndex, setImportingIndex] = useState<number | null>(null);
  const [importSuccessIndex, setImportSuccessIndex] = useState<number | null>(null);

  // Exemples d'annonces d'emploi pour tester l'ingestion IA
  const sampleOffers = useMemo(() => [
    {
      label: "Dev React - Casablanca (CDI)",
      text: "Nous recherchons un Développeur Front-End React passionné pour rejoindre l'équipe de TechCorp à Casablanca. Contrat CDI. Niveau requis : Mid (Intermédiaire). Vous devez maîtriser React, TypeScript et Tailwind CSS. Le salaire proposé est compris entre 12000 et 15000 MAD. Mission : Concevoir et intégrer des interfaces web réactives et fluides."
    },
    {
      label: "Data Analyst - Rabat (Stage Remote)",
      text: "L'entreprise DataSolutions basée à Rabat recherche un Data Analyst stagiaire pour un contrat de Stage de fin d'études. Compétences clés requises : Python, SQL, et PowerBI. Profil Junior motivé, possibilité d'embauche après le stage. Télétravail autorisé (Remote: true)."
    },
    {
      label: "Lead Cloud Architect - Paris (Freelance)",
      text: "Cabinet de conseil parisien recherche en urgence un Lead Cloud Architect indépendant (Freelance) pour accompagner un grand compte. Compétences indispensables : AWS, Kubernetes, Terraform. Expérience exigée : Senior/Lead. Mission de 6 mois renouvelable en télétravail partiel."
    }
  ], []);

  // Charger les offres depuis Supabase
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

    if (selectedRegion) {
      query = query.eq('region', selectedRegion);
    }

    const { data, error } = await query;
    if (!error && data) {
      setJobs(data as JobOffer[]);
    }
    setLoading(false);
  }, [selectedRegion]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Execute external jobs search
  const handleExternalSearch = useCallback(async () => {
    if (!extKeywords.trim()) return;
    setExtLoading(true);
    try {
      const response = await fetch('/api/external-jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: extKeywords,
          location: extLocation,
          country: extCountry
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          setExternalJobs(data.results);
        }
      }
    } catch (err) {
      console.error("Error searching external jobs:", err);
    } finally {
      setExtLoading(false);
    }
  }, [extKeywords, extLocation, extCountry]);

  // Run initial external search if tab becomes active
  useEffect(() => {
    if (activeTab === 'external' && externalJobs.length === 0) {
      handleExternalSearch();
    }
  }, [activeTab, externalJobs.length, handleExternalSearch]);

  // Save an external job to Supabase (Ingest/Import)
  const handleImportToSupabase = useCallback(async (extJob: ExternalJob, index: number) => {
    setImportingIndex(index);
    try {
      const jobToSave: JobOffer = {
        title: extJob.title,
        company: extJob.company,
        country: extJob.country,
        region: extJob.region || 'Région locale',
        city: extJob.city || extLocation,
        contract_type: (extJob.contract_type as any) || 'CDI',
        experience_level: (extJob.experience_level as any) || 'Mid',
        skills: extJob.skills || [],
        description: extJob.description,
        is_remote: extJob.is_remote
      };

      const success = await saveJobsToSupabase([jobToSave]);
      if (success) {
        setImportSuccessIndex(index);
        fetchJobs(); // Reload local list
        setTimeout(() => {
          setImportSuccessIndex(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Error importing job:", err);
    } finally {
      setImportingIndex(null);
    }
  }, [extLocation, fetchJobs]);

  // Gestion de l'ingestion d'annonces brutes
  const handleIngest = useCallback(async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setIngestSuccess(false);
    
    try {
      const parsed = await parseRawJobText(rawText);
      if (parsed && parsed.length > 0) {
        const success = await saveJobsToSupabase(parsed);
        if (success) {
          setIngestSuccess(true);
          setRawText('');
          setTimeout(() => {
            setIngestSuccess(false);
            setShowImporter(false);
          }, 2000);
          fetchJobs(); // Rafraîchir la liste
        }
      }
    } catch (err) {
      console.error('Failed to ingest job:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [rawText, fetchJobs]);

  // Memorized Filtering & Sorting for local jobs
  const processedJobs = useMemo(() => {
    // 1. Filtrer
    const filtered = jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesContract = selectedContract ? job.contract_type === selectedContract : true;
      
      const jobCountry = (job.country || 'MA').toUpperCase();
      let matchesCountry = true;
      if (selectedCountry === 'ALL') {
        matchesCountry = true;
      } else if (selectedCountry === 'INTL') {
        matchesCountry = jobCountry !== 'MA';
      } else {
        matchesCountry = jobCountry === selectedCountry;
      }
      
      return matchesSearch && matchesContract && matchesCountry;
    });

    // 2. Trier
    if (sortBy === 'salaryDesc') {
      return [...filtered].sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    }
    if (sortBy === 'salaryAsc') {
      return [...filtered].sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
    }

    return filtered;
  }, [jobs, searchTerm, selectedContract, selectedCountry, sortBy]);

  // Memorized Filtering & Sorting for external jobs
  const processedExternalJobs = useMemo(() => {
    // 1. Filtrer
    const filtered = externalJobs.filter(job => {
      if (extSourceFilter === 'all') return true;
      return job.source.toLowerCase() === extSourceFilter.toLowerCase();
    });

    // 2. Trier
    if (sortBy === 'salaryDesc') {
      return [...filtered].sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    }
    if (sortBy === 'salaryAsc') {
      return [...filtered].sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
    }

    return filtered;
  }, [externalJobs, extSourceFilter, sortBy]);

  // Stats Dashboard counters (memoized)
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      remote: jobs.filter(j => j.is_remote).length,
      regions: Array.from(new Set(jobs.map(j => j.region).filter(Boolean))).length
    };
  }, [jobs]);

  const handleAdapterCV = useCallback((job: UnifiedJob) => {
    navigate(`/cv-generator?jobTitle=${encodeURIComponent(job.title)}&skills=${encodeURIComponent(job.skills?.join(',') || '')}`);
  }, [navigate]);

  const handleSearchTermChange = useCallback((val: string) => {
    setSearchTerm(val);
    setSearchParams(val ? { search: val } : {}, { replace: true });
  }, [setSearchParams]);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16">
      {/* Hero Header Area */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Espace Emploi Multi-Source & Intelligence Artificielle</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0a0a0a] dark:text-white tracking-tight">
                Offres d'Emploi & Stages
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl text-sm leading-relaxed">
                Explorez les opportunités de carrière les plus recherchées au Maroc et à l'international depuis notre base ou en direct d'Adzuna, Jooble, et Glassdoor.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowImporter(!showImporter);
                  setIngestSuccess(false);
                }}
                className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Analyseur IA de Texte</span>
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'local' ? 'external' : 'local')}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md text-xs transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4 text-indigo-200" />
                <span>{activeTab === 'local' ? "Rechercher en Direct (APIs)" : "Voir nos Offres Locales"}</span>
              </button>
            </div>
          </div>

          {/* Premium Market Stats Dashboard */}
          <StatsDashboard 
            totalJobsCount={stats.total} 
            remoteJobsCount={stats.remote} 
            regionsCount={stats.regions} 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Toggle Onglets de Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8">
          <button
            onClick={() => setActiveTab('local')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'local' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Base de données ResumeFlow</span>
            <span className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full text-xs font-semibold">
              {stats.total}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('external')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'external' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Moteur Multi-Source (Adzuna, Jooble, Glassdoor)</span>
            <span className="bg-gradient-to-r from-amber-500 to-indigo-500 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase">
              LIVE API
            </span>
          </button>
        </div>

        {/* Zone d'importation IA */}
        {showImporter && (
          <AiIngestModal 
            onClose={() => setShowImporter(false)}
            rawText={rawText}
            setRawText={setRawText}
            onIngest={handleIngest}
            isProcessing={isProcessing}
            ingestSuccess={ingestSuccess}
            sampleOffers={sampleOffers}
          />
        )}

        {/* CONTENU ONGLET LOCAL */}
        {activeTab === 'local' && (
          <>
            {/* Barre de recherche et Filtres locaux */}
            <JobFiltersBar 
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              selectedContract={selectedContract}
              onContractChange={setSelectedContract}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />

            {/* Grille des offres locales */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-zinc-200 rounded-2xl p-6 h-64" />
                ))}
              </div>
            ) : processedJobs.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-850">
                <Briefcase className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0a0a0a] dark:text-white">Aucune offre trouvée</h3>
                <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
                  Nous n'avons trouvé aucun poste correspondant à vos filtres. Modifiez votre recherche ou utilisez l'importateur IA.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedJobs.map((job, index) => (
                  <JobCard 
                    key={index}
                    job={job}
                    onDetailsClick={() => setSelectedJob(job)}
                    onAdapterClick={() => handleAdapterCV(job)}
                    isExternal={false}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* CONTENU ONGLET EXTERNE (APIs LIVE) */}
        {activeTab === 'external' && (
          <>
            {/* Formulaire de recherche externe */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="text-xs font-bold text-zinc-500 block mb-1.5 uppercase tracking-wider">Métier ou Compétence</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="ex: React, Data Analyst, Product Manager..."
                      value={extKeywords}
                      onChange={(e) => setExtKeywords(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-zinc-500 block mb-1.5 uppercase tracking-wider">Ville / Pays</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="ex: Casablanca, Paris, London..."
                      value={extLocation}
                      onChange={(e) => setExtLocation(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-zinc-500 block mb-1.5 uppercase tracking-wider">Code Pays</label>
                  <select
                    value={extCountry}
                    onChange={(e) => setExtCountry(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                  >
                    <option value="MA">Maroc (MA)</option>
                    <option value="FR">France (FR)</option>
                    <option value="US">États-Unis (US)</option>
                    <option value="GB">Royaume-Uni (GB)</option>
                    <option value="DE">Allemagne (DE)</option>
                  </select>
                </div>

                {/* Sort selection inside external search too */}
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-zinc-500 block mb-1.5 uppercase tracking-wider">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                  >
                    <option value="recent">Pertinence</option>
                    <option value="salaryDesc">Salaire Décroissant 💰</option>
                    <option value="salaryAsc">Salaire Croissant 💸</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <button
                    onClick={handleExternalSearch}
                    disabled={extLoading || !extKeywords.trim()}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    {extLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Filtres par source API */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 mr-2">
                  <Filter className="w-3.5 h-3.5" />
                  Filtrer la source API :
                </span>
                {[
                  { id: 'all', label: 'Toutes les sources' },
                  { id: 'Adzuna', label: 'Adzuna' },
                  { id: 'Jooble', label: 'Jooble' },
                  { id: 'Glassdoor', label: 'Glassdoor' }
                ].map((src) => (
                  <button
                    key={src.id}
                    onClick={() => setExtSourceFilter(src.id as any)}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all font-semibold cursor-pointer ${
                      extSourceFilter === src.id
                        ? 'bg-[#0a0a0a] border-zinc-900 text-white dark:bg-white dark:text-zinc-950 dark:border-white'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste de résultats externes */}
            {extLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white border border-zinc-200 rounded-2xl p-6 h-64" />
                ))}
              </div>
            ) : processedExternalJobs.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-850">
                <Globe className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#0a0a0a] dark:text-white">Aucun résultat externe</h3>
                <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
                  Veuillez lancer une recherche avec vos mots-clés ci-dessus pour interroger Adzuna, Jooble et Glassdoor en temps réel.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedExternalJobs.map((job, index) => (
                  <JobCard 
                    key={index}
                    job={job as UnifiedJob}
                    onDetailsClick={() => setSelectedJob(job as UnifiedJob)}
                    onAdapterClick={() => handleAdapterCV(job as UnifiedJob)}
                    isExternal={true}
                    onImportClick={() => handleImportToSupabase(job, index)}
                    isImporting={importingIndex === index}
                    isImportSuccess={importSuccessIndex === index}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Détails Modal */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onAdapterClick={() => {
            handleAdapterCV(selectedJob);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};
