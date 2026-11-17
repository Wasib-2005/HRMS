"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LuCalendar,
  LuChevronDown,
  LuSearch,
  LuUpload,
  LuCheck,
  LuClock,
  LuX,
  LuFileText,
  LuCircleAlert,
  LuCircleCheck,
} from "react-icons/lu";
import {
  leaveService,
  LeaveBalanceData,
  LeaveRequestRecord,
  LeaveType,
  DurationType,
} from "@/services/leave.service";

const PEER_OPTIONS = [
  "Ralph Edwards (Design)",
  "Cameron Williamson (Engineering)",
  "Devon Lane (Operations)",
  "Kristin Watson (People)",
];

export default function EmployeeLeaveRequestView() {
  const { user } = useAuth();

  // Balance state
  const [balance, setBalance] = useState<LeaveBalanceData>({
    employeeEmail: user?.email || "employee@hrms.com",
    casualRemaining: 8,
    casualTotal: 12,
    medicalRemaining: 6,
    medicalTotal: 10,
    earnedRemaining: 12,
    earnedTotal: 18,
  });

  // History modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [myRequests, setMyRequests] = useState<LeaveRequestRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [durationType, setDurationType] = useState<DurationType>("Full Day");
  const [reason, setReason] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [handoverPeer, setHandoverPeer] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");

  // Peer dropdown & file input refs
  const [showPeerDropdown, setShowPeerDropdown] = useState(false);
  const [peerSearch, setPeerSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load balances and existing requests on mount
  useEffect(() => {
    async function loadData() {
      try {
        const balRes = await leaveService.getBalances(user?.email);
        if (balRes?.data) {
          setBalance(balRes.data);
        }
      } catch {
        // Fallback default
      }
    }
    loadData();
  }, [user?.email]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setShowHistoryModal(true);
    try {
      const res = await leaveService.getMyRequests(user?.email);
      if (res?.data) {
        setMyRequests(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Calculate working days excluding weekends (Fri, Sat)
  const calculation = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return null;
    }

    let workingDaysCount = 0;
    let weekendDaysCount = 0;
    const cur = new Date(start);

    while (cur <= end) {
      const day = cur.getDay();
      // Friday (5) and Saturday (6) are weekend in standard Bangladesh office config
      if (day === 5 || day === 6) {
        weekendDaysCount++;
      } else {
        workingDaysCount++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    if (durationType === "First Half" || durationType === "Second Half") {
      workingDaysCount = 0.5;
    }

    let totalDeduction = workingDaysCount;
    let remainingAfter = null;

    if (leaveType === "Casual leave") {
      remainingAfter = balance.casualRemaining - totalDeduction;
    } else if (leaveType === "Medical leave") {
      remainingAfter = balance.medicalRemaining - totalDeduction;
    } else if (leaveType === "Earned leave") {
      remainingAfter = balance.earnedRemaining - totalDeduction;
    } else if (leaveType === "Unpaid leave") {
      remainingAfter = 0;
    }

    return {
      workingDaysCount,
      weekendDaysCount,
      totalDeduction,
      remainingAfter,
      isExceeded: remainingAfter !== null && remainingAfter < 0,
    };
  }, [startDate, endDate, durationType, leaveType, balance]);

  const isFormValid =
    leaveType !== "" &&
    startDate !== "" &&
    endDate !== "" &&
    reason.trim().length >= 10 &&
    reason.trim().length <= 500 &&
    calculation !== null &&
    !calculation.isExceeded;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !calculation) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await leaveService.applyLeave({
        employeeEmail: user?.email || "employee@hrms.com",
        employeeName: user?.name || "Rayhan Ahmed",
        leaveType: leaveType as LeaveType,
        startDate,
        endDate,
        durationType,
        workingDays: calculation.totalDeduction,
        reason: reason.trim(),
        attachmentName: attachment ? attachment.name : undefined,
        handoverPeer: handoverPeer || undefined,
        emergencyContact: emergencyContact || undefined,
      });

      if (res?.data) {
        setSubmitSuccess(true);
        // Refresh balances
        const balRes = await leaveService.getBalances(user?.email);
        if (balRes?.data) setBalance(balRes.data);

        // Reset form after delay
        setTimeout(() => {
          setSubmitSuccess(false);
          setLeaveType("");
          setStartDate("");
          setEndDate("");
          setDurationType("Full Day");
          setReason("");
          setAttachment(null);
          setHandoverPeer("");
          setEmergencyContact("");
        }, 2200);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPeers = PEER_OPTIONS.filter((p) =>
    p.toLowerCase().includes(peerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Leave request
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plan your time away and see your balance before you submit.
          </p>
        </div>

        <button
          type="button"
          onClick={loadHistory}
          className="self-start sm:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-2xs transition cursor-pointer"
        >
          My requests
        </button>
      </div>

      {/* 2. Leave Balance Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Casual Leave */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Casual leave</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {balance.casualRemaining} days
          </p>
          <p className="text-xs text-slate-400 mt-1">
            of {balance.casualTotal} days remaining
          </p>
        </div>

        {/* Card 2: Medical Leave */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Medical leave</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {balance.medicalRemaining} days
          </p>
          <p className="text-xs text-slate-400 mt-1">
            of {balance.medicalTotal} days remaining
          </p>
        </div>

        {/* Card 3: Earned Leave */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Earned leave</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {balance.earnedRemaining} days
          </p>
          <p className="text-xs text-slate-400 mt-1">
            of {balance.earnedTotal} days remaining
          </p>
        </div>
      </div>

      {/* 3. Main Container: Request Time Off */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Request time off
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            * Required fields
          </span>
        </div>

        {/* Success Alert Banner */}
        {submitSuccess && (
          <div className="mx-6 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-medium animate-fadeIn">
            <LuCircleCheck className="text-lg text-emerald-600 shrink-0" />
            <span>
              Your leave request has been successfully submitted and forwarded to your Line Manager for review.
            </span>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mx-6 mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
            <LuCircleAlert className="text-lg text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Main Grid: Left Form (7 cols) + Right Deduction Preview (5 cols) */}
          <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              {/* Field 1: Leave Type */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Leave type *
                </label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0084f4] transition shadow-2xs pr-10 cursor-pointer"
                    required
                  >
                    <option value="">Select a leave type</option>
                    <option value="Casual leave">
                      Casual leave ({balance.casualRemaining} days remaining)
                    </option>
                    <option value="Medical leave">
                      Medical leave ({balance.medicalRemaining} days remaining)
                    </option>
                    <option value="Earned leave">
                      Earned leave ({balance.earnedRemaining} days remaining)
                    </option>
                    <option value="Unpaid leave">Unpaid leave (Salary deduction)</option>
                  </select>
                  <LuChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Dates Row (Start Date & End Date) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    Start date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (!endDate || e.target.value > endDate) {
                          setEndDate(e.target.value);
                        }
                      }}
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0084f4] transition shadow-2xs cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">
                    End date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0084f4] transition shadow-2xs cursor-pointer"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Field 3: Duration Type */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Duration type *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Full Day", "First Half", "Second Half"] as DurationType[]).map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium transition cursor-pointer ${
                        durationType === type
                          ? "border-[#0084f4] bg-sky-50/50 text-[#0084f4]"
                          : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="durationType"
                        value={type}
                        checked={durationType === type}
                        onChange={() => setDurationType(type)}
                        className="text-[#0084f4] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                  Half-day leave is available for a single date only.
                </p>
              </div>

              {/* Field 4: Reason / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  Reason / Notes *
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly explain why you need leave."
                  maxLength={500}
                  className="w-full bg-white border border-slate-200/90 rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0084f4] transition shadow-2xs resize-none"
                  required
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-medium">
                  <span>10–500 characters</span>
                  <span>{reason.length} / 500</span>
                </div>
              </div>

              {/* Field 5: Attachment Dropzone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-900">
                    Attachment
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Optional unless medical evidence is required
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                />

                {attachment ? (
                  <div className="border border-sky-200 bg-sky-50/50 rounded-xl p-3.5 flex items-center justify-between text-xs text-sky-900">
                    <div className="flex items-center gap-2">
                      <LuFileText className="text-base text-[#0084f4]" />
                      <span className="font-semibold">{attachment.name}</span>
                      <span className="text-slate-400 text-[11px]">
                        ({(attachment.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition cursor-pointer"
                    >
                      <LuX />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-slate-200/90 hover:border-[#0084f4] rounded-xl p-5 text-center cursor-pointer transition bg-slate-50/40 hover:bg-sky-50/20 group flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:text-[#0084f4] shrink-0 transition">
                      <LuUpload className="text-lg" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[#0084f4] hover:underline">
                        Choose a file or drag it here
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        .pdf, .png, .jpeg · Up to 5 MB per file
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-2" />

              {/* Field 6: While you're away */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  While you’re away
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-4">
                  Optional details to help your team stay in touch.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Work Handover Peer */}
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Work handover peer (optional)
                    </label>
                    <div
                      onClick={() => setShowPeerDropdown(!showPeerDropdown)}
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-300 transition shadow-2xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <LuSearch className="text-slate-400 text-sm shrink-0" />
                        <span className={handoverPeer ? "text-slate-900 font-medium" : "text-slate-400"}>
                          {handoverPeer || "Search available peers"}
                        </span>
                      </div>
                      <LuChevronDown className="text-slate-400 text-xs shrink-0" />
                    </div>

                    {showPeerDropdown && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-2 space-y-1">
                        <input
                          type="text"
                          placeholder="Type to filter..."
                          value={peerSearch}
                          onChange={(e) => setPeerSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0084f4] mb-1"
                        />
                        {filteredPeers.map((peer) => (
                          <div
                            key={peer}
                            onClick={() => {
                              setHandoverPeer(peer);
                              setShowPeerDropdown(false);
                            }}
                            className="px-2.5 py-1.5 text-xs rounded-lg hover:bg-sky-50 hover:text-[#0084f4] cursor-pointer transition font-medium flex items-center justify-between"
                          >
                            <span>{peer}</span>
                            {handoverPeer === peer && <LuCheck className="text-xs" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Emergency contact (optional)
                    </label>
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="Enter international phone number"
                      className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0084f4] transition shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Deduction Preview Panel */}
            <div className="lg:col-span-4">
              <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 space-y-4 sticky top-24">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Deduction preview
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Choose a leave type and dates to see how your balance changes.
                  </p>
                </div>

                <div className="border-t border-slate-200/80 pt-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Leave type</span>
                    <span className="font-semibold text-slate-800">
                      {leaveType || "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dates</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                      {startDate && endDate ? `${startDate} → ${endDate}` : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-800">
                      {startDate && endDate ? durationType : "—"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Calculated Working Days</span>
                    <span className="font-semibold text-slate-800">
                      {calculation ? `${calculation.workingDaysCount} days` : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Non-working days</span>
                    <span className="font-semibold text-slate-800">
                      {calculation ? `${calculation.weekendDaysCount} days` : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Policy adjustments</span>
                    <span className="font-semibold text-slate-800">
                      {calculation ? "None" : "—"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/80 pt-3 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold">
                      Total balance deduction
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {calculation ? `–${calculation.totalDeduction} days` : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-bold">
                      Balance after request
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        calculation?.isExceeded
                          ? "text-rose-600"
                          : calculation
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {calculation
                        ? calculation.isExceeded
                          ? "Quota exceeded"
                          : `${calculation.remainingAfter} days`
                        : "—"}
                    </span>
                  </div>
                </div>

                {!calculation && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-200/60">
                    <LuCalendar className="text-sm shrink-0" />
                    <span>Awaiting leave type and dates</span>
                  </div>
                )}

                {/* What happens next box */}
                <div className="border-t border-slate-200/80 pt-4">
                  <h4 className="text-xs font-bold text-slate-900">
                    What happens next?
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Your request goes to your Line Manager for approval. Follow its progress in My requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Action Footer */}
          <div className="border-t border-slate-200/90 p-5 sm:px-7 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Complete the required fields to submit
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your dates and deduction before sending your request.
              </p>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
                isFormValid
                  ? "bg-[#0084f4] hover:bg-[#0070d1] text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>

      {/* 4. My Requests / Leave History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LuClock className="text-[#0084f4] text-lg" />
                <h3 className="text-base font-bold text-slate-900">
                  My Leave Requests History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-12 flex justify-center text-sky-500">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No leave requests submitted yet.
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs">
                {myRequests.map((req) => (
                  <div key={req._id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{req.leaveType}</p>
                      <p className="text-slate-500 mt-0.5">
                        {req.startDate} → {req.endDate} ({req.workingDays} working days · {req.durationType})
                      </p>
                      <p className="text-slate-400 mt-0.5 italic truncate max-w-md">
                        &quot;{req.reason}&quot;
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          req.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : req.status === "REJECTED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
