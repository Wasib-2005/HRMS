"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, EmployeeDashboardMetrics } from "@/services/dashboard.service";
import {
  LuClock,
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

interface TeamMember {
  id: string;
  name: string;
  avatarLetter: string;
  department: string;
  attendance: {
    mon: { type: "I" | "W" | "L" | "A" | "-" };
    tue: { type: "I" | "W" | "L" | "A" | "-" };
    wed: { type: "I" | "W" | "L" | "A" | "-" };
    thu: { type: "I" | "W" | "L" | "A" | "-" };
    fri: { type: "I" | "W" | "L" | "A" | "-" };
  };
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Ralph Edwards",
    avatarLetter: "A",
    department: "Design",
    attendance: {
      mon: { type: "I" },
      tue: { type: "I" },
      wed: { type: "W" },
      thu: { type: "I" },
      fri: { type: "-" },
    },
  },
  {
    id: "2",
    name: "Cameron Williamson",
    avatarLetter: "B",
    department: "Engineering",
    attendance: {
      mon: { type: "W" },
      tue: { type: "I" },
      wed: { type: "I" },
      thu: { type: "W" },
      fri: { type: "-" },
    },
  },
  {
    id: "3",
    name: "Devon Lane",
    avatarLetter: "C",
    department: "Operations",
    attendance: {
      mon: { type: "I" },
      tue: { type: "I" },
      wed: { type: "L" },
      thu: { type: "L" },
      fri: { type: "-" },
    },
  },
  {
    id: "4",
    name: "Kristin Watson",
    avatarLetter: "D",
    department: "People",
    attendance: {
      mon: { type: "I" },
      tue: { type: "W" },
      wed: { type: "I" },
      thu: { type: "A" },
      fri: { type: "-" },
    },
  },
];

interface HistoryRecord {
  date: string;
  arrival: string;
  departure: string;
  effectiveHours: string;
  targetDiff: string;
  statusType: "undertime" | "ontarget" | "overtime";
}

const HISTORY_RECORDS: HistoryRecord[] = [
  {
    date: "21 Oct",
    arrival: "10:03 AM",
    departure: "07:00 PM",
    effectiveHours: "8:27 hrs",
    targetDiff: "/ 9 hrs · Under 33m",
    statusType: "undertime",
  },
  {
    date: "20 Oct",
    arrival: "09:45 AM",
    departure: "07:15 PM",
    effectiveHours: "9:00 hrs",
    targetDiff: "/ 9 hrs · On target",
    statusType: "ontarget",
  },
  {
    date: "19 Oct",
    arrival: "09:30 AM",
    departure: "07:30 PM",
    effectiveHours: "9:30 hrs",
    targetDiff: "/ 9 hrs · Over 30m",
    statusType: "overtime",
  },
  {
    date: "16 Oct",
    arrival: "10:00 AM",
    departure: "07:15 PM",
    effectiveHours: "8:45 hrs",
    targetDiff: "/ 9 hrs · Under 15m",
    statusType: "undertime",
  },
];

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [currentTime, setCurrentTime] = useState("04:03 PM");
  const [selectedDay, setSelectedDay] = useState(29);
  const [metrics, setMetrics] = useState<EmployeeDashboardMetrics | null>(null);

  // Fetch live dashboard metrics from MongoDB Atlas
  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await dashboardService.getEmployeeMetrics(user?.email);
        if (res?.data) {
          setMetrics(res.data);
          if (res.data.today) {
            setIsCheckedIn(res.data.today.isCheckedIn || true);
          }
        }
      } catch {
        // Fallback to static values
      }
    }
    loadMetrics();
  }, [user?.email]);

  // Live formatted time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const employeeFirstName = user?.name ? user.name.split(" ")[0] : "Rayhan";

  // Helper for attendance pill badges in "My Team"
  const renderAttendancePill = (status: "I" | "W" | "L" | "A" | "-") => {
    switch (status) {
      case "I":
        return (
          <span className="w-6 h-6 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center text-xs font-bold shadow-2xs">
            I
          </span>
        );
      case "W":
        return (
          <span className="w-6 h-6 rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center text-xs font-bold shadow-2xs">
            W
          </span>
        );
      case "L":
        return (
          <span className="w-6 h-6 rounded-full bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center text-xs font-bold shadow-2xs">
            L
          </span>
        );
      case "A":
        return (
          <span className="w-6 h-6 rounded-full bg-[#ffe4e6] text-[#e11d48] flex items-center justify-center text-xs font-bold shadow-2xs">
            A
          </span>
        );
      default:
        return <span className="text-slate-400 font-semibold text-sm">–</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Header: "Hello, Rayhan" + Clock Pill */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Hello, {employeeFirstName}
        </h1>

        <div className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs">
          <LuClock className="text-slate-500 text-base" />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* 2. Top Row (3 Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: Today */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Today</h2>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                isCheckedIn
                  ? "bg-[#ecfdf5] text-[#10b981]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isCheckedIn ? "Present" : "Checked Out"}
            </span>
          </div>

          <div className="flex items-center gap-5 my-5">
            {/* Circular Donut Progress (67%) */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#f1f5f9]"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Active 67% Ring (251.3 * 0.67 = 168.4 stroke) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0084f4"
                  strokeWidth="8"
                  strokeDasharray="251.3"
                  strokeDashoffset="82.9"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-slate-900 leading-none">67%</span>
                <span className="text-[11px] text-slate-400 mt-1">of day</span>
              </div>
            </div>

            {/* Time Stats */}
            <div>
              <p className="text-xs text-slate-400 font-medium">Time left:</p>
              <p className="text-2xl font-bold text-slate-900 leading-tight mt-0.5">3h 24min</p>
              <p className="text-xs text-slate-400 mt-1">You&apos;ve checked at 9:02 AM</p>
            </div>
          </div>

          {/* Action Button: Check-out */}
          <button
            onClick={() => setIsCheckedIn(!isCheckedIn)}
            className="w-full border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-[0.99]"
          >
            <LuArrowRight className="text-sm" />
            <span>{isCheckedIn ? "Check-out" : "Check-in"}</span>
          </button>
        </div>

        {/* CARD 2: Shift overview */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Shift overview</h2>
            <div className="bg-[#f1f5f9] text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
              This month
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            {/* Tile 1: Average Hours */}
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium">Average Hours</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-slate-900">7h 17m</span>
                <span className="text-[#10b981] font-bold text-sm">↑</span>
              </div>
            </div>

            {/* Tile 2: Average Check-in */}
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium">Average Check-in</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-slate-900">10:33 AM</span>
                <span className="text-[#10b981] font-bold text-sm">∨</span>
              </div>
            </div>

            {/* Tile 3: On-time Arrival Rate */}
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium">On-time Arrival Rate</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-slate-900">98.5%</span>
                <span className="text-[#10b981] font-bold text-sm">↑</span>
              </div>
            </div>

            {/* Tile 4: Average Check-out */}
            <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium">Average Check-out</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-lg font-bold text-slate-900">07:12 PM</span>
                <span className="text-[#f59e0b] font-bold text-sm">↑</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f7ff] text-[#0084f4] text-xs font-semibold py-2 px-3 rounded-xl text-center">
            Better than 91.2% of peers.
          </div>
        </div>

        {/* CARD 3: My task */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">My task</h2>
            <div className="bg-[#f1f5f9] text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
              This month
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 my-4">
            {/* Multi-segmented Donut SVG matching the uploaded design */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-slate-100"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Completed (Emerald) ~65% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#00a86b"
                  strokeWidth="8"
                  strokeDasharray="155 238.7"
                  strokeDashoffset="0"
                  fill="transparent"
                />
                {/* In-progress (Sky blue) ~18% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#0084f4"
                  strokeWidth="8"
                  strokeDasharray="43 238.7"
                  strokeDashoffset="-157"
                  fill="transparent"
                />
                {/* In-review (Amber/Orange) ~10% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f97316"
                  strokeWidth="8"
                  strokeDasharray="24 238.7"
                  strokeDashoffset="-202"
                  fill="transparent"
                />
                {/* Rejected (Red) ~5% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#e11d48"
                  strokeWidth="8"
                  strokeDasharray="12 238.7"
                  strokeDashoffset="-228"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-slate-900 leading-none">1,434</span>
                <span className="text-[10px] text-slate-400 mt-1">/ 1,500 hrs</span>
              </div>
            </div>

            {/* Task Legend */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00a86b] shrink-0"></span>
                <span className="text-slate-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0084f4] shrink-0"></span>
                <span className="text-slate-600">In-progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f97316] shrink-0"></span>
                <span className="text-slate-600">In-review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e11d48] shrink-0"></span>
                <span className="text-slate-600">Rejected</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f7ff] text-[#0084f4] text-xs font-semibold py-2 px-3 rounded-xl text-center">
            You&apos;ve completed 82.3% task on time.
          </div>
        </div>
      </div>

      {/* 3. Middle Row: My Team (Left) + Calendar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CARD 4: My Team (Col 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">My Team</h2>
              <span className="text-xs text-slate-400 font-medium">24–31 Oct 2026</span>
            </div>

            {/* Attendance Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16a34a]"></span>
                <span>In office</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                <span>Work From Home</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9333ea]"></span>
                <span>On leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
                <span>Absent</span>
              </div>
            </div>

            {/* Team Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                    <th className="pb-3 font-medium">Member</th>
                    <th className="pb-3 text-center w-12 font-medium">Mon</th>
                    <th className="pb-3 text-center w-12 font-medium">Tue</th>
                    <th className="pb-3 text-center w-12 font-medium">Wed</th>
                    <th className="pb-3 text-center w-12 font-bold text-[#0084f4]">Thu</th>
                    <th className="pb-3 text-center w-12 font-medium">Fri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {TEAM_MEMBERS.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f1f5f9] text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {member.avatarLetter}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{member.name}</p>
                            <p className="text-[11px] text-slate-400">{member.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center">{renderAttendancePill(member.attendance.mon.type)}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center">{renderAttendancePill(member.attendance.tue.type)}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center">{renderAttendancePill(member.attendance.wed.type)}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center">{renderAttendancePill(member.attendance.thu.type)}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex justify-center">{renderAttendancePill(member.attendance.fri.type)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CARD 5: Calendar October 2026 (Col 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">October 2026</h2>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                >
                  <LuChevronLeft className="text-xs" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                >
                  <LuChevronRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Dates Grid with Status Colors */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {/* Previous month days */}
              <span className="p-1.5 text-slate-300 font-medium">30</span>
              <span className="p-1.5 text-slate-300 font-medium">31</span>

              {/* Week 1 */}
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">1</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">2</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">3</span>
              <span className="p-1.5 text-slate-400 font-medium">4</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">5</span>

              {/* Week 2 */}
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">6</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">7</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">8</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">9</span>
              <span className="p-1.5 rounded-lg bg-[#fef3c7] text-[#d97706] font-medium">10</span>
              <span className="p-1.5 text-slate-400 font-medium">11</span>
              <span className="p-1.5 rounded-lg bg-[#ffe4e6] text-[#e11d48] font-medium">12</span>

              {/* Week 3 */}
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">13</span>
              <span className="p-1.5 rounded-lg bg-[#ffe4e6] text-[#e11d48] font-medium">14</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">15</span>
              <span className="p-1.5 rounded-lg bg-[#fef3c7] text-[#d97706] font-medium">16</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">17</span>
              <span className="p-1.5 text-slate-400 font-medium">18</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">19</span>

              {/* Week 4 */}
              <span className="p-1.5 rounded-lg bg-[#fef3c7] text-[#d97706] font-medium">20</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">21</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">22</span>
              <span className="p-1.5 rounded-lg bg-[#fef3c7] text-[#d97706] font-medium">23</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">24</span>
              <span className="p-1.5 text-slate-400 font-medium">25</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">26</span>

              {/* Week 5 */}
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">27</span>
              <span className="p-1.5 rounded-lg bg-[#dcfce7] text-[#16a34a] font-medium">28</span>
              <button
                type="button"
                onClick={() => setSelectedDay(29)}
                className={`p-1 rounded-lg border-2 border-dashed border-slate-800 font-bold ${
                  selectedDay === 29 ? "bg-slate-50 text-slate-900" : "text-slate-800"
                }`}
              >
                29
              </button>
              <span className="p-1.5 text-slate-600 font-medium">30</span>
              <span className="p-1.5 text-slate-600 font-medium">31</span>
              <span className="p-1.5 text-slate-300 font-medium">1</span>
              <span className="p-1.5 text-slate-300 font-medium">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Working History */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-slate-900">Working History</h2>
          <span className="text-xs text-slate-400 font-medium">October 2026</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            <span>On target/overtime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
            <span>Undertime</span>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc]/90 text-[11px] font-semibold text-slate-500">
                <th className="py-2.5 px-3 rounded-l-lg font-medium">Date</th>
                <th className="py-2.5 px-3 font-medium">Arrival Time</th>
                <th className="py-2.5 px-3 font-medium">Departure Time</th>
                <th className="py-2.5 px-3 rounded-r-lg font-medium">Effective Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {HISTORY_RECORDS.map((record, index) => {
                const isUndertime = record.statusType === "undertime";
                return (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-3 text-xs font-semibold text-slate-800">{record.date}</td>
                    <td className="py-3.5 px-3 text-xs text-slate-600">{record.arrival}</td>
                    <td className="py-3.5 px-3 text-xs text-slate-600">{record.departure}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {/* Circular status outline ring */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                            isUndertime ? "border-[#f59e0b]" : "border-[#10b981]"
                          }`}
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                          <span className="text-xs font-bold text-slate-900">{record.effectiveHours}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 rounded-full inline-block ${
                                isUndertime ? "bg-[#f59e0b]" : "bg-[#10b981]"
                              }`}
                            />
                            {record.targetDiff}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-0.5">
          <p>30 min unpaid break per record · 9 hrs daily target.</p>
          <p>Effective time = departure – arrival – break.</p>
        </div>
      </div>
    </div>
  );
}
