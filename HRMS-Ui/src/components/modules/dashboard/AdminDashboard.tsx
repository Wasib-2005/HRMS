"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  LuUsers,
  LuShieldCheck,
  LuBuilding2,
  LuSlidersHorizontal,
  LuHistory,
  LuArrowRight,
  LuCircleCheck,
} from "react-icons/lu";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Admin Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System configuration, user management, and security governance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-xl px-3.5 py-1.5 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System: Healthy · MongoDB Atlas Connected</span>
        </div>
      </div>

      {/* Admin Metrics Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/employees"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Users
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3 Active</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0084f4] flex items-center justify-center text-lg">
              <LuUsers />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Manage accounts</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/roles"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                System Roles
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">3 Roles</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
              <LuShieldCheck />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Admin, HR, Employee</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/departments"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Organization
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">Departments</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <LuBuilding2 />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Structure & divisions</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/audit-log"
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:border-[#0084f4] transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Audit Log
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">Security</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <LuHistory />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>System access records</span>
            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Administration Controls</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/employees"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuUsers className="text-[#0084f4] text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">User Management</p>
              <p className="text-xs text-slate-500 mt-0.5">Provision and disable credentials</p>
            </Link>

            <Link
              href="/roles"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuShieldCheck className="text-indigo-600 text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">Roles & Permissions</p>
              <p className="text-xs text-slate-500 mt-0.5">RBAC permissions matrix</p>
            </Link>

            <Link
              href="/departments"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuBuilding2 className="text-emerald-600 text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">Organization</p>
              <p className="text-xs text-slate-500 mt-0.5">Department hierarchy</p>
            </Link>

            <Link
              href="/system-settings"
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-200/70 transition"
            >
              <LuSlidersHorizontal className="text-amber-600 text-lg mb-2" />
              <p className="text-sm font-bold text-slate-900">System Settings</p>
              <p className="text-xs text-slate-500 mt-0.5">Server and policy parameters</p>
            </Link>
          </div>
        </div>

        {/* Security & Health Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">System Environment & Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Authentication Engine</span>
              <span className="font-semibold text-slate-800">Better-Auth (Session / MongoAdapter)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Active System Roles</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <LuCircleCheck /> Strict 3-Type (Admin, HR, Employee)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-semibold text-slate-800">MongoDB Atlas (Replica Shard)</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs">
              <span className="text-slate-500">Attendance Gateways</span>
              <span className="font-semibold text-[#0084f4]">Biometric Hardware REST Webhooks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
