import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import type { SignupStep1Response } from '../../types';
import { ShieldCheck, Copy, Check, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

interface SignupStep2FormProps {
  step1Data: SignupStep1Response;
  onBack: () => void;
  onComplete: () => void;
}

export const SignupStep2Form: React.FC<SignupStep2FormProps> = ({
  step1Data,
  onBack,
  onComplete,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(step1Data.totp_secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) {
      setError('Please enter the 6-digit code from your authenticator app.');
      return;
    }

    setLoading(true);
    try {
      await authApi.signupStep2({
        email: step1Data.email,
        code: cleanCode,
      });
      onComplete();
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Invalid TOTP code. Please check your authenticator clock.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          STEP 2 OF 2
        </span>
      </div>

      {error && (
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
          {error}
        </div>
      )}

      {/* QR Code Frame */}
      <div className="bg-[#12131a] border border-zinc-800 rounded p-4 flex flex-col items-center text-center">
        <div className="bg-white p-3 rounded shadow-inner mb-3">
          <img
            src={step1Data.qrCode}
            alt="Authenticator TOTP QR Code"
            className="w-44 h-44 object-contain"
          />
        </div>
        <p className="text-xs text-zinc-300 font-medium">Scan with Google Authenticator or Microsoft Authenticator</p>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
          Open your authenticator app, tap the '+' icon, and point your camera at this QR code.
        </p>

        {/* Manual Secret Key */}
        <div className="mt-3 w-full pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono bg-zinc-950/60 px-3 py-1.5 rounded">
          <div className="text-zinc-400 truncate mr-2">
            KEY: <span className="text-zinc-200 font-bold select-all">{step1Data.totp_secret}</span>
          </div>
          <button
            type="button"
            onClick={handleCopySecret}
            className="text-zinc-400 hover:text-zinc-200 p-1 shrink-0 transition"
            title="Copy manual secret key"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Verification Code Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Enter 6-Digit Authenticator Code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-[#12131a] border border-zinc-800 focus:border-zinc-600 rounded px-3 py-2.5 text-center text-lg font-mono tracking-widest text-white placeholder:text-zinc-700 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying 2FA Code...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify & Complete Registration</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
