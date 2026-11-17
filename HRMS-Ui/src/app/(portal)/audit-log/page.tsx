import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Log | EuITSols HRMS",
};

export default function AuditLogPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Audit Log</h2>
        <p className="text-xs text-slate-500">Security history and administrative event logs</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        System access and mutation logs will appear here.
      </div>
    </div>
  );
}
