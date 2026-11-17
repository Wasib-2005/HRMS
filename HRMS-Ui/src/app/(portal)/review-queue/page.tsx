import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Queue | EuITSols HRMS",
};

export default function ReviewQueuePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review Queue</h2>
        <p className="text-xs text-slate-500">Manage pending approvals and staff requests</p>
      </div>
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
        No pending items in the review queue.
      </div>
    </div>
  );
}
