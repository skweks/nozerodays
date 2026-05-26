/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OfficeRoom } from './components/OfficeRoom';
import { MissionLog } from './components/MissionLog';
import { Popups } from './components/Popups';
import { ReportCard } from './components/ReportCard';
import { ModuleId, ActiveGameState, MasteryRecord } from './types';
import * as scenarioGen from './utils/scenarioGen';
import { 
  Building, UserCheck, Shield, ChevronLeft, 
  HelpCircle, AlertTriangle, Play, RotateCcw, 
  BookOpen, Terminal, CheckCircle2, ChevronRight,
  Clipboard, Landmark, Award, ShieldAlert
} from 'lucide-react';

export default function App() {
  // Global Student Profile Initialization
  const [studentMetadata, setStudentMetadata] = useState<{
    name: string;
    section: string;
    email: string;
  } | null>(null);

  // Core Game State Engine
  const [activeModule, setActiveModule] = useState<ModuleId>('M1_MATH');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  
  // Guard and Retention Lock status
  const [guardLocked, setGuardLocked] = useState<boolean>(false);
  const [guardCheckedThisPhase, setGuardCheckedThisPhase] = useState<boolean>(false);
  const [guardQuestion, setGuardQuestion] = useState<string>('');
  const [guardOptions, setGuardOptions] = useState<string[]>([]);
  const [guardError, setGuardError] = useState<string>('');

  // Infinite Drill Fail counters
  const [failureCount, setFailureCount] = useState<number>(0);
  const [triggerDrillMessage, setTriggerDrillMessage] = useState<boolean>(false);

  // Scenario randomized details state
  const [scenarioM1P1, setScenarioM1P1] = useState<any>(null);
  const [scenarioM1P2, setScenarioM1P2] = useState<any>(null);
  const [scenarioM2P1, setScenarioM2P1] = useState<any>(null);
  const [scenarioM2P2, setScenarioM2P2] = useState<any>(null);
  const [scenarioM3P1, setScenarioM3P1] = useState<any>(null);
  const [scenarioM3P2, setScenarioM3P2] = useState<any>(null);
  const [scenarioM4, setScenarioM4] = useState<any>(null);

  // Module Progression Map
  const [unlockedModules, setUnlockedModules] = useState<Record<ModuleId, boolean>>({
    M1_MATH: true,
    M2_MULTIPLIERS: false,
    M3_BUREAUCRACY: false,
    M4_TRIBUNAL: false,
  });

  // Final Game Completion flag
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  // Granular Mastery records tracking
  const [masteryRecords, setMasteryRecords] = useState<Record<string, MasteryRecord>>({
    'M1_P1': { moduleId: 'M1_MATH', phaseIndex: 1, phaseName: 'Gross Pay Calculation', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    'M1_P2': { moduleId: 'M1_MATH', phaseIndex: 2, phaseName: 'Gross Pay (No Hints)', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    'M2_P1': { moduleId: 'M2_MULTIPLIERS', phaseIndex: 1, phaseName: 'Overtime Pay Computation', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    'M2_P2': { moduleId: 'M2_MULTIPLIERS', phaseIndex: 2, phaseName: 'Regular Holiday Computation', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    'M3_P1': { moduleId: 'M3_BUREAUCRACY', phaseIndex: 1, phaseName: 'Statutory Brackets & Loans', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    'M3_P2': { moduleId: 'M3_BUREAUCRACY', phaseIndex: 2, phaseName: 'PhilHealth Contributions', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    'M4_FINAL': { moduleId: 'M4_TRIBUNAL', phaseIndex: 1, phaseName: 'Full Payroll Synthesis & Diagnostic', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
  });

  // Setup initial randomized scenario variables
  useEffect(() => {
    const freshM1P1 = scenarioGen.generateM1P1();
    setScenarioM1P1(freshM1P1);
    
    // Dependent variables chain
    setScenarioM1P2(scenarioGen.generateM1P1());
    setScenarioM2P1(scenarioGen.generateM2P1());
    setScenarioM2P2(scenarioGen.generateM2P2());
    setScenarioM3P1(scenarioGen.generateM3P1(freshM1P1.dailyRate * freshM1P1.daysPresent));
    setScenarioM3P2(scenarioGen.generateM3P2());
    setScenarioM4(scenarioGen.generateM4());
  }, []);

  // Monitor Phase shifts to configure locks and retention guards
  useEffect(() => {
    setFailureCount(0);
    setValidationErrorM4('');
    setTriggerDrillMessage(false);
    setSelectedHotspot(null);
    setCurrentStep(1);

    // If entering phase 2 of M2, M3, spawn the Compliance Guard automatically.
    // For M1_MATH, the Guard blocks at the end of Step 3 Phase 2.
    if (activePhaseIndex === 2 && !guardCheckedThisPhase && activeModule !== 'M1_MATH') {
      setGuardLocked(true);
      configureGuardQuestion();
    } else {
      setGuardLocked(false);
    }
  }, [activeModule, activePhaseIndex]);

  // Setup NPC Guard validation queries for prerequisite clearance
  const configureGuardQuestion = () => {
    setGuardError('');
    if (activeModule === 'M1_MATH') {
      setGuardQuestion('Under standard CIT-U ABM frameworks, which payroll component MUST be strictly FILTERED & EXCLUDED when calculating basic Gross Pay totals?');
      setGuardOptions([
        'Contract Daily Labor Rate',
        'Rice Subsidies and Uniform Allowances (Red Herrings)',
        'Verified Shift Days Present logs'
      ]);
    } else if (activeModule === 'M2_MULTIPLIERS') {
      setGuardQuestion('By standard DOLE statutory mandates, if an employee logs an 11-hour working day, how many hours represents their mandatory unpaid break period?');
      setGuardOptions([
        '0.5 Hours (rest intervals)',
        '1.0 Hour (mandatory unpaid meal period)',
        '2.0 Hours (split duty splits)'
      ]);
    } else if (activeModule === 'M3_BUREAUCRACY') {
      setGuardQuestion('When navigating Social Security PC tables, what critical corporate compliance error is triggered if a junior accountant selects ER Share instead of EE Share?');
      setGuardOptions([
        'Wage Theft: Erroneously withholding the company statutory share from employee wages',
        'Overpayment: Underfunding the SSS state reserve accounts',
        'Tax Duplication: Generating invalid audit logs'
      ]);
    }
  };

  // Submit NPC Guard answer
  const handleSubmitGuardAnswer = (answer: string) => {
    setGuardError('');
    let isCorrect = false;

    if (activeModule === 'M1_MATH') {
      isCorrect = answer.includes('Rice Subsidies');
    } else if (activeModule === 'M2_MULTIPLIERS') {
      isCorrect = answer.includes('1.0 Hour');
    } else if (activeModule === 'M3_BUREAUCRACY') {
      isCorrect = answer.includes('Wage Theft');
    }

    if (isCorrect) {
      setGuardLocked(false);
      setGuardCheckedThisPhase(true);
      setSelectedHotspot(null); // Clear dialog

      // If they just passed the guard assessment at the end of Room 1 Phase 2, advance to Room 2
      if (activeModule === 'M1_MATH' && activePhaseIndex === 2) {
        setUnlockedModules((prev) => ({ ...prev, M2_MULTIPLIERS: true }));
        setActiveModule('M2_MULTIPLIERS');
        setActivePhaseIndex(1);
      }
    } else {
      setGuardError('Compliance check verification failed! Think carefully about ABM statutory rules.');
      
      // Update mastery errors
      const phaseKey = `${getModuleAbbreviation(activeModule)}_P${activePhaseIndex}`;
      setMasteryRecords((prev) => ({
        ...prev,
        [phaseKey]: {
          ...prev[phaseKey],
          attempts: prev[phaseKey].attempts + 1,
          errorLog: [...prev[phaseKey].errorLog, 'NPC Guard Fail']
        }
      }));
    }
  };

  // Extract module code helpers
  const getModuleAbbreviation = (mod: ModuleId) => {
    if (mod === 'M1_MATH') return 'M1';
    if (mod === 'M2_MULTIPLIERS') return 'M2';
    if (mod === 'M3_BUREAUCRACY') return 'M3';
    return 'M4';
  };

  // Trigger scenario variable re-roll when Infinite Drill starts
  const handleTriggerReRoll = () => {
    const phaseKey = `${getModuleAbbreviation(activeModule)}_P${activePhaseIndex}`;
    
    // Log drill trigger on mastery records
    setMasteryRecords((prev) => ({
      ...prev,
      [phaseKey]: {
        ...prev[phaseKey],
        drillsTriggered: prev[phaseKey].drillsTriggered + 1,
        status: 'Infinite Drill Triggered'
      }
    }));

    if (activeModule === 'M1_MATH') {
      if (activePhaseIndex === 1) {
        setScenarioM1P1(scenarioGen.generateM1P1());
      } else {
        setScenarioM1P2(scenarioGen.generateM1P1());
      }
    } else if (activeModule === 'M2_MULTIPLIERS') {
      if (activePhaseIndex === 1) {
        setScenarioM2P1(scenarioGen.generateM2P1());
      } else {
        setScenarioM2P2(scenarioGen.generateM2P2());
      }
    } else if (activeModule === 'M3_BUREAUCRACY') {
      if (activePhaseIndex === 1) {
        setScenarioM3P1(scenarioGen.generateM3P1(scenarioM1P1?.dailyRate * 20));
      } else {
        setScenarioM3P2(scenarioGen.generateM3P2());
      }
    }
    setFailureCount(0);
  };

  const handleIncrementFail = () => {
    setFailureCount((prev) => {
      const newVal = prev + 1;
      // If student fails more than 2 consecutive times, trigger the Infinite Drill re-roll overlay
      if (newVal >= 3) {
        setTriggerDrillMessage(true);
      }
      return newVal;
    });

    const phaseKey = `${getModuleAbbreviation(activeModule)}_P${activePhaseIndex}`;
    setMasteryRecords((prev) => ({
      ...prev,
      [phaseKey]: {
        ...prev[phaseKey],
        attempts: prev[phaseKey].attempts + 1
      }
    }));
  };

  // Handle successful phase completion
  const handleSuccessPhase = () => {
    const phaseKey = `${getModuleAbbreviation(activeModule)}_P${activePhaseIndex}`;
    
    setMasteryRecords((prev) => ({
      ...prev,
      [phaseKey]: {
        ...prev[phaseKey],
        status: prev[phaseKey].status === 'Infinite Drill Triggered' ? 'Infinite Drill Triggered' : 'Completed'
      }
    }));

    // Reset guards checks
    setGuardCheckedThisPhase(false);

    // Progress flow
    if (activePhaseIndex === 1) {
      setActivePhaseIndex(2);
    } else {
      // Transition to next module
      if (activeModule === 'M1_MATH') {
        // Guard pops up with assessment block to proceed to Room 2!
        setGuardLocked(true);
        configureGuardQuestion();
        setSelectedHotspot('GUARD_NPC');
        return;
      } else if (activeModule === 'M2_MULTIPLIERS') {
        setUnlockedModules(prev => ({ ...prev, M3_BUREAUCRACY: true }));
        setActiveModule('M3_BUREAUCRACY');
        setActivePhaseIndex(1);
      } else if (activeModule === 'M3_BUREAUCRACY') {
        setUnlockedModules(prev => ({ ...prev, M4_TRIBUNAL: true }));
        setActiveModule('M4_TRIBUNAL');
        setActivePhaseIndex(1);
      }
    }
  };

  // Handle Escalate to Manager (Forfeiture of phase)
  const handleForfeitPhase = () => {
    const confirmForfeit = window.confirm(
      'Are you sure you want to escalate to the manager? This locks the current room phase and records a "Forfeited via Escalation" status on your teacher checklist reports.'
    );
    if (!confirmForfeit) return;

    const phaseKey = `${getModuleAbbreviation(activeModule)}_P${activePhaseIndex}`;
    setMasteryRecords((prev) => ({
      ...prev,
      [phaseKey]: {
        ...prev[phaseKey],
        status: 'Forfeited via Escalation'
      }
    }));

    setGuardCheckedThisPhase(false);

    // Instantly bypass current phase
    if (activePhaseIndex === 1) {
      setActivePhaseIndex(2);
    } else {
      if (activeModule === 'M1_MATH') {
        setUnlockedModules(prev => ({ ...prev, M2_MULTIPLIERS: true }));
        setActiveModule('M2_MULTIPLIERS');
        setActivePhaseIndex(1);
      } else if (activeModule === 'M2_MULTIPLIERS') {
        setUnlockedModules(prev => ({ ...prev, M3_BUREAUCRACY: true }));
        setActiveModule('M3_BUREAUCRACY');
        setActivePhaseIndex(1);
      } else if (activeModule === 'M3_BUREAUCRACY') {
        setUnlockedModules(prev => ({ ...prev, M4_TRIBUNAL: true }));
        setActiveModule('M4_TRIBUNAL');
        setActivePhaseIndex(1);
      }
    }
  };

  // =========================================================================
  // MODULE 4: BOARDROOM THE COMPLETE AUDIT (NO SCAFFOLDING)
  // =========================================================================
  const [grossInputM4, setGrossInputM4] = useState('');
  const [deductInputM4, setDeductInputM4] = useState('');
  const [netInputM4, setNetInputM4] = useState('');
  const [validationErrorM4, setValidationErrorM4] = useState('');
  const [diagnosticRedirecting, setDiagnosticRedirecting] = useState('');

  const submitAuditorAssessment = () => {
    setValidationErrorM4('');
    if (!grossInputM4.trim() || !deductInputM4.trim() || !netInputM4.trim()) {
      setValidationErrorM4('All final metrics (Gross Earnings, Total Deductions, and Net Pay) must be populated.');
      return;
    }

    const grossComp = parseFloat(grossInputM4);
    const deductComp = parseFloat(deductInputM4);
    const netComp = parseFloat(netInputM4);

    if (isNaN(grossComp) || isNaN(deductComp) || isNaN(netComp)) {
      setValidationErrorM4('Please input valid numeric answers for audit processing.');
      return;
    }

    // Isolate calculation breakdowns to execute Diagnostic routing on failure!
    const targetGross = scenarioM4.totalEarnings; 
    const targetDeductions = scenarioM4.totalDeductions;
    const targetNet = scenarioM4.correctNetPay;

    const marginOfError = 0.50; // allow centavo rounding variances

    const grossCorrect = Math.abs(grossComp - targetGross) <= marginOfError;
    const deductionsCorrect = Math.abs(deductComp - targetDeductions) <= marginOfError;
    const netCorrect = Math.abs(netComp - targetNet) <= marginOfError;

    if (grossCorrect && deductionsCorrect && netCorrect) {
      // Perfect clearance! Lock M4 as completed
      setMasteryRecords((prev) => ({
        ...prev,
        'M4_FINAL': {
          ...prev['M4_FINAL'],
          status: 'Completed'
        }
      }));
      setGameCompleted(true);
    } else {
      // Diagnostic tracking & redirection routing!
      setValidationErrorM4('AUDIT REJECTED BY TRIBUNAL!');
      
      // Track attempt
      setMasteryRecords((prev) => ({
        ...prev,
        'M4_FINAL': {
          ...prev['M4_FINAL'],
          attempts: prev['M4_FINAL'].attempts + 1
        }
      }));

      // Isolate sub-skill error to trigger targeted redirection
      setTimeout(() => {
        if (!grossCorrect) {
          // Failure in gross components (Module 2 Mults / Basic Math)
          setDiagnosticRedirecting('gross');
          setTimeout(() => {
            alert('🚨 DOLE AUDIT FINDINGS: Your Gross Earnings calculation is incorrect. We detected weaknesses in your Holiday & Overtime Premium Multipliers logic. Redirecting you to Room 2 (Labor Multipliers) for remedial study!');
            setDiagnosticRedirecting('');
            setActiveModule('M2_MULTIPLIERS');
            setActivePhaseIndex(1);
          }, 2000);
        } else {
          // Failure in deductions (Module 3 Bureaucracy / SSS)
          setDiagnosticRedirecting('deductions');
          setTimeout(() => {
            alert('🚨 DOLE AUDIT FINDINGS: Your Total Deductions aggregation is incorrect. SSS bracket rules or PhilHealth EE contribution splits are weak. Redirecting you to Room 3 (The Bureaucracy) for remedial study!');
            setDiagnosticRedirecting('');
            setActiveModule('M3_BUREAUCRACY');
            setActivePhaseIndex(1);
          }, 2000);
        }
      }, 400);
    }
  };

  // Reset core game states to restart
  const handleResetGame = () => {
    setActiveModule('M1_MATH');
    setActivePhaseIndex(1);
    setCurrentStep(1);
    setSelectedHotspot(null);
    setGameCompleted(false);
    setUnlockedModules({
      M1_MATH: true,
      M2_MULTIPLIERS: false,
      M3_BUREAUCRACY: false,
      M4_TRIBUNAL: false,
    });
    
    // Generate new scenarios
    const restartM1P1 = scenarioGen.generateM1P1();
    setScenarioM1P1(restartM1P1);
    setScenarioM1P2(scenarioGen.generateM1P1());
    setScenarioM2P1(scenarioGen.generateM2P1());
    setScenarioM2P2(scenarioGen.generateM2P2());
    setScenarioM3P1(scenarioGen.generateM3P1(restartM1P1.dailyRate * 20));
    setScenarioM3P2(scenarioGen.generateM3P2());
    setScenarioM4(scenarioGen.generateM4());

    setMasteryRecords({
      'M1_P1': { moduleId: 'M1_MATH', phaseIndex: 1, phaseName: 'Gross Pay Calculation', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
      'M1_P2': { moduleId: 'M1_MATH', phaseIndex: 2, phaseName: 'Gross Pay (No Hints)', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
      'M2_P1': { moduleId: 'M2_MULTIPLIERS', phaseIndex: 1, phaseName: 'Overtime Pay Computation', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
      'M2_P2': { moduleId: 'M2_MULTIPLIERS', phaseIndex: 2, phaseName: 'Regular Holiday Computation', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
      'M3_P1': { moduleId: 'M3_BUREAUCRACY', phaseIndex: 1, phaseName: 'Statutory Brackets & Loans', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
      'M3_P2': { moduleId: 'M3_BUREAUCRACY', phaseIndex: 2, phaseName: 'PhilHealth Contributions', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
      'M4_FINAL': { moduleId: 'M4_TRIBUNAL', phaseIndex: 1, phaseName: 'Full Payroll Synthesis & Diagnostic', status: 'Pending', attempts: 1, drillsTriggered: 0, errorLog: [] },
    });
  };

  // Retrieve current active scenario
  const getActiveScenario = () => {
    if (activeModule === 'M1_MATH') {
      return activePhaseIndex === 1 ? scenarioM1P1 : scenarioM1P2;
    }
    if (activeModule === 'M2_MULTIPLIERS') {
      return activePhaseIndex === 1 ? scenarioM2P1 : scenarioM2P2;
    }
    if (activeModule === 'M3_BUREAUCRACY') {
      return activePhaseIndex === 1 ? scenarioM3P1 : scenarioM3P2;
    }
    return scenarioM4;
  };

  // If student hasn't signed in, render the beautiful Welcome Profile collector
  if (!studentMetadata) {
    return (
      <WelcomeScreen
        onStart={(name, section, email) => {
          setStudentMetadata({ name, section, email });
        }}
      />
    );
  }

  // If completed all modules successfully, show complete certificate reports
  if (gameCompleted) {
    return (
      <ReportCard
        studentName={studentMetadata.name}
        studentSection={studentMetadata.section}
        instructorEmail={studentMetadata.email}
        masteryRecords={masteryRecords}
        onResetGame={handleResetGame}
      />
    );
  }

  return (
    <div id="full-simulator-frame" className="min-h-screen bg-slate-900 border-t-8 border-amber-500 overflow-x-hidden flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      
      {/* Simulation Header Menu / Nav Map visualization */}
      <header id="stage-navigation-header" className="bg-slate-950 border-b-4 border-slate-750 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-402 rounded-lg border border-amber-300">
            <Building id="logo-cit-header" className="w-5 h-5 text-slate-950 animate-float" />
          </div>
          <div>
            <h1 className="text-slate-100 font-display font-extrabold text-base leading-none tracking-wide flex items-center gap-2">
              NO ZERO DAYS!
              <span className="text-[9.5px] bg-amber-550/15 border border-amber-500 text-amber-400 px-1.5 py-0.5 rounded font-mono">CIT-U ABM SIMULATOR</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Grade 12 Educational Philippine Payroll Interface</p>
          </div>
        </div>

        {/* Level Department Nav Node map */}
        <div id="nav-step-mapper" className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
          <button
            onClick={() => {
              if (unlockedModules.M1_MATH) {
                setActiveModule('M1_MATH');
                setActivePhaseIndex(1);
              }
            }}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${activeModule === 'M1_MATH' ? 'bg-amber-500 text-slate-950 border-amber-450' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'}`}
          >
            LOBBY M1
          </button>
          <ChevronRight className="w-3 h-3 text-slate-700" />
          
          <button
            onClick={() => {
              if (unlockedModules.M2_MULTIPLIERS) {
                setActiveModule('M2_MULTIPLIERS');
                setActivePhaseIndex(1);
              }
            }}
            disabled={!unlockedModules.M2_MULTIPLIERS}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${activeModule === 'M2_MULTIPLIERS' ? 'bg-amber-500 text-slate-950 border-amber-450' : !unlockedModules.M2_MULTIPLIERS ? 'bg-slate-950 text-slate-600 border-slate-950 cursor-not-allowed opacity-50' : 'bg-slate-900 text-slate-400 border-slate-800 cursor-pointer hover:text-white'}`}
          >
            FACTORY M2
            {!unlockedModules.M2_MULTIPLIERS && '🔒'}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-700" />

          <button
            onClick={() => {
              if (unlockedModules.M3_BUREAUCRACY) {
                setActiveModule('M3_BUREAUCRACY');
                setActivePhaseIndex(1);
              }
            }}
            disabled={!unlockedModules.M3_BUREAUCRACY}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${activeModule === 'M3_BUREAUCRACY' ? 'bg-amber-500 text-slate-950 border-amber-450' : !unlockedModules.M3_BUREAUCRACY ? 'bg-slate-950 text-slate-600 border-slate-950 cursor-not-allowed opacity-50' : 'bg-slate-900 text-slate-400 border-slate-800 cursor-pointer hover:text-white'}`}
          >
            PC LAB M3
            {!unlockedModules.M3_BUREAUCRACY && '🔒'}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-700" />

          <button
            onClick={() => {
              if (unlockedModules.M4_TRIBUNAL) {
                setActiveModule('M4_TRIBUNAL');
                setActivePhaseIndex(1);
              }
            }}
            disabled={!unlockedModules.M4_TRIBUNAL}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${activeModule === 'M4_TRIBUNAL' ? 'bg-amber-500 text-slate-950 border-amber-450' : !unlockedModules.M4_TRIBUNAL ? 'bg-slate-950 text-slate-600 border-slate-950 cursor-not-allowed opacity-50' : 'bg-slate-900 text-slate-400 border-slate-800 cursor-pointer hover:text-white'}`}
          >
            COURT M4
            {!unlockedModules.M4_TRIBUNAL && '🔒'}
          </button>
        </div>
      </header>

      {/* Main Core 70/30 Content Section */}
      <main id="workspace-layout-panels" className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        
        {/* Visual Game Stage (70%) */}
        <section id="office-room-view" className="lg:col-span-7 h-full">
          <OfficeRoom
            currentModule={activeModule}
            activePhaseIndex={activePhaseIndex}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
            scenarioData={getActiveScenario()}
            guardLocked={guardLocked}
            guardQuestion={guardQuestion}
            guardAnswerOptions={guardOptions}
            onSubmitGuardAnswer={handleSubmitGuardAnswer}
            guardError={guardError}
            currentStep={currentStep}
          />
        </section>

        {/* Interactive Mission Log Form Steps (30%) */}
        <section id="mission-log-tracker-view" className="lg:col-span-3 h-full">
          {activeModule === 'M4_TRIBUNAL' ? (
            
            // Dedicated Scaffolding-Removed Boardroom Audit panel
            <div id="m4-audit-canvas" className="bg-slate-950 border-4 border-slate-750 rounded-xl p-5 h-full flex flex-col justify-between font-mono max-h-[560px] overflow-y-auto">
              <div>
                <span className="text-[10px] text-amber-500 font-extrabold tracking-widest block uppercase mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  M4 TRIBUNAL CONTROL
                </span>
                <h3 className="text-slate-105 font-display font-extrabold text-sm leading-tight border-b border-slate-800 pb-2 mb-4">
                  DOLE COMPLIANCE AUDIT
                </h3>
                
                {diagnosticRedirecting ? (
                  <div className="bg-yellow-950/40 border border-yellow-800 p-4 rounded-lg my-12 text-center text-xs space-y-3 animate-pulse">
                    <span className="w-6 h-6 border-2 border-yellow-500 rounded-full flex items-center justify-center font-bold text-yellow-400 mx-auto animate-spin">⟳</span>
                    <strong className="text-yellow-405 uppercase block tracking-wider">DIAGNOSTIC REDIRECTION PIPELINE ENGAGED</strong>
                    <p className="text-slate-400 text-[10px]">
                      Comparing audit variables context. Isolating target metrics to route remedial studies...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-400 leading-normal mb-2">
                      Scaffolding has been completely removed. Independently extract facts from the Audit Archive Case File, run metrics on a scratchpad, and key final answers below.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label htmlFor="m4-gross-input" className="text-[9px] text-slate-400 block mb-1 uppercase font-bold">1. Total Gross Earnings (₱):</label>
                        <input
                          id="m4-gross-input"
                          type="number"
                          placeholder="0.00"
                          value={grossInputM4}
                          disabled={activeModule !== 'M4_TRIBUNAL'}
                          onChange={(e) => setGrossInputM4(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-450 rounded px-3 py-1.5 text-xs font-bold text-slate-100"
                        />
                      </div>

                      <div>
                        <label htmlFor="m4-deduct-input" className="text-[9px] text-slate-400 block mb-1 uppercase font-bold">2. Total Deductions (₱):</label>
                        <input
                          id="m4-deduct-input"
                          type="number"
                          placeholder="0.00"
                          value={deductInputM4}
                          disabled={activeModule !== 'M4_TRIBUNAL'}
                          onChange={(e) => setDeductInputM4(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-450 rounded px-3 py-1.5 text-xs font-bold text-slate-100"
                        />
                      </div>

                      <div>
                        <label htmlFor="m4-net-input" className="text-[9px] text-slate-400 block mb-1 uppercase font-bold">3. Final Audited Net Pay (₱):</label>
                        <input
                          id="m4-net-input"
                          type="number"
                          placeholder="0.00"
                          value={netInputM4}
                          disabled={activeModule !== 'M4_TRIBUNAL'}
                          onChange={(e) => setNetInputM4(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-750 focus:border-emerald-400 rounded px-3 py-1.5 text-xs font-extrabold text-emerald-400"
                        />
                      </div>
                    </div>

                    <button
                      onClick={submitAuditorAssessment}
                      className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      SUBMIT LEGAL AUDIT CASE
                    </button>
                  </div>
                )}
              </div>

              {validationErrorM4 && (
                <div className="mt-4 p-3 bg-red-950/60 border border-red-800 rounded-lg text-[10px] text-red-300 leading-normal space-y-1 text-center">
                  <span className="font-bold block uppercase text-[8.5px] text-red-400">🚨 REDIRECT WARNING INCURRED!</span>
                  {validationErrorM4}
                </div>
              )}

              <div id="m4-foot-brand" className="mt-4 pt-3 border-t border-slate-800 text-center text-[8.5px] text-slate-500 uppercase tracking-widest leading-none">
                VERDICT SECURE LEDGER
              </div>
            </div>

          ) : (
            // Standard Scaffolded Step Forms
            <MissionLog
              currentModule={activeModule}
              activePhaseIndex={activePhaseIndex}
              scenarioData={getActiveScenario()}
              currentStep={currentStep}
              setStep={(step) => setCurrentStep(step)}
              onSuccessPhase={handleSuccessPhase}
              onForfeitPhase={handleForfeitPhase}
              failureCount={failureCount}
              incrementFail={handleIncrementFail}
              triggerDrillMessage={triggerDrillMessage}
              setTriggerDrillMessage={(v) => setTriggerDrillMessage(v)}
              onTriggerReRoll={handleTriggerReRoll}
              studentName={studentMetadata.name}
              studentSection={studentMetadata.section}
            />
          )}
        </section>
      </main>

      {/* Document Ledger Popups Manager overlay */}
      {selectedHotspot && selectedHotspot !== 'GUARD_NPC' && (
        <Popups
          activeHotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
          scenarioData={getActiveScenario()}
          activePhaseIndex={activePhaseIndex}
          currentModule={activeModule}
          currentStep={currentStep}
          onSuccessPhase={handleSuccessPhase}
          incrementFail={handleIncrementFail}
          failureCount={failureCount}
        />
      )}

      {/* Aesthetic Footer Branding */}
      <footer id="applet-visual-footer" className="bg-slate-950 border-t border-slate-850 px-6 py-3 text-center text-[10px] text-slate-500 font-mono tracking-wider flex flex-col sm:flex-row justify-between items-center gap-1">
        <span>© 2026 Cebu Institute of Technology - University. All Rights Reserved.</span>
        <span>K-12 ABM Specialized Accounting Project Simulator</span>
      </footer>

    </div>
  );
}
