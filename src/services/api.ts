import {
  INITIAL_TRAINS,
  INITIAL_OPERATIONAL_EVENTS,
  INITIAL_PASSENGER_ALERTS,
  INITIAL_DRONE_TELEMETRY,
} from '../data/initialData';
import { recalculateTrainForecast } from '../utils/etaEngine';
import { Train, OperationalEvent, PassengerAlert, DroneTelemetry } from '../types';

// In-memory client fallback cache in case of direct static execution
let fallbackTrains = JSON.parse(JSON.stringify(INITIAL_TRAINS)) as Train[];
let fallbackEvents = JSON.parse(JSON.stringify(INITIAL_OPERATIONAL_EVENTS)) as OperationalEvent[];
let fallbackAlerts = JSON.parse(JSON.stringify(INITIAL_PASSENGER_ALERTS)) as PassengerAlert[];
let fallbackDrone = { ...INITIAL_DRONE_TELEMETRY };

export const apiService = {
  async getTrains(): Promise<Train[]> {
    try {
      const res = await fetch('/api/trains');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) return json.data;
      }
    } catch {
      // offline / client fallback
    }
    return fallbackTrains;
  },

  async getTrainById(id: string): Promise<Train | null> {
    try {
      const res = await fetch(`/api/trains/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // offline / client fallback
    }
    return fallbackTrains.find((t) => t.id === id || t.number === id) || null;
  },

  async getETA(trainId: string) {
    try {
      const res = await fetch(`/api/eta/${trainId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline fallback
    }
    const train = fallbackTrains.find((t) => t.id === trainId || t.number === trainId);
    if (!train) return null;
    return {
      success: true,
      trainNumber: train.number,
      trainName: train.name,
      baselineETA: train.baselineETA,
      dynamicETA: train.dynamicETA,
      confidenceRange: train.confidenceRange,
      confidencePercent: train.confidencePercent,
      etaAdjustmentMinutes: train.etaAdjustmentMinutes,
      factors: train.factors,
      stationForecasts: train.stops,
      lastUpdatedSecondsAgo: train.lastUpdatedSecondsAgo,
    };
  },

  async getEvents(): Promise<OperationalEvent[]> {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) return json.data;
      }
    } catch {
      // offline fallback
    }
    return fallbackEvents;
  },

  async postEvent(eventData: Partial<OperationalEvent>): Promise<{ success: boolean; event: OperationalEvent }> {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, event: json.event };
      }
    } catch {
      // offline fallback
    }

    const newEvt: OperationalEvent = {
      id: `EVT-${Date.now()}`,
      eventType: eventData.eventType || 'TEMPORARY_SPEED_RESTRICTION',
      title: eventData.title || 'Operational Constraint',
      description: eventData.description || 'Sectional event',
      location: eventData.location || 'KM 142.4, Gwalior South',
      severity: eventData.severity || 'HIGH',
      delayImpactMinutes: eventData.delayImpactMinutes || 3,
      affectedTrainIds: eventData.affectedTrainIds || ['12806'],
      affectedStationCount: 3,
      active: true,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      source: 'CONTROL_OFFICE',
    };
    fallbackEvents.unshift(newEvt);

    // Recalculate fallback trains
    fallbackTrains = fallbackTrains.map((t) => recalculateTrainForecast(t, fallbackEvents, '19:30'));

    return { success: true, event: newEvt };
  },

  async postDroneEvent(dronePayload: {
    droneId: string;
    location: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    eventType: string;
    speedRestriction: number;
    estimatedDuration: number;
  }) {
    try {
      const res = await fetch('/api/drone-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dronePayload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // offline fallback
    }

    // Update fallback drone
    fallbackDrone = {
      ...fallbackDrone,
      droneId: dronePayload.droneId,
      location: dronePayload.location,
      severity: dronePayload.severity,
      speedRestriction: dronePayload.speedRestriction,
      operationalEffect: `Temporary speed restriction ${dronePayload.speedRestriction} km/h`,
      estimatedDurationMinutes: dronePayload.estimatedDuration,
      status: 'INSPECTION COMPLETE',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
    };

    // Activate TSR on fallback
    let tsrEvent = fallbackEvents.find((e) => e.eventType === 'TEMPORARY_SPEED_RESTRICTION' || e.eventType === 'DRONE_DETECTED_ANOMALY');
    if (!tsrEvent) {
      tsrEvent = {
        id: 'DRONE-EVT-01',
        eventType: 'DRONE_DETECTED_ANOMALY',
        title: `Drone Detected Anomaly (TSR ${dronePayload.speedRestriction} km/h)`,
        description: `Automated aerial survey flagged track void at ${dronePayload.location}. Imposed TSR constraint.`,
        location: dronePayload.location,
        severity: dronePayload.severity,
        speedRestrictionKm: dronePayload.speedRestriction,
        delayImpactMinutes: 3,
        affectedTrainIds: ['12806', '12002', '22470'],
        affectedStationCount: 3,
        active: true,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        source: 'DRONE',
      };
      fallbackEvents.unshift(tsrEvent);
    } else {
      tsrEvent.active = true;
      tsrEvent.delayImpactMinutes = 3;
    }

    fallbackTrains = fallbackTrains.map((t) => recalculateTrainForecast(t, fallbackEvents, '19:30'));

    const updatedFocus = fallbackTrains.find((t) => t.id === '12806');
    const newAlert: PassengerAlert = {
      id: `ALT-12806-${Date.now()}`,
      trainNumber: '12806',
      trainName: 'AP Superfast Express',
      passengerName: 'Aarav Sharma',
      pnr: '2458910234',
      origin: 'Gwalior (GWL)',
      destination: 'Agra Cantt (AGC)',
      previousEta: '18:38',
      updatedEta: updatedFocus ? updatedFocus.dynamicETA : '18:42',
      delayMinutes: updatedFocus ? updatedFocus.etaAdjustmentMinutes : 4,
      reason: 'Temporary speed restriction (60 km/h) detected via Drone inspection at KM 142.4',
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
    fallbackAlerts.unshift(newAlert);

    return {
      success: true,
      message: 'Drone constraint dispatched to ETA Engine. ETAs updated dynamically.',
      droneTelemetry: fallbackDrone,
      recalculatedETA: updatedFocus ? updatedFocus.dynamicETA : '18:42',
      adjustmentMinutes: updatedFocus ? updatedFocus.etaAdjustmentMinutes : 4,
      confidence: updatedFocus ? updatedFocus.confidencePercent : 91,
      affectedTrainsCount: 3,
    };
  },

  async getAlerts(): Promise<PassengerAlert[]> {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) return json.data;
      }
    } catch {
      // offline fallback
    }
    return fallbackAlerts;
  },

  async getDroneTelemetry(): Promise<DroneTelemetry> {
    try {
      const res = await fetch('/api/drone');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // offline fallback
    }
    return fallbackDrone;
  },
};
