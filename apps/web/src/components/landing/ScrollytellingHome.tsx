import React from 'react';
import {
  ArrowDown,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Layers,
  Sparkles,
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
    <div className="relative min-h-screen bg-subtle-grid space-y-24 sm:space-y-36 pb-24 overflow-x-clip">
      {/* CHAPTER 1: Hero Canvas with 3D Tilt & Zoom (`ContainerScroll`) */}
      <section id="hero">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-mono text-primary-secondary mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo" />
                <span>Autonomous Venture Research</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-[1.1] max-w-3xl">
                Validate your startup concept before writing code.
              </h1>

              <p className="text-sm sm:text-base text-primary-secondary mt-5 max-w-2xl leading-relaxed">
                SIRA coordinates multi-index web searches, filters signal from noise through structured schemas, headlessly scrapes evidence, and compiles an institutional dossier in 90 seconds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => scrollToId('studio')}
                  className="px-6 py-3 rounded-xl bg-accent-indigo hover:opacity-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition"
                >
                  <span>Launch Research Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToId('pipeline')}
                  className="px-5 py-3 rounded-xl glass-card text-primary text-xs sm:text-sm font-medium hover:border-border-prominent flex items-center gap-2 transition"
                >
                  <span>Explore Pipeline Architecture</span>
                  <ArrowDown className="w-4 h-4 text-primary-muted" />
                </button>
              </div>
            </div>
          }
        >
          {/* Interactive 3D Card Content (Dossier Preview) */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border-subtle gap-3">
              <div>
                <span className="text-[11px] font-mono text-primary-muted uppercase tracking-wider block">
                  Sample Venture Dossier Preview
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-sm">
                <div className="text-[10px] text-primary-muted uppercase">TAM Ceiling</div>
                <div className="text-2xl font-extrabold text-primary mt-1">$14.2B</div>
                <div className="text-[11px] text-primary-secondary mt-0.5">Developer security & tooling</div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-sm">
                <div className="text-[10px] text-primary-muted uppercase">Competitor Threat</div>
                <div className="text-2xl font-extrabold text-accent-amber mt-1">Moderate</div>
                <div className="text-[11px] text-primary-secondary mt-0.5">Incumbents suffer false positive fatigue</div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border-subtle shadow-sm">
                <div className="text-[10px] text-primary-muted uppercase">Evidence Citations</div>
                <div className="text-2xl font-extrabold text-accent-indigo mt-1">24 Sourced</div>
                <div className="text-[11px] text-primary-secondary mt-0.5">Verified web facts linked</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle text-xs text-primary-secondary leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-primary font-mono uppercase mr-2">[Strategic Verdict]:</span>
                Viable enterprise market with verified developer demand. Success requires sub-3-minute PR review cycles and zero false positive spam.
              </div>
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* CHAPTER 2: The Founder's Dilemma */}
      <section id="preview" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Stop spending 40 hours in browser tabs
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Manual market validation is slow, fragmented, and prone to confirmation bias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual Way */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-border-subtle shadow-card">
            <div className="text-xs font-mono text-accent-rose font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span>MANUAL RESEARCH (40 HOURS)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-primary-secondary">
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold text-sm leading-none mt-0.5">&times;</span>
                <span>Browsing 40+ Reddit threads, Hacker News posts, and Product Hunt launches.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold text-sm leading-none mt-0.5">&times;</span>
                <span>Manual competitor spreadsheets that become obsolete within weeks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-accent-rose font-bold text-sm leading-none mt-0.5">&times;</span>
                <span>Unverified TAM/SAM/SOM estimates without linked primary sources.</span>
              </li>
            </ul>
          </div>

          {/* SIRA Agent */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-accent-indigo/30 shadow-card">
            <div className="text-xs font-mono text-accent-indigo font-semibold uppercase tracking-wider flex items-center justify-between">
              <span>SIRA AUTONOMOUS PIPELINE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-indigo/10 border border-accent-indigo/20">
                90 SECONDS
              </span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-primary">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
                <span>Simultaneous metasearch across 20+ search engines in parallel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
                <span>Type-safe classification of competitors, pricing tiers, and customer pain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
                <span>Institutional dossier with TAM charts and verified citation links.</span>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-mono text-primary-secondary mb-2">
            <Layers className="w-3.5 h-3.5 text-accent-indigo" />
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
