import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Settings | EuITSols HRMS",
};

export default function SystemSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
        <p className="text-xs text-slate-500">Configure global platform configurations and integrations</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Platform preferences, mail servers, and API settings will appear here.
      </div>
    </div>
  );
}
