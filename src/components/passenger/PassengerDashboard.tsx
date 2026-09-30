import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Search,
  Train,
  Bell,
  Clock,
  MapPin,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Radio,
} from 'lucide-react';

export const PassengerDashboard: React.FC = () => {
  const {
    trains,
    selectedTrain,
    setSelectedTrainId,
    alerts,
    dataFreshnessSeconds,
    subscribedTrainIds,
    toggleTrainSubscription,
  } = useRailway();

  const [searchNum, setSearchNum] = useState('12806');
  const [journeyDate, setJourneyDate] = useState('2026-10-01');
  const [boardingStation, setBoardingStation] = useState('GWL');
  const [destinationStation, setDestinationStation] = useState('AGC');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = trains.find((t) => t.number === searchNum || t.name.toLowerCase().includes(searchNum.toLowerCase()));
    if (found) {
      setSelectedTrainId(found.id);
    }
  };

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    toggleTrainSubscription(selectedTrain.id);
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 4000);
  };

  const isSubscribed = subscribedTrainIds.includes(selectedTrain.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Passenger Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 dark:from-blue-950 dark:via-slate-900 dark:to-indigo-950 border border-blue-400/30 dark:border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200 dark:text-blue-400">
                RAILETA PASSENGER PORTAL
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20 dark:bg-blue-500/20 text-white dark:text-blue-300 border border-white/30 dark:border-blue-400/30 font-bold">
                LIVE COMMUTER ASSIST
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
              "Your journey, before the disruption."
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 dark:text-slate-300 mt-1">
              Data-driven dynamic ETA forecasting for coaching trains across Indian Railways.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/20 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700 px-3.5 py-2 rounded-2xl text-xs font-mono text-white dark:text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-300 dark:text-emerald-400 animate-pulse" />
            <span>Telemetry: {dataFreshnessSeconds}s ago</span>
          </div>
        </div>
      </div>

      {/* Disruption Alert Card (if dynamic ETA changed from baseline) */}
      {selectedTrain.etaAdjustmentMinutes > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/50 rounded-3xl p-6 shadow-md animate-fadeIn text-slate-900 dark:text-white transition-colors duration-200">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sm uppercase text-amber-700 dark:text-amber-400">
                    ⚠ JOURNEY ALERT: DYNAMIC ETA UPDATE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    Train {selectedTrain.number}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">
                  Expected delay at {selectedTrain.destination}:{' '}
                  <strong className="text-amber-700 dark:text-amber-300">
                    +{selectedTrain.currentDelayMinutes + selectedTrain.etaAdjustmentMinutes} minutes
                  </strong>{' '}
                  (Dynamic ETA: {selectedTrain.dynamicETA})
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <strong>Reason:</strong> Temporary speed restriction (60 km/h) & sectional congestion.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 block font-bold">
                Updated automatically • {dataFreshnessSeconds}s ago
              </span>
            </div>
          </div>

          {/* Alternative train recommendation */}
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-amber-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
                FAST ALTERNATIVE DETECTED
              </span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">
                Train 12952 (Mumbai Rajdhani Express) • Departs: 18:50, ETA Agra: 19:25
              </span>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Running on time via express clear block section.
              </div>
            </div>

            <button
              onClick={() => setSelectedTrainId('12952')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
            >
              View Train 12952
            </button>
          </div>
        </div>
      )}

      {/* Grid: Search & Alert Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Train Selector */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 transition-colors duration-200">
          <h2 className="font-extrabold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            FIND YOUR TRAIN
          </h2>

          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold block mb-1">
                Train Number or Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchNum}
                  onChange={(e) => setSearchNum(e.target.value)}
                  placeholder="e.g. 12806 or AP Express"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Track
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-medium">Boarding</label>
                <select
                  value={boardingStation}
                  onChange={(e) => setBoardingStation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="GWL">Gwalior (GWL)</option>
                  <option value="MRA">Morena (MRA)</option>
                  <option value="DHO">Dholpur (DHO)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-medium">Destination</label>
                <select
                  value={destinationStation}
                  onChange={(e) => setDestinationStation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="AGC">Agra Cantt (AGC)</option>
                  <option value="MTJ">Mathura (MTJ)</option>
                  <option value="NDLS">New Delhi (NDLS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-medium">Journey Date</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>
          </form>

          {/* Quick Select Popular Rakes */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block mb-2">
              Popular Corridor Trains
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { num: '12806', name: 'AP Superfast' },
                { num: '22470', name: 'Vande Bharat' },
                { num: '12002', name: 'Shatabdi Exp' },
                { num: '12952', name: 'Rajdhani Exp' },
                { num: '12050', name: 'Gatimaan' },
              ].map((t) => (
                <button
                  key={t.num}
                  onClick={() => {
                    setSearchNum(t.num);
                    setSelectedTrainId(t.num);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-mono transition ${
                    selectedTrain.number === t.num
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {t.num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right: Selected Train Live Status & Alert Subscription */}
        <div className="lg:col-span-2 space-y-6">
          {/* Train Live Dynamic Forecast Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md transition-colors duration-200">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    Train {selectedTrain.number}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedTrain.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold">
                    {selectedTrain.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Route: {selectedTrain.origin} → {selectedTrain.destination}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-mono">
                  Currently passing
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {selectedTrain.currentSection} (KM {selectedTrain.currentKM})
                </span>
              </div>
            </div>

            {/* Timings Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">
                  Scheduled Arrival
                </span>
                <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
                  19:30
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Agra Cantt</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">
                  Baseline ETA
                </span>
                <span className="text-xl font-bold font-mono text-slate-500 dark:text-slate-400">
                  {selectedTrain.baselineETA}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Static Formula</span>
              </div>

              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-500/40">
                <span className="text-[10px] text-blue-700 dark:text-blue-300 uppercase block font-bold">
                  Dynamic ETA
                </span>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {selectedTrain.dynamicETA}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-semibold">
                  +{selectedTrain.currentDelayMinutes + selectedTrain.etaAdjustmentMinutes}m delay
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">
                  Confidence
                </span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedTrain.confidencePercent}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  {selectedTrain.confidenceRange}
                </span>
              </div>
            </div>

            {/* Set Journey Alert Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              {alertSuccess ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <strong>✓ Alert successfully activated:</strong> RAILOPT AI will monitor your journey for simulated disruptions and push live dynamic ETA recalculations.
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      {isSubscribed ? 'Monitoring is active for this train' : 'Receive instant dynamic ETA alerts'}
                    </span>
                  </div>

                  <button
                    onClick={handleSetAlert}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      isSubscribed
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isSubscribed ? 'MANAGE ALERT' : 'SET JOURNEY ALERT'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Station Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md transition-colors duration-200">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              UPCOMING STATIONS & PREDICTED PLATFORM TIMINGS
            </h3>

            <div className="space-y-2">
              {selectedTrain.stops.map((stop) => {
                const isDeparted = stop.status === 'DEPARTED';
                return (
                  <div
                    key={stop.stationCode}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                      isDeparted
                        ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 opacity-60'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                        {stop.stationCode}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {stop.stationName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {stop.platform || 'PF 1'} • Sched: {stop.scheduledArrival}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      {isDeparted ? (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Departed</span>
                      ) : (
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-sm">
                            {stop.predictedArrival}
                          </div>
                          <span
                            className={`text-[10px] font-semibold ${
                              stop.delayMinutes > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {stop.delayMinutes > 0 ? `+${stop.delayMinutes}m delay` : 'On time'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
