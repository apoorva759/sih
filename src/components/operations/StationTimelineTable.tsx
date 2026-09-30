import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import { StationStop, TrainStatus } from '../../types';
import { MapPin, Clock, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

export const StationTimelineTable: React.FC = () => {
  const { selectedTrain } = useRailway();
  const stops = selectedTrain.stops || [];

  const getStatusBadge = (status: StationStop['status']) => {
    switch (status) {
      case 'DEPARTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <CheckCircle className="w-3 h-3 mr-1 text-slate-400" />
            Departed
          </span>
        );
      case 'ON_TIME':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            ON TIME
          </span>
        );
      case 'SLIGHT_DELAY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            SLIGHT DELAY
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            DELAYED
          </span>
        );
      case 'HIGH_UNCERTAINTY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40">
            <ShieldAlert className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
            HIGH UNCERTAINTY
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase">
            STATION-WISE DYNAMIC ETA TIMELINE
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            • Train {selectedTrain.number}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          <span>Real-time Interlocking Telemetry</span>
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div className="py-5 overflow-x-auto scrollbar-none">
        <div className="flex items-center justify-between min-w-[560px] relative px-6">
          {/* Horizontal Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
              style={{
                width: `${
                  (stops.filter((s) => s.status === 'DEPARTED').length /
                    Math.max(1, stops.length - 1)) *
                  100
                }%`,
              }}
            />
          </div>

          {stops.map((stop, idx) => {
            const isDeparted = stop.status === 'DEPARTED';
            const isCurrent = idx === 1; // e.g. approaching Morena
            return (
              <div key={stop.stationCode} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border-2 transition ${
                    isDeparted
                      ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                      : isCurrent
                      ? 'bg-blue-600 border-white text-white ring-4 ring-blue-500/20 animate-pulse'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {stop.stationCode.slice(0, 1)}
                </div>
                <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  {stop.stationName.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {stop.stationCode}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Station Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold">
              <th className="py-2.5 px-3">Station</th>
              <th className="py-2.5 px-3">Platform</th>
              <th className="py-2.5 px-3">Scheduled</th>
              <th className="py-2.5 px-3">Current / Predicted</th>
              <th className="py-2.5 px-3">Delay</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {stops.map((stop) => {
              const isDeparted = stop.status === 'DEPARTED';
              return (
                <tr
                  key={stop.stationCode}
                  className={`transition hover:bg-slate-50 dark:hover:bg-slate-850/50 ${
                    isDeparted ? 'opacity-70 bg-slate-50/50 dark:bg-slate-950/30' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {stop.stationName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {stop.stationCode} • +{stop.distanceKm} km
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {stop.platform || 'PF 1'}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                      <span>{stop.scheduledArrival}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    {isDeparted ? (
                      <span className="text-slate-500">{stop.scheduledArrival} (Departed)</span>
                    ) : (
                      <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                        <span>{stop.predictedArrival}</span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">predicted</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono">
                    {isDeparted ? (
                      <span className="text-slate-400 dark:text-slate-500">0 min</span>
                    ) : (
                      <span
                        className={`font-semibold ${
                          stop.delayMinutes > 5
                            ? 'text-rose-600 dark:text-rose-400'
                            : stop.delayMinutes > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {stop.delayMinutes > 0 ? `+${stop.delayMinutes} min` : 'On time'}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono">
                    {isDeparted ? (
                      <span className="text-slate-400 dark:text-slate-500">Recorded</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {stop.confidence}%
                        </span>
                        <div className="w-12 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 dark:bg-blue-400 h-full rounded-full"
                            style={{ width: `${stop.confidence}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right">
                    {getStatusBadge(stop.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
