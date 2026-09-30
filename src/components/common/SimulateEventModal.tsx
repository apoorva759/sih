import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import { OperationalEvent } from '../../types';
import {
  X,
  Zap,
  AlertTriangle,
  Clock,
  Sliders,
  ShieldAlert,
  CloudRain,
  Flame,
  Plane,
} from 'lucide-react';

export const SimulateEventModal: React.FC = () => {
  const {
    simulateEventModalOpen,
    setSimulateEventModalOpen,
    simulateEvent,
    triggerDroneConstraint,
    isRecalculating,
  } = useRailway();

  if (!simulateEventModalOpen) return null;

  const eventOptions: {
    type: OperationalEvent['eventType'];
    title: string;
    impact: number;
    desc: string;
    icon: React.ReactNode;
    isDrone?: boolean;
  }[] = [
    {
      type: 'TEMPORARY_SPEED_RESTRICTION',
      title: 'Temporary Speed Restriction (60 km/h)',
      impact: 3,
      desc: 'Section speed order between KM 141.8 and KM 143.2 on Down Main Line.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
    },
    {
      type: 'DRONE_DETECTED_ANOMALY',
      title: 'Drone Detected Anomaly',
      impact: 3,
      desc: 'Aerial LiDAR sensor flags ballast void at KM 142.4; sends constraint to ETA engine.',
      icon: <Plane className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      isDrone: true,
    },
    {
      type: 'DOWNSTREAM_CONGESTION',
      title: 'Downstream Congestion',
      impact: 2,
      desc: 'Interlocking yard congestion at Agra Cantt platform approach.',
      icon: <Clock className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
    },
    {
      type: 'PRECEDING_TRAIN_DELAY',
      title: 'Preceding Train Delay',
      impact: 3,
      desc: 'Preceding 12622 Tamil Nadu Express delayed, compressing headway.',
      icon: <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      type: 'UNSCHEDULED_STOP',
      title: 'Unscheduled Stop',
      impact: 4,
      desc: 'Halt at Outer Home signal due to level crossing clearance delay.',
      icon: <ShieldAlert className="w-5 h-5 text-red-500 dark:text-red-400" />,
    },
    {
      type: 'STATION_DWELL_INCREASE',
      title: 'Station Dwell Increase',
      impact: 1,
      desc: 'Unscheduled boarding dwell extension at Morena platform.',
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-300" />,
    },
    {
      type: 'WEATHER_IMPACT',
      title: 'Weather Impact (Dense Fog)',
      impact: 2,
      desc: 'Corridor fog safety speed restrictions imposed.',
      icon: <CloudRain className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    },
    {
      type: 'INFRASTRUCTURE_ALERT',
      title: 'Infrastructure Alert',
      impact: 3,
      desc: 'Overhead Equipment (OHE) caution order along Gwalior South.',
      icon: <Flame className="w-5 h-5 text-orange-500 dark:text-orange-400" />,
    },
  ];

  const handleSelect = async (opt: typeof eventOptions[0]) => {
    if (opt.isDrone) {
      await triggerDroneConstraint();
    } else {
      await simulateEvent(opt.type, opt.title, opt.impact);
    }
    setSimulateEventModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                SIMULATE OPERATIONAL EVENT
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select an operational disruption to observe immediate ETA engine recalculation
              </p>
            </div>
          </div>
          <button
            onClick={() => setSimulateEventModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 max-h-[60vh] overflow-y-auto pr-1">
          {eventOptions.map((opt) => (
            <button
              key={opt.title}
              onClick={() => handleSelect(opt)}
              disabled={isRecalculating}
              className="text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-slate-900 transition flex items-start space-x-3 group"
            >
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group-hover:border-amber-500/30 shrink-0 shadow-sm">
                {opt.icon}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-300">
                    {opt.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {opt.desc}
                </p>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold block mt-1.5">
                  Delay impact: +{opt.impact} min
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 text-center font-mono">
          Model recalculation runs deterministically across all downstream sectional checkpoints.
        </div>
      </div>
    </div>
  );
};
