import React from 'react';
import { ShieldCheck, Search, Cpu, BarChart3 } from 'lucide-react';

interface SplitAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const SplitAuthLayout: React.FC<SplitAuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col md:flex-row">
      {/* Left Feature Showcase Pane */}
      <div className="md:w-5/12 bg-[#0e1017] border-b md:border-b-0 md:border-r border-zinc-800/80 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle background ambient blur */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-sm text-emerald-400">
              S
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">SIRA</span>
              <span className="text-zinc-500 text-xs ml-2 font-mono">v1.0</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            Autonomous Startup Intelligence & Validation
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-md">
            Validate startup ideas before writing a line of code. Autonomous web search,
            typed link classification, page scraping, and venture risk analysis in one unified engine.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mt-0.5 shrink-0">
                <Search className="w-3.5 h-3.5 text-zinc-300" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">Metasearch Engine</div>
                <div className="text-xs text-zinc-500">SearXNG crawls 20+ search engines with query expansion.</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mt-0.5 shrink-0">
                <Cpu className="w-3.5 h-3.5 text-zinc-300" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">Typed Decision Model</div>
                <div className="text-xs text-zinc-500">Jev classifies links into competitors, TAM, and pain points.</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mt-0.5 shrink-0">
                <BarChart3 className="w-3.5 h-3.5 text-zinc-300" />
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-200">Claude Venture Report</div>
                <div className="text-xs text-zinc-500">Viability scoring, TAM/SAM/SOM, and competitor threat matrices.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-zinc-800/80 mt-10 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2FA & RBAC PROTECTED</span>
          </div>
          <span>NEON POSTGRES</span>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="md:w-7/12 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-white mb-1.5">{title}</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
