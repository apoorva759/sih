import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import { OperationalEvent } from '../../types';
import {
  Zap,
  Clock,
  MapPin,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  ShieldAlert,
  Flame,
  CloudRain,
  Sliders,
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { events, simulateEvent, isRecalculating, resetToInitial } = useRailway();

  const eventTemplates: {
    type: OperationalEvent['eventType'];
    title: string;
    impact: number;
    desc: string;
    location: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'TEMPORARY_SPEED_RESTRICTION',
      title: 'Temporary Speed Restriction (60 km/h)',
      impact: 3,
      desc: 'Track ballast settling near KM 142.4; 60 km/h speed order enforced.',
      location: 'KM 142.4 (GWL-MRA section)',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />,
    },
    {
      type: 'DRONE_DETECTED_ANOMALY',
      title: 'Drone Detected Anomaly',
      impact: 3,
      desc: 'Aerial LiDAR survey flagged rail weld fissure. Direct constraint injected.',
      location: 'KM 142.4 South Down Line',
      icon: <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
    },
    {
      type: 'DOWNSTREAM_CONGESTION',
      title: 'Downstream Congestion',
      impact: 2,
      desc: 'Platform occupancy bottleneck at Agra Cantt (AGC) Yard.',
      location: 'Agra Cantt Interlocking Yard',
      icon: <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400" />,
    },
    {
      type: 'PRECEDING_TRAIN_DELAY',
      title: 'Preceding Train Delay',
      impact: 3,
      desc: 'Preceding rake running late, constraining block signal headway intervals.',
      location: 'Morena - Dholpur Section',
      icon: <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    },
    {
      type: 'UNSCHEDULED_STOP',
      title: 'Unscheduled Stop',
      impact: 4,
      desc: 'Emergency caution stop at outer home signal for track inspection.',
      location: 'KM 156.2 (Outer Home DHO)',
      icon: <ShieldAlert className="w-4 h-4 text-red-500 dark:text-red-400" />,
    },
    {
      type: 'STATION_DWELL_INCREASE',
      title: 'Station Dwell Increase',
      impact: 1,
      desc: 'Extended boarding time due to unreserved coach crowd surge.',
      location: 'Morena (MRA) Platform 2',
      icon: <Clock className="w-4 h-4 text-amber-600 dark:text-amber-300" />,
    },
    {
      type: 'WEATHER_IMPACT',
      title: 'Weather Impact (Dense Fog)',
      impact: 2,
      desc: 'Visibility drops below 200m; train running under fog safety protocol.',
      location: 'Dholpur - Agra Cantt Section',
      icon: <CloudRain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      type: 'INFRASTRUCTURE_ALERT',
      title: 'Infrastructure Alert',
      impact: 3,
      desc: 'Overhead Equipment (OHE) tensioning maintenance block notice.',
      location: 'Gwalior North Yard',
      icon: <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-3 shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              OPERATIONAL EVENTS & SIMULATOR
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold">
                DYNAMIC CONSTRAINT INJECTION
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trigger operational conditions to witness instant deterministic ETA recalculation.
            </p>
          </div>
        </div>

        <button
          onClick={resetToInitial}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Events</span>
        </button>
      </div>

      {/* Available Simulator Triggers */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
          Select Event to Inject into ETA Prediction Engine:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {eventTemplates.map((template) => {
            const isCurrentlyActive = events.some(
              (e) => e.eventType === template.type && e.active
            );

            return (
              <div
                key={template.type}
                className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                  isCurrentlyActive
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400 dark:border-amber-500/40 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      {template.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-amber-700 dark:text-amber-400 border border-slate-200 dark:border-slate-800">
                      +{template.impact} min impact
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-slate-200 text-sm mt-3">
                    {template.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {template.desc}
                  </p>

                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-2">
                    Loc: {template.location}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {isCurrentlyActive ? 'ACTIVE' : 'READY'}
                  </span>

                  <button
                    onClick={() => simulateEvent(template.type, template.title, template.impact)}
                    disabled={isRecalculating}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isCurrentlyActive
                        ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isCurrentlyActive ? 'Re-Trigger' : 'Trigger Event'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Corridor Events Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md transition-colors duration-200">
        <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase pb-3 border-b border-slate-200 dark:border-slate-800">
          Corridor Operational Event Log
        </h3>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold">
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Delay Impact</th>
                <th className="py-2.5 px-3">Affected Trains</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-200 font-sans">{evt.title}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{evt.description}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{evt.location}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{evt.source}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.severity === 'HIGH'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">
                    +{evt.delayImpactMinutes} min
                  </td>
                  <td className="py-3 px-3 text-blue-600 dark:text-blue-400">
                    {evt.affectedTrainIds.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.active
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {evt.active ? 'ACTIVE' : 'RESOLVED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
