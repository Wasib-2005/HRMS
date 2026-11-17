import {
  LuLayoutGrid,
  LuUser,
  LuUsers,
  LuCalendarX,
  LuCalendarCheck,
  LuBadgeDollarSign,
  LuPlaneTakeoff,
  LuSlidersHorizontal,
  LuSettings,
  LuCircleHelp,
  LuListTodo,
  LuReceipt,
  LuCalendarPlus,
  LuDoorOpen,
  LuShieldCheck,
  LuBuilding2,
  LuHistory,
  LuFileText,
} from "react-icons/lu";
import { AppRole } from "@/types/auth.types";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: AppRole[] | ["*"];
  badge?: number | string;
}

export interface NavSection {
  sectionTitle?: string;
  items: NavItem[];
}

export const ROLE_OVERVIEW_MENUS: Record<AppRole, NavItem[]> = {
  HR: [
    { title: "Overview", href: "/dashboard", icon: LuLayoutGrid, allowedRoles: ["HR"] },
    { title: "Employees", href: "/employees", icon: LuUser, allowedRoles: ["HR"] },
    { title: "Review queue", href: "/review-queue", icon: LuSlidersHorizontal, allowedRoles: ["HR"] },
    { title: "Time off", href: "/time-off", icon: LuCalendarX, allowedRoles: ["HR"] },
    { title: "Attendance", href: "/attendance", icon: LuCalendarCheck, allowedRoles: ["HR"] },
    { title: "Payroll", href: "/payroll", icon: LuBadgeDollarSign, allowedRoles: ["HR"] },
    { title: "Offboarding", href: "/offboarding", icon: LuPlaneTakeoff, allowedRoles: ["HR"] },
    { title: "Reports", href: "/reports", icon: LuFileText, allowedRoles: ["HR"] },
  ],
  Employee: [
    { title: "Dashboard", href: "/dashboard", icon: LuLayoutGrid, allowedRoles: ["Employee"] },
    { title: "Attendance", href: "/attendance", icon: LuCalendarCheck, allowedRoles: ["Employee"] },
    { title: "Task List", href: "/tasks", icon: LuListTodo, allowedRoles: ["Employee"], badge: 12 },
    { title: "Payslip", href: "/payslip", icon: LuReceipt, allowedRoles: ["Employee"] },
    { title: "Leave Request", href: "/leave-request", icon: LuCalendarPlus, allowedRoles: ["Employee"] },
    { title: "Resignation", href: "/resignation", icon: LuDoorOpen, allowedRoles: ["Employee"] },
  ],
  Admin: [
    { title: "Dashboard", href: "/dashboard", icon: LuLayoutGrid, allowedRoles: ["Admin"] },
    { title: "User management", href: "/employees", icon: LuUsers, allowedRoles: ["Admin"] },
    { title: "Roles & permissions", href: "/roles", icon: LuShieldCheck, allowedRoles: ["Admin"] },
    { title: "Organization", href: "/departments", icon: LuBuilding2, allowedRoles: ["Admin"] },
    { title: "Audit log", href: "/audit-log", icon: LuHistory, allowedRoles: ["Admin"] },
    { title: "System Settings", href: "/system-settings", icon: LuSlidersHorizontal, allowedRoles: ["Admin"] },
  ],
};

export const ACCOUNT_MENU: NavItem[] = [
  { title: "Profile", href: "/profile", icon: LuUser, allowedRoles: ["*"] },
  { title: "Settings", href: "/settings", icon: LuSettings, allowedRoles: ["*"] },
];

export const SUPPORT_MENU: NavItem[] = [
  { title: "Help center", href: "/help-center", icon: LuCircleHelp, allowedRoles: ["*"] },
];
