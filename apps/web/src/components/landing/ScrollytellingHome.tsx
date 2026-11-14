import React from 'react';
import {
  ArrowDown,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { ContainerScroll } from './ContainerScroll';
import { PinnedPipelineScroller } from './PinnedPipelineScroller';
import { IdeaInputForm } from '../research/IdeaInputForm';
import type { ResearchStartRequest } from '../../types';

interface ScrollytellingHomeProps {
  onStartResearch: (data: ResearchStartRequest) => Promise<void>;
  isLoading: boolean;
}

export const ScrollytellingHome: React.FC<ScrollytellingHomeProps> = ({
  onStartResearch,
  isLoading,
}) => {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-dot-grid space-y-24 sm:space-y-36 pb-20 overflow-hidden">
      {/* Dynamic Ambient Background Glows for Glassmorphism */}
      <div className="absolute top-20 left-1/4 w-[450px] h-[450px] bg-accent-emerald/10 dark:bg-accent-emerald/[0.08] blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-accent-indigo/10 dark:bg-accent-indigo/[0.08] blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1800px] left-1/3 w-[600px] h-[600px] bg-accent-amber/10 dark:bg-accent-amber/[0.06] blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* CHAPTER 1: Hero Canvas with 3D Tilt & Zoom (`ContainerScroll`) */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/80 border border-border-subtle text-xs font-mono text-primary-secondary mb-6 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              <span>Autonomous Startup Research Agent</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] max-w-3xl">
              Validate your startup concept before you write code.
            </h1>

            <p className="text-sm sm:text-base text-primary-secondary mt-5 max-w-2xl leading-relaxed">
              SIRA queries 20+ live web sources, filters noise with type-safe classifiers, scrapes real facts, and builds an investment-grade dossier in 90 seconds.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => scrollToId('studio')}
                className="px-6 py-3 rounded-xl bg-accent-emerald hover:opacity-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition"
              >
                <span>Launch Research Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId('pipeline')}
                className="px-5 py-3 rounded-xl glass-card text-primary text-xs sm:text-sm font-medium hover:border-border-prominent flex items-center gap-2 transition"
              >
                <span>See 4-Stage Architecture</span>
                <ArrowDown className="w-4 h-4 text-primary-muted" />
              </button>
            </div>
          </div>
        }
      >
        {/* Interactive 3D Card Content (Dossier Preview) */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border-subtle/80 gap-3">
            <div>
              <span className="text-[11px] font-mono text-primary-muted uppercase tracking-wider block">
                Sample Venture Dossier
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                DevPulse - Autonomous PR Code Reviewer
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald font-mono text-xs font-semibold self-start sm:self-auto">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>VIABILITY: 84 / 100 &bull; HIGH CONVICTION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface/60 border border-border-subtle backdrop-blur-md">
              <div className="text-[10px] font-mono text-primary-muted uppercase">TAM Ceiling</div>
              <div className="text-2xl font-extrabold text-primary font-mono mt-1">$14.2B</div>
              <div className="text-[11px] text-primary-secondary mt-0.5">Developer tooling & code security</div>
            </div>

            <div className="p-4 rounded-xl bg-surface/60 border border-border-subtle backdrop-blur-md">
              <div className="text-[10px] font-mono text-primary-muted uppercase">Competitor Threat</div>
              <div className="text-2xl font-extrabold text-accent-amber font-mono mt-1">Moderate</div>
              <div className="text-[11px] text-primary-secondary mt-0.5">Incumbents suffer high alert fatigue</div>
            </div>

            <div className="p-4 rounded-xl bg-surface/60 border border-border-subtle backdrop-blur-md">
              <div className="text-[10px] font-mono text-primary-muted uppercase">Verified Sources</div>
              <div className="text-2xl font-extrabold text-accent-emerald font-mono mt-1">24 Citations</div>
              <div className="text-[11px] text-primary-secondary mt-0.5">Web facts linked directly</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-raised/80 border border-border-subtle text-xs text-primary-secondary leading-relaxed">
            <span className="font-bold text-primary font-mono uppercase mr-2">[Verdict]:</span>
            High conviction enterprise market with strong developer willingness to pay. Differentiation requires zero alert fatigue and direct GitHub CI/CD integration.
          </div>
        </div>
      </ContainerScroll>

      {/* CHAPTER 2: The Founder's Dilemma */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Stop spending 40 hours in browser tabs.
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Manual market validation is fragmented and biased.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual Way */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="text-xs font-mono text-accent-rose font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>MANUAL RESEARCH (40 HOURS)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-primary-secondary">
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>Browsing 40+ Reddit threads, Hacker News posts, and Product Hunt comments.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>Outdated competitor spreadsheets that go stale in weeks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold">&times;</span>
                <span>Guesswork TAM/SAM/SOM calculations with no verified citations.</span>
              </li>
            </ul>
          </div>

          {/* SIRA Agent */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-accent-emerald/30 shadow-card">
            <div className="text-xs font-mono text-accent-emerald font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>SIRA AUTONOMOUS PIPELINE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20">
                90 SECONDS
              </span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-primary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Simultaneous metasearch across 20+ indexes without rate limits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Type-safe classification of pricing, competitors, and pain points.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>Calculated TAM/SAM/SOM charts with clickable citation sources.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CHAPTER 3: Sticky Pinned 4-Stage Pipeline Scroller */}
      <section id="pipeline" className="scroll-mt-10">
        <PinnedPipelineScroller />
      </section>

      {/* CHAPTER 4: The Research Studio Launchpad */}
      <section id="studio" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-xs font-mono text-accent-emerald mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>ACTIVE RESEARCH STUDIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Ready to validate your concept?
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Enter your concept details below to launch the autonomous agent.
          </p>
        </div>

        <IdeaInputForm onSubmit={onStartResearch} isLoading={isLoading} />
      </section>
    </div>
  );
};
