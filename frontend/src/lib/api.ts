import type { PredictionInput, TrainingRequest, MetroRoute, RoutePredictionResult, TrainingResult, PerceptronWeights } from '../types/shared';
import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getRoutes = async (): Promise<MetroRoute[]> => {
  const response = await api.get('/routes');
  return response.data;
};

export const getRouteDetail = async (id: string): Promise<MetroRoute> => {
  const response = await api.get(`/routes/${id}`);
  return response.data;
};

export const saveRoute = async (route: MetroRoute): Promise<MetroRoute> => {
  const response = await api.post('/routes', route);
  return response.data;
};

export const runPrediction = async (input: PredictionInput): Promise<RoutePredictionResult> => {
  const response = await api.post('/predict', input);
  return response.data;
};

export const trainPerceptron = async (request: TrainingRequest): Promise<TrainingResult> => {
  const response = await api.post('/train', request);
  return response.data;
};

export const getWeights = async (): Promise<PerceptronWeights> => {
  const response = await api.get('/weights');
  return response.data;
};
