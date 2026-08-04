import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[AuthCallback] Récupération de la session suite au redirect OAuth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          console.log('[AuthCallback] Session Supabase valide récupérée pour :', session.user.email);
          const userPayload = {
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            photoURL: session.user.user_metadata?.avatar_url || null,
            isSupabase: true
          };
          localStorage.setItem('supabase_user_session', JSON.stringify(userPayload));
          
          // Déclencher les événements de mise à jour de session
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('supabase-auth-change'));
          
          console.log('[AuthCallback] Session sauvegardée localement. Redirection vers la page principale...');
          navigate('/', { replace: true });
        } else {
          // Aucun session n'est encore disponible de manière synchrone, on attend ou on tente une ré-authentification
          console.log('[AuthCallback] Aucune session active détectée synchrone.');
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (user) {
            const userPayload = {
              uid: user.id,
              email: user.email,
              displayName: user.user_metadata?.full_name || user.email?.split('@')[0],
              photoURL: user.user_metadata?.avatar_url || null,
              isSupabase: true
            };
            localStorage.setItem('supabase_user_session', JSON.stringify(userPayload));
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('supabase-auth-change'));
            navigate('/', { replace: true });
          } else {
            // S'il n'y a pas d'erreur mais pas d'utilisateur, on redirige vers le login
            console.log('[AuthCallback] Aucun utilisateur détecté, redirection vers /login');
            navigate('/login', { replace: true });
          }
        }
      } catch (err: any) {
        console.error('[AuthCallback] Erreur critique d\'échange OAuth:', err);
        setErrorMsg(err.message || 'Impossible de finaliser la connexion. Veuillez réessayer.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 shadow-xl max-w-md w-full text-center">
        {errorMsg ? (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
            <h1 className="text-lg font-bold text-zinc-800">Échec de la connexion</h1>
            <p className="text-sm text-zinc-500">{errorMsg}</p>
            <p className="text-xs text-zinc-400 mt-2">Redirection vers l'écran de connexion dans quelques instants...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <h1 className="text-lg font-bold text-zinc-800">Finalisation de l'authentification</h1>
            <p className="text-sm text-zinc-500">Nous terminons l'échange sécurisé de vos informations de profil...</p>
          </div>
        )}
      </div>
    </div>
  );
};
