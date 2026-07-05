import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sun, 
  Cpu, 
  Target, 
  Mail, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Factory } from '../types';

interface LoginRegisterProps {
  initialTab: 'login' | 'register';
  onSuccess: (user: any) => void;
  onBack: () => void;
}

export default function LoginRegister({ initialTab, onSuccess, onBack }: LoginRegisterProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('sustainability@ecocarbon.ai');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [loginRole, setLoginRole] = useState<'Admin' | 'Manager' | 'Viewer'>('Manager');
  const [loginError, setLoginError] = useState('');

  // Register form states (Exhaustive factory details requested)
  const [name, setName] = useState('EcoCarbon Smart Alloys Ltd');
  const [industryType, setIndustryType] = useState('Heavy Metallurgy & Steel Alloys');
  const [address, setAddress] = useState('Sector 4, Industrial Development Zone, Tech City');
  const [productionCapacity, setProductionCapacity] = useState('500');
  const [electricitySource, setElectricitySource] = useState('grid');
  const [solarAvailability, setSolarAvailability] = useState(true);
  const [solarCapacity, setSolarCapacity] = useState('150');
  const [generatorUsage, setGeneratorUsage] = useState('occasional');
  const [workingHours, setWorkingHours] = useState('16');
  const [employees, setEmployees] = useState('180');
  const [monthlyProductionTarget, setMonthlyProductionTarget] = useState('420');
  const [carbonTarget, setCarbonTarget] = useState('120');
  const [gridFactor, setGridFactor] = useState('0.42');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: loginRole
        })
      });
      const data = await response.json();
      if (response.ok) {
        onSuccess(data.user);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server.');
    }
  };

  const handleGoogleAuth = () => {
    // Quick, secure OAuth emulation using current logged in user metadata
    onSuccess({
      email: 'bilalmohd9919@gmail.com',
      role: 'Manager',
      displayName: 'BILAL MOHD',
      factoryId: 'factory-001'
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    if (!name || !industryType || !carbonTarget) {
      setRegisterError('Please fill in all required fields (Factory Name, Industry, Carbon Target)');
      return;
    }

    const factoryPayload: Partial<Factory> = {
      name,
      industryType,
      address,
      productionCapacity: Number(productionCapacity) || 0,
      electricitySource,
      solarAvailability,
      solarCapacity: solarAvailability ? Number(solarCapacity) : 0,
      generatorUsage,
      workingHours: Number(workingHours) || 0,
      employees: Number(employees) || 0,
      monthlyProductionTarget: Number(monthlyProductionTarget) || 0,
      carbonTarget: Number(carbonTarget) || 120,
      gridFactor: Number(gridFactor) || 0.42
    };

    try {
      const response = await fetch('/api/factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factoryPayload)
      });
      const data = await response.json();
      if (response.ok) {
        // Automatically sign the user in
        onSuccess({
          email: 'admin@ecocarbon.ai',
          role: 'Admin',
          displayName: 'FACTORY CHIEF',
          factoryId: 'factory-001'
        });
      } else {
        setRegisterError(data.error || 'Failed to update factory profile');
      }
    } catch (err) {
      setRegisterError('Failed to connect to the backend server.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 py-12 relative overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Logo Header */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer relative z-10" onClick={onBack}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Building2 className="w-5.5 h-5.5 text-black" />
        </div>
        <div>
          <span className="font-sans font-semibold text-xl tracking-tight text-white">EcoCarbon <span className="text-emerald-400">AI</span></span>
          <p className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Smart Energy Management</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-neutral-950/80 border border-neutral-900 rounded-2xl backdrop-blur-md p-6 sm:p-8 relative z-10 shadow-2xl">
        
        {/* Toggle tabs */}
        <div className="flex border-b border-neutral-900 mb-8">
          <button 
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 pb-4 text-center text-sm font-medium border-b-2 transition-all cursor-pointer ${tab === 'login' ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            SaaS User Login
          </button>
          <button 
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 pb-4 text-center text-sm font-medium border-b-2 transition-all cursor-pointer ${tab === 'register' ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            Onboard Factory Profile
          </button>
        </div>

        {tab === 'login' ? (
          /* LOGIN PANEL */
          <form onSubmit={handleLogin} className="space-y-6">
            
            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-lg">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-600 absolute left-3 top-3.5" />
                  <input 
                    type="email" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    placeholder="Enter corporate email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">Secure Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-600 absolute left-3 top-3.5" />
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">Operational Role</label>
                <select 
                  value={loginRole}
                  onChange={(e: any) => setLoginRole(e.target.value)}
                  className="w-full px-3 py-3 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Manager">Factory Manager (Monitor &amp; AI Advisor)</option>
                  <option value="Admin">Chief sustainability admin (Full System Editor)</option>
                  <option value="Viewer">Operations compliance (Read-Only Viewer)</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Authenticate and Proceed</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2 text-neutral-700">
              <div className="flex-1 h-px bg-neutral-900" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Or Link External Accounts</span>
              <div className="flex-1 h-px bg-neutral-900" />
            </div>

            {/* Google Authentication Emulation Button */}
            <button 
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {/* Simple generic colored vector circular layout for google */}
              <div className="flex gap-1">
                <span className="text-red-400 font-bold">G</span>
                <span className="text-blue-400 font-bold">o</span>
                <span className="text-yellow-400 font-bold">o</span>
                <span className="text-green-400 font-bold">g</span>
                <span className="text-blue-400 font-bold">l</span>
                <span className="text-red-400 font-bold">e</span>
              </div>
              <span>Sign In with Enterprise Account</span>
            </button>

            <div className="flex justify-between text-xs text-neutral-500 font-mono">
              <span onClick={() => alert('Enter standard email: sustainability@ecocarbon.ai and press submit. Mock JWT active.')} className="hover:text-emerald-400 transition-colors cursor-pointer">Forgot password?</span>
              <span onClick={() => setTab('register')} className="hover:text-emerald-400 transition-colors cursor-pointer">Register new facility</span>
            </div>

          </form>
        ) : (
          /* DETAILED REGISTRATION QUESTIONNAIRE */
          <form onSubmit={handleRegister} className="space-y-6">
            
            {registerError && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-lg">
                {registerError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Basic Factory details */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Factory Name <span className="text-red-400">*</span></span>
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. EcoCarbon Smart Alloys"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Industry Sector</span>
                </label>
                <input 
                  type="text"
                  value={industryType}
                  onChange={(e) => setIndustryType(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g. Heavy Metallurgy"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>Facility Physical Address</span>
                </label>
                <input 
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="Physical street address"
                />
              </div>

              {/* Capacities */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Production Capacity (tons/month)
                </label>
                <input 
                  type="number"
                  value={productionCapacity}
                  onChange={(e) => setProductionCapacity(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Monthly Production Target (tons)
                </label>
                <input 
                  type="number"
                  value={monthlyProductionTarget}
                  onChange={(e) => setMonthlyProductionTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Energy options */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Primary Grid Electricity</span>
                </label>
                <select 
                  value={electricitySource}
                  onChange={(e) => {
                    setElectricitySource(e.target.value);
                    // Standard coefficients based on fuel mix
                    if (e.target.value === 'coal') setGridFactor('0.85');
                    else if (e.target.value === 'gas') setGridFactor('0.38');
                    else if (e.target.value === 'renewable') setGridFactor('0.05');
                    else setGridFactor('0.42');
                  }}
                  className="w-full px-2 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
                >
                  <option value="grid">Standard Regional Grid Mix</option>
                  <option value="coal">Coal-Fired Captive Plant</option>
                  <option value="gas">Natural Gas Cogeneration</option>
                  <option value="renewable">100% Contracted Renewable</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Grid Emission Factor (tons CO₂/MWh)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={gridFactor}
                  onChange={(e) => setGridFactor(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Solar Availability toggle */}
              <div className="md:col-span-2 p-3 bg-neutral-900/40 border border-neutral-900 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <div>
                    <span className="text-xs font-medium text-white block">Renewable Solar Microgrid</span>
                    <span className="text-[10px] text-neutral-500">Is on-site solar PV peak power generation active?</span>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={solarAvailability}
                  onChange={(e) => setSolarAvailability(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {solarAvailability && (
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Installed Solar Peak Power Capacity (kW peak)
                  </label>
                  <input 
                    type="number"
                    value={solarCapacity}
                    onChange={(e) => setSolarCapacity(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              )}

              {/* Generator details & hours */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Backup Diesel Generator Use
                </label>
                <select 
                  value={generatorUsage}
                  onChange={(e) => setGeneratorUsage(e.target.value)}
                  className="w-full px-2 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none"
                >
                  <option value="none">None (Utility Grid Only)</option>
                  <option value="occasional">Occasional (Emergency Only)</option>
                  <option value="frequent">Frequent (Weak Utility Stability)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Facility Shift Working Hours</span>
                </label>
                <input 
                  type="number"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Total On-Site Employees</span>
                </label>
                <input 
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1 text-emerald-400">
                  <Target className="w-3.5 h-3.5" />
                  <span>Carbon Target Limit (ton CO₂/mo) *</span>
                </label>
                <input 
                  type="number"
                  required
                  value={carbonTarget}
                  onChange={(e) => setCarbonTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-emerald-900/50 rounded text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Onboard Facility &amp; Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-neutral-500 font-mono">
              Already registered? <span onClick={() => setTab('login')} className="text-emerald-400 hover:underline cursor-pointer">Log in to existing portal</span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
