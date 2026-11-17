import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resignation | EuITSols HRMS",
};

export default function ResignationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Resignation & Notice</h2>
        <p className="text-xs text-slate-500">Initiate formal notice period and track handover process</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Resignation requests and notice timeline will appear here.
      </div>
    </div>
  );
}
