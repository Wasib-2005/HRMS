"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import {
  LuSearch,
  LuBell,
  LuChevronDown,
  LuUser,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

export default function Topbar() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl + K (or Cmd + K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch {
      router.replace("/login");
    }
  };

  // Helper for computing 2-letter initials (e.g. "Sana Ahmed" -> "SA")
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "SA";
  };

  const displayName = user?.name || "User";
  const displayRole = role || "Employee";
  const initials = getInitials(user?.name, user?.email);

  return (
    <header className="h-16 bg-[#f4f6fa] border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-50 select-none">
      {/* Left: Brand Logo & Title */}
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-2xs group-hover:opacity-95 transition">
          <Image
            src="/logo.svg"
            alt="EuitSols Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="font-bold text-slate-900 text-lg tracking-tight">
          EuitSols
        </span>
      </Link>

      {/* Right: Search, Notification Bell & User Profile */}
      <div className="flex items-center gap-3.5">
        {/* Search Input Bar */}
        <div className="relative hidden sm:flex items-center">
          <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-xl px-3.5 py-1.5 shadow-2xs hover:border-slate-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/10 transition w-60 md:w-72">
            <LuSearch className="text-slate-400 text-base shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-hidden w-full"
            />
            <kbd className="hidden md:inline-flex items-center text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-2xs relative"
            title="Notifications"
          >
            <LuBell className="text-lg" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-sky-500"></span>
          </button>

          {/* Notifications Flyout */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-fade">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Notifications
                </h4>
                <span className="text-[10px] text-sky-600 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="py-6 text-center text-xs text-slate-400">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 hover:bg-slate-50 transition shadow-2xs cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 font-bold text-xs flex items-center justify-center border border-sky-100 shrink-0">
              {initials}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                {displayRole}
              </p>
            </div>
            <LuChevronDown
              className={`text-slate-400 text-sm transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fade">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || "user@hrms.com"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <LuUser className="text-slate-400 text-sm" />
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <LuSettings className="text-slate-400 text-sm" />
                  Account Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50/70 transition text-left"
              >
                <LuLogOut className="text-rose-500 text-sm" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
