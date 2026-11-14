import type { Citation } from '../../types';
import { Link2, ExternalLink } from 'lucide-react';

interface CitationsListProps {
  citations?: Citation[];
}

export const CitationsList = ({ citations = [] }: CitationsListProps) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Verified Sources & Footnotes</h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {citations.length} SOURCE{citations.length > 1 ? 'S' : ''} CITED
        </span>
      </div>

      <div className="space-y-2.5">
        {citations.map((cite, idx) => (
          <div
            key={idx}
            className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-zinc-200">{cite.title}</div>
              <div className="text-[11px] text-zinc-400 italic">"{cite.relevant_claim}"</div>
            </div>
            {cite.url && (
              <a
                href={cite.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white shrink-0 font-mono transition"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
