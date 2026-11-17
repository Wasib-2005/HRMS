"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ROLE_OVERVIEW_MENUS,
  ACCOUNT_MENU,
  SUPPORT_MENU,
  NavItem,
} from "@/config/navigation.config";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/context/TaskContext";
import { signOut } from "@/lib/auth";
import { AppRole } from "@/types/auth.types";
import { LuPanelLeftClose, LuLogOut } from "react-icons/lu";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, loading } = useAuth();
  const { activeCount } = useTasks();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Determine active workspace category strictly among the 3 system roles
  const roleCategory: AppRole =
    role === "Admin"
      ? "Admin"
      : role === "HR"
      ? "HR"
      : "Employee";

  const workspaceTitle = `${roleCategory} Workspace`;
  const overviewItems: NavItem[] =
    ROLE_OVERVIEW_MENUS[roleCategory] || ROLE_OVERVIEW_MENUS["Employee"];

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      router.replace("/login");
    }
  };

  const renderNavLinks = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive =
        item.href === "/dashboard"
          ? pathname === "/dashboard"
          : pathname.startsWith(item.href);

      // Determine dynamic badge count (if item is tasks, use activeCount from TaskContext)
      const badgeCount =
        item.href === "/tasks" ? activeCount : item.badge;

      return (
        <Link
          key={item.title + item.href}
          href={item.href}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
            isActive
              ? "bg-[#0084f4] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
          title={isCollapsed && badgeCount !== undefined ? `${item.title} (${badgeCount} active)` : item.title}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <Icon className={`text-lg ${isActive ? "text-white" : "text-slate-500"}`} />
            {isCollapsed && badgeCount !== undefined && Number(badgeCount) > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#0084f4] text-white text-[10px] font-bold flex items-center justify-center shadow-2xs border border-white">
                {badgeCount}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <>
              <span className="truncate flex-1">{item.title}</span>
              {badgeCount !== undefined && Number(badgeCount) > 0 && (
                <span
                  className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full transition-colors ${
                    isActive
                      ? "bg-white text-[#0084f4]"
                      : "bg-[#e0f2fe] text-[#0284c7] group-hover:bg-[#bae6fd]"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </>
          )}
        </Link>
      );
    });
  };

  if (loading) {
    return <aside className="w-64 bg-[#f8fafc] border-r border-slate-200 h-[calc(100vh-4rem)] animate-pulse shrink-0" />;
  }

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-[#f8fafc] text-slate-800 flex flex-col h-[calc(100vh-4rem)] border-r border-slate-200 shrink-0 sticky top-16 transition-all duration-300 select-none`}
    >
      {/* Top Header */}
      <div className="pt-6 pb-4 px-5 border-b border-slate-200/80 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
            {workspaceTitle}
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-200/60 transition ml-auto cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <LuPanelLeftClose className={`text-xl transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-thin">
        {/* OVERVIEW Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Overview
            </p>
          )}
          {renderNavLinks(overviewItems)}
        </div>

        {/* ACCOUNT Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Account
            </p>
          )}
          {renderNavLinks(ACCOUNT_MENU)}
        </div>

        {/* SUPPORT Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Support
            </p>
          )}
          {renderNavLinks(SUPPORT_MENU)}
        </div>
      </nav>

      {/* Bottom Log Out Section */}
      <div className="p-3.5 border-t border-slate-200/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#e11d48] hover:bg-rose-50/80 transition-colors cursor-pointer"
        >
          <LuLogOut className="text-lg shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
