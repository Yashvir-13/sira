import React from 'react';
import { motion } from 'motion/react';

export const HistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.08 }}
          className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card"
        >
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-5 w-20 rounded-full bg-surface-raised animate-pulse" />
              <div className="h-5 w-24 rounded-full bg-surface-raised animate-pulse" />
              <div className="h-4 w-16 rounded bg-surface-raised animate-pulse" />
            </div>

            <div className="h-5 w-2/3 rounded-md bg-surface-raised animate-pulse" />
            <div className="h-3.5 w-4/5 rounded bg-surface-raised/70 animate-pulse" />
          </div>

          <div className="h-9 w-28 rounded-lg bg-surface-raised shrink-0 animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
};
