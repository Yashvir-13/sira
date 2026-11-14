import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'motion/react';
import { Search, Filter, Globe, Brain, Sparkles } from 'lucide-react';

interface Stage {
  id: string;
  stepNumber: string;
  service: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBg: string;
  metrics: string;
  mockArtifact: React.ReactNode;
}

const STAGES: Stage[] = [
  {
    id: 'search',
    stepNumber: '01',
    service: 'SearXNG Metasearch',
    title: 'Multi-Index Query Expansion',
    tagline: '20+ search engines queried in parallel',
    description:
      'The agent decomposes the startup concept into semantic variations, simultaneously scraping Hacker News discussions, Reddit sentiment, Product Hunt launches, and company filings.',
    icon: Search,
    accentColor: 'text-accent-indigo',
    badgeBg: 'bg-accent-indigo/10 border-accent-indigo/20 text-accent-indigo',
    metrics: '24 Sources Found',
    mockArtifact: (
      <div className="space-y-2 font-mono text-[11px]">
        <div className="p-2 rounded bg-surface border border-border-subtle flex items-center justify-between">
          <span className="text-primary truncate">reddit.com/r/SaaS/comments/...</span>
          <span className="text-accent-emerald text-[10px]">RELEVANT</span>
        </div>
        <div className="p-2 rounded bg-surface border border-border-subtle flex items-center justify-between">
          <span className="text-primary truncate">news.ycombinator.com/item?id=...</span>
          <span className="text-accent-emerald text-[10px]">HIGH INTENT</span>
        </div>
        <div className="p-2 rounded bg-surface border border-border-subtle flex items-center justify-between">
          <span className="text-primary truncate">producthunt.com/posts/...</span>
          <span className="text-accent-indigo text-[10px]">INCUMBENT</span>
        </div>
      </div>
    ),
  },
  {
    id: 'classify',
    stepNumber: '02',
    service: 'TypeSafe Jev',
    title: 'Signal & Intent Classification',
    tagline: 'Filtering noise with structured type contracts',
    description:
      'Raw search links are classified through a strict deterministic taxonomy, isolating direct competitors, pricing disclosures, and customer pain points from marketing fluff.',
    icon: Filter,
    accentColor: 'text-accent-amber',
    badgeBg: 'bg-accent-amber/10 border-accent-amber/20 text-accent-amber',
    metrics: '100% Type-Safe',
    mockArtifact: (
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="px-2.5 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber text-[11px] font-mono">
          [Competitor: LinearB]
        </span>
        <span className="px-2.5 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-[11px] font-mono">
          [TAM Signal: Gartner 2026]
        </span>
        <span className="px-2.5 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/30 text-accent-indigo text-[11px] font-mono">
          [Friction: Alert Fatigue]
        </span>
        <span className="px-2.5 py-1 rounded-full bg-surface-raised border border-border-subtle text-primary-muted text-[11px] font-mono">
          [Discarded: Generic SEO Blog]
        </span>
      </div>
    ),
  },
  {
    id: 'scrape',
    stepNumber: '03',
    service: 'Crawl4AI Headless',
    title: 'Clean Signal Extraction',
    tagline: 'Converting messy web DOMs into clean Markdown',
    description:
      'Top-ranked pages are rendered headlessly. Cookie banners, JavaScript popups, and navigation chrome are stripped away, yielding token-efficient Markdown containing only core facts.',
    icon: Globe,
    accentColor: 'text-accent-emerald',
    badgeBg: 'bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald',
    metrics: '94% Token Reduction',
    mockArtifact: (
      <div className="p-3 rounded-lg bg-surface font-mono text-[11px] text-primary-secondary border border-border-subtle space-y-1">
        <div className="text-accent-emerald font-bold"># Extracted Competitor Pricing</div>
        <div>- Enterprise tier: $49/seat/mo</div>
        <div>- Self-hosted proxy available</div>
        <div className="text-primary-muted">// Ads & navigation removed</div>
      </div>
    ),
  },
  {
    id: 'synthesize',
    stepNumber: '04',
    service: 'Claude Venture Model',
    title: 'Structured Validation & Dossier',
    tagline: 'Synthesizing viability scores and TAM/SAM/SOM models',
    description:
      'The reasoning engine synthesizes scraped signals against venture capital frameworks: calculating defensibility moats, competitor threat rankings, and SWOT matrices with citations.',
    icon: Brain,
    accentColor: 'text-accent-indigo',
    badgeBg: 'bg-accent-indigo/10 border-accent-indigo/20 text-accent-indigo',
    metrics: 'Investment-Grade',
    mockArtifact: (
      <div className="p-3 rounded-lg bg-surface border border-accent-emerald/30 text-xs space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono text-primary-secondary">Viability Conviction:</span>
          <span className="font-mono font-bold text-accent-emerald">84 / 100</span>
        </div>
        <div className="w-full bg-surface-raised rounded-full h-1.5 overflow-hidden">
          <div className="bg-accent-emerald h-full rounded-full w-[84%]" />
        </div>
        <div className="text-[10px] text-primary-muted font-mono">TAM: $14.2B &bull; Threat: Moderate</div>
      </div>
    ),
  },
];

export const PinnedPipelineScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative h-[260vh]">
      {/* Sticky Pinned Viewport Container */}
      <div className="sticky top-20 h-[80vh] flex flex-col justify-center">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-xs font-mono text-accent-indigo mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SCROLL-DRIVEN PIPELINE ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Watch the agent think in 4 stages
          </h2>
          <p className="text-xs sm:text-sm text-primary-secondary mt-1">
            Scroll down to advance through the autonomous pipeline.
          </p>
        </div>

        {/* Dynamic Interactive Stage Stage Deck */}
        <div className="max-w-4xl mx-auto w-full px-4 relative">
          {/* Ambient Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-accent-indigo/10 blur-3xl rounded-full pointer-events-none -z-10" />

          {/* Cards Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {STAGES.map((stage, idx) => {
              const start = idx * 0.23;
              const end = start + 0.25;

              return (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  scrollYProgress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StageCard: React.FC<{
  stage: Stage;
  scrollYProgress: any;
  range: [number, number];
}> = ({ stage, scrollYProgress, range }) => {
  const Icon = stage.icon;

  // Transform opacity, scale, and translateY based on scroll progression
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, range[0] - 0.1), range[0], range[1], Math.min(1, range[1] + 0.15)],
    [0.35, 1, 1, 0.4]
  );

  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, range[0] - 0.1), range[0], range[1]],
    [0.96, 1.02, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [Math.max(0, range[0] - 0.1), range[0]],
    [20, 0]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
      }}
      className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08] dark:border-white/[0.06] flex flex-col justify-between shadow-card hover:border-white/[0.15] transition-colors"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-raised flex items-center justify-center">
              <Icon className={`w-4 h-4 ${stage.accentColor}`} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-primary-muted uppercase tracking-wider block">
                STAGE {stage.stepNumber}
              </span>
              <span className="text-xs font-bold text-primary">{stage.service}</span>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${stage.badgeBg}`}>
            {stage.metrics}
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-primary mb-1.5">{stage.title}</h3>
        <p className="text-xs text-primary-secondary leading-relaxed mb-4">{stage.description}</p>
      </div>

      <div className="pt-3 border-t border-border-subtle/60">
        {stage.mockArtifact}
      </div>
    </motion.div>
  );
};
