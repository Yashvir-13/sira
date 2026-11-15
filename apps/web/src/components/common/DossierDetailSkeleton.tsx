import React from 'react';
import { motion } from 'motion/react';

export const DossierDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Toolbar Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-3">
        <div className="h-4 w-32 rounded bg-surface-raised animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 rounded-lg bg-surface-raised animate-pulse" />
          <div className="h-8 w-24 rounded-lg bg-surface-raised animate-pulse" />
          <div className="h-8 w-20 rounded-lg bg-surface-raised animate-pulse" />
        </div>
      </div>

      {/* Hero Header Card Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card rounded-2xl p-6 sm:p-8 shadow-card space-y-4"
      >
        <div className="flex items-center gap-2">
          <div className="h-5 w-32 rounded-full bg-surface-raised animate-pulse" />
          <div className="h-4 w-24 rounded bg-surface-raised animate-pulse" />
        </div>

        <div className="h-8 w-1/2 rounded-lg bg-surface-raised animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-surface-raised/70 animate-pulse" />

        {/* KPI Triad Placeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-raised border border-border-subtle space-y-2">
              <div className="h-3 w-16 rounded bg-surface animate-pulse" />
              <div className="h-7 w-24 rounded bg-surface animate-pulse" />
              <div className="h-3 w-28 rounded bg-surface/70 animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation Placeholder */}
      <div className="flex gap-2 border-b border-border-subtle pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-32 rounded-lg bg-surface-raised animate-pulse" />
        ))}
      </div>

      {/* Tab Content Box Placeholder */}
      <div className="h-64 rounded-2xl bg-surface border border-border-subtle p-6 animate-pulse" />
    </div>
  );
};
