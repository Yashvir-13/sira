interface ViabilityGaugeProps {
  score: number;
}

export const ViabilityGauge = ({ score }: ViabilityGaugeProps) => {
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  const getTheme = (val: number) => {
    if (val >= 75) {
      return {
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        textColor: 'text-emerald-400',
        barColor: 'bg-emerald-500',
        label: 'HIGH CONVICTION',
      };
    }
    if (val >= 50) {
      return {
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        textColor: 'text-amber-400',
        barColor: 'bg-amber-500',
        label: 'MODERATE POTENTIAL',
      };
    }
    return {
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      textColor: 'text-rose-400',
      barColor: 'bg-rose-500',
      label: 'HIGH RISK / PIVOT',
    };
  };

  const theme = getTheme(normalizedScore);

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Viability Score</span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${theme.badgeColor}`}>
          {theme.label}
        </span>
      </div>

      <div className="flex items-baseline gap-1 my-2">
        <span className={`text-4xl font-extrabold tracking-tight ${theme.textColor}`}>
          {normalizedScore}
        </span>
        <span className="text-zinc-500 text-sm font-medium">/ 100</span>
      </div>

      <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-full h-2 overflow-hidden mt-2 p-0.5">
        <div
          className={`${theme.barColor} h-full rounded-full transition-all duration-1000`}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
};
