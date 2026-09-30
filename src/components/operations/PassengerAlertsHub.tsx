import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import { Bell, Clock, AlertTriangle, ArrowRight, CheckCircle2, Radio } from 'lucide-react';

export const PassengerAlertsHub: React.FC = () => {
  const { alerts, dataFreshnessSeconds } = useRailway();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-3 shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              PASSENGER ALERT HUB
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                ACTIVE MONITORING ({alerts.length})
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic push alerts dispatched upon dynamic ETA recalculation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <Radio className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 animate-pulse" />
          <span>ETA updated {dataFreshnessSeconds} seconds ago</span>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            {/* Top row */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  TRAIN {alert.trainNumber}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {alert.trainName}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {alert.status}
              </span>
            </div>

            {/* Middle: Previous vs Updated ETA */}
            <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Previous ETA
                </span>
                <span className="text-lg font-bold text-slate-400 line-through">
                  {alert.previousEta}
                </span>
              </div>

              <div className="border-l border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase block font-bold">
                  Updated Dynamic ETA
                </span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                  {alert.updatedEta}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Reason:</strong> {alert.reason}
                </span>
              </div>

              {alert.passengerName && (
                <div className="text-slate-500 dark:text-slate-400 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-mono">
                  <span>Passenger: {alert.passengerName} (PNR: {alert.pnr})</span>
                  <span>{alert.origin} → {alert.destination}</span>
                </div>
              )}

              {/* Recommended Alternative Train if any */}
              {alert.alternativeTrain && (
                <div className="mt-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 text-xs">
                  <div className="flex items-center justify-between text-indigo-800 dark:text-indigo-300 font-bold mb-1">
                    <span>Alternative Corridor Option</span>
                    <span className="text-[10px] font-mono">Train {alert.alternativeTrain.number}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 text-[11px]">
                    <strong>{alert.alternativeTrain.name}:</strong> Departs {alert.alternativeTrain.departure}, ETA {alert.alternativeTrain.estimatedArrival}.
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {alert.alternativeTrain.reason}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span>Dispatched via Central Signal Telemetry</span>
              <span>Updated {alert.timestampSecondsAgo} seconds ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
