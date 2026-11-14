import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { IdeaInputForm } from '../components/research/IdeaInputForm';
import { useAuth } from '../state/AuthContext';
import { useTheme } from '../state/ThemeContext';
import { researchApi } from '../api/research';
import { Sun, Moon } from 'lucide-react';
import type { ResearchStartRequest } from '../types';

export const NewResearchPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleStartResearch = async (data: ResearchStartRequest) => {
    if (!user) {
      sessionStorage.setItem('sira_pending_concept', JSON.stringify(data));
      navigate('/login?redirect=/new');
      return;
    }

    setLoading(true);
    try {
      const response = await researchApi.startResearch(data);
      sessionStorage.removeItem('sira_pending_concept');
      navigate(`/research/${response.research_id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col transition-colors">
      {/* Focused Studio Top Header */}
      <header className="sticky top-0 z-40 h-16 border-b border-border-subtle bg-background/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-medium text-primary-secondary hover:text-primary p-1.5 rounded-lg hover:bg-surface-raised transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Overview</span>
          </Link>

          <div className="h-4 w-px bg-border-subtle hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-surface-raised border border-border-prominent flex items-center justify-center font-bold text-xs text-primary shadow-sm">
              S
            </div>
            <span className="text-xs font-semibold tracking-tight text-primary">Research Studio</span>
          </div>
        </div>

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

          {user && (
            <Link
              to="/history"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-primary text-xs font-medium hover:border-border-prominent transition shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dossier Archive</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col justify-center">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Launch Startup Validation
          </h1>
          <p className="text-xs sm:text-sm text-primary-secondary mt-2 leading-relaxed">
            Specify your concept, problem statement, and intended differentiator. SIRA autonomously crawls 20+ sources and builds your investment dossier in 90 seconds.
          </p>
        </div>

        <IdeaInputForm onSubmit={handleStartResearch} isLoading={loading} />
      </main>
    </div>
  );
};
