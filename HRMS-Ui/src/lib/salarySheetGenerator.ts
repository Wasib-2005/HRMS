import { jsPDF } from "jspdf";

export interface SalarySheetData {
  employeeName: string;
  employeeId?: string;
  designation?: string;
  department?: string;
  companyName?: string;
  statementPeriod: string;
  payDate?: string;
  currency?: string;
  netTakeHome: string;
  grossEarnings: string;
  totalDeductions: string;
  differenceVsPrev?: string;
  percentageDiff?: string;
  earnings: { name: string; amount: string }[];
  deductions: { name: string; amount: string }[];
  bankAccount?: string;
}

/**
 * Generates and downloads an official, beautifully formatted Full Salary Sheet PDF.
 */
export function generateSalarySheetPdf(data: SalarySheetData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // 1. Top Decorative Brand Bar
  doc.setFillColor(0, 132, 244); // #0084f4 (EuitSols Primary)
  doc.rect(margin, 12, contentWidth, 2, "F");

  // 2. Company Brand & Title Header
  // Logo icon badge [E]
  doc.setFillColor(0, 132, 244);
  doc.roundedRect(margin, 18, 10, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("E", margin + 3.2, 25.5);

  // Company Name & Address
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("EuitSols Technologies Ltd.", margin + 14, 23);

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Software Technology Park, Kawran Bazar, Dhaka-1215", margin + 14, 27);
  doc.text("support@euitsols.com · www.euitsols.com", margin + 14, 30.5);

  // Document Title on Right
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SALARY SHEET / PAYSLIP", pageWidth - margin, 22, { align: "right" });

  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Period: ${data.statementPeriod}`, pageWidth - margin, 26.5, { align: "right" });
  doc.text(`Pay Date: ${data.payDate || "30 Sep 2026"}`, pageWidth - margin, 30.5, {
    align: "right",
  });

  // Paid Status Pill
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(pageWidth - margin - 38, 33, 38, 5.5, 1.5, 1.5, "FD");
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("● PAID · DIRECT DEPOSIT", pageWidth - margin - 19, 36.8, { align: "center" });

  // Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(margin, 42, pageWidth - margin, 42);

  // 3. Employee Info Card
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, 45, contentWidth, 27, 2, 2, "FD");

  // Column 1
  const col1X = margin + 5;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Employee Name:", col1X, 52);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(data.employeeName, col1X + 28, 52);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Designation:", col1X, 59);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(data.designation || "Product Designer", col1X + 28, 59);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Department:", col1X, 66);
  doc.setTextColor(15, 23, 42);
  doc.text(data.department || "Design & Product", col1X + 28, 66);

  // Column 2
  const col2X = margin + 95;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Employee ID:", col2X, 52);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(data.employeeId || "EMP-2026-084", col2X + 28, 52);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Bank Account:", col2X, 59);
  doc.setTextColor(15, 23, 42);
  doc.text(data.bankAccount || "City Bank Ltd · **** 4892", col2X + 28, 59);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Pay Currency:", col2X, 66);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.currency || "BDT"} (Bangladeshi Taka)`, col2X + 28, 66);

  // 4. Side-by-Side Earnings and Deductions Table
  const tableY = 77;
  const tableWidth = (contentWidth - 6) / 2; // 87mm each

  // EARNINGS Table (Left)
  const earnX = margin;
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(earnX, tableY, tableWidth, 7, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("EARNINGS", earnX + 4, tableY + 4.8);
  doc.text("AMOUNT (BDT)", earnX + tableWidth - 4, tableY + 4.8, { align: "right" });

  let curEarnY = tableY + 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  data.earnings.forEach((item) => {
    doc.setTextColor(71, 85, 105);
    doc.text(item.name, earnX + 4, curEarnY);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(item.amount, earnX + tableWidth - 4, curEarnY, { align: "right" });
    doc.setFont("helvetica", "normal");

    // Dotted guide line
    doc.setDrawColor(241, 245, 249);
    doc.line(earnX + 4, curEarnY + 2.5, earnX + tableWidth - 4, curEarnY + 2.5);
    curEarnY += 8;
  });

  // Gross Earnings Total
  const totalEarnY = tableY + 44;
  doc.setFillColor(248, 250, 252);
  doc.rect(earnX, totalEarnY - 4.5, tableWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text("Gross Earnings", earnX + 4, totalEarnY);
  doc.text(data.grossEarnings, earnX + tableWidth - 4, totalEarnY, { align: "right" });

  // DEDUCTIONS Table (Right)
  const dedX = margin + tableWidth + 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(dedX, tableY, tableWidth, 7, "F");
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DEDUCTIONS", dedX + 4, tableY + 4.8);
  doc.text("AMOUNT (BDT)", dedX + tableWidth - 4, tableY + 4.8, { align: "right" });

  let curDedY = tableY + 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  data.deductions.forEach((item) => {
    doc.setTextColor(71, 85, 105);
    doc.text(item.name, dedX + 4, curDedY);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(item.amount, dedX + tableWidth - 4, curDedY, { align: "right" });
    doc.setFont("helvetica", "normal");

    doc.setDrawColor(241, 245, 249);
    doc.line(dedX + 4, curDedY + 2.5, dedX + tableWidth - 4, curDedY + 2.5);
    curDedY += 8;
  });

  // Total Deductions
  const totalDedY = tableY + 44;
  doc.setFillColor(248, 250, 252);
  doc.rect(dedX, totalDedY - 4.5, tableWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text("Total Deductions", dedX + 4, totalDedY);
  doc.text(data.totalDeductions, dedX + tableWidth - 4, totalDedY, { align: "right" });

  // 5. Net Take-Home Highlight Card
  const netCardY = 132;
  doc.setFillColor(239, 246, 255); // sky-50
  doc.setDrawColor(186, 230, 253); // sky-200
  doc.roundedRect(margin, netCardY, contentWidth, 26, 2, 2, "FD");

  // Left Net Pay
  doc.setTextColor(2, 132, 199); // sky-600
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("NET TAKE-HOME SALARY", margin + 6, netCardY + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(`${data.currency || "BDT"} ${data.netTakeHome}`, margin + 6, netCardY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("In words: Seventy-Two Thousand Bangladeshi Taka Only", margin + 6, netCardY + 21);

  // Right Comparison & Method
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(
    `↑ ${data.differenceVsPrev || "1,700 more than August"} (${data.percentageDiff || "+2.4%"})`,
    pageWidth - margin - 6,
    netCardY + 8,
    { align: "right" }
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Disbursement: BEFTN Direct Bank Transfer", pageWidth - margin - 6, netCardY + 14, {
    align: "right",
  });
  doc.text("Clearance Ref: EFT-20260930-849201", pageWidth - margin - 6, netCardY + 18.5, {
    align: "right",
  });

  // 6. Attendance & Hours Snapshot Mini-Box
  const attY = 164;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, attY, contentWidth, 18, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("ATTENDANCE & TIME TRACKING SNAPSHOT", margin + 5, attY + 5.5);

  const statWidth = contentWidth / 4;
  const stats = [
    { label: "Working Days", val: "22 Days" },
    { label: "Days Present", val: "21 Days" },
    { label: "Overtime Hours", val: "10.5 Hours" },
    { label: "Approved Leave", val: "1 Day" },
  ];

  stats.forEach((st, idx) => {
    const sX = margin + idx * statWidth + 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.text(st.label, sX, attY + 11);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(st.val, sX, attY + 15);
  });

  // 7. Policy & Statutory Disclaimers
  const noteY = 188;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Statutory Disclosures & Terms:", margin, noteY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "1. All amounts reflected above are officially denominated in Bangladeshi Taka (BDT).",
    margin,
    noteY + 4.5
  );
  doc.text(
    "2. Income tax withholding is deducted as per the National Board of Revenue progressive tax guidelines.",
    margin,
    noteY + 8.5
  );
  doc.text(
    "3. Retirement contribution is managed under the EuitSols Employee Gratuity & Provident Fund trust.",
    margin,
    noteY + 12.5
  );
  doc.text(
    "4. For any payroll inquiries or adjustments, contact payroll@euitsols.com or use the portal support desk.",
    margin,
    noteY + 16.5
  );

  // 8. Signatures & Digital Seals
  const sigY = 222;
  doc.setDrawColor(203, 213, 225); // slate-300
  // Left: Employee Acknowledgement
  doc.line(margin, sigY + 15, margin + 55, sigY + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Employee Acknowledgement", margin, sigY + 19);

  // Right: Employer Authorized Signatory
  const sigRightX = pageWidth - margin - 55;
  doc.line(sigRightX, sigY + 15, pageWidth - margin, sigY + 15);
  doc.text("Authorized Payroll Officer", sigRightX, sigY + 19);
  doc.setTextColor(0, 132, 244);
  doc.setFont("helvetica", "bold");
  doc.text("[DIGITALLY SIGNED & VERIFIED]", sigRightX, sigY + 12);

  // Center QR/Verification Code Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth / 2 - 25, sigY + 2, 50, 16, 2, 2, "F");
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("VERIFICATION HASH", pageWidth / 2, sigY + 7, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("SEC-EUIT-PAY-202609-849201", pageWidth / 2, sigY + 11.5, { align: "center" });
  doc.text("Status: VALIDATED", pageWidth / 2, sigY + 15, { align: "center" });

  // 9. Document Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 275, pageWidth - margin, 275);

  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    "EuitSols HRMS Automated Payroll System · Confidential Document · Generated for Rayhan Ahmed",
    margin,
    280
  );
  doc.text("Page 1 of 1", pageWidth - margin, 280, { align: "right" });

  // Save / Trigger Download
  const filename = `Salary_Sheet_${data.employeeName.replace(/\s+/g, "_")}_${data.statementPeriod.replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(filename);
}

/**
 * Generates and downloads an official Proof of Income (Redacted PDF) for banks/landlords.
 */
export function generateProofOfIncomePdf(data: SalarySheetData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header Bar
  doc.setFillColor(0, 132, 244);
  doc.rect(margin, 15, contentWidth, 2, "F");

  // Logo + Letterhead
  doc.setFillColor(0, 132, 244);
  doc.roundedRect(margin, 22, 10, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("E", margin + 3.2, 29.5);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("EuitSols Technologies Ltd.", margin + 14, 27);

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Human Resources & Compensation Department", margin + 14, 31.5);
  doc.text("Level 8, Software Technology Park, Dhaka-1215 · hr@euitsols.com", margin + 14, 35.5);

  // Reference Code & Date on Right
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text("REF: PROOF-INC-2026-09-84", pageWidth - margin, 27, { align: "right" });
  doc.text(`Date of Issue: October 01, 2026`, pageWidth - margin, 31.5, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 43, pageWidth - margin, 43);

  // Recipient / Subject
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("TO WHOM IT MAY CONCERN / VERIFICATION ENTITY", margin, 53);

  doc.setFontSize(12);
  doc.text("OFFICIAL CERTIFICATE & PROOF OF MONTHLY INCOME", margin, 62);

  // Formal Letter Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const introText =
    `This official document is issued upon the request of the employee to serve as formal verification of employment and net monthly earnings. ` +
    `EuitSols Technologies Ltd. hereby certifies that the undermentioned individual is an active, permanent employee in good standing.`;
  const splitIntro = doc.splitTextToSize(introText, contentWidth);
  doc.text(splitIntro, margin, 72);

  // Employee Verified Details Box
  const boxY = 88;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, boxY, contentWidth, 38, 2, 2, "FD");

  doc.setFontSize(8.5);
  const rows = [
    { label: "Full Legal Name:", val: data.employeeName },
    { label: "Employee ID Code:", val: data.employeeId || "EMP-2026-084" },
    { label: "Current Designation:", val: data.designation || "Product Designer" },
    { label: "Department / Team:", val: data.department || "Design & Product" },
    { label: "Employment Type:", val: "Full-Time Permanent" },
  ];

  rows.forEach((r, idx) => {
    const rY = boxY + 7 + idx * 6.5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(r.label, margin + 6, rY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(r.val, margin + 50, rY);
  });

  // Net Verified Income Section
  const incomeY = 136;
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, incomeY, contentWidth, 32, 2, 2, "FD");

  doc.setTextColor(2, 132, 199);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("VERIFIED NET TAKE-HOME EARNINGS", margin + 8, incomeY + 8);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(20);
  doc.text(`${data.currency || "BDT"} ${data.netTakeHome}`, margin + 8, incomeY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Applicable Pay Period: ${data.statementPeriod} · Gross Earnings: ${data.grossEarnings} BDT`,
    margin + 8,
    incomeY + 24
  );

  // Redaction Notice
  const redTextY = 178;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Scope of Redaction & Privacy Notice:", margin, redTextY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const privacyText =
    `In compliance with corporate data protection policies and employee financial privacy standards, itemized voluntary deductions, tax withholdings, and medical contributions are redacted from this public certificate. ` +
    `Only final verified net remuneration and employment status are disclosed herein.`;
  const splitPrivacy = doc.splitTextToSize(privacyText, contentWidth);
  doc.text(splitPrivacy, margin, redTextY + 5.5);

  // Verification & Authenticity
  const authY = 210;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, authY, contentWidth, 24, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("Third-Party Verification Contact:", margin + 6, authY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    "To verify the authenticity of this letter, contacting third parties (banks, leasing agencies, embassies) may reach:",
    margin + 6,
    authY + 12
  );
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 132, 244);
  doc.text("EuitSols HR Hotline: +880 2 9876543 · verification@euitsols.com", margin + 6, authY + 17);

  // Signatures
  const sigY = 250;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, sigY + 15, margin + 60, sigY + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Head of Human Resources", margin, sigY + 19.5);
  doc.text("EuitSols Technologies Ltd.", margin, sigY + 23);

  doc.setTextColor(0, 132, 244);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("DIGITALLY AUTHENTICATED", margin, sigY + 12);

  const sigRightX = pageWidth - margin - 50;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(sigRightX, sigY + 2, 50, 20, 2, 2, "F");
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("OFFICIAL STAMP", sigRightX + 25, sigY + 8, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("EUITSOLS CORP SEAL", sigRightX + 25, sigY + 13, { align: "center" });
  doc.text("SEC-VALID-2026", sigRightX + 25, sigY + 17, { align: "center" });

  // Save / Trigger Download
  const filename = `Proof_of_Income_${data.employeeName.replace(/\s+/g, "_")}_${data.statementPeriod.replace(
    /\s+/g,
    "_"
  )}.pdf`;
  doc.save(filename);
}
