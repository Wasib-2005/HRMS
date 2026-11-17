import { Metadata } from "next";
import RoleGuard from "@/components/guards/RoleGuard";

export const metadata: Metadata = {
  title: "Recycle Bin | EuITSols HRMS",
};

export default function RecycleBinPage() {
  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recycle Bin</h2>
          <p className="text-xs text-slate-500">Restore or permanently manage soft-deleted departments, roles, and assets</p>
        </div>

        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
          <p className="text-sm text-slate-500">Recycle bin items are ready to be queried and restored via API endpoints.</p>
        </div>
      </div>
    </RoleGuard>
  );
}
