import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { MarketSize } from '../../types';
import { TrendingUp } from 'lucide-react';

interface MarketSizeChartProps {
  marketSize?: MarketSize;
}

export const MarketSizeChart = ({ marketSize }: MarketSizeChartProps) => {
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
      color: '#4f46e5', // indigo-600
    },
    {
      name: 'SAM',
      label: 'Serviceable Addressable',
      value: samNum,
      formatted: marketSize?.sam?.value || `$${samNum}B`,
      color: '#6366f1', // indigo-500
    },
    {
      name: 'SOM',
      label: 'Serviceable Obtainable (Y1-Y3)',
      value: somNum,
      formatted: marketSize?.som?.value || `$${somNum}B`,
      color: '#10b981', // emerald-500
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#0e1017] border border-zinc-700/80 p-3 rounded-lg shadow-xl text-xs font-mono">
          <div className="font-bold text-white mb-0.5">{item.name}</div>
          <div className="text-zinc-400 text-[11px] mb-1.5">{item.label}</div>
          <div className="text-emerald-400 font-bold text-sm">{item.formatted}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Market Opportunity ({unit})
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">TAM &bull; SAM &bull; SOM</span>
        </div>
        {cagr && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>CAGR: {cagr}</span>
          </div>
        )}
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis type="number" stroke="#52525b" fontSize={10} fontStyle="italic" hide />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#a1a1aa"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/80 text-center font-mono">
        <div>
          <span className="text-[10px] text-zinc-500 block">TAM</span>
          <span className="text-xs font-bold text-zinc-200">{marketSize?.tam?.value || `$${tamNum}B`}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 block">SAM</span>
          <span className="text-xs font-bold text-zinc-200">{marketSize?.sam?.value || `$${samNum}B`}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 block">SOM (Y1-3)</span>
          <span className="text-xs font-bold text-emerald-400">{marketSize?.som?.value || `$${somNum}B`}</span>
        </div>
      </div>
    </div>
  );
};
