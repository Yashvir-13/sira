import { Link } from 'react-router-dom';
import type { ResearchItem } from '../../types';
import { ExternalLink, Database } from 'lucide-react';

interface GlobalResearchFeedProps {
  reports: ResearchItem[];
}

export const GlobalResearchFeed = ({ reports }: GlobalResearchFeedProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'processing':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'failed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-xs">
        No platform research jobs recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Platform Research Stream</h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {reports.length} TOTAL RECORDS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0b0c12] text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Idea Title</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {reports.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-900/40 transition">
                <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                  {item.title}
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-500 text-[11px]">
                  {item.user_id.slice(0, 8)}...
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                  {item.data?.viability_score !== undefined ? `${item.data.viability_score}/100` : '—'}
                </td>
                <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/research/${item.id}`}
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-emerald-400 font-mono text-xs transition"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
