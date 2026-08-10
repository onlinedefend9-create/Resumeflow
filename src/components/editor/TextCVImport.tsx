import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle, Loader2, Check, X, FileText, ArrowRight } from 'lucide-react';
import { useCVData } from '../../hooks/useCVData';
import { useLanguage } from '../../i18n/LanguageContext';

interface TextCVImportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TextCVImport: React.FC<TextCVImportProps> = ({ isOpen, onClose }) => {
  const { setData } = useCVData();
  const { language } = useLanguage();
  
  // Text analysis state
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccess, setParseSuccess] = useState(false);

  // Status message for parsing
  const [statusMessage, setStatusMessage] = useState('');

  // Pre-fill raw text for simulation or testing the AI analyzer
  const handleInsertSampleText = () => {
    setPastedText(`Alexandre Martin
Développeur Fullstack Senior | Tech Enthusiast
Paris, France | alexandre.martin@email.com | +33 6 12 34 56 78

RÉSUMÉ
Développeur Fullstack passionné avec plus de 6 ans d'expérience dans la conception et l'implémentation d'applications web scalables. Spécialisé en React, Node.js, TypeScript et architectures cloud. Adepte du Clean Code et des méthodologies agiles.

EXPÉRIENCES PROFESSIONNELLES

Lead Développeur Fullstack | TechCorp Solutions (Paris)
01/2022 - Présent
- Direction de la refonte complète de la plateforme SaaS en React/Next.js et Node.js.
- Amélioration des temps de chargement de 40% et hausse de conversion de 15%.
- Mise en place de pipelines de déploiement CI/CD automatisés.

Développeur Fullstack React / Node | WebBuild Agency (Lyon)
03/2019 - 12/2021
- Développement d'applications e-commerce haut de gamme et d'outils collaboratifs en temps réel.
- Intégration pixel-perfect avec Tailwind CSS et animations fluides.
- Conception de bases de données relationnelles robustes avec PostgreSQL.

FORMATION

Master en Informatique (Génie Logiciel) | Université Paris-Saclay
2016 - 2018

Licence en Informatique | Université de Lille
2013 - 2016

COMPÉTENCES
TypeScript, React, Next.js, Node.js, Express, Tailwind CSS, PostgreSQL, AWS, Docker, Git, Jest, Agile (Scrum)`);
  };

  // Direct simulated fill (Zero network queries, instant premium profile injection)
  const handleSimulatedFill = () => {
    setIsParsing(true);
    setParseError(null);
    setParseSuccess(false);
    setStatusMessage("Génération instantanée du profil d'exemple...");
    
    setTimeout(() => {
      setData((prev) => {
        const updatedSections = prev.sections.map((sec) => {
          if (sec.type === 'header') {
            return {
              ...sec,
              content: {
                ...sec.content,
                fullName: "Alexandre Martin",
                title: "Développeur Fullstack Senior",
                email: "alexandre.martin@email.com",
                phone: "+33 6 12 34 56 78",
                location: "Paris, France",
                website: "github.com/alexandre-martin",
                summary: "Développeur Fullstack passionné avec plus de 6 ans d'expérience dans la conception et l'implémentation d'applications web scalables. Spécialisé en React, Node.js, TypeScript et architectures cloud. Adepte du travail d'équipe agile.",
              }
            };
          }
          if (sec.type === 'experience') {
            return {
              ...sec,
              content: {
                ...sec.content,
                title: "Expérience Professionnelle",
                items: [
                  {
                    role: "Lead Développeur Fullstack",
                    company: "TechCorp Solutions (Paris)",
                    period: "2022 - Présent",
                    location: "Paris, France",
                    description: "• Direction de la refonte de la plateforme SaaS principale en React/Next.js.\n• Amélioration de 40% de la vitesse de chargement globale.\n• Mise en place de tests unitaires et de déploiement continu."
                  },
                  {
                    role: "Développeur Fullstack React / Node",
                    company: "WebBuild Agency",
                    period: "2019 - 2021",
                    location: "Lyon, France",
                    description: "• Développement d'applications web modernes sur mesure avec React et Tailwind CSS.\n• Optimisation de requêtes SQL complexes pour bases de données PostgreSQL."
                  }
                ]
              }
            };
          }
          if (sec.type === 'education') {
            return {
              ...sec,
              content: {
                ...sec.content,
                title: "Formation",
                items: [
                  {
                    degree: "Master en Informatique (Génie Logiciel)",
                    school: "Université Paris-Saclay",
                    period: "2016 - 2018",
                    location: "Orsay, France"
                  },
                  {
                    degree: "Licence en Informatique",
                    school: "Université de Lille",
                    period: "2013 - 2016",
                    location: "Lille, France"
                  }
                ]
              }
            };
          }
          if (sec.type === 'skills') {
            return {
              ...sec,
              content: {
                ...sec.content,
                title: "Compétences",
                skillsList: ["TypeScript", "React", "Next.js", "Node.js", "Express", "Tailwind CSS", "PostgreSQL", "AWS", "Docker", "Git", "Jest"]
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

      setIsParsing(false);
      setParseSuccess(true);
      setTimeout(() => {
        setParseSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  // Update status messages dynamically for an immersive premium feel
  useEffect(() => {
    if (!isParsing) return;
    
    const messages = [
      "Lecture du contenu...",
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
      let errMsg = err.message || "Une erreur est survenue pendant l'extraction des données.";
      if (errMsg === 'Failed to fetch' || errMsg.includes('fetch')) {
        errMsg = "Impossible de se connecter au serveur d'extraction (Erreur réseau). Veuillez rafraîchir la page ou ouvrir l'application dans un nouvel onglet.";
      }
      setParseError(errMsg);
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
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Remplissage intelligent de CV par IA
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
                  <Sparkles className="w-3 h-3 fill-white/20 animate-pulse" /> IA
                </span>
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">Copiez votre profil, texte ou ancien CV pour remplir votre modèle en un clic</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {parseSuccess && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-xl flex items-center gap-3 text-emerald-400 animate-fadeIn text-xs font-semibold">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-bold">Données extraites avec succès !</p>
                <p className="text-emerald-500 font-normal">Votre modèle de CV a été mis à jour avec vos informations.</p>
              </div>
            </div>
          )}

          {parseError && (
            <div className="p-4 bg-red-950/40 border border-red-900/60 rounded-xl flex items-center gap-3 text-red-400 animate-fadeIn text-xs font-semibold">
              <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-bold">Erreur d'analyse</p>
                <p className="text-red-400/80 font-normal">{parseError}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-400 space-y-2.5">
              <p className="font-bold text-zinc-200">Comment ça marche ?</p>
              <div className="space-y-1.5 leading-relaxed">
                <p>1. Copiez le contenu textuel de votre ancien CV, profil professionnel, ou résumé.</p>
                <p>2. Collez-le dans la zone ci-dessous ou utilisez le bouton "Préremplir" pour tester.</p>
                <p>3. Cliquez sur "Extraire avec Gemini IA". Vos rubriques seront parfaitement structurées dans votre modèle de CV.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={handleInsertSampleText}
                  disabled={isParsing}
                  className="flex-1 py-2 px-3 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 text-[11px] font-bold rounded-lg text-zinc-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Préremplir un texte d'exemple (IA)
                </button>
                <button
                  type="button"
                  onClick={handleSimulatedFill}
                  disabled={isParsing}
                  className="flex-1 py-2 px-3 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-[11px] font-bold rounded-lg text-amber-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Remplissage Direct (Sans IA / Instantané)
                </button>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">
                  Collez le texte ci-dessous
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Collez ici les sections de votre profil (ex : Expérience, Formation, compétences, résumé) ou cliquez sur 'Préremplir un texte d'exemple' ci-dessus..."
                  disabled={isParsing}
                  className="w-full h-44 bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/20 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isParsing}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-xs font-bold transition-all text-zinc-300 cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleParseText}
            disabled={isParsing || !pastedText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800/50 disabled:text-zinc-600 disabled:border-transparent text-white border border-indigo-500 hover:border-indigo-400 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{statusMessage}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extraire avec Gemini IA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
