import type { SwotAnalysis } from '../../types';
import { Shield, AlertTriangle, TrendingUp, Skull } from 'lucide-react';

interface SwotGridProps {
  swot?: SwotAnalysis;
}

export const SwotGrid = ({ swot }: SwotGridProps) => {
  if (!swot) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-emerald-400">
          <Shield className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Strengths & Moats</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {swot.strengths?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Internal Weaknesses</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {swot.weaknesses?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-indigo-400">
          <TrendingUp className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Market Opportunities</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {swot.opportunities?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-rose-400">
          <Skull className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">External Threats</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {swot.threats?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
