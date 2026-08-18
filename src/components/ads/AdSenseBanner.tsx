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

  // Déterminer la taille du conteneur en fonction du format pour éviter le Layout Shift (CLS)
  const getMinHeight = () => {
    switch (adFormat) {
      case 'horizontal': return 'h-[90px]';
      case 'vertical': return 'h-[600px] w-[160px]';
      case 'rectangle': return 'h-[250px]';
      default: return 'h-[100px] md:h-[120px]';
    }
  };

  return (
    <div 
      ref={adRef}
      className={`relative w-full overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 p-4 transition-all ${getMinHeight()} ${className}`}
    >
      {/* Label de signalisation publicitaire requis par Google AdSense */}
      <div className="absolute top-2 left-4 flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Sponsorisé
        </span>
        <Sparkles className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400 opacity-60" />
      </div>

      {/* Mode Simulation / Démo pour le preview d'AI Studio */}
      {adClient === 'ca-pub-simulated' || isAdBlockActive ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-center pt-2">
          <div className="max-w-md px-4">
            <h4 className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              Emplacement AdSense {adFormat.toUpperCase()}
            </h4>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
              ID Client : <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px]">{adClient}</code> • Slot : <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-[9px]">{adSlot}</code>
            </p>
            <p className="text-[9px] text-zinc-400/80 dark:text-zinc-600/80 mt-1.5 leading-relaxed">
              Ce bloc simule fidèlement l'emplacement de votre annonce Google AdSense. En production, le script officiel est automatiquement chargé avec vos identifiants pour diffuser des annonces réelles.
            </p>
          </div>
        </div>
      ) : (
        /* Code officiel AdSense */
        <div className="w-full h-full flex items-center justify-center pt-4">
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
