import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Sliders, 
  Globe, 
  HelpCircle, 
  Check, 
  Activity, 
  Cpu, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { DbState } from '../types';

interface SettingsTabProps {
  state: DbState;
  onUpdateFactory: (payload: any) => Promise<void>;
}

export default function SettingsTab({ state, onUpdateFactory }: SettingsTabProps) {
  const { factory } = state;
  const [name, setName] = useState(factory.name);
  const [industryType, setIndustryType] = useState(factory.industryType);
  const [address, setAddress] = useState(factory.address);
  const [carbonTarget, setCarbonTarget] = useState(factory.carbonTarget.toString());
  const [gridFactor, setGridFactor] = useState((factory.gridFactor || 0.42).toString());
  const [workingHours, setWorkingHours] = useState(factory.workingHours.toString());
  
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    await onUpdateFactory({
      name,
      industryType,
      address,
      carbonTarget: Number(carbonTarget) || 120,
      gridFactor: Number(gridFactor) || 0.42,
      workingHours: Number(workingHours) || 16
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-sans font-medium text-white flex items-center gap-1.5">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>SaaS System Settings &amp; Telemetry Adjusters</span>
        </h2>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">Audit grid carbon variables, facility credentials, regional parameters, and check connection logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Form */}
        <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 lg:col-span-2 space-y-6">
          <h3 className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Facility Telemetry &amp; Co-efficients Parameters</span>
          </h3>

          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg font-mono">
              ✓ System and grid multipliers successfully calibrated on the server database.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1.5">Facility Enterprise Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1.5">Industrial Sector Category</label>
                <input 
                  type="text" 
                  value={industryType} 
                  onChange={(e) => setIndustryType(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1.5">Physical Facility Location</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-emerald-400 uppercase mb-1.5 font-bold">Monthly Target Cumulative Ceiling (t CO₂)</label>
                <input 
                  type="number" 
                  value={carbonTarget} 
                  onChange={(e) => setCarbonTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-emerald-950/50 text-emerald-400 font-bold rounded text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-cyan-400 uppercase mb-1.5">Grid Carbon Coefficient (t CO₂/MWh)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={gridFactor} 
                  onChange={(e) => setGridFactor(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-cyan-400 rounded text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1.5">Factory Work Hours per Day</label>
                <input 
                  type="number" 
                  value={workingHours} 
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
                />
              </div>

            </div>

            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Recalibrate Variables</span>
            </button>
          </form>
        </div>

        {/* Server & API Status */}
        <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>SaaS Connection Log &amp; Keys</span>
          </h3>

          <div className="space-y-4">
            
            {/* API Status Gauge */}
            <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-500">Gemini Core Engine:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online (SaaS mode)</span>
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-sans mt-1">
                Our server-side AI assistant utilizes standard enterprise keys. No client-side exposure occurs. Add or update secrets in the platform settings pane safely.
              </p>
            </div>

            {/* Server Specifications */}
            <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl space-y-2 text-[10px] font-mono text-neutral-400">
              <div className="flex justify-between">
                <span>Database persistence:</span>
                <span className="text-white">Active (factory_db.json)</span>
              </div>
              <div className="flex justify-between">
                <span>Ingress port:</span>
                <span className="text-emerald-400 font-bold">3000 (Proxy Active)</span>
              </div>
              <div className="flex justify-between">
                <span>Protocol:</span>
                <span className="text-white">HTTPS/TLS Encrypted</span>
              </div>
              <div className="flex justify-between">
                <span>Telemetry frequency:</span>
                <span className="text-cyan-400">0.2 Hz (Real-time fluctuations)</span>
              </div>
            </div>

            {/* Support Box */}
            <div className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-xl text-xs text-neutral-500 leading-relaxed">
              <strong className="text-white block mb-1">Corporate Audit Compliance:</strong>
              These multipliers comply directly with Greenhouse Gas (GHG) Protocol Scope 2 indirect emissions standards and EPA regional parameters.
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
