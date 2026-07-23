import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const Pricing = () => {
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('isPremium') === 'true');
  const { t } = useLanguage();

  const handleUpgradeMock = () => {
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);
    alert(t.pricing.alertSuccess);
  };

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

      {/* Pricing Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {t.pricing.freeTitle}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#0a0a0a]">{t.pricing.freePrice}</span>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-3 text-xs text-zinc-700 font-medium">
              {t.pricing.freePerks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/cv-generator"
            className="w-full py-3 rounded-xl border border-zinc-200 text-center text-xs font-bold text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            {t.pricing.freeCta}
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="p-8 rounded-2xl border-2 border-blue-600 bg-white shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              {t.pricing.premiumTitle}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#0a0a0a]">{t.pricing.premiumPrice}</span>
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-3 text-xs text-zinc-700 font-medium">
              {t.pricing.premiumPerks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-[#0a0a0a]">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleUpgradeMock}
            className="btn-premium btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isPremium ? t.pricing.premiumActive : t.pricing.premiumCta}
          </button>
        </div>
      </div>

      <AdSlot />
    </div>
  );
};

