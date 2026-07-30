import { Download, Check, Share2, Printer, X, Sparkles, Eye, FileCheck, Cloud, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';
import { useCVData } from '../../hooks/useCVData';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';
import { ExportModal } from './ExportModal';

interface ToolbarProps {
  currentTemplate?: string;
  onTemplateChange?: (template: string) => void;
  currentColor?: string;
  onColorChange?: (color: string) => void;
}

export const Toolbar = ({}: ToolbarProps) => {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { t, language } = useLanguage();
  const { data, isCloudSynced, isSyncing } = useCVData();
  const { user } = useAuth();

  const getLocalSaveStatusText = () => {
    if (isSyncing) {
      if (language === 'fr') return 'Enregistrement...';
      if (language === 'es') return 'Guardando...';
      if (language === 'de') return 'Speichern...';
      return 'Saving...';
    } else {
      if (language === 'fr') return 'Enregistré localement';
      if (language === 'es') return 'Guardado localmente';
      if (language === 'de') return 'Lokal gespeichert';
      return 'Saved locally';
    }
  };

  const getCloudSaveStatusText = () => {
    if (isSyncing) {
      if (language === 'fr') return 'Sauvegarde cloud...';
      if (language === 'es') return 'Guardando en la nube...';
      if (language === 'de') return 'Cloud-Speicherung...';
      return 'Cloud saving...';
    } else {
      if (language === 'fr') return 'Sauvegardé sur le cloud';
      if (language === 'es') return 'Guardado en la nube';
      if (language === 'de') return 'In der Cloud gespeichert';
      return 'Saved to cloud';
    }
  };

  const getMobileCloudStatusText = () => {
    if (isSyncing) {
      if (language === 'fr') return 'Sauvegarde...';
      if (language === 'es') return 'Guardando...';
      if (language === 'de') return 'Speichern...';
      return 'Saving...';
    } else {
      return 'Cloud';
    }
  };

  const handleExport = () => {
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-14 sm:h-16 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 md:px-10 sticky top-0 z-30 transition-all shrink-0 print:hidden no-print">
      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="font-extrabold text-[#0a0a0a] text-xs sm:text-sm md:text-base">{t.editor.editorTitle}</h2>
        <span className="text-zinc-300 hidden xs:inline">/</span>
        
        {/* Sync Status Badge */}
        {user ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100/60 text-[10px] sm:text-xs font-bold text-emerald-700 select-none animate-fadeIn">
            {isSyncing ? (
              <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            )}
            <span className="hidden sm:inline">
              {getCloudSaveStatusText()}
            </span>
            <span className="sm:hidden">
              {getMobileCloudStatusText()}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Local Save Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200/60 text-[10px] sm:text-xs font-semibold text-zinc-600 select-none animate-fadeIn">
              {isSyncing ? (
                <Loader2 className="w-3 h-3 text-zinc-500 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>
                {getLocalSaveStatusText()}
              </span>
            </div>
            
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-[10px] sm:text-xs font-bold text-indigo-700 transition-all cursor-pointer"
              title={language === 'fr' ? 'Sauvegardez vos données dans le Cloud' : 'Save your data in the Cloud'}
            >
              <Cloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'fr' ? 'Sauvegarder en ligne' : 'Save online'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <LanguageSelector compact />

        <button
          onClick={handleShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? t.editor.linkCopied : t.editor.share}</span>
        </button>

        <button
          onClick={handlePrint}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer"
          title={t.editor.print}
        >
          <Printer className="w-3.5 h-3.5 text-zinc-600" />
          <span>{t.editor.print}</span>
        </button>

        <div className="w-px h-5 bg-zinc-200 hidden sm:block mx-0.5" />

        <button
          onClick={handleExport}
          className="btn-premium btn-primary text-xs sm:text-sm font-bold flex items-center gap-1.5 py-1.5 px-3 sm:py-2 sm:px-5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{t.editor.exportPdf}</span>
        </button>
      </div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {/* Auth Modal integration */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
};
