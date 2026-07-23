import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const Footer = () => {
  const location = useLocation();
  const { t } = useLanguage();

  if (location.pathname === '/cv-generator') return null;

  return (
    <footer className="border-t border-zinc-200 bg-white py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white fill-white/20" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-[#0a0a0a]">
                Resume<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Flow</span>
              </span>
            </div>
          </Link>
          <p className="text-xs text-zinc-500 max-w-sm">
            {t.footer.tagline}
          </p>
        </div>

        <div className="flex flex-wrap gap-8 text-sm font-medium text-zinc-600">
          <Link to="/cv-templates" className="hover:text-[#0a0a0a] transition-colors">{t.nav.templates}</Link>
          <Link to="/blog" className="hover:text-[#0a0a0a] transition-colors">{t.nav.blog}</Link>
          <Link to="/pricing" className="hover:text-[#0a0a0a] transition-colors">{t.nav.pricing}</Link>
          <Link to="/cv-generator" className="hover:text-blue-600 transition-colors font-semibold">{t.nav.createCv}</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-400 gap-4">
        <p>{t.footer.rights}</p>
        <p className="flex items-center gap-1">
          {t.footer.madeWith} <Heart className="w-3 h-3 text-[#ff2d8d] fill-[#ff2d8d]" />
        </p>
      </div>
    </footer>
  );
};


