import React, { useState, useEffect } from 'react';
import { Linkedin, Sparkles, Loader2, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { useCVData } from './useCVData';
import { useLanguage } from '../i18n/LanguageContext';

export interface LinkedInPosition {
  role?: string;
  company?: string;
  period?: string;
  location?: string;
  description?: string;
}

export interface LinkedInEducation {
  degree?: string;
  school?: string;
  period?: string;
  location?: string;
}

export interface LinkedInProfileData {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  website?: string;
  experience?: LinkedInPosition[];
  education?: LinkedInEducation[];
  skills?: string[];
}

export const useLinkedInImport = () => {
  const { setData } = useCVData();
  const { language } = useLanguage();
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // Mappage des données LinkedIn vers la structure de CV interne
  const mapLinkedInToCV = (profile: LinkedInProfileData) => {
    const fullName = [profile.given_name, profile.family_name].filter(Boolean).join(' ') || profile.name || '';
    
    setData((prev) => {
      const updatedSections = prev.sections.map((sec) => {
        const secType = sec.type;
        
        if (secType === 'header') {
          return {
            ...sec,
            content: {
              ...sec.content,
              fullName: fullName || sec.content.fullName || '',
              title: profile.headline || sec.content.title || '',
              email: profile.email || sec.content.email || '',
              phone: profile.phone || sec.content.phone || '',
              location: profile.location || sec.content.location || '',
              website: profile.website || sec.content.website || '',
              summary: profile.summary || sec.content.summary || '',
              photo: profile.picture || sec.content.photo || '',
              showPhoto: !!(profile.picture || sec.content.photo)
            }
          };
        }
        
        if (secType === 'experience' && profile.experience && profile.experience.length > 0) {
          return {
            ...sec,
            content: {
              ...sec.content,
              items: profile.experience.map((item) => ({
                role: item.role || '',
                company: item.company || '',
                period: item.period || '',
                location: item.location || '',
                description: item.description || ''
              }))
            }
          };
        }
        
        if (secType === 'education' && profile.education && profile.education.length > 0) {
          return {
            ...sec,
            content: {
              ...sec.content,
              items: profile.education.map((item) => ({
                degree: item.degree || '',
                school: item.school || '',
                period: item.period || '',
                location: item.location || ''
              }))
            }
          };
        }
        
        if (secType === 'skills' && profile.skills && profile.skills.length > 0) {
          return {
            ...sec,
            content: {
              ...sec.content,
              skillsList: profile.skills
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
  };

  // Écouteur de postMessage pour gérer la réponse de l'authentification LinkedIn
  useEffect(() => {
    const handleLinkedInMessage = (event: MessageEvent) => {
      const origin = event.origin;
      const isValidOrigin = 
        origin === window.location.origin ||
        origin.endsWith('.run.app') || 
        origin.includes('localhost') || 
        origin.includes('127.0.0.1');

      if (!isValidOrigin) return;

      const msgData = event.data;
      if (!msgData || typeof msgData !== 'object') return;

      if (msgData.type === 'LINKEDIN_AUTH_SUCCESS') {
        console.log('[useLinkedInImport] Authentification LinkedIn réussie ! Profil :', msgData.profile);
        setIsOAuthLoading(false);
        mapLinkedInToCV(msgData.profile);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 4000);
      } else if (msgData.type === 'LINKEDIN_AUTH_ERROR') {
        console.error('[useLinkedInImport] Échec de l\'authentification LinkedIn :', msgData.error);
        setOauthError(msgData.error || "L'authentification LinkedIn a échoué.");
        setIsOAuthLoading(false);
      }
    };

    window.addEventListener('message', handleLinkedInMessage);
    return () => window.removeEventListener('message', handleLinkedInMessage);
  }, []);

  const handleLinkedInLogin = async () => {
    setIsOAuthLoading(true);
    setOauthError(null);
    setImportSuccess(false);

    if (window.self !== window.top) {
      setOauthError("Veuillez ouvrir l'application dans un nouvel onglet pour vous connecter avec LinkedIn.");
      setIsOAuthLoading(false);
      return;
    }

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
      console.error('[useLinkedInImport] Erreur lors du lancement d\'OAuth :', err);
      let errMsg = err.message || "Une erreur est survenue lors de l'authentification.";
      if (errMsg === 'Failed to fetch' || errMsg.includes('fetch')) {
        errMsg = "Impossible de se connecter au serveur d'authentification (Erreur réseau). Veuillez ouvrir l'application dans un nouvel onglet.";
      }
      setOauthError(errMsg);
      setIsOAuthLoading(false);
    }
  };

  interface LinkedInImportButtonProps {
    className?: string;
  }

  // Composant bouton haut de gamme 'Importer depuis LinkedIn' réutilisable
  const LinkedInImportButton: React.FC<LinkedInImportButtonProps> = ({ className = "" }) => {
    const isFr = language === 'fr';
    const [isInIframe, setIsInIframe] = useState(false);

    useEffect(() => {
      setIsInIframe(window.self !== window.top);
    }, []);
    
    return (
      <div className="space-y-2.5 w-full">
        {isInIframe ? (
          <div className="p-3 bg-amber-950/40 border border-amber-900/30 rounded-xl space-y-2.5 animate-fadeIn">
            <div className="flex items-start gap-2 text-amber-300 text-[11px] leading-relaxed font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Pour vous connecter avec LinkedIn, ouvrez l'application dans un nouvel onglet (sécurité iframe).</span>
            </div>
            <button
              type="button"
              onClick={() => window.open(window.location.href, '_blank')}
              className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir dans un nouvel onglet</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={isOAuthLoading}
            className={`w-full py-2 px-3 bg-[#0077b5] hover:bg-[#006297] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${className}`}
          >
            {isOAuthLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isFr ? 'Connexion...' : 'Connecting...'}</span>
              </>
            ) : (
              <>
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>{isFr ? 'Se connecter avec LinkedIn' : 'Sign in with LinkedIn'}</span>
              </>
            )}
          </button>
        )}

        {importSuccess && (
          <div className="p-2 bg-emerald-950/40 border border-emerald-900/40 rounded-lg flex items-center gap-2 text-emerald-400 text-[10px] animate-fadeIn">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{isFr ? 'Données de profil LinkedIn importées avec succès !' : 'LinkedIn profile data imported successfully!'}</span>
          </div>
        )}

        {oauthError && (
          <div className="p-2 bg-red-950/40 border border-red-900/40 rounded-lg flex items-center gap-2 text-red-400 text-[10px] animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span className="truncate">{oauthError}</span>
          </div>
        )}
      </div>
    );
  };

  return {
    isOAuthLoading,
    oauthError,
    importSuccess,
    handleLinkedInLogin,
    LinkedInImportButton
  };
};
