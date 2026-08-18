import React from 'react';
import { Search } from 'lucide-react';

interface JobFiltersBarProps {
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  selectedRegion: string;
  onRegionChange: (val: string) => void;
  selectedContract: string;
  onContractChange: (val: string) => void;
  selectedCountry: string;
  onCountryChange: (val: string) => void;
  sortBy: string;
  onSortByChange: (val: string) => void;
}

export const JobFiltersBar: React.FC<JobFiltersBarProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedRegion,
  onRegionChange,
  selectedContract,
  onContractChange,
  selectedCountry,
  onCountryChange,
  sortBy,
  onSortByChange,
}) => {
  return (
    <div className="space-y-6 mb-8">
      {/* Search Input, Region Select, Contract Select, Sort Select */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search bar */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher un poste, une entreprise, des mots-clés ou compétences..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-medium"
            />
          </div>

          {/* Region dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-semibold"
            >
              <option value="">Régions (Toutes)</option>
              <option value="Casablanca-Settat">Casablanca-Settat</option>
              <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
              <option value="Fès-Meknès">Fès-Meknès</option>
              <option value="Tanger-Tétouan-Al Hoceïma">Tanger-Tétouan-Al Hoceïma</option>
              <option value="Marrakech-Safi">Marrakech-Safi</option>
              <option value="Île-de-France">Île-de-France</option>
            </select>
          </div>

          {/* Contract dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedContract}
              onChange={(e) => onContractChange(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-semibold"
            >
              <option value="">Contrats (Tous)</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Freelance">Freelance</option>
              <option value="Stage">Stage</option>
              <option value="Remote">Télétravail</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-900 transition-all text-sm font-semibold"
            >
              <option value="recent">Trier par : Plus récent / Pertinence</option>
              <option value="salaryDesc">Salaire : Décroissant 💰</option>
              <option value="salaryAsc">Salaire : Croissant 💸</option>
            </select>
          </div>

        </div>
      </div>

      {/* Country Filters Group */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: '🌍 Tous les pays' },
          { id: 'MA', label: '🇲🇦 Maroc' },
          { id: 'FR', label: '🇫🇷 France' },
          { id: 'CA', label: '🇨🇦 Canada' },
          { id: 'INTL', label: '✈️ Hors Maroc (International)' },
        ].map((country) => (
          <button
            key={country.id}
            onClick={() => onCountryChange(country.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
              selectedCountry === country.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {country.label}
          </button>
        ))}
      </div>
    </div>
  );
};
