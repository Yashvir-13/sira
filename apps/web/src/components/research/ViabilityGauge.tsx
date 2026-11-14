import React from 'react';

interface ViabilityGaugeProps {
  score: number;
}

export const ViabilityGauge: React.FC<ViabilityGaugeProps> = ({ score }) => {
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // Compute sub-factor indicators deterministically based on score
  const marketDemand = Math.min(Math.max(Math.round(normalizedScore * 0.95 + 4), 10), 100);
  const defensibility = Math.min(Math.max(Math.round(normalizedScore * 0.88 + 8), 10), 100);
  const executionReadiness = Math.min(Math.max(Math.round(normalizedScore * 1.05 - 3), 10), 100);

  const getTheme = (val: number) => {
    if (val >= 75) {
      return {
        badgeColor: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30',
        textColor: 'text-accent-emerald',
        barColor: 'bg-accent-emerald',
        label: 'HIGH CONVICTION',
      };
    }
    if (val >= 50) {
      return {
        badgeColor: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
        textColor: 'text-accent-amber',
        barColor: 'bg-accent-amber',
        label: 'MODERATE POTENTIAL',
      };
    }
    return {
      badgeColor: 'bg-accent-rose/10 text-accent-rose border-accent-rose/30',
      textColor: 'text-accent-rose',
      barColor: 'bg-accent-rose',
      label: 'HIGH RISK / PIVOT',
    };
  };

  const theme = getTheme(normalizedScore);

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col justify-between shadow-card transition-all h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-primary-muted uppercase tracking-wider">Viability Rating</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${theme.badgeColor}`}>
            {theme.label}
          </span>
        </div>

        <div className="flex items-baseline gap-1 my-2">
          <span className={`text-5xl font-extrabold tracking-tight ${theme.textColor}`}>
            {normalizedScore}
          </span>
          <span className="text-primary-muted text-sm font-medium">/ 100</span>
        </div>

        <div className="w-full bg-surface-raised border border-border-subtle rounded-full h-2.5 overflow-hidden mt-3 p-0.5">
          <div
            className={`${theme.barColor} h-full rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${normalizedScore}%` }}
          />
        </div>
      </div>

      {/* Sub-factor Metrics */}
      <div className="mt-6 pt-4 border-t border-border-subtle space-y-2.5">
        <div>
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-primary-secondary">Market Demand</span>
            <span className="text-primary font-bold">{marketDemand}%</span>
          </div>
          <div className="w-full bg-surface-raised rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent-indigo h-full rounded-full" style={{ width: `${marketDemand}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-primary-secondary">Defensibility & Moat</span>
            <span className="text-primary font-bold">{defensibility}%</span>
          </div>
          <div className="w-full bg-surface-raised rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent-amber h-full rounded-full" style={{ width: `${defensibility}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-primary-secondary">Execution Feasibility</span>
            <span className="text-primary font-bold">{executionReadiness}%</span>
          </div>
          <div className="w-full bg-surface-raised rounded-full h-1.5 overflow-hidden">
            <div className="bg-accent-emerald h-full rounded-full" style={{ width: `${executionReadiness}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
