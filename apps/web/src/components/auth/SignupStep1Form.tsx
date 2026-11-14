import React, { useState } from 'react';
import { authApi } from '../../api/auth';
import type { SignupStep1Response } from '../../types';
import { KeyRound, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

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
      const msg = err.response?.data?.detail || 'Registration step 1 failed. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">Work Email</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="founder@startup.com"
            className="w-full bg-[#12131a] border border-zinc-800 focus:border-zinc-600 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full bg-[#12131a] border border-zinc-800 focus:border-zinc-600 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">Confirm Password</label>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full bg-[#12131a] border border-zinc-800 focus:border-zinc-600 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-900 rounded text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
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

      <div className="pt-4 text-center border-t border-zinc-800/80">
        <span className="text-xs text-zinc-500">Already registered? </span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-zinc-300 hover:text-white font-medium underline transition"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
