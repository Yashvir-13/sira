import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxGridProps {
  children: React.ReactNode;
}

export const ParallaxGrid: React.FC<ParallaxGridProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Parallax layer scrubs at ~18% speed of the foreground content
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-clip">
      {/* Parallax Background Grid Layer - strictly bounded in an overflow-hidden wrapper */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <motion.div
          style={{ y: gridY }}
          className="absolute inset-x-0 -top-24 h-[120%] w-full opacity-60 dark:opacity-45"
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="architectural-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  className="text-zinc-400/70 dark:text-zinc-700/80"
                />
              </pattern>
              {/* Subtle Linear Vignette to keep grid active across entire page for glass refraction */}
              <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#fff" stopOpacity="1" />
                <stop offset="70%" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.4" />
              </linearGradient>
              <mask id="grid-mask-full">
                <rect width="100%" height="100%" fill="url(#grid-fade)" />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#architectural-grid)"
              mask="url(#grid-mask-full)"
            />
          </svg>
        </motion.div>

        {/* Ambient Neutral Light Emitters for Rich Glass Refraction (Zero Neon, Pure Neutral Zinc) */}
        {/* Hero Ambient Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[760px] h-[380px] bg-zinc-300/40 dark:bg-zinc-700/25 blur-[140px] rounded-full pointer-events-none" />

        {/* Founder's Dilemma Ambient Glow */}
        <div className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[820px] h-[360px] bg-zinc-300/35 dark:bg-zinc-800/30 blur-[130px] rounded-full pointer-events-none" />

        {/* Pipeline Architecture Ambient Glow */}
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-zinc-300/30 dark:bg-zinc-700/20 blur-[150px] rounded-full pointer-events-none" />

        {/* Conversion Banner Ambient Glow */}
        <div className="absolute top-[88%] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-zinc-400/30 dark:bg-zinc-600/20 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* Foreground Children */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
