export interface Factory {
  id: string;
  name: string;
  industryType: string;
  address: string;
  productionCapacity: number; // in tonnes/month
  electricitySource: string; // 'grid' | 'coal' | 'gas' | 'renewable'
  solarAvailability: boolean;
  solarCapacity?: number; // in kW
  generatorUsage: string; // 'none' | 'occasional' | 'frequent'
  workingHours: number; // hrs/day
  employees: number;
  monthlyProductionTarget: number;
  carbonTarget: number; // CO2 target in tonnes/month
  gridFactor?: number; // tons CO2 per MWh
}

export type MachineStatus = 'Running' | 'Idle' | 'Stopped';

export interface Machine {
  id: string;
  name: string;
  energyMeterId: string;
  powerRating: number; // kW
  avgWorkingHours: number;
  status: MachineStatus;
  efficiency: number; // %
  co2GeneratedToday: number; // kg CO2
  fuelUsage: number; // liters/day
  maintenanceStatus: string; // 'Optimal' | 'Pending Service' | 'Needs Attention'
  healthScore: number; // 0-100
  maintenanceDate?: string;
}

export interface EnergyRecord {
  timestamp: string; // ISO string
  gridConsumption: number; // kWh
  dieselConsumption: number; // Liters
  solarGeneration: number; // kWh
  totalCo2: number; // kg
}

export interface ProductionRecord {
  timestamp: string;
  volume: number; // Tonnes
  unit: string;
}

export interface CarbonRecord {
  timestamp: string;
  co2Grid: number;
  co2Diesel: number;
  co2Total: number;
  sustainabilityScore: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  carbonReduction: number; // kg CO2/month
  costSaving: number; // USD/month
  roi: number; // months to break even
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Proposed' | 'Active' | 'Completed' | 'Ignored';
  createdAt: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'carbon_limit' | 'power_spike' | 'machine_anomaly' | 'sensor_offline';
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ReductionGoal {
  targetPercentage: number;
  startDate: string;
  durationMonths: number;
  expectedSavingsUSD: number;
  monthlyRoadmap: {
    month: string;
    targetCo2: number;
    completed: boolean;
    milestone: string;
  }[];
}

export interface DbState {
  factory: Factory;
  machines: Machine[];
  energyRecords: EnergyRecord[];
  productionRecords: ProductionRecord[];
  carbonRecords: CarbonRecord[];
  recommendations: Recommendation[];
  alerts: Alert[];
  chats: ChatMessage[];
  goal: ReductionGoal | null;
  activityLogs: { timestamp: string; action: string; user: string }[];
}
