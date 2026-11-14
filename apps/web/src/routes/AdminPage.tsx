import { useEffect, useState } from 'react';
import { researchApi } from '../api/research';
import type { ResearchItem } from '../types';
import { KpiCards } from '../components/admin/KpiCards';
import { GlobalResearchFeed } from '../components/admin/GlobalResearchFeed';
import { UserRoster } from '../components/admin/UserRoster';
import { Shield, Database, Users, Loader2 } from 'lucide-react';

export const AdminPage = () => {
  const [reports, setReports] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'roster'>('feed');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await researchApi.getAllResearchAdmin();
        setReports(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to retrieve admin telemetry.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">System Administration</h1>
          </div>
          <p className="text-xs text-zinc-400">
            Platform-wide research telemetry, user role enforcement, and system metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#12131c] border border-zinc-800 p-1 rounded-lg self-start md:self-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'feed'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Research Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'roster'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Roster</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 font-mono text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Polling platform telemetry...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      ) : (
        <>
          {/* KPI Summary Cards */}
          <KpiCards reports={reports} />

          {/* Tab Views */}
          {activeTab === 'feed' ? (
            <GlobalResearchFeed reports={reports} />
          ) : (
            <UserRoster />
          )}
        </>
      )}
    </div>
  );
};
