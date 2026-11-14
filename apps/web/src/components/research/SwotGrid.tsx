import React from 'react';
import type { SwotAnalysis } from '../../types';
import { Shield, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

interface SwotGridProps {
  swot?: SwotAnalysis;
}

export const SwotGrid: React.FC<SwotGridProps> = ({ swot }) => {
  if (!swot) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-card transition-all">
        <div className="flex items-center gap-2 mb-3 text-accent-emerald">
          <Shield className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Strengths & Moats</h4>
        </div>
        <ul className="space-y-2 text-xs text-primary-secondary">
          {swot.strengths?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent-emerald font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-card transition-all">
        <div className="flex items-center gap-2 mb-3 text-accent-amber">
          <AlertTriangle className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Internal Weaknesses</h4>
        </div>
        <ul className="space-y-2 text-xs text-primary-secondary">
          {swot.weaknesses?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent-amber font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-card transition-all">
        <div className="flex items-center gap-2 mb-3 text-accent-indigo">
          <TrendingUp className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Market Opportunities</h4>
        </div>
        <ul className="space-y-2 text-xs text-primary-secondary">
          {swot.opportunities?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent-indigo font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Threats */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-card transition-all">
        <div className="flex items-center gap-2 mb-3 text-accent-rose">
          <ShieldAlert className="w-4 h-4" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">External Threats</h4>
        </div>
        <ul className="space-y-2 text-xs text-primary-secondary">
          {swot.threats?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent-rose font-bold shrink-0">&bull;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
