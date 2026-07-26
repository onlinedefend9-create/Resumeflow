import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import {
  Sparkles,
  ArrowRight,
  Eye,
  X,
  Search,
  Palette,
  Star,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Code,
  UserCheck,
  UserX,
  Columns,
  RotateCcw,
  LayoutGrid,
  Percent,
  Check,
  TrendingUp,
  Download,
  FileText,
  BadgeAlert,
  ThumbsUp
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TemplateId } from '../types/cv';
import { TemplateMockup } from '../components/TemplateMockup';

export interface TemplateItem {
  id: TemplateId;
  name: string;
  category: 'tech' | 'business' | 'design' | 'minimal' | 'exec';
  tag: string;
  description: string;
  color: string;
  badge?: string;
  rating: number;
  downloads: string;
  featured?: boolean;
  hasPhoto: boolean;
  columns: 1 | 2;
  level: 'entry' | 'mid' | 'exec';
  atsScore: number;
  expertTips: {
    sectors: string;
    photoAdvice: string;
    atsInsight: string;
    proAdvice: string;
  };
}

export const Templates = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'photo' | 'nophoto'>('all');
  const [columnFilter, setColumnFilter] = useState<'all' | '1' | '2'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'entry' | 'mid' | 'exec'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'ats'>('popular');
  const [selectedPreview, setSelectedPreview] = useState<TemplateItem | null>(null);
  const [cardColors, setCardColors] = useState<Record<string, string>>({});

  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const colorPalette = [
    { name: 'Bleu Canard / Teal', hex: '#087e8b' },
    { name: 'Bleu Royal', hex: '#2563eb' },
    { name: 'Émeraude', hex: '#059669' },
    { name: 'Ambre Or', hex: '#d97706' },
    { name: 'Violet Studio', hex: '#7c3aed' },
    { name: 'Rose Rubis', hex: '#e11d48' },
    { name: 'Obsidienne / Dark', hex: '#18181b' },
  ];

  const templatesList: TemplateItem[] = [
    {
      id: 'split_left',
      name: 'Studio Pastel Français',
      category: 'design',
      tag: 'Canva Standard',
      description: 'Format classique français à succès avec colonne latérale pastel, photo avatar circulaire et bandeau de poste teinté.',
      color: '#087e8b',
      badge: 'N°1 Bestseller',
      rating: 5.0,
      downloads: '64.2k',
      featured: true,
      hasPhoto: true,
      columns: 2,
      level: 'mid',
      atsScore: 100,
      expertTips: {
        sectors: 'Marketing, Communication, Ressources Humaines, Secteur Public, PME françaises.',
        photoAdvice: 'Fortement recommandée. La photo ronde s\'intègre harmonieusement avec la couleur d\'accent du profil.',
        atsInsight: 'Structure 2 colonnes parfaitement compatible avec 98% des logiciels ATS français.',
        proAdvice: 'La colonne de gauche colorée permet de structurer les compétences de façon très visuelle pour un recruteur pressé.'
      }
    },
    {
      id: 'moderne',
      name: 'Moderne Minimal Tech',
      category: 'tech',
      tag: 'Tech & Produit',
      description: 'Design épuré en deux colonnes équilibrées. Idéal pour les profils Tech, Marketing et Startup.',
      color: '#2563eb',
      badge: 'Populaire',
      rating: 4.9,
      downloads: '42.8k',
      featured: true,
      hasPhoto: true,
      columns: 2,
      level: 'mid',
      atsScore: 99,
      expertTips: {
        sectors: 'Informatique, Ingénierie, Management de Produit, Data Science, Startups innovantes.',
        photoAdvice: 'Facultative. Si ajoutée, privilégiez un portrait pro avec arrière-plan neutre ou transparent.',
        atsInsight: 'Format de grille moderne optimal. Très facilement scannable par les robots d\'acquisition.',
        proAdvice: 'Utilisez les puces de compétences teintes pour lister vos technologies clés de façon structurée.'
      }
    },
    {
      id: 'international',
      name: 'International Harvard ATS',
      category: 'exec',
      tag: 'Consulting & Strategy',
      description: 'Format standardisé selon les normes des universités Ivy League et cabinets de conseil internationaux.',
      color: '#18181b',
      badge: 'Top ATS 100%',
      rating: 5.0,
      downloads: '51.2k',
      featured: true,
      hasPhoto: false,
      columns: 1,
      level: 'exec',
      atsScore: 100,
      expertTips: {
        sectors: 'Finance, Conseil en stratégie, Gestion de fortune, Cabinets d\'audit (Big Four), postes à l\'international (US/UK).',
        photoAdvice: 'Non recommandée. Les CV anglo-saxons proscrivent strictement la photo pour éviter les biais de recrutement.',
        atsInsight: 'Score ATS maximal absolu de 100%. Aucune fioriture graphique, structure purement textuelle sérialisable.',
        proAdvice: 'Focalisez-vous sur les résultats chiffrés et l\'impact de vos actions dans les puces d\'expériences.'
      }
    },
    {
      id: 'classique',
      name: 'Classique Exécutif Serif',
      category: 'business',
      tag: 'Finance & Legal',
      description: 'Mise en page sobre et structurée avec typographie serif raffinée, parfaite pour la Finance et le Conseil.',
      color: '#18181b',
      rating: 4.9,
      downloads: '18.5k',
      hasPhoto: false,
      columns: 1,
      level: 'exec',
      atsScore: 98,
      expertTips: {
        sectors: 'Secteur juridique, Cabinets d\'avocats, Immobilier d\'exception, Banques traditionnelles.',
        photoAdvice: 'Généralement non recommandée, sauf exigence expresse du poste.',
        atsInsight: 'Gros titres clairs, police Serif hautement qualifiée et décryptée.',
        proAdvice: 'La typographie Serif confère une image d\'autorité, de rigueur académique et de classicisme de bon goût.'
      }
    },
    {
      id: 'creatif',
      name: 'Créatif Studio Bold',
      category: 'design',
      tag: 'Design & Media',
      description: 'Typographie affirmée et bandeau coloré pour les graphistes, directeurs artistiques et créatifs.',
      color: '#7c3aed',
      rating: 4.8,
      downloads: '14.3k',
      hasPhoto: true,
      columns: 2,
      level: 'mid',
      atsScore: 95,
      expertTips: {
        sectors: 'Publicité, Agences de communication, Design UX/UI, Création de contenu, Événementiel.',
        photoAdvice: 'Recommandée. Ce modèle valorise la personnalité et l\'expression créative du candidat.',
        atsInsight: 'Un peu plus complexe en raison du bloc d\'en-tête, mais structuré pour rester pleinement exploitable.',
        proAdvice: 'Choisissez une couleur d\'accent de votre univers de marque personnel pour harmoniser le document.'
      }
    },
    {
      id: 'minimal',
      name: 'Ultra Minimal Single-Page',
      category: 'minimal',
      tag: 'Global Standard',
      description: 'Focus 100% sur le texte et la hiérarchie de l\'information. Recommandé par les recruteurs internationaux.',
      color: '#3f3f46',
      rating: 4.9,
      downloads: '31.0k',
      hasPhoto: false,
      columns: 1,
      level: 'entry',
      atsScore: 100,
      expertTips: {
        sectors: 'Secteurs académiques, Administrations, Gestion administrative, Recrutement international général.',
        photoAdvice: 'Non nécessaire. Structure optimisée pour les profils ne souhaitant pas exposer de photo.',
        atsInsight: 'Excellent décryptage par tous les robots ATS du marché.',
        proAdvice: 'Le design suisse asymétrique apporte une touche de modernité subtile sans aucun artifice lourd.'
      }
    },
    {
      id: 'pro',
      name: 'Professionnel Elite Header',
      category: 'exec',
      tag: 'Executive',
      description: 'Conçu avec bandeau supérieur immersif pour mettre en avant vos accomplissements majeurs.',
      color: '#2563eb',
      rating: 4.8,
      downloads: '16.4k',
      hasPhoto: true,
      columns: 2,
      level: 'exec',
      atsScore: 97,
      expertTips: {
        sectors: 'Direction générale, Management d\'équipes, Direction des Ressources Humaines, Logistique.',
        photoAdvice: 'Recommandée. Le bandeau permet d\'insérer un portrait pro tout en conservant une structure rigoureuse.',
        atsInsight: 'L\'en-tête de pleine largeur regroupe parfaitement le nom et le titre cible.',
        proAdvice: 'Complétez la colonne de gauche avec vos soft skills clés (management, négociation, etc.).'
      }
    },
    {
      id: 'tech_lead',
      name: 'Tech Lead Terminal Grid',
      category: 'tech',
      tag: 'Software & DevOps',
      description: 'Mise en page style terminal avec badges de stack technique et grille de compétences.',
      color: '#0284c7',
      rating: 4.9,
      downloads: '11.1k',
      hasPhoto: false,
      columns: 2,
      level: 'mid',
      atsScore: 98,
      expertTips: {
        sectors: 'Ingénierie DevOps, Administration de systèmes, Cloud Architecture, Cyber-sécurité.',
        photoAdvice: 'Rarement utilisée. L\'esprit terminal de ce modèle privilégie les compétences pures.',
        atsInsight: 'Grille de compétences hautement optimisable en mots-clés de langages et technos.',
        proAdvice: 'Idéal pour lister votre expertise Cloud, vos lignes de commandes favorites ou vos dépôts open source.'
      }
    },
    {
      id: 'nordic',
      name: 'Nordic Clean Architecture',
      category: 'minimal',
      tag: 'Architecture',
      description: 'Inspiré du design scandinave avec une grille aérée et des tons neutres élégants.',
      color: '#059669',
      rating: 4.8,
      downloads: '8.7k',
      hasPhoto: false,
      columns: 1,
      level: 'mid',
      atsScore: 99,
      expertTips: {
        sectors: 'Éco-conception, Architecture, Gestion de projets RSE, Secteur associatif, Développement durable.',
        photoAdvice: 'Généralement non requise. S\'accorde avec la sobriété naturelle du design.',
        atsInsight: 'Lignes séparatrices douces et grille à une colonne optimales pour l\'ATS.',
        proAdvice: 'La palette verte forêt ou tons pierre naturelle convient magnifiquement à l\'identité nordique.'
      }
    },
    {
      id: 'monochrome',
      name: 'Monochrome Editorial Ink',
      category: 'minimal',
      tag: 'Publishing',
      description: 'Style presse haut de gamme jouant sur les contrastes noirs et blancs purs.',
      color: '#18181b',
      rating: 4.7,
      downloads: '7.2k',
      hasPhoto: false,
      columns: 1,
      level: 'mid',
      atsScore: 100,
      expertTips: {
        sectors: 'Journalisme, Édition littéraire, Sciences humaines, Traduction, Rédaction de contenu.',
        photoAdvice: 'Non recommandée pour préserver l\'aspect "presse écrite" et éditorial.',
        atsInsight: 'Format ultra-conforme à l\'ATS grâce à la linéarité parfaite du flux textuel.',
        proAdvice: 'La disposition en double colonne asymétrique textuelle est un régal à lire pour l\'œil humain.'
      }
    },
    {
      id: 'vibrant',
      name: 'Vibrant Pulse Marketing',
      category: 'design',
      tag: 'Marketing',
      description: 'Accents de couleurs vives et titres dynamiques pour capter l\'attention immédiatement.',
      color: '#e11d48',
      rating: 4.7,
      downloads: '9.8k',
      hasPhoto: true,
      columns: 2,
      level: 'mid',
      atsScore: 96,
      expertTips: {
        sectors: 'Acquisition client (Growth), Social Media Management, Événementiel, Relations de presse.',
        photoAdvice: 'Fortement conseillée pour valoriser un tempérament dynamique et avenant.',
        atsInsight: 'Contient un pavé de statistiques clés idéal pour l\'accroche du recruteur.',
        proAdvice: 'La barre de gauche en gras permet de guider l\'œil sur vos réalisations chiffrées majeures.'
      }
    },
    {
      id: 'academic',
      name: 'Académique & Recherche',
      category: 'business',
      tag: 'PhD & Science',
      description: 'Structure rigoureuse pour chercheurs, professeurs et scientifiques.',
      color: '#059669',
      rating: 4.9,
      downloads: '6.4k',
      hasPhoto: false,
      columns: 1,
      level: 'exec',
      atsScore: 100,
      expertTips: {
        sectors: 'Recherche publique, Universités, Thèses de doctorat, R&D en grandes entreprises.',
        photoAdvice: 'Non requise dans le milieu académique classique.',
        atsInsight: 'Modèle 100% conforme pour le référencement des publications scientifiques et brevets.',
        proAdvice: 'Structurez clairement la liste chronologique de vos papiers de recherche et distinctions.'
      }
    },
  ];

  const industryCategories = [
    { id: 'all', label: 'Tous les Modèles', icon: LayoutGrid },
    { id: 'tech', label: 'Tech & Produit', icon: Code },
    { id: 'business', label: 'Finance & Conseil', icon: Briefcase },
    { id: 'design', label: 'Design & Créatif', icon: Palette },
    { id: 'minimal', label: 'Minimal & ATS', icon: ShieldCheck },
    { id: 'exec', label: 'Executive & Cadres', icon: GraduationCap },
  ];

  const activeFiltersCount =
    (filter !== 'all' ? 1 : 0) +
    (photoFilter !== 'all' ? 1 : 0) +
    (columnFilter !== 'all' ? 1 : 0) +
    (levelFilter !== 'all' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const resetAllFilters = () => {
    setFilter('all');
    setPhotoFilter('all');
    setColumnFilter('all');
    setLevelFilter('all');
    setSearchQuery('');
  };

  const filteredTemplates = templatesList
    .filter(item => {
      const matchesCategory = filter === 'all' || item.category === filter;
      const matchesSearch = searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPhoto =
        photoFilter === 'all' ||
        (photoFilter === 'photo' && item.hasPhoto) ||
        (photoFilter === 'nophoto' && !item.hasPhoto);

      const matchesColumns =
        columnFilter === 'all' ||
        (columnFilter === '1' && item.columns === 1) ||
        (columnFilter === '2' && item.columns === 2);

      const matchesLevel =
        levelFilter === 'all' || item.level === levelFilter;

      return matchesCategory && matchesSearch && matchesPhoto && matchesColumns && matchesLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'ats') return b.atsScore - a.atsScore;
      const numA = parseFloat(a.downloads.replace('k', '')) || 0;
      const numB = parseFloat(b.downloads.replace('k', '')) || 0;
      return numB - numA;
    });

  const handleUseTemplate = (templateId: TemplateId) => {
    const color = cardColors[templateId] || templatesList.find(t => t.id === templateId)?.color || '#087e8b';
    navigate(`/cv-generator?template=${templateId}&color=${encodeURIComponent(color)}&lang=${language}`);
  };

  const handleColorChange = (templateId: string, color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardColors(prev => ({ ...prev, [templateId]: color }));
  };

  return (
    <div className="py-10 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-12 bg-zinc-50/20 selection:bg-cyan-500/10 selection:text-cyan-700">
      <SEO
        title={`${t.templates.title} | ResumeFlow - Modèles de CV Professionnels`}
        description={t.templates.subtitle}
      />

      {/* Hero Header Section matching cvdesignr.com/fr */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          Modèles de CV à remplir en ligne
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-none">
          Choisissez votre modèle de CV
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-medium">
          Sélectionnez un modèle de CV parmi notre collection professionnelle validée par des recruteurs. Personnalisez l'accent de couleur et commencez à rédiger instantanément.
        </p>

        {/* Dynamic Social Proof stats */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-500 font-bold">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyan-600 stroke-[3px]" />
            <span>100% Modifiables en ligne</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyan-600 stroke-[3px]" />
            <span>Normes ATS 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyan-600 stroke-[3px]" />
            <span>Export PDF vectoriel haute fidélité</span>
          </div>
        </div>
      </div>



      {/* Catalog Grid Area - Full Width */}
      <div className="pt-4">
        
        {/* Catalog Cards Grid */}
        <div>
          {filteredTemplates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-zinc-900">Aucun modèle ne correspond à vos filtres</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Essayez d'élargir votre recherche en réinitialisant certains filtres ou en saisissant un mot-clé générique.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map(tpl => {
                const currentAccentColor = cardColors[tpl.id] || tpl.color;

                return (
                  <div
                    key={tpl.id}
                    className="group bg-white rounded-2xl border border-zinc-200/95 overflow-hidden shadow-2xs hover:shadow-lg hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Header badge area */}
                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50">
                      <span className="px-2 py-0.5 bg-white border border-zinc-150 text-[9px] font-black uppercase text-zinc-700 tracking-wider rounded">
                        {tpl.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-0" />
                        <span>{tpl.rating}</span>
                      </div>
                    </div>

                    {/* Interactive visual mockup block with swatches */}
                    <div className="p-4 bg-zinc-50/60 relative flex flex-col items-center justify-center border-b border-zinc-100 group-hover:bg-zinc-50 transition-colors">
                      {/* Meta badge tags inside the visual card */}
                      <div className="w-full flex items-center justify-between mb-2.5 text-[9px] font-black uppercase tracking-wider text-zinc-500 z-10">
                        <span className="px-1.5 py-0.5 bg-white/90 rounded border border-zinc-100 shadow-2xs flex items-center gap-1">
                          {tpl.hasPhoto ? <UserCheck className="w-2.5 h-2.5 text-cyan-600" /> : <UserX className="w-2.5 h-2.5 text-zinc-400" />}
                          {tpl.hasPhoto ? 'Avec photo' : 'Sans photo'}
                        </span>
                        <span className="px-1.5 py-0.5 bg-white/90 rounded border border-zinc-100 shadow-2xs flex items-center gap-1">
                          <Columns className="w-2.5 h-2.5 text-violet-600" />
                          {tpl.columns} {tpl.columns > 1 ? 'Colonnes' : 'Colonne'}
                        </span>
                      </div>

                      {/* Mockup A4 document display */}
                      <div className="w-full aspect-[210/297] rounded shadow border border-zinc-200 bg-white overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
                        <TemplateMockup
                          templateId={tpl.id}
                          color={currentAccentColor}
                        />
                      </div>

                      {/* Accent color picker dots sit securely inside the block (Z-20 absolute for hover clickability) */}
                      <div className="w-full flex items-center justify-between pt-2.5 mt-2.5 border-t border-zinc-200/50 z-20 relative">
                        <span className="text-[9px] font-bold text-zinc-400">Accent :</span>
                        <div className="flex items-center gap-1">
                          {colorPalette.map(c => (
                            <button
                              key={c.hex}
                              onClick={(e) => handleColorChange(tpl.id, c.hex, e)}
                              className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                                currentAccentColor === c.hex
                                  ? 'scale-125 border-zinc-900 shadow-md ring-1 ring-cyan-500/30'
                                  : 'border-white hover:scale-110'
                              }`}
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Immersive hover CTA overlay strictly for A4 visual body preview */}
                      <div className="absolute inset-x-0 top-0 bottom-12 bg-zinc-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-2 z-10">
                        <button
                          onClick={() => handleUseTemplate(tpl.id)}
                          className="w-full max-w-[160px] py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Choisir
                        </button>
                        <button
                          onClick={() => setSelectedPreview(tpl)}
                          className="w-full max-w-[160px] py-2 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs border border-white/25 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Aperçu d'expert
                        </button>
                      </div>
                    </div>

                    {/* Bottom info section */}
                    <div className="p-4 space-y-2.5 bg-white">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-black text-zinc-900 group-hover:text-cyan-700 transition-colors leading-tight">
                          {tpl.name}
                        </h3>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 shrink-0 bg-zinc-150 px-1 rounded">
                          {tpl.downloads} DL
                        </span>
                      </div>

                      <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2 font-medium">
                        {tpl.description}
                      </p>

                      <div className="pt-1">
                        <button
                          onClick={() => handleUseTemplate(tpl.id)}
                          className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow transition-all"
                        >
                          <span>Rédiger mon CV</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AdSlot />

      {/* Fully Expanded Modal Preview - Inspired by CVDesignr's top-end advice & preview dashboard */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-8 space-y-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (5/12 span): Mockup Display with Live color switching */}
              <div className="md:col-span-5 bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 p-5 rounded-2xl flex flex-col items-center justify-center border border-slate-200/60 shadow-inner">
                <div className="w-full aspect-[210/297] max-w-[270px] bg-white rounded shadow-2xl overflow-hidden relative border border-zinc-300">
                  <TemplateMockup
                    templateId={selectedPreview.id}
                    color={cardColors[selectedPreview.id] || selectedPreview.color}
                    isExpanded={true}
                  />
                </div>

                {/* Direct Color Control in Full Preview Modal */}
                <div className="w-full mt-4 bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-zinc-200/80 shadow-sm space-y-2">
                  <span className="text-[10px] font-black uppercase text-zinc-800 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-cyan-600" />
                    Accent de couleur en temps réel :
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {colorPalette.map(c => (
                      <button
                        key={c.hex}
                        onClick={(e) => handleColorChange(selectedPreview.id, c.hex, e)}
                        className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                          (cardColors[selectedPreview.id] || selectedPreview.color) === c.hex
                            ? 'scale-110 border-zinc-950 shadow-md ring-2 ring-cyan-500/30'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (7/12 span): CVDesignr Recruiter & ATS Assessment Fiche */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <span className="text-[10px] font-black text-cyan-700 uppercase tracking-wider bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100 shadow-2xs">
                    {selectedPreview.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-2 tracking-tight">
                    {selectedPreview.name}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Modèle {selectedPreview.columns === 1 ? 'à 1 colonne' : 'à 2 colonnes'} • Conçu pour profils {selectedPreview.level === 'entry' ? 'juniors' : selectedPreview.level === 'mid' ? 'intermédiaires / confirmés' : 'dirigeants & cadres'}
                  </p>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                  {selectedPreview.description}
                </p>

                {/* Scorecard block */}
                <div className="grid grid-cols-2 gap-3.5 bg-zinc-50 p-4 rounded-xl border border-zinc-150">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase">Compatibilité ATS</span>
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="text-sm font-black text-zinc-900">{selectedPreview.atsScore}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase">Popularité</span>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-black text-zinc-900">Élite ({selectedPreview.downloads})</span>
                    </div>
                  </div>
                </div>

                {/* Recruiter Insight Panel */}
                <div className="space-y-3.5 pt-2">
                  <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest flex items-center gap-1 border-b border-zinc-100 pb-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    Analyse des Recruteurs & Recommandations
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-extrabold text-zinc-800 block">🎯 Secteurs cibles conseillés :</span>
                      <span className="text-zinc-600 leading-normal font-medium">{selectedPreview.expertTips.sectors}</span>
                    </div>

                    <div>
                      <span className="font-extrabold text-zinc-800 block">📷 Recommandation Photo :</span>
                      <span className="text-zinc-600 leading-normal font-medium">{selectedPreview.expertTips.photoAdvice}</span>
                    </div>

                    <div>
                      <span className="font-extrabold text-zinc-800 block">🤖 Robot d'acquisition (ATS) :</span>
                      <span className="text-zinc-600 leading-normal font-medium">{selectedPreview.expertTips.atsInsight}</span>
                    </div>

                    <div>
                      <span className="font-extrabold text-zinc-800 block">💡 Conseil exclusif de rédaction :</span>
                      <span className="text-zinc-600 leading-normal font-medium italic">{selectedPreview.expertTips.proAdvice}</span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleUseTemplate(selectedPreview.id)}
                    className="w-full sm:flex-1 py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Utiliser ce modèle maintenant
                  </button>
                  <button
                    onClick={() => setSelectedPreview(null)}
                    className="w-full sm:w-auto py-3 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Retour au catalogue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
