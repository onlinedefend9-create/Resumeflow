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
    <div className="h-14 sm:h-16 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 md:px-10 sticky top-0 z-30 transition-all shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="font-extrabold text-[#0a0a0a] text-xs sm:text-sm md:text-base">{t.editor.editorTitle}</h2>
        <span className="text-zinc-300 hidden xs:inline">/</span>
        
        {/* Sync Status Badge */}
        {user ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100/60 text-[10px] sm:text-xs font-bold text-emerald-700 select-none">
            {isSyncing ? (
              <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            )}
            <span className="hidden sm:inline">
              {isSyncing ? 'Sauvegarde cloud...' : 'Sauvegardé sur le cloud'}
            </span>
            <span className="sm:hidden">
              {isSyncing ? 'Sauvegarde...' : 'Cloud'}
            </span>
          </div>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-[10px] sm:text-xs font-bold text-indigo-700 transition-all cursor-pointer"
            title="Sauvegardez vos données dans le Cloud"
          >
            <Cloud className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sauvegarder en ligne</span>
          </button>
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
