import React from 'react';
import { Train, Shield, Radio, Code2, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-8 px-4 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-850">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-200">
                RAILETA AI
              </span>
              <span className="text-xs text-slate-500 block">
                Dynamic Railway ETA Forecasting System • SIH26028
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-400">Ministry of Railways</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400">North Central Railway (Gwalior–Agra Corridor)</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <Radio className="w-3 h-3 animate-pulse" /> AI Engine Online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Explainable Dynamic Model
            </h4>
            <p className="text-[11px] leading-relaxed">
              Combines GPS location, sectional running times, temporary speed restrictions, station dwell extension, in-built recovery buffers, downstream headway congestion, and aerial LiDAR drone event feeds.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Prototype Simulation Disclaimer
            </h4>
            <p className="text-[11px] leading-relaxed">
              This system is built for Smart India Hackathon 2026. All telemetry, train positions, drone detections, and accuracy numbers are generated in a simulated environment to showcase end-to-end functionality.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Production Deployment Pathway
            </h4>
            <p className="text-[11px] leading-relaxed">
              Designed to connect directly with Indian Railways COA (Control Office Application), RTIS (Real-Time Train Information System), and NTES feeds for national deployment across coaching rakes.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-850 text-center text-[11px] text-slate-500 font-mono">
          © 2026 RAILETA AI • Dynamic ETA Decision-Support System • Smart India Hackathon
        </div>
      </div>
    </footer>
  );
};
