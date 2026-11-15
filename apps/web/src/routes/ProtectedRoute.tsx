import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { BrandedPageLoader } from '../components/common/BrandedPageLoader';

export const ProtectedRoute: React.FC = () => {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <BrandedPageLoader
        label="VERIFYING CREDENTIALS..."
        sublabel="Validating cryptographic JWT session with secure gateway"
      />
    );
  }

  if (!token || !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  return <Outlet />;
};
