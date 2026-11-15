import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border-subtle bg-surface/40 backdrop-blur-md text-primary mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-border-subtle">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-prominent flex items-center justify-center font-bold text-sm text-primary shadow-sm">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-primary text-sm leading-none">SIRA</span>
                <span className="text-[10px] text-primary-muted font-mono tracking-wider mt-0.5">VENTURE RESEARCH</span>
              </div>
            </div>

            <p className="text-xs text-primary-secondary leading-relaxed max-w-xs">
              Autonomous venture intelligence & market validation agent. Stress-testing startup concepts with verified multi-source web evidence before writing code.
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-raised border border-border-subtle text-[11px] font-mono text-primary font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Platform Studio
            </h4>
            <ul className="space-y-2 text-xs text-primary-secondary">
              <li>
                <Link to="/new" className="hover:text-primary transition flex items-center gap-1">
                  <span>Launch Research Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-primary-muted" />
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-primary transition flex items-center gap-1">
                  <span>Dossier Archive</span>
                </Link>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-primary transition">
                  4-Stage Pipeline Architecture
                </a>
              </li>
              <li>
                <button type="button" onClick={scrollToTop} className="hover:text-primary transition">
                  Scroll to Overview
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Subsystems */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Agent Subsystems
            </h4>
            <ul className="space-y-2 text-xs text-primary-secondary font-mono">
              <li className="flex items-center justify-between pr-4">
                <span>SearXNG Metasearch</span>
                <span className="text-[10px] text-primary-muted">:8080</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>TypeSafe Jev Filter</span>
                <span className="text-[10px] text-primary-muted">Typed</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>Crawl4AI Headless</span>
                <span className="text-[10px] text-primary-muted">:11235</span>
              </li>
              <li className="flex items-center justify-between pr-4">
                <span>Claude 3.5 Venture Model</span>
                <span className="text-[10px] text-primary-muted">LLM</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Open Source & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Engineering & Security
            </h4>
            <ul className="space-y-2 text-xs text-primary-secondary">
              <li>
                <a
                  href="https://github.com/Yashvir-13/sira"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <span>Interactive API Swagger</span>
                  <ArrowUpRight className="w-3 h-3 text-primary-muted" />
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-primary-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
                <span>Google Authenticator TOTP</span>
              </li>
              <li className="text-[11px] font-mono text-primary-muted pt-1">
                Monorepo: React 19 + FastAPI
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-muted gap-3">
          <p>© 2026 SIRA — Autonomous Venture Intelligence Platform. Built for high-conviction founders.</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>v2.4.0-stable</span>
            <span>&bull;</span>
            <span className="text-primary font-medium">Neon PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
