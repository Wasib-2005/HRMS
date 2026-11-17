"use client";

import { useEffect, useState } from "react";
import { shiftService } from "@/services/shift.service";
import { ShiftInterface } from "@/types/shift.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Can from "@/components/guards/Can";
import { FaPlus, FaClock } from "react-icons/fa6";

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface ShiftTableProps {
  myShiftOnly?: boolean;
}

export default function ShiftTable({ myShiftOnly = false }: ShiftTableProps) {
  const [shifts, setShifts] = useState<ShiftInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const loadShifts = async () => {
    setLoading(true);
    try {
      const res = await shiftService.getAll();
      setShifts(res?.data || []);
    } catch {
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const columns: Column<ShiftInterface>[] = [
    {
      header: "Shift Title",
      accessorKey: "shiftTitle",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <FaClock className="text-sm" />
          </div>
          <span className="font-semibold text-slate-900">{row.shiftTitle}</span>
        </div>
      ),
    },
    {
      header: "Working Hours",
      cell: (row) => (
        <span className="font-mono text-xs">
          {row.startAt} — {row.endAt}
        </span>
      ),
    },
    {
      header: "Weekly Off-Day",
      cell: (row) => <span className="font-medium text-amber-600">{DAYS[row.offDay] || "None"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <Badge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {myShiftOnly ? "My Shift Schedule" : "Shift Management"}
          </h2>
          <p className="text-xs text-slate-500">
            {myShiftOnly ? "Your designated daily work hours and weekly rest day" : "Configure organizational work hours and designated off-days"}
          </p>
        </div>

        {!myShiftOnly && (
          <Can permission="createShift">
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition">
              <FaPlus className="text-xs" />
              Create Shift
            </button>
          </Can>
        )}
      </div>

      <DataTable columns={columns} data={shifts} isLoading={loading} emptyMessage="No shifts configured." />
    </div>
  );
}
