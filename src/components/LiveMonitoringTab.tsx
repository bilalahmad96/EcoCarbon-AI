import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  Fuel, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Flame, 
  Sun,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { DbState } from '../types';

interface LiveMonitoringTabProps {
  state: DbState;
  onRefreshState: () => void;
}

type FactoryMode = 'standard' | 'peak' | 'eco' | 'emergency';

export default function LiveMonitoringTab({ state, onRefreshState }: LiveMonitoringTabProps) {
  const [factoryMode, setFactoryMode] = useState<FactoryMode>('standard');
  
  // Local fluctuating metrics
  const [co2Rate, setCo2Rate] = useState(148.5); // kg CO2/hour
  const [powerLoad, setPowerLoad] = useState(325.2); // kW
  const [dieselRate, setDieselRate] = useState(0); // liters/hour
  const [solarGeneration, setSolarGeneration] = useState(115.0); // kW
  const [productionRate, setProductionRate] = useState(1.4); // tonnes/hour
  
  // Set base numbers depending on Factory Mode
  useEffect(() => {
    switch (factoryMode) {
      case 'standard':
        setCo2Rate(148.5);
        setPowerLoad(325.0);
        setDieselRate(0);
        setSolarGeneration(112.0);
        setProductionRate(1.4);
        break;
      case 'peak':
        setCo2Rate(342.8);
        setPowerLoad(580.0);
        setDieselRate(15.0);
        setSolarGeneration(98.0);
        setProductionRate(2.8);
        break;
      case 'eco':
        setCo2Rate(54.2);
        setPowerLoad(185.0);
        setDieselRate(0);
        setSolarGeneration(145.0);
        setProductionRate(0.9);
        break;
      case 'emergency':
        setCo2Rate(410.5);
        setPowerLoad(45.0); // grid load is near zero
        setDieselRate(120.0); // massive diesel generator active
        setSolarGeneration(30.0); // overcast or limited
        setProductionRate(1.2);
        break;
    }
  }, [factoryMode]);

  // Periodic tiny fluctuations to simulate live digital meter telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setCo2Rate(prev => {
        const delta = prev * (0.015 * (Math.random() - 0.5));
        return Math.round((prev + delta) * 10) / 10;
      });
      setPowerLoad(prev => {
        const delta = prev * (0.012 * (Math.random() - 0.5));
        return Math.round((prev + delta) * 10) / 10;
      });
      setSolarGeneration(prev => {
        const delta = prev * (0.02 * (Math.random() - 0.5));
        return Math.max(0, Math.round((prev + delta) * 10) / 10);
      });
      setProductionRate(prev => {
        const delta = prev * (0.005 * (Math.random() - 0.5));
        return Math.max(0.1, Math.round((prev + delta) * 10) / 10);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const carbonIntensity = Math.round((co2Rate / (productionRate || 1)) * 10) / 10;

  return (
    <div className="space-y-6">
      
      {/* Simulation Controller Panel */}
      <div className="p-6 bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-base font-sans font-medium text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Telemetry Simulation Controller</span>
          </h3>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Toggle physical facility load presets to observe real-time carbon calculation formulas update.
          </p>
        </div>

        {/* Action Preset Buttons */}
        <div className="grid grid-cols-2 sm:flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setFactoryMode('standard')}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${factoryMode === 'standard' ? 'bg-neutral-900 border-emerald-500 text-emerald-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            ● Standard Production
          </button>
          
          <button 
            onClick={() => setFactoryMode('peak')}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${factoryMode === 'peak' ? 'bg-neutral-900 border-red-500 text-red-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            ▲ Peak Operating Load
          </button>

          <button 
            onClick={() => setFactoryMode('eco')}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${factoryMode === 'eco' ? 'bg-neutral-900 border-cyan-500 text-cyan-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            🍃 Eco Green Shift
          </button>

          <button 
            onClick={() => setFactoryMode('emergency')}
            className={`px-4 py-2.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${factoryMode === 'emergency' ? 'bg-neutral-900 border-yellow-500 text-yellow-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            ⚡ Backup Gen Active
          </button>
        </div>
      </div>

      {/* Dynamic Telemetry Reading Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        
        {/* Gauge 1: CO2 Rate */}
        <div className="bg-neutral-950/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">CO₂ Emission Rate</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-3xl font-sans font-medium text-white tracking-tight">{co2Rate.toFixed(1)}</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase mt-1 block">kg CO₂ / Hour</span>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">Intensity status:</span>
            <span className={factoryMode === 'eco' ? 'text-emerald-400' : 'text-red-400'}>
              {factoryMode === 'eco' ? 'Excellent' : 'High Output'}
            </span>
          </div>
        </div>

        {/* Gauge 2: Power Demand */}
        <div className="bg-neutral-950/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Grid Active Demand</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-3xl font-sans font-medium text-white tracking-tight">{powerLoad.toFixed(1)}</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase mt-1 block">Kilowatts (kW)</span>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">Grid Coefficient:</span>
            <span className="text-neutral-400">{state.factory.gridFactor || 0.42} kg/kWh</span>
          </div>
        </div>

        {/* Gauge 3: Solar Generation */}
        <div className="bg-neutral-950/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Solar Generation</span>
            <Sun className="w-4 h-4 text-yellow-500" />
          </div>
          <div>
            <h4 className="text-3xl font-sans font-medium text-yellow-400 tracking-tight">
              {state.factory.solarAvailability ? solarGeneration.toFixed(1) : '0.0'}
            </h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase mt-1 block">Clean Offset (kW)</span>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">Utilization:</span>
            <span className="text-emerald-400">100% Inverted</span>
          </div>
        </div>

        {/* Gauge 4: Fuel Rate */}
        <div className="bg-neutral-950/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Diesel Combustion</span>
            <Fuel className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h4 className="text-3xl font-sans font-medium text-white tracking-tight">{dieselRate.toFixed(1)}</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase mt-1 block">Liters / Hour</span>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">Gen Rating:</span>
            <span className="text-neutral-400">2.68 kg CO₂/L</span>
          </div>
        </div>

        {/* Gauge 5: Production Output */}
        <div className="bg-neutral-950/60 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Throughput Rate</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-3xl font-sans font-medium text-white tracking-tight">{productionRate.toFixed(1)}</h4>
            <span className="text-[10px] font-mono text-neutral-500 uppercase mt-1 block">Tonnes / Hour</span>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">Target Level:</span>
            <span className="text-neutral-400">95% Achievement</span>
          </div>
        </div>

      </div>

      {/* Advanced Carbon Intensity Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Dynamic Formula card */}
        <div className="md:col-span-2 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6">
          <h3 className="text-sm font-sans font-medium text-white">Live Carbon Intensity Formula Evaluation</h3>
          <p className="text-xs text-neutral-500 mt-1 font-mono">This system audits CO₂ intensity per tonne based on instantaneous fuel usage and grid ratios.</p>
          
          <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl mt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Grid Emission Component:</span>
              <span className="text-cyan-400">({powerLoad.toFixed(1)} kW × {state.factory.gridFactor || 0.42} EF) = {Math.round(powerLoad * (state.factory.gridFactor || 0.42))} kg CO₂/hr</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Diesel Combust Component:</span>
              <span className="text-orange-400">({dieselRate.toFixed(1)} L/hr × 2.68 EF) = {Math.round(dieselRate * 2.68)} kg CO₂/hr</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800/80 pt-2 text-white">
              <span>Total CO₂ Hour Flow:</span>
              <span className="text-emerald-400 font-bold">~ {Math.round(powerLoad * (state.factory.gridFactor || 0.42) + dieselRate * 2.68)} kg CO₂/hr</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800/80 pt-2 text-white text-sm">
              <span>Specific Carbon Intensity:</span>
              <span className="text-emerald-500 font-bold">{carbonIntensity} kg CO₂ / Tonne Product</span>
            </div>
          </div>
        </div>

        {/* Current Grid Warnings */}
        <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-sans font-medium text-white">Grid Status &amp; Carbon Warnings</h3>
            <p className="text-xs text-neutral-500 mt-1 font-mono">Active environmental alerts.</p>
            
            <div className="space-y-3 mt-4">
              <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded flex gap-2 items-start text-[10px] font-mono">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-400 font-bold block">Grid Carbon: Optimal</span>
                  <span className="text-neutral-500">Hydro/Solar is matching 65% of local regional grid mix today.</span>
                </div>
              </div>

              {dieselRate > 0 && (
                <div className="p-2.5 bg-orange-950/20 border border-orange-500/20 rounded flex gap-2 items-start text-[10px] font-mono">
                  <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-orange-400 font-bold block">High Diesel Friction</span>
                    <span className="text-neutral-400">Standby emergency combustion generators active. Intensity increased.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 font-mono mt-4">Sensor Frequency Rate: 0.2 Hz (Periodic 5s audits)</p>
        </div>

      </div>

    </div>
  );
}
