import { Metadata } from "next";
import RoleGuard from "@/components/guards/RoleGuard";
import RoleTable from "@/components/modules/roles/RoleTable";

export const metadata: Metadata = {
  title: "Roles & Permissions | EuITSols HRMS",
};

export default function RolesPage() {
  return (
    <RoleGuard allowedRoles={["Admin"]}>
      <RoleTable />
    </RoleGuard>
  );
}
