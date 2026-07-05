import React, { useState, useEffect } from 'react';
import { 
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
  TrendingUp, 
  Activity, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  Cpu, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { DbState } from '../types';

interface PredictionsTabProps {
  state: DbState;
}

export default function PredictionsTab({ state }: PredictionsTabProps) {
  const [productionIncrease, setProductionIncrease] = useState(20); // default +20%
  const [efficiencyBoost, setEfficiencyBoost] = useState(10); // default +10%
  
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/predictions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productionIncrease, efficiencyBoost })
      });
      const data = await response.json();
      if (response.ok) {
        setPredictionData(data);
      }
    } catch (err) {
      console.error('Error fetching prediction forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger forecast fetch on mount and slider release
  useEffect(() => {
    fetchForecast();
  }, [productionIncrease, efficiencyBoost]);

  // Chart data formatting comparing baseline monthly versus forecast
  const baseAvg = predictionData?.historicalAvg || 61.0;
  const forecastMonth = predictionData?.nextMonth || 65.0;

  const comparisonData = [
    { name: 'Baseline Monthly', 'Standard CO₂ (t)': Math.round(baseAvg * 10) / 10, 'Scenario Forecast CO₂ (t)': 0 },
    { name: 'Predicted Scenario', 'Standard CO₂ (t)': 0, 'Scenario Forecast CO₂ (t)': Math.round(forecastMonth * 10) / 10 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-sans font-medium text-white flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>AI-Powered Predictive Carbon Forecasting</span>
        </h2>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">Simulate factory expansions, hardware upgrades, and seasonal shifts on environmental indicators.</p>
      </div>

      {/* Slider Scenario Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Control Card */}
        <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 space-y-6 lg:col-span-1">
          <h3 className="text-sm font-sans font-medium text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Scenario Simulator Playground</span>
          </h3>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Drag the parameters to evaluate how scaling monthly production metrics interacts with machine motor energy-efficiency calibrations.
          </p>

          {/* Slider 1: Production Increase */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400">Production Output Scaling</span>
              <span className="text-red-400 font-bold">+{productionIncrease}% tons</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={productionIncrease}
              onChange={(e) => setProductionIncrease(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-neutral-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-neutral-600">
              <span>Standard Baseline</span>
              <span>Double Output (+100%)</span>
            </div>
          </div>

          {/* Slider 2: Efficiency Optimizations */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-neutral-400">Machinery VFD Efficiency Boost</span>
              <span className="text-emerald-400 font-bold">+{efficiencyBoost}% avg</span>
            </div>
            <input 
              type="range"
              min="0"
              max="40"
              value={efficiencyBoost}
              onChange={(e) => setEfficiencyBoost(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-neutral-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-neutral-600">
              <span>Standard (Grid EF)</span>
              <span>Premium VFD Drive (+40%)</span>
            </div>
          </div>

          {/* Forecast status */}
          <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-center gap-2 text-[10px] font-mono text-neutral-400">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Live Sync: AI forecasting models compile on release.</span>
          </div>
        </div>

        {/* Prediction Results Block */}
        <div className="lg:col-span-2 bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-neutral-400">Forecast Calculations (Metric Tonnes CO₂ Equivalent)</span>
              {predictionData?.confidenceScore && (
                <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">
                  Confidence Score: {predictionData.confidenceScore}%
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-2 text-xs font-mono text-neutral-500">
                <Activity className="w-8 h-8 text-emerald-400 animate-spin" />
                <span>Gemini compiling thermodynamic curves...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Day */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Tomorrow</span>
                  <h4 className="text-2xl font-semibold text-white tracking-tight mt-1">
                    {predictionData?.tomorrow ? predictionData.tomorrow.toFixed(1) : '2.1'} t
                  </h4>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1 block">Daily intensity</span>
                </div>

                {/* Week */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Next Week</span>
                  <h4 className="text-2xl font-semibold text-white tracking-tight mt-1">
                    {predictionData?.nextWeek ? predictionData.nextWeek.toFixed(1) : '14.5'} t
                  </h4>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1 block">Cumulative 7 days</span>
                </div>

                {/* Month */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl border-emerald-500/10">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Next Month</span>
                  <h4 className="text-2xl font-semibold text-emerald-400 tracking-tight mt-1">
                    {predictionData?.nextMonth ? predictionData.nextMonth.toFixed(1) : '62.0'} t
                  </h4>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1 block">Monthly prediction</span>
                </div>

                {/* Year */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Next Year</span>
                  <h4 className="text-2xl font-semibold text-cyan-400 tracking-tight mt-1">
                    {predictionData?.nextYear ? predictionData.nextYear.toFixed(0) : '710'} t
                  </h4>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1 block">12-month projection</span>
                </div>

              </div>
            )}

            {/* Explanatory impact text */}
            {predictionData?.impactAnalysis && (
              <div className="mt-5 p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl text-xs text-neutral-400 leading-relaxed font-sans">
                <strong className="text-white block mb-1">Thermodynamic &amp; Carbon Impact Analysis:</strong>
                {predictionData.impactAnalysis}
              </div>
            )}
          </div>

          <div className="text-[9px] text-neutral-500 font-mono text-right mt-4">
            Analysis engine: <span className="text-emerald-400">{predictionData?.source || 'Gemini Core'}</span> &middot; Carbon Target: {state.factory.carbonTarget} tonnes/month
          </div>
        </div>

      </div>

      {/* Comparison Graph Row */}
      <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6">
        <h3 className="text-sm font-sans font-medium text-white mb-4">Carbon Footprint Shift (Scenario Comparison)</h3>
        
        <div className="h-64 w-full font-mono text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1917" />
              <XAxis dataKey="name" stroke="#444" />
              <YAxis stroke="#444" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23', borderRadius: '12px' }}
              />
              <Legend />
              <Bar dataKey="Standard CO₂ (t)" fill="#737373" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario Forecast CO₂ (t)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
