import React, { useState } from 'react';
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
      'Automated pull request risk analysis reviewing PRs for architectural flaws, security vulnerabilities, and technical debt with low alert fatigue.',
  },
  {
    title: 'FitBite - Smart Nutrition & Macro Sync',
    description:
      'Meal planner that generates personalized macro-balanced meal schedules and integrates with grocery delivery APIs and health wearables.',
  },
  {
    title: 'SaaSChurn - Predictive Customer Retention',
    description:
      'Customer success assistant that monitors telemetry and product usage drops to predict B2B SaaS account churn 30 days prior to contract renewal.',
  },
];

export const IdeaInputForm: React.FC<IdeaInputFormProps> = ({ onSubmit, isLoading }) => {
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
    <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-card transition-all">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-mono text-accent-indigo mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RESEARCH STUDIO</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
          Submit Concept for Validation
        </h2>
        <p className="text-xs sm:text-sm text-primary-secondary mt-1 max-w-xl leading-relaxed">
          Enter your startup idea. SIRA queries live web sources via SearXNG, classifies data types with Jev, scrapes relevant sources with Crawl4AI, and synthesizes an investment report with Claude.
        </p>
      </div>

      {/* Preset Inspirations */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-xs text-primary-secondary font-medium mb-2.5">
          <Lightbulb className="w-3.5 h-3.5 text-accent-amber" />
          <span>Example concepts:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDEAS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-left px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle hover:border-border-prominent text-xs text-primary-secondary hover:text-primary transition"
            >
              {preset.title.split('-')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs leading-relaxed">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-primary mb-1.5">
            Concept / Product Name
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. FitBite - Smart Nutrition & Macro Sync"
            className="w-full bg-surface-raised border border-border-subtle focus:border-border-prominent rounded-lg px-3.5 py-2.5 text-xs text-primary placeholder:text-primary-muted focus:outline-none transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-primary">
              Concept, Target Users & Business Model
            </label>
            <span className="text-[11px] font-mono text-primary-muted">
              {description.length} / 5000
            </span>
          </div>
          <textarea
            required
            rows={5}
            maxLength={5000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the target customer, problem, proposed solution, key differentiator, and pricing..."
            className="w-full bg-surface-raised border border-border-subtle focus:border-border-prominent rounded-lg p-3 text-xs text-primary placeholder:text-primary-muted focus:outline-none transition resize-y leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          className="w-full py-3 px-5 bg-accent-indigo hover:opacity-95 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition disabled:bg-surface-raised disabled:text-primary-muted disabled:border disabled:border-border-subtle disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Starting Research Pipeline...</span>
            </>
          ) : (
            <>
              <span>Run Research Pipeline</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
