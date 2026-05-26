/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleId, SkillState } from '../types';
import { 
  Play, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, ChevronRight, CornerDownRight, Zap, 
  Award, ShieldAlert, ArrowRight, User
} from 'lucide-react';

interface MissionLogProps {
  currentModule: ModuleId;
  activePhaseIndex: number;
  scenarioData: any;
  currentStep: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
  onSuccessPhase: () => void;
  onForfeitPhase: () => void;
  // State for tracking custom failures for Infinite Drill
  failureCount: number;
  incrementFail: () => void;
  triggerDrillMessage: boolean;
  setTriggerDrillMessage: (v: boolean) => void;
  onTriggerReRoll: () => void;
  studentName: string;
  studentSection: string;
}

export const MissionLog: React.FC<MissionLogProps> = ({
  currentModule,
  activePhaseIndex,
  scenarioData,
  currentStep,
  setStep,
  onSuccessPhase,
  onForfeitPhase,
  failureCount,
  incrementFail,
  triggerDrillMessage,
  setTriggerDrillMessage,
  onTriggerReRoll,
  studentName,
  studentSection,
}) => {
  // Input fields state
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Time elapsed simulated state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format stopwatch MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Keep state updated on phase changes
  useEffect(() => {
    setValA('');
    setValB('');
    setSelectedOperator('');
    setFinalAnswer('');
    setValidationError('');
    setSuccessAnimation(false);
  }, [currentModule, activePhaseIndex, scenarioData]);

  // Handle cognitive step evaluations
  const handleVerifyStep1 = () => {
    setValidationError('');
    if (!valA.trim() || !valB.trim()) {
      setValidationError('Extraction fields cannot be left blank.');
      return;
    }

    const inputA = parseFloat(valA);
    const inputB = parseFloat(valB);

    if (isNaN(inputA) || isNaN(inputB)) {
      setValidationError('Please enter valid numeric values.');
      return;
    }

    let correct = false;
    let detailError = '';

    // Model custom extraction checks according to current scenarios
    if (currentModule === 'M1_MATH') {
      if (activePhaseIndex === 1) {
        // Daily Rate & Days Present
        const targetA = scenarioData.dailyRate;
        const targetB = scenarioData.daysPresent;
        
        // Allow user in any order
        if ((inputA === targetA && inputB === targetB) || (inputA === targetB && inputB === targetA)) {
          correct = true;
        } else {
          detailError = 'Extracted variables do not match actual payroll log details! Avoid extracting Red Herring allowances.';
        }
      } else {
        // Tardiness: Hourly Rate & Late minutes (37) Let's assume standard sum
        const targetA = scenarioData.hourlyRate;
        const targetB = 37; // sum of 15 + 10 + 12 = 37 mins
        if ((inputA === targetA && inputB === targetB) || (inputA === targetB && inputB === targetA)) {
          correct = true;
        } else {
          detailError = 'Verify biometric punch sums! Did you ignore early clock-ins or late departures?';
        }
      }
    } else if (currentModule === 'M2_MULTIPLIERS') {
      if (activePhaseIndex === 1) {
        // Overtime: Hourly Rate & Overtime Hours (6 hrs total sum)
        const targetA = scenarioData.hourlyRate;
        const targetB = scenarioData.shiftLogs.reduce((acc: number, log: any) => acc + log.actualOT, 0); // usually 6
        if ((inputA === targetA && inputB === targetB) || (inputA === targetB && inputB === targetA)) {
          correct = true;
        } else {
          detailError = 'Check standard hours subtract rules! Did you remember to deduct the 1-hour unpaid lunch break?';
        }
      } else {
        // Holiday standard multipliers check: Daily Rate & Holiday multiplier target
        const targetA = scenarioData.dailyRate;
        const targetB = 2.0; // regular holiday premium is 200% (2.0)
        if ((inputA === targetA && inputB === targetB) || (inputA === targetB && inputB === targetA)) {
          correct = true;
        } else {
          detailError = 'Verify holiday type on calendar! Do not extract Special Non-Working Day rates (1.30) for Regular Holidays (2.0).';
        }
      }
    } else if (currentModule === 'M3_BUREAUCRACY') {
      if (activePhaseIndex === 1) {
        // SSS: Salary row bracket & Outstanding SSS personal loan
        const targetA = scenarioData.correctEEContribution; // e.g. 675
        const targetB = scenarioData.personalLoanAmortization; // e.g. 500
        if ((inputA === targetA && inputB === targetB) || (inputA === targetB && inputB === targetA)) {
          correct = true;
        } else {
          detailError = 'Deducted Spouse loan or selected SSS ER (Employer) share by mistake! Filter red herrings.';
        }
      } else {
        // PhilHealth: Basic Salary & EE Deduct percent (2.5%)
        const targetA = scenarioData.basicSalary;
        const targetB = 2.5; // percent employee share
        if ((inputA === targetA && inputB === targetB) || (inputA === targetB && inputB === targetA)) {
          correct = true;
        } else {
          detailError = 'Deductions only apply to basic contract salary contracts. Ignore allowance noise (₱1,500).';
        }
      }
    }

    if (correct) {
      setStep(2);
      setValidationError('');
    } else {
      incrementFail();
      setValidationError(detailError || 'Extracted variables do not match current scenario records. Try looking at document binders again!');
    }
  };

  const handleVerifyStep2 = () => {
    setValidationError('');
    let correct = false;
    let detailError = '';

    if (currentModule === 'M1_MATH') {
      if (activePhaseIndex === 1) {
        // Operator logic: Multiplication [ x ]
        if (selectedOperator === 'multiply') {
          correct = true;
        } else {
          detailError = 'Adding or dividing Daily Rate is a fatal compliance error! Choose multiplication [ × ].';
        }
      } else {
        // Tardiness operator: divide then multiply or simple operator
        if (selectedOperator === 'tardy_logic') {
          correct = true;
        } else {
          detailError = 'Select correct operational logic to calculate per-minute tardiness penalty: [Hourly Rate / 60] * [Late Min].';
        }
      }
    } else if (currentModule === 'M2_MULTIPLIERS') {
      if (activePhaseIndex === 1) {
        // Overtime logic requires 1.25 multiplier
        if (selectedOperator === 'ot_logic') {
          correct = true;
        } else {
          detailError = 'Select correct DOLE premium Code logic: OT Pay = Hourly Wage * OT Hours * 1.25.';
        }
      } else {
        // Holiday requires 2.0 multiplier
        if (selectedOperator === 'holiday_logic') {
          correct = true;
        } else {
          detailError = 'Select Regular Holiday Code multiplier logic: Holiday Pay = Daily Rate * 2.0x.';
        }
      }
    } else if (currentModule === 'M3_BUREAUCRACY') {
      if (activePhaseIndex === 1) {
        // SSS is an addition of EE Share and personal salary loan
        if (selectedOperator === 'add') {
          correct = true;
        } else {
          detailError = 'Select the addition operator [+] to combine SSS EE share with your outstanding Personal Loan.';
        }
      } else {
        // PhilHealth is multiplication of Basic Salary * 2.5%
        if (selectedOperator === 'ph_logic') {
          correct = true;
        } else {
          detailError = 'Select statutory PhilHealth calculation logic: EE Premium Contribution = Basic Salary * 2.5%.';
        }
      }
    }

    if (correct) {
      setStep(3);
      setValidationError('');
    } else {
      incrementFail();
      setValidationError(detailError);
    }
  };

  const handleVerifyStep3 = () => {
    setValidationError('');
    if (!finalAnswer.trim()) {
      setValidationError('Result answer field cannot be empty.');
      return;
    }

    const answer = parseFloat(finalAnswer);
    if (isNaN(answer)) {
      setValidationError('Please enter a valid numeric calculation.');
      return;
    }

    let correctVal = 0;
    let tolerance = 0.05; // support floating point matches nicely

    if (currentModule === 'M1_MATH') {
      if (activePhaseIndex === 1) {
        correctVal = scenarioData.dailyRate * scenarioData.daysPresent;
      } else {
        // Phase 2 is Gross Pay calculations only (without hints!)
        correctVal = scenarioData.dailyRate * scenarioData.daysPresent;
      }
    } else if (currentModule === 'M2_MULTIPLIERS') {
      if (activePhaseIndex === 1) {
        // Overtime: Hourly Rate * 6 hours * 1.25
        const otHrs = scenarioData.shiftLogs.reduce((acc: number, log: any) => acc + log.actualOT, 0);
        correctVal = Math.round(scenarioData.hourlyRate * otHrs * 1.25 * 100) / 100;
      } else {
        correctVal = scenarioData.dailyRate * 2.0; // Regular holiday is double pay
      }
    } else if (currentModule === 'M3_BUREAUCRACY') {
      if (activePhaseIndex === 1) {
        correctVal = scenarioData.correctEEContribution + scenarioData.personalLoanAmortization;
      } else {
        correctVal = Math.round(scenarioData.basicSalary * 0.025 * 100) / 100;
      }
    }

    const isMatch = Math.abs(answer - correctVal) <= tolerance;

    if (isMatch) {
      setSuccessAnimation(true);
      setTimeout(() => {
        onSuccessPhase();
      }, 1500);
    } else {
      incrementFail();
      if (currentModule === 'M1_MATH' && activePhaseIndex === 2) {
        setValidationError('Compliance check: Computed Gross Pay value is incorrect. Check contract Daily Rate at HR Desk and count the days carefully on the Wall Calendar.');
      } else {
        setValidationError(`Mathematics computation incorrect! Expected answer is close to ₱${correctVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
      }
    }
  };

  // Close the warning overlay and perform randomized scenario re-roll
  const handleDrillAck = () => {
    setTriggerDrillMessage(false);
    onTriggerReRoll(); // Reroll variables
    setStep(1);        // Reset step
    setValA('');
    setValB('');
    setSelectedOperator('');
    setFinalAnswer('');
    setValidationError('');
  };

  return (
    <div id="mission-log-tracker" className="h-full bg-slate-900 border-4 border-slate-705 rounded-xl p-5 flex flex-col justify-between shadow-xl selection:bg-amber-400 selection:text-slate-900 font-mono relative">
      
      {/* Background Subtle Lines */}
      <div className="absolute inset-0 bg-slate-900 bg-grid-slate-800 pointer-events-none opacity-10" />

      {/* Main Header Step Indicator */}
      <div className="relative z-10">
        <div id="student-credential-header" className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500 bg-slate-950 p-1 rounded" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold leading-none">ABM Learner</div>
              <div className="text-xs text-slate-200 font-bold max-w-[130px] truncate">{studentName || 'Not Set'}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-slate-500 uppercase font-bold">Class Section</div>
            <div className="text-xs text-amber-500 font-bold">{studentSection || '12-ABM'}</div>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono pb-2">
          <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-50 animate-pulse" />
            MISSION OBJECTIVE LOG
          </span>
          <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 animate-pulse">
            ⏳ {formatTime(secondsElapsed)}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 border-b border-slate-800 pb-3 leading-relaxed">
          Follow the sequential Cognitive Task Analysis workflow below. Inputs are locked until prerequisites pass.
        </p>

        {/* PROCESS STEPS CONTAINER */}
        <div className="space-y-4 mt-4">
          
          {currentModule === 'M1_MATH' && activePhaseIndex === 2 ? (
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-4">
              <div className="border-b border-slate-900 pb-2">
                <span className="text-[10px] text-amber-500 font-extrabold tracking-widest block uppercase">
                  UN-SCAFFOLDED EVALUATION
                </span>
                <h4 className="text-xs font-semibold text-slate-100 font-display">
                  Independent Gross Pay Audit
                </h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                All scaffolding, cognitive steps, formulas, and visual helpers have been stripped from this room phase. Locate the Contract Daily Rate in the HR Desk and count the active Days Present on the Wall Calendar on your own. Calculate the basic Gross Pay on your scratchpad, then enter the absolute total below.
              </p>
              
              <div className="space-y-2">
                <label className="text-[9.5px] text-slate-400 font-bold block mb-1 uppercase">
                  Computed Gross Pay Result (₱ PHP):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₱</span>
                  <input
                    type="number"
                    step="0.01"
                    value={finalAnswer}
                    onChange={(e) => setFinalAnswer(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-700 rounded pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-emerald-400 placeholder-slate-655 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button
                onClick={handleVerifyStep3}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold py-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                VERIFY COMPLETED CALCULATION
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          ) : (
            <>
              {/* ================= STEP 1: EXTRACT KNOWNS ================= */}
              <div className={`p-4.5 rounded-lg border-2 transition-all ${currentStep === 1 ? 'bg-slate-950 border-amber-550' : 'bg-slate-950/20 border-slate-800 opacity-60'}`}>
                <h4 className="text-xs font-bold flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 ${currentStep === 1 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {currentStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-500 text-[9px] flex items-center justify-center">1</div>}
                    STEP 1: EXTRACT VARIABLES
                  </span>
                  {currentStep === 1 && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">ACTIVE</span>}
                </h4>
                <p className="text-[9.5px] text-slate-450 mt-1 pb-2 leading-relaxed border-b border-slate-900">
                  {currentModule === 'M1_MATH' && activePhaseIndex === 1 && 'Extract contract Daily Rate & calendar Days Present. Filter monthly allowances.'}
                  {currentModule === 'M1_MATH' && activePhaseIndex === 2 && 'Extract true delayed minutes from biometrics logs & Hourly Rate. Subtract departures.'}
                  {currentModule === 'M2_MULTIPLIERS' && activePhaseIndex === 1 && 'Extract true Overtime Hours (deducting meal periods) & Hourly rate.'}
                  {currentModule === 'M2_MULTIPLIERS' && activePhaseIndex === 2 && 'Extract basic Daily Rate & statutory Holiday premium multiplier (double pay=2.0).'}
                  {currentModule === 'M3_BUREAUCRACY' && activePhaseIndex === 1 && 'Extract SSS Employee Share (EE) share from PC & outstanding Loan amortizations.'}
                  {currentModule === 'M3_BUREAUCRACY' && activePhaseIndex === 2 && 'Extract active Basic Contract Salary & statutory PhilHealth premium rate.'}
                </p>

                {currentStep === 1 ? (
                  <div className="mt-3.5 space-y-2.5">
                    {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                      <div className="bg-amber-950/40 border border-amber-500/55 rounded-lg p-3 space-y-1">
                        <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                          💡 BEGINNER EXTRACTION HINT
                        </span>
                        <p className="text-[10px] font-mono text-amber-500 font-bold whitespace-normal leading-relaxed">
                          Check HR Desk: Daily Rate is <strong className="text-white">₱{scenarioData?.dailyRate}</strong>.<br />
                          Check Calendar: Days Present is <strong className="text-white">{scenarioData?.daysPresent}</strong>.<br />
                          Enter these two numbers in Component A and Component B!
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">
                        {currentModule === 'M3_BUREAUCRACY' && activePhaseIndex === 1 ? 'SSS EE CONTRIBUTION SHARE' : 'VARIABLE COMPONENT A'}
                      </label>
                      <input
                        type="number"
                        value={valA}
                        onChange={(e) => setValA(e.target.value)}
                        placeholder="Enter extracted amount/hours"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-slate-100 placeholder-slate-655 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">
                        {currentModule === 'M3_BUREAUCRACY' && activePhaseIndex === 1 ? 'SSS SALARY LOAN REGULAR' : 'VARIABLE COMPONENT B'}
                      </label>
                      <input
                        type="number"
                        value={valB}
                        onChange={(e) => setValB(e.target.value)}
                        placeholder="Enter extracted amount/ratio"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-slate-100 placeholder-slate-655 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      onClick={handleVerifyStep1}
                      className="w-full mt-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-slate-200 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      RUN EXTRACTION UNIT
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  currentStep > 1 && (
                    <div className="mt-2 text-[10px] text-slate-405 flex flex-col gap-1 italic bg-slate-950 p-2.5 rounded border border-slate-900">
                      <span>✔ Extracted Component A: <strong>{valA}</strong></span>
                      <span>✔ Extracted Component B: <strong>{valB}</strong></span>
                    </div>
                  )
                )}
              </div>

              {/* ================= STEP 2: CHOOSE OPERATOR / COEFF ================= */}
              <div className={`p-4.5 rounded-lg border-2 transition-all ${currentStep === 2 ? 'bg-slate-950 border-amber-550 shadow-inner' : 'bg-slate-950/20 border-slate-800 opacity-60'}`}>
                <h4 className="text-xs font-bold flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 ${currentStep === 2 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border border-slate-500 text-[9px] flex items-center justify-center">2</div>}
                    STEP 2: IDENTIFY CORE RULE
                  </span>
                  {currentStep === 2 && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded animate-pulse">ACTIVE</span>}
                </h4>

                {currentStep === 2 ? (
                  <div className="mt-3.5 space-y-2.5">
                    {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                      <div className="bg-amber-950/40 border border-amber-500/55 rounded-lg p-3 space-y-1">
                        <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                          💡 BEGINNER OPERATOR HINT
                        </span>
                        <p className="text-[10px] font-mono text-amber-500 font-bold whitespace-normal leading-relaxed">
                          Select the first option: <strong className="text-white">Multiply: Basic Gross [Daily Rate × Days Present]</strong> as basic calculations use multiplication!
                        </p>
                      </div>
                    )}
                    <label className="text-[9.5px] text-slate-400 font-bold block mb-1 uppercase">Select mathematical code rule logic/ratio:</label>
                    <select
                      value={selectedOperator}
                      onChange={(e) => setSelectedOperator(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="">-- Choose Operator Formula --</option>
                      
                      {/* Module 1 Option paths */}
                      {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                        <>
                          <option value="multiply">Multiply: Basic Gross [Daily Rate × Days Present]</option>
                          <option value="add">Add: Compensatory Bonus [Daily Rate + Days Present]</option>
                          <option value="divide">Divide: Unit Split [Daily Rate / Days Present]</option>
                        </>
                      )}

                      {currentModule === 'M1_MATH' && activePhaseIndex === 2 && (
                        <>
                          <option value="add">Add delay offsets [Hourly Rate + Late Min]</option>
                          <option value="tardy_logic">Tardy Code: [(Hourly Rate / 60) × Late Minutes]</option>
                          <option value="simple">Multiply directly [Hourly Rate × Late Minutes]</option>
                        </>
                      )}

                      {/* Module 2 Options */}
                      {currentModule === 'M2_MULTIPLIERS' && activePhaseIndex === 1 && (
                        <>
                          <option value="simple">Standard sum directly [Hourly Rate × OT Hours]</option>
                          <option value="ot_logic">Overtime Code [Hourly Rate × OT Hours × 1.25]</option>
                          <option value="double_ot">Holiday Overtime Code [Hourly Rate × OT Hours × 2.0]</option>
                        </>
                      )}

                      {currentModule === 'M2_MULTIPLIERS' && activePhaseIndex === 2 && (
                        <>
                          <option value="holiday_logic">Regular Holiday Double-Pay Code [Daily Rate × 2.0]</option>
                          <option value="special">Special Holiday Code [Daily Rate × 1.30]</option>
                        </>
                      )}

                      {/* Module 3 Options */}
                      {currentModule === 'M3_BUREAUCRACY' && activePhaseIndex === 1 && (
                        <>
                          <option value="add">Aggregate additions: [SSS EE share + Salary Loan]</option>
                          <option value="multiply">Combine multiplication: [SSS EE × Salary Loan]</option>
                        </>
                      )}

                      {currentModule === 'M3_BUREAUCRACY' && activePhaseIndex === 2 && (
                        <>
                          <option value="ph_logic">PhilHealth Premium Rule: [Basic Salary × 2.5% EE share]</option>
                          <option value="full_ph">Total Employer Premium: [Basic Salary × 5.0% total]</option>
                        </>
                      )}

                    </select>

                    <button
                      onClick={handleVerifyStep2}
                      className="w-full mt-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 text-slate-200 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      ESTABLISH OPERATION RULE
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  currentStep > 2 && (
                    <div className="mt-2 text-[10px] text-slate-405 italic bg-slate-950 p-2 text-center rounded border border-slate-900">
                      ✔ Code formula rule established: <strong>{selectedOperator}</strong>
                    </div>
                  )
                )}
              </div>

              {/* ================= STEP 3: PERFORM MATHEMATICS ================= */}
              <div className={`p-4.5 rounded-lg border-2 transition-all ${currentStep === 3 ? 'bg-slate-950 border-amber-550' : 'bg-slate-950/20 border-slate-800 opacity-60'}`}>
                <h4 className="text-xs font-bold flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {successAnimation ? <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" /> : <div className="w-4 h-4 rounded-full border border-slate-500 text-[9px] flex items-center justify-center">3</div>}
                    STEP 3: EXECUTE ARITHMETIC
                  </span>
                </h4>

                {currentStep === 3 ? (
                  <div className="mt-3.5 space-y-2.5">
                    {currentModule === 'M1_MATH' && activePhaseIndex === 1 && (
                      <div className="bg-amber-950/40 border border-amber-500/55 rounded-lg p-3 space-y-1">
                        <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                          💡 BEGINNER MATH HINT
                        </span>
                        <p className="text-[10px] font-mono text-amber-500 font-bold whitespace-normal leading-relaxed">
                          Multiply Component A (<strong className="text-white">₱{scenarioData?.dailyRate}</strong>) by Component B (<strong className="text-white">{scenarioData?.daysPresent} days</strong>).<br />
                          The exact calculated Gross Pay is <strong className="text-white">₱{(scenarioData?.dailyRate * scenarioData?.daysPresent).toLocaleString('en-US')}</strong>.<br />
                          Type in the exact correct answer: <strong className="text-white">{scenarioData?.dailyRate * scenarioData?.daysPresent}</strong>!
                        </p>
                      </div>
                    )}
                    <label htmlFor="final-math-input" className="text-[9.5px] text-slate-400 font-bold block mb-1 uppercase">Enter exact computed payroll result (₱ PHP):</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₱</span>
                      <input
                        id="final-math-input"
                        type="number"
                        step="0.01"
                        value={finalAnswer}
                        onChange={(e) => setFinalAnswer(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-900 border border-slate-700 rounded pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-emerald-400 placeholder-slate-655 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <button
                      onClick={handleVerifyStep3}
                      className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold py-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      VERIFY COMPLETED CALCULATION
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[9.5px] text-slate-500 italic mt-1.5">Awaiting extraction verification...</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Dynamic Warning and Failure Notifications */}
        {validationError && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-800 rounded-lg text-[10.5px] text-red-300 leading-relaxed space-y-1 relative z-10">
            <span className="font-bold flex items-center gap-1 text-red-400 uppercase tracking-widest text-[9px]">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              INCORRECT INPUT DETECTED
            </span>
            <p>{validationError}</p>
            {failureCount > 1 && (
              <p className="text-[9px] text-amber-400 font-bold border-t border-red-900/40 pt-1">
                ⚡ Errors registered: {failureCount}/3 to Drill Trigger.
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS FRAME */}
      <div className="border-t border-slate-800 pt-4 mt-6 flex justify-between gap-3 relative z-10">
        <button
          onClick={onForfeitPhase}
          className="flex-1 bg-slate-950/80 hover:bg-red-950/30 border border-slate-800 hover:border-red-800 text-slate-450 hover:text-red-400 transition-colors py-2 px-3 rounded font-bold text-xs uppercase tracking-tight flex items-center justify-center gap-1 cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          Escalate to Manager
        </button>
      </div>

      {/* INFINITE DRILL TRIGGER WARNING OVERLAY DIALOGUE */}
      <AnimatePresence>
        {triggerDrillMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-red-950 border-4 border-red-500 rounded-2xl p-6 shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-red-900 border-2 border-red-400 text-red-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-red-200 font-display font-extrabold text-base tracking-widest uppercase">
                ⚙️ INFINITE DRILL ENGINE TRIGGERED!
              </h3>
              <p className="text-xs text-red-300 mt-2 leading-relaxed">
                Persistent mathematical errors or red-herring extractions detected. To enforce true Cognitive Task competence, guessing has been blocked.
              </p>
              <div className="bg-slate-950 border border-red-900 rounded-lg p-4 my-4 font-mono text-xs text-slate-350 space-y-1.5 text-left">
                <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest block">SYSTEM REMEDIAL DISPOSAL:</span>
                <p>• Reroll of contract daily rates, biographical logs, and shift cards executed.</p>
                <p>• Step progress reset to variable Extraction.</p>
                <p>Please extract the newly randomized numbers to prove sequential mastery.</p>
              </div>
              <button
                onClick={handleDrillAck}
                className="w-full bg-slate-905 hover:bg-slate-900 border-2 border-red-400 text-red-300 font-bold py-2.5 rounded-lg text-xs tracking-wider transition-colors cursor-pointer"
              >
                ACKNOWLEDGE & REROLL WORKSPACE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
