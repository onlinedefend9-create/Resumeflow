import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { AdSlot } from '../components/AdSlot';
import { ArrowLeft, Clock, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();

  const currentArticle = t.blog.articles.find((art) => art.slug === slug);

  const post = currentArticle || {
    title: t.blog.notFound,
    date: '',
    readTime: '',
    category: '',
    content: `<p>${t.blog.notFoundDesc}</p>`,
  };

  return (
    <div className="py-16 md:py-24 px-6 md:px-10 max-w-4xl mx-auto space-y-12">
      <SEO title={`${post.title} | Blog CVCraft`} description={post.title} />

      <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-[#0a0a0a] transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t.blog.backToArticles}
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0a0a0a] tracking-tight leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
          {post.date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>}
          {post.readTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>}
        </div>
      </div>

      <div className="prose prose-zinc max-w-none space-y-6 text-sm text-zinc-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content || '' }} />

      <AdSlot />

      <div className="p-8 rounded-2xl bg-[#0a0a0a] text-white text-center space-y-4">
        <h3 className="text-2xl font-bold">{t.blog.ctaBoxTitle}</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          {t.blog.ctaBoxDesc}
        </p>
        <Link to="/cv-generator" className="btn-premium btn-primary text-xs font-bold px-8 py-3 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> {t.blog.ctaBoxBtn}
        </Link>
      </div>
    </div>
  );
};
