import React, { useState } from 'react';
import { 
  Target, 
  TrendingDown, 
  DollarSign, 
  Award, 
  CheckCircle, 
  Layers, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DbState, ReductionGoal } from '../types';

interface PlannerTabProps {
  state: DbState;
  onSetGoal: (targetPercentage: number, durationMonths: number) => Promise<void>;
  onUpdateGoalProgress: (updatedGoal: ReductionGoal) => Promise<void>;
}

export default function PlannerTab({ state, onSetGoal, onUpdateGoalProgress }: PlannerTabProps) {
  const { goal, factory } = state;

  // Setting local form states
  const [target, setTarget] = useState(30); // default 30% reduction
  const [duration, setDuration] = useState(6); // default 6 months
  const [loading, setLoading] = useState(false);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSetGoal(target, duration);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMonth = async (monthIdx: number) => {
    if (!goal) return;
    const updatedRoadmap = [...goal.monthlyRoadmap];
    updatedRoadmap[monthIdx].completed = !updatedRoadmap[monthIdx].completed;
    
    await onUpdateGoalProgress({
      ...goal,
      monthlyRoadmap: updatedRoadmap
    });
  };

  // Calculate completed metrics
  const completedMonths = goal?.monthlyRoadmap.filter(m => m.completed).length || 0;
  const totalMonths = goal?.monthlyRoadmap.length || 1;
  const progressPercentage = Math.round((completedMonths / totalMonths) * 100);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-sans font-medium text-white flex items-center gap-1.5">
          <Target className="w-5 h-5 text-emerald-400" />
          <span>Carbon Reduction Planner &amp; Roadmap</span>
        </h2>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">Establish corporate ESG carbon targets and formulate action plans to achieve net-zero milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goal Creator Column */}
        <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 h-fit space-y-6">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Target Setting Workspace</span>
          </h3>
          
          <form onSubmit={handleCreateGoal} className="space-y-5">
            
            {/* Target Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-neutral-400">Target Carbon Reduction</span>
                <span className="text-emerald-400 font-bold">{target}% Saved</span>
              </div>
              <input 
                type="range"
                min="10"
                max="50"
                step="5"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-neutral-900 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-neutral-600">
                <span>Standard (-10%)</span>
                <span>Aggressive (-50%)</span>
              </div>
            </div>

            {/* Duration select */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-neutral-400 uppercase">Implementation Timeline</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-2 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white"
              >
                <option value={3}>3 Months (Rapid Optimization)</option>
                <option value={6}>6 Months (Standard Transition)</option>
                <option value={12}>12 Months (Full Strategic Audit)</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{loading ? 'Compiling Roadmap...' : 'Generate AI Action Roadmap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Current Target Summary */}
          <div className="p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-500">Grid Target:</span>
              <span className="text-white font-bold">{factory.carbonTarget} t CO₂/mo</span>
            </div>
            <div className="flex justify-between border-t border-neutral-800 pt-2 text-emerald-400">
              <span>Goal Target Limit:</span>
              <span className="font-bold">{Math.round(factory.carbonTarget * (1 - target * 0.01))} t CO₂/mo</span>
            </div>
          </div>
        </div>

        {/* Current Roadmap & Checklist Column */}
        <div className="lg:col-span-2 space-y-6">
          {goal ? (
            <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-6 space-y-6">
              
              {/* Top stats bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-neutral-900 pb-5">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">Roadmap Progress</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-2xl font-bold text-white tracking-tight">{progressPercentage}%</h4>
                    <span className="text-[10px] text-neutral-500 font-mono">({completedMonths}/{totalMonths} mos)</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">Target Reduction</span>
                  <div className="flex items-baseline gap-1 mt-1 text-emerald-400 font-bold">
                    <h4 className="text-2xl tracking-tight">-{goal.targetPercentage}%</h4>
                    <span className="text-[10px] font-mono">CO₂</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase font-bold text-cyan-400">Expected savings</span>
                  <div className="flex items-baseline gap-1 mt-1 text-cyan-400 font-bold">
                    <h4 className="text-2xl tracking-tight">${goal.expectedSavingsUSD.toLocaleString()}</h4>
                    <span className="text-[10px] font-mono">USD</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-900">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>Start: {goal.startDate}</span>
                  <span>Timeline Status: {completedMonths === totalMonths ? 'Goal Accomplished!' : 'In Transition'}</span>
                </div>
              </div>

              {/* Timeline list */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase text-neutral-400">Monthly Transition Steps Checklist</h4>
                
                <div className="space-y-2">
                  {goal.monthlyRoadmap.map((m, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleToggleMonth(idx)}
                      className={`p-4 border rounded-xl flex items-start gap-4 transition-all cursor-pointer ${m.completed ? 'bg-emerald-950/10 border-emerald-500/20 text-neutral-300' : 'bg-neutral-900/30 border-neutral-900 hover:border-neutral-800 text-white'}`}
                    >
                      <input 
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => {}} // handled by outer click
                        className="w-4.5 h-4.5 rounded border-neutral-800 text-emerald-500 focus:ring-emerald-500 mt-0.5 cursor-pointer shrink-0"
                      />
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className={`font-semibold ${m.completed ? 'text-neutral-500' : 'text-white'}`}>{m.month}</span>
                          <span className="text-[10px] font-bold text-emerald-400">Limit: {m.targetCo2} t CO₂</span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${m.completed ? 'text-neutral-500 line-through' : 'text-neutral-400'}`}>
                          {m.milestone}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-8 text-center text-xs font-mono text-neutral-500 flex flex-col items-center justify-center py-20 space-y-4">
              <Award className="w-12 h-12 text-neutral-700 animate-bounce" />
              <div>
                <p className="font-bold text-neutral-400">No Carbon Reduction Target configured</p>
                <p className="text-[10px] text-neutral-600 mt-1 max-w-sm">Use the Target Setting Workspace on the left to configure carbon reduction targets and map monthly milestones.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
