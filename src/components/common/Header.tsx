import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Train,
  Activity,
  Radio,
  Zap,
  Play,
  RotateCcw,
  AlertTriangle,
  User as UserIcon,
  ShieldCheck,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    theme,
    toggleTheme,
    currentUser,
    logout,
    setAuthModalOpen,
    setAuthMode,
    activeTab,
    setActiveTab,
    dataFreshnessSeconds,
    isStale,
    toggleStaleMode,
    setSimulateEventModalOpen,
    setDemoModalOpen,
    resetToInitial,
    isRecalculating,
  } = useRailway();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'trains', label: 'Trains' },
    { id: 'eta-forecast', label: 'ETA Forecast' },
    { id: 'events', label: 'Events' },
    { id: 'drone', label: 'Drone Inspection' },
    { id: 'alerts', label: 'Passenger Alerts' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Banner: Status & Prototype Disclaimer */}
      <div className="bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
              AI SYSTEM ONLINE
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">SIH26028 • Ministry of Railways</span>
          </div>

          <span className="text-slate-300 dark:text-slate-600 hidden md:inline">|</span>

          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-mono">
            SIMULATED ENVIRONMENT • PROTOTYPE
          </span>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          {/* Data Freshness Indicator */}
          <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <Radio className={`w-3 h-3 ${isRecalculating ? 'text-purple-500 dark:text-purple-400 animate-spin' : isStale ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'}`} />
            {isStale ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Data stale: 2 min (FALLBACK MODE)
              </span>
            ) : (
              <span>Updated: {dataFreshnessSeconds} sec ago</span>
            )}
          </div>

          {/* Fallback Mode Toggle */}
          <button
            onClick={toggleStaleMode}
            title={isStale ? "Restore live predictive telemetry" : "Simulate stale data to test Fallback Mode"}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition border ${
              isStale
                ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {isStale ? 'Exit Fallback' : 'Test Stale Feed'}
          </button>

          {/* Reset State */}
          <button
            onClick={resetToInitial}
            title="Reset simulation to initial baseline"
            className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="h-full w-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Train className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                RAILETA AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                XENO Core
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dynamic Railway ETA Forecasting System
            </p>
          </div>
        </div>

        {/* Center / Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Simulate Event Button */}
          <button
            onClick={() => setSimulateEventModalOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-500/20 transition transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>SIMULATE EVENT</span>
          </button>

          {/* 90-Sec Demo Guide Button */}
          <button
            onClick={() => setDemoModalOpen(true)}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-xl text-xs border border-indigo-400/30 transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-indigo-200" />
            <span>90-Sec Demo Guide</span>
          </button>
        </div>

        {/* Right Section: Mode Switcher, Theme Toggle, User Profile */}
        <div className="flex items-center space-x-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-750 p-1 rounded-xl">
            <button
              onClick={() => setMode('PASSENGER')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'PASSENGER'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Passenger</span>
            </button>
            <button
              onClick={() => setMode('OPERATIONS')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'OPERATIONS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Operations</span>
            </button>
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-750 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 transition shadow-sm flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-300 dark:border-slate-750 bg-slate-100 dark:bg-slate-900 hover:border-blue-500 transition group"
                >
                  <div className={`w-7 h-7 rounded-lg ${currentUser.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                    {currentUser.avatarInitials}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono leading-none">
                      {currentUser.role === 'PASSENGER' ? 'Passenger' : 'Operations'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn text-xs">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {currentUser.roleTitle}
                      </div>
                      <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                        {currentUser.employeeIdOrPnr}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {currentUser.division}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setAuthMode('LOGIN');
                          setAuthModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                        <span>Switch User / Profiles</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Terminal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    setAuthMode('SIGNUP');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operations Mode Navigation Tabs */}
      {mode === 'OPERATIONS' && (
        <div className="border-t border-slate-200 dark:border-slate-850 bg-slate-50/80 dark:bg-slate-950/60 px-4">
          <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto py-1 scrollbar-none text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  activeTab === item.id
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
