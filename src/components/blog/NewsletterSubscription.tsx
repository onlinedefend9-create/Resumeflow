import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface NewsletterSubscriptionProps {
  articleSlug?: string;
  articleTitle?: string;
}

enum OperationType {
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  };
}

export const NewsletterSubscription = ({ articleSlug = 'general', articleTitle = '' }: NewsletterSubscriptionProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (emailStr: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr);
  };

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const trimmedEmail = email.trim().toLowerCase();

    if (!validateEmail(trimmedEmail)) {
      setStatus('error');
      setErrorMessage("Veuillez saisir une adresse email valide.");
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const subscriberId = trimmedEmail; // Prevent duplicate entries by using email as document ID
    const docPath = `newsletter_subscribers/${subscriberId}`;

    try {
      await setDoc(doc(db, 'newsletter_subscribers', subscriberId), {
        email: trimmedEmail,
        subscribedAt: serverTimestamp(),
        source: 'blog_article_footer',
        articleSlug,
        articleTitle: articleTitle || null
      });

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      const errInfo: FirestoreErrorInfo = {
        error: err instanceof Error ? err.message : String(err),
        authInfo: {},
        operationType: OperationType.WRITE,
        path: docPath,
      };
      console.error('Firestore Newsletter Error: ', JSON.stringify(errInfo));
      
      setStatus('error');
      if (err?.code === 'permission-denied') {
        setErrorMessage("Impossible de s'abonner pour le moment (Erreur de permission de la base de données).");
      } else {
        setErrorMessage("Une erreur est survenue lors de votre inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="w-full py-10 px-6 md:px-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 text-zinc-200 pointer-events-none">
        <Sparkles className="w-12 h-12 opacity-30" />
      </div>

      <div className="space-y-3 max-w-lg text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] text-white text-[10px] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-400" /> Newsletter Privée
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold text-[#0a0a0a] tracking-tight">
          Restez informé et boostez votre carrière
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Rejoignez des milliers de professionnels. Recevez chaque semaine nos analyses ATS exclusives, de nouveaux modèles de CV et nos guides de recrutement stratégiques.
        </p>
      </div>

      <div className="w-full md:w-auto min-w-[280px] md:min-w-[360px]">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 space-y-2 text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-sm">
                <span className="p-1 rounded-full bg-emerald-500 text-white">
                  <Check className="w-3.5 h-3.5" />
                </span>
                Inscription validée !
              </div>
              <p className="text-xs text-emerald-600 font-medium">
                Merci de nous faire confiance. Préparez-vous à recevoir nos conseils de pro directement dans votre boîte de réception.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubscribe}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="votre.email@adresse.com"
                  disabled={status === 'loading'}
                  className="w-full pl-10 pr-32 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-800 text-xs font-medium focus:ring-2 focus:ring-[#0a0a0a] focus:border-transparent outline-none transition-all placeholder:text-zinc-400"
                  required
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-lg bg-[#0a0a0a] hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "S'abonner"
                  )}
                </button>
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-red-600 text-xs font-semibold pl-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMessage}
                </motion.div>
              )}

              <p className="text-[10px] text-zinc-400 font-medium text-center md:text-left">
                Aucun spam. Désinscription possible en 1 clic à tout moment.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
