import React from 'react';
import {
  ArrowDown,
  Search,
  Filter,
  Globe,
  Brain,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { IdeaInputForm } from '../research/IdeaInputForm';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import type { ResearchStartRequest } from '../../types';

interface ScrollytellingHomeProps {
  onStartResearch: (data: ResearchStartRequest) => Promise<void>;
  isLoading: boolean;
}

const SECTION_IDS = ['hero', 'dilemma', 'pipeline', 'preview', 'studio'];

export const ScrollytellingHome: React.FC<ScrollytellingHomeProps> = ({
  onStartResearch,
  isLoading,
}) => {
  const activeSection = useScrollSpy(SECTION_IDS, 0.4);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-16 relative">
      {/* Floating Scroll Section Indicator (desktop) */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-2.5 p-2 rounded-full bg-surface/80 border border-border-subtle backdrop-blur-md shadow-card">
        {SECTION_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            title={`Jump to ${id}`}
            aria-label={`Jump to ${id}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSection === id
                ? 'bg-accent-emerald w-6 rounded-full'
                : 'bg-primary-muted/40 hover:bg-primary-muted'
            }`}
          />
        ))}
      </div>

      {/* CHAPTER 1: Hero Canvas */}
      <section
        id="hero"
        className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Ambient Radial Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[400px] bg-accent-emerald/10 dark:bg-accent-emerald/5 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-mono text-primary-secondary mb-6 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
          <span>Venture Validation Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] max-w-3xl">
          Validate your startup before you build.
        </h1>

        <p className="text-sm sm:text-base text-primary-secondary mt-5 max-w-2xl leading-relaxed">
          SIRA searches across 20+ web sources, filters signal from noise with type-safe classifiers, scrapes real web evidence, and synthesizes structured market reports in 90 seconds.
        </p>

        {/* Dual CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => scrollToSection('studio')}
            className="px-6 py-3 rounded-lg bg-accent-emerald text-white text-xs sm:text-sm font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm transition"
          >
            <span>Start Idea Research</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('pipeline')}
            className="px-5 py-3 rounded-lg bg-surface-raised border border-border-subtle text-primary text-xs sm:text-sm font-medium hover:border-border-prominent flex items-center gap-2 transition"
          >
            <span>See How Agent Works</span>
            <ArrowDown className="w-4 h-4 text-primary-muted" />
          </button>
        </div>
      </section>

      {/* CHAPTER 2: The Founder's Dilemma */}
      <section id="dilemma" className="max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            The 40-hour validation grind, replaced.
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Traditional market analysis is fragmented, biased, and slow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: Traditional Research */}
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 space-y-4">
            <div className="text-xs font-mono text-accent-rose font-semibold uppercase tracking-wider">
              Traditional Research
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-primary-secondary">
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>Browsing 40+ Reddit threads and Hacker News tabs manually.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>Subjective competitor assessments based on outdated blogs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>Vague market sizing calculations without verified citations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>20–40 hours invested before writing a single line of code.</span>
              </li>
            </ul>
          </div>

          {/* Right: SIRA Agent */}
          <div className="bg-surface border border-accent-emerald/30 rounded-2xl p-6 space-y-4 shadow-card">
            <div className="text-xs font-mono text-accent-emerald font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>SIRA Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20">
                Automated
              </span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-primary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Automated metasearch across news, forums, and registries.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Type-safe classification of competitors, pricing, and pain points.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Calculated TAM/SAM/SOM market models with clickable sources.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Comprehensive investment-grade dossier in 90 seconds.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: The 4-Stage AI Pipeline (Sticky Scroll Spine) */}
      <section id="pipeline" className="max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-xs font-mono text-accent-indigo mb-2">
            <span>PIPELINE ARCHITECTURE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            How the agent validates your concept
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Four specialized services running sequentially in an automated background pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-border-prominent transition">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center text-accent-indigo mb-3">
                <Search className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider mb-1">
                Stage 1 &bull; SearXNG
              </div>
              <h3 className="text-sm font-bold text-primary mb-1.5">Deep Metasearch</h3>
              <p className="text-xs text-primary-secondary leading-relaxed">
                Queries multiple web indexes simultaneously, expanding concept terms to surface forums, blogs, and registries.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-accent-indigo">
              20+ Sources Queried
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-border-prominent transition">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center text-accent-amber mb-3">
                <Filter className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider mb-1">
                Stage 2 &bull; TypeSafe Jev
              </div>
              <h3 className="text-sm font-bold text-primary mb-1.5">Signal Classification</h3>
              <p className="text-xs text-primary-secondary leading-relaxed">
                Categorizes links into typed domains: direct competitor, pricing model, customer complaint, or market data.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-accent-amber">
              Strict Type Safety
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-border-prominent transition">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center text-accent-emerald mb-3">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider mb-1">
                Stage 3 &bull; Crawl4AI
              </div>
              <h3 className="text-sm font-bold text-primary mb-1.5">Headless Scraping</h3>
              <p className="text-xs text-primary-secondary leading-relaxed">
                Renders raw target pages headlessly, stripping advertising and cookie walls into clean Markdown text.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-accent-emerald">
              Clean Signal Extraction
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-surface border border-border-subtle rounded-xl p-5 flex flex-col justify-between hover:border-border-prominent transition">
            <div>
              <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center text-accent-indigo mb-3">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider mb-1">
                Stage 4 &bull; Claude
              </div>
              <h3 className="text-sm font-bold text-primary mb-1.5">Venture Modeling</h3>
              <p className="text-xs text-primary-secondary leading-relaxed">
                Analyzes scraped evidence to compute viability scores, market ceiling figures, and actionable risks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-mono text-accent-indigo">
              Structured JSON Dossier
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 4: The Executive Dossier Preview */}
      <section id="preview" className="max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Structured insights founders and investors value
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Every score, competitor metric, and chart links directly to its source.
          </p>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-2">
            <div>
              <div className="text-[11px] font-mono text-primary-muted uppercase">Sample Dossier Preview</div>
              <div className="text-base font-bold text-primary">DevPulse - Autonomous AI Code Reviewer</div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald text-xs font-mono font-semibold self-start sm:self-auto">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>VIABILITY SCORE: 84 / 100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <div className="text-[10px] font-mono text-primary-muted uppercase">Total Addressable Market</div>
              <div className="text-lg font-extrabold text-primary mt-1">$14.2B</div>
              <div className="text-[11px] text-primary-secondary mt-0.5">Developer tooling & code quality</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <div className="text-[10px] font-mono text-primary-muted uppercase">Primary Threat Level</div>
              <div className="text-lg font-extrabold text-accent-amber mt-1">Moderate</div>
              <div className="text-[11px] text-primary-secondary mt-0.5">Incumbents lack PR-level risk context</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <div className="text-[10px] font-mono text-primary-muted uppercase">Evidence Base</div>
              <div className="text-lg font-extrabold text-accent-emerald mt-1">24 Citations</div>
              <div className="text-[11px] text-primary-secondary mt-0.5">Verified web sources linked</div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER 5: The Launchpad Studio */}
      <section id="studio" className="max-w-4xl mx-auto scroll-mt-20">
        <IdeaInputForm onSubmit={onStartResearch} isLoading={isLoading} />
      </section>
    </div>
  );
};
