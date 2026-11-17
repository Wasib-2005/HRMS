import { Metadata } from "next";
import RoleGuard from "@/components/guards/RoleGuard";
import ShiftTable from "@/components/modules/shifts/ShiftTable";

export const metadata: Metadata = {
  title: "Shift Management | EuITSols HRMS",
};

export default function ShiftsPage() {
  return (
    <RoleGuard allowedRoles={["Admin", "HR"]}>
      <ShiftTable myShiftOnly={false} />
    </RoleGuard>
  );
}
