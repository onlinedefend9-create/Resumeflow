import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Globe, 
  Filter
} from 'lucide-react';

// Subcomponents
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { JobAlertSubscription } from '../components/jobs/JobAlertSubscription';
import { AdSenseBanner } from '../components/ads/AdSenseBanner';
import { ExternalJob, UnifiedJob } from '../components/jobs/types';

// Helper to extract numeric salary for sorting
function parseSalary(salary: string | undefined | null): number {
  if (!salary) return 0;
  const clean = salary.replace(/\s/g, '').toLowerCase();
  const numbers = clean.match(/\d+/g);
  if (!numbers) return 0;
  
  const parsed = numbers.map(n => parseInt(n, 10));
  if (parsed.length > 1) {
    return (parsed[0] + parsed[1]) / 2;
  }
  return parsed[0] || 0;
}

export const Jobs: React.FC = () => {
  const navigate = useNavigate();

  // External search states
  const [extKeywords, setExtKeywords] = useState('React');
  const [extLocation, setExtLocation] = useState('Casablanca');
  const [extCountry, setExtCountry] = useState('MA');
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [extLoading, setExtLoading] = useState(false);
  const [extSourceFilter, setExtSourceFilter] = useState<'all' | 'Adzuna' | 'Jooble' | 'Glassdoor' | 'LinkedIn'>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [linkedinSource, setLinkedinSource] = useState<'cache' | 'linkedin' | null>(null);
  
  // Selected Job for Modal details
  const [selectedJob, setSelectedJob] = useState<UnifiedJob | null>(null);

  // Execute external jobs search
  const handleExternalSearch = useCallback(async () => {
    if (!extKeywords.trim()) return;
    setExtLoading(true);
    try {
      const searchPromise = fetch('/api/external-jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: extKeywords,
          location: extLocation,
          country: extCountry
        })
      })
        .then(r => r.ok ? r.json() : { results: [] })
        .catch(err => {
          console.warn("External search query failed gracefully:", err);
          return { results: [] };
        });

      const linkedinPromise = fetch(`/api/external-jobs/linkedin?keyword=${encodeURIComponent(extKeywords)}&location=${encodeURIComponent(extLocation)}&page=0&limit=20`)
        .then(r => r.ok ? r.json() : { results: [] })
        .catch(err => {
          console.warn("LinkedIn search query failed gracefully:", err);
          return { results: [] };
        });

      const [searchData, linkedinData] = await Promise.all([searchPromise, linkedinPromise]);
      const mainResults = searchData.results || [];
      const linkedinResults = linkedinData.results || [];

      setExternalJobs([...mainResults, ...linkedinResults]);
      
      if (linkedinData && linkedinData.success) {
        setLinkedinSource(linkedinData.source);
      } else {
        setLinkedinSource(null);
      }
    } catch (err) {
      console.error("Error searching external jobs:", err);
      setLinkedinSource(null);
    } finally {
      setExtLoading(false);
    }
  }, [extKeywords, extLocation, extCountry]);

  // Run initial external search on mount
  useEffect(() => {
    handleExternalSearch();
  }, [handleExternalSearch]);

  // Filter & Sort
  const processedExternalJobs = useMemo(() => {
    const filtered = externalJobs.filter(job => {
      if (extSourceFilter === 'all') return true;
      return job.source.toLowerCase() === extSourceFilter.toLowerCase();
    });

    if (sortBy === 'salaryDesc') {
      return [...filtered].sort((a, b) => parseSalary(b.salary) - parseSalary(a.salary));
    }
    if (sortBy === 'salaryAsc') {
      return [...filtered].sort((a, b) => parseSalary(a.salary) - parseSalary(b.salary));
    }

    return filtered;
  }, [externalJobs, extSourceFilter, sortBy]);

  const handleAdapterCV = useCallback((job: UnifiedJob) => {
    navigate(`/cv-generator?jobTitle=${encodeURIComponent(job.title)}&skills=${encodeURIComponent(job.skills?.join(',') || '')}`);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Simple & Clean Header */}
        <div className="mb-8 border-b border-zinc-100 pb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0a0a0a] dark:text-white tracking-tight">
            Offres d'Emploi & Stages
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 font-medium">
            Découvrez des milliers d'opportunités de carrière qualifiées en temps réel.
          </p>
        </div>

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
                className="w-full py-2.5 bg-[#0a0a0a] hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-95 cursor-pointer"
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
              { id: 'Glassdoor', label: 'Glassdoor' },
              { id: 'LinkedIn', label: 'LinkedIn' }
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setExtSourceFilter(src.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all font-semibold cursor-pointer flex items-center gap-2 ${
                  extSourceFilter === src.id
                    ? 'bg-[#0a0a0a] border-zinc-900 text-white dark:bg-white dark:text-zinc-950 dark:border-white'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300'
                }`}
              >
                {src.label}
                {src.id === 'LinkedIn' && linkedinSource && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                    linkedinSource === 'cache'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/20'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/20'
                  }`}>
                    {linkedinSource === 'cache' ? '⚡ Cache' : '🟢 Live'}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {linkedinSource && (
            <div className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/30 rounded-xl p-3 animate-fade-in">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                linkedinSource === 'cache' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
              }`}></span>
              <span>
                {linkedinSource === 'cache' 
                  ? "Les dernières offres LinkedIn ont été chargées instantanément depuis le cache d'API local (TTL 1h)."
                  : "Les dernières offres LinkedIn ont été récupérées en temps réel depuis l'API officielle de LinkedIn."
                }
              </span>
            </div>
          )}
        </div>

        {/* Formulaire d'alerte mail Firebase Cloud Function */}
        <JobAlertSubscription keywords={extKeywords} location={extLocation} country={extCountry} />

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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedExternalJobs.map((job, index) => (
                <React.Fragment key={index}>
                  <JobCard 
                    job={job as UnifiedJob}
                    onDetailsClick={() => setSelectedJob(job as UnifiedJob)}
                    onAdapterClick={() => handleAdapterCV(job as UnifiedJob)}
                    isExternal={true}
                  />
                  {/* Bannière AdSense intégrée de manière fluide après la 3ème offre */}
                  {index === 2 && (
                    <div className="col-span-full">
                      <AdSenseBanner adFormat="horizontal" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Deuxième bannière au bas de la liste pour maximiser le taux de clics */}
            {processedExternalJobs.length > 3 && (
              <div className="pt-2">
                <AdSenseBanner adFormat="horizontal" />
              </div>
            )}
          </div>
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
