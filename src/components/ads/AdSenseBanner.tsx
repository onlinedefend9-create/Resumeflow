import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AdSenseBannerProps {
  adClient?: string; // e.g., ca-pub-XXXXXXXXXXXXXXXX
  adSlot?: string;   // e.g., XXXXXXXXXX
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export const AdSenseBanner = ({
  adClient = 'ca-pub-simulated', // client ID simulé ou réel
  adSlot = '8888888888',
  adFormat = 'auto',
  className = ''
}: AdSenseBannerProps) => {
  const [hasLoadedScript, setHasLoadedScript] = useState(false);
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  // Détecter si AdSense ou un AdBlocker est actif et charger le script réel si nécessaire
  useEffect(() => {
    if (adClient === 'ca-pub-simulated') {
      setHasLoadedScript(true);
      return;
    }

    // Charger le script officiel AdSense si ce n'est pas déjà fait
    const scriptId = 'google-adsense-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => setHasLoadedScript(true);
      script.onerror = () => setIsAdBlockActive(true);
      document.head.appendChild(script);
    } else {
      setHasLoadedScript(true);
    }

    // Tenter de pousser l'annonce
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.warn('[AdSense] Échec de l\'initialisation de la bannière', e);
    }
  }, [adClient, adSlot]);

  // Déterminer les classes de dimensionnement et de visibilité adaptatives pour éviter le CLS (Cumulative Layout Shift)
  const getResponsiveContainerClasses = () => {
    switch (adFormat) {
      case 'horizontal':
        // Grand format horizontal sur grand écran, plus compact sur mobile
        return 'h-[140px] md:h-[90px] w-full';
      case 'vertical':
        // Masquer le format vertical sur mobile pour éviter les débordements (horizontal overflow), ne l'afficher que sur tablette et desktop
        return 'hidden sm:block h-[600px] w-[160px] mx-auto';
      case 'rectangle':
        // Format rectangulaire standard (300x250 sur mobile, 336x280 sur desktop)
        return 'h-[250px] w-full max-w-[300px] md:max-w-[336px] md:h-[280px] mx-auto';
      default:
        // Format 'auto' adaptatif intelligent par défaut
        return 'h-[150px] md:h-[120px] w-full';
    }
  };

  return (
    <div 
      ref={adRef}
      className={`relative overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 p-4 transition-all flex flex-col justify-between ${getResponsiveContainerClasses()} ${className}`}
    >
      {/* Label de signalisation publicitaire requis par Google AdSense */}
      <div className="flex items-center gap-1.5 z-10">
        <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Sponsorisé
        </span>
        <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400 opacity-60" />
      </div>

      {/* Mode Simulation / Démo pour le preview d'AI Studio */}
      {adClient === 'ca-pub-simulated' || isAdBlockActive ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-2 py-1">
          <h4 className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
            AdSense {adFormat.toUpperCase()}
          </h4>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            Client : <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[8px]">{adClient}</code>
          </p>
          <p className="text-[8px] text-zinc-400/80 dark:text-zinc-600/80 mt-1 max-w-sm leading-relaxed hidden xs:block">
            Mise en page réactive optimisée pour mobile et desktop. Le script se charge automatiquement en production.
          </p>
        </div>
      ) : (
        /* Code officiel AdSense */
        <div className="w-full h-full flex items-center justify-center pt-2">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );
};
