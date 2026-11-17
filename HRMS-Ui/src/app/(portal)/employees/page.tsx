import { Metadata } from "next";
import RoleGuard from "@/components/guards/RoleGuard";
import EmployeeTable from "@/components/modules/employees/EmployeeTable";

export const metadata: Metadata = {
  title: "Employee Directory | EuITSols HRMS",
};

export default function EmployeesPage() {
  return (
    <RoleGuard allowedRoles={["Admin", "HR"]}>
      <EmployeeTable />
    </RoleGuard>
  );
}
