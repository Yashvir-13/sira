import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { researchApi } from '../api/research';
import type { ResearchItem } from '../types';
import { History, PlusCircle, ArrowRight, Calendar, Loader2 } from 'lucide-react';

export const HistoryPage = () => {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await researchApi.getResearchHistory();
        setItems(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch research history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Research Archive</h1>
          </div>
          <p className="text-xs text-zinc-400">
            Past venture intelligence dossiers and market validation analyses.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-bold transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Research</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 font-mono text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Retrieving past dossiers...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#10121a] border border-zinc-800 rounded-xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">No research conducted yet</h3>
            <p className="text-xs text-zinc-400">
              Submit your first startup idea to see live competitive analysis, market sizing, and viability scores.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded text-xs font-bold transition"
          >
            <span>Launch First Research</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => {
            const score = item.data?.viability_score;
            return (
              <div
                key={item.id}
                className="bg-[#12131c] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    {score !== undefined && (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        SCORE: {score}/100
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <Link
                  to={`/research/${item.id}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-lg border border-zinc-800 text-xs font-semibold shrink-0 transition"
                >
                  <span>View Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
