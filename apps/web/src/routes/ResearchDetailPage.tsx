import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { ArrowLeft, Sparkles, FileText, Calendar, RotateCcw, Loader2 } from 'lucide-react';

export const ResearchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [research, setResearch] = useState<ResearchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-zinc-400 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading research session...</span>
        </div>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="bg-[#12131c] border border-rose-500/30 p-8 rounded-xl text-center max-w-md mx-auto space-y-4">
        <div className="text-rose-400 font-bold text-sm">Error Loading Research</div>
        <p className="text-zinc-400 text-xs">{error || 'Record not found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-semibold transition"
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
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-mono transition"
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
      <div className="bg-[#12131c] border border-rose-500/30 p-8 rounded-xl max-w-lg mx-auto text-center space-y-4">
        <div className="text-rose-400 font-bold text-sm">Pipeline Execution Failed</div>
        <p className="text-zinc-400 text-xs">
          {research.error_message || 'The AI pipeline was unable to complete validation.'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded text-xs transition"
          >
            Start New Research
          </Link>
          <button
            onClick={fetchDetail}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-semibold flex items-center gap-1.5 transition"
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

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-mono transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Research Archive</span>
        </Link>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(research.created_at).toLocaleDateString()}</span>
          </div>
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            VERIFIED
          </span>
        </div>
      </div>

      {/* Hero Verdict Banner */}
      <div className="bg-[#10121a] border border-zinc-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800/80 border border-zinc-700 text-[11px] font-mono text-zinc-300">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>EXECUTIVE VENTURE DOSSIER</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {research.title}
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
            {research.description}
          </p>

          {report?.verdict && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium leading-relaxed flex items-start gap-2.5 mt-4">
              <span className="font-bold text-emerald-400 shrink-0 font-mono uppercase">VERDICT:</span>
              <span>{report.verdict}</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Grid: Viability Gauge & TAM/SAM/SOM Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <ViabilityGauge score={report?.viability_score ?? 50} />
        </div>
        <div className="md:col-span-8">
          <MarketSizeChart marketSize={report?.market_size} />
        </div>
      </div>

      {/* Executive Summary */}
      {report?.summary && (
        <div className="bg-[#12131c] border border-zinc-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3>Opportunity & Strategic Summary</h3>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
            {report.summary}
          </p>
        </div>
      )}

      {/* Competitor Matrix Table */}
      <CompetitorTable competitors={report?.competitors} />

      {/* SWOT Quadrant Grid */}
      <SwotGrid swot={report?.swot} />

      {/* Customer Pain Points & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PainPointsList painPoints={report?.customer_pain_points} />
        <RiskMitigationMap risks={report?.key_risks} />
      </div>

      {/* Verified Citations & Footnotes */}
      <CitationsList citations={report?.citations} />
    </div>
  );
};
