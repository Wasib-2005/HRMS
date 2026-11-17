import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | EuITSols HRMS",
};

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-xs text-slate-500">Preferences, notification settings, and password updates</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Account settings and notification preferences will appear here.
      </div>
    </div>
  );
}
