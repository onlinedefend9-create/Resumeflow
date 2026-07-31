import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, LayoutTemplate, BookOpen, CreditCard, MapPin, LogOut, Cloud, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../LanguageSelector';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

export const Header = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  
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
            {t.nav.sitemap}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <LanguageSelector />

          {/* Cloud sync status indicator & User menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
                <Cloud className="w-3.5 h-3.5 fill-emerald-100" />
                <span>Cloud activé</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-zinc-700 bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="max-w-[100px] truncate">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 sm:p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-zinc-700 hover:text-[#0a0a0a] transition-all bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-center flex items-center justify-center"
            >
              Connexion
            </Link>
          )}

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
            className="md:hidden p-2 rounded-xl text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors border border-zinc-200/80 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-zinc-900" /> : <Menu className="w-5 h-5 text-zinc-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white/98 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-xl animate-fadeIn">
          {/* User profile details for mobile */}
          {user && (
            <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-800 truncate">{user.displayName || 'Utilisateur'}</p>
                  <p className="text-[10px] font-semibold text-zinc-400 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                <Cloud className="w-3 h-3 fill-emerald-100" />
                <span>Cloud</span>
              </div>
            </div>
          )}

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
              <span>{t.nav.sitemap}</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-zinc-200 flex flex-col gap-2.5">
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl font-bold text-zinc-700 hover:text-black bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-sm block"
              >
                Se connecter
              </Link>
            )}

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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
      />
    </header>
  );
};
