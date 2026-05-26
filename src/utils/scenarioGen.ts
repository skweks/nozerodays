/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GrossPayScenario,
  TardinessScenario,
  OvertimeScenario,
  RegularHolidayScenario,
  SSSScenario,
  PhilHealthScenario,
  TribunalScenario,
} from '../types';

const NAMES = ['Juan Dela Cruz', 'Maria Santos', 'Ramon Valenzuela', 'Corazon Aquino', 'Jose Macapagal', 'Lorenzo Ruiz', 'Pedro Calungsod', 'Gabriela Silang', 'Andres Bonifacio'];

export function generateM1P1(): GrossPayScenario {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const dailyRate = 500 + Math.floor(Math.random() * 11) * 50; // P500 to P1000 in steps of 50
  const daysPresent = 14; // Matches the 14 days on the calendar (13 green worked days + 1 regular holiday)
  const riceAllowance = 1000 + Math.floor(Math.random() * 6) * 200; // P1000 to P2000
  const bonusAmount = 500 + Math.floor(Math.random() * 4) * 500; // P500 to P2000

  return {
    employeeName: name,
    dailyRate,
    daysPresent,
    riceAllowance,
    bonusAmount,
  };
}

export function generateM1P2(dailyRate: number): TardinessScenario {
  // Hourly rate is derived from Daily Rate / 8 (with 2 decimal precision or rounded gracefully)
  const hourlyRate = Math.round((dailyRate / 8) * 100) / 100;
  
  // Gross pay from Phase 1 is dailyRate * daysPresent.
  const grossPayRetentionAnswer = dailyRate * 14; // Matches the 14 days on the calendar

  // We generate 5 days of biometrics. Some have actual lates, some are "Early clock-ins" (Red Herrings)
  // Standard duty starts at 08:00 AM.
  // Standard duty ends at 17:00 PM.
  const biometricLogs = [
    { day: 1, clockInTime: '08:15', clockOutTime: '17:00', minutesLateCounted: 15 }, // late 15m
    { day: 2, clockInTime: '07:52', clockOutTime: '17:05', minutesLateCounted: 0 },  // early clock in (Red Herring - 0m late)
    { day: 3, clockInTime: '08:10', clockOutTime: '17:00', minutesLateCounted: 10 }, // late 10m
    { day: 4, clockInTime: '08:00', clockOutTime: '17:15', minutesLateCounted: 0 },  // late clock out represents nothing (Red Herring - 0m late)
    { day: 5, clockInTime: '08:12', clockOutTime: '16:58', minutesLateCounted: 12 }, // late 12m
  ];

  return {
    hourlyRate,
    grossPayRetentionAnswer,
    biometricLogs,
  };
}

export function generateM2P1(): OvertimeScenario {
  // Hourly Rate
  const hourlyRate = 80 + Math.floor(Math.random() * 9) * 10; // P80 to P160
  
  // Days of overtime. User must calculate true OT hours: workedHours - lunch(1 hour unpaid) - scheduledHours(8)
  const shiftLogs = [
    { day: 1, hoursWorked: 11, lunchBreakUnpaid: 1, scheduledHours: 8, actualOT: 2 }, // 11 - 1 - 8 = 2 hrs OT
    { day: 2, hoursWorked: 10, lunchBreakUnpaid: 1, scheduledHours: 8, actualOT: 1 }, // 10 - 1 - 8 = 1 hr OT
    { day: 3, hoursWorked: 8, lunchBreakUnpaid: 1, scheduledHours: 8, actualOT: 0 },  // 8 hrs (No OT)
    { day: 4, hoursWorked: 12, lunchBreakUnpaid: 1, scheduledHours: 8, actualOT: 3 }, // 12 - 1 - 8 = 3 hrs OT
  ];

  return {
    hourlyRate,
    shiftLogs,
    standardMultiplier: 1.25, // Standard workday overtime is 125%
    redHerringMultiplier: 1.30,
  };
}

export function generateM2P2(): RegularHolidayScenario {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const dailyRate = 500 + Math.floor(Math.random() * 11) * 50; // P500 to P1000
  
  const holidays = [
    { name: 'June 12 (Independence Day)', type: 'Regular', isRegular: true, mult: 2.0, herringMult: 1.3 },
    { name: 'April 9 (Araw ng Kagitingan)', type: 'Regular', isRegular: true, mult: 2.0, herringMult: 1.3 },
    { name: 'May 1 (Labor Day)', type: 'Regular', isRegular: true, mult: 2.0, herringMult: 1.3 },
  ];
  
  const chosenHoliday = holidays[Math.floor(Math.random() * holidays.length)];

  return {
    employeeName: name,
    dailyRate,
    shiftDate: chosenHoliday.name,
    holidayType: 'Regular',
    isRegularHoliday: true,
    correctMultiplier: chosenHoliday.mult,
    redHerringMultiplier: chosenHoliday.herringMult,
  };
}

export function generateM3P1(m1GrossPay: number): SSSScenario {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  
  // Decide a Gross Pay for bracket selection
  let grossPay = m1GrossPay;
  if (grossPay <= 0) {
    grossPay = 14500 + Math.floor(Math.random() * 11) * 1000; // P14,500 to P24,500
  }

  // Bracket Row & EE SSS contribution share
  let salaryBracketRow = '';
  let correctEEContribution = 0;
  let incorrectERContribution = 0;

  if (grossPay < 12500) {
    salaryBracketRow = 'Below P12,500';
    correctEEContribution = 450;
    incorrectERContribution = 900;
  } else if (grossPay < 17500) {
    salaryBracketRow = 'P12,500 - P17,499.99';
    correctEEContribution = 675;
    incorrectERContribution = 1350;
  } else if (grossPay < 22500) {
    salaryBracketRow = 'P17,500 - P22,499.99';
    correctEEContribution = 900;
    incorrectERContribution = 1800;
  } else if (grossPay < 27500) {
    salaryBracketRow = 'P22,500 - P27,499.99';
    correctEEContribution = 1125;
    incorrectERContribution = 2250;
  } else {
    salaryBracketRow = 'P27,500 and Above';
    correctEEContribution = 1350;
    incorrectERContribution = 2700;
  }

  const personalLoanAmortization = 200 + Math.floor(Math.random() * 5) * 100; // P200 to P600
  const spousalLoanAmortization = 300 + Math.floor(Math.random() * 3) * 150; // P300 to P600 Spouse SSS loan

  return {
    employeeName: name,
    grossPay,
    salaryBracketRow,
    correctEEContribution,
    incorrectERContribution,
    personalLoanAmortization,
    spousalLoanAmortization,
  };
}

export function generateM3P2(): PhilHealthScenario {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const basicSalary = 10000 + Math.floor(Math.random() * 16) * 1000; // P10000 to P25000
  const allowances = 1500; // Red Herring
  
  return {
    employeeName: name,
    basicSalary,
    allowances,
    totalPremiumPercent: 5.0, // 5.0% for the current year
    correctEEPercent: 2.5,   // 2.5% Employee share
    correctERPercent: 2.5,   // 2.5% Employer share
  };
}

export function generateM4(): TribunalScenario {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  
  // M1 - Basic Details
  const dailyRate = 600 + Math.floor(Math.random() * 5) * 100; // P600 to P1000
  const daysPresent = 14; // Matches the 14 days on the calendar
  const tardinessMinutes = 10 + Math.floor(Math.random() * 7) * 5; // 10 to 40 mins
  
  // M2 - Log Sheet Details
  const otHours = 2 + Math.floor(Math.random() * 3); // 2 to 4 hours
  const isHolidayWorked = true;
  
  // Calculate specific outputs
  const grossPay = dailyRate * daysPresent;
  
  const hourlyRate = Math.round((dailyRate / 8) * 100) / 100;
  const tardinessDeduction = Math.round((hourlyRate / 60) * tardinessMinutes * 100) / 100;
  
  const overtimePay = Math.round(hourlyRate * otHours * 1.25 * 100) / 100;
  const holidayPay = dailyRate * 2.0; // 1 Day regular holiday * 2.0x
  
  // SSS Bracket based on total gross Pay
  let sssEE = 0;
  if (grossPay < 12500) sssEE = 450;
  else if (grossPay < 17500) sssEE = 675;
  else if (grossPay < 22500) sssEE = 900;
  else if (grossPay < 27500) sssEE = 1125;
  else sssEE = 1350;
  
  const sssSalaryLoan = 400;
  const philHealthBasicSalary = grossPay > 15000 ? 15000 : grossPay; // custom baseline capped or simple basic
  const sssDeduction = sssEE + sssSalaryLoan;
  
  // PhilHealth deduction: basicSalary * 2.5%
  const philHealthDeduction = Math.round(philHealthBasicSalary * 0.025 * 100) / 100;
  
  const totalEarnings = grossPay + overtimePay + holidayPay;
  const totalDeductions = Math.round((tardinessDeduction + sssDeduction + philHealthDeduction) * 100) / 100;
  const correctNetPay = Math.round((totalEarnings - totalDeductions) * 100) / 100;

  return {
    employeeName: name,
    dailyRate,
    daysPresent,
    tardinessMinutes,
    otHours,
    isHolidayWorked,
    holidayType: 'Regular',
    sssEE,
    sssSalaryLoan,
    philHealthBasicSalary,
    
    // Red herrings
    spouseLoan: 450,
    riceAllowance: 1500,
    unpaidLunchHours: 1,
    
    // Solutions
    grossPay,
    tardinessDeduction,
    overtimePay,
    holidayPay,
    sssDeduction,
    philHealthDeduction,
    
    totalEarnings,
    totalDeductions,
    correctNetPay,
  };
}
