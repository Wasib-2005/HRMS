import { Payslip } from './payroll.model.js';
import type { IPayslipRecord } from './payroll.interface.js';

const SEED_PAYSLIPS: Omit<IPayslipRecord, 'employeeEmail'>[] = [
  {
    employeeName: 'Rayhan Ahmed',
    employeeId: 'EMP-2026-084',
    designation: 'Product Designer',
    department: 'Product & Design',
    periodKey: '2026-09',
    periodLabel: 'September 2026',
    payDate: '30 Sep 2026',
    currency: 'BDT',
    netTakeHome: 72000,
    grossEarnings: 80000,
    totalDeductions: 8000,
    differenceVsPrev: '1,700 more than August',
    percentageDiff: '+2.4%',
    whatChangedSummary:
      'Higher overtime added 2,000; tax withholding increased 300. Your take-home rose 1,700.',
    changes: [
      {
        item: 'Overtime',
        prevAmount: '3,000',
        currAmount: '5,000',
        effectText: '+2,000 · adds to net',
        effectType: 'positive',
      },
      {
        item: 'Income-tax withholding',
        prevAmount: '4,700',
        currAmount: '5,000',
        effectText: '–300 · reduces net',
        effectType: 'negative',
      },
      {
        item: 'Retirement contribution',
        prevAmount: '3,000',
        currAmount: '3,000',
        effectText: '0 · unchanged',
        effectType: 'neutral',
      },
    ],
    prevNet: '70,300',
    currNet: '72,000',
    netEffect: '+1,700 · +2.4%',
    formulaNote1: 'Gross +2,000 – additional deductions 300 = net +1,700.',
    formulaNote2: 'August: gross 78,000 – deductions 7,700 = net 70,300.',
    earnings: [
      { name: 'Basic salary', amount: '60,000' },
      { name: 'Allowances', amount: '15,000' },
      { name: 'Overtime', amount: '5,000' },
    ],
    deductions: [
      {
        name: 'Illustrative income-tax withholding',
        amount: '5,000',
        calcDetails: [
          'Standard personal allowance: 30,000 BDT exempt (0%)',
          'Taxable progressive band: 50,000 BDT taxed at 10% = 5,000 BDT',
          'Net withholding deducted this period: 5,000 BDT',
        ],
      },
      {
        name: 'Employee retirement contribution',
        amount: '3,000',
        subnote: 'Sample plan rule: 5% × basic salary 60,000 = 3,000.',
      },
    ],
    bankAccount: 'City Bank Ltd · **** 4892',
    status: 'PAID',
    inquiries: [],
  },
  {
    employeeName: 'Rayhan Ahmed',
    employeeId: 'EMP-2026-084',
    designation: 'Product Designer',
    department: 'Product & Design',
    periodKey: '2026-08',
    periodLabel: 'August 2026',
    payDate: '31 Aug 2026',
    currency: 'BDT',
    netTakeHome: 70300,
    grossEarnings: 78000,
    totalDeductions: 7700,
    differenceVsPrev: '800 more than July',
    percentageDiff: '+1.1%',
    whatChangedSummary:
      'Regular base salary with standard overtime allowances and statutory deductions.',
    changes: [
      {
        item: 'Overtime',
        prevAmount: '2,200',
        currAmount: '3,000',
        effectText: '+800 · adds to net',
        effectType: 'positive',
      },
      {
        item: 'Income-tax withholding',
        prevAmount: '4,700',
        currAmount: '4,700',
        effectText: '0 · unchanged',
        effectType: 'neutral',
      },
      {
        item: 'Retirement contribution',
        prevAmount: '3,000',
        currAmount: '3,000',
        effectText: '0 · unchanged',
        effectType: 'neutral',
      },
    ],
    prevNet: '69,500',
    currNet: '70,300',
    netEffect: '+800 · +1.1%',
    formulaNote1: 'Gross +800 – deductions unchanged = net +800.',
    formulaNote2: 'July: gross 77,200 – deductions 7,700 = net 69,500.',
    earnings: [
      { name: 'Basic salary', amount: '60,000' },
      { name: 'Allowances', amount: '15,000' },
      { name: 'Overtime', amount: '3,000' },
    ],
    deductions: [
      {
        name: 'Illustrative income-tax withholding',
        amount: '4,700',
        calcDetails: [
          'Standard personal allowance: 30,000 BDT exempt (0%)',
          'Taxable progressive band: 47,000 BDT taxed at 10% = 4,700 BDT',
          'Net withholding deducted this period: 4,700 BDT',
        ],
      },
      {
        name: 'Employee retirement contribution',
        amount: '3,000',
        subnote: 'Sample plan rule: 5% × basic salary 60,000 = 3,000.',
      },
    ],
    bankAccount: 'City Bank Ltd · **** 4892',
    status: 'PAID',
    inquiries: [],
  },
];

export const payrollService = {
  /**
   * Get employee payslips list, seeding if none exist
   */
  async getEmployeePayslips(employeeEmail: string) {
    const count = await Payslip.countDocuments({ employeeEmail });

    if (count === 0) {
      const docs = SEED_PAYSLIPS.map((p) => ({
        ...p,
        employeeEmail,
      }));
      await Payslip.insertMany(docs);
    }

    return Payslip.find({ employeeEmail }).sort({ periodKey: -1 });
  },

  /**
   * Get specific period payslip
   */
  async getPayslipByPeriod(employeeEmail: string, periodKey: string) {
    // Ensure seeding
    await this.getEmployeePayslips(employeeEmail);
    return Payslip.findOne({ employeeEmail, periodKey });
  },

  /**
   * Submit an inquiry to HR/Payroll regarding a payslip
   */
  async submitInquiry(
    employeeEmail: string,
    periodKey: string,
    category: string,
    message: string
  ) {
    const slip = await Payslip.findOne({ employeeEmail, periodKey });
    if (!slip) {
      throw new Error(`Payslip for period ${periodKey} not found.`);
    }

    slip.inquiries.push({
      senderEmail: employeeEmail,
      category,
      message,
      status: 'PENDING',
      createdAt: new Date(),
    });

    return slip.save();
  },

  /**
   * Organization-wide payroll records (for HR / Admin)
   */
  async getAllRecords() {
    return Payslip.find().sort({ periodKey: -1, createdAt: -1 });
  },
};

export default payrollService;
