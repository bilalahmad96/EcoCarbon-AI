import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { initialDbState } from './src/data.js';
import { DbState, Machine, Recommendation, Alert, ChatMessage, ReductionGoal } from './src/types.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persistent store
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'factory_db.json');

// Ensure data directory and DB file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load current state or seed default
function loadState(): DbState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB file, falling back to default:', err);
  }
  
  // Initialize with initialDbState and write
  saveState(initialDbState);
  return initialDbState;
}

function saveState(state: DbState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// Initialize Gemini Client
const aiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (aiApiKey && aiApiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  console.log('Gemini API client successfully initialized.');
} else {
  console.warn('GEMINI_API_KEY is not defined or is placeholder. AI actions will run on smart rules engine fallback.');
}

// Helper to calculate emissions on active machines
function updateEmissionsAndScores(state: DbState) {
  const factory = state.factory;
  const machines = state.machines;
  
  // Standard emission factors
  const gridFactor = factory.gridFactor || 0.42; // tons CO2/MWh -> 0.42 kg CO2/kWh
  const dieselFactor = 2.68; // kg CO2 per liter diesel
  const coalFactor = 2.41; // kg CO2 per kg coal
  const gasFactor = 1.95; // kg CO2 per cubic meter natural gas
  
  // Calculate today's emissions based on running machines
  let totalTodayKw = 0;
  let totalDieselLiters = 0;
  
  machines.forEach((m) => {
    if (m.status === 'Running') {
      // power rating * hrs running / day
      const kw = m.powerRating * (m.avgWorkingHours / 24) * 24; // kWh/day
      totalTodayKw += kw;
      if (m.fuelUsage) {
        totalDieselLiters += m.fuelUsage;
      }
      
      // machine-specific co2 calculation
      const machineCo2 = (kw * gridFactor) + (m.fuelUsage * dieselFactor);
      m.co2GeneratedToday = Math.round(machineCo2);
    } else if (m.status === 'Idle') {
      // idle machines consume 15% of active load
      const kw = m.powerRating * 0.15 * (m.avgWorkingHours / 24) * 24;
      totalTodayKw += kw;
      m.co2GeneratedToday = Math.round(kw * gridFactor);
    } else {
      m.co2GeneratedToday = 0;
    }
  });

  // Calculate overall factory sustainability score (0-100)
  // Factors: energy efficiency (avg machine efficiency), solar utilization, carbon targets, generator usage
  const avgEfficiency = machines.reduce((sum, m) => sum + m.efficiency, 0) / (machines.length || 1);
  const avgHealth = machines.reduce((sum, m) => sum + m.healthScore, 0) / (machines.length || 1);
  
  let solarBonus = factory.solarAvailability ? 15 : 0;
  let generatorPenalty = factory.generatorUsage === 'frequent' ? -15 : factory.generatorUsage === 'occasional' ? -5 : 0;
  
  // base score from machine performance
  let score = (avgEfficiency * 0.4) + (avgHealth * 0.3) + solarBonus + generatorPenalty + 20;
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  // Generate alerts for poor machine status
  machines.forEach((m) => {
    if (m.status === 'Running' && m.efficiency < 70) {
      const alertExists = state.alerts.some(a => a.message.includes(m.name) && a.type === 'machine_anomaly');
      if (!alertExists) {
        state.alerts.unshift({
          id: `alert-m-${m.id}-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'machine_anomaly',
          severity: 'Critical',
          message: `Efficiency critical: Machine '${m.name}' is running at ${m.efficiency}% efficiency. Maintenance recommended.`,
          isRead: false
        });
      }
    }
  });

  return score;
}

// AUTH REST ENDPOINTS
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  // Standard mock SaaS login
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  res.json({
    token: 'mock-jwt-token-ecocarbon',
    user: {
      email,
      role: role || 'Manager',
      displayName: email.split('@')[0].toUpperCase(),
      factoryId: 'factory-001'
    }
  });
});

// STATE REST ENDPOINTS
app.get('/api/state', (req, res) => {
  const state = loadState();
  const currentSustainabilityScore = updateEmissionsAndScores(state);
  // sync sustainability score into the latest carbon record
  if (state.carbonRecords.length > 0) {
    state.carbonRecords[state.carbonRecords.length - 1].sustainabilityScore = currentSustainabilityScore;
  }
  saveState(state);
  res.json(state);
});

app.post('/api/factory', (req, res) => {
  const state = loadState();
  state.factory = { ...state.factory, ...req.body };
  state.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: 'Updated factory profile configuration',
    user: 'Administrator'
  });
  saveState(state);
  res.json({ success: true, factory: state.factory });
});

// MACHINE OPERATIONS
app.post('/api/machines', (req, res) => {
  const state = loadState();
  const newMachine: Machine = {
    id: `m-${Date.now()}`,
    name: req.body.name || 'New Inverter Machine',
    energyMeterId: req.body.energyMeterId || `EM-${Date.now().toString().slice(-4)}`,
    powerRating: Number(req.body.powerRating) || 50,
    avgWorkingHours: Number(req.body.avgWorkingHours) || 8,
    status: req.body.status || 'Running',
    efficiency: Number(req.body.efficiency) || 90,
    co2GeneratedToday: 0,
    fuelUsage: Number(req.body.fuelUsage) || 0,
    maintenanceStatus: 'Optimal',
    healthScore: Number(req.body.healthScore) || 95,
    maintenanceDate: new Date().toISOString().split('T')[0]
  };
  
  state.machines.push(newMachine);
  state.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Added machine: ${newMachine.name}`,
    user: 'Admin'
  });
  updateEmissionsAndScores(state);
  saveState(state);
  res.json({ success: true, machine: newMachine });
});

app.put('/api/machines/:id', (req, res) => {
  const state = loadState();
  const index = state.machines.findIndex(m => m.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Machine not found' });
  
  const oldMachine = state.machines[index];
  state.machines[index] = { ...oldMachine, ...req.body };
  
  if (req.body.status && req.body.status !== oldMachine.status) {
    state.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Changed status of ${oldMachine.name} to ${req.body.status}`,
      user: 'Manager'
    });
  } else if (req.body.maintenanceDate) {
    state.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: `Scheduled maintenance for ${oldMachine.name} on ${req.body.maintenanceDate}`,
      user: 'Engineer'
    });
  }

  updateEmissionsAndScores(state);
  saveState(state);
  res.json({ success: true, machine: state.machines[index] });
});

app.delete('/api/machines/:id', (req, res) => {
  const state = loadState();
  const machine = state.machines.find(m => m.id === req.params.id);
  if (!machine) return res.status(404).json({ error: 'Machine not found' });
  
  state.machines = state.machines.filter(m => m.id !== req.params.id);
  state.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Removed machine: ${machine.name}`,
    user: 'Admin'
  });
  updateEmissionsAndScores(state);
  saveState(state);
  res.json({ success: true });
});

// GOAL PLANNER
app.post('/api/goal', (req, res) => {
  const state = loadState();
  const { targetPercentage, durationMonths } = req.body;
  
  const expectedSavingsUSD = Math.round((targetPercentage * 0.01) * 35000 * durationMonths);
  const monthlyRoadmap = [];
  const startYearMonth = new Date();
  
  for (let i = 1; i <= durationMonths; i++) {
    const d = new Date(startYearMonth);
    d.setMonth(d.getMonth() + i);
    const monthStr = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    const targetCo2 = Math.round(state.factory.carbonTarget * (1 - (targetPercentage * 0.01 * (i / durationMonths))));
    
    monthlyRoadmap.push({
      month: monthStr,
      targetCo2,
      completed: false,
      milestone: i === 1 ? `Analyze leak points and calibrate heavy machines` : 
                 i === Math.ceil(durationMonths / 2) ? `Instate sub-meter solar array linkages` :
                 i === durationMonths ? `Complete final net-zero reduction verification` : `Incremental carbon optimization program`
    });
  }

  const goal: ReductionGoal = {
    targetPercentage,
    startDate: new Date().toISOString().split('T')[0],
    durationMonths,
    expectedSavingsUSD,
    monthlyRoadmap
  };

  state.goal = goal;
  state.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Established new ${targetPercentage}% Carbon Reduction Goal`,
    user: 'Factory Manager'
  });

  saveState(state);
  res.json({ success: true, goal });
});

// TOGGLE RECOMMENDATION STATUS
app.post('/api/recommendations/:id/status', (req, res) => {
  const state = loadState();
  const rec = state.recommendations.find(r => r.id === req.params.id);
  if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
  
  const oldStatus = rec.status;
  rec.status = req.body.status;
  
  state.activityLogs.unshift({
    timestamp: new Date().toISOString(),
    action: `Updated recommendation '${rec.title}' to ${rec.status}`,
    user: 'Manager'
  });

  // If applied, generate an alert acknowledging it
  if (rec.status === 'Active') {
    state.alerts.unshift({
      id: `alert-rec-${rec.id}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'carbon_limit',
      severity: 'Info',
      message: `Action Plan Commissioned: '${rec.title}' is now active. Estimated reduction: ${rec.carbonReduction} kg CO2/month.`,
      isRead: false
    });
  }

  saveState(state);
  res.json({ success: true, recommendation: rec });
});

// CLEAR ALERTS
app.post('/api/alerts/clear', (req, res) => {
  const state = loadState();
  state.alerts.forEach(a => a.isRead = true);
  saveState(state);
  res.json({ success: true });
});

// GEMINI-POWERED AI RECOMMENDATIONS ENGINE
app.post('/api/recommendations/generate', async (req, res) => {
  const state = loadState();
  const factory = state.factory;
  const machines = state.machines;

  if (!aiClient) {
    // Mock recommendations fallback if no API key is available
    return res.json({
      success: true,
      recommendations: state.recommendations
    });
  }

  try {
    const prompt = `
      You are an expert industrial carbon consultant. Analyze this smart manufacturing factory profile:
      Name: ${factory.name}
      Industry: ${factory.industryType}
      Electricity Grid Factor: ${factory.gridFactor} tons CO2/MWh
      Solar Available: ${factory.solarAvailability ? 'Yes' : 'No'}
      Generator Use: ${factory.generatorUsage}
      Machines Installed: ${JSON.stringify(machines.map(m => ({ name: m.name, kw: m.powerRating, efficiency: m.efficiency, status: m.status })))}
      
      Generate exactly 3 actionable, premium carbon reduction recommendations. Respond in strict JSON format with an array of objects matching this TS interface:
      interface Recommendation {
        title: string;
        description: string;
        carbonReduction: number; // estimated kg CO2 reduced per month
        costSaving: number; // estimated USD saved per month
        roi: number; // estimated payback period in months
        priority: 'High' | 'Medium' | 'Low';
        difficulty: 'Easy' | 'Medium' | 'Hard';
      }
      Do not include markdown tags like \`\`\`json, return only the valid stringified JSON array.
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });

    const responseText = response.text || '[]';
    // Clean potential markdown wrapped backticks
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const generatedRecommendations = JSON.parse(cleanJsonText);

    const mappedRecs: Recommendation[] = generatedRecommendations.map((r: any, idx: number) => ({
      id: `ai-rec-${Date.now()}-${idx}`,
      title: r.title,
      description: r.description,
      carbonReduction: Number(r.carbonReduction) || 1200,
      costSaving: Number(r.costSaving) || 500,
      roi: Number(r.roi) || 6,
      priority: r.priority || 'Medium',
      difficulty: r.difficulty || 'Easy',
      status: 'Proposed',
      createdAt: new Date().toISOString()
    }));

    // Insert new ones at the beginning
    state.recommendations = [...mappedRecs, ...state.recommendations];
    state.activityLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'Triggered AI carbon reduction recommendations audit',
      user: 'EcoCarbon AI Assistant'
    });

    saveState(state);
    res.json({ success: true, recommendations: state.recommendations });
  } catch (error: any) {
    console.error('Gemini Recommendation Generation Error:', error);
    res.status(500).json({ error: 'AI Recommendations engine error', details: error.message });
  }
});

// GEMINI-POWERED FUTURE PREDICTION MODULE
app.post('/api/predictions/generate', async (req, res) => {
  const state = loadState();
  const { productionIncrease, efficiencyBoost } = req.body; // user scenario multipliers
  
  const baseMonthlyCo2 = state.carbonRecords.reduce((acc, cr) => acc + cr.co2Total, 0) / (state.carbonRecords.length || 1);
  
  if (!aiClient) {
    // High-quality smart heuristic math algorithm if no API key is set
    const pIncrease = Number(productionIncrease || 0) / 100; // e.g. 0.20
    const eBoost = Number(efficiencyBoost || 0) / 100; // e.g. 0.10
    
    const modifier = (1 + pIncrease) * (1 - eBoost);
    const baseVal = baseMonthlyCo2 || 62.0;

    const tomorrow = Math.round((baseVal / 30) * modifier * 10) / 10;
    const nextWeek = Math.round((baseVal / 4) * modifier * 10) / 10;
    const nextMonth = Math.round(baseVal * modifier * 10) / 10;
    const nextYear = Math.round((baseVal * 12) * modifier * 0.9 * 10) / 10; // assumes 10% grid decarbonization next year

    return res.json({
      success: true,
      source: 'smart-heuristic-model',
      confidenceScore: Math.round(92 - pIncrease * 10 + eBoost * 5),
      tomorrow,
      nextWeek,
      nextMonth,
      nextYear,
      historicalAvg: baseMonthlyCo2,
      impactAnalysis: `Production increase of ${productionIncrease}% combined with custom hardware efficiency boost of ${efficiencyBoost}% translates to an estimated carbon balance shift of ${Math.round((modifier - 1) * 100)}% over standard baseline operation.`
    });
  }

  try {
    const prompt = `
      You are an industrial climate forecasting model. Forecast carbon emissions (in Metric Tonnes CO2) for EcoCarbon Alloys Factory.
      Factory specs:
      Industry: ${state.factory.industryType}
      Historical monthly average emission: ${baseMonthlyCo2.toFixed(2)} tonnes
      Active Machine Count: ${state.machines.filter(m => m.status === 'Running').length}
      Total Machines Connected: ${state.machines.length}
      
      User-Simulated Scenario:
      - Production increase target: +${productionIncrease || 0}%
      - Average machine efficiency boost: +${efficiencyBoost || 0}%

      Calculate logical estimates. Respond in strict JSON format:
      {
        "tomorrow": number,      // 1-day CO2 emissions forecast in Tonnes (e.g., 2.1)
        "nextWeek": number,      // 7-day CO2 forecast in Tonnes
        "nextMonth": number,     // 30-day CO2 forecast in Tonnes
        "nextYear": number,      // 12-month cumulative CO2 forecast in Tonnes
        "confidenceScore": number, // 0-100 scale based on parameters
        "impactAnalysis": "string explaining how the efficiency offsets the production surge in detailed thermodynamic and carbon tracking terminology."
      }
      Do not include markdown tags, return only raw stringified JSON.
    `;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });

    const responseText = response.text || '{}';
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const predictionResult = JSON.parse(cleanJsonText);

    res.json({
      success: true,
      source: 'gemini-3.5-flash',
      ...predictionResult
    });
  } catch (error: any) {
    console.error('Gemini Prediction Error:', error);
    res.status(500).json({ error: 'AI Prediction engine failure', details: error.message });
  }
});

// GEMINI-POWERED AI SUSTAINABILITY CHAT ASSISTANT
app.post('/api/chat', async (req, res) => {
  const state = loadState();
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Create User message
  const userMsg: ChatMessage = {
    id: `chat-u-${Date.now()}`,
    sender: 'user',
    text: message,
    timestamp: new Date().toISOString()
  };
  state.chats.push(userMsg);

  if (!aiClient) {
    // Clean mock assistant responses based on keywords if no API key
    let aiText = "I see your question. Without an active Gemini API Key, I am running in local diagnostic mode. ";
    const msgLower = message.toLowerCase();
    
    if (msgLower.includes('machine') || msgLower.includes('pollut')) {
      const worst = state.machines.reduce((max, m) => m.co2GeneratedToday > max.co2GeneratedToday ? m : max, state.machines[0]);
      aiText += `Based on current telemetry, the most polluting machine today is '${worst.name}' generating ${worst.co2GeneratedToday} kg CO2. Increasing its efficiency from ${worst.efficiency}% to 95% would lower factory output significantly.`;
    } else if (msgLower.includes('reduce') || msgLower.includes('save') || msgLower.includes('money')) {
      aiText += `You can achieve immediate cost and carbon savings of $1,450/month and 3.8 tonnes of CO2/month by adopting off-peak operation hours on heavy press motors (HFP-2).`;
    } else if (msgLower.includes('score') || msgLower.includes('sustainability')) {
      const active = state.machines.filter(m => m.status === 'Running').length;
      aiText += `Your current overall factory Sustainability Score is ${state.carbonRecords[state.carbonRecords.length - 1]?.sustainabilityScore || 85}/100. This is calculated from your solar microgrid percentage, machine operational health, and grid offsets.`;
    } else {
      aiText += `EcoCarbon Smart Alloys currently emits approximately ${state.carbonRecords[state.carbonRecords.length - 1]?.co2Total || 61.0} metric tonnes of CO2 per month, operating within standard government carbon cap parameters. Please add your GEMINI_API_KEY in Settings > Secrets to unlock full contextual AI reasoning!`;
    }

    const aiMsg: ChatMessage = {
      id: `chat-ai-${Date.now()}`,
      sender: 'ai',
      text: aiText,
      timestamp: new Date().toISOString()
    };
    state.chats.push(aiMsg);
    saveState(state);
    return res.json({ success: true, response: aiText, chats: state.chats });
  }

  try {
    // Formulate a rich context-aware prompt about the factory's current database state
    const systemPrompt = `
      You are the premium virtual "EcoCarbon AI Sustainability Assistant" built into the industrial carbon dashboard. 
      You answer industrial factory managers, engineers, and corporate climate compliance officers.
      Be concise, professional, insightful, and cite specific data from the current factory state provided below.

      CURRENT FACTORY STATE:
      Factory Name: ${state.factory.name}
      Industry Type: ${state.factory.industryType}
      Factory Address: ${state.factory.address}
      Monthly Production Target: ${state.factory.monthlyProductionTarget} tonnes
      Cumulative Monthly Carbon Target Limit: ${state.factory.carbonTarget} tonnes CO2
      Solar Integration: ${state.factory.solarAvailability ? `Yes, with ${state.factory.solarCapacity || 100} kW peak capacity` : 'No'}
      Generator Usage: ${state.factory.generatorUsage}
      Grid Carbon Emission Factor: ${state.factory.gridFactor || 0.42} tons CO2/MWh

      INSTALLED TELEMETRY MACHINES:
      ${JSON.stringify(state.machines.map(m => ({
        id: m.id,
        name: m.name,
        energyMeter: m.energyMeterId,
        powerRatingKw: m.powerRating,
        runningHours: m.avgWorkingHours,
        status: m.status,
        efficiencyPercentage: m.efficiency,
        carbonGeneratedTodayKg: m.co2GeneratedToday,
        healthScore: m.healthScore,
        maintenance: m.maintenanceStatus
      })))}

      CURRENT REDUCTION GOAL PLAN:
      ${state.goal ? `${state.goal.targetPercentage}% carbon reduction over ${state.goal.durationMonths} months, expected USD savings: $${state.goal.expectedSavingsUSD}` : 'None configured yet.'}

      ACTIVE ALERTS:
      ${JSON.stringify(state.alerts.filter(a => !a.isRead).map(a => a.message))}

      Respond to the user message in natural, highly readable markdown. Answer questions regarding why emissions are increasing, machine comparison analysis, grid versus clean solar offsets, carbon intensity calculation, and financial ROI strategies directly and precisely.
    `;

    // Package previous context
    const chatHistory = state.chats.slice(-10).map(c => ({
      role: c.sender === 'user' ? 'user' : 'model',
      parts: [{ text: c.text }]
    }));

    // Generate content using modern GoogleGenAI API
    const chatSession = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...chatHistory
      ]
    });

    const responseText = chatSession.text || "I was unable to compile a response. Please check database connectivity.";

    const aiMsg: ChatMessage = {
      id: `chat-ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toISOString()
    };
    state.chats.push(aiMsg);
    saveState(state);

    res.json({ success: true, response: responseText, chats: state.chats });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: 'AI Assistant failed', details: error.message });
  }
});

// VITE MIDDLEWARE SETUP FOR PRODUCTION & DEVELOPMENT
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for local UI development HMR.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset serving configured for dist/ directory.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoCarbon AI Server successfully listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
