import React from 'react';
import { 
  Building2, 
  Activity, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  Bot, 
  FileText, 
  Target, 
  Settings, 
  LogOut,
  Bell,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DbState } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  state: DbState;
  onLogout: () => void;
  onClearAlerts: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, state, onLogout, onClearAlerts }: SidebarProps) {
  const { alerts } = state;
  const unreadAlerts = alerts.filter(a => !a.isRead);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="w-4 h-4" /> },
    { id: 'live', label: 'Live Monitoring', icon: <Activity className="w-4 h-4 animate-pulse text-emerald-400" /> },
    { id: 'machines', label: 'Machinery Telemetry', icon: <Cpu className="w-4 h-4" /> },
    { id: 'predictions', label: 'AI Forecasting', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'recommendations', label: 'AI Recommendations', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'assistant', label: 'AI Virtual Expert', icon: <Bot className="w-4 h-4" /> },
    { id: 'planner', label: 'Carbon Goal Planner', icon: <Target className="w-4 h-4" /> },
    { id: 'reports', label: 'Audit & Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 bg-[#0a0c10] border-r border-emerald-950/40 flex flex-col justify-between h-screen sticky top-0 shrink-0 font-sans z-30">
      
      {/* Top logo visual segment */}
      <div className="p-4 border-b border-emerald-950/20">
        <div className="flex items-center gap-2.5">
          {/* Custom vector Carbon Atom + Leaf Minimal logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/20 shrink-0">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">EcoCarbon <span className="text-emerald-500 underline decoration-2">AI</span></span>
            <span className="text-[8px] font-mono tracking-widest text-neutral-500 uppercase block">Sustainability OS</span>
          </div>
        </div>
      </div>

      {/* Main navigation listings */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <span className="text-[8px] font-mono tracking-widest text-neutral-600 uppercase px-2.5 block mb-2">Facility Modules</span>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[11px] font-mono tracking-wide transition-all cursor-pointer ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>

            {/* Smart badges for alerts or AI items */}
            {item.id === 'live' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}

            {item.id === 'recommendations' && state.recommendations.filter(r => r.status === 'Proposed').length > 0 && (
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] rounded border border-emerald-500/30 font-bold">
                {state.recommendations.filter(r => r.status === 'Proposed').length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom user profile & alerts segment */}
      <div className="p-3 border-t border-emerald-950/20 bg-[#07080c] space-y-3">
        
        {/* Alerts panel indicator */}
        {unreadAlerts.length > 0 ? (
          <div 
            onClick={onClearAlerts}
            className="p-2 bg-yellow-950/15 border border-yellow-500/20 rounded-lg flex items-center justify-between cursor-pointer group hover:bg-yellow-950/25 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 text-yellow-500 group-hover:rotate-12 transition-transform" />
              <div>
                <span className="text-[9px] text-yellow-500 font-bold block">Compliance Alerts</span>
                <span className="text-[7px] text-neutral-500 block mt-0.5 font-mono">{unreadAlerts.length} warnings unread</span>
              </div>
            </div>
            <span className="text-[7px] font-mono text-neutral-600 group-hover:text-neutral-400">Clear</span>
          </div>
        ) : (
          <div className="p-2 bg-neutral-900/30 border border-neutral-900/60 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <div>
              <span className="text-[9px] text-emerald-500 font-bold block">Grid Compliance</span>
              <span className="text-[7px] text-neutral-500 block mt-0.5 font-mono">Zero current anomalies</span>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className="flex items-center justify-between p-1.5 bg-[#0a0c10] border border-neutral-800/40 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-[10px]">
              {user.displayName?.slice(0, 2) || 'M'}
            </div>
            <div className="leading-tight">
              <span className="text-white font-medium text-[11px] block">{user.displayName || 'Manager'}</span>
              <span className="text-[8px] text-neutral-500 font-mono block mt-0.5 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span>{user.role || 'Manager'} Preset</span>
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={onLogout}
            title="Disconnect portal"
            className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </aside>
  );
}
