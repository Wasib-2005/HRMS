import { Metadata } from "next";
import RoleGuard from "@/components/guards/RoleGuard";
import DepartmentTable from "@/components/modules/departments/DepartmentTable";

export const metadata: Metadata = {
  title: "Departments | EuITSols HRMS",
};

export default function DepartmentsPage() {
  return (
    <RoleGuard allowedRoles={["Admin", "HR"]}>
      <DepartmentTable />
    </RoleGuard>
  );
}
