import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { MarketSize } from '../../types';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext';

interface MarketSizeChartProps {
  marketSize?: MarketSize;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-surface border border-border-prominent p-3 rounded-xl shadow-card text-xs font-mono">
        <div className="font-bold text-primary mb-0.5">{item.name}</div>
        <div className="text-primary-secondary text-[11px] mb-1.5">{item.label}</div>
        <div className="text-accent-emerald font-bold text-sm">{item.formatted}</div>
      </div>
    );
  }
  return null;
};

export const MarketSizeChart: React.FC<MarketSizeChartProps> = ({ marketSize }) => {
  const { theme } = useTheme();
  const tamNum = marketSize?.tam?.numeric ?? 0;
  const samNum = marketSize?.sam?.numeric ?? 0;
  const somNum = marketSize?.som?.numeric ?? 0;
  const unit = marketSize?.unit || 'USD Billions';
  const cagr = marketSize?.cagr || '18.5%';

  const data = [
    {
      name: 'TAM',
      label: 'Total Addressable Market',
      value: tamNum,
      formatted: marketSize?.tam?.value || `$${tamNum}B`,
      color: theme === 'dark' ? '#6366F1' : '#4F46E5',
    },
    {
      name: 'SAM',
      label: 'Serviceable Addressable Market',
      value: samNum,
      formatted: marketSize?.sam?.value || `$${samNum}B`,
      color: theme === 'dark' ? '#818CF8' : '#6366F1',
    },
    {
      name: 'SOM',
      label: 'Serviceable Obtainable Market (Y1-Y3)',
      value: somNum,
      formatted: marketSize?.som?.value || `$${somNum}B`,
      color: theme === 'dark' ? '#10B981' : '#059669',
    },
  ];

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col justify-between shadow-card transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono text-primary-muted uppercase tracking-wider block">
            Market Opportunity ({unit})
          </span>
          <span className="text-[11px] text-primary-secondary font-mono">TAM &bull; SAM &bull; SOM Breakdown</span>
        </div>
        {cagr && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-xs font-mono text-accent-emerald font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>CAGR: {cagr}</span>
          </div>
        )}
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              stroke={theme === 'dark' ? '#94A3B8' : '#475569'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border-subtle text-center font-mono">
        <div className="p-2 rounded-lg bg-surface-raised">
          <span className="text-[10px] text-primary-muted block">TAM</span>
          <span className="text-xs font-bold text-primary">{marketSize?.tam?.value || `$${tamNum}B`}</span>
        </div>
        <div className="p-2 rounded-lg bg-surface-raised">
          <span className="text-[10px] text-primary-muted block">SAM</span>
          <span className="text-xs font-bold text-primary">{marketSize?.sam?.value || `$${samNum}B`}</span>
        </div>
        <div className="p-2 rounded-lg bg-surface-raised">
          <span className="text-[10px] text-primary-muted block">SOM (Y1-3)</span>
          <span className="text-xs font-bold text-accent-emerald">{marketSize?.som?.value || `$${somNum}B`}</span>
        </div>
      </div>
    </div>
  );
};
