import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const AdminRoute: React.FC = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary-muted font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
          <span>Verifying role authorization...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-raised border border-border-subtle flex items-center justify-center mx-auto text-accent-amber shadow-sm">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-primary">Access Restricted</h2>
          <p className="text-xs text-primary-secondary mt-1">
            The administrative console is restricted to system administrators.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-raised hover:bg-surface border border-border-subtle text-primary rounded-lg text-xs font-semibold transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Studio</span>
        </Link>
      </div>
    );
  }

  return <Outlet />;
};
