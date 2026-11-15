import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScroll, useTransform, motion, MotionValue } from 'motion/react';
import {
  Search,
  Filter,
  Globe,
  Brain,
  Layers,
  ArrowRight,
  TrendingUp,
  Code2,
  Sparkles,
} from 'lucide-react';

interface StageConfig {
  id: string;
  stepNumber: string;
  service: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StageConfig[] = [
  {
    id: 'search',
    stepNumber: '01',
    service: 'SearXNG Metasearch',
    title: 'Multi-Index Query Expansion',
    tagline: '20+ search engines queried in parallel',
    description:
      'The agent decomposes the concept into semantic search vectors, querying developer forums, community discussions, product launches, and industry registries concurrently.',
    icon: Search,
  },
  {
    id: 'classify',
    stepNumber: '02',
    service: 'TypeSafe Taxonomy',
    title: 'Signal & Intent Classification',
    tagline: 'Filtering noise with structured data contracts',
    description:
      'Raw links are classified through a strict deterministic taxonomy, separating direct competitors, pricing disclosures, and customer friction points from generic marketing fluff.',
    icon: Filter,
  },
  {
    id: 'scrape',
    stepNumber: '03',
    service: 'Crawl4AI Headless',
    title: 'DOM Signal Extraction',
    tagline: 'Converting unstructured web DOMs into clean Markdown',
    description:
      'Top-ranked evidence pages are rendered headlessly. Cookie banners, navigation noise, and ads are stripped, producing clean token-efficient Markdown containing core facts.',
    icon: Globe,
  },
  {
    id: 'synthesize',
    stepNumber: '04',
    service: 'Claude Venture Model',
    title: 'Institutional Dossier Synthesis',
    tagline: 'Synthesizing viability conviction and market models',
    description:
      'The reasoning engine evaluates scraped signals against venture capital frameworks: calculating defensibility moats, competitor threat matrices, and TAM/SAM/SOM market ceilings with citations.',
    icon: Brain,
  },
];

export const PinnedPipelineScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative h-[320vh]">
      {/* Sticky Pinned Viewport Container */}
      <div className="sticky top-16 h-[85vh] flex flex-col justify-between py-6 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header with Live Stage Indicator */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-raised border border-border-subtle text-[11px] font-mono text-primary-secondary mb-1">
                <Layers className="w-3 h-3 text-primary" />
                <span>SCROLL-DRIVEN PIPELINE ARCHITECTURE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                Watch the autonomous agent think in 4 stages
              </h2>
            </div>

            {/* Stage Indicators */}
            <StageRail scrollYProgress={scrollYProgress} />
          </div>
        </div>

        {/* Dynamic Center Stage Viewer (Zoom-in, Pan & Slide) */}
        <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
          {/* Stage 1: Metasearch */}
          <StageOneView scrollYProgress={scrollYProgress} />

          {/* Stage 2: Intent Classification */}
          <StageTwoView scrollYProgress={scrollYProgress} />

          {/* Stage 3: DOM Extraction */}
          <StageThreeView scrollYProgress={scrollYProgress} />

          {/* Stage 4: Venture Model */}
          <StageFourView scrollYProgress={scrollYProgress} />
        </div>

        {/* Scroll Instruction Bar */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-primary-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Scroll trackpad or mouse wheel to transition stages</span>
          </div>
          <ScrollPercent scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
};

/* Stage Navigation Rail at top of pinned frame */
const StageRail: React.FC<{ scrollYProgress: MotionValue<number> }> = ({
  scrollYProgress,
}) => {
  return (
    <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto no-scrollbar">
      {STAGES.map((s, idx) => {
        const start = idx * 0.25;
        const end = start + 0.25;
        return (
          <StagePill
            key={s.id}
            index={idx + 1}
            name={s.service.split(' ')[0]}
            start={start}
            end={end}
            scrollYProgress={scrollYProgress}
          />
        );
      })}
    </div>
  );
};

const StagePill: React.FC<{
  index: number;
  name: string;
  start: number;
  end: number;
  scrollYProgress: MotionValue<number>;
}> = ({ index, name, start, end, scrollYProgress }) => {
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start, end - 0.05, end],
    [0.45, 1, 1, 0.45]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-border-subtle text-xs font-mono"
    >
      <span className="font-bold text-primary">{`0${index}`}</span>
      <span className="text-primary-secondary hidden sm:inline">{name}</span>
    </motion.div>
  );
};

const ScrollPercent: React.FC<{ scrollYProgress: MotionValue<number> }> = ({
  scrollYProgress,
}) => {
  const percent = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}% COMPLETE`);
  return <motion.span>{percent}</motion.span>;
};

/* STAGE 1 SHOWCASE: Authentic SearXNG Metasearch Console */
const StageOneView: React.FC<{ scrollYProgress: MotionValue<number> }> = ({
  scrollYProgress,
}) => {
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.22, 0.28], [1, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.28], [1, 1, 0.94]);
  const x = useTransform(scrollYProgress, [0, 0.22, 0.28], [0, 0, -80]);

  return (
    <motion.div
      style={{ opacity, scale, x }}
      className="absolute inset-0 flex flex-col justify-center max-w-4xl mx-auto"
    >
      <div className="glass-card-raised rounded-2xl p-5 sm:p-7 shadow-2xl border border-border-subtle">
        {/* Stage Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary shadow-sm">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 01 &bull; SEARXNG METASEARCH ORCHESTRATION
              </div>
              <h3 className="text-sm sm:text-base font-bold text-primary">
                Multi-Index Query Expansion & Web Crawl
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-raised border border-border-subtle text-primary font-semibold">
              24 SOURCES &bull; 180ms
            </span>
          </div>
        </div>

        {/* Authentic Multi-Engine Terminal Console */}
        <div className="rounded-xl bg-surface-raised/90 border border-border-subtle overflow-hidden font-mono text-xs shadow-inner">
          {/* Terminal Titlebar */}
          <div className="px-3.5 py-2 bg-surface border-b border-border-subtle flex items-center justify-between text-[11px] text-primary-muted">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <span className="font-semibold text-primary ml-1">searxng://dispatch.worker:8080</span>
            </div>
            <span className="text-[10px] text-primary-secondary">ENGINES: GOOGLE &bull; BING &bull; DUCKDUCKGO &bull; GITHUB</span>
          </div>

          {/* Active Query Expansion Vectors */}
          <div className="p-3 bg-surface/40 border-b border-border-subtle space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-primary-muted">$</span>
              <span className="text-primary-secondary">DISPATCH_VECTORS:</span>
              <span className="text-accent-emerald bg-accent-emerald/10 px-1.5 py-0.5 rounded text-[10px]">PARALLEL (3x)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px]">
              <div className="p-1.5 rounded bg-surface border border-border-subtle truncate">
                <span className="text-primary-muted">[1]</span> "ai code review developer pain site:reddit.com"
              </div>
              <div className="p-1.5 rounded bg-surface border border-border-subtle truncate">
                <span className="text-primary-muted">[2]</span> "automated pr reviewer competitor pricing 2025"
              </div>
              <div className="p-1.5 rounded bg-surface border border-border-subtle truncate">
                <span className="text-primary-muted">[3]</span> "developer tooling devops security tam market size"
              </div>
            </div>
          </div>

          {/* Live Evidence Stream */}
          <div className="p-3 space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-surface border border-border-subtle flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-raised font-bold text-accent-emerald">200 OK</span>
                <span className="text-primary font-medium truncate">reddit.com/r/devops/comments/ai_pr_review_fatigue</span>
              </div>
              <span className="text-[10px] text-primary-muted shrink-0 font-sans font-semibold">Score: 0.96 &bull; Pain Point</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border-subtle flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-raised font-bold text-accent-emerald">200 OK</span>
                <span className="text-primary font-medium truncate">news.ycombinator.com/item?id=39120448 [Show HN: CodeRabbit]</span>
              </div>
              <span className="text-[10px] text-primary-muted shrink-0 font-sans font-semibold">Score: 0.92 &bull; Direct Competitor</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface border border-border-subtle flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-raised font-bold text-accent-emerald">200 OK</span>
                <span className="text-primary font-medium truncate">gartner.com/en/documents/devops-security-tooling-2026</span>
              </div>
              <span className="text-[10px] text-primary-muted shrink-0 font-sans font-semibold">Score: 0.89 &bull; Market TAM</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* STAGE 2 SHOWCASE: Authentic TypeSafe Intent & Classification Matrix */
const StageTwoView: React.FC<{ scrollYProgress: MotionValue<number> }> = ({
  scrollYProgress,
}) => {
  const opacity = useTransform(scrollYProgress, [0.22, 0.28, 0.48, 0.54], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.22, 0.28, 0.48, 0.54], [0.94, 1, 1, 0.94]);
  const x = useTransform(scrollYProgress, [0.22, 0.28, 0.48, 0.54], [80, 0, 0, -80]);

  return (
    <motion.div
      style={{ opacity, scale, x }}
      className="absolute inset-0 flex flex-col justify-center max-w-4xl mx-auto"
    >
      <div className="glass-card-raised rounded-2xl p-5 sm:p-7 shadow-2xl border border-border-subtle">
        {/* Stage Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary shadow-sm">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 02 &bull; TYPESAFE JEV CLASSIFICATION
              </div>
              <h3 className="text-sm sm:text-base font-bold text-primary">
                Deterministic Signal Isolation & Schema Validation
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-raised border border-border-subtle text-primary font-semibold">
            100% TYPE-SAFE
          </span>
        </div>

        {/* Structured Signal Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {/* Signal 1: Competitor */}
          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle font-bold text-primary">
                COMPETITOR_INTELLIGENCE
              </span>
              <span className="text-[10px] text-accent-emerald font-semibold">98.2% CONF</span>
            </div>
            <div className="text-primary font-semibold text-xs">CodeRabbit &bull; LinearB</div>
            <div className="text-[11px] text-primary-secondary leading-relaxed">
              Pricing: $19–$49/dev/mo. Weakness identified: High alert noise on minor linting rules.
            </div>
          </div>

          {/* Signal 2: Pain Point */}
          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle font-bold text-primary">
                CUSTOMER_FRICTION
              </span>
              <span className="text-[10px] text-accent-emerald font-semibold">94.7% CONF</span>
            </div>
            <div className="text-primary font-semibold text-xs">PR Review Bottlenecks & Fatigue</div>
            <div className="text-[11px] text-primary-secondary leading-relaxed">
              Severity: High (8.6/10). Developers wait 4.2 hours average for review turnaround.
            </div>
          </div>

          {/* Signal 3: Market Size */}
          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle font-bold text-primary">
                TAM_FINANCIAL_METRIC
              </span>
              <span className="text-[10px] text-accent-emerald font-semibold">96.0% CONF</span>
            </div>
            <div className="text-primary font-semibold text-xs">TAM Ceiling: $14.2B by 2028</div>
            <div className="text-[11px] text-primary-secondary leading-relaxed">
              Global AI developer tooling market expanding at 18.4% CAGR through 2030.
            </div>
          </div>

          {/* Signal 4: Noise Stripping */}
          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle space-y-2 opacity-80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle font-bold text-accent-rose">
                REJECTED_NOISE
              </span>
              <span className="text-[10px] text-accent-rose font-semibold">DISCARDED</span>
            </div>
            <div className="text-primary-muted line-through text-xs">"Top 15 Tools Every Dev Needs in 2025"</div>
            <div className="text-[11px] text-primary-muted leading-relaxed">
              Stripped: Affiliate SEO blog, 0 primary data points or pricing disclosures.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* STAGE 3 SHOWCASE: Authentic Crawl4AI Headless Extraction */
const StageThreeView: React.FC<{ scrollYProgress: MotionValue<number> }> = ({
  scrollYProgress,
}) => {
  const opacity = useTransform(scrollYProgress, [0.48, 0.54, 0.73, 0.79], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.48, 0.54, 0.73, 0.79], [0.94, 1, 1, 0.94]);
  const x = useTransform(scrollYProgress, [0.48, 0.54, 0.73, 0.79], [80, 0, 0, -80]);

  return (
    <motion.div
      style={{ opacity, scale, x }}
      className="absolute inset-0 flex flex-col justify-center max-w-4xl mx-auto"
    >
      <div className="glass-card-raised rounded-2xl p-5 sm:p-7 shadow-2xl border border-border-subtle">
        {/* Stage Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary shadow-sm">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 03 &bull; CRAWL4AI HEADLESS BROWSER SANDBOX
              </div>
              <h3 className="text-sm sm:text-base font-bold text-primary">
                DOM Signal Extraction & Token Compression
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface-raised border border-border-subtle text-accent-emerald font-semibold">
            -82% NOISE REDUCTION
          </span>
        </div>

        {/* Headless Browser Chrome & Clean Markdown Visualizer */}
        <div className="rounded-xl bg-surface-raised border border-border-subtle overflow-hidden font-mono text-xs shadow-inner">
          <div className="px-3.5 py-2 bg-surface border-b border-border-subtle flex items-center justify-between text-[11px] text-primary-muted">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-medium">crawl4ai://docker:11235/extract/markdown</span>
            </div>
            <span className="text-[10px] text-primary-secondary">DOM: 24,000 NODES &rarr; 840 TOKENS</span>
          </div>

          <div className="p-4 space-y-2.5 text-[11px] leading-relaxed">
            <div className="text-primary font-bold">
              ### Extracted Pricing & Feature Matrix (Verified Web Evidence)
            </div>

            <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1.5 text-primary-secondary text-[10px]">
              <div className="text-primary font-semibold flex items-center justify-between border-b border-border-subtle pb-1">
                <span>TIER / PLAN</span>
                <span>PRICE DISCLOSURE</span>
                <span>INCLUDED CAPABILITIES</span>
              </div>
              <div className="flex items-center justify-between text-primary">
                <span>Developer Pro</span>
                <span className="font-bold">$29 / seat / mo</span>
                <span>Automated PR comments, Slack webhooks</span>
              </div>
              <div className="flex items-center justify-between text-primary">
                <span>Enterprise Org</span>
                <span className="font-bold">$79 / seat / mo</span>
                <span>Custom lint rules, self-hosted LLM runtime</span>
              </div>
            </div>

            <div className="text-[10px] text-primary-muted flex items-center gap-2 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
              <span>Sanitized by Crawl4AI: Cookie banners, telemetry beacons, and CSS bundles purged.</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* STAGE 4 SHOWCASE: Authentic Venture Dossier Snapshot */
const StageFourView: React.FC<{ scrollYProgress: MotionValue<number> }> = ({
  scrollYProgress,
}) => {
  const opacity = useTransform(scrollYProgress, [0.73, 0.79, 1], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0.73, 0.79, 1], [0.94, 1, 1]);
  const x = useTransform(scrollYProgress, [0.73, 0.79, 1], [80, 0, 0]);

  return (
    <motion.div
      style={{ opacity, scale, x }}
      className="absolute inset-0 flex flex-col justify-center max-w-4xl mx-auto"
    >
      <div className="glass-card-raised rounded-2xl p-5 sm:p-7 shadow-2xl border border-border-subtle">
        {/* Stage Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary shadow-sm">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 04 &bull; INSTITUTIONAL SYNTHESIS
              </div>
              <h3 className="text-sm sm:text-base font-bold text-primary">
                Executive Venture Dossier Generation
              </h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-primary font-mono text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-accent-emerald" />
            <span>84 / 100 &bull; HIGH CONVICTION</span>
          </div>
        </div>

        {/* Authentic Dossier Preview Grid */}
        <div className="space-y-3 font-mono">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface border border-border-subtle shadow-sm">
              <div className="text-[10px] text-primary-muted uppercase">TAM Ceiling</div>
              <div className="text-2xl font-extrabold text-primary mt-1">$14.2B</div>
              <div className="text-[10px] text-primary-secondary mt-0.5">Developer security & tooling</div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border-subtle shadow-sm">
              <div className="text-[10px] text-primary-muted uppercase">Competitor Moat</div>
              <div className="text-2xl font-extrabold text-primary mt-1">Moderate</div>
              <div className="text-[10px] text-primary-secondary mt-0.5">Incumbents suffer alert fatigue</div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-border-subtle shadow-sm">
              <div className="text-[10px] text-primary-muted uppercase">Verified Citations</div>
              <div className="text-2xl font-extrabold text-primary mt-1">24 Sources</div>
              <div className="text-[10px] text-primary-secondary mt-0.5">100% linked primary evidence</div>
            </div>
          </div>

          {/* Strategic Verdict Quote */}
          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle text-xs text-primary-secondary leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-primary uppercase font-mono mr-1.5">[Strategic Verdict]:</span>
              Viable enterprise market with verified developer demand. Success requires sub-3-minute PR review cycles and zero false-positive alert spam.
            </div>
          </div>

          {/* Bottom Action Jump */}
          <Link
            to="/new"
            className="p-3 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-between text-xs hover:border-border-prominent transition group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span className="text-primary font-medium">Ready to validate your startup concept?</span>
            </div>
            <span className="text-primary font-semibold flex items-center gap-1 font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">
              <span>LAUNCH RESEARCH STUDIO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
