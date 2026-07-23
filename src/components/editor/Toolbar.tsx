import { Download, Check, Share2, Printer } from 'lucide-react';
import { exportToPDF } from '../../lib/pdfExport';
import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';

interface ToolbarProps {
  currentTemplate?: string;
  onTemplateChange?: (template: string) => void;
  currentColor?: string;
  onColorChange?: (color: string) => void;
}

export const Toolbar = ({}: ToolbarProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('cv-canvas', 'Mon_CV.pdf');
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsExporting(false);
    }
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
    <div className="h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-3">
        <h2 className="font-extrabold text-[#0a0a0a] text-sm md:text-base">{t.editor.editorTitle}</h2>
        <span className="text-zinc-300">/</span>
        <span className="text-xs md:text-sm font-medium text-zinc-500 truncate max-w-[150px] sm:max-w-xs">
          International Resume 2026
        </span>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSelector compact />

        <button
          onClick={handleShare}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? t.editor.linkCopied : t.editor.share}</span>
        </button>

        <button
          onClick={handlePrint}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
          title="Imprimer / Enregistrer en PDF (navigateur)"
        >
          <Printer className="w-3.5 h-3.5 text-zinc-600" />
          <span>Imprimer</span>
        </button>

        <div className="w-px h-5 bg-zinc-200 hidden sm:block mx-1" />

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-premium btn-primary text-xs md:text-sm font-bold flex items-center gap-2 py-2 px-5 cursor-pointer disabled:opacity-75"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? t.editor.generating : t.editor.exportPdf}</span>
        </button>
      </div>
    </div>
  );
};


