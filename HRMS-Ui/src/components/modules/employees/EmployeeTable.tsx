"use client";

import { useEffect, useState } from "react";
import { employeeService } from "@/services/employee.service";
import { AuthUser } from "@/types/auth.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Can from "@/components/guards/Can";
import { FaUserPlus, FaUserTie } from "react-icons/fa6";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAll();
      setEmployees(res?.data || []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const columns: Column<AuthUser>[] = [
    {
      header: "Employee",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
            {row.name ? row.name[0].toUpperCase() : <FaUserTie />}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name || "Employee"}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (row) => (
        <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200">
          {row.role || "Staff"}
        </span>
      ),
    },
    {
      header: "Joined Date",
      cell: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Employee Directory</h2>
          <p className="text-xs text-slate-500">View and manage company staff members</p>
        </div>

        <Can permission="createEmployee">
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition">
            <FaUserPlus className="text-xs" />
            Add Employee
          </button>
        </Can>
      </div>

      <DataTable columns={columns} data={employees} isLoading={loading} emptyMessage="No employees found." />
    </div>
  );
}
