import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, FileText, LayoutTemplate, BookOpen, CreditCard, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';

export const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isEditor = location.pathname === '/cv-generator';

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (isEditor) return null; // Editor has its own toolbar & layout

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 md:px-10">
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

        {/* Desktop Navigation */}
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
          <Link to="/sitemap" className="text-sm font-medium text-zinc-600 hover:text-[#0a0a0a] transition-colors">
            Plan du site
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <LanguageSelector />
          <Link
            to="/cv-generator"
            className="btn-premium btn-primary text-xs md:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.createCv}</span>
            <span className="sm:hidden">CV</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors border border-zinc-200/80 min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-zinc-900" /> : <Menu className="w-5 h-5 text-zinc-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white/98 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <Link
              to="/cv-templates"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 text-zinc-800 font-semibold text-sm transition-colors"
            >
              <LayoutTemplate className="w-4 h-4 text-blue-600" />
              <span>{t.nav.templates}</span>
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 text-zinc-800 font-semibold text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>{t.nav.blog}</span>
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 text-zinc-800 font-semibold text-sm transition-colors"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{t.nav.pricing}</span>
            </Link>
            <Link
              to="/sitemap"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-100 text-zinc-800 font-semibold text-sm transition-colors"
            >
              <MapPin className="w-4 h-4 text-violet-600" />
              <span>Plan du site (Sitemap)</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-zinc-200">
            <Link
              to="/cv-generator"
              className="btn-premium btn-primary text-sm font-bold w-full py-3.5 flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.createCv}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};


