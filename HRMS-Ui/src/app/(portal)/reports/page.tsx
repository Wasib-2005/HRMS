import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports | EuITSols HRMS",
};

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Reports</h2>
        <p className="text-xs text-slate-500">Generate headcount analytics, payroll summaries, and turnover metrics</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Statistical and financial reports will appear here.
      </div>
    </div>
  );
}
