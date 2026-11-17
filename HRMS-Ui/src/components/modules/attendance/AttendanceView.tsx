"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LuCalendarDays,
  LuRefreshCw,
} from "react-icons/lu";
import { attendanceService } from "@/services/attendance.service";
import { PunchType } from "@/types/attendance.types";
import { useAuth } from "@/hooks/useAuth";

export type AttendanceStage = "not_checked_in" | "working" | "checked_out";

interface AttendanceEvent {
  time: string;
  name: string;
  note: string;
  verifyMode?: string;
  deviceName?: string;
}

export default function AttendanceView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [stage, setStage] = useState<AttendanceStage>("not_checked_in");
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionSuccess, setCorrectionSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch real attendance records from backend
  const loadAttendance = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await attendanceService.getToday("2026-10-22");
      if (res?.data) {
        const record = res.data;
        if (record.lastCheckOut) {
          setStage("checked_out");
        } else if (record.firstCheckIn) {
          setStage("working");
        } else {
          setStage("not_checked_in");
        }
      }
    } catch {
      // Fallback state if server offline
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // Handle punch action
  const handlePunch = async (punchType: PunchType) => {
    setIsSyncing(true);
    try {
      if (punchType === "CHECK_IN") {
        setStage("working");
        setIsBreakActive(false);
      } else if (punchType === "CHECK_OUT") {
        setStage("checked_out");
        setIsBreakActive(false);
      } else if (punchType === "BREAK_START") {
        setIsBreakActive(true);
      } else if (punchType === "BREAK_END") {
        setIsBreakActive(false);
      }

      await attendanceService.pushHardwarePunch({
        deviceId: "DEV-TERM-01",
        deviceName: "Main Entrance Turnstile",
        punchTime: new Date().toISOString(),
        punchType,
        verifyMode: "FINGERPRINT",
        employeeCode: user?.email || "employee@hrms.com",
        userId: user?.id,
      });
    } catch {
      // Local state fallback
    } finally {
      setIsSyncing(false);
    }
  };

  // Dynamic events based on current stage
  const getEvents = (): AttendanceEvent[] => {
    switch (stage) {
      case "not_checked_in":
        return [];
      case "working":
        return [
          {
            time: "09:28",
            name: "Check-in recorded",
            note: "2 min before scheduled start",
            verifyMode: "Fingerprint",
            deviceName: "Main Entrance Turnstile",
          },
          ...(isBreakActive
            ? [
                {
                  time: "12:30",
                  name: "Break started",
                  note: "Unpaid break active",
                  verifyMode: "RFID Card",
                  deviceName: "Cafeteria Scanner",
                },
              ]
            : [
                {
                  time: "12:30",
                  name: "Break started",
                  note: "Unpaid break",
                  verifyMode: "RFID Card",
                  deviceName: "Cafeteria Scanner",
                },
                {
                  time: "13:00",
                  name: "Break ended",
                  note: "30 min recorded",
                  verifyMode: "RFID Card",
                  deviceName: "Cafeteria Scanner",
                },
              ]),
        ];
      case "checked_out":
        return [
          {
            time: "09:28",
            name: "Check-in recorded",
            note: "2 min before scheduled start",
            verifyMode: "Fingerprint",
            deviceName: "Main Entrance Turnstile",
          },
          {
            time: "12:30",
            name: "Break started",
            note: "Unpaid break",
            verifyMode: "RFID Card",
            deviceName: "Cafeteria Scanner",
          },
          {
            time: "13:00",
            name: "Break ended",
            note: "30 min recorded",
            verifyMode: "RFID Card",
            deviceName: "Cafeteria Scanner",
          },
          {
            time: "18:00",
            name: "Check-out recorded",
            note: "Day complete",
            verifyMode: "Face ID",
            deviceName: "Main Entrance Turnstile",
          },
        ];
    }
  };

  const events = getEvents();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your working day and review your recorded attendance.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="bg-slate-100 text-slate-600 border border-slate-200/90 text-xs px-3 py-1.5 rounded-lg font-medium shadow-2xs">
            Sample attendance
          </span>
        </div>
      </div>

      {/* 2. Tabs Bar */}
      <div className="border-b border-slate-200/90">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
              activeTab === "today"
                ? "border-[#0084f4] text-[#0084f4]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
              activeTab === "history"
                ? "border-[#0084f4] text-[#0084f4]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === "today" ? (
        <>
          {/* 3. Date & Snapshot Header */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Thursday, 22 Oct 2026
            </h2>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              {isSyncing && <LuRefreshCw className="animate-spin text-sky-500 text-xs" />}
              {stage === "not_checked_in" && "Snapshot at 09:25 · UTC+06:00"}
              {stage === "working" && "Snapshot at 15:00 · UTC+06:00"}
              {stage === "checked_out" && "Saved at 18:00 · UTC+06:00"}
            </span>
          </div>

          {/* 4. Main Attendance Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
            {/* Top Status & Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div>
                {/* Status Pill Badge */}
                {stage === "not_checked_in" && (
                  <span className="inline-block bg-[#f1f5f9] text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-slate-200/70">
                    Not checked in
                  </span>
                )}
                {stage === "working" && (
                  <span className="inline-block bg-[#e0f2fe] text-[#0284c7] text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-[#bae6fd]">
                    Working
                  </span>
                )}
                {stage === "checked_out" && (
                  <span className="inline-block bg-[#ecfdf5] text-[#10b981] text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-[#a7f3d0]">
                    Completed · Checked out
                  </span>
                )}

                {/* State Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-2.5">
                  {stage === "not_checked_in" && "Ready to start your day?"}
                  {stage === "working" && "You’re checked in."}
                  {stage === "checked_out" && "Your working day is recorded."}
                </h3>

                {/* State Subtext */}
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {stage === "not_checked_in" &&
                    "No entry recorded for today. Check in when you start work."}
                  {stage === "working" &&
                    `Check-in recorded at 09:28. ${
                      isBreakActive ? "Break is currently active." : "No break is currently active."
                    }`}
                  {stage === "checked_out" &&
                    "Check-out saved on 22 Oct 2026 at 18:00 UTC+06:00."}
                </p>
              </div>

              {/* Action Column */}
              <div className="flex flex-col sm:items-end">
                {stage === "not_checked_in" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePunch("CHECK_IN")}
                      className="bg-[#0084f4] hover:bg-[#0070d1] text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer active:scale-[0.99]"
                    >
                      Check in
                    </button>
                    <span className="text-[11px] text-slate-400 mt-1.5 text-right font-medium">
                      Records your start time once saved.
                    </span>
                  </>
                )}

                {stage === "working" && (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePunch(isBreakActive ? "BREAK_END" : "BREAK_START")}
                        className={`border text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition cursor-pointer active:scale-[0.99] ${
                          isBreakActive
                            ? "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {isBreakActive ? "Resume work" : "Take break"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePunch("CHECK_OUT")}
                        className="bg-[#0084f4] hover:bg-[#0070d1] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer active:scale-[0.99]"
                      >
                        Check out
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1.5 text-right font-medium">
                      Check out when your working day ends.
                    </span>
                  </>
                )}

                {stage === "checked_out" && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium">
                      Need a change?{" "}
                      <button
                        type="button"
                        onClick={() => setShowCorrectionModal(true)}
                        className="text-[#0084f4] font-semibold underline hover:text-[#0070d1] cursor-pointer"
                      >
                        Request a correction.
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scheduled Shift Specs (3 Columns) */}
            <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Scheduled shift · Sample</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">09:30–18:00 · On-site</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Scheduled unpaid break</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">30 min</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Effective target</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">8h 00 · 8h 30 less 30 min</p>
              </div>
            </div>

            {/* Recorded Time / Receipt Section (4 Columns) */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-sm font-bold text-slate-900 mb-4">
                {stage === "checked_out" ? "Recorded day receipt" : "Recorded time"}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Column 1: Recorded check-in */}
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Recorded check-in</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
                    {stage === "not_checked_in" ? "—" : "09:28"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stage === "not_checked_in" ? "No saved entry" : "22 Oct 2026"}
                  </p>
                </div>

                {/* Column 2: Elapsed span / Recorded span */}
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {stage === "checked_out" ? "Recorded span" : "Elapsed span"}
                  </p>
                  <p
                    className={`mt-0.5 tracking-tight font-bold ${
                      stage === "not_checked_in"
                        ? "text-xl text-slate-900"
                        : "text-2xl text-slate-900"
                    }`}
                  >
                    {stage === "not_checked_in" && "Not started"}
                    {stage === "working" && "5h 32"}
                    {stage === "checked_out" && "8h 32"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stage === "not_checked_in" && "Starts after check-in"}
                    {stage === "working" && "09:28 → 15:00"}
                    {stage === "checked_out" && "09:28 → 18:00"}
                  </p>
                </div>

                {/* Column 3: Unpaid break */}
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Unpaid break</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
                    {stage === "not_checked_in" ? "—" : "30 min"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stage === "not_checked_in" ? "None recorded" : "12:30 → 13:00"}
                  </p>
                </div>

                {/* Column 4: Effective worked */}
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Effective worked</p>
                  <p
                    className={`mt-0.5 tracking-tight font-bold ${
                      stage === "not_checked_in"
                        ? "text-xl text-slate-900"
                        : "text-2xl text-slate-900"
                    }`}
                  >
                    {stage === "not_checked_in" && "Not started"}
                    {stage === "working" && "5h 02"}
                    {stage === "checked_out" && "8h 02"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {stage === "not_checked_in" && "No work time recorded"}
                    {stage === "working" && "5h 32 – 30 min"}
                    {stage === "checked_out" && "8h 32 – 30 min"}
                  </p>
                </div>
              </div>

              {/* Status Note below the 4 columns */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                {stage === "not_checked_in" && (
                  <p>Scheduled start is 09:30. Your attendance has not started yet.</p>
                )}
                {stage === "working" && (
                  <p>Target 8h 00 · 2h 58 remaining to target. Static snapshot, not a live timer.</p>
                )}
                {stage === "checked_out" && (
                  <p>
                    Target 8h 00 · Difference +2 min. This is not approved or paid overtime.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 5. Bottom Card: Today’s Event History */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900">Today’s event history</h4>
              <span className="text-xs text-slate-400 font-medium">
                {stage === "not_checked_in" && "No saved events"}
                {stage === "working" && `${events.length} recorded events`}
                {stage === "checked_out" && "4 recorded events"}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="border-t border-slate-100 pt-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                  <LuCalendarDays className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">No attendance entry yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your check-in, breaks and check-out will appear here after they are captured by
                    the terminal.
                  </p>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {events.map((ev, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 pr-4 text-xs font-bold text-slate-900 w-24">
                          {ev.time}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <span>{ev.name}</span>
                            {ev.verifyMode && (
                              <span className="text-[10px] font-normal px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                {ev.verifyMode}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 pl-4 text-xs text-slate-500 text-right">
                          {ev.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. Correction Request Banner (Shown in Checked-out stage) */}
          {stage === "checked_out" && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Something doesn’t look right?</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Request a correction from history. Your original hardware record stays visible during review.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCorrectionModal(true)}
                className="self-start sm:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition cursor-pointer"
              >
                Request correction
              </button>
            </div>
          )}

          {/* 7. Bottom Disclaimer */}
          <p className="text-xs text-slate-400">
            Illustrative records only · All times use UTC+06:00, a sample configured office zone.
          </p>
        </>
      ) : (
        /* History Tab Content */
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Attendance Log History</h3>
              <p className="text-xs text-slate-500">Historical records of your daily attendance and punch times</p>
            </div>
            <span className="text-xs text-slate-400">October 2026</span>
          </div>

          <div className="overflow-x-auto border-t border-slate-100 pt-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Check-in</th>
                  <th className="py-2.5 px-3">Check-out</th>
                  <th className="py-2.5 px-3">Break</th>
                  <th className="py-2.5 px-3">Effective</th>
                  <th className="py-2.5 px-3">Terminal</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-800">22 Oct 2026</td>
                  <td className="py-3 px-3 text-slate-600">09:28 AM</td>
                  <td className="py-3 px-3 text-slate-600">06:00 PM</td>
                  <td className="py-3 px-3 text-slate-600">30 min</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">8h 02m</td>
                  <td className="py-3 px-3 text-slate-500">Main Entrance Turnstile</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                      On target
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-800">21 Oct 2026</td>
                  <td className="py-3 px-3 text-slate-600">10:03 AM</td>
                  <td className="py-3 px-3 text-slate-600">07:00 PM</td>
                  <td className="py-3 px-3 text-slate-600">30 min</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">8h 27m</td>
                  <td className="py-3 px-3 text-slate-500">Main Entrance Turnstile</td>
                  <td className="py-3 px-3">
                    <span className="bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                      Undertime (-33m)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-800">20 Oct 2026</td>
                  <td className="py-3 px-3 text-slate-600">09:45 AM</td>
                  <td className="py-3 px-3 text-slate-600">07:15 PM</td>
                  <td className="py-3 px-3 text-slate-600">30 min</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">9h 00m</td>
                  <td className="py-3 px-3 text-slate-500">Main Entrance Turnstile</td>
                  <td className="py-3 px-3">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                      On target
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Correction Request Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Request Attendance Correction</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCorrectionModal(false);
                  setCorrectionSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {correctionSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <p className="text-sm font-bold text-slate-900">Correction Request Submitted</p>
                <p className="text-xs text-slate-500">
                  Your supervisor will review the punch time adjustment.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowCorrectionModal(false);
                    setCorrectionSuccess(false);
                  }}
                  className="mt-4 bg-[#0084f4] hover:bg-[#0070d1] text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCorrectionSuccess(true);
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Date</label>
                  <input
                    type="text"
                    disabled
                    value="Thursday, 22 Oct 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Correct Check-in</label>
                    <input
                      type="time"
                      defaultValue="09:28"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Correct Check-out</label>
                    <input
                      type="time"
                      defaultValue="18:00"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Reason for correction</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Card reader failed at main turnstile..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0084f4] hover:bg-[#0070d1] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
