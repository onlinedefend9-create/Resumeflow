import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface JobAlertSubscriptionProps {
  keywords: string;
  location: string;
  country: string;
}

export const JobAlertSubscription = ({ keywords, location, country }: JobAlertSubscriptionProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (emailStr: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr);
  };

  const handleSubscribeAlert = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setStatus('error');
      setErrorMessage("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Simuler / Déclencher via la Firebase Cloud Function (notre route Express backend)
      const functionResponse = await fetch('/api/job-alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          keywords,
          location,
          country
        })
      });

      if (!functionResponse.ok) {
        const errorData = await functionResponse.json();
        throw new Error(errorData.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      // 2. Écrire l'alerte directement dans Firestore pour une persistance à long terme
      // Clé d'identifiant unique d'alerte pour éviter les doublons (email + mots-clés + pays)
      const alertId = `${trimmedEmail.toLowerCase()}_${keywords.trim().toLowerCase().replace(/\s+/g, '_')}_${country.toLowerCase()}`;

      await setDoc(doc(db, 'job_alerts', alertId), {
        email: trimmedEmail,
        keywords: keywords.trim(),
        location: location.trim(),
        country: country.trim().toUpperCase(),
        subscribedAt: serverTimestamp(),
        active: true
      });

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error("Erreur d'inscription d'alerte :", err);
      setStatus('error');
      setErrorMessage(err.message || "Une erreur est survenue lors de la création de l'alerte. Veuillez réessayer.");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-sm mb-8 transition-all">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center text-center py-4"
          >
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mb-3">
              <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Alerte créée avec succès !</h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-md">
              Votre alerte pour <strong className="text-zinc-700 dark:text-zinc-300">« {keywords} »</strong> à {location} a été enregistrée par notre fonction Firebase. Vous recevrez un e-mail dès qu'une nouvelle opportunité sera disponible !
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Créer une autre alerte
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Firebase Cloud Functions
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500" />
                Recevoir des alertes d'offres par e-mail
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Abonnez-vous pour recevoir de nouvelles offres correspondant à votre recherche actuelle :{' '}
                <strong className="text-zinc-800 dark:text-zinc-200">« {keywords} »</strong> à{' '}
                <strong className="text-zinc-800 dark:text-zinc-200">{location} ({country})</strong>.
              </p>
            </div>

            <form onSubmit={handleSubscribeAlert} className="w-full lg:max-w-md">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    required
                    className="w-full pl-3 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="bg-[#0a0a0a] hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>M'abonner</span>
                  )}
                </button>
              </div>

              {/* Erreur de validation */}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-rose-500 text-[10px] font-semibold mt-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
