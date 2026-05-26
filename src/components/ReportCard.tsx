/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MasteryRecord } from '../types';
import { 
  Award, CheckCircle2, ChevronRight, CornerDownRight, 
  Mail, Send, Sparkles, Printer, RefreshCw, Landmark,
  Terminal, ThumbsUp, AlertTriangle
} from 'lucide-react';

interface ReportCardProps {
  studentName: string;
  studentSection: string;
  instructorEmail: string;
  masteryRecords: Record<string, MasteryRecord>;
  onResetGame: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  studentName,
  studentSection,
  instructorEmail,
  masteryRecords,
  onResetGame,
}) => {
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Convert map to array for sorting and printing
  const recordsList = Object.values(masteryRecords) as MasteryRecord[];

  // Trigger simulated secure email transmittal
  const handleSendEmail = () => {
    if (emailSending || emailSent) return;
    setEmailSending(true);
    setConsoleLogs([]);

    const logSteps = [
      'Establishing secure SMTP pipe...',
      `Connecting to academic exchange for ${instructorEmail}...`,
      'Compiling diagnostic student metadata JSON...',
      'Encrypting student mastery checklist payload...',
      'Routing through Cebu Institute of Technology - University DNS proxy...',
      'Broadcasting SMTP packets...',
      'Waiting for instructor inbox handshake code 250...',
      'Email successfully delivered! System log synchronized.'
    ];

    logSteps.forEach((log, index) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
        if (index === logSteps.length - 1) {
          setEmailSending(false);
          setEmailSent(true);
        }
      }, (index + 1) * 800);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-400 bg-emerald-950/45 border-emerald-900';
      case 'Infinite Drill Triggered':
        return 'text-amber-400 bg-amber-955/45 border-amber-900';
      case 'Forfeited via Escalation':
        return 'text-red-400 bg-red-955/45 border-red-900';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div id="reportcard-overlay" className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 md:px-8 select-none font-mono relative overflow-y-auto">
      
      {/* Decorative vectors of particles */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* ================= SECTION 1: CIT UNIVERSITY OFFICIAL DEGREE ================= */}
        <motion.div
          id="cit-diploma-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/90 border-4 border-amber-500 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Top colored badge strip */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 to-amber-600" />
          
          <div className="w-16 h-16 bg-amber-500 rounded-full mx-auto flex items-center justify-center border-2 border-amber-300 shadow-lg animate-float">
            <Award className="w-9 h-9 text-slate-950" />
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-amber-400 tracking-widest mt-4 uppercase">
            Cebu Institute of Technology - University
          </h1>
          <p className="text-[10px] text-slate-400 tracking-wider uppercase">College of Computer Studies // ABM Division</p>

          <div className="my-8 space-y-2">
            <p className="text-xs text-slate-400 italic">This certifies that payroll learner</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-wider font-display pt-1">{studentName}</h2>
            <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-4" />
            <p className="text-xs text-slate-400 pt-2 font-bold tracking-widest">Section {studentSection}</p>
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Has successfully processed and completed all academic simulated accounting modules of the 
            <strong className="text-amber-400"> NO ZERO DAYS!</strong> Philippine Payroll micro-skills simulator in accordance with standard DepEd K-12 learning indicators.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-around items-center gap-4 text-[10px] text-slate-500 uppercase font-semibold">
            <span>REGULATORY ID: CCS_CIT_2026_NZD</span>
            <span className="text-amber-500">Mastered on first/adjusted attempts</span>
            <span>VERIFICATION CODE: VER_909_OK</span>
          </div>
        </motion.div>


        {/* ================= SECTION 2: GRANULAR MASTERY LOG TABLE ================= */}
        <motion.div
          id="records-log-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            DIAGNOSTIC THREE-STATE MASTERY RECORD INDEX
          </h3>
          <p className="text-[11px] text-slate-405 leading-relaxed mb-4">
            Instead of standard percentage scoring, the instructor receives exact process-based indicators tracking where the student completed, experienced remedial drills, or forfeitures.
          </p>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-950 font-mono text-slate-400 border-b border-slate-800 text-[10px] tracking-wider uppercase text-center font-extrabold">
                  <th className="p-3 text-left">Module Phase Description</th>
                  <th className="p-3">Mastery Status</th>
                  <th className="p-3">Attempts Count</th>
                  <th className="p-3">Drills Triggered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-center text-slate-205">
                {recordsList.map((rec) => (
                  <tr key={`${rec.moduleId}-${rec.phaseIndex}`} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3.5 text-left font-mono font-bold text-slate-300">
                      <div>Phase {rec.phaseIndex}: {rec.phaseName}</div>
                      <div className="text-[10px] text-slate-500 font-medium font-sans italic">{rec.moduleId === 'M1_MATH' ? 'Basic Math & Tardiness' : rec.moduleId === 'M2_MULTIPLIERS' ? 'DOLE Premium Rules' : rec.moduleId === 'M4_TRIBUNAL' ? 'Final Non-Scaffolded Audit' : 'Statutory Deductions'}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 text-[10px] font-mono font-bold border rounded-md uppercase tracking-wider ${getStatusColor(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-slate-200">{rec.attempts} Attempts</td>
                    <td className="p-3.5 font-mono text-amber-500 font-bold">
                      {rec.drillsTriggered > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-[10px] bg-amber-500/10 border border-amber-900 rounded-md py-0.5 px-1.5 w-max mx-auto">
                          ⚡ {rec.drillsTriggered} drills
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>


        {/* ================= SECTION 3: SIMULATED INSTRUCTOR EMAIL PIPELINE ================= */}
        <motion.div
          id="email-log-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <h3 className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-1 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-450" />
              INSTRUCTOR EMAIL SYNC CONTROL
            </h3>
            <p className="text-[10.5px] text-slate-400 pb-4 border-b border-slate-850">
              Transmit structural reports directly to your instructor’s ledger mailbox (currently targets: <strong className="text-white">{instructorEmail}</strong>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 items-center">
              <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest block">REPORT RECIPIENT:</span>
                <div className="flex flex-col gap-1 text-slate-300 text-xs">
                  <div><strong>Instructor Email:</strong> {instructorEmail}</div>
                  <div><strong>Submitting Student:</strong> {studentName}</div>
                  <div><strong>Submitting Class:</strong> {studentSection}</div>
                </div>
                
                {emailSent ? (
                  <div className="bg-emerald-950/30 border border-emerald-800 p-2.5 rounded-lg text-emerald-400 text-xs flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" />
                    Delivered successfully on 2026-05-26.
                  </div>
                ) : (
                  <button
                    onClick={handleSendEmail}
                    disabled={emailSending}
                    className={`w-full py-2.5 px-4 font-bold border-b-4 text-xs uppercase rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${emailSending ? 'bg-slate-800 border-slate-955 text-slate-500 cursor-not-allowed' : 'bg-amber-500 border-amber-700 hover:bg-amber-600 text-slate-950'}`}
                  >
                    {emailSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                        Transmitting JSON data...
                      </>
                    ) : (
                      <>
                        <Send className="w-4.5 h-4.5" />
                        Send Diagnostic Email Reports
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Console logs visual */}
              <div className="bg-black/80 border border-zinc-805 rounded-xl h-44 p-3 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-2 right-3 text-[8.5px] font-bold text-red-500 animate-pulse flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-red-500" />
                  LIVE SMTP STREAM
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
                  {consoleLogs.length === 0 ? (
                    <div className="text-[10px] text-zinc-600 font-mono italic p-2">Ready to initiate mail transmittal socket...</div>
                  ) : (
                    consoleLogs.map((log, i) => (
                      <div key={i} className="text-[9.5px] text-zinc-300 font-mono leading-relaxed truncate">{log}</div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-850 pt-4 mt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onResetGame}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              Retake All Modules (Reset)
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
