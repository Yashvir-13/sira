import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../state/ThemeContext';
import { useAuth } from '../../state/AuthContext';
import { Sun, Moon, ArrowRight, Compass } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border-subtle bg-background/90 backdrop-blur-md transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-prominent flex items-center justify-center font-bold text-sm text-accent-indigo shadow-sm group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-primary text-sm leading-none">SIRA</span>
            <span className="text-[10px] text-primary-muted font-mono tracking-wider mt-0.5">VENTURE RESEARCH</span>
          </div>
        </Link>

        {/* Center Anchor Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-primary-secondary">
          <button
            type="button"
            onClick={() => scrollToId('hero')}
            className="hover:text-primary transition"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => scrollToId('pipeline')}
            className="hover:text-primary transition flex items-center gap-1.5"
          >
            <span>Autonomous Pipeline</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent-indigo/10 text-accent-indigo font-semibold">
              4 STAGES
            </span>
          </button>
          <button
            type="button"
            onClick={() => scrollToId('preview')}
            className="hover:text-primary transition"
          >
            Sample Dossier
          </button>
          <button
            type="button"
            onClick={() => scrollToId('studio')}
            className="hover:text-primary transition"
          >
            Research Studio
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-primary-secondary hover:text-primary hover:bg-surface-raised border border-border-subtle transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-accent-amber transition-transform duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-accent-indigo transition-transform duration-200" />
            )}
          </button>

          {/* Auth Action */}
          {user ? (
            <Link
              to="/history"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-primary text-xs font-medium hover:border-border-prominent transition shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-accent-indigo" />
              <span>Dossier Archive</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-primary-secondary hover:text-primary px-3 py-1.5 transition"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => scrollToId('studio')}
                className="px-3.5 py-1.5 rounded-lg bg-accent-indigo hover:opacity-95 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
