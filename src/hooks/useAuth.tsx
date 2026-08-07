import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, firebaseConfig } from '../lib/firebase';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Copy, 
  X, 
  Terminal, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw 
} from 'lucide-react';

export interface DiagnosticState {
  code: string;
  message: string;
  hostname: string;
  isProd: boolean;
  hasDomainMismatch: boolean;
  projectId: string;
  authDomain: string;
  timestamp: string;
  linkedinClientId?: string | null;
  expectedLinkedinCallback?: string;
  actualOrigin?: string;
}

interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  diagnostics: DiagnosticState | null;
  runDiagnostics: () => void;
  dismissDiagnostics: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('supabase_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [diagnostics, setDiagnostics] = useState<DiagnosticState | null>(null);

  // Log authentication state changes
  useEffect(() => {
    console.log('[useAuth] État de l\'utilisateur modifié :', {
      isAuthenticated: !!user,
      uid: user?.uid || user?.id || null,
      email: user?.email || null,
      displayName: user?.displayName || user?.name || null,
      provider: user?.isLocal ? 'local' : (user?.app_metadata?.provider || 'firebase')
    });
  }, [user]);

  // Listen for Supabase and LinkedIn OAuth success/failure postMessages with detailed logging
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow AI Studio previews and localhost
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('europe-west2.run.app')) {
        return;
      }

      const msgData = event.data;
      if (!msgData || typeof msgData !== 'object') return;

      console.log('[useAuth] postMessage reçu de l\'origine :', origin, 'Données :', msgData);

      if (msgData.type === 'OAUTH_AUTH_SUCCESS' && msgData.provider === 'supabase') {
        console.log('[useAuth] Succès OAuth Supabase détecté ! Utilisateur :', msgData.user);
        const supabaseUser = msgData.user;
        setUser(supabaseUser);
        localStorage.setItem('supabase_user_session', JSON.stringify(supabaseUser));
      } else if (msgData.type === 'LINKEDIN_AUTH_SUCCESS') {
        console.log('[useAuth] Succès Authentification LinkedIn détecté ! Profil :', msgData.profile);
        const profile = msgData.profile;
        const linkedinUser = {
          uid: 'linkedin_' + (profile.sub || profile.id),
          email: profile.email,
          displayName: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || profile.email?.split('@')[0] || 'Utilisateur LinkedIn',
          photoURL: profile.picture || null
        };
        setUser(linkedinUser);
        localStorage.setItem('supabase_user_session', JSON.stringify(linkedinUser));
        window.dispatchEvent(new Event('supabase-auth-change'));
      } else if (msgData.type === 'LINKEDIN_AUTH_ERROR') {
        console.error('[useAuth] Échec Authentification LinkedIn détecté ! Erreur :', msgData.error);
        setError(msgData.error || 'L\'authentification avec LinkedIn a échoué.');
        
        const host = window.location.hostname;
        const isProd = host !== 'localhost' && !host.includes('127.0.0.1') && !host.includes('ais-dev-') && !host.includes('ais-pre-');
        const hasDomainMismatch = isProd && !firebaseConfig.authDomain.includes(host);
        
        setDiagnostics({
          code: 'linkedin/auth-failed',
          message: msgData.error || 'Erreur lors du processus d\'échange OAuth avec LinkedIn.',
          hostname: host,
          isProd,
          hasDomainMismatch,
          projectId: firebaseConfig.projectId,
          authDomain: firebaseConfig.authDomain,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          linkedinClientId: ((import.meta as any).env.VITE_LINKEDIN_CLIENT_ID as string) || null,
          expectedLinkedinCallback: `${window.location.origin}/api/auth/linkedin/callback`,
          actualOrigin: window.location.origin
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Sync Supabase session state across storage change events and custom events
  useEffect(() => {
    const checkSession = () => {
      try {
        const saved = localStorage.getItem('supabase_user_session');
        const parsed = saved ? JSON.parse(saved) : null;
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    };

    window.addEventListener('storage', checkSession);
    window.addEventListener('supabase-auth-change', checkSession);
    
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('supabase-auth-change', checkSession);
    };
  }, []);

  useEffect(() => {
    console.log('[useAuth] Initialisation de l\'observateur d\'état Firebase (onAuthStateChanged)...');
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const hasSupabaseSession = localStorage.getItem('supabase_user_session');
      console.log('[useAuth] Changement d\'état Firebase détecté. Utilisateur actuel :', currentUser ? currentUser.email : 'aucun');
      if (currentUser) {
        localStorage.removeItem('supabase_user_session');
        setUser(currentUser);
      } else if (!hasSupabaseSession) {
        setUser(null);
      }
      setLoading(false);
    }, (err) => {
      console.warn('[useAuth] Erreur d\'authentification Firebase (non fatale car Supabase/Local est disponible) :', err);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const runDiagnostics = () => {
    const host = window.location.hostname;
    const isProd = host !== 'localhost' && !host.includes('127.0.0.1') && !host.includes('ais-dev-') && !host.includes('ais-pre-');
    const hasDomainMismatch = isProd && !firebaseConfig.authDomain.includes(host);
    setDiagnostics({
      code: 'DIAGNOSTIC_MANUEL',
      message: 'Lancement du diagnostic manuel de l\'infrastructure d\'authentification.',
      hostname: host,
      isProd,
      hasDomainMismatch,
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      linkedinClientId: ((import.meta as any).env.VITE_LINKEDIN_CLIENT_ID as string) || null,
      expectedLinkedinCallback: `${window.location.origin}/api/auth/linkedin/callback`,
      actualOrigin: window.location.origin
    });
  };

  const dismissDiagnostics = () => {
    setDiagnostics(null);
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Une erreur est survenue lors de la connexion.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        errMsg = 'Identifiants invalides. Veuillez réessayer.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Adresse e-mail non valide.';
      } else if (err.code === 'auth/user-disabled') {
        errMsg = 'Ce compte a été désactivé.';
      } else {
        // Fallback to local storage login for any other Firebase failures
        console.warn('Firebase Email/Password Auth not available or failed. Falling back to local storage login.');
        const localUsers = JSON.parse(localStorage.getItem('local_registered_users') || '{}');
        const match = localUsers[email];
        if (match && match.pass === pass) {
          const fallbackUser = {
            uid: 'local_' + btoa(email),
            email: email,
            displayName: match.name || email.split('@')[0],
            photoURL: null,
            isLocal: true
          };
          setUser(fallbackUser);
          localStorage.setItem('supabase_user_session', JSON.stringify(fallbackUser));
          setLoading(false);
          return;
        } else {
          errMsg = 'Identifiants invalides ou compte local non trouvé.';
        }
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        // Force refresh user to apply display name
        setUser({ ...userCredential.user, displayName: name });
      }
    } catch (err: any) {
      console.error(err);
      let errMsg = 'Une erreur est survenue lors de l\'inscription.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'Cette adresse e-mail est déjà utilisée.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Adresse e-mail non valide.';
      } else {
        // Fallback to local storage registration for any other Firebase failures (operation-not-allowed, network-failed, invalid-api-key, etc.)
        console.warn('Firebase Email/Password Auth not available or failed. Falling back to local storage registration.');
        const localUsers = JSON.parse(localStorage.getItem('local_registered_users') || '{}');
        if (localUsers[email]) {
          errMsg = 'Cette adresse e-mail est déjà utilisée (compte local).';
          setError(errMsg);
          throw new Error(errMsg);
        }
        localUsers[email] = { name, pass };
        localStorage.setItem('local_registered_users', JSON.stringify(localUsers));

        const fallbackUser = {
          uid: 'local_' + btoa(email),
          email: email,
          displayName: name,
          photoURL: null,
          isLocal: true
        };
        setUser(fallbackUser);
        localStorage.setItem('supabase_user_session', JSON.stringify(fallbackUser));
        setLoading(false);
        return;
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Erreur Firebase Google Auth:', err);
      
      const host = window.location.hostname;
      const isProd = host !== 'localhost' && !host.includes('127.0.0.1') && !host.includes('ais-dev-') && !host.includes('ais-pre-');
      const hasDomainMismatch = isProd && !firebaseConfig.authDomain.includes(host);

      // Enregistrer les données de diagnostic
      setDiagnostics({
        code: err.code || 'unknown',
        message: err.message || String(err),
        hostname: host,
        isProd,
        hasDomainMismatch,
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        timestamp: new Date().toLocaleTimeString('fr-FR'),
      });

      let errMsg = 'Une erreur est survenue lors de la connexion avec Google.';
      if (err.code === 'auth/popup-blocked') {
        errMsg = 'Le pop-up de connexion a été bloqué par votre navigateur. Veuillez autoriser les pop-ups pour ce site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'La fenêtre de connexion a été fermée avant la fin du processus.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errMsg = `Ce domaine (${window.location.hostname}) n'est pas encore autorisé dans votre console Firebase. Veuillez vous rendre sur la console Firebase > Authentication > Paramètres > Domaines autorisés, et ajoutez ce domaine (ex: ${window.location.hostname}).`;
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = "La méthode de connexion avec Google n'est pas activée dans votre console Firebase. Veuillez l'activer sous Authentication > Sign-in method.";
      } else if (err.message) {
        errMsg = `Erreur de connexion : ${err.message}`;
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      localStorage.removeItem('supabase_user_session');
      await signOut(auth);
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      loginWithGoogle, 
      logout, 
      clearError,
      diagnostics,
      runDiagnostics,
      dismissDiagnostics
    }}>
      {children}
      {diagnostics && (
        <DiagnosticConsole diagnostics={diagnostics} onClose={dismissDiagnostics} />
      )}
    </AuthContext.Provider>
  );
};

const DiagnosticConsole: React.FC<{ diagnostics: DiagnosticState; onClose: () => void }> = ({ diagnostics, onClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const report = `=== RAPPORT DE DIAGNOSTIC D'AUTHENTIFICATION (Firebase & LinkedIn) ===
Date: ${new Date().toLocaleString('fr-FR')}
Domaine Actuel (Hébergement): ${diagnostics.hostname}
Projet Firebase ID: ${diagnostics.projectId}
Domaine Firebase Auth Configuré: ${diagnostics.authDomain}
Code d'Erreur: ${diagnostics.code}
Message d'Erreur: ${diagnostics.message}
Environnement de Production: ${diagnostics.isProd ? 'Oui' : 'Non'}
Origine JavaScript Attendue (GCP): https://${diagnostics.hostname}

--- CONFIGURATION LINKEDIN OAUTH ---
ID Client LinkedIn: ${diagnostics.linkedinClientId || 'Non configuré'}
URL de Redirection Attendue: ${diagnostics.expectedLinkedinCallback || `${window.location.origin}/api/auth/linkedin/callback`}
========================================================================`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(report).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        alert("Impossible de copier automatiquement. Veuillez copier manuellement le message ci-dessus.");
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = report;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("Impossible de copier automatiquement.");
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <div id="auth-diagnostic-console" className="fixed bottom-4 right-4 z-50 w-full max-w-lg bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-sans transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold tracking-wide text-zinc-200">
            Diagnostic Authentification (Vercel & Prod)
          </span>
          {diagnostics.isProd && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              PROD
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
            title={isCollapsed ? "Agrandir" : "Réduire"}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      {!isCollapsed && (
        <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Status block */}
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide">Erreur détectée durant la connexion</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                La connexion Google a échoué. Code d'erreur Firebase : <code className="bg-zinc-950 px-1.5 py-0.5 rounded font-mono text-amber-400 border border-zinc-800">{diagnostics.code}</code>
              </p>
            </div>
          </div>

          {/* Popup-blocked Specific Guide */}
          {diagnostics.code === 'auth/popup-blocked' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Comment résoudre cette erreur immédiate</h4>
              </div>
              <div className="text-xs text-zinc-300 space-y-2.5 leading-relaxed">
                <div className="flex gap-2">
                  <span className="flex items-center justify-center w-5 h-5 bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded-full shrink-0">1</span>
                  <div>
                    <strong className="text-zinc-200">Autoriser les popups dans le navigateur :</strong>
                    <p className="mt-1 text-zinc-400 text-[11px]">
                      Dans la barre d'adresse de Chrome (à droite, près de la petite icône avec une croix rouge ou un bouclier), cliquez sur l'icône de blocage de popup.
                    </p>
                    <p className="mt-1 text-zinc-400 text-[11px]">
                      Sélectionnez <span className="text-amber-400 font-semibold">"Toujours autoriser les fenêtres surgissantes et les redirections pour {diagnostics.hostname}"</span>, puis cliquez sur <strong className="text-zinc-200">OK</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center w-5 h-5 bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded-full shrink-0">2</span>
                  <div>
                    <strong className="text-zinc-200">Désactiver temporairement les bloqueurs de pub :</strong>
                    <p className="mt-1 text-zinc-400 text-[11px]">
                      Si vous utilisez un bloqueur de publicités ou de scripts (AdBlock, uBlock, Brave Shield, etc.), mettez temporairement en liste blanche ou désactivez-le pour le domaine <span className="font-mono text-amber-400">{diagnostics.hostname}</span>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center w-5 h-5 bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded-full shrink-0">3</span>
                  <div>
                    <strong className="text-zinc-200">Recharger et réessayer :</strong>
                    <p className="mt-1 text-zinc-400 text-[11px]">
                      Rafraîchissez la page (bouton ci-dessous ou F5), puis cliquez à nouveau sur <strong className="text-zinc-200">Se connecter avec Google</strong>. La popup s'ouvrira directement !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Environmental parameters list */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Paramètres système actuels</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">Domaine Actuel (Hôte)</span>
                <span className="font-mono text-zinc-200 block truncate">{diagnostics.hostname}</span>
              </div>
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">ID Projet Firebase</span>
                <span className="font-mono text-zinc-200 block truncate">{diagnostics.projectId}</span>
              </div>
            </div>
          </div>

          {/* Diagnostics dynamic checklist */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Liste de Résolution des Problèmes</h5>
            
            <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs">
              
              {/* Check 1: Domain Authorization in Firebase */}
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  {diagnostics.code === 'auth/unauthorized-domain' || diagnostics.hasDomainMismatch ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-zinc-200 block text-[11px]">1. Domaines Autorisés Firebase</span>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Le domaine d'hébergement Vercel doit être autorisé explicitement dans votre projet Firebase.
                  </p>
                  <p className="text-zinc-400 leading-relaxed text-[11px] bg-zinc-900 p-1.5 rounded font-mono select-all text-indigo-400 border border-zinc-800 flex items-center justify-between">
                    <span>{diagnostics.hostname}</span>
                    <span className="text-[9px] bg-indigo-500/10 px-1 py-0.5 rounded text-indigo-300 font-sans">À copier</span>
                  </p>
                  <a 
                    href={`https://console.firebase.google.com/project/${diagnostics.projectId}/authentication/providers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold hover:underline pt-1"
                  >
                    Console Firebase &gt; Authentication &gt; Domaines autorisés <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              {/* Check 2: Google Cloud Consent Screen Origins */}
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-zinc-200 block text-[11px]">2. Identifiants Console Google Cloud</span>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Dans l'onglet Identifiants de la console Google Cloud, ajoutez l'origine de votre domaine de production.
                  </p>
                  <p className="text-zinc-400 leading-relaxed text-[11px] bg-zinc-900 p-1.5 rounded font-mono select-all text-indigo-400 border border-zinc-800 flex items-center justify-between">
                    <span>https://{diagnostics.hostname}</span>
                    <span className="text-[9px] bg-indigo-500/10 px-1 py-0.5 rounded text-indigo-300 font-sans">À copier</span>
                  </p>
                  <a 
                    href={`https://console.cloud.google.com/apis/credentials?project=${diagnostics.projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold hover:underline pt-1"
                  >
                    Google Cloud &gt; Identifiants &gt; Client OAuth Web <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              {/* Check 3: LinkedIn Configuration & Callback URL */}
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  {!diagnostics.linkedinClientId ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-zinc-200 block text-[11px]">3. Configuration LinkedIn OAuth</span>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Vérifiez que votre identifiant client LinkedIn est configuré et que l'URL de redirection autorisée correspond parfaitement à votre environnement actuel dans la console développeur LinkedIn.
                  </p>
                  
                  <div className="space-y-1.5 pt-1">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">ID Client LinkedIn (Client-side)</span>
                      <code className="bg-zinc-900 px-1.5 py-1 rounded font-mono text-zinc-300 border border-zinc-800 text-[10px] block truncate">
                        {diagnostics.linkedinClientId || 'Non configuré (définissez VITE_LINKEDIN_CLIENT_ID)'}
                      </code>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">URL de redirection attendue</span>
                      <p className="text-zinc-400 leading-relaxed text-[10px] bg-zinc-900 p-1.5 rounded font-mono select-all text-indigo-400 border border-zinc-800 flex items-center justify-between">
                        <span>{diagnostics.expectedLinkedinCallback || `${window.location.origin}/api/auth/linkedin/callback`}</span>
                        <span className="text-[9px] bg-indigo-500/10 px-1 py-0.5 rounded text-indigo-300 font-sans shrink-0 ml-1">À copier</span>
                      </p>
                    </div>
                  </div>
                  
                  <a 
                    href="https://www.linkedin.com/developers/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold hover:underline pt-1.5"
                  >
                    Console LinkedIn Developer Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copié !' : 'Copier le rapport complet'}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recharger la page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
