import React from 'react';
import { ShieldCheck, Search, Filter, BarChart3, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row transition-colors">
      {/* Left Feature Showcase Pane */}
      <div className="md:w-5/12 bg-surface border-b md:border-b-0 md:border-r border-border-subtle p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle background ambient blur */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-accent-emerald/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-indigo/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-prominent flex items-center justify-center font-bold text-sm text-accent-emerald shadow-sm">
              S
            </div>
            <div>
              <span className="font-bold tracking-tight text-primary text-base">SIRA</span>
              <span className="text-primary-muted text-xs ml-2 font-mono">v1.0</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary leading-tight mb-4">
            Autonomous Startup Validation
          </h1>
          <p className="text-primary-secondary text-sm leading-relaxed mb-10 max-w-md">
            Validate startup assumptions before building. Multi-engine web search, type-safe classification, clean web extraction, and quantitative venture analysis in one system.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-center text-primary-secondary shrink-0">
                <Search className="w-4 h-4 text-accent-indigo" />
              </div>
              <div>
                <div className="text-xs font-semibold text-primary">Metasearch Engine</div>
                <div className="text-xs text-primary-muted">SearXNG crawls 20+ web sources with query expansion.</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-center text-primary-secondary shrink-0">
                <Filter className="w-4 h-4 text-accent-amber" />
              </div>
              <div>
                <div className="text-xs font-semibold text-primary">Typed Link Classification</div>
                <div className="text-xs text-primary-muted">Jev categorizes sources into competitors, TAM, and complaints.</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-center text-primary-secondary shrink-0">
                <BarChart3 className="w-4 h-4 text-accent-emerald" />
              </div>
              <div>
                <div className="text-xs font-semibold text-primary">Structured Intelligence Dossier</div>
                <div className="text-xs text-primary-muted">Viability scoring, TAM/SAM/SOM charts, and competitor matrices.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-border-subtle mt-10 flex items-center justify-between text-xs text-primary-muted font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-emerald" />
            <span>2FA (TOTP) SECURED</span>
          </div>
          <span>NEON POSTGRES</span>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="md:w-7/12 flex flex-col justify-between p-6 md:p-12 relative">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg bg-surface-raised border border-border-subtle text-primary-secondary hover:text-primary transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-accent-indigo" />}
          </button>
        </div>

        <div className="w-full max-w-md mx-auto my-auto">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-primary mb-1.5">{title}</h2>
            <p className="text-primary-secondary text-xs leading-relaxed">{subtitle}</p>
          </div>
          {children}
        </div>

        <div className="text-center text-[11px] text-primary-muted pt-6 font-mono">
          Protected with TOTP Two-Factor Authentication
        </div>
      </div>
    </div>
  );
};
