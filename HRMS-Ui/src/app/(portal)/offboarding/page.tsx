import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offboarding | EuITSols HRMS",
};

export default function OffboardingPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Offboarding</h2>
        <p className="text-xs text-slate-500">Manage asset returns, clearances, and departure workflows</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Active offboarding workflows will appear here.
      </div>
    </div>
  );
}
