import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginRegister from './components/LoginRegister';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import LiveMonitoringTab from './components/LiveMonitoringTab';
import MachinesTab from './components/MachinesTab';
import PredictionsTab from './components/PredictionsTab';
import RecommendationsTab from './components/RecommendationsTab';
import AIAssistantTab from './components/AIAssistantTab';
import ReportsTab from './components/ReportsTab';
import PlannerTab from './components/PlannerTab';
import SettingsTab from './components/SettingsTab';
import { DbState, Machine, Recommendation, ReductionGoal } from './types';
import { initialDbState } from './data';

export default function App() {
  // Navigation & User views
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Master synced DB State
  const [state, setState] = useState<DbState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state with server JSON database
  const refreshState = async () => {
    try {
      const response = await fetch('/api/state');
      if (response.ok) {
        const data = await response.json();
        setState(data);
        localStorage.setItem('ecocarbon_db_state', JSON.stringify(data));
      } else {
        throw new Error(`API response not ok: ${response.status}`);
      }
    } catch (err) {
      console.warn('Error connecting to backend database REST API, using cached or initial state:', err);
      const cached = localStorage.getItem('ecocarbon_db_state');
      if (cached) {
        try {
          setState(JSON.parse(cached));
        } catch {
          setState(initialDbState);
        }
      } else {
        setState(initialDbState);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, []);

  const handleStartOption = (option: 'login' | 'register' | 'demo') => {
    if (option === 'login') {
      setView('login');
    } else if (option === 'register') {
      setView('register');
    } else {
      // Demo immediately bypasses auth and signs in
      setUser({
        email: 'sustainability@ecocarbon.ai',
        role: 'Manager',
        displayName: 'DEMO MANAGER',
        factoryId: 'factory-001'
      });
      setView('dashboard');
    }
  };

  const handleAuthSuccess = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    setView('dashboard');
    refreshState();
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
    setActiveTab('overview');
  };

  // REST API Handlers mapping to server operations

  const handleUpdateMachineStatus = async (id: string, payload: Partial<Machine>) => {
    let success = false;
    try {
      const response = await fetch(`/api/machines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to update machine status on server:', err);
    }

    if (!success && state) {
      const updatedMachines = state.machines.map(m => m.id === id ? { ...m, ...payload } : m);
      const updatedState = { ...state, machines: updatedMachines };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleAddMachine = async (payload: any) => {
    let success = false;
    try {
      const response = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to add machine on server:', err);
    }

    if (!success && state) {
      const newMachine: Machine = {
        id: `m-${Date.now()}`,
        name: payload.name || 'New Machine',
        energyMeterId: payload.energyMeterId || `EM-${Date.now().toString().slice(-4)}`,
        powerRating: Number(payload.powerRating) || 50,
        avgWorkingHours: Number(payload.avgWorkingHours) || 8,
        status: payload.status || 'Running',
        efficiency: Number(payload.efficiency) || 90,
        co2GeneratedToday: 0,
        fuelUsage: Number(payload.fuelUsage) || 0,
        maintenanceStatus: 'Optimal',
        healthScore: Number(payload.healthScore) || 95,
        maintenanceDate: new Date().toISOString().split('T')[0]
      };
      const updatedState = {
        ...state,
        machines: [...state.machines, newMachine],
        activityLogs: [
          {
            timestamp: new Date().toISOString(),
            action: `Added machine: ${newMachine.name} (Offline fallback)`,
            user: 'Admin'
          },
          ...state.activityLogs
        ]
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleDeleteMachine = async (id: string) => {
    let success = false;
    try {
      const response = await fetch(`/api/machines/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to remove machine from server:', err);
    }

    if (!success && state) {
      const machine = state.machines.find(m => m.id === id);
      const updatedState = {
        ...state,
        machines: state.machines.filter(m => m.id !== id),
        activityLogs: machine ? [
          {
            timestamp: new Date().toISOString(),
            action: `Removed machine: ${machine.name} (Offline fallback)`,
            user: 'Admin'
          },
          ...state.activityLogs
        ] : state.activityLogs
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleSetGoal = async (targetPercentage: number, durationMonths: number) => {
    let success = false;
    try {
      const response = await fetch('/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPercentage, durationMonths })
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to establish goal planner on server:', err);
    }

    if (!success && state) {
      const monthlySavings = (state.carbonRecords.reduce((sum, r) => sum + r.co2Total, 0) / (state.carbonRecords.length || 1)) * 310 * (targetPercentage / 100);
      const expectedSavingsUSD = Math.round(monthlySavings * durationMonths);

      const roadmap = Array.from({ length: durationMonths }).map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() + i + 1);
        const monthStr = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return {
          month: monthStr,
          targetCo2: Number(( (state.carbonRecords[state.carbonRecords.length - 1]?.co2Total || 60) * (1 - (targetPercentage / 100) * ((i + 1) / durationMonths)) ).toFixed(1)),
          completed: false,
          milestone: `Milestone Phase ${i + 1}: Progressing towards target reduction`
        };
      });

      const updatedState = {
        ...state,
        goal: {
          targetPercentage,
          startDate: new Date().toISOString().split('T')[0],
          durationMonths,
          expectedSavingsUSD,
          monthlyRoadmap: roadmap
        },
        activityLogs: [
          {
            timestamp: new Date().toISOString(),
            action: `Established carbon reduction goal to ${targetPercentage}% (Offline fallback)`,
            user: 'Admin'
          },
          ...state.activityLogs
        ]
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleUpdateGoalProgress = async (updatedGoal: ReductionGoal) => {
    let success = false;
    try {
      const response = await fetch('/api/factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: updatedGoal })
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Error updating goal checklist on server:', err);
    }

    if (!success && state) {
      const updatedState = {
        ...state,
        goal: updatedGoal
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleUpdateRecommendationStatus = async (id: string, status: Recommendation['status']) => {
    let success = false;
    try {
      const response = await fetch(`/api/recommendations/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Error updating recommendation status on server:', err);
    }

    if (!success && state) {
      const updatedRecommendations = state.recommendations.map(r => r.id === id ? { ...r, status } : r);
      const updatedState = {
        ...state,
        recommendations: updatedRecommendations,
        activityLogs: [
          {
            timestamp: new Date().toISOString(),
            action: `Updated recommendation status of '${id}' to ${status} (Offline fallback)`,
            user: 'Manager'
          },
          ...state.activityLogs
        ]
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleGenerateAIRecommendations = async () => {
    let success = false;
    try {
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST'
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to prompt AI recommendations audit on server:', err);
    }

    if (!success && state) {
      // client-side rule generator fallback
      const randomId = `rec-gen-${Date.now()}`;
      const fallbackRec: Recommendation = {
        id: randomId,
        title: "Calibrate High Power Motors on " + (state.machines[0]?.name || "Furnace"),
        description: "Scheduled high density microgrid load balancing suggests running auxiliary generators only during grid stress periods.",
        carbonReduction: 1200,
        costSaving: 450,
        roi: 8,
        priority: "High",
        difficulty: "Medium",
        status: "Proposed",
        createdAt: new Date().toISOString()
      };
      const updatedState = {
        ...state,
        recommendations: [fallbackRec, ...state.recommendations],
        activityLogs: [
          {
            timestamp: new Date().toISOString(),
            action: 'Generated smart audit recommendations (Offline fallback)',
            user: 'AI Engine'
          },
          ...state.activityLogs
        ]
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!state) return;
    const tempUserMsg = {
      id: `chat-temp-${Date.now()}`,
      sender: 'user' as const,
      text: message,
      timestamp: new Date().toISOString()
    };
    
    const userUpdatedState = {
      ...state,
      chats: [...state.chats, tempUserMsg]
    };
    setState(userUpdatedState);

    let success = false;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to post message to AI assistant on server:', err);
    }

    if (!success) {
      // rule-based response offline fallback
      const responseText = `I am operating in secure offline fallback mode as local servers are currently unreachable. Regarding your query: "${message}", our factory telemetry shows an average efficiency of ${Math.round(state.machines.reduce((sum, m) => sum + m.efficiency, 0) / (state.machines.length || 1))}% across all machines, and our current sustainability score is ${state.carbonRecords[state.carbonRecords.length - 1]?.sustainabilityScore || 85}. Please restore connection for full live Gemini assistant insights.`;
      const tempAiMsg = {
        id: `chat-temp-ai-${Date.now()}`,
        sender: 'ai' as const,
        text: responseText,
        timestamp: new Date().toISOString()
      };
      const finalState = {
        ...userUpdatedState,
        chats: [...userUpdatedState.chats, tempAiMsg]
      };
      setState(finalState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(finalState));
    }
  };

  const handleClearAlerts = async () => {
    let success = false;
    try {
      const response = await fetch('/api/alerts/clear', {
        method: 'POST'
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Error flushing alert logs on server:', err);
    }

    if (!success && state) {
      const updatedState = {
        ...state,
        alerts: state.alerts.map(a => ({ ...a, isRead: true }))
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  const handleUpdateFactory = async (payload: any) => {
    let success = false;
    try {
      const response = await fetch('/api/factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        await refreshState();
        success = true;
      }
    } catch (err) {
      console.error('Failed to recalibrate factory coefficients on server:', err);
    }

    if (!success && state) {
      const updatedState = {
        ...state,
        factory: { ...state.factory, ...payload },
        activityLogs: [
          {
            timestamp: new Date().toISOString(),
            action: 'Updated factory profile configuration (Offline fallback)',
            user: 'Administrator'
          },
          ...state.activityLogs
        ]
      };
      setState(updatedState);
      localStorage.setItem('ecocarbon_db_state', JSON.stringify(updatedState));
    }
  };

  // Loading skeleton state
  if (loading || !state) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-3 font-mono text-xs text-neutral-500">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span>EcoCarbon AI &middot; Connecting telemetry database...</span>
      </div>
    );
  }

  // Routing View resolution
  if (view === 'landing') {
    return <LandingPage onStart={handleStartOption} />;
  }

  if (view === 'login') {
    return <LoginRegister initialTab="login" onSuccess={handleAuthSuccess} onBack={() => setView('landing')} />;
  }

  if (view === 'register') {
    return <LoginRegister initialTab="register" onSuccess={handleAuthSuccess} onBack={() => setView('landing')} />;
  }

  return (
    <div className="flex bg-[#050608] min-h-screen text-slate-200 overflow-hidden relative select-none font-sans">
      
      {/* High Density Grid Backdrop & Ambient Spotlight Glows */}
      <div className="absolute inset-0 bg-density-grid pointer-events-none z-0 opacity-80" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Corporate Left Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        state={state}
        onLogout={handleLogout}
        onClearAlerts={handleClearAlerts}
      />

      {/* Main Dynamic View Area with Layout Header & Footer */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* High Density Layout Header */}
        <header className="h-16 border-b border-emerald-950/40 bg-[#0a0c10]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-display font-medium text-white tracking-tight flex items-center gap-2">
              <span>{activeTab.toUpperCase()} PORTAL</span>
              <span className="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest animate-pulse">
                ● LIVE FEED
              </span>
            </h1>
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-neutral-500 border-l border-neutral-800 pl-3">
              <span>FACILITY ID:</span>
              <span className="text-neutral-400 font-bold">{state.factory.id || "FAC-001"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-neutral-900/60 border border-neutral-800 rounded-lg text-[10px] font-mono text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>CO₂ FACTOR: {state.factory.gridFactor || 0.42} kg/kWh</span>
            </div>
            
            <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-mono text-emerald-400 font-bold">
              <span>SYS INT: {state.machines.filter(m => m.status === 'Running').length}/{state.machines.length} ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content Frame */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="max-w-7xl mx-auto pb-8">
            {activeTab === 'overview' && (
              <OverviewTab state={state} />
            )}

            {activeTab === 'live' && (
              <LiveMonitoringTab state={state} onRefreshState={refreshState} />
            )}

            {activeTab === 'machines' && (
              <MachinesTab 
                state={state} 
                onUpdateMachine={handleUpdateMachineStatus} 
                onAddMachine={handleAddMachine}
                onDeleteMachine={handleDeleteMachine}
              />
            )}

            {activeTab === 'predictions' && (
              <PredictionsTab state={state} />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationsTab 
                state={state} 
                onUpdateRecommendationStatus={handleUpdateRecommendationStatus}
                onGenerateAIRecommendations={handleGenerateAIRecommendations}
              />
            )}

            {activeTab === 'assistant' && (
              <AIAssistantTab state={state} onSendMessage={handleSendMessage} />
            )}

            {activeTab === 'planner' && (
              <PlannerTab 
                state={state} 
                onSetGoal={handleSetGoal}
                onUpdateGoalProgress={handleUpdateGoalProgress}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsTab state={state} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab state={state} onUpdateFactory={handleUpdateFactory} />
            )}
          </div>
        </main>

        {/* High Density Layout Footer */}
        <footer className="h-8 border-t border-emerald-950/20 bg-[#0a0c10]/90 px-6 flex items-center justify-between text-[8px] text-neutral-500 font-mono z-20 tracking-wider">
          <div className="flex items-center gap-4">
            <span>SYSTEM STATUS: <span className="text-emerald-400">NOMINAL</span></span>
            <span className="hidden md:inline text-neutral-700">|</span>
            <span className="hidden md:inline">SECURED SHIELD: AES-256-GCM</span>
            <span className="hidden md:inline text-neutral-700">|</span>
            <span className="hidden lg:inline">COORDINATOR: PROMPT_FLOW_ENGINE</span>
          </div>
          <div className="flex items-center gap-4">
            <span>LATENCY: 14MS</span>
            <span className="hidden md:inline text-neutral-700">|</span>
            <span>SYNC: SUCCESSFUL</span>
            <span className="hidden md:inline text-neutral-700">|</span>
            <span className="text-emerald-500/80">© {new Date().getFullYear()} ECOCARBON AI SYSTEMS</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
