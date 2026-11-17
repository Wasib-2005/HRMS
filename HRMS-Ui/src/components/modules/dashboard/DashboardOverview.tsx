"use client";

import { useAuth } from "@/hooks/useAuth";
import EmployeeDashboard from "./EmployeeDashboard";
import HRDashboard from "./HRDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardOverview() {
  const { role, isEmployee, isHR, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner text-sky-500"></span>
      </div>
    );
  }

  // Strictly segregated dashboards by role
  if (role === "Employee" || isEmployee) {
    return <EmployeeDashboard />;
  }

  if (role === "HR" || isHR) {
    return <HRDashboard />;
  }

  return <AdminDashboard />;
}
