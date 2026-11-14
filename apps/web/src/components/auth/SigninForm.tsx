import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuth } from '../../state/AuthContext';
import { Mail, Lock, KeyRound, ArrowRight, Loader2 } from 'lucide-react';

interface SigninFormProps {
  onSwitchToSignup: () => void;
}

export const SigninForm: React.FC<SigninFormProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().replace(/\s+/g, '');
    if (cleanCode.length !== 6) {
      setError('Please enter the 6-digit code from Google Authenticator.');
      return;
    }

    setLoading(true);
    try {
      const resp = await authApi.signin({
        email,
        password,
        code: cleanCode,
      });
      login(resp.access_token, resp.user);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Invalid email, password, or TOTP code.';
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
        <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address</label>
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
            placeholder="••••••••"
            className="w-full bg-[#12131a] border border-zinc-800 focus:border-zinc-600 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-zinc-300">Google Authenticator Code</label>
          <span className="text-[11px] text-zinc-500 font-mono">6 DIGITS</span>
        </div>
        <div className="relative">
          <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full bg-[#12131a] border border-zinc-800 focus:border-zinc-600 rounded px-3 py-2 pl-9 text-xs font-mono tracking-widest text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || code.length !== 6}
        className="w-full mt-2 py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-900 rounded text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Sign in to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>

      <div className="pt-4 text-center border-t border-zinc-800/80">
        <span className="text-xs text-zinc-500">Need an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-xs text-zinc-300 hover:text-white font-medium underline transition"
        >
          Sign up with 2FA
        </button>
      </div>
    </form>
  );
};
