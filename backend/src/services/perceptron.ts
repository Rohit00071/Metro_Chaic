import { PredictionInput, PerceptronWeights, TrainingRequest, TrainingResult, SegmentPredictionResult, RoutePredictionResult } from "../types/shared";

export const DEFAULT_WEIGHTS: PerceptronWeights = {
  wDistance: 1.2, // ~1.2 min per km
  wSpeed: -0.01,  // reduction in time as speed increases
  wDwell: 1.0,    // 1:1 on dwell time
  bias: 0.5       // basic constant overhead
};

export class PerceptronService {
  /**
   * Predict travel time for segments based on weights.
   */
  static predict(input: PredictionInput): RoutePredictionResult {
    const weights = input.weights || DEFAULT_WEIGHTS;
    const { startingClockTime, segments } = input;

    let cumulativeMinutes = 0;
    const segmentResults: SegmentPredictionResult[] = [];
    const stationResults: { stationName: string; arrivalMinutesFromStart: number; arrivalClockTime: string }[] = [];

    // Assuming we start at the first "from" station at 0 minutes
    // But usually segments start from station A to station B.
    // The very first Arrival is at the first 'to' station.
    
    // We need to know the name of the very first station
    const firstStationName = segments.length > 0 ? "Station Start" : "Unknown"; // We'll improve this if we have route data

    // Initial station result (start)
    stationResults.push({
      stationName: segments[0]?.fromStationId || "Start",
      arrivalMinutesFromStart: 0,
      arrivalClockTime: startingClockTime
    });

    for (const segment of segments) {
      const travelTime = this.calculateTravelTime(segment.distanceKm, segment.avgSpeedKmph, segment.dwellMinutes, weights);
      cumulativeMinutes += travelTime;

      const arrivalClockTime = this.addMinutesToClock(startingClockTime, cumulativeMinutes);

      segmentResults.push({
        fromStationName: segment.fromStationId,
        toStationName: segment.toStationId,
        segmentTravelMinutes: Number(travelTime.toFixed(2)),
        cumulativeMinutesFromStart: Number(cumulativeMinutes.toFixed(2)),
        arrivalClockTimeAtToStation: arrivalClockTime
      });

      stationResults.push({
        stationName: segment.toStationId,
        arrivalMinutesFromStart: Number(cumulativeMinutes.toFixed(2)),
        arrivalClockTime: arrivalClockTime
      });
    }

    return {
      routeName: "Custom Route",
      stationResults,
      segmentResults,
      weightsUsed: weights
    };
  }

  /**
   * Core perceptron formula: y = Σ(w_i * x_i) + bias
   */
  private static calculateTravelTime(distanceKm: number, speedKmph: number, dwellMinutes: number, weights: PerceptronWeights): number {
    const prediction = 
      (weights.wDistance * distanceKm) +
      (weights.wSpeed * speedKmph) +
      (weights.wDwell * dwellMinutes) +
      weights.bias;
    
    // Ensure travel time is never negative
    return Math.max(0.5, prediction);
  }

  /**
   * Train the perceptron using gradient descent.
   */
  static train(request: TrainingRequest): TrainingResult {
    const learningRate = request.learningRate || 0.001;
    const epochs = request.epochs || 100;
    let weights = { ...(request.initialWeights || DEFAULT_WEIGHTS) };
    const history: { epoch: number; meanSquaredError: number }[] = [];

    for (let epoch = 1; epoch <= epochs; epoch++) {
      let totalErrorSquared = 0;

      for (const sample of request.samples) {
        const predicted = this.calculateTravelTime(
          sample.distanceKm, 
          sample.avgSpeedKmph, 
          sample.dwellMinutes, 
          weights
        );
        
        const error = sample.actualTravelMinutes - predicted;
        totalErrorSquared += error * error;

        // Update weights
        weights.wDistance += learningRate * error * sample.distanceKm;
        weights.wSpeed += learningRate * error * sample.avgSpeedKmph;
        weights.wDwell += learningRate * error * sample.dwellMinutes;
        weights.bias += learningRate * error;
      }

      const mse = totalErrorSquared / request.samples.length;
      history.push({ epoch, meanSquaredError: mse });
    }

    return {
      trainedWeights: weights,
      history
    };
  }

  /**
   * Helper to add minutes to a HH:MM string.
   */
  private static addMinutesToClock(startTime: string, minutesToAdd: number): string {
    const [hours, mins] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutesToAdd, 0);
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
