import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import { SIMULATED_ERROR_COMPARISON } from '../../data/initialData';
import {
  BarChart3,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { modelMetrics } = useRailway();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-3 shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              ANALYTICS & MODEL EVALUATION
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-bold">
                SIMULATED MODEL EVALUATION
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic validation metrics across 1,420 simulated coaching train runs.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Baseline Method: Static Schedule + Current Delay
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: MAE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>ETA MAE</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">-59% error</span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {modelMetrics.maeMinutes}
            </span>
            <span className="text-xs text-slate-500 ml-1">min</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            Baseline: {modelMetrics.baselineMaeMinutes} min
          </span>
        </div>

        {/* Metric 2: RMSE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>RMSE</span>
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {modelMetrics.rmseMinutes}
            </span>
            <span className="text-xs text-slate-500 ml-1">min</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            Root Mean Square Error
          </span>
        </div>

        {/* Metric 3: Within +/- 5 min */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Within ±5 min</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {modelMetrics.pctWithin5Min}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            Baseline: 61.4%
          </span>
        </div>

        {/* Metric 4: Within +/- 10 min */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Within ±10 min</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {modelMetrics.pctWithin10Min}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            High reliability tier
          </span>
        </div>

        {/* Metric 5: Latency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Update Latency</span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {modelMetrics.updateLatencyMs}
            </span>
            <span className="text-xs text-slate-500 ml-1">ms</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            Dynamic recalculation cycle
          </span>
        </div>

        {/* Metric 6: Coverage */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Forecast Coverage</span>
            <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-purple-700 dark:text-purple-400 font-mono">
              {modelMetrics.forecastCoveragePct}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
            All 28 active rakes
          </span>
        </div>
      </div>

      {/* Comparative Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Horizon Comparison Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md transition-colors duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase">
              MAE ERROR HORIZON COMPARISON
            </h3>
            <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
              ILLUSTRATIVE SIMULATION
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
            Comparison of prediction deviation as train approaches destination station:
          </p>

          <div className="space-y-4">
            {SIMULATED_ERROR_COMPARISON.map((row) => (
              <div key={row.horizon} className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span className="font-bold">{row.horizon}</span>
                  <div className="space-x-3">
                    <span className="text-rose-600 dark:text-rose-400">Baseline: {row.baselineMae}m</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">RailETA: {row.railEtaMae}m</span>
                  </div>
                </div>

                <div className="h-4 w-full bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-850">
                  {/* Baseline bar */}
                  <div
                    className="h-full bg-rose-500/70 rounded-l mr-1 flex items-center justify-end px-1 text-[9px] text-white"
                    style={{ width: `${(row.baselineMae / 20) * 100}%` }}
                  />
                  {/* RailETA bar */}
                  <div
                    className="h-full bg-emerald-500 rounded flex items-center px-1 text-[9px] text-white font-bold"
                    style={{ width: `${(row.railEtaMae / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-rose-500/70 rounded-sm" />
              <span>Baseline Method (Schedule + Current Delay)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span className="text-slate-800 dark:text-slate-200 font-bold">RailETA AI Model</span>
            </div>
          </div>
        </div>

        {/* Dynamic Model Architecture & Explainability Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                FORECASTING ENGINE SPECIFICATION
              </h3>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                Deterministic Formulation
              </span>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div className="text-blue-600 dark:text-blue-400 font-bold">
                ETA_dynamic = T_scheduled + Delay_current + Δ_operational
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-4 border-l-2 border-blue-500/50">
                Where Δ_operational = TSR_impact + Dwell_extension - Section_recovery + Headway_congestion + Unscheduled_halt
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Transparent Feature Attribution:</strong> Operational constraints are mapped directly to physical seconds rather than ungrounded neural output.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Degradation Robustness:</strong> In the event of stale GPS or loss of sensor feeds, the system automatically drops to Baseline Mode with prominent UI flagging.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Indian Railways Deployment Architecture:</strong> Designed for seamless ingestion of FOIS, COA (Control Office Application), and RTIS (Real-Time Train Information System) streams.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
            <strong>Hackathon Compliance Notice:</strong> These figures represent prototype benchmarking over simulated NCR corridor conditions for SIH26028.
          </div>
        </div>
      </div>
    </div>
  );
};
