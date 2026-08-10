import React, { useState } from 'react';
import { useCVData } from '../../hooks/useCVData';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  RefreshCw, 
  Bookmark, 
  Award, 
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeCVATSLocal } from '../../utils/atsAnalyzerAlgorithm';

interface SectionEval {
  section: string;
  status: string; // 'good', 'warning', 'critical'
  feedback: string;
  suggestions: string[];
}

interface ATSAnalysisResult {
  score: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  sectionEvaluations: SectionEval[];
  formattingTips: string[];
}

export const CVATSAnalyzer: React.FC = () => {
  const { data, editorTheme } = useCVData();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);

  const isFr = language === 'fr';

  const triggerAnalysis = () => {
    setLoading(true);
    setError(null);
    
    // Snappy offline simulation matching the premium UI flow
    setTimeout(() => {
      try {
        const analysisData = analyzeCVATSLocal(data, isFr);
        setResult(analysisData);
      } catch (err: any) {
        console.error("Local ATS analysis error:", err);
        setError(err.message || "Impossible de réaliser l'analyse locale du CV.");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
      default:
        return <Lightbulb className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
        return editorTheme === 'dark' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'warning':
        return editorTheme === 'dark' ? 'bg-amber-950/20 text-amber-400 border-amber-900/30' : 'bg-amber-50 text-amber-700 border-amber-100';
      case 'critical':
        return editorTheme === 'dark' ? 'bg-red-950/20 text-red-400 border-red-900/30' : 'bg-red-50 text-red-700 border-red-100';
      default:
        return editorTheme === 'dark' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-50 text-zinc-700 border-zinc-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBgCircle = (score: number) => {
    if (score >= 75) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  // SVG dimensions for the circular progress gauge
  const radius = 64;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference;

  return (
    <div className={`w-full rounded-2xl border transition-all duration-300 p-6 sm:p-8 shadow-sm ${
      editorTheme === 'dark'
        ? 'bg-zinc-900/40 border-zinc-800/80'
        : 'bg-white border-zinc-200/80 shadow-md'
    }`}>
      
      {/* Upper header block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-150/10">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>{isFr ? 'IA Révolutionnaire' : 'Revolutionary AI'}</span>
          </div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${
            editorTheme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
          }`}>
            {isFr ? 'Optimisation de Score ATS' : 'ATS Score Optimizer'}
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {isFr 
              ? 'Analysez la sémantique de votre CV par rapport aux moteurs de recrutement (ATS). Obtenez un score et des recommandations concrètes pour franchir le filtre des robots.'
              : 'Evaluate your resume structure and wording against Applicant Tracking Systems (ATS) filters to maximize your interview conversion rate.'}
          </p>
        </div>

        {/* Action Button */}
        {!loading && (
          <button
            onClick={triggerAnalysis}
            className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer self-start md:self-center"
          >
            {result ? (
              <>
                <RefreshCw className="w-4 h-4 animate-pulse" />
                <span>{isFr ? 'Relancer l\'analyse' : 'Re-run analysis'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-white/10" />
                <span>{isFr ? 'Lancer l\'analyse IA' : 'Analyze Resume'}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Loading state */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-16 text-center space-y-4"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-500 animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-xs">
              <h4 className={`text-base font-extrabold ${editorTheme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
                {isFr ? 'Analyse du CV par l\'IA...' : 'AI Analyzing...'}
              </h4>
              <p className="text-xs text-zinc-500">
                {isFr 
                  ? 'Évaluation sémantique des compétences et des mots-clés de l\'industrie.'
                  : 'Matching core technical keywords and formatting rules.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Error message */}
        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
              editorTheme === 'dark' ? 'bg-red-950/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-100 text-red-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-extrabold">{isFr ? 'Une erreur est survenue' : 'Error occured'}</p>
              <p className="font-medium mt-0.5 opacity-90">{error}</p>
              <button 
                onClick={triggerAnalysis}
                className="mt-3 text-xs font-bold underline cursor-pointer"
              >
                {isFr ? 'Réessayer' : 'Retry'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Initial prompt */}
        {!result && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border ${
              editorTheme === 'dark' ? 'bg-zinc-800/50 border-zinc-700/60 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
            }`}>
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className={`text-lg font-extrabold mb-1.5 ${editorTheme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>
              {isFr ? 'Votre diagnostic de recrutement instantané' : 'Instant Recruiting Diagnostic'}
            </h3>
            <p className="text-sm text-zinc-500 max-w-md mb-6 leading-relaxed">
              {isFr
                ? 'Cliquez sur le bouton ci-dessus pour envoyer le contenu de votre CV à l\'IA. Nous évaluerons vos chances de passer les filtres et générerons un guide étape par étape pour perfectionner votre CV.'
                : 'Send your cv data to our AI evaluator. We will test formatting guidelines, search for crucial skill gaps, and provide a detailed roadmap.'}
            </p>
            <button
              onClick={triggerAnalysis}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 text-sm font-bold rounded-xl transition-all cursor-pointer border dark:border-zinc-700 border-zinc-200"
            >
              {isFr ? 'Lancer le diagnostic maintenant' : 'Start Diagnostic'}
            </button>
          </motion.div>
        )}

        {/* Analysis Results Display */}
        {result && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 animate-fadeIn"
          >
            
            {/* Top Score Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Radial Score Gauge */}
              <div className="flex flex-col items-center justify-center text-center p-6 border rounded-2xl border-zinc-150/10">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                    {/* Background track */}
                    <circle
                      className={editorTheme === 'dark' ? 'stroke-zinc-800' : 'stroke-zinc-100'}
                      fill="transparent"
                      strokeWidth={stroke}
                      r={normalizedRadius}
                      cx="64"
                      cy="64"
                    />
                    {/* Animated foreground score circle */}
                    <motion.circle
                      className={getScoreBgCircle(result.score)}
                      fill="transparent"
                      strokeWidth={stroke}
                      strokeDasharray={circumference + ' ' + circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      r={normalizedRadius}
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                      {result.score}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                      Score ATS
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className={`text-base font-extrabold ${getScoreColor(result.score)}`}>
                    {result.score >= 75 
                      ? (isFr ? 'Excellent profil !' : 'Excellent Match!') 
                      : result.score >= 50 
                        ? (isFr ? 'Potentiel prometteur' : 'Good Potential') 
                        : (isFr ? 'Optimisation nécessaire' : 'Needs Optimization')}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {isFr ? 'Score basé sur les standards de l\'industrie.' : 'Based on real-world parsing criteria.'}
                  </p>
                </div>
              </div>

              {/* Keywords analysis block */}
              <div className="md:col-span-2 space-y-5 border rounded-2xl border-zinc-150/10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h4 className={`text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5`}>
                    <Bookmark className="w-4 h-4 text-emerald-500" />
                    <span>{isFr ? 'Mots-clés Validés' : 'Matching Keywords'}</span>
                  </h4>
                  {result.matchingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchingKeywords.map((kw, i) => (
                        <span 
                          key={i} 
                          className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                            editorTheme === 'dark' 
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' 
                              : 'bg-emerald-50/70 text-emerald-800 border-emerald-100'
                          }`}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-medium">
                      {isFr ? 'Aucun mot-clé majeur détecté. Enrichissez vos descriptifs d\'expérience.' : 'No major keywords found. Try detailing your achievements.'}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-150/10">
                  <h4 className={`text-sm font-extrabold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5`}>
                    <Award className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>{isFr ? 'Compétences recommandées (Manquantes)' : 'Recommended Skill Gaps'}</span>
                  </h4>
                  {result.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingKeywords.map((kw, i) => (
                        <span 
                          key={i} 
                          className={`text-xs px-2.5 py-1 rounded-lg border border-dashed font-bold transition-all ${
                            editorTheme === 'dark' 
                              ? 'bg-zinc-800/40 text-amber-400 border-amber-950/50 hover:bg-zinc-800' 
                              : 'bg-amber-50/40 text-amber-800 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-medium">
                      {isFr ? 'Excellent ! Votre vocabulaire technique couvre tous les prérequis.' : 'Amazing! Your vocabulary fits typical technical standards.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section-by-Section detailed Evaluations */}
            <div className="space-y-4">
              <h3 className={`text-base font-extrabold tracking-tight ${
                editorTheme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'
              }`}>
                {isFr ? 'Évaluation détaillée par section' : 'Section Breakdown Analysis'}
              </h3>

              <div className="space-y-3">
                {result.sectionEvaluations.map((sect, index) => (
                  <div 
                    key={index}
                    className={`border rounded-xl transition-all p-4 sm:p-5 ${
                      editorTheme === 'dark' ? 'border-zinc-800 bg-zinc-900/10' : 'border-zinc-200/60 bg-white'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sect.status)}
                        <span className={`font-extrabold text-sm ${
                          editorTheme === 'dark' ? 'text-zinc-100' : 'text-zinc-900'
                        }`}>
                          {sect.section}
                        </span>
                      </div>
                      
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusColorClass(sect.status)}`}>
                        {sect.status === 'good' ? (isFr ? 'Excellent' : 'Good') : sect.status === 'warning' ? (isFr ? 'À améliorer' : 'Warning') : (isFr ? 'Action requise' : 'Critical')}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium mb-3.5">
                      {sect.feedback}
                    </p>

                    {sect.suggestions.length > 0 && (
                      <div className="pt-3 border-t border-zinc-150/5 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                          <Sparkle className="w-3 h-3 fill-indigo-500/10" />
                          <span>{isFr ? 'Actions à mener :' : 'Actionable steps :'}</span>
                        </span>
                        <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-350">
                          {sect.suggestions.map((sug, idx) => (
                            <li key={idx} className="flex items-start gap-2 leading-normal">
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                              <span className="font-medium">{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* General Formatting Tips block */}
            <div className={`p-5 rounded-2xl border ${
              editorTheme === 'dark' 
                ? 'bg-blue-950/10 border-blue-900/30 text-blue-300' 
                : 'bg-blue-50/70 border-blue-100 text-blue-900'
            }`}>
              <h4 className="font-extrabold text-sm flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-200">
                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isFr ? 'Conseils de formatage pour passer les filtres ATS' : 'Format Rules for Robots'}</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
                {result.formattingTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-blue-850 dark:text-blue-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <span className="font-semibold">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
