import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { MapPin, FileText, LayoutTemplate, BookOpen, CreditCard, Sparkles, Code2, CheckCircle2, FileCode } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const SitemapPage = () => {
  const { language } = useLanguage();

  const isFr = language === 'fr';
  const isEs = language === 'es';
  const isDe = language === 'de';

  const titles = {
    badge: isFr ? 'Indexation & Navigation' : isEs ? 'Indexación y Navegación' : isDe ? 'Indexierung & Navigation' : 'Navigation & Indexing',
    title: isFr ? 'Plan du Site' : isEs ? 'Mapa del Sitio' : isDe ? 'Sitemap' : 'Sitemap',
    subtitle: isFr 
      ? 'Retrouvez la liste complète de nos pages, modèles de CV, guides de rédaction et fichiers de référencement.'
      : isEs
      ? 'Encuentre la lista completa de nuestras páginas, plantillas de CV y guías de redacción.'
      : isDe
      ? 'Auffinden aller Seiten, Lebenslauf-Vorlagen und Leitfäden für Suchmaschinen und Nutzer.'
      : 'Find the complete directory of our pages, ATS resume templates, guides, and search indexing files.',
    mainPages: isFr ? 'Pages Principales & Outils' : 'Main Pages & Tools',
    templates: isFr ? '20 Modèles de CV ATS Conformes' : '20 ATS-Compliant Resume Templates',
    articles: isFr ? 'Articles & Guides Carrière' : 'Career Guides & Articles',
    seoFiles: isFr ? 'Fichiers Moteurs de Recherche' : 'Search Engine Files',
  };

  const templatesList = [
    { name: 'Modern Minimal', cat: 'Tech & Product', tag: 'Moderne' },
    { name: 'Executive Leader', cat: 'Business & Management', tag: 'Executive' },
    { name: 'Creative Studio', cat: 'Design & Marketing', tag: 'Créatif' },
    { name: 'Classic Professional', cat: 'Droit & Finance', tag: 'Classique' },
    { name: 'Minimalist Clean', cat: 'International', tag: 'Minimal' },
    { name: 'Tech Engineer', cat: 'Dev & Engineering', tag: 'Tech' },
    { name: 'Product Manager', cat: 'Product & Agile', tag: 'Moderne' },
    { name: 'Marketing Lead', cat: 'Communication', tag: 'Créatif' },
    { name: 'Sales Director', cat: 'Business Development', tag: 'Executive' },
    { name: 'Data Scientist', cat: 'Data & AI', tag: 'Tech' },
  ];

  return (
    <div className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto space-y-16">
      <SEO
        title={titles.title}
        description={titles.subtitle}
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{titles.badge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a0a0a]">
          {titles.title} <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ResumeFlow</span>
        </h1>
        <p className="text-zinc-600 text-base">
          {titles.subtitle}
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section 1: Main Pages */}
        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0a0a0a]">{titles.mainPages}</h2>
              <p className="text-xs text-zinc-500">Navigation rapide vers l'application</p>
            </div>
          </div>

          <ul className="space-y-3">
            <li>
              <Link to="/" className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  {isFr ? 'Page d\'Accueil' : 'Home Page'}
                </span>
                <span className="text-xs font-mono text-zinc-400">/</span>
              </Link>
            </li>
            <li>
              <Link to="/cv-generator" className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100 group">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-sm text-blue-600">
                    {isFr ? 'Éditeur & Générateur de CV' : 'Resume Editor & Builder'}
                  </span>
                </div>
                <span className="text-xs font-mono text-blue-500 font-bold">/cv-generator</span>
              </Link>
            </li>
            <li>
              <Link to="/cv-templates" className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  {isFr ? 'Catalogue des Modèles de CV' : 'Resume Templates Gallery'}
                </span>
                <span className="text-xs font-mono text-zinc-400">/cv-templates</span>
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  {isFr ? 'Tarifs & Offres Premium' : 'Pricing & Plans'}
                </span>
                <span className="text-xs font-mono text-zinc-400">/pricing</span>
              </Link>
            </li>
            <li>
              <Link to="/blog" className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  {isFr ? 'Blog & Conseils Emploi' : 'Blog & Career Tips'}
                </span>
                <span className="text-xs font-mono text-zinc-400">/blog</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 2: Blog Articles */}
        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0a0a0a]">{titles.articles}</h2>
              <p className="text-xs text-zinc-500">Guides pour réussir vos candidatures</p>
            </div>
          </div>

          <ul className="space-y-3">
            <li>
              <Link to="/blog/comment-faire-un-cv-en-2026" className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group space-y-1">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  Comment Faire un CV Parfait en 2026
                </span>
                <span className="text-xs font-mono text-zinc-400">/blog/comment-faire-un-cv-en-2026</span>
              </Link>
            </li>
            <li>
              <Link to="/blog/exemple-cv-etudiant" className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group space-y-1">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  Exemple de CV Étudiant sans Expérience
                </span>
                <span className="text-xs font-mono text-zinc-400">/blog/exemple-cv-etudiant</span>
              </Link>
            </li>
            <li>
              <Link to="/blog/competences-cv" className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-200 group space-y-1">
                <span className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                  Quelles Compétences Mettre sur son CV en 2026 ?
                </span>
                <span className="text-xs font-mono text-zinc-400">/blog/competences-cv</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Section 3: Templates List */}
        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0a0a0a]">{titles.templates}</h2>
              <p className="text-xs text-zinc-500">Accès direct aux différents styles graphiques</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templatesList.map((tpl, i) => (
              <Link
                key={i}
                to={`/cv-templates`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
              >
                <div>
                  <div className="font-semibold text-sm text-[#0a0a0a] group-hover:text-blue-600">
                    {tpl.name}
                  </div>
                  <div className="text-[11px] text-zinc-400">{tpl.cat}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-100 text-zinc-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                  {tpl.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 4: SEO Files */}
        <div className="p-8 rounded-2xl border border-zinc-200 bg-zinc-900 text-white shadow-xs space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{titles.seoFiles}</h2>
              <p className="text-xs text-zinc-400">Indexation pour Googlebot, Bingbot & moteurs de recherche</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-mono text-sm font-bold text-white group-hover:text-emerald-400">/sitemap.xml</div>
                  <div className="text-xs text-zinc-400">Format XML standard pour Google Search Console</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </a>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-mono text-sm font-bold text-white group-hover:text-blue-400">/robots.txt</div>
                  <div className="text-xs text-zinc-400">Fichier de directives pour les robots d'indexation</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
