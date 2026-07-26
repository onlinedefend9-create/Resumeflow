import { Download, Check, Share2, Printer, X, Sparkles, Eye, FileCheck } from 'lucide-react';
import { exportToPDF } from '../../lib/pdfExport';
import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';
import { useCVData } from '../../hooks/useCVData';

interface ToolbarProps {
  currentTemplate?: string;
  onTemplateChange?: (template: string) => void;
  currentColor?: string;
  onColorChange?: (color: string) => void;
}

export const Toolbar = ({}: ToolbarProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastPdf, setLastPdf] = useState<{ name: string; dataUri: string } | null>(null);
  const { t, language } = useLanguage();
  const { addExport, data } = useCVData();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const headerSection = data?.sections?.find((s) => s.type === 'header');
      const fullName = headerSection?.content?.fullName;
      const formattedName = fullName 
        ? fullName.trim().replace(/\s+/g, '_') 
        : (language === 'fr' ? 'Mon_CV' : language === 'es' ? 'Mi_CV' : language === 'de' ? 'Mein_Lebenslauf' : 'My_Resume');
      const name = `${formattedName}.pdf`;
      const dataUri = await exportToPDF('cv-canvas', name);
      if (dataUri) {
        addExport(name, dataUri);
        setLastPdf({ name, dataUri });
        setShowModal(true);
      }
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const getModalTranslations = () => {
    switch (language) {
      case 'fr':
        return {
          title: 'Votre PDF est prêt !',
          subtitle: 'Généré et sauvegardé avec succès',
          storageInfo: 'Sauvegardé dans votre Stockage Local (localStorage).',
          helpText: "Si le téléchargement automatique n'a pas démarré, vous pouvez forcer le téléchargement ou ouvrir le PDF directement dans un nouvel onglet ci-dessous.",
          download: 'Télécharger',
          open: 'Ouvrir',
          close: 'Fermer',
        };
      case 'es':
        return {
          title: '¡Tu PDF está listo!',
          subtitle: 'Generado y guardado con éxito',
          storageInfo: 'Guardado en tu almacenamiento local seguro (localStorage).',
          helpText: 'Si la descarga automática no se inició, puedes descargar manualmente o abrir el PDF en una pestaña nueva abajo.',
          download: 'Descargar',
          open: 'Abrir',
          close: 'Cerrar',
        };
      case 'de':
        return {
          title: 'Ihr PDF ist bereit!',
          subtitle: 'Erfolgreich generiert und gespeichert',
          storageInfo: 'In Ihrem sicheren lokalen Speicher (localStorage) gespeichert.',
          helpText: 'Wenn der automatische Download nicht gestartet ist, können Sie den Download manuell auslösen oder das PDF unten in einem neuen Tab öffnen.',
          download: 'Herunterladen',
          open: 'Öffnen',
          close: 'Schließen',
        };
      case 'en':
      default:
        return {
          title: 'Your PDF is ready!',
          subtitle: 'Successfully generated and saved',
          storageInfo: 'Saved in your secure Local Storage (localStorage).',
          helpText: 'If the automatic download did not start, you can manually trigger the download or open the PDF in a new tab below.',
          download: 'Download',
          open: 'Open',
          close: 'Close',
        };
    }
  };

  const mt = getModalTranslations();

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
        <span className="text-zinc-300 hidden sm:inline">/</span>
        <span className="text-[11px] sm:text-xs md:text-sm font-medium text-zinc-500 truncate max-w-[110px] sm:max-w-xs hidden xs:inline">
          ResumeFlow 2026
        </span>
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
          disabled={isExporting}
          className="btn-premium btn-primary text-xs sm:text-sm font-bold flex items-center gap-1.5 py-1.5 px-3 sm:py-2 sm:px-5 cursor-pointer disabled:opacity-75"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{isExporting ? t.editor.generating : t.editor.exportPdf}</span>
        </button>
      </div>

      {showModal && lastPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-zinc-100 p-6 space-y-6 relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  {mt.title}
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  {mt.subtitle}
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2 text-xs text-zinc-600">
              <p className="font-semibold text-zinc-800">
                {mt.storageInfo}
              </p>
              <p>
                {mt.helpText}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={lastPdf.dataUri}
                download={lastPdf.name}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <Download className="w-4 h-4" />
                <span>{mt.download}</span>
              </a>

              <button
                onClick={() => {
                  const newTab = window.open();
                  if (newTab) {
                    newTab.document.write(`<iframe src="${lastPdf.dataUri}" style="width:100%; height:100%; border:none;"></iframe>`);
                  }
                  setShowModal(false);
                }}
                className="py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold text-center flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{mt.open}</span>
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 text-center rounded-xl bg-zinc-50 hover:bg-zinc-100/80 transition-all cursor-pointer"
            >
              {mt.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


