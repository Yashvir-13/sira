import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { researchApi } from '../api/research';
import type { ResearchItem } from '../types';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { History, PlusCircle, ArrowRight, Calendar, Loader2, Search, Trash2 } from 'lucide-react';

export const HistoryPage = () => {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemToDelete, setItemToDelete] = useState<ResearchItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await researchApi.getResearchHistory();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch research history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await researchApi.deleteResearch(itemToDelete.id);
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setItemToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete research:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/30';
      case 'processing':
        return 'bg-accent-indigo/10 text-accent-indigo border-accent-indigo/30';
      case 'cancelled':
        return 'bg-accent-amber/10 text-accent-amber border-accent-amber/30';
      case 'failed':
        return 'bg-accent-rose/10 text-accent-rose border-accent-rose/30';
      default:
        return 'bg-surface-raised text-primary-muted border-border-subtle';
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-accent-emerald" />
            <h1 className="text-xl font-bold text-primary tracking-tight">Research Archive</h1>
          </div>
          <p className="text-xs text-primary-secondary">
            Past venture intelligence dossiers and market validation analyses.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {items.length > 0 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-primary-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search past dossiers..."
                className="pl-8 pr-3 py-1.5 text-xs bg-surface-raised border border-border-subtle rounded-lg text-primary placeholder:text-primary-muted focus:outline-none focus:border-border-prominent w-48 sm:w-56 transition"
              />
            </div>
          )}

          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Research</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-primary-muted font-mono text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>Retrieving past dossiers...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-center justify-between shadow-card">
          <span>{error}</span>
          <button
            onClick={fetchHistory}
            className="px-3 py-1 bg-surface hover:bg-surface-raised text-primary border border-border-subtle rounded font-semibold text-xs transition"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface border border-border-subtle rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-card">
          <div className="w-10 h-10 rounded-full bg-surface-raised border border-border-subtle flex items-center justify-center mx-auto text-primary-muted">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary mb-1">No research conducted yet</h3>
            <p className="text-xs text-primary-secondary">
              Submit your first startup idea to see live competitive analysis, market sizing, and viability scores.
            </p>
          </div>
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <span>Launch First Research</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const score = item.data && typeof item.data === 'object' ? item.data.viability_score : undefined;
              const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString() : '';
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-surface border border-border-subtle hover:border-border-prominent rounded-2xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card hover:-translate-y-0.5 duration-200"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                      {score !== undefined && (
                        <span className="text-xs font-mono font-bold text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full border border-accent-emerald/20">
                          SCORE: {score}/100
                        </span>
                      )}
                      {formattedDate && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-primary-muted">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-primary tracking-tight truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-primary-secondary line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/research/${item.id}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-raised hover:bg-surface text-primary rounded-lg border border-border-subtle hover:border-border-prominent text-xs font-semibold transition"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary-muted" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      title="Delete Dossier"
                      className="p-2 rounded-lg text-primary-muted hover:text-accent-rose hover:bg-accent-rose/10 border border-border-subtle hover:border-accent-rose/30 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        title={itemToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
