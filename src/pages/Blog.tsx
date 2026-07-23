import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const Blog = () => {
  const { t } = useLanguage();
  const articles = t.blog.articles;

  return (
    <div className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto space-y-16">
      <SEO
        title={`${t.blog.title} | ResumeFlow`}
        description={t.blog.subtitle}
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>{t.blog.badge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0a0a0a]">
          {t.blog.title} <span className="text-blue-600">{t.blog.titleHighlight}</span>
        </h1>
        <p className="text-zinc-600 text-base">
          {t.blog.subtitle}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                {art.category}
              </span>
              <h2 className="text-xl font-bold text-[#0a0a0a] leading-snug">
                {art.title}
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {art.readTime}
              </span>
              <Link
                to={`/blog/${art.slug}`}
                className="font-bold text-[#0a0a0a] hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
              >
                {t.blog.readArticle} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <AdSlot />
    </div>
  );
};
