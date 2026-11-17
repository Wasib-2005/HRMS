"use client";

import { useAuth } from "@/hooks/useAuth";

export default function ProfileClient() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
        <p className="text-xs text-slate-500">Manage your personal credentials and view assigned privileges</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Display Name</label>
            <p className="font-semibold text-slate-800">{user?.name || "N/A"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <p className="font-semibold text-slate-800">{user?.email}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">System Role</label>
            <p className="font-semibold text-sky-600">{role}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Account ID</label>
            <p className="font-mono text-xs text-slate-500">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
