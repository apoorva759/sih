import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { Train, TrainStatus } from '../../types';
import {
  Train as TrainIcon,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const FleetTableView: React.FC = () => {
  const { trains, selectedTrain, setSelectedTrainId, setActiveTab } = useRailway();
  const [filter, setFilter] = useState<'ALL' | 'ON_TIME' | 'DELAYED' | 'HIGH_UNCERTAINTY' | 'INFRASTRUCTURE_ALERT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrains = trains.filter((train) => {
    // Search match
    const matchesSearch =
      train.number.includes(searchQuery) ||
      train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.currentSection.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter match
    if (filter === 'ALL') return true;
    if (filter === 'ON_TIME') return train.status === 'ON_TIME';
    if (filter === 'DELAYED') return train.status === 'DELAYED' || train.status === 'SLIGHT_DELAY';
    if (filter === 'HIGH_UNCERTAINTY') return train.status === 'HIGH_UNCERTAINTY';
    if (filter === 'INFRASTRUCTURE_ALERT') return train.hasInfrastructureAlert;

    return true;
  });

  const getStatusBadge = (status: TrainStatus) => {
    switch (status) {
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
    }
  };

  const handleSelectTrain = (trainId: string) => {
    setSelectedTrainId(trainId);
    setActiveTab('eta-forecast');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 transition-colors duration-200">
      {/* Table Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <TrainIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase">
            CORRIDOR COACHING FLEET ({filteredTrains.length} / {trains.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            • Gwalior–Agra NCR Section
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'All (28)' },
            { id: 'ON_TIME', label: 'On Time' },
            { id: 'DELAYED', label: 'Delayed' },
            { id: 'HIGH_UNCERTAINTY', label: 'High Uncertainty' },
            { id: 'INFRASTRUCTURE_ALERT', label: 'Infrastructure Alert' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as typeof filter)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                filter === item.id
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by train number (e.g. 12806, 22470), train name, or section..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 placeholder-slate-400 dark:placeholder-slate-500 transition"
        />
      </div>

      {/* Fleet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-semibold">
              <th className="py-2.5 px-3">Train</th>
              <th className="py-2.5 px-3">Current Section & KM</th>
              <th className="py-2.5 px-3">Speed</th>
              <th className="py-2.5 px-3">Current Delay</th>
              <th className="py-2.5 px-3">Baseline ETA</th>
              <th className="py-2.5 px-3">Dynamic ETA</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
            {filteredTrains.map((train) => {
              const isSelected = selectedTrain.id === train.id;
              return (
                <tr
                  key={train.id}
                  className={`transition hover:bg-slate-50 dark:hover:bg-slate-850/60 ${
                    isSelected ? 'bg-blue-50/70 dark:bg-blue-950/20 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-200 font-sans flex items-center space-x-1.5">
                      <span>{train.number}</span>
                      <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                        {train.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">
                      {train.origin} → {train.destination}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-700 dark:text-slate-300 font-sans text-xs">{train.currentSection}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">KM {train.currentKM}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-slate-900 dark:text-slate-200 font-semibold">{train.currentSpeed}</span>
                    <span className="text-slate-400 dark:text-slate-500 text-[10px]"> / {train.scheduledSpeed} km/h</span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        train.currentDelayMinutes > 5
                          ? 'text-rose-600 dark:text-rose-400'
                          : train.currentDelayMinutes > 0
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      +{train.currentDelayMinutes} min
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {train.baselineETA}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center space-x-1">
                      <span>{train.dynamicETA}</span>
                      {train.etaAdjustmentMinutes !== 0 && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400">
                          (+{train.etaAdjustmentMinutes}m)
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {train.confidencePercent}%
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    {getStatusBadge(train.status)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleSelectTrain(train.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-sans font-semibold transition flex items-center space-x-1 ml-auto ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isSelected ? 'Viewing' : 'Inspect'}</span>
                    </button>
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
