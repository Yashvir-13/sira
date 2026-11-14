import { Users, FileSearch, CheckCircle, Cpu } from 'lucide-react';
import type { ResearchItem } from '../../types';

interface KpiCardsProps {
  reports: ResearchItem[];
}

export const KpiCards = ({ reports }: KpiCardsProps) => {
  const totalReports = reports.length;
  const completed = reports.filter((r) => r.status === 'completed').length;
  const successRate = totalReports > 0 ? Math.round((completed / totalReports) * 100) : 100;

  // Extract unique user IDs
  const uniqueUsers = new Set(reports.map((r) => r.user_id)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1 */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Active Users</span>
          <Users className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{Math.max(uniqueUsers, 1)}</div>
        <div className="text-[11px] text-zinc-500 mt-1">Platform members & founders</div>
      </div>

      {/* Metric 2 */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Total Researches</span>
          <FileSearch className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold text-white font-mono">{totalReports}</div>
        <div className="text-[11px] text-zinc-500 mt-1">Idea validation jobs initiated</div>
      </div>

      {/* Metric 3 */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Pipeline Reliability</span>
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-emerald-400 font-mono">{successRate}%</div>
        <div className="text-[11px] text-zinc-500 mt-1">{completed} of {totalReports} completed</div>
      </div>

      {/* Metric 4 */}
      <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider">Subsystems</span>
          <Cpu className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-sm font-bold text-white font-mono mt-1">4 ENGINES ONLINE</div>
        <div className="text-[11px] text-zinc-500 mt-1">SearXNG &bull; Jev &bull; Crawl4AI &bull; Claude</div>
      </div>
    </div>
  );
};
