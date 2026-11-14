import React, { useEffect, useState } from 'react';
import { Search, Cpu, Globe, Brain, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PipelineStepperProps {
  researchId: string;
  initialStep?: string | null;
  initialProgress?: number;
  onCompleted: () => void;
  onFailed: (error: string) => void;
}

interface StepInfo {
  id: string;
  label: string;
  service: string;
  targetProgress: number;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepInfo[] = [
  {
    id: 'search',
    label: 'Query Expansion & Metasearch',
    service: 'SearXNG',
    targetProgress: 15,
    icon: Search,
  },
  {
    id: 'classify',
    label: 'Signal & Intent Classification',
    service: 'TypeSafe Jev',
    targetProgress: 40,
    icon: Cpu,
  },
  {
    id: 'scrape',
    label: 'Headless Web Content Scraping',
    service: 'Crawl4AI',
    targetProgress: 65,
    icon: Globe,
  },
  {
    id: 'synthesize',
    label: 'Venture & Risk Modeling',
    service: 'Claude',
    targetProgress: 85,
    icon: Brain,
  },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  researchId,
  initialStep,
  initialProgress = 0,
  onCompleted,
  onFailed,
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [currentStep, setCurrentStep] = useState(initialStep || 'Initializing research pipeline...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const sseUrl = `${apiBase}/research/${researchId}/stream?token=${encodeURIComponent(token)}`;

    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('progress', (e) => {
      try {
        const payload = JSON.parse(e.data);
        const newProgress = Number(payload.progress) || 0;
        setProgress(newProgress);
        if (payload.current_step) {
          setCurrentStep(payload.current_step);
        }

        if (payload.status === 'completed') {
          eventSource.close();
          onCompleted();
        } else if (payload.status === 'failed') {
          eventSource.close();
          setErrorMessage(payload.error_message || 'Research pipeline encountered an error.');
          onFailed(payload.error_message || 'Research failed');
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.warn('SSE connection error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [researchId, onCompleted, onFailed]);

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-card relative overflow-hidden transition-all">
      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border-subtle text-xs font-mono text-accent-indigo mb-3">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>PIPELINE RUNNING</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
          Validating Startup Concept
        </h2>
        <p className="text-xs sm:text-sm text-primary-secondary mt-1 max-w-md mx-auto leading-relaxed">
          The agent is searching, classifying, scraping, and analyzing market signals. This typically takes 20 to 35 seconds.
        </p>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-primary-secondary font-medium truncate max-w-xs">{currentStep}</span>
          <span className="text-accent-indigo font-bold ml-2">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-surface-raised border border-border-subtle rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="bg-accent-indigo h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Pipeline Error</div>
            <div className="mt-0.5">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* 4-Stage Stepper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = progress > step.targetProgress;
          const isActive = progress >= step.targetProgress - 15 && progress <= step.targetProgress;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-surface-raised border-accent-indigo/30 text-primary'
                  : isActive
                  ? 'bg-surface-raised border-accent-indigo/60 text-primary shadow-sm'
                  : 'bg-surface border-border-subtle text-primary-muted opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      isDone
                        ? 'bg-accent-indigo/20 text-accent-indigo'
                        : isActive
                        ? 'bg-accent-indigo/20 text-accent-indigo'
                        : 'bg-surface-raised text-primary-muted'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold">{step.label}</span>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-accent-indigo shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 text-accent-indigo animate-spin shrink-0" />
                ) : null}
              </div>
              <div className="text-[11px] font-mono text-primary-muted flex items-center justify-between">
                <span>{step.service}</span>
                <span>{step.targetProgress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
