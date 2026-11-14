import React from 'react';
import type { KeyRisk } from '../../types';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RiskMitigationMapProps {
  risks?: KeyRisk[];
}

export const RiskMitigationMap: React.FC<RiskMitigationMapProps> = ({ risks = [] }) => {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-card transition-all">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-4 h-4 text-accent-rose" />
        <h3 className="text-sm font-bold text-primary tracking-tight">Key Operational Risks & Mitigations</h3>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div key={idx} className="p-3.5 bg-surface-raised border border-border-subtle rounded-xl space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/30 shrink-0 mt-0.5 font-semibold">
                RISK
              </span>
              <span className="text-xs text-primary font-medium">{item.risk}</span>
            </div>
            <div className="flex items-start gap-2 pl-2 border-l border-accent-emerald/30">
              <CheckCircle className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />
              <div className="text-[11px] text-primary-secondary leading-relaxed">
                <span className="font-semibold text-accent-emerald">Mitigation: </span>
                {item.mitigation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
