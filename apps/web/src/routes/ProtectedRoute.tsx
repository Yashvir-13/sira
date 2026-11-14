import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-zinc-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
