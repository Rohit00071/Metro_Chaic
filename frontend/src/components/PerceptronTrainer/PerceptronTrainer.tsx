import React, { useState } from 'react';
import { TrendingUp, Plus, Trash2, BrainCircuit, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrainingSample, TrainingRequest, TrainingResult, PerceptronWeights } from '../../types/shared';
import { trainPerceptron, getWeights } from '../../lib/api';

const PerceptronTrainer: React.FC = () => {
  const [samples, setSamples] = useState<TrainingSample[]>([
    { distanceKm: 8.5, avgSpeedKmph: 45, dwellMinutes: 1.5, actualTravelMinutes: 12.8 },
    { distanceKm: 5.0, avgSpeedKmph: 42, dwellMinutes: 1.0, actualTravelMinutes: 8.1 },
    { distanceKm: 3.5, avgSpeedKmph: 38, dwellMinutes: 1.2, actualTravelMinutes: 6.7 },
    { distanceKm: 4.2, avgSpeedKmph: 35, dwellMinutes: 1.5, actualTravelMinutes: 8.7 },
  ]);

  const [learningRate, setLearningRate] = useState(0.001);
  const [epochs, setEpochs] = useState(200);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [currentWeights, setCurrentWeights] = useState<PerceptronWeights | null>(null);

  const addSample = () => {
    setSamples([...samples, { distanceKm: 3.0, avgSpeedKmph: 45, dwellMinutes: 1.0, actualTravelMinutes: 4.0 }]);
  };

  const removeSample = (index: number) => {
    setSamples(samples.filter((_, i) => i !== index));
  };

  const updateSample = (index: number, field: keyof TrainingSample, value: number) => {
    const updated = [...samples];
    updated[index] = { ...updated[index], [field]: value };
    setSamples(updated);
  };

  const handleTrain = async () => {
    setIsTraining(true);
    try {
      const request: TrainingRequest = {
        samples,
        learningRate,
        epochs,
      };
      const result = await trainPerceptron(request);
      setTrainingResult(result);
      setCurrentWeights(result.trainedWeights);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTraining(false);
    }
  };

  const fetchCurrentWeights = async () => {
    try {
      const weights = await getWeights();
      setCurrentWeights(weights);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchCurrentWeights();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 glass-card rounded-2xl p-8 relative overflow-hidden group">
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Gradient Descent <span className="text-cyan-400">Trainer</span></h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              A Perceptron estimates travel time using weighted physical features. 
              The algorithm will iteratively adjust weights to minimize the Mean Squared Error (MSE).
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8 items-start sm:items-center pt-6 border-t border-white/5">
                <div className="space-y-2 w-full sm:w-auto">
                   <label className="text-[10px] uppercase font-black text-slate-500 block">Learning Rate</label>
                   <input 
                      type="range" min="0.0001" max="0.01" step="0.0001"
                      value={learningRate} 
                      onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                      className="w-full sm:w-48 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                   />
                   <span className="text-xs font-mono text-cyan-400 block">{learningRate.toFixed(4)}</span>
                </div>
                <button 
                  onClick={handleTrain}
                  disabled={isTraining || samples.length === 0}
                  className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl transition-all font-bold shadow-xl active:scale-95"
                >
                  {isTraining ? <RefreshCw className="animate-spin" size={18} /> : <Layers size={18} />}
                  Train Now
                </button>
            </div>
         </div>
      </div>

      <div className="lg:col-span-7 glass-card rounded-2xl overflow-hidden self-start">
         <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h4 className="text-white font-bold">Training Samples</h4>
            <button 
              onClick={addSample}
              className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"
            >
               <Plus size={20} />
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
               <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-black">
                  <tr>
                     <th className="px-6 py-4">Dist (km)</th>
                     <th className="px-6 py-4">Speed (km/h)</th>
                     <th className="px-6 py-4">Dwell (m)</th>
                     <th className="px-6 py-4">Actual (m)</th>
                     <th className="px-6 py-4"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {samples.map((s, i) => (
                    <tr key={i}>
                       <td className="px-4 py-3">
                          <input type="number" step="0.1" value={s.distanceKm} onChange={(e) => updateSample(i, 'distanceKm', parseFloat(e.target.value))} className="w-full bg-transparent border-none text-white font-mono" />
                       </td>
                       <td className="px-4 py-3">
                          <input type="number" value={s.avgSpeedKmph} onChange={(e) => updateSample(i, 'avgSpeedKmph', parseFloat(e.target.value))} className="w-full bg-transparent border-none text-white font-mono" />
                       </td>
                       <td className="px-4 py-3">
                          <input type="number" step="0.1" value={s.dwellMinutes} onChange={(e) => updateSample(i, 'dwellMinutes', parseFloat(e.target.value))} className="w-full bg-transparent border-none text-white font-mono" />
                       </td>
                       <td className="px-4 py-3">
                          <input type="number" step="0.1" value={s.actualTravelMinutes} onChange={(e) => updateSample(i, 'actualTravelMinutes', parseFloat(e.target.value))} className="w-full bg-transparent border-none text-white font-mono" />
                       </td>
                       <td className="px-4 py-3 text-center">
                          <button onClick={() => removeSample(i)} className="text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <div className="lg:col-span-12 glass-card rounded-2xl p-6">
          <h4 className="text-white font-bold mb-6">Error Convergence</h4>
          <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trainingResult?.history || []}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="epoch" hide />
                     <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                     />
                     <Line 
                        type="monotone" 
                        dataKey="meanSquaredError" 
                        stroke="#00f5d4" 
                        strokeWidth={2} 
                        dot={false}
                     />
                  </LineChart>
               </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default PerceptronTrainer;
