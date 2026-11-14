import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitAuthLayout } from '../components/auth/SplitAuthLayout';
import { SigninForm } from '../components/auth/SigninForm';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SplitAuthLayout
      title="Welcome back to SIRA"
      subtitle="Enter your credentials and the 6-digit TOTP code from your authenticator app to access your research workspace."
    >
      <SigninForm onSwitchToSignup={() => navigate('/signup')} />
    </SplitAuthLayout>
  );
};
