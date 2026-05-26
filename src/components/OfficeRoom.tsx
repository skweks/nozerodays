/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ModuleId } from '../types';
import { 
  Clipboard, Calendar, Cpu, Award, ShieldAlert, 
  HelpCircle, Monitor, BookOpen, UserCheck, 
  MessageSquare, ChevronRight, FileSpreadsheet,
  AlertTriangle, Lock, Camera
} from 'lucide-react';

interface OfficeRoomProps {
  currentModule: ModuleId;
  activePhaseIndex: number;
  selectedHotspot: string | null;
  onSelectHotspot: (hotspot: string | null) => void;
  // Scenario values for rendering text inside docs
  scenarioData: any;
  // Retention/Guard states
  guardLocked: boolean;
  guardQuestion: string;
  guardAnswerOptions: string[];
  onSubmitGuardAnswer: (ans: string) => void;
  guardError: string;
  currentStep?: number;
}

export const OfficeRoom: React.FC<OfficeRoomProps> = ({
  currentModule,
  activePhaseIndex,
  selectedHotspot,
  onSelectHotspot,
  scenarioData,
  guardLocked,
  guardQuestion,
  guardAnswerOptions,
  onSubmitGuardAnswer,
  guardError,
  currentStep = 1,
}) => {
  // Render room-specific environments
  const getModuleTitle = () => {
    switch (currentModule) {
      case 'M1_MATH':
        return 'Room 1: The Core Foundation Lobby';
      case 'M2_MULTIPLIERS':
        return 'Room 2: The Industrial Factory Floor';
      case 'M3_BUREAUCRACY':
        return 'Room 3: The Executive Office';
      case 'M4_TRIBUNAL':
        return 'Room 4: The DOLE Tribunal Boardroom';
    }
  };

  const getModuleSubtitle = () => {
    switch (currentModule) {
      case 'M1_MATH':
        return 'Basic Math, Gross Pay Calculations, and Tardiness Deductions';
      case 'M2_MULTIPLIERS':
        return 'Labor Law application: Workday Overtime & Regular Holiday premium rates';
      case 'M3_BUREAUCRACY':
        return 'Statutory Deductions (SSS Employee brackets, PhilHealth 5% premium calculations)';
      case 'M4_TRIBUNAL':
        return 'The Final Room: Non-scaffolded, full audit with diagnostic routing';
    }
  };

  return (
    <div id="office-room-container" className="h-full bg-slate-950 flex flex-col border-4 border-slate-700 rounded-xl overflow-hidden shadow-xl select-none font-sans relative">
      
      {/* Sprite Asset Ambient Header */}
      <div id="room-header" className="bg-slate-900 border-b-4 border-slate-700 px-6 py-4 flex justify-between items-center relative z-25">
        <div>
          <h2 id="room-main-title" className="text-amber-400 font-display font-extrabold text-lg tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            {getModuleTitle()}
          </h2>
          <p id="room-subtitle" className="text-slate-400 text-xs font-mono mt-0.5">{getModuleSubtitle()}</p>
        </div>
        <div id="room-phase-badge" className="bg-slate-950 px-3 py-1 border border-slate-800 text-[10px] font-mono text-slate-350 tracking-wider rounded-md">
          PHASE {activePhaseIndex} ACTIVE
        </div>
      </div>

      {/* 2D Interactive Office Stage Canvas */}
      <div id="department-stage" className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col justify-end min-h-[420px]">
        
        {/* Pixel style tiled ground background */}
        <div id="pixel-ground" className="absolute inset-0 bg-[#0c142c] opacity-40 pointer-events-none" />
        <div 
          id="office-grid-mesh" 
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none transition-all"
          style={{
            borderTop: currentModule === 'M1_MATH' ? '4px solid #1e3a8a' : '4px solid #1e293b',
            backgroundColor: currentModule === 'M1_MATH' ? '#2563eb' : 'rgb(15, 23, 42)',
            backgroundImage: currentModule === 'M1_MATH' 
              ? `linear-gradient(0deg, #1d4ed8 2px, transparent 2px), 
                 linear-gradient(90deg, #1d4ed8 2px, transparent 2px)`
              : 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: currentModule === 'M1_MATH' ? '80px 24px' : '16px 16px'
          }}
        />

        {/* Dynamic 2D Room Background and Room-Specific Furniture Dressing */}
        <div id="room-background-wall" className="absolute inset-x-0 top-0 bottom-48 border-b-4 border-slate-800 pointer-events-none overflow-hidden"
             style={{ 
               backgroundColor: currentModule === 'M1_MATH' ? '#f8fafc' : currentModule === 'M2_MULTIPLIERS' ? '#1e293b' : currentModule === 'M3_BUREAUCRACY' ? '#271206' : '#0c0e17',
               backgroundImage: currentModule === 'M1_MATH' 
                 ? 'linear-gradient(180deg, #cbd5e1 1px, transparent 1px)' 
                 : 'linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)',
               backgroundSize: currentModule === 'M1_MATH' ? '100% 16px' : '32px 32px'
             }}>
          
          {/* Grid panel texture */}
          {currentModule !== 'M1_MATH' && (
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)]" style={{ backgroundSize: '32px 32px' }} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-4 bg-slate-900 border-t border-slate-800" />

          {/* Windows / Background Elements */}
          {currentModule === 'M1_MATH' && (
            <>
              {/* Arched Office Windows */}
              <div className="absolute top-6 left-12 w-36 h-20 bg-[#38bdf8] border-4 border-slate-705 rounded-md flex flex-col justify-end p-1 shadow-inner relative overflow-hidden">
                <div className="absolute top-2 left-4 w-16 h-6 bg-white/80 rounded-full" />
                <div className="absolute inset-x-0 top-0 bottom-0 flex justify-around opacity-40"><div className="w-1 bg-slate-900 h-full" /><div className="w-1 bg-slate-900 h-full" /></div>
              </div>
              <div className="absolute top-6 right-12 w-36 h-20 bg-[#38bdf8] border-4 border-slate-705 rounded-md flex flex-col justify-end p-1 shadow-inner relative overflow-hidden">
                <div className="absolute top-4 left-6 w-12 h-4 bg-white/75 rounded-full" />
                <div className="absolute inset-x-0 top-0 bottom-0 flex justify-around opacity-40"><div className="w-1 bg-slate-900 h-full" /><div className="w-1 bg-slate-900 h-full" /></div>
              </div>
            </>
          )}

          {currentModule === 'M2_MULTIPLIERS' && (
            <>
              {/* Industrial Pipeline System */}
              <div className="absolute top-3 inset-x-0 h-3 bg-zinc-800 border-y border-zinc-955 flex justify-around items-center">
                <div className="w-2 h-4 bg-amber-550 rounded-sm" />
                <div className="w-2 h-4 bg-emerald-555 rounded-sm" />
                <div className="w-2 h-4 bg-rose-555 rounded-sm" />
              </div>
              
              {/* Pressure Dial */}
              <div className="absolute top-10 left-28 w-8 h-8 bg-zinc-700 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center relative">
                  <div className="w-3 h-0.5 bg-red-650 absolute rotate-45" />
                  <div className="w-1 h-1 bg-zinc-950 rounded-full" />
                </div>
              </div>

              {/* Hazards warning stripes at bottom */}
              <div className="absolute bottom-4 inset-x-0 h-3 bg-amber-500 flex items-center justify-center gap-4 text-[7.5px] font-mono font-bold text-slate-950 select-none">
                <span>⚠️ HOURLY DISCIPLINE REQUIRED ⚠️</span>
                <span>⚠️ CHECK OVERTIME LUNCH BREAKS ⚠️</span>
              </div>
            </>
          )}

          {currentModule === 'M3_BUREAUCRACY' && (
            <>
              {/* Gold Cert frame */}
              <div className="absolute top-8 left-24 w-14 h-11 bg-white border-4 border-amber-600 rounded p-0.5 flex flex-col justify-between shadow-md">
                <div className="w-full h-1 bg-[#b45309]" />
                <div className="text-[5.5px] font-mono text-center font-bold text-amber-600">SEC COMPLIANT</div>
              </div>

              {/* Modern Art Canvas */}
              <div className="absolute top-6 right-24 w-20 h-14 bg-slate-900 border-4 border-[#4a2e1b] rounded shadow-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 w-full h-4 bg-emerald-700" />
                <div className="absolute top-3 left-4 w-3 h-3 bg-amber-400 rounded-full" />
              </div>
            </>
          )}

          {currentModule === 'M4_TRIBUNAL' && (
            <>
              {/* Scales of Justice Wall Badge */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-amber-500/40 p-2 rounded-lg text-center w-24">
                <div className="text-[7.5px] font-mono text-amber-500 font-bold uppercase leading-tight">DOLE TRIBUNAL</div>
                <div className="text-[6px] font-mono text-slate-400 mt-1">RESOLUTION CENTER</div>
              </div>
            </>
          )}

        </div>

        {/* 2D Assets and Dressing (Couch, Water Cooler, Vending machine, etc.) */}
        <div id="room-background-assets" className="absolute inset-x-0 bottom-48 h-0 pointer-events-none z-10">
          
          {currentModule === 'M1_MATH' && (
            // Handled dynamically inside stage-m1 for high precision visual layout and crisp event coordinates
            null
          )}

          {currentModule === 'M2_MULTIPLIERS' && (
            <>
              {/* Soda Vending Machine */}
              <div className="absolute bottom-0 left-8 w-12 h-20 bg-slate-800 border-2 border-slate-950 rounded flex flex-col justify-between p-1 shadow">
                <div className="w-full h-3 bg-emerald-500 rounded text-[7px] font-mono text-center">SODA</div>
                <div className="w-full h-10 bg-slate-950 border border-slate-700 grid grid-cols-3 gap-0.5 p-0.5">
                  <div className="bg-red-500" /> <div className="bg-blue-500" /> <div className="bg-yellow-500" />
                </div>
                <div className="w-full h-3 bg-slate-900 rounded" />
              </div>

              {/* Green Couch */}
              <div className="absolute bottom-0 right-14 w-20 h-10 bg-emerald-800 border-2 border-emerald-950 rounded relative flex items-center justify-center shadow">
                <div className="absolute inset-x-2 bottom-0 h-4 bg-emerald-600 rounded-t" />
              </div>
            </>
          )}

          {currentModule === 'M3_BUREAUCRACY' && (
            <>
              {/* Executive Bookshelf */}
              <div className="absolute bottom-0 left-10 w-12 h-22 bg-[#5c2d03] border-2 border-[#3a1a05] rounded p-1 flex flex-col gap-1.5 justify-around shadow">
                <div className="w-full h-1 bg-amber-700" />
                <div className="h-4 bg-[#231204] flex gap-0.5 p-0.5">
                  <div className="w-1.5 h-full bg-red-500" /> <div className="w-1.5 h-full bg-blue-500" />
                </div>
                <div className="h-4 bg-[#231204] flex gap-0.5 p-0.5">
                  <div className="w-2 h-full bg-yellow-500" /> <div className="w-1.5 h-full bg-emerald-500" />
                </div>
              </div>

              {/* Plant Pot */}
              <div className="absolute bottom-0 left-[100px] w-6 h-12 bg-amber-500 border-2 border-amber-700 rounded-t-lg flex flex-col justify-end">
                <div className="w-full h-3 bg-amber-600" />
              </div>
            </>
          )}

          {currentModule === 'M4_TRIBUNAL' && (
            <>
              {/* Case Archives cabinet */}
              <div className="absolute bottom-0 left-8 w-12 h-20 bg-slate-700 border-2 border-slate-800 rounded p-1 flex flex-col gap-1 shadow">
                <div className="w-full h-4 bg-slate-900 border border-slate-650" />
                <div className="w-full h-4 bg-slate-900 border border-slate-650" />
                <div className="w-full h-4 bg-slate-900 border border-slate-100 flex items-center justify-center text-[7px] font-mono text-red-405 font-black">CASE</div>
              </div>

              {/* Royal Velvet Couch */}
              <div className="absolute bottom-0 right-14 w-20 h-10 bg-red-800 border-2 border-red-950 rounded relative flex items-center justify-center shadow">
                <div className="absolute inset-x-2 bottom-0 h-4 bg-red-650 rounded-t" />
              </div>
            </>
          )}

        </div>

        {/* ========================================================
            MODULE 1 LOBBY DEPT
            ======================================================== */}
        {currentModule === 'M1_MATH' && (
          <div id="stage-m1" className="absolute inset-0 pointer-events-auto overflow-hidden">
            
            {/* Interactive Security Camera Mounted on Ceiling */}
            <button 
              id="hotspot-security-camera"
              onClick={() => onSelectHotspot('SECURITY_CAMERA')}
              className={`absolute top-4 left-4 group flex flex-col items-center cursor-pointer transition-all z-35 ${selectedHotspot === 'SECURITY_CAMERA' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-2 py-0.5 bg-slate-950/95 border rounded-md text-[9px] font-mono font-bold mb-1 flex items-center gap-1 shadow-md transition-colors ${selectedHotspot === 'SECURITY_CAMERA' ? 'border-amber-400 text-amber-400' : 'border-slate-800 text-slate-400 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <Camera className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                CCTV Camera [LIVE]
              </div>
              <div className="relative">
                <div className="w-4 h-1.5 bg-slate-800 rounded-sm" />
                <div className="w-1 h-2 bg-slate-700 mx-auto" />
                <div className="w-7 h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded-md border-b border-slate-450 relative flex items-center justify-end pr-0.5 shadow-md">
                  <div className="w-2 h-full bg-slate-900 rounded-r-md flex items-center justify-center p-0.5">
                    <div className="w-1 h-2 bg-sky-455 rounded-full animate-pulse" />
                  </div>
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-red-500 rounded-full animate-ping" />
                  <div className="absolute top-0.5 left-1 w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>
            </button>

            {/* THREE VERTICALLY STACKED CUBICLES (LEFT COLUMN) */}
            <div id="cubicles-column" className="absolute left-4 top-[18%] bottom-[4px] w-[140px] flex flex-col justify-between z-25">
              
              {/* Cubicle 1: HR Desk (Interactive clerk) */}
              <button
                id="hotspot-hr-desk"
                onClick={() => onSelectHotspot('HR_DESK')}
                className={`w-full h-[28%] bg-slate-800 border-2 rounded-lg relative flex flex-col items-center justify-end shadow-lg transition-all text-left ${selectedHotspot === 'HR_DESK' ? 'border-amber-400 scale-[1.03]' : 'border-slate-650 hover:border-amber-500 hover:scale-[1.01]'}`}
              >
                {/* Yellow status light */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
                
                {/* Visual wall separator label */}
                <div className="absolute inset-x-0 top-0 h-4 bg-slate-900/90 border-b border-slate-700 flex items-center justify-center rounded-t-md px-1">
                  <span className="text-[7px] font-mono font-bold text-amber-400 truncate">📁 CUBICLE 1: HR CLERK</span>
                </div>

                {/* Standing HR Clerk Avatar (White shirt, red 'C', blue pants) */}
                <div className="absolute top-4 left-3 flex flex-col items-center">
                  {/* Hair */}
                  <div className="w-4.5 h-2 bg-slate-400 rounded-t-md border-b border-slate-500" />
                  {/* Sunglasses Face */}
                  <div className="w-4 h-4 bg-amber-205 border border-slate-900 flex items-center justify-center relative">
                    <div className="w-3.5 h-1 bg-black absolute top-1 rounded-sm" /> {/* Cool shades */}
                    <div className="w-2 h-0.5 bg-red-650 absolute bottom-0.5 rounded-full" />
                  </div>
                  {/* White Tee with Red 'C' (for CIT-U) */}
                  <div className="w-5.5 h-5 bg-white border border-slate-900 rounded-sm relative flex items-center justify-center">
                    <span className="text-[5.5px] font-extrabold text-rose-600 leading-none">C</span>
                    {/* Tiny arm sleeves */}
                    <div className="absolute -left-1 top-0.5 w-1 h-2 bg-white border-l border-t border-b border-slate-900 rounded-l" />
                    <div className="absolute -right-1 top-0.5 w-1 h-2 bg-white border-r border-t border-b border-slate-900 rounded-r" />
                  </div>
                  {/* Blue pants */}
                  <div className="flex gap-0.5 mt-0.5">
                    <div className="w-2 h-4.5 bg-blue-600 border border-slate-900 rounded-sm" />
                    <div className="w-2 h-4.5 bg-blue-600 border border-slate-900 rounded-sm" />
                  </div>
                </div>

                {/* PC screen with green data */}
                <div className="absolute bottom-3 right-2 w-9 h-6 bg-slate-950 border border-slate-600 rounded flex items-center justify-center p-0.5">
                  <div className="w-full h-full bg-emerald-950/80 rounded flex items-center justify-center text-[5px] text-emerald-400 font-mono leading-none animate-pulse">
                    CONTRACT
                  </div>
                </div>

                {/* Oak tabletop border */}
                <div className="absolute bottom-1 px-1 inset-x-0 flex items-center justify-between">
                  <span className="text-[6.5px] font-mono text-slate-450 uppercase tracking-tighter">CLASS_RECS</span>
                  <span className="text-[9px] animate-bounce">📁</span>
                </div>
              </button>

              {/* Cubicle 2: Payroll Desk (Locked/Decorative) */}
              <div className="w-full h-[28%] bg-slate-800 border-2 border-slate-700/60 opacity-60 rounded-lg relative flex flex-col items-center justify-end shadow-md overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-4 bg-slate-900/40 border-b border-slate-750 flex items-center justify-center px-1">
                  <span className="text-[6.5px] font-mono font-medium text-slate-400 truncate">📁 CUBICLE 2: SYSTEMS</span>
                </div>
                {/* Empty Green Swivel Task Chair */}
                <div className="absolute top-5 left-3 flex flex-col items-center">
                  <div className="w-5 h-4 bg-emerald-600 border border-slate-900 rounded-md" />
                  <div className="w-1 h-2 bg-slate-700" />
                  <div className="w-5 h-1.5 bg-slate-900 rounded-full" />
                </div>
                {/* Empty table line */}
                <div className="absolute bottom-1 px-1 text-[5px] font-mono text-slate-500 uppercase">SYS_OFFLINE_L2</div>
              </div>

              {/* Cubicle 3: Auditing Desk (Locked/Decorative) */}
              <div className="w-full h-[28%] bg-slate-800 border-2 border-slate-700/60 opacity-60 rounded-lg relative flex flex-col items-center justify-end shadow-md overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-4 bg-slate-900/40 border-b border-slate-750 flex items-center justify-center px-1">
                  <span className="text-[6.5px] font-mono font-medium text-slate-400 truncate">📁 CUBICLE 3: AUDITOR</span>
                </div>
                {/* Red Desk chair and desktop screen */}
                <div className="absolute top-5 left-3 flex flex-col items-center">
                  <div className="w-5 h-4 bg-rose-600 border border-slate-900 rounded-md" />
                  <div className="w-1 h-2 bg-slate-700" />
                </div>
                <div className="absolute top-6 right-3 w-8 h-5 bg-black border border-slate-650 rounded-sm" />
                <div className="absolute bottom-1 px-1 text-[5px] font-mono text-slate-500 uppercase">SYS_OFFLINE_L3</div>
              </div>

            </div>

            {/* WALL CALENDAR (Hanging high on the left wall) */}
            <button 
              id="hotspot-calendar"
              onClick={() => onSelectHotspot('WALL_CALENDAR')}
              className={`absolute top-[16%] left-[170px] group flex flex-col items-center cursor-pointer transition-all z-20 ${selectedHotspot === 'WALL_CALENDAR' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-2 py-0.5 bg-slate-900 border rounded text-[9px] font-mono font-bold mb-1 flex items-center gap-1 shadow-md ${selectedHotspot === 'WALL_CALENDAR' ? 'border-amber-400 text-amber-400' : 'border-slate-800 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <Calendar className="w-2.5 h-2.5" />
                Wall Calendar (Click)
              </div>
              <div className="w-14 h-18 bg-white border-2 border-slate-750 rounded-md relative flex flex-col items-center shadow-md p-1">
                {/* Red binding header of Cebu Institute of Technology */}
                <div className="w-full h-3 bg-red-600 rounded-sm mb-1 text-[5px] font-mono font-bold text-white text-center flex items-center justify-center">CIT-U</div>
                <div className="grid grid-cols-4 gap-0.5 w-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-2xs ${i % 3 === 0 ? 'bg-red-400' : 'bg-slate-300'}`} />
                  ))}
                </div>
                {/* Star on Holiday June 12 */}
                <span className="absolute bottom-1 right-1 text-[7px] text-amber-500 font-extrabold animate-pulse">★</span>
                <span className="absolute bottom-0.5 left-1 text-[4.5px] font-mono text-slate-450">JUNE 2026</span>
              </div>
            </button>

            {/* LOBBY AMENITY SPOT (Vending machines, trash cans, plant 1) */}
            <div id="lobby-amenities" className="absolute bottom-2 left-[170px] flex items-end gap-2.5 z-10 p-1 bg-slate-950/20 rounded">
              
              {/* Soda Vending Machine */}
              <div className="w-8 h-[74px] bg-indigo-950 border border-slate-850 rounded-sm relative flex flex-col justify-between p-1 shadow-inner">
                <div className="text-[4.5px] text-teal-400 font-mono text-center font-bold tracking-widest leading-none bg-black/40 py-0.5 rounded">SODA</div>
                <div className="h-6 bg-black border border-slate-850 grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="bg-red-500 rounded-2xs" /> <div className="bg-cyan-500 rounded-2xs" />
                  <div className="bg-amber-500 rounded-2xs" /> <div className="bg-emerald-500 rounded-2xs" />
                </div>
                <div className="h-1 bg-slate-800 rounded-2xs" />
              </div>

              {/* Snack Machine */}
              <div className="w-8 h-16 bg-amber-955 border border-slate-850 rounded-sm relative flex flex-col justify-between p-1 shadow">
                <div className="text-[4.5px] text-yellow-300 font-mono text-center font-bold leading-none bg-black/40 py-0.5 rounded">SNACK</div>
                <div className="h-5 bg-[#231204] border border-slate-900 p-0.5 space-y-0.5">
                  <div className="flex gap-0.5"><div className="w-full h-1 bg-red-400" /><div className="w-full h-1 bg-amber-500" /></div>
                  <div className="flex gap-0.5"><div className="w-full h-1 bg-emerald-400" /><div className="w-full h-1 bg-yellow-400" /></div>
                </div>
                <div className="h-1 bg-slate-800 rounded-2xs" />
              </div>

              {/* Color-coded Trash cans (Green, Red, Blue) */}
              <div className="flex gap-0.5 items-end">
                <div className="w-3 h-4 bg-emerald-600 rounded-b-sm border border-slate-850 flex flex-col justify-between">
                  <div className="w-full h-0.5 bg-slate-700 border-b border-slate-800 rounded-t-sm" />
                </div>
                <div className="w-3 h-4 bg-red-650 rounded-b-sm border border-slate-850 flex flex-col justify-between">
                  <div className="w-full h-0.5 bg-slate-705 border-b border-slate-800 rounded-t-sm" />
                </div>
                <div className="w-3 h-4 bg-blue-600 rounded-b-sm border border-slate-850 flex flex-col justify-between">
                  <div className="w-full h-0.5 bg-slate-705 border-b border-slate-800 rounded-t-sm" />
                </div>
              </div>

              {/* Potted Plant 1 */}
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 bg-emerald-600 border border-slate-850 rounded-full shadow-sm animate-pulse" />
                <div className="w-1 h-2 bg-amber-800" />
                <div className="w-3.5 h-2.5 bg-white border border-slate-300 rounded-b-xs" />
              </div>

            </div>

            {/* AUTOMATIC DOUBLE SLIDING BLUE SECURITY DOOR (CENTRAL ELEVATOR ACCESS) */}
            <button
              id="hotspot-room-door"
              onClick={() => onSelectHotspot('ROOM_DOOR')}
              className={`absolute bottom-[4px] left-[52%] -translate-x-1/2 w-32 h-26 rounded bg-slate-900 border-2 relative flex flex-col justify-end items-center p-1 cursor-pointer transition-all shadow-inner z-20 ${selectedHotspot === 'ROOM_DOOR' ? 'border-amber-400 scale-[1.03]' : 'border-slate-750 hover:border-amber-500 hover:scale-[1.01]'}`}
            >
              <div className="absolute -top-10 bg-slate-950/95 text-sky-400 border border-slate-800 px-3 py-1 rounded text-[9.5px] font-mono w-28 text-center shadow-lg pointer-events-none">
                🚪 Double Door
              </div>

              {/* Security override scanner header strip */}
              <div className="w-full h-4 bg-slate-950 absolute top-0 border-b border-slate-800 flex items-center justify-between px-1.5 font-mono text-[6.5px]">
                <span className="text-slate-400">MATH SCAN PORT_01</span>
                <span className={`animate-pulse uppercase font-bold ${currentStep === 3 ? 'text-emerald-450' : 'text-red-405'}`}>
                  {currentStep === 3 ? 'READY_INPUT' : 'PENDING'}
                </span>
              </div>

              {/* Double sliding door panels inside frame */}
              <div className="w-full h-16 bg-slate-950 border border-slate-800 rounded-sm relative flex divide-x divide-slate-805/50 overflow-hidden mt-2">
                {/* Left panel section */}
                <div className="flex-1 bg-blue-900/90 relative flex flex-col justify-center items-end pr-1 shadow-inner">
                  {/* Neon diagonal reflection details */}
                  <div className="w-full h-0.5 bg-sky-400/30 rotate-45 transform absolute top-2 right-1" />
                  <div className="w-full h-0.5 bg-sky-400/30 rotate-45 transform absolute top-6 right-2" />
                  {/* Brass mechanical latch handles */}
                  <div className="w-1.5 h-6 bg-slate-400 border border-slate-700 rounded-sm" />
                </div>
                {/* Right panel section */}
                <div className="flex-1 bg-blue-900/90 relative flex flex-col justify-center items-start pl-1 shadow-inner">
                  <div className="w-full h-0.5 bg-sky-400/30 rotate-45 transform absolute top-4 left-1" />
                  <div className="w-full h-0.5 bg-sky-400/30 rotate-45 transform absolute top-8 left-2" />
                  <div className="w-1.5 h-6 bg-slate-400 border border-slate-700 rounded-sm" />
                </div>
              </div>

              {/* Keypad override status panel strip */}
              <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-1">STEP_3 Pass_Panel</span>
            </button>

            {/* IMMERSIVE COMPLIANCE GUARD NPC (Pops up alerting student) */}
            <div id="npc-guard-lobby" className="absolute bottom-1 left-[37%] z-30 flex flex-col items-center">
              <button
                id="btn-guard-lobby"
                onClick={() => onSelectHotspot('GUARD_NPC')}
                className="relative group flex flex-col items-center focus:outline-none cursor-pointer"
              >
                {/* Guard alert dialogue indicator depending on whether they can move */}
                {guardLocked ? (
                  <div className="absolute -top-12 bg-red-955/95 text-red-100 border-2 border-red-500 px-3 py-1.5 rounded-md text-center text-[10px] font-mono w-44 shadow-2xl z-35 animate-bounce">
                    🚨 <strong>HALT!</strong> Answer my Room 1 assessment to gain Room 2 clearance!
                  </div>
                ) : (
                  <div className="absolute -top-10 bg-emerald-950/95 text-emerald-100 border border-emerald-500 px-3 py-1 rounded text-[9.5px] font-mono w-28 text-center shadow-lg z-35">
                    ✔ Patrol Cleared.
                  </div>
                )}

                {/* Character Body - Officer Perez */}
                <div className={`w-12 h-26 flex flex-col items-center transition-all ${guardLocked ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.55)] scale-102 font-bold' : 'opacity-85 hover:opacity-100'}`}>
                  {/* Visor Officer Hat */}
                  <div className="w-9 h-3.5 bg-slate-900 border-b border-amber-400 rounded-t-sm" />
                  {/* Skin Face with cute mustache */}
                  <div className="w-7 h-7 bg-amber-205 border border-slate-900 flex flex-col items-center justify-center relative shadow-sm">
                    {/* Small visual eyes */}
                    <div className="flex justify-between w-4 mb-0.5">
                      <div className="w-1 h-1 bg-slate-950 rounded-full" />
                      <div className="w-1 h-1 bg-slate-950 rounded-full" />
                    </div>
                    {/* Mustache black row */}
                    <div className="w-4.5 h-1 bg-neutral-900 rounded-full" />
                  </div>
                  {/* Blue Security Uniform Chest with gold badge */}
                  <div className="w-11 h-11 bg-indigo-950 border-x border-b border-slate-950 rounded-b flex flex-col items-center relative p-0.5">
                    <span className="text-[4.5px] text-zinc-400 tracking-wider font-mono uppercase leading-none">POLICE</span>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute bottom-1 right-1.5 border border-amber-600 shadow animate-pulse" />
                  </div>
                  {/* Black police trousers & shoes */}
                  <div className="flex gap-1.5 mt-0.5">
                    <div className="w-2.5 h-4.5 bg-slate-905 bg-slate-900 rounded-t" />
                    <div className="w-2.5 h-4.5 bg-slate-905 bg-slate-900 rounded-t" />
                  </div>
                </div>

                <div className="mt-1 text-[9px] font-mono font-extrabold text-white py-0.5 px-2 bg-slate-950 border border-slate-800 rounded">
                  Officer Perez (NPC)
                </div>
              </button>
            </div>

            {/* POTTED PLANT 2 (Right of security door) */}
            <div id="pot-plant-2" className="absolute bottom-[3px] left-[61%] z-10 flex flex-col items-center">
              <div className="w-5.5 h-5.5 bg-emerald-700 border border-slate-800 rounded-md animate-pulse shadow-sm" />
              <div className="w-1 h-2.5 bg-amber-800" />
              <div className="w-4 h-3.5 bg-white border border-slate-350 rounded-b shadow" />
            </div>

            {/* GREEN COUCH & WAITING SECTION */}
            <div id="lobby-couch-set" className="absolute bottom-[2px] left-[66%] flex items-end gap-2 z-10 p-1 bg-slate-950/10 rounded">
              
              {/* Green cushion set couch */}
              <div className="w-18 h-9 bg-emerald-700 border border-emerald-950 rounded relative flex items-center justify-center shadow">
                <div className="absolute inset-x-1.5 bottom-0 h-3.5 bg-emerald-600 rounded-t-xs" />
                <div className="absolute inset-y-0 left-1/3 w-0.5 bg-emerald-805/40" />
                <div className="absolute inset-y-0 right-1/3 w-0.5 bg-emerald-805/40" />
              </div>

              {/* Oak table base with console box & actual steaming Coffee cup */}
              <div className="w-11 h-7 relative flex flex-col justify-end">
                <div className="absolute bottom-0 left-1 w-0.5 h-3 bg-amber-800 border-r border-amber-900" />
                <div className="absolute bottom-0 right-1 w-0.5 h-3 bg-amber-800 border-l border-amber-900" />
                {/* Oak desk top surface */}
                <div className="w-11 h-2 bg-amber-600 border border-slate-800 rounded-sm relative flex justify-around px-0.5">
                  
                  {/* Black visual console hub */}
                  <div className="w-3.5 h-2.5 bg-slate-900 rounded-2xs border border-slate-700 -mt-1 flex items-center justify-center">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                  </div>

                  {/* Hot steaming white coffee mug */}
                  <div className="w-1.5 h-2 bg-white rounded-b-3xs border border-slate-400 relative -mt-1 flex items-center justify-center">
                    {/* Visual steaming loop */}
                    <div className="absolute -top-1.5 left-0.5 w-[3px] h-[3px] border-l border-white/40 rounded-full animate-pulse" />
                    {/* Mug handle loop */}
                    <div className="absolute -right-0.5 top-0.5 w-1 h-1 border border-slate-400 rounded-full" />
                  </div>

                </div>
              </div>

            </div>

            {/* ACADEMIC WHITEBOARD ON EASEL STAND FAR-RIGHT (Interactive formulas and clues) */}
            <button
              id="hotspot-whiteboard"
              onClick={() => onSelectHotspot('WHITEBOARD')}
              className={`absolute bottom-1 right-2.5 group flex flex-col items-center cursor-pointer transition-all z-20 ${selectedHotspot === 'WHITEBOARD' ? 'scale-105 border-transparent' : 'hover:scale-[1.015]'}`}
            >
              <div className={`px-2 py-0.5 bg-slate-900 border rounded text-[9.5px] font-mono font-bold mb-1.5 flex items-center gap-1 shadow-md ${selectedHotspot === 'WHITEBOARD' ? 'border-amber-400 text-amber-400' : 'border-slate-800 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                📝 Whiteboard clue
              </div>

              {/* Whiteboard visual card container with oak/metal stand casing */}
              <div className="w-22 h-16 bg-white border-4 border-amber-905 border-amber-900 rounded p-1 flex flex-col justify-between shadow-lg relative overflow-hidden">
                {/* Highlighter text printed on board */}
                <div className="w-full text-center font-mono leading-tight tracking-wider uppercase flex flex-col items-center">
                  <span className="text-[5px] text-blue-700 font-extrabold">GP = DR × Days</span>
                  <span className="text-[4px] text-red-500 font-extrabold mt-0.5">ALLOWANCE = IGNORED</span>
                </div>

                {/* Dry erase markers shelf tray at the bottom */}
                <div className="w-full h-0.5 bg-slate-400 flex justify-between px-2 rounded-full">
                  <div className="w-1 h-0.5 bg-red-500" />
                  <div className="w-1 h-0.5 bg-blue-500" />
                </div>
              </div>

              {/* Wooden easel legs supporting the board */}
              <div className="w-0.5 h-3 bg-amber-900" />
              <div className="flex gap-4">
                <div className="w-1 h-0.5 bg-amber-950 rounded-full" />
                <div className="w-1 h-0.5 bg-amber-950 rounded-full" />
              </div>
            </button>

          </div>
        )}

        {/* ========================================================
            MODULE 2 FACTORY FLOOR
            ======================================================== */}
        {currentModule === 'M2_MULTIPLIERS' && (
          <div id="stage-m2" className="absolute inset-0 flex items-end justify-around pb-6 px-4">
            
            {/* Interactive Overtime Log Clipboard */}
            <button 
              id="hotspot-ot-log"
              onClick={() => onSelectHotspot('OVERTIME_LOG')}
              className={`group flex flex-col items-center cursor-pointer transition-all ${selectedHotspot === 'OVERTIME_LOG' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-4 py-2 bg-slate-900 border-2 rounded-lg text-xs font-mono font-bold mb-2 flex items-center gap-1 shadow-lg ${selectedHotspot === 'OVERTIME_LOG' ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <Clipboard className="w-3.5 h-3.5" />
                OT Shift Logs
                <span className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-bounce">!</span>
              </div>
              <div className="w-20 h-24 bg-amber-100 border-4 border-slate-600 rounded-md relative flex flex-col items-center shadow-lg shadow-black/40 p-2">
                <div className="w-12 h-3 bg-zinc-650 rounded-sm absolute -top-2 flex items-center justify-center text-[7px] text-zinc-100 font-mono">CLIPBOARD</div>
                <div className="w-full h-1 bg-zinc-400 my-1 mt-2" />
                <div className="w-full h-1 bg-zinc-400 my-1" />
                <div className="w-full h-1 bg-zinc-400 my-1" />
                <div className="w-full h-1 bg-zinc-400 my-1" />
                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-500 font-bold">LUNCH=0</span>
              </div>
            </button>

            {/* DOLE Poster on Wall */}
            <button 
              id="hotspot-dole-poster"
              onClick={() => onSelectHotspot('DOLE_POSTER')}
              className={`group flex flex-col items-center cursor-pointer transition-all ${selectedHotspot === 'DOLE_POSTER' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-4 py-2 bg-slate-900 border-2 rounded-lg text-xs font-mono font-bold mb-2 flex items-center gap-1 shadow-lg relative ${selectedHotspot === 'DOLE_POSTER' ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <BookOpen className="w-3.5 h-3.5" />
                DOLE Poster
              </div>
              <div className="w-24 h-16 bg-gradient-to-r from-sky-900 to-indigo-950 border-4 border-amber-500 rounded-lg relative flex flex-col justify-center items-center p-2 shadow-lg shadow-amber-950/20">
                <span className="text-[10px] font-display font-extrabold text-amber-300 leading-none">DOLE PREM.</span>
                <span className="text-[7.5px] font-mono text-slate-300 mt-1 uppercase text-center tracking-tighter">Multiplier Rates</span>
              </div>
            </button>

            {/* Interactive Wall Calendar */}
            <button 
              id="hotspot-calendar-m2"
              onClick={() => onSelectHotspot('WALL_CALENDAR')}
              className={`group flex flex-col items-center cursor-pointer transition-all ${selectedHotspot === 'WALL_CALENDAR' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-4 py-2 bg-slate-900 border-2 rounded-lg text-xs font-mono font-bold mb-2 flex items-center gap-1 shadow-lg ${selectedHotspot === 'WALL_CALENDAR' ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <Calendar className="w-3.5 h-3.5" />
                Wall Calendar
              </div>
              <div className="w-16 h-20 bg-slate-105 border-4 border-slate-650 rounded-md relative flex flex-col items-center shadow-lg shadow-black/40 p-1">
                <div className="w-full h-3 bg-red-650 rounded-sm mb-1" />
                <div className="grid grid-cols-4 gap-1 w-full">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`h-2 rounded-sm ${i === 4 ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`} />
                  ))}
                </div>
                <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-400 font-bold">HOLIDAYS</span>
              </div>
            </button>

            {/* Compliance Guard M2 Blockage */}
            <div id="npc-guard-factory" className="flex flex-col items-center relative z-20">
              <button
                id="btn-guard-m2"
                onClick={() => onSelectHotspot('GUARD_NPC')}
                className={`relative group flex flex-col items-center focus:outline-none cursor-pointer`}
              >
                {guardLocked ? (
                  <div className="absolute -top-12 bg-red-950/95 text-red-105 border-2 border-red-500 px-3 py-1.5 rounded-lg text-center text-[10px] font-mono w-44 shadow-xl z-30 animate-pulse">
                    🚨 <strong>TREATY:</strong> Answer my tardiness question to activate Phase 2.
                  </div>
                ) : (
                  <div className="absolute -top-10 bg-emerald-950/95 text-emerald-100 border border-emerald-500 px-3 py-1 rounded-lg text-center text-[10px] font-mono w-32 shadow-lg z-35">
                    ✔ Unplug authorization.
                  </div>
                )}
                {/* Guard character detail */}
                <div className={`w-14 h-28 flex flex-col items-center transition-all ${guardLocked ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : ''}`}>
                  {/* Hat */}
                  <div className="w-10 h-4 bg-slate-900 rounded-t-md border-b-2 border-slate-705" />
                  {/* Face */}
                  <div className="w-8 h-8 bg-amber-300 border-2 border-slate-900 flex items-center justify-center relative">
                    <div className="w-1.5 h-1.5 bg-indigo-900 rounded-full absolute top-2 left-1.5" />
                    <div className="w-1.5 h-1.5 bg-indigo-900 rounded-full absolute top-2 right-1.5" />
                    <div className="w-4.5 h-1.5 bg-slate-900 absolute bottom-1 rounded-full animate-pulse" />
                  </div>
                  {/* Body */}
                  <div className="w-12 h-14 bg-indigo-900 border-2 border-slate-950 rounded-b-md flex flex-col items-center relative">
                    <span className="text-[6.5px] font-mono text-zinc-300 font-bold top-1 absolute">SECURITY</span>
                  </div>
                  {/* Legs */}
                  <div className="flex gap-2.5 mt-0.5">
                    <div className="w-3.5 h-6 bg-indigo-900 rounded-sm" />
                    <div className="w-3.5 h-6 bg-indigo-900 rounded-sm" />
                  </div>
                </div>
                <div className="mt-1.5 text-[10px] font-mono font-bold text-slate-300 py-0.5 px-2 bg-slate-900 rounded border border-slate-700">
                  Officer Cruz (NPC)
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 3 EXECUTIVE OFFICE
            ======================================================== */}
        {currentModule === 'M3_BUREAUCRACY' && (
          <div id="stage-m3" className="absolute inset-0 flex items-end justify-around pb-6 px-4">
            
            {/* Interactive PC Screen (SSS table popup) */}
            <button 
              id="hotspot-pc-terminal"
              onClick={() => onSelectHotspot('PC_TERMINAL')}
              className={`group flex flex-col items-center cursor-pointer transition-all ${selectedHotspot === 'PC_TERMINAL' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-4 py-2 bg-slate-900 border-2 rounded-lg text-xs font-mono font-bold mb-2 flex items-center gap-1 shadow-lg ${selectedHotspot === 'PC_TERMINAL' ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <Monitor className="w-3.5 h-3.5" />
                PC Terminal (SSS)
                <span className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-bounce">!</span>
              </div>
              <div className="w-22 h-20 bg-slate-900 border-4 border-slate-650 rounded-lg relative flex flex-col items-center justify-center shadow-lg shadow-black/40">
                <div className="w-18 h-12 bg-indigo-950 border-2 border-indigo-500 rounded p-1 flex items-center justify-center">
                  <div className="text-[8px] font-mono text-indigo-400 animate-pulse font-bold text-center leading-normal">
                    [SSS CONTRIBS]
                    <br />
                    SELECT EE ROW
                  </div>
                </div>
                <div className="w-10 h-2 bg-slate-700 absolute bottom-1 rounded-sm" />
              </div>
            </button>

            {/* PhilHealth Circular Poster */}
            <button 
              id="hotspot-ph-poster"
              onClick={() => onSelectHotspot('PH_POSTER')}
              className={`group flex flex-col items-center cursor-pointer transition-all ${selectedHotspot === 'PH_POSTER' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-4 py-2 bg-slate-900 border-2 rounded-lg text-xs font-mono font-bold mb-2 flex items-center gap-1 shadow-lg ${selectedHotspot === 'PH_POSTER' ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <BookOpen className="w-3.5 h-3.5" />
                PhilHealth Poster
              </div>
              <div className="w-20 h-28 bg-gradient-to-b from-teal-800 to-teal-950 border-4 border-emerald-400 rounded-lg relative flex flex-col justify-center items-center p-2 shadow-lg">
                <div className="w-6 h-6 bg-teal-500/50 rounded-full flex items-center justify-center mb-1 animate-float">
                  <Award className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="text-[10px] font-display font-extrabold text-emerald-300 leading-none">PHILHEALTH</span>
                <span className="text-[8px] font-mono text-slate-350 tracking-widest mt-1">EE SHARE=2.5%</span>
              </div>
            </button>

            {/* Compliance Guard M3 Blockage */}
            <div id="npc-guard-exec" className="flex flex-col items-center relative z-20">
              <button
                id="btn-guard-m3"
                onClick={() => onSelectHotspot('GUARD_NPC')}
                className={`relative group flex flex-col items-center focus:outline-none cursor-pointer`}
              >
                {guardLocked ? (
                  <div className="absolute -top-12 bg-red-950/95 text-red-105 border-2 border-red-500 px-3 py-1.5 rounded-lg text-center text-[10px] font-mono w-44 shadow-xl z-30 animate-pulse">
                    🚨 <strong>VERIFICATION:</strong> Prove SSS compliance selection details.
                  </div>
                ) : (
                  <div className="absolute -top-10 bg-emerald-950/95 text-emerald-100 border border-emerald-500 px-3 py-1 rounded-lg text-center text-[10px] font-mono w-32 shadow-lg z-35">
                    ✔ Room access verified.
                  </div>
                )}
                <div className={`w-14 h-28 flex flex-col items-center transition-all ${guardLocked ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : ''}`}>
                  {/* Hat */}
                  <div className="w-10 h-4 bg-emerald-950 rounded-t-md border-b-2 border-teal-500" />
                  {/* Face */}
                  <div className="w-8 h-8 bg-amber-100 border-2 border-slate-900 flex items-center justify-center relative">
                    <div className="w-1.5 h-1.5 bg-slate-950 rounded-full absolute top-2 left-1.5" />
                    <div className="w-1.5 h-1.5 bg-slate-950 rounded-full absolute top-2 right-1.5" />
                    <div className="w-4 h-1 bg-red-500 absolute bottom-1.5 rounded-full" />
                  </div>
                  {/* Body */}
                  <div className="w-12 h-14 bg-emerald-950 border-2 border-slate-900 rounded-b-md flex flex-col items-center relative">
                    <span className="text-[6px] font-mono text-zinc-100 font-bold top-1 absolute">COMPLIANCE</span>
                  </div>
                  {/* Legs */}
                  <div className="flex gap-2.5 mt-0.5">
                    <div className="w-3.5 h-6 bg-emerald-950 rounded-sm" />
                    <div className="w-3.5 h-6 bg-emerald-950 rounded-sm" />
                  </div>
                </div>
                <div className="mt-1.5 text-[10px] font-mono font-bold text-slate-300 py-0.5 px-2 bg-slate-900 rounded border border-slate-700">
                  Officer Santos (NPC)
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            MODULE 4 BOARDROOM COURT
            ======================================================== */}
        {currentModule === 'M4_TRIBUNAL' && (
          <div id="stage-m4" className="absolute inset-0 flex items-end justify-around pb-6 px-4">
            
            {/* Interactive Audit Archive Box */}
            <button 
              id="hotspot-audit-archive"
              onClick={() => onSelectHotspot('AUDIT_ARCHIVE')}
              className={`group flex flex-col items-center cursor-pointer transition-all ${selectedHotspot === 'AUDIT_ARCHIVE' ? 'scale-105' : 'hover:scale-102'}`}
            >
              <div className={`px-4 py-2 bg-slate-900 border-2 rounded-lg text-xs font-mono font-bold mb-2 flex items-center gap-1 shadow-lg ${selectedHotspot === 'AUDIT_ARCHIVE' ? 'border-amber-400 text-amber-400' : 'border-slate-700 text-slate-300 group-hover:border-amber-400 group-hover:text-amber-400'}`}>
                <Clipboard className="w-3.5 h-3.5" />
                Audit Archive Binder
                <span className="absolute -top-3 -right-3 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-bounce">!</span>
              </div>
              <div className="w-24 h-16 bg-gradient-to-t from-zinc-700 to-zinc-650 border-4 border-amber-600 rounded-lg relative flex flex-col items-center justify-center shadow-lg shadow-black/40">
                <FileSpreadsheet className="w-6 h-6 text-amber-400 animate-pulse mb-1" />
                <span className="text-[8px] font-mono text-zinc-300 font-bold uppercase">CASE_FILE_2026</span>
              </div>
            </button>

            {/* Imposing DOLE Inspector NPC */}
            <div id="npc-auditor-tribunal" className="flex flex-col items-center relative z-20">
              <button
                id="btn-auditor-npc"
                onClick={() => onSelectHotspot('AUDITOR_NPC')}
                className={`relative group flex flex-col items-center focus:outline-none cursor-pointer`}
              >
                <div className="absolute -top-16 bg-slate-900 border-2 border-amber-500 text-slate-100 px-4 py-2 rounded-lg text-center text-xs font-mono w-56 shadow-2xl z-30 animate-float">
                  👨‍⚖️ <strong>DOLE INSPECTOR CORTEZ:</strong>
                  <br />
                  <span className="text-[10px] text-amber-300 leading-none">"Audit the disputed payslip. I will route you on errors!"</span>
                </div>
                {/* Visual Character Body - DOLE Inspector */}
                <div className="w-16 h-30 flex flex-col items-center">
                  {/* Hair */}
                  <div className="w-12 h-5 bg-zinc-400 rounded-t-lg border-b-2 border-zinc-550" />
                  {/* Face */}
                  <div className="w-10 h-10 bg-amber-200 border-2 border-slate-900 flex items-center justify-center relative">
                    {/* Glasses */}
                    <div className="flex gap-1.5 absolute top-2.5">
                      <div className="w-3 h-3 border-2 border-slate-900 bg-cyan-200/50 rounded-full" />
                      <div className="w-1 h-0.5 bg-slate-900" />
                      <div className="w-3 h-3 border-2 border-slate-900 bg-cyan-200/50 rounded-full" />
                    </div>
                    {/* Frown */}
                    <div className="w-5 h-1.5 bg-slate-900 absolute bottom-2 rounded-full" />
                  </div>
                  {/* Suit */}
                  <div className="w-14 h-16 bg-slate-900 border-2 border-slate-950 rounded-b-md flex flex-col items-center relative justify-center">
                    <div className="w-2 h-4 bg-white absolute top-1 rounded-sm" />
                    <div className="w-4 h-4 bg-amber-500 absolute top-2 rotate-45 border border-slate-900" />
                    <span className="text-[7px] font-mono text-amber-400 font-bold bottom-1 absolute">JUDGE_DOLE</span>
                  </div>
                  {/* Legs */}
                  <div className="flex gap-2.5 mt-0.5">
                    <div className="w-4 h-6 bg-slate-905 rounded-sm" />
                    <div className="w-4 h-6 bg-slate-905 rounded-sm" />
                  </div>
                </div>
                <div className="mt-1.5 text-[10px] font-mono font-bold text-amber-400 py-0.5 px-3 bg-slate-900 border-2 border-amber-500 rounded-full">
                  Inspector Cortez (Auditor)
                </div>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Point & Click Interactive Instructions Banner */}
      <div id="point-click-guide" className="bg-slate-900/90 border-t-4 border-slate-705 px-4 py-2.5 text-center flex items-center justify-center gap-2 relative z-25">
        <MessageSquare id="icon-message-click" className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
        <p id="click-guide-text" className="text-slate-300 font-mono text-xs leading-none">
          Click on active <strong className="text-amber-400">hotspot badges</strong> or <strong className="text-amber-400">NPC characters</strong> in the room to analyze papers and extract required values.
        </p>
      </div>

      {/* NPC Compliance Check Modal / Portal */}
      {guardLocked && selectedHotspot === 'GUARD_NPC' && (
        <div id="npc-guard-modal" className="absolute inset-x-4 bottom-22 top-16 bg-slate-950/95 border-2 border-red-500 rounded-xl p-6 z-40 flex flex-col justify-between font-mono">
          <div id="guard-modal-head" className="flex items-start gap-4">
            <div id="shield-alert-container" className="w-12 h-12 bg-red-950 border border-red-500 rounded-lg flex items-center justify-center text-red-400 flex-shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 id="guard-modal-title" className="text-red-400 font-bold text-sm tracking-wider uppercase">
                🚨 SECURITY & RETENTION COMPLIANCE CHECK!
              </h3>
              <p id="guard-modal-desc" className="text-slate-400 text-xs mt-1">
                Before unlocking the next phase, you must prove you mastered the core business rule and did not rely on guess work.
              </p>
            </div>
          </div>

          <div id="guard-question-payload" className="bg-slate-900 p-4 border border-slate-800 rounded-lg my-4 flex-1 overflow-y-auto">
            <p id="question-text" className="text-slate-250 text-xs font-semibold leading-relaxed">
              <span className="text-red-400">Question:</span> {guardQuestion}
            </p>
            <div id="guard-options-grid" className="grid grid-cols-1 gap-2.5 mt-4">
              {guardAnswerOptions.map((opt, idx) => (
                <button
                  id={`btn-guard-opt-${idx}`}
                  key={idx}
                  onClick={() => onSubmitGuardAnswer(opt)}
                  className="w-full text-left bg-slate-950 border border-slate-700 hover:border-red-500 hover:bg-slate-900 text-slate-300 py-3 px-4 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>{opt}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {guardError && (
            <div id="guard-err-msg" className="bg-red-950/50 border border-red-800 px-4 py-2 rounded-lg text-xs text-red-300 text-center flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              {guardError}
            </div>
          )}

          <div id="guard-modal-foot" className="flex justify-end gap-3 mt-2">
            <button
              id="btn-close-guard-panel"
              onClick={() => onSelectHotspot(null)}
              className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400 cursor-pointer"
            >
              Exit Dialogue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
