import React from 'react';
import type { Competitor } from '../../types';
import { ExternalLink, ShieldAlert } from 'lucide-react';

interface CompetitorTableProps {
  competitors?: Competitor[];
}

export const CompetitorTable: React.FC<CompetitorTableProps> = ({ competitors = [] }) => {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="bg-surface border border-border-subtle rounded-2xl p-6 text-center text-primary-muted text-xs shadow-card">
        No direct competitor data extracted.
      </div>
    );
  }

  const getThreatBadge = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('high')) {
      return 'bg-accent-rose/10 text-accent-rose border-accent-rose/30';
    }
    if (l.includes('med')) {
      return 'bg-accent-amber/10 text-accent-amber border-accent-amber/30';
    }
    return 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30';
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-card transition-all">
      <div className="p-5 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary-secondary" />
          <h3 className="text-sm font-bold text-primary tracking-tight">Competitor Landscape</h3>
        </div>
        <span className="text-xs font-mono text-primary-muted">
          {competitors.length} INCUMBENT{competitors.length > 1 ? 'S' : ''} ANALYZED
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-raised text-primary-secondary font-mono text-[11px] border-b border-border-subtle">
            <tr>
              <th className="py-3 px-4">Competitor</th>
              <th className="py-3 px-4">Threat</th>
              <th className="py-3 px-4">Pricing</th>
              <th className="py-3 px-4">Strengths</th>
              <th className="py-3 px-4">Weaknesses</th>
              <th className="py-3 px-4">Your Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-primary-secondary">
            {competitors.map((comp, idx) => (
              <tr key={idx} className="hover:bg-surface-raised/60 transition">
                <td className="py-3.5 px-4 font-semibold text-primary">
                  <div className="flex items-center gap-1.5">
                    <span>{comp.name}</span>
                    {comp.url && (
                      <a
                        href={comp.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-muted hover:text-accent-emerald transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${getThreatBadge(comp.threat_level)}`}>
                    {comp.threat_level}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-primary text-[11px] whitespace-nowrap">
                  {comp.pricing || 'Custom / Contact'}
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <ul className="list-disc list-inside space-y-0.5 text-primary-secondary text-[11px]">
                    {comp.strengths?.slice(0, 2).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <ul className="list-disc list-inside space-y-0.5 text-accent-rose text-[11px]">
                    {comp.weaknesses?.slice(0, 2).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-3.5 px-4 text-accent-emerald text-[11px] font-medium max-w-xs">
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
