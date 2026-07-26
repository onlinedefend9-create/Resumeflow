import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import { Check, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Pricing = () => {
  const { t } = useLanguage();

  return (
    <div className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto space-y-16">
      <SEO
        title={`${t.pricing.title} | ResumeFlow`}
        description={t.pricing.subtitle}
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a0a0a]">
          {t.pricing.title}
        </h1>
        <p className="text-zinc-600 text-base md:text-lg">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* Free Plan Card - Single 100% Free Plan */}
      <div className="max-w-xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl border border-emerald-200 bg-emerald-50/40 shadow-sm space-y-6 flex flex-col justify-between text-center relative">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              100% GRATUIT & SANS ENGAGEMENT
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-[#0a0a0a]">0€</span>
              <span className="text-zinc-500 text-sm font-semibold">/ à vie</span>
            </div>

            <p className="text-zinc-600 text-sm max-w-md mx-auto">
              Toutes les fonctionnalités avancées, modèles professionnels, téléchargements PDF illimités et optimisation ATS sont inclus gratuitement pour tous.
            </p>

            <div className="pt-6 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs text-zinc-800 font-medium max-w-md mx-auto">
              {t.pricing.freePerks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
              {t.pricing.premiumPerks.map((perk, idx) => (
                <div key={`prem-${idx}`} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-zinc-900">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/cv-generator"
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-extrabold shadow-sm transition-all text-center block"
          >
            {t.pricing.freeCta}
          </Link>
        </div>
      </div>

      <AdSlot />
    </div>
  );
};

