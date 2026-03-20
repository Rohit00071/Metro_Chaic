export interface Station {
  id: string;
  name: string;
  order: number;
}

export interface SegmentBetweenStations {
  fromStationId: string;
  toStationId: string;
  distanceKm: number;
  avgSpeedKmph: number;
  dwellMinutes: number;
}

export interface PerceptronWeights {
  wDistance: number;
  wSpeed: number;
  wDwell: number;
  bias: number;
}

export interface PredictionInput {
  startingClockTime: string; // e.g., "08:15"
  segments: SegmentBetweenStations[];
  weights?: PerceptronWeights;
}

export interface SegmentPredictionResult {
  fromStationName: string;
  toStationName: string;
  segmentTravelMinutes: number;
  cumulativeMinutesFromStart: number;
  arrivalClockTimeAtToStation: string;
}

export interface RoutePredictionResult {
  routeName: string;
  stationResults: {
    stationName: string;
    arrivalMinutesFromStart: number;
    arrivalClockTime: string;
  }[];
  segmentResults: SegmentPredictionResult[];
  weightsUsed: PerceptronWeights;
}

export interface TrainingSample {
  distanceKm: number;
  avgSpeedKmph: number;
  dwellMinutes: number;
  actualTravelMinutes: number;
}

export interface TrainingRequest {
  samples: TrainingSample[];
  initialWeights?: PerceptronWeights;
  learningRate?: number;
  epochs?: number;
}

export interface TrainingResult {
  trainedWeights: PerceptronWeights;
  history: {
    epoch: number;
    meanSquaredError: number;
  }[];
}

export interface MetroRoute {
  id: string;
  name: string;
  stations: Station[];
  segments: SegmentBetweenStations[];
}
