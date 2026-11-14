import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { researchApi } from '../api/research';
import type { ResearchItem } from '../types';
import { PipelineStepper } from '../components/research/PipelineStepper';
import { ViabilityGauge } from '../components/research/ViabilityGauge';
import { MarketSizeChart } from '../components/research/MarketSizeChart';
import { CompetitorTable } from '../components/research/CompetitorTable';
import { SwotGrid } from '../components/research/SwotGrid';
import { PainPointsList } from '../components/research/PainPointsList';
import { RiskMitigationMap } from '../components/research/RiskMitigationMap';
import { CitationsList } from '../components/research/CitationsList';
import {
  ArrowLeft,
  Sparkles,
  FileText,
  Calendar,
  RotateCcw,
  Loader2,
  Printer,
  Copy,
  Check,
  TrendingUp,
  BarChart2,
  ShieldAlert,
  Link2,
} from 'lucide-react';

export type DossierTab = 'overview' | 'market' | 'strategy' | 'sources';

export const ResearchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DossierTab>('overview');
  const [copied, setCopied] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      const data = await researchApi.getResearchDetail(id);
      setResearch(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load research report.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-primary-muted font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 animate-spin text-accent-emerald" />
          <span>Loading research session...</span>
        </div>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="bg-surface border border-accent-rose/30 p-8 rounded-2xl text-center max-w-md mx-auto space-y-4 shadow-card">
        <div className="text-accent-rose font-bold text-sm">Error Loading Research</div>
        <p className="text-primary-secondary text-xs">{error || 'Record not found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-raised hover:bg-surface border border-border-subtle text-primary rounded-lg text-xs font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Studio</span>
        </Link>
      </div>
    );
  }

  // If still processing or pending, show real-time SSE stepper
  if (research.status === 'pending' || research.status === 'processing') {
    return (
      <div className="py-8">
        <div className="mb-6">
          <Link
            to="/history"
            className="inline-flex items-center gap-1.5 text-xs text-primary-muted hover:text-primary font-mono transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Research Archive</span>
          </Link>
        </div>
        <PipelineStepper
          researchId={research.id}
          initialStep={research.current_step}
          initialProgress={research.progress}
          onCompleted={fetchDetail}
          onFailed={(err) => setError(err)}
        />
      </div>
    );
  }

  // If failed
  if (research.status === 'failed') {
    return (
      <div className="bg-surface border border-accent-rose/30 p-8 rounded-2xl max-w-lg mx-auto text-center space-y-4 shadow-card">
        <div className="text-accent-rose font-bold text-sm">Pipeline Execution Failed</div>
        <p className="text-primary-secondary text-xs">
          {research.error_message || 'The AI pipeline was unable to complete validation.'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-4 py-2 bg-accent-emerald hover:opacity-95 text-white font-bold rounded-lg text-xs transition"
          >
            Start New Research
          </Link>
          <button
            onClick={fetchDetail}
            className="px-4 py-2 bg-surface-raised hover:bg-surface text-primary border border-border-subtle rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
        </div>
      </div>
    );
  }

  // Completed Executive Report View
  const report = research.data;

  const tabs = [
    { id: 'overview', label: 'Overview & Verdict', icon: TrendingUp },
    { id: 'market', label: 'Market & Competition', icon: BarChart2 },
    { id: 'strategy', label: 'Strategy & Risks', icon: ShieldAlert },
    { id: 'sources', label: 'Sources & Evidence', icon: Link2 },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-3">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs text-primary-muted hover:text-primary font-mono transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Research Archive</span>
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono text-primary-muted mr-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(research.created_at).toLocaleDateString()}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy share link"
            className="px-2.5 py-1.5 rounded-lg bg-surface-raised border border-border-subtle hover:border-border-prominent text-primary text-xs font-medium flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            title="Export as PDF / Print"
            className="px-2.5 py-1.5 rounded-lg bg-surface-raised border border-border-subtle hover:border-border-prominent text-primary text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5 text-accent-indigo" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-card">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-[11px] font-mono text-accent-emerald font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>EXECUTIVE DOSSIER</span>
            </div>
            <span className="text-[11px] font-mono text-primary-muted">
              {report?.citations?.length || 0} Sources Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {research.title}
          </h1>
          <p className="text-xs sm:text-sm text-primary-secondary leading-relaxed max-w-3xl">
            {research.description}
          </p>

          {report?.verdict && (
            <div className="p-3.5 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-primary text-xs leading-relaxed flex items-start gap-2.5 mt-2">
              <span className="font-bold text-accent-emerald shrink-0 font-mono uppercase text-[11px] pt-0.5">
                VERDICT:
              </span>
              <span>{report.verdict}</span>
            </div>
          )}
        </div>
      </div>

      {/* Gliding Navigation Tabs via Motion */}
      <div className="flex items-center gap-1.5 border-b border-border-subtle overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as DossierTab)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-primary-secondary hover:text-primary hover:bg-surface-raised/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-dossier-tab"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.3 }}
                  className="absolute inset-0 bg-surface-raised border border-border-subtle rounded-xl shadow-sm -z-10"
                />
              )}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent-emerald' : 'text-primary-muted'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Tab 1: Overview & Verdict */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <ViabilityGauge score={report?.viability_score ?? 50} />
                </div>
                <div className="md:col-span-8">
                  {report?.summary && (
                    <div className="glass-card rounded-2xl p-6 h-full flex flex-col justify-between shadow-card">
                      <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
                          <FileText className="w-4 h-4 text-accent-emerald" />
                          <h3>Strategic Opportunity Summary</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-primary-secondary leading-relaxed whitespace-pre-line">
                          {report.summary}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-primary-muted flex items-center justify-between">
                        <span>Synthesized via Claude</span>
                        <span>100% Sourced</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Market & Competition */}
          {activeTab === 'market' && (
            <div className="space-y-6">
              <MarketSizeChart marketSize={report?.market_size} />
              <CompetitorTable competitors={report?.competitors} />
            </div>
          )}

          {/* Tab 3: Strategy & Risks */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <SwotGrid swot={report?.swot} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PainPointsList painPoints={report?.customer_pain_points} />
                <RiskMitigationMap risks={report?.key_risks} />
              </div>
            </div>
          )}

          {/* Tab 4: Sources & Evidence */}
          {activeTab === 'sources' && (
            <div className="space-y-6">
              <CitationsList citations={report?.citations} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
