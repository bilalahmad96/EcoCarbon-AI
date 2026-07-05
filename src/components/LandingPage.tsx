import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  TrendingUp, 
  LineChart, 
  ArrowRight, 
  ArrowDown, 
  Leaf, 
  Sparkles,
  Award,
  Settings,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onStart: (tab: 'login' | 'register' | 'demo') => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const features = [
    {
      icon: <Activity className="w-6 h-6 text-emerald-400" />,
      title: 'Real-Time Carbon Monitoring',
      description: 'Stream live energy usage, grid emission coefficients, and diesel combustion tracking automatically.'
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: 'Machine-Wise Emission Analysis',
      description: 'Audit telemetry at individual motor levels, identifying inefficient cycles, high heat losses, and standby leaks.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      title: 'Future Carbon Prediction',
      description: 'Utilize server-side predictive forecasting to forecast emissions across tomorrow, next week, and next year.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
      title: 'AI Recommendation Engine',
      description: 'Actionable optimization blueprints mapping ROI, cost savings, and prioritized difficulty levels.'
    },
    {
      icon: <LineChart className="w-6 h-6 text-emerald-400" />,
      title: 'IoT Sensor Integration Ready',
      description: 'Seamlessly link current, voltage, and temperature telemetry directly from smart electric meters.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: 'Carbon Compliance Certifications',
      description: 'Maintain strict regional compliance under global ESG and clean air environmental directives.'
    }
  ];

  const steps = [
    { step: '01', title: 'Register Factory', desc: 'Define your industry, production capacity, employees, and electricity sources.' },
    { step: '02', title: 'Link Telemetry Meters', desc: 'Register smart sub-meters and machinery to monitor power ratings.' },
    { step: '03', title: 'Live Carbon Audits', desc: 'Platform auto-calculates CO2 intensity based on active grid coefficients.' },
    { step: '04', title: 'AI Prediction & Chat', desc: 'Predict impact of production surges and chat with our virtual expert.' }
  ];

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Abstract Background Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Hero Section */}
      <header className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 md:py-32 flex flex-col items-center text-center">
        
        {/* Futuristic Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-mono tracking-wider uppercase mb-8"
        >
          <Leaf className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Generation Industrial AI Platform</span>
        </motion.div>

        {/* Catchy Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-sans font-medium tracking-tight bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent max-w-5xl leading-tight"
        >
          Monitor. <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Predict.</span> Reduce.
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mt-6 font-light leading-relaxed"
        >
          AI-Powered Carbon Emission Monitoring &amp; Energy Optimization Dashboard for Smart Manufacturing Industries. Achieve Carbon Net-Zero compliance with absolute precision.
        </motion.p>

        {/* Main CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 justify-center w-full max-w-md"
        >
          <button 
            onClick={() => onStart('register')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold rounded-lg shadow-[0_4px_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer group"
          >
            <span>Start Monitoring</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => onStart('demo')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-medium rounded-lg transition-all cursor-pointer"
          >
            <span>Launch Live Demo</span>
          </button>
        </motion.div>

        {/* Simulated Metric Cards for Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full mt-20 p-6 bg-neutral-950/60 border border-neutral-900 rounded-2xl backdrop-blur-md"
        >
          <div className="flex flex-col p-4 border-r border-neutral-900/60 last:border-none">
            <span className="text-3xl font-sans font-medium text-white tracking-tight">410 t</span>
            <span className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-mono">Monthly Baseline CO₂</span>
          </div>
          <div className="flex flex-col p-4 border-r border-neutral-900/60 last:border-none">
            <span className="text-3xl font-sans font-medium text-emerald-400 tracking-tight">-28.4%</span>
            <span className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-mono">Carbon Reduction</span>
          </div>
          <div className="flex flex-col p-4 border-r border-neutral-900/60 last:border-none">
            <span className="text-3xl font-sans font-medium text-cyan-400 tracking-tight">$18,600</span>
            <span className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-mono">Energy Savings</span>
          </div>
          <div className="flex flex-col p-4 last:border-none">
            <span className="text-3xl font-sans font-medium text-emerald-500 tracking-tight">86 / 100</span>
            <span className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-mono">Sustainability Score</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <ArrowDown className="w-5 h-5 text-neutral-600" />
        </div>
      </header>

      {/* About Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-20 border-t border-neutral-900 bg-neutral-950/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">
              <Award className="w-4 h-4" />
              <span>ESG &amp; Carbon Auditing</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-white">
              Navigating Regulatory Tariffs and Volatile Power Grids
            </h2>
            <p className="text-neutral-400 mt-6 leading-relaxed">
              Industrial smart manufacturing sectors represent over 30% of global greenhouse emissions. With strict government tax regulations, volatile electrical grid pricing, and high pressure from corporate ESG compliance bodies, factories can no longer afford black-box resource consumption.
            </p>
            <p className="text-neutral-400 mt-4 leading-relaxed">
              <strong>EcoCarbon AI</strong> integrates deep sensor telemetry and real-time grid carbon factors to continuously evaluate energy consumption, diesel generator load, and micro-grid solar benefits. We provide actionable, localized AI blueprints that optimize machinery schedules, trim peak demand, and lower energy expenditures.
            </p>
          </div>
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
            <h3 className="text-lg font-sans font-medium text-white mb-6">Critical Industry Challenges Solved</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-red-500/10 text-red-400 rounded mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Standby Inefficiencies</h4>
                  <p className="text-xs text-neutral-500 mt-1">Industrial heavy air compressors drawing up to 30% nominal load during idle periods.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-500/10 text-yellow-400 rounded mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Grid Peak Pricing Traps</h4>
                  <p className="text-xs text-neutral-500 mt-1">Heavy melting furnaces operating during peak hours drawing high carbon and high tariffs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Manual Reporting Bottlenecks</h4>
                  <p className="text-xs text-neutral-500 mt-1">Unconsolidated logs across spreadsheets taking days to compile for environmental audits.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-semibold text-white tracking-tight">
            Comprehensive Carbon Management Suite
          </h2>
          <p className="text-neutral-400 mt-3 max-w-xl mx-auto text-sm md:text-base font-light">
            Every analytical interface and tool inside EcoCarbon AI is precision engineered to deliver professional diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div 
              key={i}
              className="bg-neutral-950/40 hover:bg-neutral-900/40 border border-neutral-900 hover:border-emerald-500/20 p-6 rounded-2xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-neutral-900 rounded-xl border border-neutral-800 mb-5 shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-lg font-sans font-medium text-white">{f.title}</h3>
              <p className="text-neutral-500 text-sm mt-2 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-20 border-t border-neutral-900 bg-neutral-950/20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-sans font-semibold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-neutral-400 mt-3 max-w-xl mx-auto text-sm">
            Onboard your smart factory and activate real-time intelligence in four quick steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col relative group">
              <div className="text-5xl font-mono font-bold text-neutral-800 group-hover:text-emerald-500/20 transition-colors mb-3">
                {s.step}
              </div>
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{s.title}</span>
              </h3>
              <p className="text-neutral-500 text-sm mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-16 mb-20">
        <div className="bg-gradient-to-r from-emerald-950/30 to-neutral-950 border border-emerald-500/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-xl relative">
            <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight text-white leading-tight">
              Ready to automate your Sustainability Strategy?
            </h2>
            <p className="text-neutral-400 mt-4 font-light text-sm md:text-base">
              Set up your factory parameters, customize sub-meters, and use the Google Gemini engine to formulate immediate reduction roadmaps.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative w-full md:w-auto">
            <button 
              onClick={() => onStart('register')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap"
            >
              Onboard Factory
            </button>
            <button 
              onClick={() => onStart('login')}
              className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-medium rounded-lg transition-all cursor-pointer text-center"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-neutral-950 text-center text-xs text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div>&copy; 2026 EcoCarbon AI Inc. All Rights Reserved.</div>
        <div className="flex gap-4">
          <span className="hover:text-emerald-400 transition-colors">Privacy Policy</span>
          <span>&middot;</span>
          <span className="hover:text-emerald-400 transition-colors">Compliance Directives</span>
          <span>&middot;</span>
          <span className="hover:text-emerald-400 transition-colors">SaaS Terms</span>
        </div>
      </footer>

    </div>
  );
}
