import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  Leaf, 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  Building2,
  Calendar
} from 'lucide-react';
import { DbState } from '../types';

interface OverviewTabProps {
  state: DbState;
}

export default function OverviewTab({ state }: OverviewTabProps) {
  const { factory, carbonRecords, machines, alerts } = state;
  const currentRecord = carbonRecords[carbonRecords.length - 1] || { co2Total: 61, sustainabilityScore: 85 };
  
  // Calculate dynamic metrics
  const activeMachinesCount = machines.filter(m => m.status === 'Running').length;
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;
  
  // Real-time calculated total carbon generated today from active machines list
  const totalCo2TodayKg = machines.reduce((sum, m) => sum + m.co2GeneratedToday, 0);
  const totalCo2TodayTons = Math.round((totalCo2TodayKg / 1000) * 10) / 10;
  
  // Current month's projection based on current active rate
  const monthlyProjectionTons = Math.round(currentRecord.co2Total * 1.05 * 10) / 10;
  const carbonTarget = factory.carbonTarget || 120;
  const targetPercentage = Math.min(100, Math.round((currentRecord.co2Total / carbonTarget) * 100));

  // Clean formatted chart data
  const chartData = carbonRecords.map(r => ({
    month: new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short' }),
    'Grid CO₂ (t)': Math.round(r.co2Grid * 10) / 10,
    'Diesel CO₂ (t)': Math.round(r.co2Diesel * 10) / 10,
    'Total CO₂ (t)': Math.round(r.co2Total * 10) / 10,
    'Target Limit': carbonTarget,
    Score: r.sustainabilityScore
  }));

  // Helper for color rating of sustainability
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 60) return 'text-yellow-400 stroke-yellow-400';
    return 'text-red-400 stroke-red-400';
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gradient-to-r from-[#0a0c10] to-[#0c0f15] border border-emerald-950/40 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-display font-medium text-white tracking-tight">{factory.name}</h2>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{factory.industryType} &middot; {factory.address}</p>
          </div>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2 text-xs font-mono">
          <div className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
            <span className="text-neutral-500 mr-2 uppercase text-[8px] tracking-wider">Date:</span>
            <span className="text-emerald-400 font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Sustainability Score Gauge */}
        <div className="high-density-card rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden md:col-span-1">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Sustainability index</span>
          
          {/* Svg Circle Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center mt-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
              <circle 
                cx="72" 
                cy="72" 
                r="60" 
                className="stroke-neutral-900 fill-transparent" 
                strokeWidth="8"
              />
              <circle 
                cx="72" 
                cy="72" 
                r="60" 
                className={`fill-transparent transition-all duration-1000 ${getScoreColorClass(currentRecord.sustainabilityScore)}`} 
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - currentRecord.sustainabilityScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-semibold text-white tracking-tight">{currentRecord.sustainabilityScore}</span>
              <span className="text-[8px] font-mono text-neutral-500 uppercase">Score</span>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono rounded-full mt-3 border border-emerald-500/20">
            <Award className="w-3 h-3" />
            <span>Class A Compliance</span>
          </div>
        </div>

        {/* Card 2: CO2 Emission Stats */}
        <div className="high-density-card rounded-xl p-4 flex flex-col justify-between md:col-span-1">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Daily rate</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <h3 className="text-3xl font-display font-medium text-white tracking-tight">{totalCo2TodayTons} t</h3>
              <span className="text-[10px] text-neutral-500 font-mono">CO₂ today</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">Calculated across {activeMachinesCount} active machine telemetry feeds.</p>
          </div>
          
          <div className="pt-3 border-t border-neutral-900 mt-3">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-neutral-500">Live Load Intensity:</span>
              <span className="text-cyan-400 font-bold">{Math.round(totalCo2TodayKg / (activeMachinesCount || 1))} kg/hr</span>
            </div>
          </div>
        </div>

        {/* Card 3: Monthly Carbon Audit vs Target */}
        <div className="high-density-card rounded-xl p-4 flex flex-col justify-between md:col-span-1">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Current Month Cumulative</span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <h3 className="text-3xl font-display font-medium text-emerald-400 tracking-tight">{currentRecord.co2Total.toFixed(1)} t</h3>
              <span className="text-[10px] text-neutral-500 font-mono">/ {carbonTarget} t cap</span>
            </div>
            
            {/* Target Progress Bar */}
            <div className="w-full bg-neutral-900 h-1.5 rounded-full mt-3 overflow-hidden border border-neutral-900">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${targetPercentage > 90 ? 'bg-red-500' : targetPercentage > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                style={{ width: `${targetPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 mt-1.5">
              <span>{targetPercentage}% of limit used</span>
              <span>{(carbonTarget - currentRecord.co2Total).toFixed(1)} t remaining</span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-900 mt-3 flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-500">Predicted Balance:</span>
            <span className={`font-bold ${monthlyProjectionTons < carbonTarget ? 'text-emerald-400' : 'text-red-400'}`}>
              {monthlyProjectionTons < carbonTarget ? 'Below Cap (Optimal)' : 'Cap Exceeded Risk'}
            </span>
          </div>
        </div>

        {/* Card 4: Energy Efficiency & Grid Mix */}
        <div className="high-density-card rounded-xl p-4 flex flex-col justify-between md:col-span-1">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Clean Energy Offsets</span>
            
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <h3 className="text-3xl font-display font-medium text-cyan-400 tracking-tight">
                {factory.solarAvailability ? '24.2%' : '0%'}
              </h3>
              <span className="text-[10px] text-neutral-500 font-mono">Solar power mix</span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
              On-site solar microgrid offsets grid consumption of carbon intensive hours.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-900 mt-3">
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-neutral-500">Meters linked:</span>
              <span className="text-white font-semibold">6 Telemetries</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-neutral-500">Active Alert logs:</span>
              <span className={`font-bold ${unreadAlertsCount > 0 ? 'text-yellow-400' : 'text-neutral-500'}`}>
                {unreadAlertsCount} warnings
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Glow Area Chart: 6 Months Carbon Trend */}
        <div className="lg:col-span-2 high-density-card rounded-xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-display font-medium text-white">Carbon Footprint Trend (6 Months)</h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Calculated in Metric Tonnes CO₂ equivalent</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[9px] font-mono text-neutral-400">
              <Calendar className="w-3 h-3" />
              <span>Jan - Jun 2026</span>
            </div>
          </div>
          
          <div className="h-64 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" />
                <XAxis dataKey="month" stroke="#444" />
                <YAxis stroke="#444" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23', borderRadius: '8px' }}
                  labelStyle={{ color: '#aaa', fontWeight: 'bold' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="Total CO₂ (t)" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Target Limit" 
                  stroke="#ef4444" 
                  strokeWidth={1.5}
                  strokeDasharray="5 5" 
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked Bar Chart: Energy Grid Breakdown */}
        <div className="high-density-card rounded-xl p-4 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-display font-medium text-white">Emission Fuel Distribution</h3>
            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">Comparing electricity grid vs back-up diesel generators</p>
          </div>

          <div className="h-64 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" />
                <XAxis dataKey="month" stroke="#444" />
                <YAxis stroke="#444" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="Grid CO₂ (t)" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Diesel CO₂ (t)" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Critical Alert Snippet */}
      {alerts.some(a => !a.isRead) && (
        <div className="p-4 bg-yellow-950/20 border border-yellow-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-500">Active Factory Anomaly Logs detected</h4>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Industrial sensors flagged machine performance drops and electrical fluctuations. Visit the Alerts sidebar or machines page to check specific diagnostics.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
