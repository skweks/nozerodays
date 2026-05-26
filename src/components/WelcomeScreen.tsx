/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Layout, Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (name: string, section: string, email: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [email, setEmail] = useState('malutojohnlloyd@gmail.com');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name for the mastery log.');
      return;
    }
    if (!section.trim()) {
      setError('Please enter your class section (e.g. 12-ABM-A).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid teacher email address.');
      return;
    }
    onStart(name.trim(), section.trim(), email.trim());
  };

  return (
    <div id="welcome-container" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 overflow-hidden relative font-sans">
      
      {/* Visual background elements modeled after the pixel assets (sky + clouds theme) */}
      <div id="welcome-sky-bg" className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-450 to-sky-300 opacity-20 pointer-events-none" />
      
      {/* Animated Pixel Clouds */}
      <div id="pixel-cloud-1" className="absolute top-8 left-[10%] w-24 h-8 bg-white/15 rounded-full filter blur-[1px] animate-float opacity-30 pointer-events-none" />
      <div id="pixel-cloud-2" className="absolute top-16 right-[15%] w-32 h-10 bg-white/20 rounded-full filter blur-[1px] animate-float opacity-20 pointer-events-none" style={{ animationDelay: '1s' }} />
      <div id="pixel-floor-grid" className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

      <motion.div
        id="welcome-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-slate-950/80 backdrop-blur-md rounded-2xl border-4 border-slate-700 shadow-2xl p-8 relative z-10"
      >
        <div id="welcome-logo-header" className="flex flex-col items-center mb-8">
          <div id="pixel-briefcase-badge" className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-300 mb-4 animate-float">
            <Briefcase id="icon-briefcase" className="w-8 h-8 text-slate-950" />
          </div>
          <h1 id="welcome-title" className="text-3xl md:text-4xl font-display font-extrabold text-center tracking-tight text-amber-400">
            NO ZERO DAYS!
          </h1>
          <p id="welcome-subtitle" className="text-sm font-mono text-slate-400 tracking-widest uppercase mt-1">
            2D Philippine Payroll Simulator
          </p>
          <div id="badge-ccs" className="mt-2 text-xs font-mono bg-slate-800 text-amber-400 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5">
            <GraduationCap id="icon-grad" className="w-3.5 h-3.5" />
            Cebu Institute of Technology - University
          </div>
        </div>

        <div id="welcome-description-block" className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 mb-6 text-slate-300 text-xs leading-relaxed space-y-2.5">
          <p id="desc-para-1" className="font-medium text-slate-100 flex items-center gap-1.5 text-amber-300">
            <Sparkles id="icon-sparkle" className="w-3.5 h-3.5 text-amber-400" />
            Learn Payroll through Cognitive Task Analysis:
          </p>
          <ul id="desc-list" className="list-disc list-inside space-y-1.5 text-slate-300 font-mono">
            <li><strong className="text-slate-100">Data Extraction:</strong> Isolate variables from documents, ignore red herrings</li>
            <li><strong className="text-slate-100">Rule Identification:</strong> Establish operator logic & select legal multipliers</li>
            <li><strong className="text-slate-100">Arithmetic Execution:</strong> Perform error-proof math computation</li>
          </ul>
          <p id="desc-para-2" className="text-slate-400">
            Failing actions trigger the <span className="text-amber-400 font-bold">Infinite Drill Engine</span>. To complete the modules, you must master each step cleanly.
          </p>
        </div>

        <form id="welcome-form" onSubmit={handleSubmit} className="space-y-4">
          <div id="form-group-name">
            <label htmlFor="student-name-input" className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Learner Full Name
            </label>
            <input
              id="student-name-input"
              type="text"
              placeholder="e.g. John Lloyd Maluto"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div id="form-group-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="form-group-section">
              <label htmlFor="student-section-input" className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
                ABM Class Section
              </label>
              <input
                id="student-section-input"
                type="text"
                placeholder="e.g. 12-ABM-A"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div id="form-group-email">
              <label htmlFor="teacher-email-input" className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Instructor Email
              </label>
              <input
                id="teacher-email-input"
                type="email"
                placeholder="Instructor Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div id="welcome-error-msg" className="text-red-400 text-xs font-mono bg-red-950/40 border border-red-800 rounded-lg p-3 text-center">
              ⚠ {error}
            </div>
          )}

          <button
            id="btn-enter-simulation"
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3 px-6 rounded-xl border-b-4 border-amber-700 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-amber-950/50 mt-6 cursor-pointer"
          >
            <Layout id="icon-layout" className="w-5 h-5 text-slate-900" />
            ENTER SIMULATOR OFFICE
          </button>
        </form>

        <div id="welcome-footer" className="mt-6 pt-4 border-t border-slate-800 text-center text-[10px] font-mono text-slate-500">
          Developed in accordance with DepEd Senior High School K to 12 ABM Specialized subject standard guidelines.
        </div>
      </motion.div>
    </div>
  );
};
