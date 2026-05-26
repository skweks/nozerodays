/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ModuleId = 'M1_MATH' | 'M2_MULTIPLIERS' | 'M3_BUREAUCRACY' | 'M4_TRIBUNAL';

export interface Phase {
  id: string;
  name: string;
  module: ModuleId;
  index: number; // 1 or 2
  description: string;
}

export type SkillState = 'LOCKED' | 'ACTIVE' | 'DRILL_ACTIVE' | 'COMPLETED' | 'FAILED_REMEDIAL' | 'FORFEITED';

export interface MasteryRecord {
  moduleId: ModuleId;
  phaseIndex: number;
  phaseName: string;
  status: 'Completed' | 'Infinite Drill Triggered' | 'Forfeited via Escalation' | 'Pending';
  attempts: number;
  drillsTriggered: number;
  errorLog: string[];
}

// Module-specific active random data
export interface GrossPayScenario {
  employeeName: string;
  dailyRate: number;
  daysPresent: number;
  riceAllowance: number; // Red Herring
  bonusAmount: number; // Red Herring
}

export interface TardinessScenario {
  hourlyRate: number;
  grossPayRetentionAnswer: number; // Gross pay from phase 1
  biometricLogs: {
    day: number;
    clockInTime: string; // e.g. "08:15" (Late 15m), "07:55" (Early - Red Herring), "08:20" (Late 20m)
    clockOutTime: string; // e.g. "17:10" (Late clock out - Red Herring)
    minutesLateCounted: number;
  }[];
}

export interface OvertimeScenario {
  hourlyRate: number;
  shiftLogs: {
    day: number;
    hoursWorked: number; // e.g. 11 hours
    lunchBreakUnpaid: number; // e.g. 1 hour (unpaid lunch - Red Herring)
    scheduledHours: number; // e.g. 8 hours
    actualOT: number; // true OT hours
  }[];
  standardMultiplier: number; // 1.25
  redHerringMultiplier: number; // e.g. 1.30 or 1.10
}

export interface RegularHolidayScenario {
  employeeName: string;
  dailyRate: number;
  shiftDate: string; // e.g. "June 12 (Independence Day)"
  holidayType: 'Regular' | 'Special Non-Working'; // Regular = 2.0x, Special = 1.3x
  isRegularHoliday: boolean; // true if Regular Holiday
  correctMultiplier: number; // 2.0
  redHerringMultiplier: number; // 1.3
}

export interface SSSScenario {
  employeeName: string;
  grossPay: number;
  salaryBracketRow: string; // "P15,000 - P15,499.99"
  correctEEContribution: number; // EE Share (e.g. P675)
  incorrectERContribution: number; // ER Share (e.g. P1350) - Selecting ER is critical failure
  personalLoanAmortization: number; // SSS Salary loan (e.g. P500)
  spousalLoanAmortization: number; // Spouse Loan (e.g. P400) - Red Herring
}

export interface PhilHealthScenario {
  employeeName: string;
  basicSalary: number;
  allowances: number; // P1,500 - Red Herring (only applies to basic salary)
  totalPremiumPercent: number; // 5.0%
  correctEEPercent: number; // 2.5%
  correctERPercent: number; // 2.5%
}

export interface TribunalScenario {
  employeeName: string;
  // Module 1 parameters
  dailyRate: number;
  daysPresent: number;
  tardinessMinutes: number;
  // Module 2 parameters
  otHours: number;
  isHolidayWorked: boolean;
  holidayType: 'Regular' | 'Special'; // Target Regular = 2.0x, Special is ignored or not regular
  // Module 3 parameters
  sssEE: number;
  sssSalaryLoan: number;
  philHealthBasicSalary: number;
  // Red herrings in audit archive binder
  spouseLoan: number;
  riceAllowance: number;
  unpaidLunchHours: number;
  
  // Clean Calculated Solutions
  grossPay: number;
  tardinessDeduction: number;
  overtimePay: number;
  holidayPay: number;
  sssDeduction: number; // sssEE + sssSalaryLoan
  philHealthDeduction: number; // philHealthBasicSalary * 0.025
  
  totalEarnings: number; // grossPay + overtimePay + holidayPay
  totalDeductions: number; // tardinessDeduction + sssDeduction + philHealthDeduction
  correctNetPay: number; // totalEarnings - totalDeductions
}

export interface ActiveGameState {
  studentName: string;
  studentSection: string;
  instructorEmail: string;
  activeModule: ModuleId;
  activePhaseIndex: number; // 1 or 2
  gameCompleted: boolean;
  
  // Scenarios for each phase
  scenarioM1P1: GrossPayScenario | null;
  scenarioM1P2: TardinessScenario | null;
  scenarioM2P1: OvertimeScenario | null;
  scenarioM2P2: RegularHolidayScenario | null;
  scenarioM3P1: SSSScenario | null;
  scenarioM3P2: PhilHealthScenario | null;
  scenarioM4: TribunalScenario | null;

  // UI States
  selectedHotspot: string | null; // e.g. "HR_DESK", "SSS_TABLE", "PC", "POSTER", etc.
  showRetakeScreen: boolean;
  currentObjectiveStep: 1 | 2 | 3; // 1: Extract, 2: Rule, 3: Calc
  roomCompletedUnlocked: boolean;
  infiniteDrillActive: boolean;
  drillFailureCount: number; // tracks consecutive failures to trigger drill re-roll
  
  // Mastery history tracking
  masteryRecords: Record<string, MasteryRecord>;
}
