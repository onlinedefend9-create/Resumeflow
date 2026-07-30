import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCVData } from '../../hooks/useCVData';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  X, Download, Sliders, Globe, Palette, Eye, Sparkles, 
  Check, FileCheck, Loader2, AlertCircle, RefreshCw, FileText, Trash2, Printer
} from 'lucide-react';
import { exportToPDF, ExportPDFOptions } from '../../lib/pdfExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { data, setData, addExport } = useCVData();
  const { language, setLanguage, t } = useLanguage();

  const [isInIframe, setIsInIframe] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsInIframe(window.self !== window.top);
    }
  }, []);

  // Export parameters
  const [format, setFormat] = useState<'a4' | 'letter'>('a4');
  const [dpi, setDpi] = useState<'high' | 'standard' | 'low'>('high');
  const [compress, setCompress] = useState<boolean>(true);
  
  // Watermark parameters
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('RESUMEFLOW PRO');
  const [watermarkType, setWatermarkType] = useState<'diagonal' | 'footer'>('footer');
  const [watermarkColor, setWatermarkColor] = useState<string>('#4f46e5');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.08);

  // Theme overrides
  const [accentColor, setAccentColor] = useState<string>(data.theme.primaryColor || '#2563eb');
  const [fontFamily, setFontFamily] = useState<string>('sans');

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [stepName, setStepName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedPdfUri, setGeneratedPdfUri] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Sync initial state
      setAccentColor(data.theme.primaryColor || '#2563eb');
      setErrorMsg(null);
      setGeneratedPdfUri(null);
      setProgress(0);
      setStepName('');
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const handleApplyTheme = () => {
    setData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        primaryColor: accentColor
      }
    }));
  };

  const handleStartExport = async () => {
    setIsGenerating(true);
    setProgress(0);
    setErrorMsg(null);
    setGeneratedPdfUri(null);

    // Formulate final filename
    const headerSection = data?.sections?.find((s) => s.type === 'header');
    const fullName = headerSection?.content?.fullName;
    const formattedName = fullName 
      ? fullName.trim().replace(/\s+/g, '_') 
      : (language === 'fr' ? 'Mon_CV' : language === 'es' ? 'Mi_CV' : 'My_Resume');
    const filename = `${formattedName}_${format.toUpperCase()}.pdf`;

    const options: ExportPDFOptions = {
      format,
      dpi,
      compress,
      language,
      theme: {
        accentColor,
        fontFamily
      },
      watermark: {
        enabled: watermarkEnabled,
        text: watermarkText,
        type: watermarkType,
        color: watermarkColor,
        opacity: watermarkOpacity
      },
      onProgress: (p, step) => {
        setProgress(p);
        setStepName(step);
      }
    };

    try {
      // Small delay to make it feel robust and let user read steps
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = await exportToPDF('cv-canvas', filename, options);
      
      if (result) {
        setGeneratedPdfUri(result.blobUrl);
        addExport(filename, result.dataUri);
      } else {
        throw new Error(language === 'fr' ? "La génération du PDF a échoué sans code d'erreur" : "PDF generation failed silently");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (language === 'fr' ? "Erreur imprévue lors de l'export" : "Unexpected error during export"));
    } finally {
      setIsGenerating(false);
    }
  };

  // Color options
  const themeColors = [
    { name: 'Bleu Royal', value: '#2563eb' },
    { name: 'Indigo Moderne', value: '#4f46e5' },
    { name: 'Émeraude Pro', value: '#059669' },
    { name: 'Noir Élégant', value: '#18181b' },
    { name: 'Améthyste Luxe', value: '#7c3aed' },
    { name: 'Cramoisie', value: '#e11d48' }
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 print:hidden no-print">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/45 backdrop-blur-md transition-opacity print:hidden no-print" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-zinc-200/80 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[92vh] print:hidden no-print">
        
        {/* Left Side: Advanced Settings */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-zinc-200/80 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Configuration Export</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format & Resolution */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">1. Mise en page & Qualité</h3>
              
              {/* Format selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('a4')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    format === 'a4' 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <p className="text-sm font-bold text-zinc-900">Format A4</p>
                  <p className="text-[11px] text-zinc-500 font-medium">210 × 297 mm (Standard EU)</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('letter')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    format === 'letter' 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <p className="text-sm font-bold text-zinc-900">Format Letter</p>
                  <p className="text-[11px] text-zinc-500 font-medium">8.5 × 11 in (Standard US)</p>
                </button>
              </div>

              {/* Resolution selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700">Résolution du rendu (DPI)</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'standard', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDpi(level)}
                      className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all capitalize ${
                        dpi === level
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                          : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-white'
                      }`}
                    >
                      {level === 'low' ? 'Web (72 DPI)' : level === 'standard' ? 'Standard (150)' : 'Pro (300 DPI)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Compress switch */}
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-zinc-800">Optimisation des images</p>
                  <p className="text-[10px] text-zinc-500 font-semibold">Réduit le poids final du PDF en optimisant les images</p>
                </div>
                <input
                  type="checkbox"
                  checked={compress}
                  onChange={(e) => setCompress(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Watermark Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">2. Sécurité & Filigrane</h3>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={watermarkEnabled}
                    onChange={(e) => setWatermarkEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {watermarkEnabled && (
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-700">Texte du filigrane</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="CONFIDENTIEL"
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 mb-1">Type de filigrane</label>
                      <select
                        value={watermarkType}
                        onChange={(e) => setWatermarkType(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none"
                      >
                        <option value="footer">En bas de page</option>
                        <option value="diagonal">Diagonal (Arrière-plan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 mb-1">Opacité</label>
                      <input
                        type="range"
                        min="0.02"
                        max="0.25"
                        step="0.02"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic theme colors */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">3. Surcharge Thématique (Optionnelle)</h3>
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/40 space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700">Couleur d'accentuation</label>
                  <div className="flex flex-wrap gap-2">
                    {themeColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => {
                          setAccentColor(color.value);
                          // Apply to real configuration too
                          setData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              primaryColor: color.value
                            }
                          }));
                        }}
                        style={{ backgroundColor: color.value }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer hover:scale-110 ${
                          accentColor === color.value ? 'border-zinc-900 scale-105' : 'border-white shadow-sm'
                        }`}
                        title={color.name}
                      />
                    ))}
                    {/* Custom Picker */}
                    <div className="relative w-7 h-7 rounded-full border border-zinc-200 overflow-hidden cursor-pointer shadow-sm">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          setData((prev) => ({
                            ...prev,
                            theme: {
                              ...prev.theme,
                              primaryColor: e.target.value
                            }
                          }));
                        }}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full h-full bg-gradient-to-tr from-rose-500 via-indigo-600 to-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100 mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-sm font-semibold text-zinc-600 transition-all cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handleStartExport}
              disabled={isGenerating}
              className="flex-1 py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {language === 'fr' 
                      ? `Génération (${progress}%)...` 
                      : language === 'es'
                        ? `Generando (${progress}%)...`
                        : `Generating (${progress}%)...`}
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Générer le PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Live Preview & Progress Panel */}
        <div className="w-full md:w-96 bg-zinc-50 p-6 md:p-8 overflow-y-auto flex flex-col justify-between select-none">
          
          <div className="hidden md:flex items-center justify-between pb-4 border-b border-zinc-200/80 mb-6">
            <div className="flex items-center gap-2 text-zinc-700">
              <Eye className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Aperçu & Statut</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Document Card Mockup */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-4">
            {!isGenerating && !errorMsg && !generatedPdfUri && (() => {
              const headerSection = data.sections.find((s) => s.type === 'header');
              const headerContent = headerSection?.content || {};
              const fullName = headerContent.fullName || 'Votre Nom';
              const jobTitle = headerContent.title || 'Intitulé de poste';
              const hasPhoto = headerContent.showPhoto !== false && !!headerContent.photo;
              const photo = headerContent.photo;

              return (
                <div className="w-48 h-64 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-200/80 p-3.5 flex flex-col justify-between transition-all hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative group overflow-hidden">
                  {/* Subtle document line-structure to replicate real CV */}
                  <div className="space-y-3">
                    {/* Header bar area */}
                    <div className="flex items-start gap-2.5">
                      {hasPhoto && photo ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200/60 shrink-0 shadow-xs bg-zinc-50">
                          <img 
                            src={photo} 
                            alt="Aperçu miniature" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-zinc-400">CV</span>
                        </div>
                      )}
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="h-2 w-1.5 rounded-sm inline-block mr-1 align-middle" style={{ backgroundColor: accentColor }} />
                        <span className="text-[9px] font-extrabold text-zinc-800 tracking-tight leading-none truncate block max-w-[100px] inline-middle">
                          {fullName}
                        </span>
                        <span className="text-[7px] font-semibold tracking-wider text-zinc-500 uppercase block truncate">
                          {jobTitle}
                        </span>
                      </div>
                    </div>

                    {/* Dividers & Accent line */}
                    <div className="h-[1px] w-full bg-zinc-100" />

                    {/* Body content placeholders mimicking experience */}
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="h-1.5 w-1/3 rounded bg-zinc-300/80" />
                          <div className="h-1 w-1/6 rounded bg-zinc-200/60" />
                        </div>
                        <div className="h-1 w-5/6 rounded bg-zinc-100" />
                        <div className="h-1 w-11/12 rounded bg-zinc-100" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="h-1.5 w-1/4 rounded bg-zinc-300/80" />
                          <div className="h-1 w-1/6 rounded bg-zinc-200/60" />
                        </div>
                        <div className="h-1 w-3/4 rounded bg-zinc-100" />
                      </div>
                    </div>

                    {/* Skills pills representation */}
                    <div className="pt-1.5 flex flex-wrap gap-1">
                      <div className="h-3.5 w-8 rounded-md border border-zinc-100 bg-zinc-50/50 flex items-center justify-center">
                        <div className="h-1 w-4 rounded-full bg-zinc-300" />
                      </div>
                      <div className="h-3.5 w-10 rounded-md border border-zinc-100 bg-zinc-50/50 flex items-center justify-center">
                        <div className="h-1 w-6 rounded-full bg-zinc-300" />
                      </div>
                      <div className="h-3.5 w-7 rounded-md border border-zinc-100 bg-zinc-50/50 flex items-center justify-center">
                        <div className="h-1 w-3 rounded-full bg-zinc-300" />
                      </div>
                    </div>
                  </div>

                  {/* Watermark subtle badge preview if active */}
                  {watermarkEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg] pointer-events-none select-none opacity-[0.06] font-black text-[11px] tracking-widest text-zinc-900 uppercase">
                      {watermarkText || 'CONFIDENTIEL'}
                    </div>
                  )}

                  {/* Footer metadata panel */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[8px] font-bold text-zinc-400 uppercase tracking-widest bg-white/95">
                    <span className="flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-zinc-400" />
                      {format.toUpperCase()}
                    </span>
                    <span className="text-indigo-600/90 font-black">
                      {dpi === 'high' ? '300 DPI' : dpi === 'standard' ? '150 DPI' : '72 DPI'}
                    </span>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="absolute inset-0 bg-zinc-950/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="bg-white/95 text-[10px] font-extrabold text-indigo-700 px-3.5 py-2 rounded-full shadow-lg border border-indigo-100/80 tracking-wide animate-pulse">
                      Prêt pour export
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Dynamic Progress Engine */}
            {isGenerating && (
              <div className="w-full space-y-5 px-4 animate-fadeIn">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="relative w-14 h-14 flex items-center justify-center bg-indigo-50 border border-indigo-100/60 text-indigo-600 rounded-2xl shadow-sm">
                    <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-800">Génération en cours...</h4>
                  <p className="text-[11px] text-zinc-500 font-semibold h-4 truncate w-full">{stepName}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    <span>Exportation</span>
                    <span className="text-indigo-700 font-black">{progress}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Fallback screen */}
            {errorMsg && (
              <div className="w-full text-center p-4 bg-red-50 border border-red-100 rounded-2xl space-y-3 animate-fadeIn">
                <div className="mx-auto w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-800">L'export a rencontré un problème</h4>
                  <p className="text-[10px] text-red-600 font-medium leading-relaxed">{errorMsg}</p>
                </div>
                <button
                  onClick={handleStartExport}
                  className="py-1.5 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Réessayer</span>
                </button>
              </div>
            )}

            {/* Success Download Screen */}
            {generatedPdfUri && (
              <div className="w-full space-y-4 text-center px-4 animate-fadeIn">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-zinc-900">Votre PDF est prêt !</h4>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                    Le document a été compilé à {dpi === 'high' ? '300 DPI' : dpi === 'standard' ? '150' : '72'} et enregistré avec succès dans votre historique d'exportations.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <a
                    href={generatedPdfUri}
                    download="cv_resumeflow.pdf"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le fichier</span>
                  </a>
                  
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer ou Sauvegarder en PDF</span>
                  </button>

                  <a
                    href={generatedPdfUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ouvrir dans un nouvel onglet</span>
                  </a>
                </div>

                {isInIframe && (
                  <div className="mt-3 p-3 bg-amber-50/90 border border-amber-100/80 rounded-xl text-left space-y-1">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1">
                      ⚠️ Remarque sur l'aperçu sécurisé :
                    </p>
                    <div className="text-[10px] text-amber-700 font-medium leading-relaxed">
                      Comme l'application s'exécute dans un environnement d'aperçu sécurisé, votre navigateur peut bloquer les téléchargements de fichiers directs.
                      <div className="mt-1 space-y-1">
                        <div>• <strong>Méthode recommandée :</strong> Cliquez sur le bouton violet <strong>"Imprimer ou Sauvegarder en PDF"</strong> ci-dessus et sélectionnez la destination <strong>"Enregistrer au format PDF"</strong>.</div>
                        <div>• <strong>Alternative :</strong> Cliquez sur <strong>"Ouvrir dans un nouvel onglet"</strong>, puis enregistrez le fichier manuellement avec le raccourci clavier habituel.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Informational footer */}
          <div className="mt-4 pt-4 border-t border-zinc-200/60 text-center text-[10px] text-zinc-400 font-semibold leading-relaxed">
            PWA Résiliente. Entièrement compatible avec les périphériques mobiles et tablettes pour impression sans fil locale.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
