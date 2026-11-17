"use client";

import { useAuth } from "@/hooks/useAuth";
import AttendanceView from "./AttendanceView";
import HRAttendanceView from "./HRAttendanceView";

export default function AttendanceOverview() {
  const { role, isEmployee, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner text-sky-500"></span>
      </div>
    );
  }

  // Personal punch sheet is strictly for Employee role
  if (role === "Employee" || isEmployee) {
    return <AttendanceView />;
  }

  // HR and Admin view organizational attendance roster & hardware devices
  return <HRAttendanceView />;
}
