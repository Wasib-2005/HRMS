"use client";

import { useState } from "react";
import {
  LuUsers,
  LuCalendarCheck,
  LuClock,
  LuCircleAlert,
  LuSearch,
  LuFingerprint,
  LuCreditCard,
  LuScanFace,
} from "react-icons/lu";

interface StaffAttendance {
  id: string;
  name: string;
  email: string;
  department: string;
  checkIn: string;
  checkOut: string;
  breakDuration: string;
  effectiveHours: string;
  terminal: string;
  verifyMode: "Fingerprint" | "RFID Card" | "Face ID";
  status: "On target" | "Late" | "Undertime" | "On leave";
}

const SAMPLE_ROSTER: StaffAttendance[] = [
  {
    id: "1",
    name: "John Staff",
    email: "employee@hrms.com",
    department: "Engineering",
    checkIn: "09:28 AM",
    checkOut: "06:00 PM",
    breakDuration: "30 min",
    effectiveHours: "8h 02m",
    terminal: "Main Entrance Turnstile",
    verifyMode: "Fingerprint",
    status: "On target",
  },
  {
    id: "2",
    name: "Ralph Edwards",
    email: "ralph@hrms.com",
    department: "Design",
    checkIn: "09:30 AM",
    checkOut: "06:30 PM",
    breakDuration: "30 min",
    effectiveHours: "8h 30m",
    terminal: "Main Entrance Turnstile",
    verifyMode: "Face ID",
    status: "On target",
  },
  {
    id: "3",
    name: "Cameron Williamson",
    email: "cameron@hrms.com",
    department: "Engineering",
    checkIn: "10:05 AM",
    checkOut: "07:00 PM",
    breakDuration: "30 min",
    effectiveHours: "8h 25m",
    terminal: "Main Entrance Turnstile",
    verifyMode: "RFID Card",
    status: "Late",
  },
  {
    id: "4",
    name: "Devon Lane",
    email: "devon@hrms.com",
    department: "Operations",
    checkIn: "—",
    checkOut: "—",
    breakDuration: "—",
    effectiveHours: "0h 00m",
    terminal: "—",
    verifyMode: "RFID Card",
    status: "On leave",
  },
  {
    id: "5",
    name: "Kristin Watson",
    email: "kristin@hrms.com",
    department: "People",
    checkIn: "09:55 AM",
    checkOut: "06:15 PM",
    breakDuration: "30 min",
    effectiveHours: "7h 50m",
    terminal: "Main Entrance Turnstile",
    verifyMode: "Fingerprint",
    status: "Undertime",
  },
];

export default function HRAttendanceView() {
  const [search, setSearch] = useState("");

  const filteredRoster = SAMPLE_ROSTER.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Company Attendance Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time biometric terminal punches, attendance monitoring, and staff logs.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Hardware Gateways: Online</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Workforce</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">24 Staff</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center text-lg">
              <LuUsers />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Present Today</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">21 Active</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <LuCalendarCheck />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Late Arrivals</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">2 Staff</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <LuClock />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">On Leave</p>
              <p className="text-2xl font-bold text-sky-600 mt-1">1 Approved</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg">
              <LuCircleAlert />
            </div>
          </div>
        </div>
      </div>

      {/* Staff Attendance Roster Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Today&apos;s Staff Punch Logs</h2>
            <p className="text-xs text-slate-500">Live feed synced from biometric turnstile gates</p>
          </div>

          <div className="relative w-full sm:w-64">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Check-in</th>
                <th className="py-2.5 px-3">Check-out</th>
                <th className="py-2.5 px-3">Break</th>
                <th className="py-2.5 px-3">Effective</th>
                <th className="py-2.5 px-3">Terminal Gate</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.email}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{item.department}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{item.checkIn}</td>
                  <td className="py-3 px-3 text-slate-600">{item.checkOut}</td>
                  <td className="py-3 px-3 text-slate-600">{item.breakDuration}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{item.effectiveHours}</td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      {item.verifyMode === "Fingerprint" && <LuFingerprint className="text-slate-400" />}
                      {item.verifyMode === "RFID Card" && <LuCreditCard className="text-slate-400" />}
                      {item.verifyMode === "Face ID" && <LuScanFace className="text-slate-400" />}
                      <span>{item.terminal}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                        item.status === "On target"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : item.status === "Late"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : item.status === "Undertime"
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
