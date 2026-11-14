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
      const msg = err.response?.data?.detail || 'Invalid code. Please check your authenticator clock.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-primary-muted hover:text-primary flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-[11px] font-mono text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full border border-accent-emerald/30 font-semibold">
          STEP 2 OF 2
        </span>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs leading-relaxed">
          {error}
        </div>
      )}

      {/* QR Code Container */}
      <div className="bg-surface-raised border border-border-subtle rounded-2xl p-5 flex flex-col items-center text-center">
        <div className="bg-white p-3 rounded-xl shadow-card mb-3">
          <img
            src={step1Data.qrCode}
            alt="Authenticator TOTP QR Code"
            className="w-44 h-44 object-contain"
          />
        </div>
        <p className="text-xs text-primary font-medium">Scan with Google Authenticator or password manager</p>
        <p className="text-[11px] text-primary-muted mt-1 max-w-xs">
          Open your authenticator app and point your camera at this QR code.
        </p>

        {/* Manual Secret Key */}
        <div className="mt-4 w-full pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono bg-surface px-3 py-2 rounded-lg border border-border-subtle">
          <div className="text-primary-muted truncate mr-2">
            KEY: <span className="text-primary font-bold select-all">{step1Data.totp_secret}</span>
          </div>
          <button
            type="button"
            onClick={handleCopySecret}
            className="text-primary-muted hover:text-primary p-1 shrink-0 transition"
            title="Copy secret key"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Verification Code Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-primary mb-1.5">
            Enter 6-Digit Authenticator Code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-surface-raised border border-border-subtle focus:border-border-prominent rounded-lg px-3 py-2.5 text-center text-lg font-mono tracking-widest text-primary placeholder:text-primary-muted focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full py-2.5 px-4 bg-accent-emerald hover:opacity-95 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
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
