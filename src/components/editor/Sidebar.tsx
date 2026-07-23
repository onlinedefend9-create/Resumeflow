import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Award, FolderKanban, FileText, ArrowLeft, Palette, LayoutTemplate, Languages, Check, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCVData } from '../../hooks/useCVData';
import { TemplateId } from '../../types/cv';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Sidebar = ({ activeTab = 'sections', setActiveTab }: SidebarProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { data, updateTheme, loadLanguagePreset } = useCVData();

  const sections = [
    { id: 'header', name: t.editor.headerSection, icon: FileText },
    { id: 'experience', name: t.editor.experienceSection, icon: Briefcase },
    { id: 'education', name: t.editor.educationSection, icon: GraduationCap },
    { id: 'skills', name: t.editor.skillsSection, icon: Award },
    { id: 'projects', name: t.editor.projectsSection, icon: FolderKanban },
  ];

  const templatesList: Array<{ id: TemplateId; name: string; desc: string }> = [
    { id: 'moderne', name: 'Moderne Minimal', desc: 'Tech & Product' },
    { id: 'classique', name: 'Classique Exécutif', desc: 'Corporate & Legal' },
    { id: 'creatif', name: 'Créatif Studio', desc: 'Design & Media' },
    { id: 'minimal', name: 'Ultra Minimal', desc: 'Global Standard' },
    { id: 'pro', name: 'Professionnel Elite', desc: 'Executive' },
    { id: 'tech_lead', name: 'Tech Lead Grid', desc: 'DevOps & Tech' },
    { id: 'nordic', name: 'Nordic Clean', desc: 'Scandi Design' },
    { id: 'monochrome', name: 'Monochrome Ink', desc: 'Press & Editorial' },
    { id: 'vibrant', name: 'Vibrant Pulse', desc: 'Marketing & Comms' },
    { id: 'academic', name: 'Académique & Recherche', desc: 'PhD & Research' },
    { id: 'startup', name: 'Startup Founder', desc: 'Entrepreneurs' },
    { id: 'international', name: 'International Harvard', desc: 'Strategy & Ivy' },
    { id: 'luxure', name: 'Luxury Atelier', desc: 'Fashion & Luxury' },
    { id: 'medical', name: 'Santé & Médical', desc: 'Healthcare' },
    { id: 'legal', name: 'Juridique Avocat', desc: 'Corporate Law' },
    { id: 'compact', name: 'Dense One-Page', desc: 'Senior Profiles' },
    { id: 'split_left', name: 'Sidebar Dark Accent', desc: 'IT Systems' },
    { id: 'elegant_serif', name: 'Élégant Serif', desc: 'Arts & Culture' },
    { id: 'bold_header', name: 'Header Impactful', desc: 'Sales & Business' },
    { id: 'modern_timeline', name: 'Chronologique Modern', desc: 'Project Management' },
  ];

  const colorPalette = [
    { id: '#2563eb', name: 'Bleu Saphir (Tech & Executive)', hex: '#2563eb' },
    { id: '#0d9488', name: 'Vert Émeraude (Moderne)', hex: '#0d9488' },
    { id: '#18181b', name: 'Noir Anthracite (Minimal)', hex: '#18181b' },
    { id: '#881337', name: 'Bordeaux (Luxe & Conseil)', hex: '#881337' },
    { id: '#4f46e5', name: 'Violet Indigo (Créatif)', hex: '#4f46e5' },
    { id: '#b45309', name: 'Or Cuivré (Management)', hex: '#b45309' },
    { id: '#0284c7', name: 'Bleu Océan (Ingénierie)', hex: '#0284c7' },
    { id: '#15803d', name: 'Vert Forêt (Académique)', hex: '#15803d' },
    { id: '#be123c', name: 'Rouge Rubis (Audacieux)', hex: '#be123c' },
    { id: '#312e81', name: 'Bleu Nuit (Juridique)', hex: '#312e81' },
    { id: '#475569', name: 'Gris Titane (Minimal)', hex: '#475569' },
    { id: '#d97706', name: 'Ambre Doré (Chaud)', hex: '#d97706' },
  ];

  const currentTheme = data.theme || {
    templateId: 'moderne',
    primaryColor: '#2563eb',
    fontFamily: 'sans',
    spacingDensity: 'normal'
  };

  return (
    <aside className="w-80 bg-[#0a0a0a] text-white p-5 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-zinc-800/80">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white fill-white/20" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">
                Resume<span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">Flow</span>
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
            title={t.sidebar.backHome}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.sidebar.backHome}</span>
          </Link>
        </div>

        {/* Main Category Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-[11px] font-semibold text-center">
          <button
            onClick={() => setActiveTab?.('sections')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'sections' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.sidebar.tabSections}
          </button>
          <button
            onClick={() => setActiveTab?.('templates')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'templates' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.sidebar.tabTemplates}
          </button>
          <button
            onClick={() => setActiveTab?.('design')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'design' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.sidebar.tabDesign}
          </button>
          <button
            onClick={() => setActiveTab?.('language')}
            className={`py-1.5 rounded-lg transition-all ${
              activeTab === 'language' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.sidebar.tabLanguage}
          </button>
        </div>

        {/* Tab 1: Sections */}
        {activeTab === 'sections' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
              {t.editor.structureTitle}
            </h2>
            <div className="space-y-1.5">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900/60 border border-zinc-800/80 text-zinc-300"
                >
                  <div className="flex items-center gap-2.5">
                    <section.icon className="w-4 h-4 text-blue-500" />
                    <span>{section.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-normal">{t.sidebar.onCanvas}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 italic px-1">
              {t.sidebar.sectionsTip}
            </p>
          </div>
        )}

        {/* Tab 2: Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
              {t.editor.changeTemplate}
            </h2>
            <div className="space-y-2">
              {templatesList.map((tpl) => {
                const isSelected = currentTheme.templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => updateTheme({ templateId: tpl.id as any })}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-zinc-800 text-white border-blue-500'
                        : 'bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{tpl.name}</div>
                      <div className="text-[10px] text-zinc-500">{tpl.desc}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Design */}
        {activeTab === 'design' && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
              {t.editor.colorsFonts}
            </h2>

            {/* Colors */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300 block">{t.sidebar.paletteLabel}</label>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: currentTheme.primaryColor }} />
                  {currentTheme.primaryColor}
                </div>
              </div>

              {/* Preset Swatches */}
              <div className="grid grid-cols-6 gap-2">
                {colorPalette.map((col) => {
                  const isSelected = currentTheme.primaryColor === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => updateTheme({ primaryColor: col.id })}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105' : ''
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Picker Input */}
              <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-zinc-400 font-medium text-[11px]">{t.sidebar.customColor}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTheme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                    title={t.sidebar.customColor}
                  />
                  <input
                    type="text"
                    value={currentTheme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-20 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white font-mono text-[11px] text-center focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>
            </div>

            {/* Fonts */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">{t.sidebar.typography}</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'sans', name: 'Sans-Serif', class: 'font-sans' },
                  { id: 'serif', name: 'Serif', class: 'font-serif' },
                  { id: 'mono', name: 'Mono', class: 'font-mono' },
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => updateTheme({ fontFamily: font.id as any })}
                    className={`py-2 px-2 rounded-lg border text-center font-medium ${font.class} ${
                      currentTheme.fontFamily === font.id
                        ? 'bg-zinc-800 text-white border-blue-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing Density */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 block">{t.sidebar.spacingDensity}</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
                {[
                  { id: 'compact', name: t.sidebar.compact },
                  { id: 'normal', name: t.sidebar.normal },
                  { id: 'spacious', name: t.sidebar.spacious },
                ].map((dens) => (
                  <button
                    key={dens.id}
                    onClick={() => updateTheme({ spacingDensity: dens.id as any })}
                    className={`py-2 px-1 rounded-lg border text-center ${
                      currentTheme.spacingDensity === dens.id
                        ? 'bg-zinc-800 text-white border-blue-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    {dens.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Language & Localized Content */}
        {activeTab === 'language' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                {t.sidebar.appLanguage}
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {[
                  { code: 'fr', flag: '🇫🇷', name: 'Français' },
                  { code: 'en', flag: '🇬🇧', name: 'English' },
                  { code: 'es', flag: '🇪🇸', name: 'Español' },
                  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      loadLanguagePreset(lang.code);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                      language === lang.code
                        ? 'bg-zinc-800 text-white border-blue-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                {t.sidebar.samplePresetTitle}
              </h2>
              <p className="text-[11px] text-zinc-400 px-1">
                {t.sidebar.samplePresetDesc}
              </p>
              <div className="space-y-1.5 pt-1">
                {[
                  { code: 'fr', flag: '🇫🇷', label: t.sidebar.loadPresetFr },
                  { code: 'en', flag: '🇬🇧', label: t.sidebar.loadPresetEn },
                  { code: 'es', flag: '🇪🇸', label: t.sidebar.loadPresetEs },
                  { code: 'de', flag: '🇩🇪', label: t.sidebar.loadPresetDe },
                ].map((preset) => (
                  <button
                    key={preset.code}
                    onClick={() => loadLanguagePreset(preset.code)}
                    className="w-full p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 text-xs font-semibold flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span>{preset.flag}</span>
                      <span>{preset.label}</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Auto-save status */}
      <div className="pt-4 border-t border-zinc-800/80 px-1 text-xs text-zinc-500 space-y-1 mt-6">
        <div className="flex items-center justify-between">
          <span>{t.editor.autoSave}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <p className="text-[10px] text-zinc-600">{t.editor.localStorage}</p>
      </div>
    </aside>
  );
};


