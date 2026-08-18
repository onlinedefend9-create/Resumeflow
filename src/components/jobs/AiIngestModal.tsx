import React from 'react';
import { Sparkles, X, Zap, CheckCircle2 } from 'lucide-react';

interface SampleOffer {
  label: string;
  text: string;
}

interface AiIngestModalProps {
  onClose: () => void;
  rawText: string;
  setRawText: (text: string) => void;
  onIngest: () => void;
  isProcessing: boolean;
  ingestSuccess: boolean;
  sampleOffers: SampleOffer[];
}

export const AiIngestModal: React.FC<AiIngestModalProps> = ({
  onClose,
  rawText,
  setRawText,
  onIngest,
  isProcessing,
  ingestSuccess,
  sampleOffers,
}) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 text-white shadow-2xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Sparkles className="w-48 h-48" />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            Moteur de Structuration Intelligent (AI Ingest)
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Collez n'importe quel texte brut de fiche de poste (depuis LinkedIn, Rekrute, Indeed ou un email). Notre IA structure instantanément l'offre.
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Exemples rapides */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-zinc-500 block mb-2">Tester rapidement avec un exemple :</span>
        <div className="flex flex-wrap gap-2">
          {sampleOffers.map((sample, sIdx) => (
            <button
              key={sIdx}
              onClick={() => {
                setRawText(sample.text);
              }}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl border border-zinc-700/50 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Collez l'offre d'emploi textuelle ici..."
        className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
      />

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Propulsé par Phi-3.5 Local Engine & Gemini</span>
        </div>
        <div className="flex items-center gap-3">
          {ingestSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Offre publiée avec succès !
            </span>
          )}
          <button
            onClick={onIngest}
            disabled={isProcessing || !rawText.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 active:scale-95"
          >
            {isProcessing ? 'Traitement par l\'IA...' : 'Structurer & Publier'}
          </button>
        </div>
      </div>
    </div>
  );
};
