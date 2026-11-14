import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import {
  PlusCircle,
  History,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user } = useAuth();

  const navItems = [
    {
      to: '/',
      end: true,
      label: 'New Research',
      icon: PlusCircle,
      accent: 'text-accent-indigo',
    },
    {
      to: '/history',
      end: false,
      label: 'Research Archive',
      icon: History,
      accent: 'text-primary-secondary',
    },
  ];

  if (user?.role === 'admin') {
    navItems.push({
      to: '/admin',
      end: false,
      label: 'Admin Console',
      icon: Shield,
      accent: 'text-accent-amber',
    });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Brand Section */}
      <div>
        <div className={`p-4 border-b border-border-subtle flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-prominent flex items-center justify-center font-bold text-sm text-accent-indigo shadow-sm">
              S
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-primary text-sm">SIRA</span>
                <span className="text-[10px] text-primary-muted font-mono tracking-wider">INTELLIGENCE</span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-primary-muted hover:text-primary rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-surface-raised text-primary font-semibold shadow-sm border border-border-subtle'
                      : 'text-primary-secondary hover:text-primary hover:bg-surface-raised/70'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.accent}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border-subtle space-y-2">
        {/* Connected Services Badge (only if expanded) */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-lg bg-surface-raised/60 border border-border-subtle text-[11px] font-mono text-primary-secondary">
            <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5 text-accent-emerald" />
              <span>Agent Pipeline</span>
            </div>
            <div className="text-[10px] text-primary-muted leading-tight">
              SearXNG &bull; Jev &bull; Crawl4AI &bull; Claude
            </div>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-raised border border-border-subtle transition"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-surface border-r border-border-subtle transition-all duration-200 select-none ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-subtle shadow-xl md:hidden transition-transform duration-200 select-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
