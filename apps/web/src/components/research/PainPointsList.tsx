import React from 'react';
import type { CustomerPainPoint } from '../../types';
import { MessageSquareWarning } from 'lucide-react';

interface PainPointsListProps {
  painPoints?: CustomerPainPoint[];
}

export const PainPointsList: React.FC<PainPointsListProps> = ({ painPoints = [] }) => {
  if (!painPoints || painPoints.length === 0) return null;

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-card transition-all">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareWarning className="w-4 h-4 text-accent-amber" />
        <h3 className="text-sm font-bold text-primary tracking-tight">Customer Friction & Unmet Needs</h3>
      </div>

      <div className="space-y-3">
        {painPoints.map((item, idx) => (
          <div key={idx} className="p-3.5 bg-surface-raised border border-border-subtle rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <span className="text-xs font-semibold text-primary">{item.pain}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-surface border-border-subtle text-primary-secondary shrink-0 font-medium">
                {item.severity.toUpperCase()}
              </span>
            </div>
            {item.current_workaround && (
              <div className="text-[11px] text-primary-secondary">
                <span className="text-primary-muted font-mono">Current Workaround: </span>
                {item.current_workaround}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
