import { useEffect, useState } from 'react';
import { researchApi } from '../api/research';
import type { ResearchItem } from '../types';
import { KpiCards } from '../components/admin/KpiCards';
import { GlobalResearchFeed } from '../components/admin/GlobalResearchFeed';
import { UserRoster } from '../components/admin/UserRoster';
import { BrandedPageLoader } from '../components/common/BrandedPageLoader';
import { Shield, Database, Users } from 'lucide-react';

export const AdminPage = () => {
  const [reports, setReports] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'roster'>('feed');

  useEffect(() => {
    let isMounted = true;
    const fetchAdminData = async () => {
      try {
        const data = await researchApi.getAllResearchAdmin();
        if (isMounted) setReports(data);
      } catch (err: any) {
        if (isMounted) setError(err.response?.data?.detail || 'Failed to retrieve admin telemetry.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-border-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-accent-amber" />
            <h1 className="text-xl font-bold text-primary tracking-tight">System Administration</h1>
          </div>
          <p className="text-xs text-primary-secondary">
            Platform-wide research telemetry, user role enforcement, and system health metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-surface-raised border border-border-subtle p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'feed'
                ? 'bg-surface text-primary shadow-sm border border-border-subtle'
                : 'text-primary-secondary hover:text-primary'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Research Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'roster'
                ? 'bg-surface text-primary shadow-sm border border-border-subtle'
                : 'text-primary-secondary hover:text-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Roster</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16">
          <BrandedPageLoader
            label="RETRIEVING PLATFORM TELEMETRY..."
            sublabel="Querying institutional dossiers, system health, and role access"
          />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs shadow-card">
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
