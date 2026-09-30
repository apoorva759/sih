import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Plane,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  CheckCircle2,
  Code2,
  Cpu,
} from 'lucide-react';

export const DroneInspectionModule: React.FC = () => {
  const {
    droneTelemetry,
    triggerDroneConstraint,
    isRecalculating,
    selectedTrain,
  } = useRailway();

  const [showJsonSpec, setShowJsonSpec] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleSendConstraint = async () => {
    await triggerDroneConstraint();
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 4000);
  };

  const samplePayload = {
    droneId: 'DRONE-01',
    location: 'KM 142.4',
    severity: 'HIGH',
    eventType: 'INFRASTRUCTURE_ANOMALY',
    speedRestriction: 60,
    estimatedDuration: 30,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Disclaimer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-3 shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              DRONE INSPECTION MODULE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold">
                AERIAL TELEMETRY FEED
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Autonomous aerial rail survey & event intelligence integration (SIH26028).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-amber-800 dark:text-amber-400/90 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium">
            CRITICAL: Drone feeds operational constraints; ETA Engine predicts arrival.
          </span>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Constraint Dispatched:</strong> Speed restriction of 60 km/h applied at KM 142.4. ETA Engine dynamically recalculated Train {selectedTrain.number} ETA to 18:42 (+4 min).
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400">SUCCESS 200 OK</span>
        </div>
      )}

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Drone Telemetry Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md transition-colors duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {droneTelemetry.droneId}
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {droneTelemetry.sector}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Gwalior–Agra Corridor Section • Autonomous Orbit
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                {droneTelemetry.status}
              </span>
            </div>
          </div>

          {/* Anomaly Overview Card */}
          <div className="my-5 p-4 rounded-2xl bg-rose-50/60 dark:bg-slate-950/80 border border-rose-300 dark:border-rose-500/30">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  DETECTED: Infrastructure Anomaly
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {droneTelemetry.detectedAnomaly}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                SEVERITY: {droneTelemetry.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-rose-200 dark:border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">LOCATION</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{droneTelemetry.location}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">OPERATIONAL EFFECT</span>
                <span className="font-bold text-amber-700 dark:text-amber-300">{droneTelemetry.operationalEffect}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">RESTRICTION</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{droneTelemetry.speedRestriction} km/h</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] block">EST. DURATION</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{droneTelemetry.estimatedDurationMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              onClick={() => setShowJsonSpec(!showJsonSpec)}
              className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showJsonSpec ? 'Hide API Payload' : 'View POST /api/drone-event Schema'}</span>
            </button>

            <button
              onClick={handleSendConstraint}
              disabled={isRecalculating}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-purple-500/20 transition active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isRecalculating ? 'TRANSMITTING CONSTRAINT...' : 'SEND CONSTRAINT TO ETA ENGINE'}
              </span>
            </button>
          </div>

          {/* JSON Payload viewer */}
          {showJsonSpec && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
                <span>POST /api/drone-event</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400">JSON Schema</span>
              </div>
              <pre className="text-emerald-700 dark:text-emerald-400 overflow-x-auto text-[11px] p-2 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                {JSON.stringify(samplePayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Architectural Pipeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between transition-colors duration-200">
          <div>
            <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              EVENT-TO-ETA PIPELINE
            </h3>

            <div className="my-4 space-y-3">
              {/* Step 1 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">Drone Anomaly</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">LiDAR defect tagged at KM 142.4</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center -my-1 text-slate-400">↓</div>

              {/* Step 2 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">Operational Constraint</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Converts to TSR 60 km/h deceleration</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center -my-1 text-slate-400">↓</div>

              {/* Step 3 */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">ETA Engine Recalculation</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Dynamic ETA: 18:38 → 18:42 (+4m)</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center -my-1 text-slate-400">↓</div>

              {/* Step 4 */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                  4
                </div>
                <div>
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">Passenger + Operations Alert</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80">Broadcasting automated ETA alerts</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <strong>Architecture Notice:</strong> In production deployment, authorized CRIS/FOIS railway APIs will replace mock payloads.
          </div>
        </div>
      </div>
    </div>
  );
};
