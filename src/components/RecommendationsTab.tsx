import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Award, 
  Activity, 
  ArrowUpRight, 
  Zap, 
  Check, 
  X,
  Play
} from 'lucide-react';
import { DbState, Recommendation } from '../types';

interface RecommendationsTabProps {
  state: DbState;
  onUpdateRecommendationStatus: (id: string, status: Recommendation['status']) => Promise<void>;
  onGenerateAIRecommendations: () => Promise<void>;
}

export default function RecommendationsTab({ state, onUpdateRecommendationStatus, onGenerateAIRecommendations }: RecommendationsTabProps) {
  const { recommendations } = state;
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerateAIRecommendations();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Medium Priority</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400">Low Priority</span>;
    }
  };

  const getDifficultyBadge = (difficulty: Recommendation['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Easy Setup</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Moderate</span>;
      case 'Hard':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20">Capital Intensive</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-sans font-medium text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>AI carbon reduction recommendations &amp; Audits</span>
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">Custom energy optimization directives formulated specifically for your active machinery loads.</p>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'AI Compiling Audits...' : 'Audit Factory with Gemini AI'}</span>
        </button>
      </div>

      {/* Aggregate Savings Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 bg-neutral-950/60 border border-neutral-900 rounded-xl">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Estimated Cumulative Reduction</span>
          <h3 className="text-2xl font-semibold text-emerald-400 tracking-tight mt-1">14.0 Tonnes CO₂</h3>
          <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">per month across all optimizations</span>
        </div>

        <div className="p-5 bg-neutral-950/60 border border-neutral-900 rounded-xl">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Estimated Financial Cost Savings</span>
          <h3 className="text-2xl font-semibold text-cyan-400 tracking-tight mt-1">$4,770 USD</h3>
          <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">reduction in monthly grid utility bills</span>
        </div>

        <div className="p-5 bg-neutral-950/60 border border-neutral-900 rounded-xl">
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Average Implementation Payback</span>
          <h3 className="text-2xl font-semibold text-white tracking-tight mt-1">13.5 Months</h3>
          <span className="text-[9px] text-neutral-500 font-mono mt-0.5 block">mean capital ROI amortization rate</span>
        </div>

      </div>

      {/* Recommendations List Container */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-12 border border-neutral-900 bg-neutral-950/20 rounded-2xl text-xs text-neutral-500 font-mono">
            No active carbon reduction suggestions available. Click 'Audit Factory with Gemini AI' to generate strategy cards.
          </div>
        ) : (
          recommendations.map((rec) => (
            <div 
              key={rec.id}
              className={`border p-6 rounded-2xl transition-all relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${rec.status === 'Active' ? 'bg-emerald-950/10 border-emerald-500/20' : rec.status === 'Completed' ? 'bg-neutral-900/40 border-neutral-800' : rec.status === 'Ignored' ? 'opacity-40 bg-neutral-950/20 border-neutral-900' : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800'}`}
            >
              
              {/* Highlight bar */}
              {rec.status === 'Active' && <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500" />}

              {/* Main descriptive block */}
              <div className="space-y-3 max-w-2xl">
                
                {/* Badges row */}
                <div className="flex flex-wrap gap-2 items-center">
                  {getPriorityBadge(rec.priority)}
                  {getDifficultyBadge(rec.difficulty)}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    &middot; Status: <span className="font-bold text-white">{rec.status}</span>
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h4 className="text-sm font-sans font-medium text-white flex items-center gap-1.5">
                    <span>{rec.title}</span>
                    {rec.id.startsWith('ai-rec') && (
                      <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] font-mono rounded border border-cyan-500/20 uppercase tracking-widest">AI Generated</span>
                    )}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-sans">{rec.description}</p>
                </div>

                {/* Savings values */}
                <div className="grid grid-cols-3 gap-4 border-t border-neutral-900/60 pt-3 text-[10px] font-mono uppercase text-neutral-500">
                  <div>
                    <span>CO₂ Saved:</span>
                    <span className="text-emerald-400 font-bold block text-sm mt-0.5">-{rec.carbonReduction} kg/mo</span>
                  </div>
                  <div>
                    <span>Capital Saved:</span>
                    <span className="text-cyan-400 font-bold block text-sm mt-0.5">${rec.costSaving}/mo</span>
                  </div>
                  <div>
                    <span>Amortization ROI:</span>
                    <span className="text-white font-bold block text-sm mt-0.5">
                      {rec.roi === 0 ? 'Instant' : `${rec.roi} Months`}
                    </span>
                  </div>
                </div>

              </div>

              {/* Actions segment */}
              <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                {rec.status === 'Proposed' && (
                  <>
                    <button 
                      onClick={() => onUpdateRecommendationStatus(rec.id, 'Active')}
                      className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Implement</span>
                    </button>
                    
                    <button 
                      onClick={() => onUpdateRecommendationStatus(rec.id, 'Ignored')}
                      className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-xs font-medium rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Ignore</span>
                    </button>
                  </>
                )}

                {rec.status === 'Active' && (
                  <button 
                    onClick={() => onUpdateRecommendationStatus(rec.id, 'Completed')}
                    className="px-3.5 py-2 bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                )}

                {(rec.status === 'Completed' || rec.status === 'Ignored') && (
                  <button 
                    onClick={() => onUpdateRecommendationStatus(rec.id, 'Proposed')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-400 rounded cursor-pointer"
                  >
                    Revert to Proposed
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
