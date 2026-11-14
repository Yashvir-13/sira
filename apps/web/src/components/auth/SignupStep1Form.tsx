import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import type { SignupStep1Response } from '../../types';
import { KeyRound, Mail, Lock, ArrowRight, Loader2, Check } from 'lucide-react';

interface SignupStep1FormProps {
  onSuccess: (data: SignupStep1Response) => void;
  onSwitchToLogin: () => void;
}

export const SignupStep1Form: React.FC<SignupStep1FormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const resp = await authApi.signupStep1({
        email,
        password,
        confirm_password: confirmPassword,
      });
      onSuccess(resp);
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-lg bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs leading-relaxed">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-primary mb-1.5">Work Email</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-primary-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="founder@company.com"
            className="w-full bg-surface-raised border border-border-subtle focus:border-border-prominent rounded-lg px-3 py-2.5 pl-9 text-xs text-primary placeholder:text-primary-muted focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-primary mb-1.5">Password</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-primary-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full bg-surface-raised border border-border-subtle focus:border-border-prominent rounded-lg px-3 py-2.5 pl-9 text-xs text-primary placeholder:text-primary-muted focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-primary">Confirm Password</label>
          {passwordsMatch && (
            <span className="text-[11px] font-mono text-accent-emerald flex items-center gap-1">
              <Check className="w-3 h-3" /> Passwords match
            </span>
          )}
        </div>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-primary-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full bg-surface-raised border border-border-subtle focus:border-border-prominent rounded-lg px-3 py-2.5 pl-9 text-xs text-primary placeholder:text-primary-muted focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 py-2.5 px-4 bg-accent-emerald hover:opacity-95 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Generating 2FA Secret...</span>
          </>
        ) : (
          <>
            <span>Proceed to 2FA Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      <div className="pt-4 text-center border-t border-border-subtle">
        <span className="text-xs text-primary-muted">Already registered? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-primary hover:text-accent-emerald font-medium underline transition"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
