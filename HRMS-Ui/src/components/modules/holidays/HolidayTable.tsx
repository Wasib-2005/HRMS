"use client";

import { useEffect, useState } from "react";
import { holidayService } from "@/services/holiday.service";
import { HolidayInterface } from "@/types/holiday.types";
import DataTable, { Column } from "@/components/common/DataTable";
import Can from "@/components/guards/Can";
import { FaPlus, FaCalendarDay } from "react-icons/fa6";

export default function HolidayTable() {
  const [holidays, setHolidays] = useState<HolidayInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHolidays = async () => {
    setLoading(true);
    try {
      const res = await holidayService.getAll();
      setHolidays(res?.data || []);
    } catch {
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHolidays();
  }, []);

  const columns: Column<HolidayInterface>[] = [
    {
      header: "Holiday (English / বাংলা)",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <FaCalendarDay className="text-sm" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.titleEn}</p>
            <p className="text-xs text-slate-400 font-sans">{row.titleBn}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => (
        <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
          {row.type}
        </span>
      ),
    },
    {
      header: "Dates",
      cell: (row) => (
        <span className="text-xs font-mono">
          {new Date(row.startDate).toLocaleDateString()} — {new Date(row.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: (row) => <span className="text-xs text-slate-400">{row.notes || "-"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Holiday Calendar</h2>
          <p className="text-xs text-slate-500">Official company and national holidays</p>
        </div>

        <Can permission="createHoliday">
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition">
            <FaPlus className="text-xs" />
            Add Holiday
          </button>
        </Can>
      </div>

      <DataTable columns={columns} data={holidays} isLoading={loading} emptyMessage="No holidays scheduled." />
    </div>
  );
}
