import { Metadata } from "next";
import RoleGuard from "@/components/guards/RoleGuard";
import AssetTable from "@/components/modules/assets/AssetTable";

export const metadata: Metadata = {
  title: "Asset Inventory | EuITSols HRMS",
};

export default function AssetsPage() {
  return (
    <RoleGuard allowedRoles={["Admin", "HR"]}>
      <AssetTable myAssetsOnly={false} />
    </RoleGuard>
  );
}
