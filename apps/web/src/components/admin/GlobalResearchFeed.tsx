import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ResearchItem } from '../../types';
import { ExternalLink, Database, Search } from 'lucide-react';

interface GlobalResearchFeedProps {
  reports: ResearchItem[];
}

export const GlobalResearchFeed: React.FC<GlobalResearchFeedProps> = ({ reports }) => {
  const [filter, setFilter] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30';
      case 'processing':
        return 'bg-accent-indigo/10 text-accent-indigo border-accent-indigo/30';
      case 'failed':
        return 'bg-accent-rose/10 text-accent-rose border-accent-rose/30';
      default:
        return 'bg-surface-raised text-primary-muted border-border-subtle';
    }
  };

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(filter.toLowerCase()) ||
      r.user_id.toLowerCase().includes(filter.toLowerCase())
  );

  if (reports.length === 0) {
    return (
      <div className="bg-surface border border-border-subtle rounded-2xl p-8 text-center text-primary-muted text-xs shadow-card">
        No platform research jobs recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-card transition-all">
      <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-bold text-primary tracking-tight">Platform Research Stream</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary-muted" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search reports or user ID..."
              className="pl-8 pr-3 py-1.5 text-xs bg-surface-raised border border-border-subtle rounded-lg text-primary placeholder:text-primary-muted focus:outline-none focus:border-border-prominent w-48 sm:w-56 transition"
            />
          </div>
          <span className="text-xs font-mono text-primary-muted whitespace-nowrap">
            {reports.length} RECORDS
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-raised text-primary-secondary font-mono text-[11px] border-b border-border-subtle">
            <tr>
              <th className="py-3 px-4">Idea Title</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-primary-secondary">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-surface-raised/50 transition">
                <td className="py-3.5 px-4 font-semibold text-primary max-w-xs truncate">
                  {item.title}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-primary-muted truncate max-w-[120px]">
                  {item.user_id}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-accent-emerald text-xs">
                  {item.data && typeof item.data === 'object' && item.data.viability_score !== undefined
                    ? `${item.data.viability_score}/100`
                    : '—'}
                </td>
                <td className="py-3.5 px-4 font-mono text-primary-muted text-[11px]">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/research/${item.id}`}
                    className="inline-flex items-center gap-1 text-accent-indigo hover:opacity-80 font-mono text-[11px]"
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
