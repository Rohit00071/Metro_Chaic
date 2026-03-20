import React, { useState } from 'react';
import { Plus, Trash2, Save, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Station, SegmentBetweenStations, MetroRoute } from '../../types/shared';

interface RouteSetupProps {
  onSave: (route: MetroRoute) => void;
}

const RouteSetup: React.FC<RouteSetupProps> = ({ onSave }) => {
  const [routeName, setRouteName] = useState('Namma Metro - Purple Line');
  const [stations, setStations] = useState<Station[]>([
    { id: 'S1', name: 'Whitefield (Kadugodi)', order: 0 },
    { id: 'S2', name: 'KR Puram', order: 1 },
    { id: 'S3', name: 'Indiranagar', order: 2 },
    { id: 'S4', name: 'MG Road', order: 3 },
    { id: 'S5', name: 'Majestic (KSR)', order: 4 },
  ]);
  const [segments, setSegments] = useState<SegmentBetweenStations[]>([
    { fromStationId: 'S1', toStationId: 'S2', distanceKm: 8.5, avgSpeedKmph: 45, dwellMinutes: 1.5 },
    { fromStationId: 'S2', toStationId: 'S3', distanceKm: 5.0, avgSpeedKmph: 42, dwellMinutes: 1.0 },
    { fromStationId: 'S3', toStationId: 'S4', distanceKm: 3.5, avgSpeedKmph: 38, dwellMinutes: 1.2 },
    { fromStationId: 'S4', toStationId: 'S5', distanceKm: 4.2, avgSpeedKmph: 35, dwellMinutes: 1.5 },
  ]);

  const addStation = () => {
    const newId = `S${stations.length + 1}`;
    const prevStation = stations[stations.length - 1];
    
    const newStation: Station = {
      id: newId,
      name: `Station ${stations.length + 1}`,
      order: stations.length,
    };

    const newSegment: SegmentBetweenStations = {
      fromStationId: prevStation.id,
      toStationId: newId,
      distanceKm: 3.5,
      avgSpeedKmph: 40,
      dwellMinutes: 1.0,
    };

    setStations([...stations, newStation]);
    setSegments([...segments, newSegment]);
  };

  const removeStation = (id: string) => {
    if (stations.length <= 2) return;
    const updatedStations = stations.filter(s => s.id !== id);
    
    const updatedSegments: SegmentBetweenStations[] = [];
    for (let i = 0; i < updatedStations.length - 1; i++) {
      const from = updatedStations[i];
      const to = updatedStations[i+1];
      updatedSegments.push({
        fromStationId: from.id,
        toStationId: to.id,
        distanceKm: 4.0,
        avgSpeedKmph: 40,
        dwellMinutes: 1.0,
      });
    }

    setStations(updatedStations);
    setSegments(updatedSegments);
  };

  const updateStationName = (id: string, name: string) => {
    setStations(stations.map(s => s.id === id ? { ...s, name } : s));
  };

  const updateSegment = (index: number, field: keyof SegmentBetweenStations, value: number) => {
    const updatedSegments = [...segments];
    updatedSegments[index] = { ...updatedSegments[index], [field]: value };
    setSegments(updatedSegments);
  };

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substring(7),
      name: routeName,
      stations,
      segments,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Route Configuration</label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-bold text-xl"
            placeholder="Enter route name..."
          />
        </div>

        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MoveRight className="text-cyan-400" size={20} />
              Stations & Segments
            </h3>
            <button 
              onClick={addStation}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Plus size={18} />
              Add Station
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {stations.map((station, i) => (
                <React.Fragment key={station.id}>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    className="flex items-center gap-4 bg-slate-900/30 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                      {i + 1}
                    </div>
                    <input
                      type="text"
                      value={station.name}
                      onChange={(e) => updateStationName(station.id, e.target.value)}
                      className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-600 font-medium"
                    />
                    {stations.length > 2 && (
                      <button onClick={() => removeStation(station.id)} className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </motion.div>

                  {i < stations.length - 1 && (
                    <motion.div 
                      key={`seg-${i}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="ml-6 pl-6 sm:pl-10 border-l-2 border-dashed border-slate-800 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Dist (km)</label>
                        <input
                          type="number"
                          value={segments[i]?.distanceKm}
                          onChange={(e) => updateSegment(i, 'distanceKm', parseFloat(e.target.value))}
                          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Speed (km/h)</label>
                        <input
                          type="number"
                          value={segments[i]?.avgSpeedKmph}
                          onChange={(e) => updateSegment(i, 'avgSpeedKmph', parseFloat(e.target.value))}
                          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-500 block">Dwell (min)</label>
                        <input
                          type="number"
                          value={segments[i]?.dwellMinutes}
                          onChange={(e) => updateSegment(i, 'dwellMinutes', parseFloat(e.target.value))}
                          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                        />
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Actions</h3>
          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-6 py-4 rounded-xl transition-all font-bold shadow-xl active:scale-95 mb-4"
          >
            <Save size={20} />
            Save & Continue
          </button>
          <p className="text-sm text-slate-400 text-center px-4 leading-relaxed">
            Saved routes can be used for time prediction in the Visualizer tab.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Route Visualization</h3>
          <div className="relative h-64 bg-slate-900/50 rounded-xl p-4 flex flex-col items-center justify-center overflow-x-auto">
             <div className="min-w-[400px] sm:min-w-full w-full relative h-full flex flex-col justify-center">
               <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1 }}
                />
             </div>
             <div className="flex justify-between w-full relative h-full items-center min-w-[400px] sm:min-w-0 px-4 sm:px-0">
                {stations.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center group">
                    <motion.div 
                      className="w-4 h-4 rounded-full bg-cyan-400 border-4 border-slate-950 z-10 group-hover:scale-125 transition-transform cursor-pointer"
                      whileHover={{ scale: 1.5, boxShadow: "0 0 15px rgba(0, 245, 212, 0.8)" }}
                    />
                    <span className="absolute mt-6 text-[10px] text-slate-500 font-bold origin-left -rotate-45 whitespace-nowrap group-hover:text-cyan-400 transition-colors">
                      {s.name}
                    </span>
                  </div>
                ))}
             </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteSetup;
