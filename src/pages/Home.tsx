import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import { Sparkles, Zap, ShieldCheck, Download, ArrowRight, CheckCircle2, Star, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const Home = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useLanguage();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = t.home.faqs;

  return (
    <div className="bg-white selection:bg-blue-500/20 selection:text-blue-600">
      <SEO
        title={`${t.hero.titleLine1} ${t.hero.titleLine2} | ResumeFlow`}
        description={t.hero.subtitle}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 md:pt-36 md:pb-40 px-6 md:px-10 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-zinc-50/80 backdrop-blur-md text-xs font-semibold text-zinc-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            {t.hero.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0a0a0a] leading-[1.08]">
            {t.hero.titleLine1} <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#0a0a0a] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t.hero.titleLine2}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cv-generator"
              className="btn-premium btn-primary text-base font-bold px-10 py-4 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Sparkles className="w-5 h-5" />
              {t.hero.ctaPrimary}
            </Link>

            <Link
              to="/cv-templates"
              className="btn-premium border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 text-base font-semibold px-8 py-4 w-full sm:w-auto justify-center"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.hero.atsBadge}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{t.hero.pdfBadge}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>{t.hero.noAccountBadge}</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl p-3 bg-zinc-900/5 border border-zinc-200/80 shadow-2xl backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-zinc-200/80 p-6 sm:p-10 shadow-inner flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 text-left max-w-md">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{t.home.dragDropTag}</span>
              <h3 className="text-2xl font-bold text-[#0a0a0a]">{t.home.editorPreviewTitle}</h3>
              <p className="text-sm text-zinc-600">
                {t.home.editorPreviewDesc}
              </p>
              <Link to="/cv-generator" className="inline-flex items-center gap-2 text-sm font-bold text-[#0a0a0a] hover:text-blue-600 transition-colors">
                {t.home.editorPreviewCta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 aspect-[4/3] bg-zinc-50 rounded-xl border border-zinc-200 p-6 flex flex-col gap-3 shadow-sm">
              <div className="h-6 bg-zinc-900 rounded-md w-3/4" />
              <div className="h-3 bg-zinc-200 rounded w-1/2" />
              <div className="my-2 border-b border-zinc-200" />
              <div className="space-y-2">
                <div className="h-4 bg-zinc-300 rounded w-1/3" />
                <div className="h-3 bg-zinc-200 rounded w-full" />
                <div className="h-3 bg-zinc-200 rounded w-5/6" />
              </div>
              <div className="mt-auto p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between text-xs text-blue-700 font-semibold">
                <span>{t.home.activeTemplateLabel}</span>
                <span className="text-blue-600 font-bold">{t.home.readyBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-zinc-50/60 border-y border-zinc-200/60 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a]">
              {t.home.whyTitle}
            </h2>
            <p className="text-zinc-600">
              {t.home.whySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a]">{t.home.feat1Title}</h3>
              <p className="text-sm text-zinc-600">
                {t.home.feat1Desc}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a]">{t.home.feat2Title}</h3>
              <p className="text-sm text-zinc-600">
                {t.home.feat2Desc}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                <Download className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-[#0a0a0a]">{t.home.feat3Title}</h3>
              <p className="text-sm text-zinc-600">
                {t.home.feat3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Placement */}
      <div className="max-w-5xl mx-auto my-8 px-6">
        <AdSlot />
      </div>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-zinc-700">{t.home.ratingText}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a]">{t.home.testimonialsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-4">
            <p className="text-sm text-zinc-700 italic">
              {t.home.t1Quote}
            </p>
            <div>
              <p className="text-sm font-bold text-[#0a0a0a]">{t.home.t1Name}</p>
              <p className="text-xs text-zinc-500">{t.home.t1Role}</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-4">
            <p className="text-sm text-zinc-700 italic">
              {t.home.t2Quote}
            </p>
            <div>
              <p className="text-sm font-bold text-[#0a0a0a]">{t.home.t2Name}</p>
              <p className="text-xs text-zinc-500">{t.home.t2Role}</p>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-4">
            <p className="text-sm text-zinc-700 italic">
              {t.home.t3Quote}
            </p>
            <div>
              <p className="text-sm font-bold text-[#0a0a0a]">{t.home.t3Name}</p>
              <p className="text-xs text-zinc-500">{t.home.t3Role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-50/60 border-t border-zinc-200/60 px-6 md:px-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a0a0a]">{t.home.faqTitle}</h2>
            <p className="text-zinc-600">{t.home.faqSubtitle}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left font-semibold text-[#0a0a0a] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-sm text-zinc-600 border-t border-zinc-100 pt-4 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 px-6 md:px-10 text-center bg-[#0a0a0a] text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            {t.home.ctaBannerTitle}
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            {t.home.ctaBannerSubtitle}
          </p>

          <div>
            <Link
              to="/cv-generator"
              className="btn-premium btn-primary text-base font-bold px-10 py-4 inline-flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              {t.hero.ctaPrimary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
