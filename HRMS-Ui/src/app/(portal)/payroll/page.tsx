import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payroll | EuITSols HRMS",
};

export default function PayrollPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Payroll</h2>
        <p className="text-xs text-slate-500">Manage salary processing, tax deductions, and disbursements</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Monthly payroll cycles will appear here.
      </div>
    </div>
  );
}
