import React from 'react';
import { motion } from 'motion/react';

interface BrandedPageLoaderProps {
  label?: string;
  sublabel?: string;
}

export const BrandedPageLoader: React.FC<BrandedPageLoaderProps> = ({
  label = 'INITIALIZING WORKSPACE...',
  sublabel = 'Syncing cryptographic session with secure gateway',
}) => {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col items-center justify-center p-6 transition-colors">
      <div className="relative flex flex-col items-center space-y-6 max-w-sm text-center">
        {/* Animated Brand Emblem */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Subtle Outer Pulsing Ring */}
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-2xl bg-zinc-900 dark:bg-zinc-100"
          />

          {/* Rotating Dashed Accent Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -inset-2 rounded-2xl border border-dashed border-border-prominent pointer-events-none"
          />

          {/* Central S Mark */}
          <div className="relative w-12 h-12 rounded-xl bg-surface-raised border border-border-prominent flex items-center justify-center font-bold text-lg text-primary shadow-md">
            <span className="tracking-tight">S</span>
          </div>
        </div>

        {/* Monospace Status Typography */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold tracking-wider text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span>{label}</span>
          </div>
          <p className="text-[11px] text-primary-muted font-mono leading-relaxed">
            {sublabel}
          </p>
        </div>

        {/* Minimal Scrubbing Progress Line */}
        <div className="w-36 h-0.5 rounded-full bg-surface-raised overflow-hidden border border-border-subtle">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1/2 h-full bg-primary rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
