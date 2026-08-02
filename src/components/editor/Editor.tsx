import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { Canvas } from './Canvas';
import { CVRadarDendrogram } from './CVRadarDendrogram';
import { SEO } from '../SEO';
import { SlidersHorizontal, Eye, FileText, Network } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCVData } from '../../hooks/useCVData';

export const Editor = () => {
  const [activeTab, setActiveTab] = useState('sections');
  const [mobileMode, setMobileMode] = useState<'sidebar' | 'canvas'>('sidebar');
  const [viewMode, setViewMode] = useState<'document' | 'radar'>('document');
  const { language } = useLanguage();
  const { editorTheme } = useCVData();

  const isFr = language === 'fr';

  return (
    <div className={`flex flex-col lg:flex-row h-screen font-sans overflow-hidden transition-colors duration-300 ${
      editorTheme === 'dark' 
        ? 'editor-dark-mode bg-zinc-950 text-zinc-100' 
        : 'bg-zinc-100/70 text-[#0a0a0a]'
    }`}>
      <SEO
        title="Éditeur de CV Visuel | ResumeFlow"
        description="Créez et personnalisez votre CV en temps réel avec notre éditeur visuel glisser-déposer."
      />

      {/* Top Glassmorphism Toolbar (visible always) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Toolbar />

        {/* Mobile View Toggle Bar (< lg) */}
        <div className="lg:hidden bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-center gap-2 shrink-0 text-xs font-semibold text-white print:hidden no-print">
          <button
            onClick={() => setMobileMode('sidebar')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mobileMode === 'sidebar'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isFr ? 'Option & Modèles' : 'Customize & Theme'}</span>
          </button>

          <button
            onClick={() => setMobileMode('canvas')}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mobileMode === 'canvas'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isFr ? 'Aperçu du CV' : 'Resume Preview'}</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar Area: visible on lg+ or when mobileMode === 'sidebar' on mobile */}
          <div className={`${mobileMode === 'sidebar' ? 'block' : 'hidden'} lg:block w-full lg:w-80 shrink-0 h-full overflow-y-auto print:hidden no-print`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Canvas Editing Space: visible on lg+ or when mobileMode === 'canvas' on mobile */}
          <main className={`${mobileMode === 'canvas' ? 'block' : 'hidden'} lg:block flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 transition-colors duration-300 ${
            editorTheme === 'dark' ? 'bg-zinc-900/60' : 'bg-zinc-100/80'
          }`}>
            <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 space-y-6">
              
              {/* Premium Segmented Controls for Switching Views */}
              <div className="flex justify-center sm:justify-end no-print">
                <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                  editorTheme === 'dark' 
                    ? 'bg-zinc-900 border-zinc-800' 
                    : 'bg-white border-zinc-200 shadow-sm'
                }`}>
                  <button
                    onClick={() => setViewMode('document')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      viewMode === 'document'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : editorTheme === 'dark'
                          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                          : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Aperçu Classique' : 'Classic View'}</span>
                  </button>

                  <button
                    onClick={() => setViewMode('radar')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      viewMode === 'radar'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : editorTheme === 'dark'
                          ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                          : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Radar Sémantique (D3)' : 'Semantic Radar (D3)'}</span>
                  </button>
                </div>
              </div>

              {/* Toggle Content View */}
              {viewMode === 'document' ? (
                <Canvas />
              ) : (
                <div className="animate-fadeIn">
                  <CVRadarDendrogram />
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};



