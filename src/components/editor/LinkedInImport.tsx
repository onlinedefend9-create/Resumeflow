import React, { useState, useEffect } from 'react';
import { Linkedin, Sparkles, AlertCircle, Loader2, Check, X, FileText, ArrowRight } from 'lucide-react';
import { useCVData } from '../../hooks/useCVData';
import { useLanguage } from '../../i18n/LanguageContext';

interface LinkedInImportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInImport: React.FC<LinkedInImportProps> = ({ isOpen, onClose }) => {
  const { setData, data } = useCVData();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'oauth' | 'text'>('text');
  
  // Text analysis state
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState(false);

  // OAuth state
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Status message for parsing
  const [statusMessage, setStatusMessage] = useState('');

  // Update status messages dynamically for an immersive premium feel
  useEffect(() => {
    if (!isParsing) return;
    
    const messages = [
      "Lecture du contenu de votre profil...",
      "Analyse des compétences par Gemini AI...",
      "Structuration des expériences de travail...",
      "Traduction et alignement sémantique...",
      "Mise en forme des rubriques de formation...",
      "Finalisation du modèle de CV..."
    ];
    
    let currentIdx = 0;
    setStatusMessage(messages[0]);
    
    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % messages.length;
      setStatusMessage(messages[currentIdx]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isParsing]);

  // Handle postMessage for OAuth success/failure
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Allow messages from the same origin, other Cloud Run preview domains, or localhost
      const origin = event.origin;
      const isValidOrigin = 
        origin === window.location.origin ||
        origin.endsWith('.run.app') || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1');

      if (!isValidOrigin) return;

      if (event.data && event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
        const profile = event.data.profile;
        handleOAuthImportSuccess(profile);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [data]);

  // Map OAuth direct fields if profile information is retrieved
  const handleOAuthImportSuccess = (profile: any) => {
    setIsOAuthLoading(false);
    
    // Extract name
    const fullName = [profile.given_name, profile.family_name].filter(Boolean).join(' ') || profile.name || '';
    
    // Pre-fill header
    setData((prev) => {
      return {
        ...prev,
        sections: prev.sections.map((sec) => {
          if (sec.type === 'header') {
            return {
              ...sec,
              content: {
                ...sec.content,
                fullName,
                email: profile.email || sec.content.email || '',
                photo: profile.picture || sec.content.photo || '',
                showPhoto: !!profile.picture,
              }
            };
          }
          return sec;
        })
      };
    });

    setParseSuccess(true);
    setTimeout(() => {
      setParseSuccess(false);
      onClose();
    }, 2000);
  };

  // Launch the OAuth popup
  const handleOAuthLogin = async () => {
    setIsOAuthLoading(true);
    setOauthError(null);

    try {
      const response = await fetch('/api/auth/linkedin/url');
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Impossible de récupérer l'URL d'autorisation.");
      }
      
      const { url } = await response.json();
      
      const width = 580;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        'LinkedIn OAuth',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=1`
      );

      if (!popup) {
        throw new Error("Le bloqueur de fenêtres pop-up a empêché l'authentification. Veuillez autoriser les pop-ups pour ce site.");
      }
    } catch (err: any) {
      console.error(err);
      setOauthError(err.message || "Une erreur est survenue lors de l'authentification.");
      setIsOAuthLoading(false);
    }
  };

  // Process pasted text with Gemini API route
  const handleParseText = async () => {
    if (!pastedText.trim()) return;
    
    setIsParsing(true);
    setParseError(null);
    setParseSuccess(false);

    try {
      const response = await fetch('/api/import/linkedin-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: pastedText,
          language: language || 'fr'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "La communication avec le service d'analyse a échoué.");
      }

      const structuredData = await response.json();

      // Update the CV data with the structured fields returned by Gemini
      setData((prev) => {
        // Build new sections list
        const updatedSections = prev.sections.map((sec) => {
          const secType = sec.type;
          
          if (secType === 'header' && structuredData.header) {
            return {
              ...sec,
              content: {
                ...sec.content,
                fullName: structuredData.header.fullName || sec.content.fullName || '',
                title: structuredData.header.title || sec.content.title || '',
                email: structuredData.header.email || sec.content.email || '',
                phone: structuredData.header.phone || sec.content.phone || '',
                location: structuredData.header.location || sec.content.location || '',
                website: structuredData.header.website || sec.content.website || '',
                summary: structuredData.header.summary || sec.content.summary || '',
              }
            };
          }
          
          if (secType === 'experience' && structuredData.experience) {
            return {
              ...sec,
              content: {
                ...sec.content,
                title: sec.content.title || 'Expérience Professionnelle',
                items: structuredData.experience.map((item: any) => ({
                  role: item.role || '',
                  company: item.company || '',
                  period: item.period || '',
                  location: item.location || '',
                  description: item.description || ''
                }))
              }
            };
          }
          
          if (secType === 'education' && structuredData.education) {
            return {
              ...sec,
              content: {
                ...sec.content,
                title: sec.content.title || 'Formation',
                items: structuredData.education.map((item: any) => ({
                  degree: item.degree || '',
                  school: item.school || '',
                  period: item.period || '',
                  location: item.location || ''
                }))
              }
            };
          }
          
          if (secType === 'skills' && structuredData.skills) {
            return {
              ...sec,
              content: {
                ...sec.content,
                title: sec.content.title || 'Compétences',
                skillsList: Array.isArray(structuredData.skills) ? structuredData.skills : []
              }
            };
          }

          return sec;
        });

        return {
          ...prev,
          sections: updatedSections
        };
      });

      setParseSuccess(true);
      setTimeout(() => {
        setParseSuccess(false);
        onClose();
        setPastedText('');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setParseError(err.message || "Une erreur est survenue pendant l'extraction des données.");
    } finally {
      setIsParsing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Linkedin className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Importation assistée LinkedIn
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm shadow-blue-500/15">
                  <Sparkles className="w-3 h-3 fill-white/20 animate-pulse" /> IA
                </span>
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">Automatisez la création de votre CV en quelques secondes</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/20">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all ${
              activeTab === 'text'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            Analyseur de Texte IA (Recommandé)
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition-all ${
              activeTab === 'oauth'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40'
            }`}
          >
            Connexion LinkedIn Directe
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {parseSuccess && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl flex items-center gap-3 text-emerald-400 animate-fadeIn">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold">Importation réussie !</h4>
                <p className="text-[10px] text-emerald-500/90 font-medium">Votre CV a été mis à jour avec vos informations LinkedIn.</p>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4 text-left animate-fadeIn">
              <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/80 space-y-2 text-zinc-400 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Mode d'emploi :
                </span>
                <p>1. Allez sur votre profil LinkedIn et copiez le texte brut (par exemple : votre résumé, vos expériences, vos formations).</p>
                <p>2. Vous pouvez aussi ouvrir votre profil, faire <kbd className="bg-zinc-800 border border-zinc-700 px-1 py-0.5 rounded text-[10px] text-zinc-300">Enregistrer au format PDF</kbd>, tout sélectionner et copier-coller le texte ici.</p>
                <p>3. Cliquez sur "Extraire avec Gemini IA". Vos rubriques seront parfaitement structurées dans votre modèle de CV.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">
                  Collez le texte LinkedIn ou CV ci-dessous
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Collez ici les sections de votre profil LinkedIn (ex : Expérience, Formation, compétences, résumé)..."
                  disabled={isParsing}
                  className="w-full h-44 bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono leading-relaxed"
                />
              </div>

              {parseError && (
                <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start gap-2.5 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Échec de l'extraction</span>
                    <span className="text-[10px] text-red-400/80 font-medium">{parseError}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleParseText}
                disabled={isParsing || !pastedText.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/10"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extraire avec Gemini IA</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'oauth' && (
            <div className="space-y-5 text-center py-6 animate-fadeIn">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto shadow-inner shadow-blue-500/5">
                  <Linkedin className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-white">Authentification LinkedIn Connect</h4>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto font-medium">
                  Connectez-vous directement à votre profil LinkedIn pour récupérer automatiquement vos informations de base et votre photo de profil.
                </p>
              </div>

              {oauthError && (
                <div className="max-w-md mx-auto p-3 bg-red-950/40 border border-red-900/60 rounded-xl flex items-start gap-2.5 text-red-400 text-xs text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Erreur d'authentification</span>
                    <span className="text-[10px] text-red-400/80 font-medium">{oauthError}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 max-w-sm mx-auto">
                <button
                  onClick={handleOAuthLogin}
                  disabled={isOAuthLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-blue-600/15"
                >
                  {isOAuthLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <Linkedin className="w-4.5 h-4.5" />
                      <span>Se connecter avec LinkedIn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center bg-zinc-900/20 text-[10px] text-zinc-500 font-semibold">
          <span>Sécurisé par l'API officielle LinkedIn & Gemini 1.5 Flash</span>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
