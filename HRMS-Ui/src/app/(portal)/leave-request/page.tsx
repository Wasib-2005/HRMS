import { Metadata } from "next";
import EmployeeLeaveRequestView from "@/components/modules/leave/EmployeeLeaveRequestView";
import RoleGuard from "@/components/guards/RoleGuard";

export const instant = false;

export const metadata: Metadata = {
  title: "Leave Request | EuITSols HRMS",
};

export default function LeaveRequestPage() {
  return (
    <RoleGuard allowedRoles={["Employee"]}>
      <EmployeeLeaveRequestView />
    </RoleGuard>
  );
}
