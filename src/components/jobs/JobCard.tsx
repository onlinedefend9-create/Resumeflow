import React from 'react';
import { Building2, MapPin, Star, Briefcase, Download, CheckCircle2 } from 'lucide-react';
import { UnifiedJob } from './types';

interface JobCardProps {
  job: UnifiedJob;
  onDetailsClick: () => void;
  onAdapterClick: () => void;
  onImportClick?: () => void;
  isImporting?: boolean;
  isImportSuccess?: boolean;
  isExternal?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onDetailsClick,
  onAdapterClick,
  onImportClick,
  isImporting = false,
  isImportSuccess = false,
  isExternal = false,
}) => {
  // Determine source color badge
  const getSourceBadgeStyles = (source?: string) => {
    switch (source) {
      case 'Glassdoor':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/30';
      case 'Adzuna':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/30';
      case 'Jooble':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/30';
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/30';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Badges Line */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isExternal && job.source ? (
              <span className={`inline-block px-2.5 py-1 text-[10px] font-extrabold tracking-wide uppercase rounded-md ${getSourceBadgeStyles(job.source)}`}>
                {job.source}
              </span>
            ) : null}
            
            <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
              {job.contract_type}
            </span>

            {job.experience_level && (
              <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {job.experience_level}
              </span>
            )}
          </div>

          {job.is_remote && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-md bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400">
              Remote
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors line-clamp-1">
          {job.title}
        </h3>

        {/* Company and Rating */}
        <div className="flex items-center justify-between mt-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Building2 className="w-3.5 h-3.5" />
            <span className="font-semibold">{job.company}</span>
          </div>
          {isExternal && job.company_rating && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{job.company_rating}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{job.city}{job.region ? `, ${job.region}` : ''} {job.country ? `(${job.country})` : ''}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Salary */}
        {job.salary && (
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100/60 dark:bg-zinc-800 px-3 py-1.5 rounded-lg inline-block mb-4">
            💰 Salaire : {job.salary}
          </div>
        )}

        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.skills.slice(0, 4).map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-2 py-1 text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg border border-zinc-200/40 dark:border-zinc-700/45"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-1 text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onDetailsClick}
            className="w-full text-center text-xs font-semibold py-2.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl transition"
          >
            Détails
          </button>
          <button
            onClick={onAdapterClick}
            className="w-full flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 rounded-xl transition"
          >
            <Briefcase className="w-3.5 h-3.5" />
            Adapter CV
          </button>
        </div>

        {/* Import button for external jobs */}
        {isExternal && onImportClick && (
          <button
            onClick={onImportClick}
            disabled={isImporting}
            className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              isImportSuccess
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800/40'
                : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200'
            }`}
          >
            {isImporting ? (
              <span className="w-3.5 h-3.5 border-2 border-zinc-800 dark:border-zinc-200 border-t-transparent rounded-full animate-spin" />
            ) : isImportSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>
              {isImportSuccess ? "Importé avec succès !" : "Importer sur mon Espace"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
