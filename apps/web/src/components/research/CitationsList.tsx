import React, { useState } from 'react';
import type { Citation } from '../../types';
import { Link2, ExternalLink, Search } from 'lucide-react';

interface CitationsListProps {
  citations?: Citation[];
}

export const CitationsList: React.FC<CitationsListProps> = ({ citations = [] }) => {
  const [query, setQuery] = useState('');

  if (!citations || citations.length === 0) return null;

  const filtered = citations.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.relevant_claim.toLowerCase().includes(query.toLowerCase()) ||
      (c.url && c.url.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-card transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-bold text-primary tracking-tight">Verified Evidence & Citations</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-primary-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter sources..."
              className="pl-8 pr-3 py-1 text-xs bg-surface-raised border border-border-subtle rounded-lg text-primary placeholder:text-primary-muted focus:outline-none focus:border-border-prominent w-40 sm:w-48 transition"
            />
          </div>
          <span className="text-xs font-mono text-primary-muted whitespace-nowrap">
            {citations.length} SOURCES
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-xs text-primary-muted font-mono">
            No citations match your filter.
          </div>
        ) : (
          filtered.map((cite, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-surface-raised border border-border-subtle rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 hover:border-border-prominent transition"
            >
              <div className="space-y-1">
                <div className="text-xs font-semibold text-primary">{cite.title}</div>
                <div className="text-[11px] text-primary-secondary italic leading-relaxed">
                  "{cite.relevant_claim}"
                </div>
              </div>
              {cite.url && (
                <a
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle hover:border-border-prominent text-xs text-primary-secondary hover:text-primary shrink-0 font-mono transition"
                >
                  <span>Visit Source</span>
                  <ExternalLink className="w-3 h-3 text-primary-muted" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
