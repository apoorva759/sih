import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_TRAINS,
  INITIAL_OPERATIONAL_EVENTS,
  INITIAL_PASSENGER_ALERTS,
  INITIAL_DRONE_TELEMETRY,
} from './src/data/initialData';
import { recalculateTrainForecast } from './src/utils/etaEngine';
import { OperationalEvent, PassengerAlert, Train } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory operational state
let trains: Train[] = JSON.parse(JSON.stringify(INITIAL_TRAINS));
let events: OperationalEvent[] = JSON.parse(JSON.stringify(INITIAL_OPERATIONAL_EVENTS));
let alerts: PassengerAlert[] = JSON.parse(JSON.stringify(INITIAL_PASSENGER_ALERTS));
let droneTelemetry = { ...INITIAL_DRONE_TELEMETRY };

// Recalculates all affected trains when events change
function triggerNetworkETARecalculation(reasonStr: string) {
  trains = trains.map((t) => {
    return recalculateTrainForecast(t, events, '19:30');
  });

  const focusTrain = trains.find((t) => t.id === '12806');
  if (focusTrain) {
    // Generate or update passenger alert
    const existingIndex = alerts.findIndex((a) => a.trainNumber === '12806');
    const newAlert: PassengerAlert = {
      id: `ALT-12806-${Date.now()}`,
      trainNumber: '12806',
      trainName: focusTrain.name,
      passengerName: 'Aarav Sharma',
      pnr: '2458910234',
      origin: 'Gwalior (GWL)',
      destination: 'Agra Cantt (AGC)',
      previousEta: '18:38',
      updatedEta: focusTrain.dynamicETA,
      delayMinutes: focusTrain.etaAdjustmentMinutes || 4,
      reason: reasonStr,
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

    if (existingIndex >= 0) {
      alerts[existingIndex] = newAlert;
    } else {
      alerts.unshift(newAlert);
    }
  }
}

// REST API Endpoints
app.get('/api/trains', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: trains.length,
    environment: 'SIMULATED_ENVIRONMENT',
    data: trains,
  });
});

app.get('/api/trains/:id', (req: Request, res: Response) => {
  const train = trains.find((t) => t.id === req.params.id || t.number === req.params.id);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }
  res.json({ success: true, data: train });
});

app.get('/api/eta/:trainId', (req: Request, res: Response) => {
  const train = trains.find((t) => t.id === req.params.trainId || t.number === req.params.trainId);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }

  res.json({
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
  });
});

app.get('/api/events', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: events.length,
    activeCount: events.filter((e) => e.active).length,
    data: events,
  });
});

app.post('/api/events', (req: Request, res: Response) => {
  const { eventType, title, location, delayImpactMinutes, affectedTrainIds, description } = req.body;

  const newEvent: OperationalEvent = {
    id: `EVT-${Date.now()}`,
    eventType: eventType || 'TEMPORARY_SPEED_RESTRICTION',
    title: title || 'Operational Constraint',
    description: description || 'Operational event impacting sectional velocity',
    location: location || 'KM 142.4, Gwalior South',
    severity: 'HIGH',
    delayImpactMinutes: delayImpactMinutes !== undefined ? Number(delayImpactMinutes) : 3,
    affectedTrainIds: affectedTrainIds || ['12806'],
    affectedStationCount: 3,
    active: true,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    source: 'CONTROL_OFFICE',
  };

  events.unshift(newEvent);
  triggerNetworkETARecalculation(newEvent.title);

  res.json({
    success: true,
    message: 'Event registered and ETA recalculated',
    event: newEvent,
    trains: trains.filter((t) => newEvent.affectedTrainIds.includes(t.id)),
  });
});

// Drone Event Endpoint (As explicitly specified in Problem Statement prompt)
app.post('/api/drone-event', (req: Request, res: Response) => {
  const { droneId, location, severity, eventType, speedRestriction, estimatedDuration } = req.body;

  droneTelemetry = {
    ...droneTelemetry,
    droneId: droneId || 'DRONE-01',
    location: location || 'KM 142.4',
    severity: severity || 'HIGH',
    status: 'INSPECTION COMPLETE',
    speedRestriction: speedRestriction || 60,
    operationalEffect: `Temporary speed restriction ${speedRestriction || 60} km/h`,
    estimatedDurationMinutes: estimatedDuration || 30,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
  };

  // Convert drone anomaly into operational constraint
  const droneEvent: OperationalEvent = {
    id: `DRONE-EVT-${Date.now()}`,
    eventType: 'DRONE_DETECTED_ANOMALY',
    title: `Drone Detected Anomaly (TSR ${speedRestriction || 60} km/h)`,
    description: `Automated aerial survey flagged track void at ${location || 'KM 142.4'}. Imposed TSR constraint.`,
    location: location || 'KM 142.4',
    severity: severity || 'HIGH',
    speedRestrictionKm: speedRestriction || 60,
    delayImpactMinutes: 3, // Calculated sectional deceleration penalty
    affectedTrainIds: ['12806', '12002', '22470'],
    affectedStationCount: 3,
    active: true,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    source: 'DRONE',
  };

  // Toggle corresponding TSR event in active events
  const existingTsr = events.find((e) => e.eventType === 'TEMPORARY_SPEED_RESTRICTION' || e.eventType === 'DRONE_DETECTED_ANOMALY');
  if (existingTsr) {
    existingTsr.active = true;
    existingTsr.delayImpactMinutes = 3;
  } else {
    events.unshift(droneEvent);
  }

  triggerNetworkETARecalculation(`Drone Anomaly at ${location || 'KM 142.4'} - Speed restriction 60 km/h`);

  const updatedFocusTrain = trains.find((t) => t.id === '12806');

  res.json({
    success: true,
    message: 'Drone constraint dispatched to ETA Engine. ETAs updated dynamically.',
    droneTelemetry,
    recalculatedETA: updatedFocusTrain ? updatedFocusTrain.dynamicETA : '18:42',
    adjustmentMinutes: updatedFocusTrain ? updatedFocusTrain.etaAdjustmentMinutes : 4,
    confidence: updatedFocusTrain ? updatedFocusTrain.confidencePercent : 91,
    affectedTrainsCount: 3,
  });
});

app.get('/api/alerts', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: alerts.length,
    data: alerts,
  });
});

app.get('/api/drone', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: droneTelemetry,
  });
});

// Start Express server and mount Vite or serve static dist
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAILETA AI backend service listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
