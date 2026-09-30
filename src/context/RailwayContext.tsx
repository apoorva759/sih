import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Train,
  OperationalEvent,
  DroneTelemetry,
  PassengerAlert,
  ModelMetrics,
  User,
} from '../types';
import {
  INITIAL_TRAINS,
  INITIAL_OPERATIONAL_EVENTS,
  INITIAL_PASSENGER_ALERTS,
  INITIAL_DRONE_TELEMETRY,
  INITIAL_MODEL_METRICS,
} from '../data/initialData';
import { DEMO_USERS } from '../data/authData';
import { recalculateTrainForecast } from '../utils/etaEngine';
import { apiService } from '../services/api';

export type AppMode = 'OPERATIONS' | 'PASSENGER';
export type ThemeMode = 'dark' | 'light';

interface RailwayContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'LOGIN' | 'SIGNUP';
  setAuthMode: (mode: 'LOGIN' | 'SIGNUP') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  trains: Train[];
  selectedTrain: Train;
  setSelectedTrainId: (trainId: string) => void;
  events: OperationalEvent[];
  alerts: PassengerAlert[];
  droneTelemetry: DroneTelemetry;
  modelMetrics: ModelMetrics;
  isStale: boolean;
  toggleStaleMode: () => void;
  dataFreshnessSeconds: number;
  isRecalculating: boolean;
  lastUpdateReason: string;
  recalculationNotification: {
    visible: boolean;
    beforeEta: string;
    afterEta: string;
    impactMinutes: number;
    affectedStationCount: number;
    reason: string;
  } | null;
  dismissRecalculationNotification: () => void;
  demoModalOpen: boolean;
  setDemoModalOpen: (open: boolean) => void;
  simulateEventModalOpen: boolean;
  setSimulateEventModalOpen: (open: boolean) => void;
  simulateEvent: (
    eventType: OperationalEvent['eventType'],
    title?: string,
    delayImpact?: number
  ) => Promise<void>;
  triggerDroneConstraint: () => Promise<void>;
  recalculateNow: () => void;
  resetToInitial: () => void;
  subscribedTrainIds: string[];
  toggleTrainSubscription: (trainId: string) => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

export const RailwayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('OPERATIONS');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Theme Mode: Dark by default (Railway Control Room), toggleable to Light
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('raileta_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('raileta_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEMO_USERS[0]; // Default logged-in as Chief Section Controller
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Sync theme with HTML class attribute
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('raileta_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('raileta_user', JSON.stringify(user));
    // Auto switch app mode based on role
    if (user.role === 'PASSENGER') {
      setMode('PASSENGER');
      if (user.subscribedTrainNumber) {
        setSelectedTrainIdState(user.subscribedTrainNumber);
      }
    } else {
      setMode('OPERATIONS');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('raileta_user');
  };

  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrainId, setSelectedTrainIdState] = useState<string>('12806');
  const [events, setEvents] = useState<OperationalEvent[]>(INITIAL_OPERATIONAL_EVENTS);
  const [alerts, setAlerts] = useState<PassengerAlert[]>(INITIAL_PASSENGER_ALERTS);
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetry>(INITIAL_DRONE_TELEMETRY);
  const [modelMetrics] = useState<ModelMetrics>(INITIAL_MODEL_METRICS);

  const [isStale, setIsStale] = useState<boolean>(false);
  const [dataFreshnessSeconds, setDataFreshnessSeconds] = useState<number>(12);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [lastUpdateReason, setLastUpdateReason] = useState<string>('Initial synchronization');

  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [simulateEventModalOpen, setSimulateEventModalOpen] = useState<boolean>(false);

  const [recalculationNotification, setRecalculationNotification] = useState<{
    visible: boolean;
    beforeEta: string;
    afterEta: string;
    impactMinutes: number;
    affectedStationCount: number;
    reason: string;
  } | null>(null);

  const [subscribedTrainIds, setSubscribedTrainIds] = useState<string[]>(['12806']);

  // Timer for second-by-second data freshness counter
  useEffect(() => {
    const timer = setInterval(() => {
      setDataFreshnessSeconds((prev) => (isStale ? 120 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isStale]);

  // Initial load from backend API
  useEffect(() => {
    async function loadData() {
      const remoteTrains = await apiService.getTrains();
      if (remoteTrains && remoteTrains.length > 0) {
        setTrains(remoteTrains);
      }
      const remoteEvents = await apiService.getEvents();
      if (remoteEvents && remoteEvents.length > 0) {
        setEvents(remoteEvents);
      }
      const remoteAlerts = await apiService.getAlerts();
      if (remoteAlerts && remoteAlerts.length > 0) {
        setAlerts(remoteAlerts);
      }
      const remoteDrone = await apiService.getDroneTelemetry();
      if (remoteDrone) {
        setDroneTelemetry(remoteDrone);
      }
    }
    loadData();
  }, []);

  const selectedTrain =
    trains.find((t) => t.id === selectedTrainId || t.number === selectedTrainId) || trains[0];

  const setSelectedTrainId = (id: string) => {
    setSelectedTrainIdState(id);
  };

  const toggleStaleMode = () => {
    setIsStale((prev) => !prev);
    if (!isStale) {
      setDataFreshnessSeconds(120);
    } else {
      setDataFreshnessSeconds(4);
    }
  };

  const dismissRecalculationNotification = () => {
    setRecalculationNotification(null);
  };

  const toggleTrainSubscription = (trainId: string) => {
    setSubscribedTrainIds((prev) =>
      prev.includes(trainId) ? prev.filter((id) => id !== trainId) : [...prev, trainId]
    );
  };

  // Recalculates all trains deterministically based on active events
  const recalculateTrainStates = useCallback(
    (currentEvents: OperationalEvent[], reasonText: string) => {
      setIsRecalculating(true);
      const beforeTrain = trains.find((t) => t.id === '12806');
      const beforeEta = beforeTrain ? beforeTrain.dynamicETA : '18:38';

      // Deterministic calculation for all trains
      const updatedTrains = trains.map((t) => {
        return recalculateTrainForecast(t, currentEvents, '19:30');
      });

      const updatedFocus = updatedTrains.find((t) => t.id === '12806');
      const afterEta = updatedFocus ? updatedFocus.dynamicETA : '18:42';
      const adjustment = updatedFocus ? updatedFocus.etaAdjustmentMinutes : 4;

      setTrains(updatedTrains);
      setDataFreshnessSeconds(1);
      setLastUpdateReason(reasonText);

      // Create new passenger alert
      if (updatedFocus) {
        const newAlert: PassengerAlert = {
          id: `ALT-12806-${Date.now()}`,
          trainNumber: '12806',
          trainName: 'AP Superfast Express',
          passengerName: 'Aarav Sharma',
          pnr: '2458910234',
          origin: 'Gwalior (GWL)',
          destination: 'Agra Cantt (AGC)',
          previousEta: beforeEta,
          updatedEta: afterEta,
          delayMinutes: adjustment,
          reason: reasonText,
          status: 'Updated automatically',
          timestampSecondsAgo: 1,
          alternativeTrain: {
            number: '12952',
            name: 'Mumbai Rajdhani Express',
            departure: '18:50',
            estimatedArrival: '19:25',
            reason: 'On-time corridor slot, bypasses slow section via Up chord',
          },
        };

        setAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
      }

      // Show animated BEFORE vs AFTER banner
      setRecalculationNotification({
        visible: true,
        beforeEta,
        afterEta,
        impactMinutes: adjustment > 0 ? adjustment : 4,
        affectedStationCount: 3,
        reason: reasonText,
      });

      setTimeout(() => {
        setIsRecalculating(false);
      }, 700);
    },
    [trains]
  );

  // Trigger Drone Constraint flow:
  // Drone anomaly -> Operational constraint -> ETA Engine -> Recalculate ETA -> Passenger + Ops Alert
  const triggerDroneConstraint = async () => {
    setIsRecalculating(true);

    const payload = {
      droneId: 'DRONE-01',
      location: 'KM 142.4',
      severity: 'HIGH' as const,
      eventType: 'INFRASTRUCTURE_ANOMALY',
      speedRestriction: 60,
      estimatedDuration: 30,
    };

    // Update drone state
    setDroneTelemetry((prev) => ({
      ...prev,
      status: 'INSPECTION COMPLETE',
      operationalEffect: 'Temporary speed restriction 60 km/h',
      speedRestriction: 60,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
    }));

    // Activate the TSR event in operational events
    const updatedEvents = events.map((e) => {
      if (e.eventType === 'TEMPORARY_SPEED_RESTRICTION' || e.eventType === 'DRONE_DETECTED_ANOMALY') {
        return {
          ...e,
          active: true,
          delayImpactMinutes: 3,
          description: 'Autonomous drone flagged rail void at KM 142.4. Imposed TSR 60 km/h constraint.',
        };
      }
      return e;
    });

    setEvents(updatedEvents);

    // Call API endpoint
    await apiService.postDroneEvent(payload);

    recalculateTrainStates(
      updatedEvents,
      'Drone Detected Anomaly: Temporary Speed Restriction 60 km/h at KM 142.4'
    );
  };

  // Simulate an operational event from the dropdown options
  const simulateEvent = async (
    eventType: OperationalEvent['eventType'],
    customTitle?: string,
    delayImpact?: number
  ) => {
    const updatedEvents = events.map((e) => {
      if (e.eventType === eventType) {
        return {
          ...e,
          active: true,
          title: customTitle || e.title,
          delayImpactMinutes: delayImpact !== undefined ? delayImpact : e.delayImpactMinutes,
        };
      }
      return e;
    });

    // If event wasn't in list, add it
    const exists = updatedEvents.some((e) => e.eventType === eventType);
    if (!exists) {
      const newEvt: OperationalEvent = {
        id: `EVT-${Date.now()}`,
        eventType,
        title: customTitle || 'Simulated Event',
        description: 'Operational condition injected into ETA engine.',
        location: 'GWL - AGC Corridor Section',
        severity: 'HIGH',
        delayImpactMinutes: delayImpact || 3,
        affectedTrainIds: ['12806', '12002'],
        affectedStationCount: 3,
        active: true,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        source: 'CONTROL_OFFICE',
      };
      updatedEvents.unshift(newEvt);
    }

    setEvents(updatedEvents);

    // Dispatch to API
    await apiService.postEvent({
      eventType,
      title: customTitle,
      delayImpactMinutes: delayImpact,
      affectedTrainIds: ['12806'],
    });

    const labelMap: Record<string, string> = {
      TEMPORARY_SPEED_RESTRICTION: 'Temporary Speed Restriction (60 km/h)',
      DRONE_DETECTED_ANOMALY: 'Drone Detected Track Anomaly',
      PRECEDING_TRAIN_DELAY: 'Preceding Train Headway Regulation (+3 min)',
      DOWNSTREAM_CONGESTION: 'Downstream Interlocking Yard Congestion (+2 min)',
      UNSCHEDULED_STOP: 'Unscheduled Halt at Outer Home (+4 min)',
      STATION_DWELL_INCREASE: 'Heavy Passenger Rush Dwell Extension (+1 min)',
      WEATHER_IMPACT: 'Dense Fog Advisory Speed Restriction (+2 min)',
      INFRASTRUCTURE_ALERT: 'Track Maintenance Block Constraint (+3 min)',
    };

    recalculateTrainStates(updatedEvents, labelMap[eventType] || 'Operational condition change');
  };

  const recalculateNow = () => {
    recalculateTrainStates(events, 'Manual recalculation trigger');
  };

  const resetToInitial = () => {
    setTrains(INITIAL_TRAINS);
    setEvents(INITIAL_OPERATIONAL_EVENTS.map((e) => ({ ...e, active: false })));
    setAlerts(INITIAL_PASSENGER_ALERTS);
    setDroneTelemetry(INITIAL_DRONE_TELEMETRY);
    setSelectedTrainIdState('12806');
    setDataFreshnessSeconds(12);
    setLastUpdateReason('Corridor simulation reset to baseline');
    setRecalculationNotification(null);
  };

  return (
    <RailwayContext.Provider
      value={{
        mode,
        setMode,
        theme,
        toggleTheme,
        currentUser,
        login,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        activeTab,
        setActiveTab,
        trains,
        selectedTrain,
        setSelectedTrainId,
        events,
        alerts,
        droneTelemetry,
        modelMetrics,
        isStale,
        toggleStaleMode,
        dataFreshnessSeconds,
        isRecalculating,
        lastUpdateReason,
        recalculationNotification,
        dismissRecalculationNotification,
        demoModalOpen,
        setDemoModalOpen,
        simulateEventModalOpen,
        setSimulateEventModalOpen,
        simulateEvent,
        triggerDroneConstraint,
        recalculateNow,
        resetToInitial,
        subscribedTrainIds,
        toggleTrainSubscription,
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
};

export function useRailway() {
  const context = useContext(RailwayContext);
  if (!context) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  return context;
}
