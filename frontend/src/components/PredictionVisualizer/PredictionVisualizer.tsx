import React, { useState, useEffect } from 'react';
import { Play, Clock, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MetroRoute, RoutePredictionResult, PredictionInput } from '../../types/shared';
import { runPrediction } from '../../lib/api';

interface PredictionVisualizerProps {
  initialRoute?: MetroRoute;
}

const PredictionVisualizer: React.FC<PredictionVisualizerProps> = ({ initialRoute }) => {
  const [route, setRoute] = useState<MetroRoute | undefined>(initialRoute);
  const [startTime, setStartTime] = useState('08:00');
  const [prediction, setPrediction] = useState<RoutePredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trainPosition, setTrainPosition] = useState(0); // 0 to 100 percentage
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Default route if none provided
  useEffect(() => {
    if (!initialRoute) {
      setRoute({
        id: 'default',
        name: 'Namma Metro - Purple Line',
        stations: [
          { id: '1', name: 'Whitefield (Kadugodi)', order: 0 },
          { id: '2', name: 'KR Puram', order: 1 },
          { id: '3', name: 'Indiranagar', order: 2 },
          { id: '4', name: 'MG Road', order: 3 },
          { id: '5', name: 'Majestic (KSR)', order: 4 },
        ],
        segments: [
          { fromStationId: '1', toStationId: '2', distanceKm: 8.5, avgSpeedKmph: 45, dwellMinutes: 1.5 },
          { fromStationId: '2', toStationId: '3', distanceKm: 5.0, avgSpeedKmph: 42, dwellMinutes: 1.0 },
          { fromStationId: '3', toStationId: '4', distanceKm: 3.5, avgSpeedKmph: 38, dwellMinutes: 1.2 },
          { fromStationId: '4', toStationId: '5', distanceKm: 4.2, avgSpeedKmph: 35, dwellMinutes: 1.5 },
        ]
      });
    }
  }, [initialRoute]);

  const handlePredict = async () => {
    if (!route) return;
    setIsLoading(true);
    try {
      const input: PredictionInput = {
        startingClockTime: startTime,
        segments: route.segments,
      };
      const result = await runPrediction(input);
      setPrediction(result);
      startAnimation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const startAnimation = (res: RoutePredictionResult) => {
    setIsAnimating(true);
    setTrainPosition(0);
    setCurrentStationIndex(0);
    
    const totalTime = res.stationResults[res.stationResults.length - 1].arrivalMinutesFromStart;
    const animationDuration = 5000;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / animationDuration, 1);
      setTrainPosition(progress * 100);
      
      const currentMinutes = progress * totalTime;
      const stationIndex = res.stationResults.findIndex(s => s.arrivalMinutesFromStart >= currentMinutes);
      if (stationIndex !== -1) setCurrentStationIndex(stationIndex);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold text-lg mb-2">Controls</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Departure Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={16} />
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          <button 
            onClick={handlePredict}
            disabled={isLoading || !route}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 text-white px-6 py-4 rounded-xl transition-all font-bold shadow-xl active:scale-95"
          >
            {isLoading ? "Analyzing..." : <><Play className="fill-current" size={18} /> Run Journey</>}
          </button>
        </div>

        <div className="lg:col-span-3 glass-card rounded-2xl p-4 sm:p-8 relative overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 sm:mb-12">Journey Dashboard</h3>
          
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="relative mt-20 mb-32 h-20 min-w-[500px] sm:min-w-0">
               <div className="absolute top-1/2 left-4 right-4 sm:left-0 sm:right-0 h-4 bg-slate-900 border-4 border-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400" 
                  style={{ width: `${trainPosition}%`, filter: 'drop-shadow(0 0 8px rgba(0, 245, 212, 0.5))' }}
                />
             </div>

             <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center px-2">
                {route?.stations.map((s, i) => {
                  const isActive = i <= currentStationIndex && prediction;
                  const isCurrent = i === currentStationIndex && isAnimating;
                  return (
                    <div key={s.id} className="relative group">
                       <motion.div 
                         className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all ${
                            isActive ? 'bg-cyan-400 border-cyan-300' : 'bg-slate-900 border-slate-700'
                         }`}
                         animate={isCurrent ? { scale: [1, 1.2, 1], boxShadow: ["0 0 0px #00f5d4", "0 0 20px #00f5d4", "0 0 0px #00f5d4"] } : {}}
                         transition={isCurrent ? { repeat: Infinity, duration: 1.5 } : {}}
                       >
                         {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                       </motion.div>
                       
                       <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                          <p className={`text-xs font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-600'}`}>{s.name}</p>
                          {prediction && (
                            <p className="text-[10px] text-cyan-400 font-mono">
                              {prediction.stationResults[i]?.arrivalClockTime}
                            </p>
                          )}
                       </div>
                    </div>
                  );
                })}
             </div>

             {isAnimating && (
                <motion.div 
                  className="absolute top-1/2 -mt-10 z-20"
                  style={{ left: `calc(${trainPosition}% - 20px)` }}
                >
                  <div className="bg-white rounded-lg p-2 shadow-2xl border-2 border-cyan-400 relative">
                     <Play className="text-cyan-600 fill-current rotate-0" size={24} />
                  </div>
                </motion.div>
             )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {prediction && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="glass-card rounded-2xl overflow-hidden">
               <div className="p-4 sm:p-6 border-b border-white/10 bg-white/5">
                  <h4 className="text-white font-bold flex items-center gap-2 text-sm sm:text-base">
                    <Clock className="text-cyan-400" size={18} />
                    Predicted Arrival Times
                  </h4>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[400px]">
                    <thead>
                     <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-4">Station</th>
                        <th className="px-6 py-4">Minutes From Start</th>
                        <th className="px-6 py-4">Est. Arrival</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {prediction.stationResults.map((res, i) => (
                       <motion.tr 
                         key={i} 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.1 }}
                         className={`hover:bg-cyan-500/5 transition-colors ${i === currentStationIndex ? 'bg-cyan-500/10' : ''}`}
                       >
                          <td className="px-6 py-4 font-bold text-white">{res.stationName}</td>
                          <td className="px-6 py-4 font-mono text-cyan-400">{res.arrivalMinutesFromStart} min</td>
                          <td className="px-6 py-4">
                             <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold text-xs border border-emerald-500/20">
                               {res.arrivalClockTime}
                             </span>
                          </td>
                       </motion.tr>
                    ))}
                  </tbody>
                 </table>
               </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Gauge className="text-emerald-400" size={18} />
                  Perceptron Model Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black">Segment Count</p>
                      <p className="text-2xl font-bold text-white">{prediction.segmentResults.length}</p>
                   </div>
                   <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-black">Bias Used</p>
                      <p className="text-2xl font-bold text-white">{prediction.weightsUsed.bias.toFixed(2)}</p>
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionVisualizer;
