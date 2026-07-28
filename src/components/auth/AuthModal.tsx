import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../hooks/useAuth';
import { X, Mail, Lock, User, Loader2, Sparkles } from 'lucide-react';
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
  const { login, register, loading, error, clearError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Use a form ref and form state to avoid high frequency keyboard state updates (fixes INP)
  const formRef = useRef<HTMLFormElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Clear inputs and error on modal open/close
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      clearError();
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
    const passwordVal = formData.get('password') as string || '';
    const nameVal = (formData.get('name') as string || '').trim();

    if (!emailVal || !passwordVal) {
      setLocalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (mode === 'register' && !nameVal) {
      setLocalError('Veuillez renseigner votre nom.');
      return;
    }

    try {
      if (mode === 'login') {
        await login(emailVal, passwordVal);
      } else {
        await register(nameVal, emailVal, passwordVal);
      }
      onClose();
    } catch (err: any) {
      // Error is handled by useAuth state, but we can also catch here if needed
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setLocalError(null);
    clearError();
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const activeError = localError || error;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/50 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
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

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message */}
            {activeError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600 animate-fadeIn">
                {activeError}
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium btn-primary py-3 flex items-center justify-center gap-2 text-sm font-bold shadow-lg disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Se connecter' : "S'inscrire"}</span>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              {mode === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="ml-1.5 text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-all"
              >
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
