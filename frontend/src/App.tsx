import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import RouteSetup from './components/RouteSetup/RouteSetup';
import PredictionVisualizer from './components/PredictionVisualizer/PredictionVisualizer';
import PerceptronTrainer from './components/PerceptronTrainer/PerceptronTrainer';
import type { MetroRoute } from './types/shared';
import { saveRoute as apiSaveRoute } from './lib/api';

const queryClient = new QueryClient();

function App() {
  const [activeView, setActiveView] = useState('route-setup');
  const [selectedRoute, setSelectedRoute] = useState<MetroRoute | undefined>(undefined);

  const handleSaveRoute = async (route: MetroRoute) => {
    try {
      const saved = await apiSaveRoute(route);
      setSelectedRoute(saved);
      setActiveView('prediction');
    } catch (e) {
      console.error('Failed to save route:', e);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Layout activeView={activeView} setActiveView={setActiveView}>
        {activeView === 'route-setup' && (
          <RouteSetup onSave={handleSaveRoute} />
        )}
        {activeView === 'prediction' && (
          <PredictionVisualizer initialRoute={selectedRoute} />
        )}
        {activeView === 'trainer' && (
          <PerceptronTrainer />
        )}
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
