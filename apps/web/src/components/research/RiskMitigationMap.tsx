import type { KeyRisk } from '../../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RiskMitigationMapProps {
  risks?: KeyRisk[];
}

export const RiskMitigationMap = ({ risks = [] }: RiskMitigationMapProps) => {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-rose-400" />
        <h3 className="text-sm font-bold text-white tracking-tight">Key Operational Risks & Mitigations</h3>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div key={idx} className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
                RISK
              </span>
              <span className="text-xs text-zinc-200 font-medium">{item.risk}</span>
            </div>
            <div className="flex items-start gap-2 pl-2 border-l border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-300/90 leading-relaxed">
                <span className="font-semibold text-emerald-400">Mitigation: </span>
                {item.mitigation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
