"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  LuUsers,
  LuCalendarCheck,
  LuCalendarX,
  LuBadgeDollarSign,
  LuPlaneTakeoff,
  LuSlidersHorizontal,
  LuFileText,
  LuArrowRight,
} from "react-icons/lu";

export default function HRDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* HR Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            HR Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Human resources operations, employee directory, and company workforce management.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-sky-50 text-sky-700 border border-sky-200/80 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-2xs">
          <span>Logged in as: HR Manager</span>
        </div>
      </div>

      {/* HR Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/employees"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Staff Members
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">24 Employees</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <LuUsers />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Employee directory</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/attendance"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Attendance Today
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">21 Present</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0084f4] flex items-center justify-center text-lg">
              <LuCalendarCheck />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Terminal punch oversight</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/time-off"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Time Off Requests
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3 Pending</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <LuCalendarX />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Leave approval queue</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/payroll"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Payroll Cycle
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">October 2026</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
              <LuBadgeDollarSign />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Review salary runs</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* HR Operations Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Workforce Operations</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/review-queue"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuSlidersHorizontal className="text-[#0084f4] text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">Review Queue</p>
              <p className="text-xs text-slate-500 mt-0.5">Pending approvals & requests</p>
            </Link>

            <Link
              href="/offboarding"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuPlaneTakeoff className="text-indigo-600 text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">Offboarding</p>
              <p className="text-xs text-slate-500 mt-0.5">Handover & exit clearances</p>
            </Link>

            <Link
              href="/reports"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuFileText className="text-emerald-600 text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">HR Reports</p>
              <p className="text-xs text-slate-500 mt-0.5">Turnover, headcount & stats</p>
            </Link>

            <Link
              href="/employees"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuUsers className="text-amber-600 text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">Staff Records</p>
              <p className="text-xs text-slate-500 mt-0.5">Documents & contracts</p>
            </Link>
          </div>
        </div>

        {/* Attendance Terminal Status for HR */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Attendance Device Gateways</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Main Entrance Turnstile</p>
                <p className="text-[11px] text-slate-400">DEV-TERM-01 · Ground Floor Lobby</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                Online
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Cafeteria Break Scanner</p>
                <p className="text-[11px] text-slate-400">DEV-TERM-02 · 2nd Floor Dining Area</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                Online
              </span>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Sync Protocol: REST_WEBHOOK</span>
              <Link href="/attendance" className="text-[#0084f4] font-semibold hover:underline">
                View Company Attendance →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
