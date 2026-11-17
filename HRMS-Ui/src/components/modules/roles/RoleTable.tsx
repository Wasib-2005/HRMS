"use client";

import { useEffect, useState } from "react";
import { roleService } from "@/services/role.service";
import { RoleInterface } from "@/types/role.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Can from "@/components/guards/Can";
import { FaPlus, FaKey } from "react-icons/fa6";

export default function RoleTable() {
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await roleService.getAll();
      setRoles(res?.data || []);
    } catch {
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const columns: Column<RoleInterface>[] = [
    {
      header: "Role Name",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <span className="font-semibold text-slate-900 flex items-center gap-2">
            <FaKey className="text-amber-500 text-xs" />
            {row.name}
          </span>
          {row.description && <p className="text-xs text-slate-500">{row.description}</p>}
        </div>
      ),
    },
    {
      header: "Active Permissions",
      cell: (row) => {
        const count = Object.values(row.permissions || {}).filter(Boolean).length;
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            {count} / 39 permissions
          </span>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <Badge status={row.status || "active"} />,
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
          <h2 className="text-xl font-bold text-slate-900">Roles & Permissions</h2>
          <p className="text-xs text-slate-500">Configure role-based access control and system rights</p>
        </div>

        <Can permission="createRole">
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition">
            <FaPlus className="text-xs" />
            Create Role
          </button>
        </Can>
      </div>

      <DataTable columns={columns} data={roles} isLoading={loading} emptyMessage="No roles found." />
    </div>
  );
}
