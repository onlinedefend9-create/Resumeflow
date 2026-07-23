import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';

export const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const isEditor = location.pathname === '/cv-generator';

  if (isEditor) return null; // Editor has its own toolbar & layout

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-zinc-200/60 transition-all">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-[#0a0a0a]">
              Resume<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Flow</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/cv-templates" className="text-sm font-medium text-zinc-600 hover:text-[#0a0a0a] transition-colors">
            {t.nav.templates}
          </Link>
          <Link to="/blog" className="text-sm font-medium text-zinc-600 hover:text-[#0a0a0a] transition-colors">
            {t.nav.blog}
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-zinc-600 hover:text-[#0a0a0a] transition-colors">
            {t.nav.pricing}
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSelector />
          <Link
            to="/cv-generator"
            className="btn-premium btn-primary text-xs md:text-sm font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.createCv}</span>
            <span className="sm:hidden">CV</span>
          </Link>
        </div>
      </div>
    </header>
  );
};


