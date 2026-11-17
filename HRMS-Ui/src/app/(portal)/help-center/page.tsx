import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center | EuITSols HRMS",
};

export default function HelpCenterPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Help Center</h2>
        <p className="text-xs text-slate-500">Guides, policies, and ticketing for support</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        Frequently asked questions and support contact details will appear here.
      </div>
    </div>
  );
}
