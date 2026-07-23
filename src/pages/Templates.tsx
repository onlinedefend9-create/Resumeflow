import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import { Sparkles, ArrowRight, Eye, Check, X, FileText, Search, Palette, Star, SlidersHorizontal, ShieldCheck } from 'lucide-react';
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
  rating?: number;
  downloads?: string;
}

export const Templates = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPreview, setSelectedPreview] = useState<TemplateItem | null>(null);
  const [cardColors, setCardColors] = useState<Record<string, string>>({});
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const colorPalette = [
    '#2563eb', // Royal Blue
    '#059669', // Emerald
    '#f59e0b', // Amber/Gold
    '#7c3aed', // Violet
    '#e11d48', // Rose
    '#18181b', // Obsidian Dark
  ];

  const templatesList: TemplateItem[] = [
    {
      id: 'split_left',
      name: 'Graphicforest Studio Dark',
      category: 'design',
      tag: 'Portfolio & Creative',
      description: 'Format portefeuille moderne avec sidebar sombre, photo avatar encadrée d\'or et timeline d\'expérience à fort impact.',
      color: '#f59e0b',
      badge: 'Bestseller 2026',
      rating: 4.9,
      downloads: '14.2k'
    },
    {
      id: 'moderne',
      name: 'Moderne Minimal',
      category: 'tech',
      tag: 'Tech & Product',
      description: 'Design épuré en deux colonnes équilibrées. Idéal pour les profils Tech, Marketing, Produit et Startup.',
      color: '#2563eb',
      badge: 'Populaire',
      rating: 4.8,
      downloads: '22.8k'
    },
    {
      id: 'classique',
      name: 'Classique Exécutif',
      category: 'business',
      tag: 'Finance & Legal',
      description: 'Mise en page sobre et structurée avec typographie serif raffinée, parfaite pour la Finance et le Conseil.',
      color: '#18181b',
      rating: 4.9,
      downloads: '18.5k'
    },
    {
      id: 'creatif',
      name: 'Créatif Studio Bold',
      category: 'design',
      tag: 'Design & Media',
      description: 'Typographie affirmée et bandeau diagonal coloré pour les graphistes, directeurs artistiques et créatifs.',
      color: '#8b5cf6',
      badge: 'Tendance',
      rating: 4.7,
      downloads: '9.3k'
    },
    {
      id: 'minimal',
      name: 'Ultra Minimal',
      category: 'minimal',
      tag: 'US & Global Standard',
      description: 'Focus 100% sur le texte et la hiérarchie de l\'information. Recommandé par les recruteurs internationaux.',
      color: '#3f3f46',
      rating: 4.9,
      downloads: '31.0k'
    },
    {
      id: 'pro',
      name: 'Professionnel Elite',
      category: 'exec',
      tag: 'Executive & Management',
      description: 'Conçu avec bandeau supérieur immersif pour mettre en avant vos accomplissements majeurs.',
      color: '#2563eb',
      rating: 4.8,
      downloads: '16.4k'
    },
    {
      id: 'tech_lead',
      name: 'Tech Lead Grid',
      category: 'tech',
      tag: 'Software & DevOps',
      description: 'Mise en page style terminal avec badges de stack technique et grille de compétences interactives.',
      color: '#0284c7',
      badge: 'Nouveau',
      rating: 4.9,
      downloads: '11.1k'
    },
    {
      id: 'nordic',
      name: 'Nordic Clean',
      category: 'minimal',
      tag: 'Architecture & Design',
      description: 'Inspiré du design scandinave avec une grille aérée, des marges généreuses et des tons neutres élégants.',
      color: '#52525b',
      rating: 4.8,
      downloads: '8.7k'
    },
    {
      id: 'monochrome',
      name: 'Monochrome Ink',
      category: 'minimal',
      tag: 'Publishing & Media',
      description: 'Style presse haut de gamme jouant sur les contrastes noirs et blancs purs pour un impact éditorial.',
      color: '#09090b',
      rating: 4.7,
      downloads: '7.2k'
    },
    {
      id: 'vibrant',
      name: 'Vibrant Pulse',
      category: 'design',
      tag: 'Marketing & Comms',
      description: 'Accents de couleurs vives et titres dynamiques pour capter l\'attention des recruteurs dès la première seconde.',
      color: '#d97706',
      rating: 4.6,
      downloads: '6.8k'
    },
    {
      id: 'academic',
      name: 'Académique & Recherche',
      category: 'business',
      tag: 'PhD & Science',
      description: 'Structure rigoureuse pour chercheurs, professeurs et scientifiques valorisant publications et doctorat.',
      color: '#15803d',
      rating: 4.9,
      downloads: '5.4k'
    },
    {
      id: 'startup',
      name: 'Startup Founder',
      category: 'tech',
      tag: 'Entrepreneurs & Scaleup',
      description: 'Présentation orientée résultats, métriques d\'impact (ARR, Users) et projets à forte croissance.',
      color: '#ec4899',
      badge: 'Inspiration',
      rating: 4.8,
      downloads: '12.9k'
    },
    {
      id: 'international',
      name: 'International Harvard',
      category: 'exec',
      tag: 'Consulting & Strategy',
      description: 'Format rigoureusement standardisé selon les normes des universités Ivy League et cabinets de conseil.',
      color: '#1e3a8a',
      badge: 'Recommandé ATS',
      rating: 5.0,
      downloads: '45.1k'
    },
    {
      id: 'luxure',
      name: 'Luxury Atelier',
      category: 'design',
      tag: 'Fashion & Hospitality',
      description: 'Typographie sérif sophistiquée et monogramme raffiné pour le luxe, la mode et l\'hôtellerie haut de gamme.',
      color: '#78350f',
      rating: 4.9,
      downloads: '8.1k'
    },
    {
      id: 'medical',
      name: 'Santé & Médical',
      category: 'business',
      tag: 'Healthcare & Pharma',
      description: 'Lignes épurées et structurées adaptées aux médecins, infirmiers, pharmaciens et professionnels de santé.',
      color: '#0d9488',
      rating: 4.9,
      downloads: '10.3k'
    },
    {
      id: 'legal',
      name: 'Juridique Avocat',
      category: 'business',
      tag: 'Droit & Corporate',
      description: 'Mise en page formelle et solennelle en bleu marine et or, valorisant la formation et le barreau.',
      color: '#312e81',
      rating: 4.9,
      downloads: '9.0k'
    },
    {
      id: 'compact',
      name: 'Dense One-Page',
      category: 'minimal',
      tag: 'Profils d\'Expérience',
      description: 'Optimisation maximale de l\'espace pour faire tenir 10+ ans de carrière sur une seule page fluide.',
      color: '#475569',
      rating: 4.8,
      downloads: '19.7k'
    },
    {
      id: 'elegant_serif',
      name: 'Élégant Serif',
      category: 'design',
      tag: 'Arts & Culture',
      description: 'Un charme classique revisité avec une police serif raffinée pour les métiers littéraires et culturels.',
      color: '#701a75',
      rating: 4.7,
      downloads: '6.1k'
    },
    {
      id: 'bold_header',
      name: 'Header Impactful',
      category: 'exec',
      tag: 'Sales & Business Dev',
      description: 'Bandeau supérieur immersif et puissant pour marquer l\'esprit avec une accroche commerciale forte.',
      color: '#b91c1c',
      rating: 4.8,
      downloads: '13.2k'
    },
    {
      id: 'modern_timeline',
      name: 'Chronologique Modern',
      category: 'exec',
      tag: 'Project Managers',
      description: 'Ligne du temps fluide reliée par des puces pour retracer la progression de carrière avec clarté.',
      color: '#0369a1',
      rating: 4.9,
      downloads: '15.8k'
    }
  ];

  const filteredTemplates = templatesList.filter(item => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (templateId: TemplateId) => {
    const color = cardColors[templateId] || templatesList.find(t => t.id === templateId)?.color || '#2563eb';
    navigate(`/cv-generator?template=${templateId}&color=${encodeURIComponent(color)}&lang=${language}`);
  };

  const handleColorChange = (templateId: string, color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardColors(prev => ({ ...prev, [templateId]: color }));
  };

  return (
    <div className="py-12 md:py-20 px-6 md:px-10 max-w-7xl mx-auto space-y-12">
      <SEO
        title={`${t.templates.title} | CVCraft`}
        description={t.templates.subtitle}
      />

      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/80 backdrop-blur-md text-xs font-semibold text-zinc-700 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>{t.templates.headerBadge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0a0a0a] leading-tight">
          {t.templates.headerTitle1} <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">{t.templates.headerTitle2}</span>
        </h1>
        <p className="text-zinc-600 text-base md:text-lg max-w-2xl mx-auto font-normal">
          {t.templates.headerSubtitle}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un modèle (ex: Tech, Harvard, Avocat...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: `${t.templates.filterAll} (${templatesList.length})` },
              { id: 'tech', label: t.templates.filterTech },
              { id: 'business', label: t.templates.filterBusiness },
              { id: 'design', label: t.templates.filterDesign },
              { id: 'minimal', label: t.templates.filterMinimal },
              { id: 'exec', label: t.templates.filterExec }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-[#0a0a0a] text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Catalog Grid - Studio Artistic Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map(tpl => {
          const currentAccentColor = cardColors[tpl.id] || tpl.color;

          return (
            <div
              key={tpl.id}
              className="group relative rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Badge & Category Header */}
              <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/60">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block px-3 py-1 bg-white border border-zinc-200 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-2xs"
                    style={{ color: currentAccentColor }}
                  >
                    {tpl.tag}
                  </span>
                  {tpl.badge && (
                    <span className="px-2.5 py-0.5 bg-amber-400 text-zinc-950 font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-2xs">
                      {tpl.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{tpl.rating}</span>
                </div>
              </div>

              {/* Studio Backdrop Container */}
              <div className="p-5 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] relative flex flex-col items-center justify-center group-hover:from-[#cbd5e1] group-hover:to-[#94a3b8] transition-colors">
                
                {/* Header Tagline */}
                <div className="w-full flex items-center justify-between mb-2 text-[9px] font-extrabold uppercase tracking-widest text-zinc-600">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-600" /> ATS 100% OK</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-zinc-700" /> VECTOR PDF</span>
                </div>

                {/* 3D Realistic CV Paper Document Container */}
                <div className="w-full aspect-[210/297] rounded-xs shadow-2xl shadow-zinc-900/40 border border-zinc-300/80 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300">
                  <TemplateMockup
                    templateId={tpl.id}
                    color={currentAccentColor}
                  />
                </div>

                {/* Interactive Color Switcher Bar On Card */}
                <div className="w-full flex items-center justify-between pt-3 mt-3 border-t border-zinc-300/80">
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] font-bold text-zinc-700">Couleurs:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {colorPalette.map(c => (
                      <button
                        key={c}
                        onClick={(e) => handleColorChange(tpl.id, c, e)}
                        className={`w-4 h-4 rounded-full border transition-all ${
                          currentAccentColor === c ? 'scale-125 border-zinc-900 shadow-sm' : 'border-white hover:scale-110'
                        }`}
                        style={{ backgroundColor: c }}
                        title="Changer la couleur d'accentuation"
                      />
                    ))}
                  </div>
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 gap-3 z-10">
                  <button
                    onClick={() => handleUseTemplate(tpl.id)}
                    className="btn-premium btn-primary text-xs font-bold px-7 py-3 flex items-center gap-2 shadow-lg w-full max-w-[200px] justify-center"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t.templates.useTemplate}
                  </button>
                  <button
                    onClick={() => setSelectedPreview(tpl)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-2 w-full max-w-[200px] justify-center border border-white/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t.templates.preview}
                  </button>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-5 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#0a0a0a]">
                    {tpl.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">{tpl.downloads} DL</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                  {tpl.description}
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => handleUseTemplate(tpl.id)}
                    className="w-full btn-premium btn-primary text-xs font-bold py-2.5 flex items-center justify-center gap-2"
                  >
                    {t.templates.useTemplate} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AdSlot />

      {/* Full-Screen Zoomed Interactive Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-zinc-200 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Zoom Preview Canvas */}
              <div className="w-full md:w-1/2 bg-[#cbd5e1] p-5 rounded-2xl border border-zinc-300 shadow-inner flex flex-col items-center">
                <div className="w-full aspect-[210/297] max-w-[320px] bg-white rounded-xs shadow-2xl overflow-hidden relative">
                  <TemplateMockup
                    templateId={selectedPreview.id}
                    color={cardColors[selectedPreview.id] || selectedPreview.color}
                    isExpanded={true}
                  />
                </div>
              </div>

              {/* Information & Actions */}
              <div className="w-full md:w-1/2 space-y-6 text-left">
                <div className="space-y-2">
                  <span className="px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-bold uppercase tracking-wider" style={{ color: cardColors[selectedPreview.id] || selectedPreview.color }}>
                    {selectedPreview.tag}
                  </span>

                  <h3 className="text-3xl font-extrabold text-[#0a0a0a]">
                    {selectedPreview.name}
                  </h3>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed">
                  {selectedPreview.description}
                </p>

                {/* Color Chooser in Modal */}
                <div className="space-y-2 border-t border-zinc-100 pt-4">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-blue-600" />
                    Personnaliser la couleur d'accentuation:
                  </label>
                  <div className="flex items-center gap-2">
                    {colorPalette.map(c => (
                      <button
                        key={c}
                        onClick={(e) => handleColorChange(selectedPreview.id, c, e)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          (cardColors[selectedPreview.id] || selectedPreview.color) === c
                            ? 'scale-110 border-zinc-900 shadow-md ring-2 ring-blue-500/20'
                            : 'border-white hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-y border-zinc-100 py-4 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Conforme à 100% aux robots de recrutement (ATS)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Export PDF Vectoriel HD sans perte de qualité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Support Multi-langues (FR, EN, ES, DE)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleUseTemplate(selectedPreview.id)}
                    className="btn-premium btn-primary text-sm font-bold px-8 py-4 flex-1 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t.templates.useTemplate}
                  </button>
                  <button
                    onClick={() => setSelectedPreview(null)}
                    className="px-6 py-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 font-semibold text-sm transition-colors"
                  >
                    {t.templates.close}
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
