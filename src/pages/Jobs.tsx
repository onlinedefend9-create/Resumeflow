import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { JobOffer, parseRawJobText, saveJobsToSupabase } from '../utils/jobParser';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Globe, 
  Award, 
  X, 
  Zap, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export const Jobs: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [showImporter, setShowImporter] = useState(false);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  
  // Selected Job for Modal details
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  // Exemples d'annonces d'emploi pour tester l'ingestion IA
  const sampleOffers = [
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
  ];

  // Charger les offres depuis Supabase
  const fetchJobs = async () => {
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
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedRegion]);

  // Gestion de l'ingestion d'annonces brutes
  const handleIngest = async () => {
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
  };

  // Filtrage côté client sur le titre, l'entreprise et les compétences
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesContract = selectedContract ? job.contract_type === selectedContract : true;
    
    return matchesSearch && matchesContract;
  });

  // Stats calculate
  const totalJobsCount = jobs.length;
  const remoteJobsCount = jobs.filter(j => j.is_remote).length;
  const regionsCount = Array.from(new Set(jobs.map(j => j.region).filter(Boolean))).length;

  const handleAdapterCV = (job: JobOffer) => {
    navigate(`/cv-generator?jobTitle=${encodeURIComponent(job.title)}&skills=${encodeURIComponent(job.skills?.join(',') || '')}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16">
      {/* Hero Header Area */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200/80 dark:border-zinc-800/80 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Espace Recrutement & IA 2026</span>
              </div>
              <h1 className="text-3xl font-extrabold text-[#0a0a0a] dark:text-white tracking-tight">
                Offres d'Emploi & Stages
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl text-sm leading-relaxed">
                Explorez les opportunités de carrière les plus recherchées au Maroc et à l'international, et adaptez votre CV de façon chirurgicale à chaque offre.
              </p>
            </div>
            <button
              onClick={() => {
                setShowImporter(!showImporter);
                setIngestSuccess(false);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4.5 h-4.5 text-indigo-200" />
              <span>{showImporter ? "Masquer l'importeur" : "Parser une annonce (IA)"}</span>
            </button>
          </div>

          {/* Premium Market Stats Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-2">
            <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Offres Actives</span>
                <p className="text-xl font-extrabold text-[#0a0a0a] dark:text-white mt-0.5">{totalJobsCount}</p>
              </div>
            </div>

            <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Postes Remote / En Ligne</span>
                <p className="text-xl font-extrabold text-[#0a0a0a] dark:text-white mt-0.5">{remoteJobsCount}</p>
              </div>
            </div>

            <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Régions Couvertes</span>
                <p className="text-xl font-extrabold text-[#0a0a0a] dark:text-white mt-0.5">{regionsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Zone d'importation IA */}
        {showImporter && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 text-white shadow-2xl relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-48 h-48" />
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                  Moteur de Structuration Intelligent (AI Ingest)
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Collez n'importe quel texte brut de fiche de poste (depuis LinkedIn, Rekrute, Indeed ou un email). Notre IA structure instantanément l'offre.
                </p>
              </div>
              <button 
                onClick={() => setShowImporter(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exemples rapides */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-zinc-500 block mb-2">Tester rapidement avec un exemple :</span>
              <div className="flex flex-wrap gap-2">
                {sampleOffers.map((sample, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      setRawText(sample.text);
                      setIngestSuccess(false);
                    }}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl border border-zinc-700/50 transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Collez l'offre d'emploi textuelle ici..."
              className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Propulsé par Phi-3.5 Local Engine</span>
              </div>
              <div className="flex items-center gap-3">
                {ingestSuccess && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Offre publiée avec succès !
                  </span>
                )}
                <button
                  onClick={handleIngest}
                  disabled={isProcessing || !rawText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 active:scale-95"
                >
                  {isProcessing ? 'Traitement par l\'IA...' : 'Structurer & Publier'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et Filtres */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm mb-8 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Rechercher un poste, une entreprise, des mots-clés ou compétences..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchParams(e.target.value ? { search: e.target.value } : {}, { replace: true });
                }}
                className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-medium"
              />
            </div>
            <div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-semibold"
              >
                <option value="">Régions (Toutes)</option>
                <option value="Casablanca-Settat">Casablanca-Settat</option>
                <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
                <option value="Fès-Meknès">Fès-Meknès</option>
                <option value="Tanger-Tétouan-Al Hoceïma">Tanger-Tétouan-Al Hoceïma</option>
                <option value="Marrakech-Safi">Marrakech-Safi</option>
                <option value="Île-de-France">Île-de-France</option>
              </select>
            </div>
            <div>
              <select
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-semibold"
              >
                <option value="">Contrats (Tous)</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Freelance">Freelance</option>
                <option value="Stage">Stage</option>
                <option value="Remote">Télétravail</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grille des offres */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-zinc-200 rounded-2xl p-6 h-64" />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-3xl p-8 shadow-sm">
            <Briefcase className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0a0a0a]">Aucune offre trouvée</h3>
            <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
              Nous n'avons trouvé aucun poste correspondant à vos filtres. Modifiez votre recherche ou utilisez l'importateur IA.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                        {job.contract_type}
                      </span>
                      {job.experience_level && (
                        <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {job.experience_level}
                        </span>
                      )}
                    </div>
                    {job.is_remote && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-md bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400">
                        Remote
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                    <Building2 className="w-4 h-4" />
                    <span className="font-semibold">{job.company}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mt-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.city}, {job.region}</span>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-5">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills?.slice(0, 4).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-1 text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg border border-zinc-200/40 dark:border-zinc-700/45"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills && job.skills.length > 4 && (
                      <span className="px-2 py-1 text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="w-full text-center text-xs font-semibold py-2.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl transition"
                  >
                    Détails
                  </button>
                  <button 
                    onClick={() => handleAdapterCV(job)}
                    className="w-full flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Adapter CV
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Détails Modal (Slide-over or Dialog) */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity" 
              aria-hidden="true"
              onClick={() => setSelectedJob(null)}
            ></div>

            {/* Trick to center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal Content Box */}
            <div className="inline-block align-middle bg-white dark:bg-zinc-900 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-zinc-200/80 dark:border-zinc-800">
              <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-blue-50 text-blue-700 rounded-md">
                      {selectedJob.contract_type}
                    </span>
                    {selectedJob.is_remote && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-emerald-50 text-emerald-600 rounded-md">
                        Remote
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white" id="modal-title">
                    {selectedJob.title}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-500 flex items-center gap-1 mt-1">
                    <Building2 className="w-4 h-4" />
                    {selectedJob.company}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/40">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Lieu</span>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedJob.city}, {selectedJob.region} ({selectedJob.country})
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Expérience Requise</span>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {selectedJob.experience_level || "Junior / Mid"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2">Description du poste</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Required Skills */}
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-2.5">Compétences recherchées</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills?.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-3 py-1.5 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl text-zinc-700 dark:text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-all text-center"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAdapterCV(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-950/10 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Adapter mon CV avec l'IA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
