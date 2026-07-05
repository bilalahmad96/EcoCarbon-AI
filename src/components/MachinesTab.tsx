import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Wrench, 
  Zap, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { DbState, Machine, MachineStatus } from '../types';

interface MachinesTabProps {
  state: DbState;
  onUpdateMachine: (id: string, payload: Partial<Machine>) => Promise<void>;
  onAddMachine: (payload: any) => Promise<void>;
  onDeleteMachine: (id: string) => Promise<void>;
}

export default function MachinesTab({ state, onUpdateMachine, onAddMachine, onDeleteMachine }: MachinesTabProps) {
  const { machines } = state;
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [powerRating, setPowerRating] = useState('110');
  const [avgWorkingHours, setAvgWorkingHours] = useState('12');
  const [energyMeterId, setEnergyMeterId] = useState('EM-CUSTOM-');
  const [fuelUsage, setFuelUsage] = useState('0');
  const [efficiency, setEfficiency] = useState('88');
  const [healthScore, setHealthScore] = useState('95');
  const [status, setStatus] = useState<MachineStatus>('Running');
  const [formError, setFormError] = useState('');

  const handleStatusChange = async (machineId: string, newStatus: MachineStatus) => {
    // Determine dynamic values depending on status
    const updatePayload: Partial<Machine> = { status: newStatus };
    await onUpdateMachine(machineId, updatePayload);
  };

  const handleMaintenanceSchedule = async (machineId: string) => {
    const nextWeekDate = new Date();
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    const dateStr = nextWeekDate.toISOString().split('T')[0];
    
    await onUpdateMachine(machineId, {
      maintenanceStatus: 'Pending Service',
      maintenanceDate: dateStr
    });
    alert(`Maintenance planned for next week: ${dateStr}. Telemetry limits will calibrate accordingly.`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name || !energyMeterId) {
      setFormError('Machine Name and Meter ID are required.');
      return;
    }

    const payload = {
      name,
      powerRating: Number(powerRating) || 50,
      avgWorkingHours: Number(avgWorkingHours) || 8,
      energyMeterId,
      fuelUsage: Number(fuelUsage) || 0,
      efficiency: Number(efficiency) || 90,
      healthScore: Number(healthScore) || 95,
      status
    };

    await onAddMachine(payload);
    
    // Clear form
    setName('');
    setPowerRating('110');
    setAvgWorkingHours('12');
    setEnergyMeterId('EM-CUSTOM-');
    setFuelUsage('0');
    setEfficiency('88');
    setHealthScore('95');
    setStatus('Running');
    setShowAddForm(false);
  };

  // Status color pill resolver
  const getStatusPill = (mStatus: MachineStatus) => {
    switch (mStatus) {
      case 'Running':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Running</span>;
      case 'Idle':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Idle Standby</span>;
      case 'Stopped':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">Stopped</span>;
    }
  };

  // Health rating badge
  const getHealthBadge = (score: number) => {
    if (score >= 85) return <span className="text-emerald-400">{score}% (Optimal)</span>;
    if (score >= 65) return <span className="text-yellow-400">{score}% (Caution)</span>;
    return <span className="text-red-400">{score}% (Critical Service)</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Header with trigger */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-sans font-medium text-white">Machine-Wise Emission &amp; Telemetry Analytics</h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">Continuous operational feedback on active motors, furnaces, and HVAC systems.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Machinery</span>
        </button>
      </div>

      {/* Add Machine Form Dialog Overlay Block */}
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h3 className="text-sm font-semibold text-white">Register Smart Telemetry Machinery</h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-neutral-500 hover:text-white">Cancel</button>
          </div>
          
          {formError && (
            <div className="p-2.5 bg-red-950/20 border border-red-500/20 text-red-400 text-xs rounded">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Machine Name</label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Workshop B Conveyor"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Energy Meter ID</label>
              <input 
                type="text" 
                required
                value={energyMeterId} 
                onChange={(e) => setEnergyMeterId(e.target.value)}
                placeholder="e.g. EM-MTR-99"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Power Rating (kW)</label>
              <input 
                type="number" 
                value={powerRating} 
                onChange={(e) => setPowerRating(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Avg Run Hours / Day</label>
              <input 
                type="number" 
                value={avgWorkingHours} 
                onChange={(e) => setAvgWorkingHours(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Fuel Consumption (L/hr)</label>
              <input 
                type="number" 
                value={fuelUsage} 
                onChange={(e) => setFuelUsage(e.target.value)}
                placeholder="0 if grid-only"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Hardware Efficiency (%)</label>
              <input 
                type="number" 
                value={efficiency} 
                onChange={(e) => setEfficiency(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Engine Health Score (0-100)</label>
              <input 
                type="number" 
                value={healthScore} 
                onChange={(e) => setHealthScore(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">Initial Status</label>
              <select 
                value={status} 
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-2 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white"
              >
                <option value="Running">Running (Active Draw)</option>
                <option value="Idle">Idle (Standby Load)</option>
                <option value="Stopped">Stopped (Zero draw)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded"
              >
                Onboard Machinery
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Heavy Machines Telemetry Dashboard Table */}
      <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-900 bg-neutral-950 text-neutral-500 uppercase text-[9px] tracking-widest">
                <th className="p-4">Machine Parameters</th>
                <th className="p-4">Meter Link ID</th>
                <th className="p-4">Power Rating</th>
                <th className="p-4">Status</th>
                <th className="p-4">Efficiency</th>
                <th className="p-4">Daily CO₂ Output</th>
                <th className="p-4">Engine Health</th>
                <th className="p-4 text-right">Operational Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {machines.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-900/20 transition-colors">
                  
                  {/* Name and info */}
                  <td className="p-4">
                    <span className="text-white font-medium block font-sans text-xs">{m.name}</span>
                    {m.maintenanceDate ? (
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">Next Service: {m.maintenanceDate} ({m.maintenanceStatus})</span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">No pending maintenance schedule</span>
                    )}
                  </td>
                  
                  {/* Meter id */}
                  <td className="p-4 text-neutral-400">{m.energyMeterId}</td>
                  
                  {/* Rating */}
                  <td className="p-4">
                    <span className="text-white">{m.powerRating} kW</span>
                    {m.fuelUsage > 0 && <span className="text-orange-400 text-[10px] block mt-0.5">+{m.fuelUsage} L/hr diesel</span>}
                  </td>
                  
                  {/* Status indicator */}
                  <td className="p-4">{getStatusPill(m.status)}</td>
                  
                  {/* Efficiency percentage */}
                  <td className="p-4 text-white font-bold">{m.efficiency}%</td>
                  
                  {/* CO2 Generated today */}
                  <td className="p-4 font-bold text-emerald-400">{m.co2GeneratedToday} kg</td>
                  
                  {/* Health rating */}
                  <td className="p-4 font-bold">{getHealthBadge(m.healthScore)}</td>
                  
                  {/* Control switches */}
                  <td className="p-4">
                    <div className="flex justify-end gap-1.5">
                      
                      {/* Running trigger */}
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(m.id, 'Running')}
                        disabled={m.status === 'Running'}
                        title="Set Running"
                        className={`p-1.5 rounded transition-colors ${m.status === 'Running' ? 'text-neutral-700' : 'text-emerald-400 hover:bg-neutral-900 cursor-pointer'}`}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>

                      {/* Standby Idle trigger */}
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(m.id, 'Idle')}
                        disabled={m.status === 'Idle'}
                        title="Set Standby Idle"
                        className={`p-1.5 rounded transition-colors ${m.status === 'Idle' ? 'text-neutral-700' : 'text-yellow-400 hover:bg-neutral-900 cursor-pointer'}`}
                      >
                        <Pause className="w-3.5 h-3.5" />
                      </button>

                      {/* Stop trigger */}
                      <button 
                        type="button"
                        onClick={() => handleStatusChange(m.id, 'Stopped')}
                        disabled={m.status === 'Stopped'}
                        title="Set Stopped"
                        className={`p-1.5 rounded transition-colors ${m.status === 'Stopped' ? 'text-neutral-700' : 'text-red-400 hover:bg-neutral-900 cursor-pointer'}`}
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-px h-5 bg-neutral-900 self-center mx-1" />

                      {/* Schedule maintenance */}
                      <button 
                        type="button"
                        onClick={() => handleMaintenanceSchedule(m.id)}
                        title="Plan Maintenance Cycle"
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete machine */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove machinery telemetry channel for '${m.name}'?`)) {
                            onDeleteMachine(m.id);
                          }
                        }}
                        title="Remove machine connection"
                        className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-neutral-900 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
