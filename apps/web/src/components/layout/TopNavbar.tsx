import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../state/ThemeContext';
import { useAuth } from '../../state/AuthContext';
import { Sun, Moon, Menu, LogOut, Shield, ChevronRight } from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Derive readable breadcrumb path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Studio', to: '/' }];
    if (path === '/history') return [{ label: 'Studio', to: '/' }, { label: 'Archive', to: '/history' }];
    if (path.startsWith('/research/')) {
      return [
        { label: 'Archive', to: '/history' },
        { label: 'Dossier', to: path },
      ];
    }
    if (path === '/admin') {
      return [{ label: 'Studio', to: '/' }, { label: 'Admin Console', to: '/admin' }];
    }
    return [{ label: 'Home', to: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border-subtle bg-background/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors shadow-sm">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="p-1.5 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-raised transition md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-primary-muted">
          <Link to="/" className="hover:text-primary font-semibold text-primary transition tracking-tight">
            SIRA
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-primary-muted/60" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-primary font-medium">{crumb.label}</span>
              ) : (
                <Link to={crumb.to} className="hover:text-primary transition">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Theme Toggle & User Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg text-primary-secondary hover:text-primary hover:bg-surface-raised border border-border-subtle transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-accent-amber transition-transform duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-accent-indigo transition-transform duration-200" />
          )}
        </button>

        {/* User Profile Pill */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-medium text-primary leading-tight truncate max-w-[140px]">
                {user.email}
              </span>
              <span className="text-[10px] font-mono text-primary-muted flex items-center justify-end gap-1">
                {user.role === 'admin' ? (
                  <span className="inline-flex items-center gap-0.5 text-accent-amber font-semibold">
                    <Shield className="w-2.5 h-2.5" /> ADMIN
                  </span>
                ) : (
                  'MEMBER'
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-primary-muted hover:text-accent-rose hover:bg-accent-rose/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
            <Link
              to="/login"
              className="text-xs font-medium text-primary-secondary hover:text-primary px-2.5 py-1.5 transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs font-medium text-white bg-accent-indigo hover:opacity-95 px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
