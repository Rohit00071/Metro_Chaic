import React from 'react';
import { motion } from 'framer-motion';
import { Train, LayoutDashboard, Database, TrendingUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Navbar: React.FC<{ activeView: string; setActiveView: (view: string) => void }> = ({ activeView, setActiveView }) => {
  const tabs = [
    { id: 'route-setup', label: 'Route Setup', icon: LayoutDashboard },
    { id: 'prediction', label: 'Prediction', icon: Train },
    { id: 'trainer', label: 'Trainer', icon: TrendingUp },
  ];

  return (
    <nav className="glass-card sticky top-4 mx-2 md:mx-4 mb-6 mt-4 flex flex-col sm:flex-row h-auto min-h-16 items-center justify-between rounded-2xl px-4 py-3 sm:px-8 z-50 gap-4 sm:gap-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400">
          <Train className="text-slate-900" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          Metro <span className="text-cyan-400">Perceptron</span>
        </h1>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end overflow-x-auto pb-1 sm:pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="font-medium text-sm sm:text-base hidden xs:block">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="flex min-h-screen w-full flex-col font-sans">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 px-4 pb-8 overflow-y-auto w-full max-w-7xl mx-auto">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
