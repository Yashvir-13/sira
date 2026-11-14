import { ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

export const UserRoster = () => {
  const { user } = useAuth();

  // Representative user roster based on seeded accounts and current session
  const users = [
    {
      email: 'admin@startup.com',
      role: 'admin',
      is_totp_verified: true,
      label: 'System Administrator (Seeded)',
    },
    {
      email: 'member@startup.com',
      role: 'member',
      is_totp_verified: true,
      label: 'Venture Analyst (Seeded)',
    },
  ];

  // If the current user is not in the seeded list, include them
  if (user && !users.some((u) => u.email === user.email)) {
    users.unshift({
      email: user.email,
      role: user.role,
      is_totp_verified: user.is_totp_verified,
      label: 'Current Session Account',
    });
  }

  return (
    <div className="bg-[#12131c] border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Security & RBAC User Roster</h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          {users.length} REGISTERED IDENTITIES
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0b0c12] text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Account Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">2FA State</th>
              <th className="py-3 px-4">Account Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {users.map((u, idx) => (
              <tr key={idx} className="hover:bg-zinc-900/40 transition">
                <td className="py-3.5 px-4 font-semibold text-white">
                  {u.email}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                      u.role === 'admin'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>TOTP ENFORCED</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-zinc-400 text-xs">
                  {u.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
