import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../hooks/useAuth';
import { X, Mail, Lock, User, Loader2, Sparkles, Eye, EyeOff, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as motionVal from 'motion/react';

// Use motion component safely
const motion = motionVal.motion;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const { user, login, register, loginWithGoogle, loading, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  const formRef = useRef<HTMLFormElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  // Close modal when user becomes logged in
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  // States for password inputs
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time password criteria
  const isMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password);
  const strengthScore = [isMinLength, hasUppercase, hasNumberOrSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!password) return '';
    if (strengthScore === 1) return 'Faible';
    if (strengthScore === 2) return 'Moyen';
    return 'Fort';
  };

  const getStrengthColorClass = () => {
    if (strengthScore === 1) return 'bg-red-500';
    if (strengthScore === 2) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  // Clear inputs and error on modal open/close
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      clearError();
      setTermsAccepted(false);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    const formData = new FormData(e.currentTarget);
    const emailVal = (formData.get('email') as string || '').trim();
    const nameVal = (formData.get('name') as string || '').trim();
    const passwordVal = password;
    const confirmPasswordVal = confirmPassword;

    // 1. Basic validation
    if (!emailVal || !passwordVal) {
      setLocalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Email pattern validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      setLocalError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (mode === 'register') {
      if (!nameVal) {
        setLocalError('Veuillez renseigner votre nom.');
        return;
      }

      if (nameVal.length < 2) {
        setLocalError('Le nom doit contenir au moins 2 caractères.');
        return;
      }

      if (!isMinLength) {
        setLocalError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }

      if (!hasUppercase || !hasNumberOrSpecial) {
        setLocalError('Veuillez respecter tous les critères du mot de passe.');
        return;
      }

      // Confirm password validation
      if (passwordVal !== confirmPasswordVal) {
        setLocalError('Les mots de passe ne correspondent pas.');
        return;
      }

      // Terms accepted validation
      if (!termsAccepted) {
        setLocalError('Vous devez accepter les conditions d\'utilisation pour continuer.');
        return;
      }
    }

    try {
      if (mode === 'login') {
        await login(emailVal, passwordVal);
      } else {
        await register(nameVal, emailVal, passwordVal);
      }
      onClose();
    } catch (err: any) {
      // Error message is set in hook
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      // Error is set in hook
    }
  };

  const handleSupabaseSignIn = async () => {
    setLocalError(null);
    clearError();
    try {
      const response = await fetch('/api/auth/supabase/url');
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Impossible de récupérer l'URL de connexion Supabase.");
      }
      const { url } = await response.json();

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const authWindow = window.open(
        url,
        'supabase_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!authWindow) {
        setLocalError("Le bloqueur de fenêtres pop-up a empêché l'ouverture. Veuillez autoriser les fenêtres pop-up pour ce site.");
      }
    } catch (err: any) {
      setLocalError(err.message || "Erreur lors de la tentative de connexion avec Supabase.");
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLocalError(null);
    clearError();
    setTermsAccepted(false);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const activeError = localError || error;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto bg-zinc-950/50 backdrop-blur-md">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 cursor-default" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 shadow-2xl overflow-hidden z-10 my-8"
      >
        
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors z-20 cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100 shadow-sm">
              <Sparkles className="w-6 h-6 fill-indigo-600/10" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">
              {mode === 'login' ? 'Bienvenue de retour' : 'Créer un compte'}
            </h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-[280px]">
              {mode === 'login' 
                ? 'Connectez-vous pour sauvegarder et synchroniser vos CV dans le cloud.' 
                : 'Commencez à concevoir des CV exceptionnels avec sauvegarde cloud.'}
            </p>
          </div>

          {/* Iframe warning banner */}
          {isIframe && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-850 space-y-3 mb-6 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="font-semibold leading-relaxed text-amber-800">
                  <strong className="font-extrabold text-amber-900 block mb-0.5">⚠️ Environnement d'aperçu d'éditeur</strong>
                  Pour pouvoir vous connecter ou vous inscrire (E-mail ou Google), vous devez ouvrir l'application dans un nouvel onglet. Les systèmes de sécurité des navigateurs modernes bloquent l'authentification au sein des cadres d'aperçu (iframe).
                </div>
              </div>
              <button
                type="button"
                onClick={() => window.open(window.location.href, '_blank')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvrir l'application dans un nouvel onglet</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {activeError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600 flex items-start gap-2 animate-fadeIn mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{activeError}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-70 mb-3"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.04-4.53z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>{mode === 'login' ? 'Se connecter avec Google' : "S'inscrire avec Google"}</span>
          </button>

          {/* Supabase Sign-In Button */}
          <button
            type="button"
            onClick={handleSupabaseSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[#1c1c1c] hover:bg-[#2e2e2e] text-white border border-zinc-800 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-70 mb-4"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.362 10.108L12.531.5a.514.514 0 00-.89.378l.006 8.358a.258.258 0 01-.416.208L2.392 2.396a.514.514 0 00-.776.62L8.272 23.5a.514.514 0 00.89-.378l-.006-8.358a.258.258 0 01.416-.208l8.847 7.048a.514.514 0 00.776-.62l-6.657-20.484a.257.257 0 01.417-.208l8.847 7.048a.514.514 0 00.56-.736z" fill="#3ECF8E" />
            </svg>
            <span>{mode === 'login' ? 'Se connecter avec Supabase' : "S'inscrire avec Supabase"}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Ou continuer avec e-mail
            </span>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

            {/* Firebase restriction warning */}
            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Méthode recommandée : Connexion Google</span>
              </div>
              <p className="leading-relaxed font-medium text-blue-850">
                L'authentification classique par E-mail/Mot de passe n'étant pas activée sur ce projet Firebase, veuillez utiliser le bouton <strong>"Se connecter avec Google"</strong> ci-dessus pour vous inscrire ou vous connecter instantanément.
              </p>
            </div>

            {/* Name Input (Register Only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Nom complet
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jean Dupont"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Adresse e-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="adresse@exemple.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator (Register Only) */}
              {mode === 'register' && password.length > 0 && (
                <div className="pt-1.5 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Sécurité du mot de passe :</span>
                    <span className={
                      strengthScore === 1 ? 'text-red-500' :
                      strengthScore === 2 ? 'text-amber-500' : 'text-emerald-500'
                    }>{getStrengthLabel()}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColorClass()}`}
                      style={{ width: `${(strengthScore / 3) * 100}%` }}
                    />
                  </div>
                  {/* Checklist of requirements */}
                  <ul className="space-y-1 text-[11px] font-medium text-zinc-500">
                    <li className="flex items-center gap-1.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${isMinLength ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className={isMinLength ? 'text-emerald-600 font-bold' : ''}>Au moins 6 caractères</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${hasUppercase ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className={hasUppercase ? 'text-emerald-600 font-bold' : ''}>Au moins une lettre majuscule</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${hasNumberOrSpecial ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-zinc-50 border-zinc-200 text-zinc-400'}`}>
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className={hasNumberOrSpecial ? 'text-emerald-600 font-bold' : ''}>Un chiffre ou caractère spécial</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Input (Register Only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Real-time Mismatch warning */}
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-[11px] font-bold text-red-500 animate-fadeIn">
                    Les mots de passe ne correspondent pas.
                  </p>
                )}
                {confirmPassword.length > 0 && password === confirmPassword && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Les mots de passe correspondent.
                  </p>
                )}
              </div>
            )}

            {/* Terms and Privacy Checkbox (Register Only) */}
            {mode === 'register' && (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600/20 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-zinc-500 font-medium select-none cursor-pointer leading-relaxed">
                  J'accepte les <span className="text-indigo-600 font-bold hover:underline">Conditions d'utilisation</span> et la <span className="text-indigo-600 font-bold hover:underline">Politique de confidentialité</span> de ResumeFlow.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-lg disabled:opacity-70 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Se connecter' : "Créer mon compte"}</span>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              {mode === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="ml-1.5 text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-all cursor-pointer"
              >
                {mode === 'login' ? "S'inscrire gratuitement" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

