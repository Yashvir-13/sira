import { useEffect, useState } from 'react';
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
  icon: any;
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
    service: 'Claude 3.5 / 4.5',
    targetProgress: 85,
    icon: Brain,
  },
];

export const PipelineStepper = ({
  researchId,
  initialStep,
  initialProgress = 0,
  onCompleted,
  onFailed,
}: PipelineStepperProps) => {
  const [progress, setProgress] = useState(initialProgress);
  const [currentStep, setCurrentStep] = useState(initialStep || 'Queuing research pipeline...');
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
    <div className="bg-[#10121a] border border-zinc-800/80 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-3">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>AUTONOMOUS PIPELINE IN PROGRESS</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Researching Your Startup Concept
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
          The agent is searching, classifying, scraping, and validating market assumptions.
          This typically takes 20 to 35 seconds.
        </p>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-zinc-300 font-medium truncate max-w-xs">{currentStep}</span>
          <span className="text-emerald-400 font-bold ml-2">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-[#08090d] border border-zinc-800 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <div className="font-semibold">Pipeline Error</div>
            <div className="mt-0.5 text-rose-200/90">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* 4-Stage Stepper Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = progress > step.targetProgress;
          const isActive = progress >= step.targetProgress - 15 && progress <= step.targetProgress;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isDone
                  ? 'bg-zinc-900/60 border-emerald-500/30 text-zinc-200'
                  : isActive
                  ? 'bg-[#141622] border-emerald-500/50 text-white shadow-sm'
                  : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isActive
                        ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold">{step.label}</span>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin shrink-0" />
                ) : null}
              </div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
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
