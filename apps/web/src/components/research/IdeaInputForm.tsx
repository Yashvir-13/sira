import { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import type { ResearchStartRequest } from '../../types';

interface IdeaInputFormProps {
  onSubmit: (data: ResearchStartRequest) => Promise<void>;
  isLoading: boolean;
}

const PRESET_IDEAS: ResearchStartRequest[] = [
  {
    title: 'DevPulse - Autonomous AI Code Reviewer',
    description:
      'An automated PR risk analysis tool that reviews pull requests for architectural flaws, security vulnerabilities, and technical debt with zero alert fatigue.',
  },
  {
    title: 'FitBite - Smart Nutrition & Macro Sync',
    description:
      'An AI-powered meal planner that automatically designs personalized macro meals and syncs with Apple Health and grocery delivery services.',
  },
  {
    title: 'SaaSChurn - Predictive Customer Retention',
    description:
      'A customer success copilot that analyzes product usage signals to predict B2B SaaS churn 30 days before contract renewal.',
  },
];

export const IdeaInputForm = ({ onSubmit, isLoading }: IdeaInputFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to start research. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  const handleSelectPreset = (preset: ResearchStartRequest) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setError(null);
  };

  return (
    <div className="bg-[#10121a] border border-zinc-800/80 rounded-xl p-6 md:p-8 relative overflow-hidden">
      {/* Top Banner */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RESEARCH ENGINE</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Validate a Startup Idea
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
          Input your startup concept. SIRA will search 20+ web sources via SearXNG, classify market
          data with Jev, scrape top pages with Crawl4AI, and build an executive analysis with Claude.
        </p>
      </div>

      {/* Preset Inspirations */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-2.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Need inspiration? Try an example concept:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDEAS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-left px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition"
            >
              {preset.title.split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Startup / Project Name
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. FitBite - AI Nutrition & Macro Coach"
            className="w-full bg-[#0a0b10] border border-zinc-800 focus:border-zinc-600 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Concept, Target Customer & Value Proposition
            </label>
            <span className="text-[11px] font-mono text-zinc-500">
              {description.length} / 2000
            </span>
          </div>
          <textarea
            required
            rows={5}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what problem this solves, who pays for it, key features, and your proposed business model..."
            className="w-full bg-[#0a0b10] border border-zinc-800 focus:border-zinc-600 rounded-lg p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition resize-y leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          className="w-full py-3 px-5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Queuing Research Engine...</span>
            </>
          ) : (
            <>
              <span>Run Autonomous Validation Pipeline</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
