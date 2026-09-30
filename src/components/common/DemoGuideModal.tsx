import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  X,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const {
    demoModalOpen,
    setDemoModalOpen,
    setMode,
    setActiveTab,
    setSelectedTrainId,
    simulateEvent,
    triggerDroneConstraint,
    resetToInitial,
    selectedTrain,
  } = useRailway();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!demoModalOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Open Operations Mode & Focus Train 12806',
      desc: 'View initial baseline state of Train 12806 (AP Superfast Express, Gwalior → Agra Cantt).',
      actionLabel: 'Execute Step 1',
      run: () => {
        setMode('OPERATIONS');
        setActiveTab('overview');
        setSelectedTrainId('12806');
      },
    },
    {
      step: 2,
      title: 'Inspect Current Location & Delay Baseline',
      desc: 'Observe: Current Delay +8 min, Baseline ETA 18:38 (Schedule + Delay formula), Dynamic ETA 18:38 initially.',
      actionLabel: 'Focus Forecast Card',
      run: () => {
        setActiveTab('eta-forecast');
      },
    },
    {
      step: 3,
      title: 'Inspect "Why Did ETA Change?" Decomposition',
      desc: 'Demonstrate explainable attribution: Current passing delay +8m, Speed restriction 0m, Dwell 0m, Recovery -2m.',
      actionLabel: 'View Explanation',
      run: () => {
        setActiveTab('eta-forecast');
      },
    },
    {
      step: 4,
      title: 'Trigger: Temporary Speed Restriction (TSR 60 km/h)',
      desc: 'Simulate a 60 km/h speed order at KM 142.4. Watch ETA automatically update to 18:42 (+4 min impact).',
      actionLabel: 'Trigger TSR Event',
      run: async () => {
        await simulateEvent('TEMPORARY_SPEED_RESTRICTION', 'Temporary Speed Restriction (60 km/h)', 3);
        setActiveTab('overview');
      },
    },
    {
      step: 5,
      title: 'Open Drone Inspection Module',
      desc: 'Inspect DRONE-01 Gwalior South. Note that drone is an infrastructure intelligence source, not ETA predictor.',
      actionLabel: 'Open Drone Module',
      run: () => {
        setActiveTab('drone');
      },
    },
    {
      step: 6,
      title: 'Send Drone Anomaly Constraint to ETA Engine',
      desc: 'Click "Send Constraint to ETA Engine". System translates LiDAR defect into operational TSR, recalculating dynamic ETA to 18:42.',
      actionLabel: 'Send Drone Constraint',
      run: async () => {
        await triggerDroneConstraint();
        setActiveTab('overview');
      },
    },
    {
      step: 7,
      title: 'Inspect Affected Stations Timeline',
      desc: 'See station-wise propagation: Morena (+2m), Dholpur (+3m), Agra Cantt (+4m, 19:34).',
      actionLabel: 'View Station Table',
      run: () => {
        setActiveTab('overview');
      },
    },
    {
      step: 8,
      title: 'Open Passenger Alert Hub & Switch to Passenger Mode',
      desc: 'Verify automated push alert: Previous ETA 18:38 → Updated ETA 18:42, Reason: Temporary speed restriction, Alternative: Train 12952.',
      actionLabel: 'View Passenger Alert',
      run: () => {
        setMode('PASSENGER');
      },
    },
    {
      step: 9,
      title: 'Open Analytics & Model Evaluation',
      desc: 'Show simulated benchmarking: ETA MAE 3.8 min vs Baseline 9.4 min (-59% error), 89.2% within ±5 min.',
      actionLabel: 'Open Analytics',
      run: () => {
        setMode('OPERATIONS');
        setActiveTab('analytics');
      },
    },
  ];

  const currentStep = demoSteps[currentStepIndex];

  const handleRunAndNext = async () => {
    await currentStep.run();
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 dark:text-white transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                90-SECOND JUDGE DEMONSTRATION GUIDE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SIH26028 • Real-Time Train State → Event Intelligence → Dynamic ETA → Action
              </p>
            </div>
          </div>
          <button
            onClick={() => setDemoModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Step Focus */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/30">
          <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold mb-2">
            <span>STEP {currentStep.step} OF {demoSteps.length}</span>
            <span>Focus: Train {selectedTrain.number} (AP Superfast Express)</span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {currentStep.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {currentStep.desc}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-850 flex items-center justify-between">
            <button
              onClick={() => {
                resetToInitial();
                setCurrentStepIndex(0);
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Baseline
            </button>

            <button
              onClick={handleRunAndNext}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Quick Jump List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {demoSteps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                s.run();
              }}
              className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between ${
                currentStepIndex === idx
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-500/50 text-indigo-800 dark:text-indigo-200 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] w-5 text-slate-400">
                  #{s.step}
                </span>
                <span>{s.title}</span>
              </div>
              {currentStepIndex > idx && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
