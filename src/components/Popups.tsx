/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Briefcase, Calendar, ShieldCheck, 
  HelpCircle, Printer, FileText, Landmark,
  Award, RefreshCw, AlertCircle, Cpu, Clipboard,
  CheckCircle, ArrowRight
} from 'lucide-react';

interface PopupsProps {
  activeHotspot: string;
  onClose: () => void;
  scenarioData: any; // Dynamic generated variables depending on module
  activePhaseIndex?: number;
  currentModule?: string;
  currentStep?: number;
  onSuccessPhase?: () => void;
  incrementFail?: () => void;
  failureCount?: number;
}

export const Popups: React.FC<PopupsProps> = ({ 
  activeHotspot, 
  onClose, 
  scenarioData,
  activePhaseIndex,
  currentModule,
  currentStep = 1,
  onSuccessPhase,
  incrementFail,
  failureCount = 0
}) => {
  // Keypad / override input states
  const [doorInput, setDoorInput] = useState('');
  const [doorError, setDoorError] = useState('');
  const [doorSuccess, setDoorSuccess] = useState(false);

  // Clear states when dialog resets
  useEffect(() => {
    setDoorInput('');
    setDoorError('');
    setDoorSuccess(false);
  }, [activeHotspot]);

  const handleVerifyDoorOutput = () => {
    setDoorError('');
    if (!doorInput.trim()) {
      setDoorError('Please enter a passcode key.');
      return;
    }
    const entered = parseFloat(doorInput);
    if (isNaN(entered)) {
      setDoorError('Numeric values only.');
      return;
    }
    const correctVal = scenarioData ? (scenarioData.dailyRate * scenarioData.daysPresent) : 0;
    const tolerance = 0.05;
    const isCorrect = Math.abs(entered - correctVal) <= tolerance;

    if (isCorrect) {
      setDoorSuccess(true);
      setTimeout(() => {
        if (onSuccessPhase) {
          onSuccessPhase();
        }
        onClose();
        setDoorSuccess(false);
        setDoorInput('');
      }, 1500);
    } else {
      if (incrementFail) {
        incrementFail();
      }
      setDoorError('ERROR CODE: 504. Verification failed. Double check contract and calendar days.');
    }
  };

  if (!activeHotspot) return null;

  // Render popup body based on which hotspot is active
  const renderContent = () => {
    switch (activeHotspot) {
      
      // Security camera CCTV popup
      case 'SECURITY_CAMERA':
        return (
          <div id="popup-security-camera" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-705 pb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">CCTV FEED: ACTIVE MONITORING SCREEN</h4>
                <p className="text-[10px] font-mono text-slate-400">Security Office // Camera ID: CAM-04-ENTRY</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden font-mono relative">
              {/* Scanlines overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)]" style={{ backgroundSize: '100% 4px' }} />
              
              <div className="bg-black p-3 text-center border-b border-slate-800 text-[11px] text-emerald-405 font-bold flex justify-between items-center">
                <span className="flex items-center gap-1">🎥 LIVE FEED: ROOM 1 ENTRANCE</span>
                <span className="text-red-500 animate-pulse font-display text-[9px] font-extrabold pb-0.5 px-1.5 bg-red-955/40 border border-red-500/50 rounded">● REC</span>
              </div>

              <div className="p-4 bg-slate-950 text-[11px] text-slate-300 space-y-3">
                <p className="leading-relaxed">
                  The ceiling-mounted camera points directly at the biometrics terminal swiping array. Access footage confirms the punch-in times are authentic and untampered.
                </p>

                <div className="border border-slate-800 rounded bg-slate-900/50 text-[10.5px]">
                  <div className="grid grid-cols-3 bg-slate-850 p-2 text-slate-400 font-bold text-center uppercase tracking-normal border-b border-slate-800">
                    <span>Date & Time</span>
                    <span>Verified ID</span>
                    <span>Visual Verified Event</span>
                  </div>
                  <div className="divide-y divide-slate-800 text-[10px] py-1">
                    <div className="grid grid-cols-3 p-2 text-center text-slate-300">
                      <span>June 08, 07:52 AM</span>
                      <span>EMP-2026-99</span>
                      <span className="text-emerald-400 font-bold">On-Duty Swipe OK</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 text-center text-slate-300 bg-red-950/20">
                      <span>June 09, 08:14 AM</span>
                      <span>EMP-2026-99</span>
                      <span className="text-red-400 font-bold">Late Arrival (+14m)</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 text-center text-slate-300">
                      <span>June 10, 08:00 AM</span>
                      <span>EMP-2026-99</span>
                      <span className="text-emerald-400 font-bold">On-Time Punch OK</span>
                    </div>
                    <div className="grid grid-cols-3 p-2 text-center text-slate-300 bg-red-950/20">
                      <span>June 11, 08:23 AM</span>
                      <span>EMP-2026-99</span>
                      <span className="text-red-400 font-bold">Late Arrival (+23m)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] text-amber-500 font-bold bg-amber-950/15 border border-amber-900/30 p-2 rounded leading-relaxed">
                  💡 SECURITY OFFICER'S VERIFICATION LOG: "Cross-referencing camera feed frames confirms Complainant arrived late twice: exactly 14 minutes on Tuesday June 9, and 23 minutes on Thursday June 11. Positive late minutes sum to exactly 37 minutes. Early punch-ins do not deduct or cancel overall morning tardiness penalties."
                </p>
              </div>
            </div>
          </div>
        );

      // Module 1 Phase 1: Contract information
      case 'HR_DESK':
        return (
          <div id="popup-hr-desk" className="space-y-4">
            <div id="contract-badge" className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <Briefcase className="w-6 h-6 text-amber-400" />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">Active Employment Contract File</h4>
                <p className="text-[10px] font-mono text-slate-400">Classified HR Document // Form 109-A</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-800 px-3 py-1 text-[8px] text-slate-400 rounded-bl border-l border-b border-slate-700">AUTHENTIC</div>
              <div className="grid grid-cols-2 gap-y-2.5">
                <div className="text-slate-400">Employee Name:</div>
                <div className="text-slate-100 font-bold">{scenarioData?.employeeName || 'Juan Dela Cruz'}</div>
                
                <div className="text-slate-400">Position Grade:</div>
                <div className="text-slate-100">ABM Core Level 12</div>
                
                <div className="text-slate-400">Contract Daily Rate:</div>
                <div className="text-emerald-400 font-bold">₱{scenarioData?.dailyRate || 0}.00 / Day</div>
              </div>
            </div>

            {activePhaseIndex === 2 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Statutory Allowance Ledger
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-350">
                  <div>Rice Subsidy:</div>
                  <div className="text-slate-300 font-bold">₱{scenarioData?.riceAllowance || 1200}.00 / Month</div>
                  
                  <div>Uniform Allowance:</div>
                  <div className="text-slate-300">₱{scenarioData?.bonusAmount || 1500}.00 / Semester</div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/20 border border-amber-900/60 rounded-lg p-3.5 space-y-2">
                <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  RED HERRING AUDIT NOISE (DO NOT EXTRACT)
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-350">
                  <div>Rice Subsidy:</div>
                  <div className="text-slate-300 font-bold">₱{scenarioData?.riceAllowance || 1200}.00 / Month</div>
                  
                  <div>Uniform Allowance:</div>
                  <div className="text-slate-300">₱{scenarioData?.bonusAmount || 1500}.00 / Semester</div>
                </div>
                <p className="text-[10px] font-mono text-amber-500 font-bold pt-1 border-t border-amber-900/40">
                  ⭐ Note: According to Philippine accounting frameworks, standard **Gross Basic Pay** calculations strictly multiply the basic **Daily Rate** of the contract by the actual **Days Present** on shift. Allowances and benefits represent external non-basic line items. Filtering this noise tests your Extraction micro-skill.
                </p>
                {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                  <div className="bg-amber-950/40 border border-amber-500/50 rounded-lg p-3 space-y-1 mt-2">
                    <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                      💡 BEGINNER EXTRACT HINT
                    </span>
                    <p className="text-[10.5px] font-mono text-amber-500 font-bold">
                      The Contract Daily Rate is written above as <strong className="text-white">₱{scenarioData?.dailyRate || 0}.00 / Day</strong>. Write this number down to use in Step 1!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      // Calendar view for tracking Shift Days Present vs Absents
      case 'WALL_CALENDAR':
        return (
          <div id="popup-calendar" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <Calendar className="w-6 h-6 text-amber-400" />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">Official Wall Calendar - June 2026</h4>
                <p className="text-[10px] font-mono text-slate-350">Department of Payroll Operations // Shift Calendar</p>
              </div>
            </div>

            <div className="bg-slate-900 p-4 border border-slate-800 rounded-lg font-mono">
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-400 mb-2 pb-1 border-b border-slate-800">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span className="text-red-400">S</span><span className="text-red-400">S</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {/* Pad empty days */}
                <span className="text-slate-700">1</span>
                <span className="text-slate-700">2</span>
                <span className="text-slate-700">3</span>
                <span className="text-slate-700">4</span>
                <span className="text-slate-700">5</span>
                <span className="text-slate-700">6</span>
                <span className="text-slate-700">7</span>

                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">8</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">9</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">10</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">11</span>
                
                {/* June 12 Holiday marked with special border or custom colour */}
                <span className="bg-amber-950/90 border-2 border-amber-450 text-amber-300 rounded font-extrabold py-1 relative group" title="Independence Day regular holiday">
                  12★
                  <span className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 bg-slate-950 text-white p-1 rounded text-[8px] z-20">IND REG HOLIDAY</span>
                </span>
                
                <span className="bg-slate-800 text-slate-500 rounded py-1">13</span>
                <span className="bg-slate-800 text-slate-500 rounded py-1">14</span>

                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">15</span>
                
                {/* Absent Marked with Red A */}
                <span className="bg-red-950/90 border border-red-500 text-red-300 rounded font-bold py-1" title="Absent">16A</span>
                
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">17</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">18</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">19</span>
                <span className="bg-slate-800 text-slate-500 rounded py-1">20</span>
                <span className="bg-slate-800 text-slate-500 rounded py-1">21</span>

                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">22</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">23</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">24</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">25</span>
                <span className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded font-bold py-1">26</span>
                <span className="bg-slate-800 text-slate-500 rounded py-1">27</span>
                <span className="bg-slate-800 text-slate-500 rounded py-1">28</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs leading-relaxed space-y-1.5 font-mono">
              <p className="text-amber-400 font-bold uppercase text-[10px]">⭐ PAYROLL SCENARIO KEY DETAILS:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li><strong className="text-white">Green Dates (8-11, 15, 17-19, 22-26):</strong> Regular working shifts where the employee was present.</li>
                <li><strong className="text-red-400">Date 16A:</strong> Absent mark. The employee did not show up.</li>
                <li><strong className="text-amber-400">Date 12★:</strong> Regular Holiday (Philippine Independence Day). If worked, it attracts double pay (200%).</li>
              </ul>
              {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                <p className="text-amber-500 font-bold text-[10.5px]">
                  Count days present carefully: **{scenarioData?.daysPresent || 14} Days Present** is the correct extraction for calculation, ignoring raw absents and including June 12★ Regular Holiday where shift was clocked.
                </p>
              )}
              {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                <div className="bg-amber-950/40 border border-amber-550/60 rounded-lg p-3 space-y-1 mt-2 text-amber-500 font-bold">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 text-amber-550">
                    💡 BEGINNER CALENDAR HINT
                  </span>
                  <p className="text-[10.5px] font-mono whitespace-normal leading-relaxed text-amber-500 font-bold">
                    Count the active days! There are exactly **{scenarioData?.daysPresent || 14} days** where the employee is Present (13 green boxes + 1 yellow regular holiday June 12★). Note this number down to use in Step 1!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      // Biometrics Screen for tardiness checks
      case 'BIOMETRICS_LOG':
        return (
          <div id="popup-biometrics" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <Cpu className="w-6 h-6 text-amber-400 bg-slate-900 border border-slate-700 p-1.5 rounded-lg" />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">Biometrics Swipe Logs Ledger</h4>
                <p className="text-[10px] font-mono text-slate-400">Integrated ID Swipe Terminal // Model Bio-V4</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
              <div className="grid grid-cols-4 bg-slate-800 p-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center border-b border-slate-700">
                <span>Day</span>
                <span>In Swipe</span>
                <span>Out Swipe</span>
                <span>Late Count</span>
              </div>
              <div className="divide-y divide-slate-800 text-center">
                {scenarioData?.biometricLogs?.map((log: any) => (
                  <div key={log.day} className={`grid grid-cols-4 p-2.5 items-center ${log.minutesLateCounted > 0 ? 'bg-red-950/20 text-slate-100' : 'text-slate-350'}`}>
                    <span className="font-bold text-slate-400">June {log.day + 7}</span>
                    <span className={log.minutesLateCounted > 0 ? 'text-red-400 font-extrabold' : ''}>{log.clockInTime}</span>
                    <span>{log.clockOutTime}</span>
                    <span className={log.minutesLateCounted > 0 ? 'text-red-400 font-mono font-bold bg-red-950/40 rounded py-0.5 border border-red-950' : 'text-slate-500'}>
                      {log.minutesLateCounted > 0 ? `+${log.minutesLateCounted}m` : '0m'}
                    </span>
                  </div>
                )) || <div className="p-4 text-slate-500">No logs generated.</div>}
              </div>
            </div>

            <div className="bg-red-950/25 border border-red-900/60 rounded-lg p-3.5 space-y-2">
              <span className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                ⚠️ INTEGRITY TRAP: BEWARE OF RED HERRINGS
              </span>
              <ul className="list-disc list-inside font-mono text-[10px] text-slate-300 space-y-1">
                <li><strong className="text-white font-semibold">Early Clock-in (e.g. 07:52):</strong> Does NOT reduce overall late minutes (no negative tardiness!). Ignore.</li>
                <li><strong className="text-white font-semibold">Extended Clock-out (e.g. 17:15):</strong> Employee leaving late does NOT cancel morning tardiness penalties. Ignore.</li>
              </ul>
              <p className="text-[10px] font-mono text-amber-500 font-bold pt-1 border-t border-red-900/40">
                Sum only the positive minutes of delay past the **08:00 AM** cutoff. In this scenario, the total positive late minutes sum is exactly **37 minutes**.
              </p>
            </div>
          </div>
        );

      // Overtime sheets for Module 2 Phase 1
      case 'OVERTIME_LOG':
        return (
          <div id="popup-overtime-log" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <Clipboard className="w-6 h-6 text-amber-405" />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">Factory Shift Overtime Authorization</h4>
                <p className="text-[10px] font-mono text-slate-400">Department of Industrial Operations // Overtime Log Sheet</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs">
              <div className="grid grid-cols-5 bg-slate-800 p-2 text-[10px] font-bold text-slate-350 uppercase tracking-tighter text-center border-b border-slate-700">
                <span>Date</span>
                <span>Gross Hrs</span>
                <span>Unpaid Lunch</span>
                <span>Duty Std</span>
                <span>True OT</span>
              </div>
              <div className="divide-y divide-slate-800 text-center">
                {scenarioData?.shiftLogs?.map((log: any) => (
                  <div key={log.day} className={`grid grid-cols-5 p-2.5 items-center ${log.actualOT > 0 ? 'bg-amber-950/20 text-slate-100' : 'text-slate-500'}`}>
                    <span className="font-bold text-slate-400">Day {log.day}</span>
                    <span>{log.hoursWorked} hrs</span>
                    <span className="text-amber-400">{log.lunchBreakUnpaid} hr</span>
                    <span>{log.scheduledHours} hrs</span>
                    <span className={log.actualOT > 0 ? 'text-amber-400 font-bold bg-amber-950/50 rounded py-0.5 border border-amber-900' : ''}>
                      {log.actualOT > 0 ? `+${log.actualOT} hrs` : '0'}
                    </span>
                  </div>
                )) || <div className="p-4 text-slate-500">No logs generated.</div>}
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-950 rounded-lg p-3 text-xs leading-relaxed space-y-1.5 font-mono text-amber-500 font-bold">
              <p className="text-amber-400 font-bold text-[9.5px] uppercase tracking-wider">⚠️ LEGAL COMPLIANCE LUNCH TRAP:</p>
              <p className="text-[10.5px]">
                By DOLE mandate, employees who log a total of {scenarioData?.shiftLogs?.[0]?.hoursWorked || 11} hours are subject to a **mandatory 1-hour unpaid meal break**. You MUST subtract this 1-hour lunch break before computing overtime hours.
              </p>
              <p className="border-t border-amber-950 pt-1 text-[11px] font-bold text-white flex justify-between">
                <span>Summed True OT Hours:</span>
                <span className="text-amber-405">{scenarioData?.shiftLogs?.reduce((acc: number, item: any) => acc + item.actualOT, 0) || 6} Hours</span>
              </p>
            </div>
          </div>
        );

      // DOLE poster on factory wall
      case 'DOLE_POSTER':
        return (
          <div id="popup-dole-poster" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">DOLE Statutory Premium Multipliers Reference</h4>
                <p className="text-[10px] font-mono text-slate-400">Department of Labor and Employment // Poster 301-B</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono space-y-3.5 text-xs">
              <div className="border-l-4 border-amber-400 bg-slate-950 p-2.5 rounded-r">
                <h5 className="font-bold text-slate-100 flex justify-between text-[11px]">
                  <span>CODE 101: STANDARD WORKDAY OVERTIME</span>
                  <span className="text-amber-400">125% (1.25x)</span>
                </h5>
                <p className="text-[10px] text-slate-400 mt-1">Multiplies the hourly wage by 125% for every hour worked beyond the basic 8-hour duty.</p>
              </div>

              <div className="border-l-4 border-amber-500 bg-slate-950 p-2.5 rounded-r">
                <h5 className="font-bold text-slate-100 flex justify-between text-[11px]">
                  <span>CODE 102: SPECIAL NON-WORKING DAY WORKED</span>
                  <span className="text-amber-500">130% (1.30x)</span>
                </h5>
                <p className="text-[10px] text-slate-400 mt-1">Worked shifts on days declared as Special Non-Working Day receive basic + 30% premium.</p>
              </div>

              <div className="border-l-4 border-red-500 bg-slate-950 p-2.5 rounded-r">
                <h5 className="font-bold text-slate-100 flex justify-between text-[11px]">
                  <span>CODE 103: REGULAR HOLIDAY WORKED</span>
                  <span className="text-red-400 font-extrabold">200% (2.00x)</span>
                </h5>
                <p className="text-[10px] text-slate-400 mt-1">Worked shifts on formal national holidays attract Double Pay premium (basic * 2).</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center text-[10.5px] font-mono text-amber-500 font-bold leading-relaxed">
              ⭐ Make sure you distinguish between **Regular Holidays** and **Special Non-Working Days**! In Module 2, Phase 1, the overtime multiplier is <strong className="text-amber-400">1.25x</strong>, whereas worked Regular Holidays in Phase 2 require <strong className="text-red-400">2.00x (double basic daily rate)</strong>.
            </div>
          </div>
        );

      // SSS Contribution PC screen
      case 'PC_TERMINAL':
        return (
          <div id="popup-pc-triple" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <Landmark className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="text-indigo-400 font-display font-extrabold text-sm uppercase">ROBOHACK ACCOUNTS WINDOWS V3.1</h4>
                <p className="text-[10px] font-mono text-slate-400">SSS (Social Security System) Statutory Contribution Index Table</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-md p-1.5 overflow-x-auto">
              <table className="w-full text-left font-mono text-[10px] border-collapse">
                <thead>
                  <tr className="bg-indigo-950 text-indigo-300 border-b border-indigo-900 text-center uppercase tracking-tighter">
                    <th className="p-2 border border-slate-800">Gross Compensation Bracket</th>
                    <th className="p-2 border border-slate-800 text-teal-400">EE Share (Deduct)</th>
                    <th className="p-2 border border-slate-800 text-red-400">ER Share (Company)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 text-center divide-y divide-slate-800">
                  <tr className={scenarioData?.grossPay < 12500 ? 'bg-indigo-900/50 font-bold border-2 border-indigo-450' : ''}>
                    <td className="p-2 border border-slate-850">Below ₱12,500.00</td>
                    <td className="p-2 border border-slate-850 text-teal-400">₱450.00</td>
                    <td className="p-2 border border-slate-850 text-red-400">₱900.00</td>
                  </tr>
                  <tr className={scenarioData?.grossPay >= 12500 && scenarioData?.grossPay < 17500 ? 'bg-indigo-900/50 font-bold border-2 border-indigo-450' : ''}>
                    <td className="p-2 border border-slate-850">₱12,500.00 - ₱17,499.99</td>
                    <td className="p-2 border border-slate-850 text-teal-400">₱675.00</td>
                    <td className="p-2 border border-slate-850 text-red-400">₱1,350.00</td>
                  </tr>
                  <tr className={scenarioData?.grossPay >= 17500 && scenarioData?.grossPay < 22500 ? 'bg-indigo-900/50 font-bold border-2 border-indigo-450' : ''}>
                    <td className="p-2 border border-slate-850">₱17,500.00 - ₱22,499.99</td>
                    <td className="p-2 border border-slate-850 text-teal-400">₱900.00</td>
                    <td className="p-2 border border-slate-850 text-red-400">₱1,800.00</td>
                  </tr>
                  <tr className={scenarioData?.grossPay >= 22505 && scenarioData?.grossPay < 27500 ? 'bg-indigo-900/50 font-bold border-2 border-indigo-450' : ''}>
                    <td className="p-2 border border-slate-850">₱22,500.00 - ₱27,499.99</td>
                    <td className="p-2 border border-slate-850 text-teal-400">₱1,125.00</td>
                    <td className="p-2 border border-slate-850 text-red-400">₱2,250.00</td>
                  </tr>
                  <tr className={scenarioData?.grossPay >= 27500 ? 'bg-indigo-900/50 font-bold border-2 border-indigo-450' : ''}>
                    <td className="p-2 border border-slate-840">₱27,500.00 and Above</td>
                    <td className="p-2 border border-slate-840 text-teal-400">₱1,350.00</td>
                    <td className="p-2 border border-slate-840 text-red-400">₱2,700.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-900 rounded-lg p-3 font-mono text-xs space-y-2 text-slate-300">
              <p className="text-indigo-400 font-bold uppercase text-[9.5px]">⚠️ INTEGRATION & LOAN LEDGERS:</p>
              <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                <div className="text-slate-400">Employee Gross Pay:</div>
                <div className="font-bold text-white">₱{scenarioData?.grossPay || 15000}.00</div>

                <div className="text-slate-400">Active Salary Loan Outstanding:</div>
                <div className="font-bold text-teal-400">₱{scenarioData?.personalLoanAmortization || 500}.00 / Month</div>
                
                <div className="text-slate-400 text-red-300">Active Spousal Loan (OUTSIDE):</div>
                <div className="font-bold text-red-400">₱{scenarioData?.spousalLoanAmortization || 400}.00 (SPOUSE: REJECT)</div>
              </div>
              <p className="text-[10px] text-amber-500 font-bold pt-1.5 border-t border-indigo-900 leading-normal">
                ⭐ Compliance Rules: You must aggregate **only** the Employee's own personal SSS deductions: Employee Share (EE contribution from the highlighted bracket row) + their own Outstanding Personal Salary Loan. Selecting **ER Share** or deducting **Spouse SSS Loans** represents a severe audit failure.
              </p>
            </div>
          </div>
        );

      // PhilHealth circular poster
      case 'PH_POSTER':
        return (
          <div id="popup-ph-poster" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-705 pb-3">
              <Award className="w-6 h-6 text-emerald-400 bg-slate-900 border border-slate-700 p-1.5 rounded-lg" />
              <div>
                <h4 className="text-emerald-400 font-display font-extrabold text-sm uppercase">PhilHealth Official Premium Poster</h4>
                <p className="text-[10px] font-mono text-slate-405">Circular No. 2026-0043 // Regulatory Mandate</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3">
              <div className="text-center border-b border-slate-800 pb-3">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Premium Rate</span>
                <h5 className="text-2xl font-extrabold text-emerald-400 mt-1">5.0% OF BASIC SALARY</h5>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center pt-1.5">
                <div className="bg-slate-950 p-2 border border-slate-800 rounded-md">
                  <span className="text-[8px] text-slate-400 block uppercase">Employee Share (EE)</span>
                  <span className="text-sm font-bold text-teal-400">2.5% (0.025)</span>
                </div>
                <div className="bg-slate-950 p-2 border border-slate-800 rounded-md opacity-60">
                  <span className="text-[8px] text-slate-400 block uppercase">Employer Share (ER)</span>
                  <span className="text-sm font-bold text-slate-400">2.5% (0.025)</span>
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-lg p-3 text-[10.5px] leading-relaxed text-amber-500 font-bold">
                <p className="text-emerald-400 font-bold uppercase text-[9px] mb-1">⚠️ IMPORTANT SCOPE DISCIPLINE:</p>
                PhilHealth statutory premium mandates apply **STRICTLY to Basic Salary**. Variable benefits, bonuses, commissions, or rice allowances do NOT attract PhilHealth salary premium deductions. Isolate Basic Salary perfectly from allowances.
              </div>
            </div>
          </div>
        );

      // Module 4 Disputed Case Audit File Archive
      case 'AUDIT_ARCHIVE':
        return (
          <div id="popup-case-archive" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <FileText className="w-6 h-6 text-amber-400" />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">DOLE Dispute Case File // SEC_404</h4>
                <p className="text-[10px] font-mono text-slate-405">Sub-court Tribunal Archive // Disputed Boardroom Memo</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-[11px] leading-relaxed text-slate-200 h-[280px] overflow-y-auto space-y-3 shadow-inner scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              <div className="border-b border-slate-850 pb-2 mb-2 text-center text-slate-400 text-[10px]">
                --- CLASSIFIED SUB-COURT RECORDS ---
              </div>
              <p>
                <strong>Complainant Case File:</strong> {scenarioData?.employeeName || 'Santos, Juan'}<br />
                <strong>Dispute Type:</strong> Erroneous Payroll Accounting Deductions and Wage Withholding.
              </p>
              <div className="bg-slate-950 p-2.5 border border-slate-850 rounded text-slate-350 space-y-1 my-2">
                <span className="text-amber-400 font-bold text-[9px] uppercase">CONTRACTUAL RECORD DETAILS:</span>
                <p>1. Basic Daily Wage Rate of Complainant is written as <strong className="text-white">₱{scenarioData?.dailyRate || 600}.00 / Day</strong>.</p>
                <p>2. Verified Shifts Worked Count shows standard days present is <strong className="text-white">{scenarioData?.daysPresent || 20} Days present</strong>.</p>
              </div>
              
              <div className="bg-slate-950 p-2.5 border border-slate-850 rounded text-slate-350 space-y-1 mb-2">
                <span className="text-amber-400 font-bold text-[9px] uppercase">OPERATIONAL SHIFT RECORD DETAILS:</span>
                <p>• Biometrics state total of <strong className="text-white">{scenarioData?.tardinessMinutes || 25} Minutes of Tardiness</strong> registered (Hourly rate baseline is calculated as Daily Rate / 8).</p>
                <p>• Factoring industrial shifts, Complainant logged <strong className="text-white">{scenarioData?.otHours || 3} Hours of Overtime</strong> on a standard duty workday (Basic + 25% premium).</p>
                <p>• Complainant claims they worked exactly <strong className="text-white">1 REGULAR HOLIDAY</strong> shift (double pay) where they did not receive appropriate premium rates.</p>
              </div>

              <div className="bg-red-950/20 p-2.5 border border-red-900/40 rounded text-slate-350 space-y-1 mb-2">
                <span className="text-red-400 font-bold text-[9px] uppercase">STATUTORY INSURANCE RECORDS:</span>
                <p>• SSS Personal Outstanding Loan monthly amortization is <strong className="text-white">₱{scenarioData?.sssSalaryLoan || 400}.00</strong>.</p>
                <p>• PhilHealth active base salary is recorded to be <strong className="text-white">₱{scenarioData?.philHealthBasicSalary || 12000}.00 / Month</strong>.</p>
              </div>

              <div className="bg-amber-950/10 p-2.5 border border-amber-900/30 rounded text-slate-400 space-y-1">
                <span className="text-amber-400 font-bold text-[9px] uppercase">COMPLIANCE RED HERRINGS (DETRIMENTS):</span>
                <p>• File notes Spouse SSS loan is <strong className="text-slate-300">₱{scenarioData?.spouseLoan || 450}</strong>.</p>
                <p>• Shift binder lists 1-hour unpaid lunch hour has already been deducted from gross log.</p>
                <p>• HR ledger lists month-end bonus of ₱1,500 which is still under litigation process.</p>
              </div>
              
              <div className="text-center pt-2 text-slate-450 text-[10px]">
                --- END OF CORRESPONDENTIAL DETAILS ---
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg text-[10px] font-mono text-amber-500 font-bold space-y-1 leading-normal">
              <span className="text-amber-450 font-bold uppercase block text-[9px]">💡 INSTRUCTIONS FOR TRIBUNAL:</span>
              Use your scratchpad to compute final earnings (Gross Pay + Overtime Pay + Regular Holiday Pay) and final deductions (Tardiness + SSS Share + PhilHealth Share). Provide the exact audited Net Pay values. No scaffolding.
            </div>
          </div>
        );

      // Interactive Room 1 Whiteboard Popup (Clues and formulas)
      case 'WHITEBOARD':
        return (
          <div id="popup-whiteboard" className="space-y-4 font-sans text-slate-800">
            <div className="flex items-center gap-3 border-b-2 border-slate-700 pb-3">
              <div className="w-8 h-8 rounded bg-slate-100 border border-slate-350 flex items-center justify-center font-bold text-slate-705 shadow-sm text-sm">📝</div>
              <div>
                <h4 className="text-amber-450 font-display font-extrabold text-sm uppercase">LOBBY ACADEMIC WHITEBOARD</h4>
                <p className="text-[10px] font-mono text-slate-400">CIT-U ABM Department // Dynamic Reference Guidelines</p>
              </div>
            </div>

            {/* Dry-erase Board Style Container */}
            <div className="bg-white border-8 border-amber-900 rounded-xl p-6 shadow-inner tracking-wide relative overflow-hidden select-text min-h-[290px] flex flex-col justify-between">
              {/* Whiteboard gloss shine */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-tr from-white/10 to-white/30 rotate-45 transform pointer-events-none" />
              
              <div className="space-y-4">
                <div className="text-center font-mono border-b-2 border-slate-250 pb-2">
                  <span className="text-xs font-bold text-indigo-705 tracking-wider uppercase">📝 CODE FOR CODE OVERRIDE FORMULAS</span>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg font-mono text-xs space-y-2 text-slate-700 shadow-sm">
                  <span className="text-[11px] font-extrabold text-red-550 block">▼ GROSS EARNINGS BASIC LAW:</span>
                  <div className="text-sm font-black text-center text-slate-900 bg-slate-100 p-2 border border-slate-205 rounded font-mono">
                    Gross Pay = Contract Daily Rate × Days Present
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-505 font-medium">
                    "Do NOT ever include allowances or subsidies (such as Rice allowances or Uniform allowances) inside the basic Gross Pay values. These are non-statutory red herrings and MUST be completely ignored during calculations!"
                  </p>
                </div>

                <div className="font-mono text-[11.5px] leading-relaxed space-y-2 text-slate-755 p-1 bg-amber-50/50 border border-amber-100 rounded-md">
                  <span className="text-[10px] font-extrabold text-blue-650 block uppercase">💡 INVESTIGATOR EXTRAC-CLUES:</span>
                  <p className="flex items-start gap-1.5 pl-1">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Find the **Contract Daily Rate** inside the first cubicle on the far-left wall (click the **HR Office Desk**).</span>
                  </p>
                  <p className="flex items-start gap-1.5 pl-1">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Count the verified **Days Present** from the high-mounted **Wall Calendar** on the left wall.</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 text-center text-[10px] font-mono text-slate-400 mt-2 flex justify-between items-center bg-slate-50 px-2 py-1 rounded">
                <span>✒️ Written by: Prof. Garcia, CIT-U</span>
                <span className="text-rose-505 animate-pulse font-bold">● DRY ERASE ONLY</span>
              </div>
            </div>
            
            <div className="bg-slate-905 p-3 rounded-lg text-xs leading-normal font-mono text-slate-350 bg-slate-900 border border-slate-800">
              💡 <strong>LABOR STUDY NOTE:</strong> Clicking the central blue door allows you to input Step 3 arithmetic. Compute the value using the variables extracted from the HR Desk and Wall Calendar.
            </div>
          </div>
        );

      // Interactive Dynamic Door Popup (Keypad input solver)
      case 'ROOM_DOOR':
        const correctVal = scenarioData ? (scenarioData.dailyRate * scenarioData.daysPresent) : 0;
        return (
          <div id="popup-security-door" className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-slate-751 pb-3">
              <span className={`w-3.5 h-3.5 rounded-full ${currentStep < 3 ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-ping'}`} />
              <div>
                <h4 className="text-amber-400 font-display font-extrabold text-sm uppercase">SECURITY PORTAL ENTRY LATCH</h4>
                <p className="text-[10px] font-mono text-slate-404">Cebu Institute of Technology - Lobby Chamber Corridor 1</p>
              </div>
            </div>

            {currentStep < 3 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4 font-mono shadow-lg relative min-h-[200px] flex flex-col justify-center">
                <div className="w-12 h-12 bg-red-955/40 border border-red-500/55 rounded-full flex items-center justify-center mx-auto text-red-500 animate-bounce">
                  🔓
                </div>
                <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest">ACCESS DENIED - AUTOMATIC HARDWARE LOCKOUT</h4>
                <p className="text-[10.5px] text-slate-350 leading-relaxed max-w-sm mx-auto">
                  The central elevator doors are electronically seized. You must first extract the daily rate from the **HR Desk (Step 1)** and verify the formula **(Step 2)** using your Desk Mission Log before you can key-in the override math passcode.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono shadow-inner relative">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-[10.5px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    🌐 PASSCODE Keypad [ACTIVE]
                  </span>
                  <span className="text-[9.5px] text-slate-450">ID: DOOR-M1-OVERRIDE</span>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950 p-3.5 border border-slate-850 rounded-lg space-y-2">
                  <p className="text-sky-300 text-[10.5px] font-bold">
                    ⚠️ AUTOMATIC CALCULATION CODE override:
                  </p>
                  <p>
                    Please enter the exact computed Gross Pay using your extracted variables:
                  </p>
                  <div className="divide-y divide-slate-800/50 pt-1 text-[10px] space-y-1">
                    <p className="flex justify-between pt-1">
                      <span>• Component A (Daily Labor Rate):</span>
                      <strong className="text-white">₱{scenarioData?.dailyRate}.00</strong>
                    </p>
                    <p className="flex justify-between pt-1">
                      <span>• Component B (Days Present):</span>
                      <strong className="text-white">{scenarioData?.daysPresent} Days</strong>
                    </p>
                    <p className="flex justify-between pt-1 font-semibold text-sky-400">
                      <span>• Required Equation Code:</span>
                      <span>Daily Rate × Days Present</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label htmlFor="door-numeric-input" className="text-[9.5px] text-slate-400 font-bold block uppercase">
                    Enter Exact Passcode (Computed Gross Pay Value in ₱ PHP):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-extrabold text-slate-500">₱</span>
                    <input
                      id="door-numeric-input"
                      type="number"
                      step="0.01"
                      value={doorInput}
                      onChange={(e) => setDoorInput(e.target.value)}
                      placeholder="0.00"
                      disabled={doorSuccess}
                      className="w-full bg-black border-2 border-slate-700 hover:border-slate-500 focus:border-sky-505 rounded-md px-8 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none placeholder-slate-705 transition-colors shadow-inner"
                    />
                  </div>

                  {doorError && (
                    <div className="font-mono text-[10.5px] text-red-400 bg-red-955/20 border border-red-900/50 p-2 rounded text-center animate-pulse">
                      🚨 {doorError}
                    </div>
                  )}

                  {doorSuccess ? (
                    <div className="font-mono text-[11px] text-emerald-400 bg-emerald-955/20 border border-emerald-900/50 p-3 rounded text-center font-bold flex flex-col items-center gap-1.5">
                      <span className="animate-spin text-sm">🚪</span>
                      <span>OVERRIDE ACCEPTED - ELEVATOR SLIDING OPEN! Proceeding directly...</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyDoorOutput}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold py-2.5 px-4 rounded-md text-xs transition-all tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5 border-b-4 border-emerald-800"
                      >
                        Verify & Clear Hatch
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <p>No active document selected.</p>;
    }
  };

  return (
    <div id="interactive-doc-overlay" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="popup-card-frame" 
        className="w-full max-w-lg bg-slate-950 border-4 border-slate-700 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Border accent strip */}
        <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600" />

        {/* Close Button top-right */}
        <button
          id="btn-close-popup"
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 text-slate-450 hover:text-slate-100 p-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Sheet Body */}
        <div id="popup-body-payload" className="p-6 md:p-8 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Window bottom control bar */}
        <div id="popup-footer-bar" className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between items-center text-[10px] font-mono text-slate-500 z-10">
          <span>SECURE ENCRYPTED DOC_RECORDS</span>
          <button
            id="btn-confirm-and-dismiss"
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 rounded border-b-2 border-amber-700 transition-colors cursor-pointer"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
