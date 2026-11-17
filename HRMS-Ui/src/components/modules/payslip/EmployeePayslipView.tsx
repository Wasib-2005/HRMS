"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  LuCalendar,
  LuChevronDown,
  LuCircleHelp,
  LuDownload,
  LuCheck,
  LuArrowUp,
  LuX,
  LuSend,
  LuFileText,
  LuShieldCheck,
} from "react-icons/lu";
import {
  generateSalarySheetPdf,
  generateProofOfIncomePdf,
} from "@/lib/salarySheetGenerator";
import { payslipService, PayslipRecord } from "@/services/payslip.service";

interface PayPeriodData {
  periodKey: string;
  periodLabel: string;
  netTakeHome: string;
  differenceVsPrev: string;
  percentageDiff: string;
  grossEarnings: string;
  totalDeductions: string;
  whatChangedSummary: string;
  changes: {
    item: string;
    prevAmount: string;
    currAmount: string;
    effectText: string;
    effectType: "positive" | "negative" | "neutral";
  }[];
  prevNet: string;
  currNet: string;
  netEffect: string;
  formulaNote1: string;
  formulaNote2: string;
  earnings: { name: string; amount: string }[];
  deductions: {
    name: string;
    amount: string;
    calcDetails?: string[];
    subnote?: string;
  }[];
}

const PAY_PERIODS: Record<string, PayPeriodData> = {
  "2026-09": {
    periodKey: "2026-09",
    periodLabel: "September 2026",
    netTakeHome: "72,000",
    differenceVsPrev: "1,700 more than August",
    percentageDiff: "+2.4%",
    grossEarnings: "80,000",
    totalDeductions: "8,000",
    whatChangedSummary:
      "Higher overtime added 2,000; tax withholding increased 300. Your take-home rose 1,700.",
    changes: [
      {
        item: "Overtime",
        prevAmount: "3,000",
        currAmount: "5,000",
        effectText: "+2,000 · adds to net",
        effectType: "positive",
      },
      {
        item: "Income-tax withholding",
        prevAmount: "4,700",
        currAmount: "5,000",
        effectText: "–300 · reduces net",
        effectType: "negative",
      },
      {
        item: "Retirement contribution",
        prevAmount: "3,000",
        currAmount: "3,000",
        effectText: "0 · unchanged",
        effectType: "neutral",
      },
    ],
    prevNet: "70,300",
    currNet: "72,000",
    netEffect: "+1,700 · +2.4%",
    formulaNote1: "Gross +2,000 – additional deductions 300 = net +1,700.",
    formulaNote2: "August: gross 78,000 – deductions 7,700 = net 70,300.",
    earnings: [
      { name: "Basic salary", amount: "60,000" },
      { name: "Allowances", amount: "15,000" },
      { name: "Overtime", amount: "5,000" },
    ],
    deductions: [
      {
        name: "Illustrative income-tax withholding",
        amount: "5,000",
        calcDetails: [
          "Standard personal allowance: 30,000 BDT exempt (0%)",
          "Taxable progressive band: 50,000 BDT taxed at 10% = 5,000 BDT",
          "Net withholding deducted this period: 5,000 BDT",
        ],
      },
      {
        name: "Employee retirement contribution",
        amount: "3,000",
        subnote: "Sample plan rule: 5% × basic salary 60,000 = 3,000.",
      },
    ],
  },
  "2026-08": {
    periodKey: "2026-08",
    periodLabel: "August 2026",
    netTakeHome: "70,300",
    differenceVsPrev: "800 more than July",
    percentageDiff: "+1.1%",
    grossEarnings: "78,000",
    totalDeductions: "7,700",
    whatChangedSummary:
      "Regular base salary with standard overtime allowances and statutory deductions.",
    changes: [
      {
        item: "Overtime",
        prevAmount: "2,200",
        currAmount: "3,000",
        effectText: "+800 · adds to net",
        effectType: "positive",
      },
      {
        item: "Income-tax withholding",
        prevAmount: "4,700",
        currAmount: "4,700",
        effectText: "0 · unchanged",
        effectType: "neutral",
      },
      {
        item: "Retirement contribution",
        prevAmount: "3,000",
        currAmount: "3,000",
        effectText: "0 · unchanged",
        effectType: "neutral",
      },
    ],
    prevNet: "69,500",
    currNet: "70,300",
    netEffect: "+800 · +1.1%",
    formulaNote1: "Gross +800 – deductions unchanged = net +800.",
    formulaNote2: "July: gross 77,200 – deductions 7,700 = net 69,500.",
    earnings: [
      { name: "Basic salary", amount: "60,000" },
      { name: "Allowances", amount: "15,000" },
      { name: "Overtime", amount: "3,000" },
    ],
    deductions: [
      {
        name: "Illustrative income-tax withholding",
        amount: "4,700",
        calcDetails: [
          "Standard personal allowance: 30,000 BDT exempt (0%)",
          "Taxable progressive band: 47,000 BDT taxed at 10% = 4,700 BDT",
          "Net withholding deducted this period: 4,700 BDT",
        ],
      },
      {
        name: "Employee retirement contribution",
        amount: "3,000",
        subnote: "Sample plan rule: 5% × basic salary 60,000 = 3,000.",
      },
    ],
  },
};

export default function EmployeePayslipView() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2026-09");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [taxExpanded, setTaxExpanded] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionCategory, setQuestionCategory] = useState("Tax Withholding");
  const [questionMessage, setQuestionMessage] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [payslipData, setPayslipData] = useState<Record<string, PayPeriodData>>(PAY_PERIODS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live payslips from MongoDB Atlas
  useEffect(() => {
    async function loadPayslips() {
      setIsLoading(true);
      try {
        const res = await payslipService.getMyPayslips(user?.email);
        if (res?.data && res.data.length > 0) {
          const dict: Record<string, PayPeriodData> = {};
          res.data.forEach((p: PayslipRecord) => {
            dict[p.periodKey] = {
              periodKey: p.periodKey,
              periodLabel: p.periodLabel,
              netTakeHome: p.netTakeHome.toLocaleString(),
              differenceVsPrev: p.differenceVsPrev || "",
              percentageDiff: p.percentageDiff || "",
              grossEarnings: p.grossEarnings.toLocaleString(),
              totalDeductions: p.totalDeductions.toLocaleString(),
              whatChangedSummary: p.whatChangedSummary || "",
              changes: p.changes || [],
              prevNet: p.prevNet || "",
              currNet: p.currNet || "",
              netEffect: p.netEffect || "",
              formulaNote1: p.formulaNote1 || "",
              formulaNote2: p.formulaNote2 || "",
              earnings: p.earnings || [],
              deductions: p.deductions || [],
            };
          });
          setPayslipData(dict);
        }
      } catch {
        // Fallback to static sample data
      } finally {
        setIsLoading(false);
      }
    }
    loadPayslips();
  }, [user?.email]);

  const currentPay = payslipData[selectedPeriod] || PAY_PERIODS["2026-09"];
  const employeeFullName = user?.name || "Rayhan Ahmed";

  const handleDownload = (type: "full" | "redacted") => {
    setDownloadingType(type);
    try {
      const pdfData = {
        employeeName: employeeFullName,
        employeeId: "EMP-2026-084",
        designation: "Product Designer",
        department: "Design & Product",
        statementPeriod: currentPay.periodLabel,
        payDate: currentPay.periodKey === "2026-09" ? "30 Sep 2026" : "31 Aug 2026",
        currency: "BDT",
        netTakeHome: currentPay.netTakeHome,
        grossEarnings: currentPay.grossEarnings,
        totalDeductions: currentPay.totalDeductions,
        differenceVsPrev: currentPay.differenceVsPrev,
        percentageDiff: currentPay.percentageDiff,
        earnings: currentPay.earnings,
        deductions: currentPay.deductions.map((d) => ({
          name: d.name,
          amount: d.amount,
        })),
        bankAccount: "City Bank Ltd · **** 4892",
      };

      if (type === "full") {
        generateSalarySheetPdf(pdfData);
      } else {
        generateProofOfIncomePdf(pdfData);
      }
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setTimeout(() => {
        setDownloadingType(null);
      }, 500);
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionMessage.trim()) return;

    try {
      await payslipService.submitInquiry({
        periodKey: currentPay.periodKey,
        category: questionCategory,
        message: questionMessage.trim(),
        employeeEmail: user?.email || "employee@hrms.com",
      });
    } catch (err) {
      console.error("Could not sync inquiry to backend:", err);
    }

    setQuestionSubmitted(true);
    setTimeout(() => {
      setQuestionSubmitted(false);
      setShowQuestionModal(false);
      setQuestionMessage("");
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none print:max-w-none print:p-0">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Payslip
            </h1>
            <span className="bg-slate-100 text-slate-600 border border-slate-200/90 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs">
              Sample payroll
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            See what you earned, what was withheld and why your take-home changed.
          </p>
        </div>

        {/* Statement Period Picker */}
        <div className="relative self-start sm:self-auto print:hidden">
          <p className="text-xs text-slate-500 font-medium mb-1 sm:text-right">
            Statement period
          </p>
          <button
            type="button"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <LuCalendar className="text-slate-500 text-base" />
            <span>{currentPay.periodLabel}</span>
            <LuChevronDown
              className={`text-slate-400 text-sm transition-transform ${
                showPeriodDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showPeriodDropdown && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 divide-y divide-slate-100">
              {Object.values(PAY_PERIODS).map((p) => (
                <button
                  key={p.periodKey}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(p.periodKey);
                    setShowPeriodDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    p.periodKey === selectedPeriod
                      ? "bg-sky-50 text-[#0084f4]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{p.periodLabel}</span>
                  {p.periodKey === selectedPeriod && <LuCheck className="text-sm" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Card 1: Net Take-Home Hero Summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        {/* Top Info Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-slate-500 font-medium">
            {employeeFullName} · Product Designer · EuitSols
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#0084f4]"></span>
            <span>Payslip available</span>
          </div>
        </div>

        {/* Primary Numbers Grid */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-1">
          {/* Left: Net take-home */}
          <div>
            <p className="text-xs text-slate-500 font-medium">
              Net take-home · {currentPay.periodLabel}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                BDT
              </span>
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {currentPay.netTakeHome}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-medium">
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <LuArrowUp className="text-xs stroke-[3]" />
                {currentPay.differenceVsPrev}
              </span>
              <span>· {currentPay.percentageDiff}</span>
            </p>
          </div>

          {/* Right: Gross Earnings - Deductions */}
          <div className="flex items-center gap-6 sm:gap-10 pt-2 lg:pt-0">
            {/* Gross earnings */}
            <div>
              <p className="text-xs text-slate-400 font-medium">Gross earnings</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
                {currentPay.grossEarnings}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Money earned</p>
            </div>

            {/* Minus Sign */}
            <span className="text-2xl sm:text-3xl text-slate-300 font-light select-none">–</span>

            {/* Total deductions */}
            <div>
              <p className="text-xs text-slate-400 font-medium">Total deductions</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-tight">
                {currentPay.totalDeductions}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Money withheld</p>
            </div>
          </div>
        </div>

        {/* Bottom Currency Disclaimer */}
        <p className="border-t border-slate-100 pt-4 text-xs text-slate-400">
          All amounts in BDT, used only as an illustrative currency. Sample figures are not payroll records.
        </p>
      </div>

      {/* 3. Card 2: What changed? Comparison Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">What changed?</h2>
          <span className="text-xs text-slate-400 font-medium">
            September vs August 2026 · BDT
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          {currentPay.whatChangedSummary}
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 font-medium">
                <th className="pb-2.5 font-medium">Pay item</th>
                <th className="pb-2.5 font-medium text-right">August 2026</th>
                <th className="pb-2.5 font-medium text-right">September 2026</th>
                <th className="pb-2.5 font-medium text-right">Effect on take-home</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {currentPay.changes.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 text-slate-800 font-medium">{c.item}</td>
                  <td className="py-3 text-slate-600 text-right">{c.prevAmount}</td>
                  <td className="py-3 text-slate-900 font-semibold text-right">
                    {c.currAmount}
                  </td>
                  <td
                    className={`py-3 text-right font-medium ${
                      c.effectType === "positive"
                        ? "text-emerald-600"
                        : c.effectType === "negative"
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {c.effectText}
                  </td>
                </tr>
              ))}

              {/* Net take-home summary row */}
              <tr className="border-t-2 border-slate-200 font-bold text-sm text-slate-900">
                <td className="pt-3.5 pb-2">Net take-home</td>
                <td className="pt-3.5 pb-2 text-right">{currentPay.prevNet}</td>
                <td className="pt-3.5 pb-2 text-right">{currentPay.currNet}</td>
                <td className="pt-3.5 pb-2 text-right text-slate-900 font-bold">
                  {currentPay.netEffect}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formula Explanatory Note & Question Link */}
        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-start gap-2">
            <LuCircleHelp className="text-slate-400 text-sm mt-0.5 shrink-0" />
            <div className="space-y-0.5 text-slate-500">
              <p>{currentPay.formulaNote1}</p>
              <p className="text-slate-400">{currentPay.formulaNote2}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowQuestionModal(true)}
            className="self-start sm:self-auto text-[#0084f4] hover:text-[#0070d1] font-semibold hover:underline cursor-pointer"
          >
            Ask payroll a question
          </button>
        </div>
      </div>

      {/* 4. Card 3: Your pay breakdown */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Your pay breakdown</h2>
          <span className="text-xs text-slate-400 font-medium">
            {currentPay.periodLabel} · BDT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Column 1: Earnings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Earnings
            </h3>

            <div className="space-y-2.5">
              {currentPay.earnings.map((e, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{e.name}</span>
                  <span className="text-slate-900 font-semibold">{e.amount}</span>
                </div>
              ))}
            </div>

            {/* Total Gross Earnings */}
            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Gross earnings</span>
              <span className="text-sm font-bold text-slate-900">
                {currentPay.grossEarnings}
              </span>
            </div>
          </div>

          {/* Column 2: Deductions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Deductions
            </h3>

            <div className="space-y-3">
              {currentPay.deductions.map((d, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{d.name}</span>
                    <span className="text-slate-900 font-semibold">{d.amount}</span>
                  </div>

                  {/* Optional Calculation Toggle */}
                  {d.calcDetails && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setTaxExpanded(!taxExpanded)}
                        className="text-xs text-[#0084f4] hover:text-[#0070d1] font-medium flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>How this is calculated</span>
                        <LuChevronDown
                          className={`text-xs transition-transform ${
                            taxExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {taxExpanded && (
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600 space-y-1.5 animate-fadeIn">
                          {d.calcDetails.map((step, sIdx) => (
                            <p key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-[#0084f4] font-bold">•</span>
                              <span>{step}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optional Subnote */}
                  {d.subnote && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{d.subnote}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Total Deductions */}
            <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Total deductions</span>
              <span className="text-sm font-bold text-slate-900">
                {currentPay.totalDeductions}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <p className="border-t border-slate-100 pt-4 text-xs text-slate-400">
          Sample tax and retirement rules are illustrative, not EuitSols policy or statutory rates.
        </p>
      </div>

      {/* 5. Card 4: Choose what to share (Export Options) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center gap-2">
          <LuDownload className="text-slate-700 text-lg" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Choose what to share</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Option 1: Full Payslip PDF */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Full payslip · PDF</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                For your records: employee, employer, statement period, all earnings and deductions, plus calculation context.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleDownload("full")}
                disabled={downloadingType !== null}
                className="bg-[#0084f4] hover:bg-[#0070d1] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer active:scale-[0.99] disabled:opacity-70 flex items-center gap-2"
              >
                <LuFileText className="text-sm" />
                <span>
                  {downloadingType === "full" ? "Preparing PDF..." : "Download Full PDF"}
                </span>
              </button>
            </div>
          </div>

          {/* Option 2: Proof of income (Redacted) */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Proof of income · Redacted PDF</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                For a landlord or bank: name, employer, month, currency and net income only. Review the sharing scope first.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleDownload("redacted")}
                disabled={downloadingType !== null}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl shadow-2xs transition cursor-pointer active:scale-[0.99] disabled:opacity-70 flex items-center gap-2"
              >
                <LuShieldCheck className="text-sm text-slate-500" />
                <span>
                  {downloadingType === "redacted"
                    ? "Generating Proof..."
                    : "Download Redacted PDF"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="border-t border-slate-100 pt-4 text-xs text-slate-400">
          Proof of income is a one-month summary. Check the recipient’s requirements; acceptance is not guaranteed.
        </p>
      </div>

      {/* 6. Ask Payroll A Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <LuCircleHelp className="text-[#0084f4] text-lg" />
                <h3 className="text-base font-bold text-slate-900">Ask Payroll a Question</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            {questionSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  <LuCheck />
                </div>
                <p className="text-sm font-bold text-slate-900">Question Submitted</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your inquiry regarding {currentPay.periodLabel} has been routed to the HR Payroll department. You will receive an email response shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Category
                  </label>
                  <select
                    value={questionCategory}
                    onChange={(e) => setQuestionCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0084f4] transition"
                  >
                    <option value="Tax Withholding">Tax Withholding calculation</option>
                    <option value="Overtime Calculation">Overtime hours discrepancy</option>
                    <option value="Retirement Contribution">Retirement fund contribution</option>
                    <option value="Bank Account">Disbursement / Bank account</option>
                    <option value="Other">Other payroll inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Question
                  </label>
                  <textarea
                    rows={4}
                    value={questionMessage}
                    onChange={(e) => setQuestionMessage(e.target.value)}
                    placeholder="Describe what you'd like clarification on regarding this payslip..."
                    className="w-full bg-white border border-slate-200/90 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0084f4] transition"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0084f4] hover:bg-[#0070d1] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <LuSend className="text-xs" />
                    <span>Submit Question</span>
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
