import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import { PlusCircle, History, Shield, LogOut, Sparkles } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#0c0d14] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      {/* Top Brand Section */}
      <div>
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-xs text-emerald-400">
              S
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-sm">SIRA</span>
              <span className="text-[10px] text-zinc-500 font-mono ml-1.5">INTELLIGENCE</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`
            }
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>New Research</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`
            }
          >
            <History className="w-4 h-4 text-zinc-400" />
            <span>Research Archive</span>
          </NavLink>

          {/* Admin link visible only to admins */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition ${
                  isActive
                    ? 'bg-zinc-800 text-amber-300 font-semibold'
                    : 'text-amber-400/80 hover:text-amber-300 hover:bg-zinc-900/60'
                }`
              }
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* Pipeline Status Indicator */}
      <div className="p-3 mx-3 mb-2 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Pipeline</span>
        </div>
        <div className="text-[10px] text-zinc-500 leading-tight">
          SearXNG &bull; Jev &bull; Crawl4AI &bull; Claude 3.5/4.5
        </div>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#0a0b10]">
        <div className="flex items-center justify-between p-2 rounded hover:bg-zinc-900/50 transition">
          <div className="truncate mr-2">
            <div className="text-xs font-medium text-zinc-200 truncate">{user?.email}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                  user?.role === 'admin'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {user?.role}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">2FA ACTIVE</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
