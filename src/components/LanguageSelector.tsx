import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCVData } from '../hooks/useCVData';
import { Language } from '../i18n/translations';
import { Globe, ChevronDown } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  let cvDataHook: any = null;
  try {
    cvDataHook = useCVData();
  } catch {
    // optional outside provider
  }

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    if (cvDataHook?.loadLanguagePreset) {
      cvDataHook.loadLanguagePreset(code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/80 hover:bg-zinc-50 transition-all font-medium text-xs text-zinc-800 shadow-2xs ${
          compact ? 'px-2.5 py-1' : 'px-3 py-1.5'
        }`}
        title="Changer de langue / Switch language"
      >
        <span className="text-sm leading-none">{currentLangObj.flag}</span>
        <span className="uppercase font-bold tracking-wider">{currentLangObj.code}</span>
        <ChevronDown className="w-3 h-3 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border border-zinc-200 bg-white/95 backdrop-blur-md shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 mb-1">
            Langue / Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium transition-colors ${
                language === lang.code
                  ? 'bg-zinc-100 text-[#0a0a0a] font-bold'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {language === lang.code && <span className="text-[#ff2d8d] text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
