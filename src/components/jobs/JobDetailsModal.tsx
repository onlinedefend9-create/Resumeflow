import React, { useEffect } from 'react';
import { X, Building2, MapPin, Award, ExternalLink, FileText } from 'lucide-react';
import { UnifiedJob } from './types';

interface JobDetailsModalProps {
  job: UnifiedJob;
  onClose: () => void;
  onAdapterClick: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onAdapterClick,
}) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity" 
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Modal Content Box - Ensure fluid scrolling with max-h and overflow-y-auto */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl text-left shadow-2xl transform transition-all my-8 max-w-2xl w-full border border-zinc-200/80 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        
        {/* Header - Fixed */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {job.source && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded">
                  {job.source}
                </span>
              )}
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded">
                {job.contract_type}
              </span>
              {job.is_remote && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded">
                  Remote
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white" id="modal-title">
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
              <Building2 className="w-4 h-4" />
              {job.company}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow scrollbar-thin">
          {/* Meta details */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-700/30">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Lieu</span>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {job.city}{job.region ? `, ${job.region}` : ''} ({job.country || 'MA'})
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Niveau d'Expérience</span>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-zinc-400" />
                {job.experience_level || "Junior / Mid"}
              </span>
            </div>
          </div>

          {/* Salary (if present) */}
          {job.salary && (
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30 text-amber-900 dark:text-amber-300 text-xs font-bold">
              💰 Budget / Rémunération estimée : {job.salary}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Description du poste</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">Compétences recherchées</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, sIdx: number) => (
                  <span 
                    key={sIdx}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl text-zinc-700 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row gap-3 justify-between items-center flex-shrink-0">
          {/* External redirect link if from API */}
          {job.source_url ? (
            <a
              href={job.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              Voir l'offre originale sur {job.source}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div />
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-all text-center"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={onAdapterClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-zinc-950/10 active:scale-95"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              Adapter mon CV avec l'IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
