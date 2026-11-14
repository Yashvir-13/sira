import React from 'react';
import { UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

export const UserRoster: React.FC = () => {
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
    <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-card transition-all">
      <div className="p-5 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-accent-indigo" />
          <h3 className="text-sm font-bold text-primary tracking-tight">Security & RBAC User Roster</h3>
        </div>
        <span className="text-xs font-mono text-primary-muted">
          {users.length} IDENTITIES
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-raised text-primary-secondary font-mono text-[11px] border-b border-border-subtle">
            <tr>
              <th className="py-3 px-4">Account Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">2FA State</th>
              <th className="py-3 px-4">Account Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-primary-secondary">
            {users.map((u, idx) => (
              <tr key={idx} className="hover:bg-surface-raised/50 transition">
                <td className="py-3.5 px-4 font-semibold text-primary">
                  {u.email}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase font-medium ${
                      u.role === 'admin'
                        ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/30'
                        : 'bg-surface-raised text-primary-muted border-border-subtle'
                    }`}
                  >
                    {u.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-mono text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2 py-0.5 rounded-full font-semibold">
                    ACTIVE
                  </span>
                </td>
                <td className="py-3.5 px-4 text-primary-muted text-xs">
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
