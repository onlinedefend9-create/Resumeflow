import React from 'react';
import { TrendingUp, Globe, MapPin } from 'lucide-react';

interface StatsDashboardProps {
  totalJobsCount: number;
  remoteJobsCount: number;
  regionsCount: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  totalJobsCount,
  remoteJobsCount,
  regionsCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-2">
      {/* Active local jobs */}
      <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Offres Actives Localement</span>
          <p className="text-xl font-extrabold text-[#0a0a0a] dark:text-white mt-0.5">{totalJobsCount}</p>
        </div>
      </div>

      {/* Remote jobs */}
      <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Postes Remote / En Ligne</span>
          <p className="text-xl font-extrabold text-[#0a0a0a] dark:text-white mt-0.5">{remoteJobsCount}</p>
        </div>
      </div>

      {/* Regions count */}
      <div className="bg-zinc-50/50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Régions Couvertes</span>
          <p className="text-xl font-extrabold text-[#0a0a0a] dark:text-white mt-0.5">{regionsCount}</p>
        </div>
      </div>
    </div>
  );
};
