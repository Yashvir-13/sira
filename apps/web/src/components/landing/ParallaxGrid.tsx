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
    <div ref={containerRef} className="relative min-h-screen overflow-x-clip">
      {/* Parallax Background Grid Layer */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-0 -top-24 h-[120%] w-full z-0 opacity-40 dark:opacity-30"
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
                className="text-zinc-400 dark:text-zinc-700"
              />
            </pattern>
            {/* Radial Vignette Mask */}
            <radialGradient id="grid-mask" cx="50%" cy="25%" r="60%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="60%" stopColor="#fff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="radial-spotlight-mask">
              <rect width="100%" height="100%" fill="url(#grid-mask)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#architectural-grid)"
            mask="url(#radial-spotlight-mask)"
          />
        </svg>
      </motion.div>

      {/* Subtle Ambient Radial Horizon Light in Center (Zero Neon, Pure Neutral Soft Light) */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-zinc-200/40 dark:bg-zinc-800/20 blur-[130px] rounded-full -z-10" />

      {/* Foreground Children */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
