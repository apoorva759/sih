import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import { DynamicETACard } from './DynamicETACard';
import { StationTimelineTable } from './StationTimelineTable';
import { DroneInspectionModule } from './DroneInspectionModule';
import { EventsView } from './EventsView';
import { PassengerAlertsHub } from './PassengerAlertsHub';
import { AnalyticsView } from './AnalyticsView';
import { FleetTableView } from './FleetTableView';
import {
  Train,
  Activity,
  Radio,
  Clock,
  AlertTriangle,
  Zap,
  ArrowRight,
  X,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const OperationsDashboard: React.FC = () => {
  const {
    activeTab,
    trains,
    alerts,
    events,
    modelMetrics,
    recalculationNotification,
    dismissRecalculationNotification,
    isRecalculating,
  } = useRailway();

  return (
    <div className="space-y-6">
      {/* Animated Recalculation Alert Banner (BEFORE vs AFTER) */}
      {recalculationNotification && recalculationNotification.visible && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border border-blue-400/50 p-4 shadow-2xl text-white animate-slideDown">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm uppercase tracking-wider text-blue-300">
                    LIVE ETA RECALCULATION APPLIED
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-400/20 text-white font-bold">
                    EVENT DETECTED
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  <strong>Trigger:</strong> {recalculationNotification.reason}
                </p>
              </div>
            </div>

            {/* BEFORE vs AFTER Readout */}
            <div className="flex items-center space-x-3 bg-slate-950/70 border border-blue-400/30 px-4 py-2 rounded-2xl text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">BEFORE</span>
                <span className="font-bold text-slate-300 line-through">
                  ETA {recalculationNotification.beforeEta}
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-blue-400" />

              <div>
                <span className="text-[10px] text-emerald-400 uppercase block font-bold">AFTER</span>
                <span className="text-base font-black text-amber-300">
                  ETA {recalculationNotification.afterEta}
                </span>
              </div>

              <div className="border-l border-slate-700 pl-3">
                <span className="text-[10px] text-slate-400 uppercase block">IMPACT</span>
                <span className="font-bold text-amber-400">
                  +{recalculationNotification.impactMinutes} min
                </span>
              </div>

              <div className="border-l border-slate-700 pl-3 hidden sm:block">
                <span className="text-[10px] text-slate-400 uppercase block">STATIONS</span>
                <span className="font-bold text-blue-300">
                  {recalculationNotification.affectedStationCount} affected
                </span>
              </div>
            </div>

            <button
              onClick={dismissRecalculationNotification}
              className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: ACTIVE TRAINS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-md flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block">
              ACTIVE TRAINS
            </span>
            <div className="my-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                {trains.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Gwalior–Agra Corridor Fleet
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <Train className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: LIVE ETA UPDATES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-md flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block">
              LIVE ETA UPDATES
            </span>
            <div className="my-1 flex items-baseline space-x-1.5">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                142
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">● Active</span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Automated Dynamic Engine
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: AVG ETA ERROR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-md flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block">
              AVG ETA ERROR
            </span>
            <div className="my-1 flex items-baseline space-x-1">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {modelMetrics.maeMinutes}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">min</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
              ↓ 59% vs baseline (9.4m)
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: ACTIVE ALERTS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-md flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400 block">
              ACTIVE ALERTS
            </span>
            <div className="my-1">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {alerts.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Passenger & Control Feeds
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <DynamicETACard />
          <StationTimelineTable />
          <FleetTableView />
        </div>
      )}

      {activeTab === 'trains' && (
        <div className="space-y-6">
          <FleetTableView />
        </div>
      )}

      {activeTab === 'eta-forecast' && (
        <div className="space-y-6">
          <DynamicETACard />
          <StationTimelineTable />
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          <EventsView />
        </div>
      )}

      {activeTab === 'drone' && (
        <div className="space-y-6">
          <DroneInspectionModule />
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <PassengerAlertsHub />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <AnalyticsView />
        </div>
      )}
    </div>
  );
};
