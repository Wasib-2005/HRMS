import { Metadata } from "next";
import EmployeePayslipView from "@/components/modules/payslip/EmployeePayslipView";
import RoleGuard from "@/components/guards/RoleGuard";

export const instant = false;

export const metadata: Metadata = {
  title: "Payslip | EuITSols HRMS",
};

export default function PayslipPage() {
  return (
    <RoleGuard allowedRoles={["Employee"]}>
      <EmployeePayslipView />
    </RoleGuard>
  );
}
