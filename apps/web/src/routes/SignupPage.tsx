import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitAuthLayout } from '../components/auth/SplitAuthLayout';
import { SignupStep1Form } from '../components/auth/SignupStep1Form';
import { SignupStep2Form } from '../components/auth/SignupStep2Form';
import type { SignupStep1Response } from '../types';
import { CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [step1Data, setStep1Data] = useState<SignupStep1Response | null>(null);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  return (
    <SplitAuthLayout
      title={step1Data ? "Verify Authenticator App" : "Create your SIRA account"}
      subtitle={
        step1Data
          ? "Scan the QR code with Google Authenticator or Microsoft Authenticator, then enter the 6-digit code."
          : "Sign up with your work email and set up 2-Factor Authentication (TOTP)."
      }
    >
      {registered ? (
        <div className="bg-[#12131a] border border-emerald-500/30 p-6 rounded text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Registration Complete</h3>
            <p className="text-xs text-zinc-400">
              Your account has been verified with 2-Factor Authentication.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded text-xs font-semibold transition"
          >
            Sign in with 2FA
          </button>
        </div>
      ) : step1Data ? (
        <SignupStep2Form
          step1Data={step1Data}
          onBack={() => setStep1Data(null)}
          onComplete={() => setRegistered(true)}
        />
      ) : (
        <SignupStep1Form
          onSuccess={(data) => setStep1Data(data)}
          onSwitchToLogin={() => navigate('/login')}
        />
      )}
    </SplitAuthLayout>
  );
};
