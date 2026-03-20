import express, { Request, Response } from 'express';
import cors from 'cors';
import { PerceptronService, DEFAULT_WEIGHTS } from './services/perceptron';
import { PredictionInput, TrainingRequest, MetroRoute, PerceptronWeights } from './types/shared';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory "DB" for routes and weights
let savedRoutes: MetroRoute[] = [];
let savedWeights: PerceptronWeights = DEFAULT_WEIGHTS;

// 1) POST /api/predict
app.post('/api/predict', (req: Request, res: Response) => {
  try {
    const input: PredictionInput = req.body;
    const result = PerceptronService.predict({
      ...input,
      weights: input.weights || savedWeights
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 2) POST /api/train
app.post('/api/train', (req: Request, res: Response) => {
  try {
    const request: TrainingRequest = req.body;
    const result = PerceptronService.train(request);
    // Persist final trained weights
    savedWeights = result.trainedWeights;
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 3) GET /api/weights
app.get('/api/weights', (req: Request, res: Response) => {
  res.json(savedWeights);
});

// 4) POST /api/routes
app.post('/api/routes', (req: Request, res: Response) => {
  try {
    const route: MetroRoute = req.body;
    if (!route.id) route.id = Math.random().toString(36).substring(7);
    
    const index = savedRoutes.findIndex(r => r.id === route.id);
    if (index > -1) {
      savedRoutes[index] = route;
    } else {
      savedRoutes.push(route);
    }
    res.json(route);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 5) GET /api/routes
app.get('/api/routes', (req: Request, res: Response) => {
  res.json(savedRoutes);
});

// 6) GET /api/routes/:id
app.get('/api/routes/:id', (req: Request, res: Response) => {
  const route = savedRoutes.find(r => r.id === req.params.id);
  if (route) {
    res.json(route);
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
