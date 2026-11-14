import type { Competitor } from '../../types';
import { ExternalLink, ShieldAlert } from 'lucide-react';

interface CompetitorTableProps {
  competitors?: Competitor[];
}

export const CompetitorTable = ({ competitors = [] }: CompetitorTableProps) => {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-6 text-center text-zinc-500 text-xs">
        No direct competitor data extracted.
      </div>
    );
  }

  const getThreatBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('high')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
    if (l.includes('med')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  };

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Competitor Landscape</h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {competitors.length} INCUMBENT{competitors.length > 1 ? 'S' : ''} ANALYZED
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0b0c12] text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Competitor</th>
              <th className="py-3 px-4">Threat</th>
              <th className="py-3 px-4">Pricing</th>
              <th className="py-3 px-4">Strengths</th>
              <th className="py-3 px-4">Weaknesses</th>
              <th className="py-3 px-4">Your Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {competitors.map((comp, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/40 transition">
                <td className="py-3.5 px-4 font-semibold text-white">
                  <div className="flex items-center gap-1.5">
                    <span>{comp.name}</span>
                    {comp.url && (
                      <a
                        href={comp.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-emerald-400 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getThreatBadge(comp.threat_level)}`}>
                    {comp.threat_level}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-300 text-[11px] whitespace-nowrap">
                  {comp.pricing || 'Custom / Contact'}
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[11px]">
                    {comp.strengths?.slice(0, 2).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <ul className="list-disc list-inside space-y-0.5 text-rose-300/80 text-[11px]">
                    {comp.weaknesses?.slice(0, 2).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5 px-4 text-emerald-400 text-[11px] font-medium max-w-xs">
                  {comp.differentiation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
