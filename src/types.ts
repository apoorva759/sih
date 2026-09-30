export type TrainStatus = 'ON_TIME' | 'SLIGHT_DELAY' | 'DELAYED' | 'HIGH_UNCERTAINTY';

export interface StationStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string; // e.g., "18:22"
  scheduledDeparture: string;
  predictedArrival: string; // dynamic ETA e.g. "18:24"
  predictedDeparture: string;
  delayMinutes: number; // positive = delay, negative = early
  confidence: number; // percentage, e.g., 91
  status: 'DEPARTED' | TrainStatus;
  platform?: string;
  distanceKm: number;
}

export interface ETAFactors {
  currentDelay: number; // base delay (e.g. +8 min)
  speedRestriction: number; // TSR impact (e.g. +3 min)
  expectedDwell: number; // Dwell behavior (e.g. +1 min)
  delayRecovery: number; // In-built sectional recovery (e.g. -2 min)
  congestion: number; // Downstream headway/congestion (e.g. +2 min)
  weatherImpact: number; // Weather/fog impact (e.g. 0 min)
  unscheduledStop: number; // Unscheduled stoppage (e.g. 0 min)
  netAdjustment: number; // Predicted ETA adjustment from baseline (e.g. +4 min)
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: 'Vande Bharat' | 'Rajdhani' | 'Shatabdi' | 'Superfast' | 'Express' | 'Duronto' | 'Gatimaan';
  origin: string;
  destination: string;
  currentSection: string; // e.g. "Gwalior (GWL) → Morena (MRA)"
  currentKM: number; // e.g. 142.4
  currentSpeed: number; // km/h
  scheduledSpeed: number; // km/h
  currentDelayMinutes: number; // e.g. 8
  baselineETA: string; // e.g. "18:38" (Schedule + Current Delay)
  dynamicETA: string; // e.g. "18:42" (Dynamic calculation)
  confidenceRange: string; // e.g. "18:40–18:45"
  confidencePercent: number; // e.g. 91%
  etaAdjustmentMinutes: number; // e.g. +4
  status: TrainStatus;
  lastUpdatedSecondsAgo: number;
  factors: ETAFactors;
  stops: StationStop[];
  hasInfrastructureAlert?: boolean;
}

export interface OperationalEvent {
  id: string;
  eventType: 
    | 'TEMPORARY_SPEED_RESTRICTION'
    | 'DRONE_DETECTED_ANOMALY'
    | 'PRECEDING_TRAIN_DELAY'
    | 'DOWNSTREAM_CONGESTION'
    | 'UNSCHEDULED_STOP'
    | 'STATION_DWELL_INCREASE'
    | 'WEATHER_IMPACT'
    | 'INFRASTRUCTURE_ALERT';
  title: string;
  description: string;
  location: string; // e.g., "KM 142.4, Gwalior South"
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  speedRestrictionKm?: number;
  delayImpactMinutes: number;
  affectedTrainIds: string[];
  affectedStationCount: number;
  active: boolean;
  timestamp: string;
  source: 'DRONE' | 'CONTROL_OFFICE' | 'LOCO_TELEMETRY' | 'TRACK_SENSOR' | 'METEOROLOGICAL';
}

export interface DroneTelemetry {
  droneId: string;
  sector: string;
  location: string;
  status: 'INSPECTION COMPLETE' | 'PATROLLING' | 'TRANSMITTING' | 'CALIBRATING';
  detectedAnomaly: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  operationalEffect: string; // e.g. "Temporary speed restriction 60 km/h"
  speedRestriction: number; // km/h
  estimatedDurationMinutes: number;
  batteryPercent: number;
  altitudeMeters: number;
  timestamp: string;
}

export interface PassengerAlert {
  id: string;
  trainNumber: string;
  trainName: string;
  passengerName?: string;
  pnr?: string;
  origin: string;
  destination: string;
  previousEta: string; // e.g. "18:38"
  updatedEta: string; // e.g. "18:42"
  delayMinutes: number;
  reason: string;
  status: 'Updated automatically' | 'Active monitoring' | 'Resolved';
  timestampSecondsAgo: number;
  alternativeTrain?: {
    number: string;
    name: string;
    departure: string;
    estimatedArrival: string;
    reason: string;
  };
}

export interface ModelMetrics {
  maeMinutes: number; // Mean Absolute Error e.g. 3.8
  rmseMinutes: number; // e.g. 4.9
  pctWithin5Min: number; // e.g. 89.2%
  pctWithin10Min: number; // e.g. 97.4%
  updateLatencyMs: number; // e.g. 142 ms
  forecastCoveragePct: number; // 100%
  baselineMaeMinutes: number; // e.g. 9.4 min
}

export type UserRole = 'OPERATIONS_CONTROLLER' | 'TRACK_ENGINEER' | 'PASSENGER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  division: string;
  employeeIdOrPnr: string;
  avatarInitials: string;
  avatarBg: string;
  phone?: string;
  subscribedTrainNumber?: string;
}

