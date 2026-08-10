import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Award, FolderKanban, FileText, ArrowLeft, Palette, LayoutTemplate, Languages, Check, Sparkles, Zap, Download, Eye, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCVData } from '../../hooks/useCVData';
import { TemplateId } from '../../types/cv';
import { TextCVImport } from './TextCVImport';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Sidebar = ({ activeTab = 'sections', setActiveTab }: SidebarProps) => {
  const { t, language, setLanguage } = useLanguage();
  const { data, setData, updateTheme, loadLanguagePreset, exports, deleteExport } = useCVData();
  const [isTextImportModalOpen, setIsTextImportModalOpen] = useState(false);

  const handleDownloadExport = (dataUri: string, filename: string) => {
    try {
      if (dataUri.startsWith('data:')) {
        const byteString = atob(dataUri.split(',')[1]);
        const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } else {
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('Error downloading from history item:', e);
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenExport = (dataUri: string) => {
    try {
      let targetUrl = dataUri;
      if (dataUri.startsWith('data:')) {
        const byteString = atob(dataUri.split(',')[1]);
        const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        targetUrl = URL.createObjectURL(blob);
      }
      const newTab = window.open(targetUrl, '_blank');
      if (!newTab) {
        alert(language === 'fr' ? "Impossible d'ouvrir le PDF. Veuillez autoriser les fenêtres pop-up." : "Could not open PDF. Please allow popups.");
      }
    } catch (e) {
      console.error('Error opening history item:', e);
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<iframe src="${dataUri}" style="width:100%; height:100%; border:none;"></iframe>`);
      }
    }
  };

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
    <aside className="w-full lg:w-80 bg-[#0a0a0a] text-white p-4 sm:p-5 flex flex-col justify-between shrink-0 h-full lg:h-screen lg:sticky lg:top-0 overflow-y-auto border-r border-zinc-800/80">
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
        {activeTab === 'sections' && (() => {
          const headerSection = data.sections.find(s => s.type === 'header');
          const photo = headerSection?.content?.photo;
          const showPhoto = headerSection?.content?.showPhoto !== false;

          const handlePhotoUpload = (base64: string) => {
            if (headerSection) {
              setData(prev => ({
                ...prev,
                sections: prev.sections.map(s => 
                  s.type === 'header' 
                    ? { ...s, content: { ...s.content, photo: base64, showPhoto: true } }
                    : s
                )
              }));
            }
          };

          const handleToggleShowPhoto = (checked: boolean) => {
            if (headerSection) {
              setData(prev => ({
                ...prev,
                sections: prev.sections.map(s => 
                  s.type === 'header' 
                    ? { ...s, content: { ...s.content, showPhoto: checked } }
                    : s
                )
              }));
            }
          };

          const handleRemovePhoto = () => {
            if (headerSection) {
              setData(prev => ({
                ...prev,
                sections: prev.sections.map(s => 
                  s.type === 'header' 
                    ? { ...s, content: { ...s.content, photo: '' } }
                    : s
                )
              }));
            }
          };

          return (
            <div className="space-y-4 animate-fadeIn">
              {/* Premium AI Text Import CTA */}
              <div className="p-4 bg-gradient-to-br from-indigo-950/40 via-indigo-900/10 to-transparent rounded-2xl border border-indigo-900/40 space-y-3 shadow-md text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/10">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      Remplissage par IA
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-indigo-500 to-purple-500 text-white leading-none scale-90">
                        <Sparkles className="w-2.5 h-2.5 fill-white/10" /> PRO
                      </span>
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-medium">Analyse et import intelligent</p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsTextImportModalOpen(true)}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:border-indigo-400 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Remplir mon CV par IA (Copier-coller)
                </button>
              </div>

              {/* Photo de Profil Widget */}
              <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 shrink-0">
                    {photo ? (
                      <img referrerPolicy="no-referrer" src={photo} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-[10px] font-bold">Photo</div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="text-xs font-bold text-white leading-tight">Photo de Profil</h4>
                    <p className="text-[10px] text-zinc-500 truncate">Format JPEG, PNG ou SVG</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[10px] text-center cursor-pointer transition-colors shadow-sm">
                    Choisir un fichier
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              handlePhotoUpload(ev.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {photo && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-[10px] transition-colors border border-zinc-700"
                    >
                      Supprimer
                    </button>
                  )}
                </div>

                <label className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPhoto}
                    onChange={(e) => handleToggleShowPhoto(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-black"
                  />
                  <span>Afficher la photo sur le CV</span>
                </label>
              </div>

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
          );
        })()}

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

      {/* PDF Export History */}
      {exports && exports.length > 0 && (
        <div className="pt-4 border-t border-zinc-800/80 px-1 space-y-2 mt-6">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'fr' ? 'Exports PDF récents' : 'Recent PDF Exports'}</span>
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {exports.map((item) => (
              <div key={item.id} className="p-2 bg-zinc-900/80 rounded-lg border border-zinc-800 flex flex-col gap-1 text-[11px] text-zinc-300">
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="truncate max-w-[140px]">{item.name}</span>
                  <span className="text-[9px] text-zinc-500 font-normal">{item.date}</span>
                </div>
                <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-800/60">
                  <button
                    onClick={() => handleDownloadExport(item.dataUri, item.name)}
                    className="flex-1 py-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold text-center transition-all cursor-pointer"
                  >
                    {language === 'fr' ? 'Télécharger' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleOpenExport(item.dataUri)}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold transition-all cursor-pointer"
                  >
                    {language === 'fr' ? 'Ouvrir' : 'Open'}
                  </button>
                  <button
                    onClick={() => deleteExport(item.id)}
                    className="p-1 hover:text-red-500 text-zinc-500 rounded transition-all cursor-pointer"
                    title={language === 'fr' ? 'Supprimer' : 'Delete'}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Auto-save status */}
      <div className="pt-4 border-t border-zinc-800/80 px-1 text-xs text-zinc-500 space-y-1 mt-6">
        <div className="flex items-center justify-between">
          <span>{t.editor.autoSave}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <p className="text-[10px] text-zinc-600">{t.editor.localStorage}</p>
      </div>

      <TextCVImport isOpen={isTextImportModalOpen} onClose={() => setIsTextImportModalOpen(false)} />
    </aside>
  );
};


