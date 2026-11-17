"use client";

import { useEffect, useState } from "react";
import { departmentService } from "@/services/department.service";
import { DepartmentInterface } from "@/types/department.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Can from "@/components/guards/Can";
import { FaPlus } from "react-icons/fa6";

export default function DepartmentTable() {
  const [departments, setDepartments] = useState<DepartmentInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll();
      setDepartments(res?.data || []);
    } catch {
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: Column<DepartmentInterface>[] = [
    {
      header: "Code",
      accessorKey: "dept_id",
      cell: (row) => <span className="font-mono font-bold text-sky-600">{row.dept_id}</span>,
    },
    {
      header: "Department Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          {row.description && <p className="text-xs text-slate-500">{row.description}</p>}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <Badge status={row.status} />,
    },
    {
      header: "Created Date",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Departments</h2>
          <p className="text-xs text-slate-500">Manage company organizational units & divisions</p>
        </div>

        <Can permission="createDepartment">
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition">
            <FaPlus className="text-xs" />
            Add Department
          </button>
        </Can>
      </div>

      <DataTable columns={columns} data={departments} isLoading={loading} emptyMessage="No departments found." />
    </div>
  );
}
