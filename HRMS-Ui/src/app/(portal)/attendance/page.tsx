import { Metadata } from "next";
import AttendanceOverview from "@/components/modules/attendance/AttendanceOverview";

export const instant = false;

export const metadata: Metadata = {
  title: "Attendance | EuITSols HRMS",
};

export default function AttendancePage() {
  return <AttendanceOverview />;
}
