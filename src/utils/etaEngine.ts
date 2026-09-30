import { ETAFactors, StationStop, Train, OperationalEvent, TrainStatus } from '../types';

/**
 * Utility to parse time string "HH:MM" into total minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Utility to convert total minutes from midnight back into "HH:MM" format
 */
export function minutesToTime(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Add or subtract minutes from a time string
 */
export function adjustTime(timeStr: string, deltaMinutes: number): string {
  const current = timeToMinutes(timeStr);
  return minutesToTime(current + deltaMinutes);
}

/**
 * Deterministic calculation of ETA Factors for a train given active events
 */
export function calculateETAFactors(
  train: Train,
  activeEvents: OperationalEvent[]
): ETAFactors {
  const relevantEvents = activeEvents.filter(
    (e) => e.active && (e.affectedTrainIds.includes(train.id) || e.affectedTrainIds.includes('ALL'))
  );

  let speedRestriction = 0;
  let expectedDwell = 0;
  let delayRecovery = 0;
  let congestion = 0;
  let weatherImpact = 0;
  let unscheduledStop = 0;

  // Evaluate operational conditions from active events
  for (const event of relevantEvents) {
    switch (event.eventType) {
      case 'TEMPORARY_SPEED_RESTRICTION':
      case 'DRONE_DETECTED_ANOMALY':
      case 'INFRASTRUCTURE_ALERT':
        speedRestriction += event.delayImpactMinutes;
        break;
      case 'STATION_DWELL_INCREASE':
        expectedDwell += event.delayImpactMinutes;
        break;
      case 'DOWNSTREAM_CONGESTION':
      case 'PRECEDING_TRAIN_DELAY':
        congestion += event.delayImpactMinutes;
        break;
      case 'WEATHER_IMPACT':
        weatherImpact += event.delayImpactMinutes;
        break;
      case 'UNSCHEDULED_STOP':
        unscheduledStop += event.delayImpactMinutes;
        break;
    }
  }

  // Built-in recovery allowance for coaching trains (Indian Railways timetable slack)
  // Express/Superfast trains have 2-4 minutes of recovery buffer in long sections
  if (train.currentDelayMinutes > 5) {
    delayRecovery = 2; // Can recover 2 minutes on clear downstream sections
  }

  // If no external events are active on this train, check default factors
  if (relevantEvents.length === 0) {
    return {
      currentDelay: train.currentDelayMinutes,
      speedRestriction: 0,
      expectedDwell: 0,
      delayRecovery: 0,
      congestion: 0,
      weatherImpact: 0,
      unscheduledStop: 0,
      netAdjustment: 0,
    };
  }

  // Predicted ETA adjustment: additional delay expected beyond current delay
  // netAdjustment = (TSR + dwell + congestion + weather + unscheduled) - recovery
  const netAdjustment =
    speedRestriction +
    expectedDwell +
    congestion +
    weatherImpact +
    unscheduledStop -
    delayRecovery;

  return {
    currentDelay: train.currentDelayMinutes,
    speedRestriction,
    expectedDwell,
    delayRecovery,
    congestion,
    weatherImpact,
    unscheduledStop,
    netAdjustment,
  };
}

/**
 * Predict station-wise ETA and confidence for all upcoming stops
 */
export function calculateStationForecasts(
  stops: StationStop[],
  factors: ETAFactors,
  trainScheduledArrival: string
): { updatedStops: StationStop[]; finalDynamicETA: string; confidenceRange: string; confidencePercent: number } {
  let accumulatedAdjustment = factors.netAdjustment;
  let finalDynamicETA = trainScheduledArrival;
  let confidencePercent = 91;

  const updatedStops = stops.map((stop, index) => {
    if (stop.status === 'DEPARTED') {
      return { ...stop };
    }

    // Dynamic arrival is scheduled + base current delay + portion of net adjustment that occurs before this stop
    // Station stops later down the line accumulate more of the network effect
    const stopFraction = (index + 1) / stops.length;
    const stopAdjustment = Math.round(accumulatedAdjustment * stopFraction);
    const totalDelay = factors.currentDelay + stopAdjustment;

    const predictedArrival = adjustTime(stop.scheduledArrival, totalDelay);
    const predictedDeparture = adjustTime(stop.scheduledDeparture, totalDelay);

    // Confidence degrades with distance and uncertainty
    const stationConfidence = Math.max(70, Math.min(96, Math.round(94 - index * 1.5 - Math.abs(stopAdjustment) * 1.5)));

    // Categorize status
    let status: TrainStatus = 'ON_TIME';
    if (totalDelay > 15 || stationConfidence < 75) {
      status = 'HIGH_UNCERTAINTY';
    } else if (totalDelay > 5) {
      status = 'DELAYED';
    } else if (totalDelay > 0) {
      status = 'SLIGHT_DELAY';
    }

    // Track the final destination station ETA
    if (index === stops.length - 1) {
      finalDynamicETA = predictedArrival;
      confidencePercent = stationConfidence;
    }

    return {
      ...stop,
      predictedArrival,
      predictedDeparture,
      delayMinutes: totalDelay,
      confidence: stationConfidence,
      status,
    };
  });

  // Calculate confidence range [dynamicETA - delta, dynamicETA + delta]
  const uncertaintyMinutes = Math.max(2, Math.round((100 - confidencePercent) / 3));
  const rangeLower = adjustTime(finalDynamicETA, -uncertaintyMinutes);
  const rangeUpper = adjustTime(finalDynamicETA, uncertaintyMinutes);
  const confidenceRange = `${rangeLower}–${rangeUpper}`;

  return {
    updatedStops,
    finalDynamicETA,
    confidenceRange,
    confidencePercent,
  };
}

/**
 * Re-evaluates an entire train's ETA forecast when events change
 */
export function recalculateTrainForecast(
  train: Train,
  activeEvents: OperationalEvent[],
  destinationScheduledTime: string = '19:30'
): Train {
  const factors = calculateETAFactors(train, activeEvents);
  
  // Baseline ETA is static: Scheduled Arrival + Current Delay
  const baselineETA = adjustTime(destinationScheduledTime, train.currentDelayMinutes);

  const { updatedStops, finalDynamicETA, confidenceRange, confidencePercent } =
    calculateStationForecasts(train.stops, factors, destinationScheduledTime);

  // Overall status
  const totalProjectedDelay = train.currentDelayMinutes + factors.netAdjustment;
  let status: TrainStatus = 'ON_TIME';
  if (confidencePercent < 80) {
    status = 'HIGH_UNCERTAINTY';
  } else if (totalProjectedDelay > 10) {
    status = 'DELAYED';
  } else if (totalProjectedDelay > 0) {
    status = 'SLIGHT_DELAY';
  }

  const hasInfrastructureAlert = activeEvents.some(
    (e) => e.active && e.affectedTrainIds.includes(train.id) && 
    (e.eventType === 'DRONE_DETECTED_ANOMALY' || e.eventType === 'TEMPORARY_SPEED_RESTRICTION' || e.eventType === 'INFRASTRUCTURE_ALERT')
  );

  return {
    ...train,
    baselineETA,
    dynamicETA: finalDynamicETA,
    confidenceRange,
    confidencePercent,
    etaAdjustmentMinutes: factors.netAdjustment,
    status,
    factors,
    stops: updatedStops,
    hasInfrastructureAlert,
    lastUpdatedSecondsAgo: 1, // Freshly recalculated
  };
}
