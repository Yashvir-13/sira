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

/* STAGE 1 SHOWCASE: Metasearch Query Expansion */
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
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-card border border-border-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 01 &bull; SEARXNG ORCHESTRATION
              </div>
              <h3 className="text-base sm:text-lg font-bold text-primary">
                Multi-Index Query Expansion & Crawl
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-primary font-semibold">
            24 SOURCES PARALLEL
          </span>
        </div>

        <p className="text-xs sm:text-sm text-primary-secondary mb-6 leading-relaxed">
          The research engine extracts key semantic anchors from your concept, querying developer forums, Hacker News, Reddit discussions, and company registries across 20+ search backends.
        </p>

        {/* Interactive Visual Mockup */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-between hover:border-border-prominent transition">
            <div className="flex items-center gap-2 truncate">
              <span className="text-primary-muted text-[10px]">GET</span>
              <span className="text-primary truncate font-medium">reddit.com/r/SaaS/comments/pr_code_review_fatigue</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle text-primary font-semibold shrink-0">
              HIGH INTENT
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-between hover:border-border-prominent transition">
            <div className="flex items-center gap-2 truncate">
              <span className="text-primary-muted text-[10px]">GET</span>
              <span className="text-primary truncate font-medium">news.ycombinator.com/item?id=38194021 [Ask HN: Code Review Tools]</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle text-primary font-semibold shrink-0">
              PAIN POINT
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-between hover:border-border-prominent transition">
            <div className="flex items-center gap-2 truncate">
              <span className="text-primary-muted text-[10px]">GET</span>
              <span className="text-primary truncate font-medium">producthunt.com/posts/linear-b-developer-intelligence</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border-subtle text-primary font-semibold shrink-0">
              DIRECT COMPETITOR
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* STAGE 2 SHOWCASE: Signal & Intent Classification */
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
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-card border border-border-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 02 &bull; DETERMINISTIC TAXONOMY
              </div>
              <h3 className="text-base sm:text-lg font-bold text-primary">
                Signal Isolation & Noise Filtering
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-primary font-semibold">
            100% TYPE-SAFE
          </span>
        </div>

        <p className="text-xs sm:text-sm text-primary-secondary mb-6 leading-relaxed">
          Raw search results pass through strict Pydantic schemas. SEO blogs and low-relevance links are discarded, leaving only actionable customer friction, competitor pricing, and market signals.
        </p>

        {/* Classification Taxonomy Visual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle">
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
              [IDENTIFIED COMPETITORS]
            </span>
            <div className="text-primary font-medium">LinearB, CodeRabbit, Sourcery</div>
            <div className="text-[11px] text-primary-muted mt-1">Pricing: $19 - $49/seat/mo</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle">
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
              [CUSTOMER PAIN POINTS]
            </span>
            <div className="text-primary font-medium">Alert fatigue, false positives</div>
            <div className="text-[11px] text-primary-muted mt-1">Severity: 8.5 / 10 &bull; 14 threads</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle">
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mb-1">
              [MARKET CEILING SIGNALS]
            </span>
            <div className="text-primary font-medium">Gartner DevOps Forecast 2026</div>
            <div className="text-[11px] text-primary-muted mt-1">Market size projected at $14.2B</div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-raised border border-border-subtle">
            <span className="text-[10px] text-primary-muted font-bold uppercase tracking-wider block mb-1">
              [DISCARDED NOISE]
            </span>
            <div className="text-primary-muted line-through">Top 10 AI Tools in 2025 (Affiliate)</div>
            <div className="text-[11px] text-accent-rose mt-1">Stripped: Low informational intent</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* STAGE 3 SHOWCASE: DOM Signal Extraction */
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
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-card border border-border-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 03 &bull; CRAWL4AI HEADLESS EXTRACTION
              </div>
              <h3 className="text-base sm:text-lg font-bold text-primary">
                DOM Stripping & Markdown Compression
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-primary font-semibold">
            94% TOKEN REDUCTION
          </span>
        </div>

        <p className="text-xs sm:text-sm text-primary-secondary mb-6 leading-relaxed">
          High-intent pages are rendered in a headless browser sandbox. JavaScript paywalls, navigation chrome, and advertisements are stripped away, preserving pure factual Markdown for the LLM.
        </p>

        {/* Clean Markdown Code Visualizer */}
        <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-primary-muted pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <span>cleaned_evidence_dump.md</span>
            </div>
            <span className="text-primary font-semibold">2,480 tokens (was 42,000 HTML tokens)</span>
          </div>

          <div className="text-primary space-y-1 pt-1 text-[11px] leading-relaxed">
            <div className="text-primary font-bold">## LinearB Pricing Matrix</div>
            <div className="text-primary-secondary">- Starter: $0/mo (up to 5 repos)</div>
            <div className="text-primary-secondary">- Pro: $29/contributor/mo (custom metrics, PR alerts)</div>
            <div className="text-primary-secondary">- Enterprise: Custom quote (SOC-2, dedicated Slack bot)</div>
            <div className="text-primary-muted italic mt-1">// Extracted from pricing DOM table; tracking scripts removed</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* STAGE 4 SHOWCASE: Institutional Venture Model */
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
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-card border border-border-subtle">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center text-primary">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                STAGE 04 &bull; CLAUDE REASONING ENGINE
              </div>
              <h3 className="text-base sm:text-lg font-bold text-primary">
                Executive Dossier Synthesis
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-primary font-semibold">
            INVESTMENT-GRADE DOSSIER
          </span>
        </div>

        <p className="text-xs sm:text-sm text-primary-secondary mb-6 leading-relaxed">
          The extracted evidence base is synthesized through standard venture frameworks, computing market size ceilings (TAM/SAM/SOM), defensibility moats, risk matrices, and viability scores.
        </p>

        {/* Visual Dossier Metrics Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
            <div className="text-[10px] text-primary-muted uppercase">Viability Conviction</div>
            <div className="text-2xl font-extrabold text-primary mt-1">84 / 100</div>
            <div className="text-[11px] text-primary-secondary mt-0.5">High venture readiness</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
            <div className="text-[10px] text-primary-muted uppercase">TAM Ceiling</div>
            <div className="text-2xl font-extrabold text-primary mt-1">$14.2B</div>
            <div className="text-[11px] text-primary-secondary mt-0.5">Developer security & tooling</div>
          </div>

          <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
            <div className="text-[10px] text-primary-muted uppercase">Primary Threat</div>
            <div className="text-2xl font-extrabold text-primary mt-1">Moderate</div>
            <div className="text-[11px] text-primary-secondary mt-0.5">Incumbents suffer false alerts</div>
          </div>
        </div>

        {/* Direct Link to Studio */}
        <Link
          to="/new"
          className="mt-4 p-3.5 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-between text-xs hover:border-border-prominent transition group"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Ready to validate your startup concept?</span>
          </div>
          <span className="text-primary font-semibold flex items-center gap-1 font-mono text-[11px] group-hover:translate-x-0.5 transition-transform">
            <span>LAUNCH RESEARCH STUDIO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
};
