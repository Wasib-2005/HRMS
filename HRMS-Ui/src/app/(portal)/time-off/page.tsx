import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Off | EuITSols HRMS",
};

export default function TimeOffPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Time Off</h2>
        <p className="text-xs text-slate-500">Track company leave balances and scheduled time off</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Time off records and requests will appear here.
      </div>
    </div>
  );
}
