import type { CustomerPainPoint } from '../../types';
import { MessageSquareWarning } from 'lucide-react';

interface PainPointsListProps {
  painPoints?: CustomerPainPoint[];
}

export const PainPointsList = ({ painPoints = [] }: PainPointsListProps) => {
  if (!painPoints || painPoints.length === 0) return null;

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareWarning className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-bold text-white tracking-tight">Customer Friction & Unmet Needs</h3>
      </div>

      <div className="space-y-3">
        {painPoints.map((item, idx) => (
          <div key={idx} className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-lg">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <span className="text-xs font-semibold text-zinc-200">{item.pain}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-zinc-900 border-zinc-700 text-zinc-300 shrink-0">
                SEVERITY: {item.severity.toUpperCase()}
              </span>
            </div>
            {item.current_workaround && (
              <div className="text-[11px] text-zinc-400">
                <span className="text-zinc-500 font-mono">Current Workaround: </span>
                {item.current_workaround}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
