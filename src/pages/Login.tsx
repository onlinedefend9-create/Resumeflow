import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { SEO } from '../components/SEO';
import { 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Star,
  FileText,
  Clock,
  Download,
  Users,
  ExternalLink
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import * as motionVal from 'motion/react';

const motion = motionVal.motion;

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: firebaseUser, loginWithGoogle } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isIframe, setIsIframe] = useState(false);

  // Parse redirect path if any
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user || firebaseUser) {
        navigate(from, { replace: true });
      }
    };
    checkUser();
  }, [navigate, from, firebaseUser]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          // Check if confirmation is required
          const isConfirmRequired = data.session === null;
          
          const userPayload = {
            uid: data.user.id,
            email: data.user.email,
            displayName: fullName || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            photoURL: null,
            isSupabase: true
          };
          
          // Store session locally to allow instant access in the sandbox
          localStorage.setItem('supabase_user_session', JSON.stringify(userPayload));
          
          // Dispatch events to notify AuthProvider instantly in the same window
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('supabase-auth-change'));

          if (isConfirmRequired) {
            setSuccessMessage("Compte créé avec succès ! (Un e-mail de confirmation vous a été envoyé, mais nous vous avons connecté automatiquement pour continuer).");
          } else {
            setSuccessMessage("Compte créé avec succès ! Redirection...");
          }
          
          setTimeout(() => {
            window.location.href = from;
          }, 1500);
        }
      } else {
        // Sign In Flow
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.session?.user) {
          const userPayload = {
            uid: data.session.user.id,
            email: data.session.user.email,
            displayName: data.session.user.user_metadata?.full_name || data.session.user.email?.split('@')[0],
            photoURL: data.session.user.user_metadata?.avatar_url || null,
            isSupabase: true
          };
          localStorage.setItem('supabase_user_session', JSON.stringify(userPayload));
          
          // Dispatch events to notify AuthProvider instantly in the same window
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('supabase-auth-change'));
          
          setSuccessMessage("Ravi de vous revoir ! Redirection...");
          setTimeout(() => {
            window.location.href = from;
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error('Authentication Error:', err);
      let errMsg = 'Une erreur est survenue lors de l\'authentification.';
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          errMsg = 'Identifiants invalides. Veuillez vérifier votre adresse e-mail et votre mot de passe.';
        } else if (err.message.includes('Email not confirmed')) {
          errMsg = 'Votre adresse e-mail n\'est pas encore confirmée. Veuillez vérifier votre boîte de réception.';
        } else if (err.message.includes('Password should be')) {
          errMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
        } else if (err.message.includes('User already registered')) {
          errMsg = 'Cet e-mail est déjà associé à un compte.';
        } else {
          errMsg = err.message;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await loginWithGoogle();
      setSuccessMessage("Connexion réussie ! Redirection...");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError(err.message || 'Impossible de se connecter avec Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // ❌ Remplacé 'linkedin' (v2 dépréciée) par 'linkedin_oidc' conformément aux exigences de sécurité LinkedIn et Supabase
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('LinkedIn OAuth Error:', err);
      setError(err.message || 'Impossible de se connecter avec LinkedIn.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between">
      <SEO 
        title="Sauvegardez votre CV | ResumeFlow" 
        description="Créez votre compte gratuit pour enregistrer, modifier et télécharger vos CV professionnels."
      />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-6xl bg-white rounded-3xl border border-zinc-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          
          {/* LEFT SIDE: Visual Showcase (Conversion Panel Inspired by LiveCareer) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1a30] via-[#112443] to-[#0a1424] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Info / Branding */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-blue-300 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Plus que 1 minute pour finaliser</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Sauvegardez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">chef-d'œuvre</span> aujourd'hui.
              </h2>
              <p className="mt-3 text-zinc-300 text-sm leading-relaxed max-w-sm">
                Rejoignez des milliers de candidats qui ont décroché l'entretien de leurs rêves grâce à nos designs professionnels.
              </p>
            </div>

            {/* Live Interactive Preview / Dynamic Card Container */}
            <div className="my-8 relative z-10 hidden sm:block">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-inner"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md text-sm">
                    CV
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Votre CV Professionnel</h4>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Modèle moderne prêt à l'emploi
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2.5 w-3/4 bg-white/15 rounded-full" />
                  <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                  
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-center">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                      <span className="text-[10px] text-zinc-300 font-medium">100% Modifiable</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-center">
                      <Download className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span className="text-[10px] text-zinc-300 font-medium">Export PDF</span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-center">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span className="text-[10px] text-zinc-300 font-medium">Accès 24/7</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Checklist of Benefits */}
            <div className="space-y-3.5 relative z-10 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-200">
                  <strong className="text-white font-bold">Modèles optimisés ATS</strong> — Conçus pour franchir avec succès les filtres des recruteurs.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-200">
                  <strong className="text-white font-bold">Générateur de compétences</strong> — Suggestions intelligentes adaptées à votre métier.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm text-zinc-200">
                  <strong className="text-white font-bold">Téléchargement illimité</strong> — PDF de haute qualité prêts à postuler.
                </p>
              </div>
            </div>

            {/* Trustpilot-inspired rating footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 relative z-10">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.8/5</span>
                <span>sur Trustpilot</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>+100k membres</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Perfected Onboarding Subscription Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            <div>
              {/* Stepper Timeline - Just like LiveCareer build flow */}
              <div className="hidden sm:flex items-center justify-between mb-8 text-xs text-zinc-400 font-bold tracking-wide uppercase">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] text-zinc-600 font-bold">
                    1
                  </div>
                  <span>Modèle</span>
                </div>
                <div className="flex-1 border-t border-dashed border-zinc-200 mx-3" />
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] text-zinc-600 font-bold">
                    2
                  </div>
                  <span>Rédaction</span>
                </div>
                <div className="flex-1 border-t border-dashed border-zinc-300 mx-3" />
                <div className="flex items-center gap-1.5 text-blue-600">
                  <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-extrabold text-blue-600">
                    3
                  </div>
                  <span>Enregistrer</span>
                </div>
              </div>

              {/* Form Headline */}
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900">
                  {isSignUp ? "Créez votre compte en 10 secondes" : "Heureux de vous revoir !"}
                </h3>
                <p className="text-zinc-500 text-sm mt-1.5">
                  {isSignUp 
                    ? "Saisissez vos identifiants pour enregistrer votre travail de manière sécurisée."
                    : "Accédez à votre espace de travail et gérez vos CV."}
                </p>
              </div>

              {/* Iframe warning banner */}
              {isIframe && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-850 space-y-3 mb-6 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                    <div className="font-semibold leading-relaxed text-amber-800">
                      <strong className="font-extrabold text-amber-900 block mb-0.5">⚠️ Environnement d'aperçu d'éditeur</strong>
                      Pour pouvoir vous connecter ou vous inscrire (E-mail, Google ou Supabase), vous devez ouvrir l'application dans un nouvel onglet. Les systèmes de sécurité des navigateurs modernes bloquent l'authentification au sein des cadres d'aperçu (iframe).
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

              {/* Tab Selector */}
              <div className="flex bg-zinc-100/80 p-1 rounded-xl mb-6 border border-zinc-200/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    !isSignUp 
                      ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/40" 
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                    isSignUp 
                      ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/40" 
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {/* Status Notifications */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-5 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs sm:text-sm leading-relaxed"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700 text-xs sm:text-sm leading-relaxed"
                  >
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                    <span className="font-medium">{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Body */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className="block text-xs font-bold text-zinc-700 uppercase tracking-wide">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex: Alexandre Martin"
                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 hover:bg-zinc-100/30 focus:bg-white border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-medium transition-all outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold text-zinc-700 uppercase tracking-wide">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 hover:bg-zinc-100/30 focus:bg-white border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-medium transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-bold text-zinc-700 uppercase tracking-wide">
                      Mot de passe
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignUp ? "6 caractères minimum" : "••••••••"}
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 hover:bg-zinc-100/30 focus:bg-white border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-medium transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="text-zinc-500 text-xs leading-normal pt-1">
                    En créant un compte, vous acceptez nos <span className="text-zinc-800 font-semibold underline cursor-pointer hover:text-zinc-950">Conditions d'Utilisation</span> et notre <span className="text-zinc-800 font-semibold underline cursor-pointer hover:text-zinc-950">Politique de Confidentialité</span>.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>{isSignUp ? "Sauvegarder et Continuer" : "Se connecter et Continuer"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-zinc-400 font-bold tracking-wider">
                    ou continuer avec
                  </span>
                </div>
              </div>

              {/* Social OAuth - Standard LiveCareer clean login style */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3 px-5 bg-white hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>S'identifier avec Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleLinkedInAuth}
                  disabled={loading}
                  className="w-full py-3 px-5 bg-white hover:bg-zinc-50 active:bg-zinc-100 border border-zinc-200 text-[#0077b5] hover:text-[#005582] rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                  <svg className="w-4.5 h-4.5 fill-[#0077b5]" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>S'identifier avec LinkedIn</span>
                </button>
              </div>
            </div>

            {/* Bottom Security Assurance Badge */}
            <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Vos données sont protégées par un cryptage SSL de niveau bancaire</span>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Compact Footer */}
      <footer className="bg-white border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ResumeFlow. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link to="/sitemap" className="hover:text-zinc-600 transition-colors">Sitemap</Link>
            <span className="text-zinc-200">|</span>
            <a href="#" className="hover:text-zinc-600 transition-colors">Mentions Légales</a>
            <span className="text-zinc-200">|</span>
            <a href="#" className="hover:text-zinc-600 transition-colors">Sécurité</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
