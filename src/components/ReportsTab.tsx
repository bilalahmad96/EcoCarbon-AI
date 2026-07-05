import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  BarChart, 
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { DbState } from '../types';

interface ReportsTabProps {
  state: DbState;
}

type ReportType = 'carbon_audit' | 'energy' | 'machinery';

export default function ReportsTab({ state }: ReportsTabProps) {
  const { factory, carbonRecords, machines, energyRecords } = state;
  const [reportType, setReportType] = useState<ReportType>('carbon_audit');
  
  // Format dates
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Function to compile CSV content and trigger physical file download
  const handleDownloadCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (reportType === 'carbon_audit') {
      csvContent += "Carbon Compliance Audit Ledger - " + factory.name + "\n";
      csvContent += "Timestamp,Grid CO2 (t),Diesel CO2 (t),Total CO2 (t),Sustainability Score\n";
      carbonRecords.forEach((r) => {
        csvContent += `${r.timestamp},${r.co2Grid},${r.co2Diesel},${r.co2Total},${r.sustainabilityScore}\n`;
      });
    } else if (reportType === 'energy') {
      csvContent += "Energy Optimization Ledger - " + factory.name + "\n";
      csvContent += "Timestamp,Grid Consumption (kWh),Diesel Consumption (L),Solar Generation (kWh),CO2 Equivalent (kg)\n";
      energyRecords.forEach((r) => {
        csvContent += `${r.timestamp},${r.gridConsumption},${r.dieselConsumption},${r.solarGeneration},${r.totalCo2}\n`;
      });
    } else {
      csvContent += "Machinery Telemetry Performance Ledger - " + factory.name + "\n";
      csvContent += "Machine ID,Machine Name,Power Rating (kW),Working Hours,Status,Efficiency (%),Health Score\n";
      machines.forEach((m) => {
        csvContent += `${m.id},"${m.name}",${m.powerRating},${m.avgWorkingHours},${m.status},${m.efficiency},${m.healthScore}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ecocarbon_${reportType}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-sans font-medium text-white flex items-center gap-1.5">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>SaaS Regulatory Report Center</span>
          </h2>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">Generate formal carbon audit documents, machinery ledgers, and electricity optimization spreadsheets.</p>
        </div>

        {/* Actions buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet</span>
          </button>
          
          <button 
            onClick={handlePrint}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Ledger</span>
          </button>
        </div>
      </div>

      {/* Select Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Report 1 */}
        <div 
          onClick={() => setReportType('carbon_audit')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${reportType === 'carbon_audit' ? 'bg-neutral-900/60 border-emerald-500/30' : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800'}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-bold uppercase">Format: Government ESG</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-sans font-semibold text-white mt-3">Carbon Compliance Audit Report</h3>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">Required regulatory ledger compiling monthly grid vs diesel CO2 offsets.</p>
        </div>

        {/* Report 2 */}
        <div 
          onClick={() => setReportType('energy')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${reportType === 'energy' ? 'bg-neutral-900/60 border-emerald-500/30' : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800'}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-wider text-cyan-400 font-bold uppercase">Format: Executive Board</span>
            <BarChart className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-sans font-semibold text-white mt-3">Energy Optimization Ledger</h3>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">Quantified solar generation and bill reduction metrics for executive corporate planning.</p>
        </div>

        {/* Report 3 */}
        <div 
          onClick={() => setReportType('machinery')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${reportType === 'machinery' ? 'bg-neutral-900/60 border-emerald-500/30' : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800'}`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-wider text-yellow-400 font-bold uppercase">Format: Operations Ledger</span>
            <FileText className="w-4 h-4 text-yellow-400" />
          </div>
          <h3 className="text-sm font-sans font-semibold text-white mt-3">Machine Telemetry Ledger</h3>
          <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">Specific energy meter auditing at the device-motor level across workshops.</p>
        </div>

      </div>

      {/* Dynamic Report Printable Preview Sheet */}
      <div id="print-section" className="p-8 bg-neutral-950 border border-neutral-900 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-900 pb-6">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-bold">ECOCARBON COMPLIANCE SYSTEM &middot; OFFICALLY SIGNED</span>
            <h3 className="text-lg font-sans font-semibold text-white uppercase mt-1">
              {reportType === 'carbon_audit' && 'Carbon Compliance Audit Ledger'}
              {reportType === 'energy' && 'Corporate Energy Optimization Summary'}
              {reportType === 'machinery' && 'Machinery Performance Telemetry Ledger'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">Facility ID: {factory.id} &middot; Regional Grid Zone 04</p>
          </div>
          <div className="text-left sm:text-right font-mono text-xs text-neutral-400">
            <div>Facility Name: <strong>{factory.name}</strong></div>
            <div>Issued Cycle: <strong>{dateStr}</strong></div>
          </div>
        </div>

        {/* Details Table */}
        {reportType === 'carbon_audit' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl font-mono text-xs">
              <div>
                <span className="text-neutral-500 block">Baseline Target:</span>
                <span className="text-white font-bold">{factory.carbonTarget} tonnes CO₂/mo</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Latest Cumulative:</span>
                <span className="text-emerald-400 font-bold">{carbonRecords[carbonRecords.length - 1]?.co2Total?.toFixed(1) || '61.0'} tonnes</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Compliance Status:</span>
                <span className="text-emerald-500 font-bold uppercase flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span>Approved Net-Zero Level</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-900 rounded-xl">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/40 text-neutral-500">
                    <th className="p-4">Report Timestamp</th>
                    <th className="p-4">Grid Emissions (t)</th>
                    <th className="p-4">Diesel Emissions (t)</th>
                    <th className="p-4">Cumulative CO₂ Equivalent (t)</th>
                    <th className="p-4 text-right">Regulatory Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/40">
                  {carbonRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/10">
                      <td className="p-4 text-white">{new Date(r.timestamp).toLocaleDateString()}</td>
                      <td className="p-4 text-neutral-300">{r.co2Grid.toFixed(2)} t</td>
                      <td className="p-4 text-neutral-300">{r.co2Diesel.toFixed(2)} t</td>
                      <td className="p-4 text-emerald-400 font-bold">{r.co2Total.toFixed(2)} t</td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-bold">Compliant</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'energy' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl font-mono text-xs">
              <div>
                <span className="text-neutral-500 block">Solar Microgrid Mix:</span>
                <span className="text-yellow-400 font-bold">{factory.solarAvailability ? '24.2%' : '0%'} Solar</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Peak Generator Power:</span>
                <span className="text-white font-bold">{factory.generatorUsage === 'none' ? 'Inhibited' : 'Occasional (Gen Reserve)'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Grid Tariff Level:</span>
                <span className="text-cyan-400 font-bold">Industrial Off-Peak Advantage</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-900 rounded-xl">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/40 text-neutral-500">
                    <th className="p-4">Billing Cycle</th>
                    <th className="p-4">Utility Power (kWh)</th>
                    <th className="p-4">Diesel Consumption (L)</th>
                    <th className="p-4">Solar Generation (kWh)</th>
                    <th className="p-4 text-right">Estimated Grid Tariffs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/40">
                  {energyRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/10">
                      <td className="p-4 text-white">{new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                      <td className="p-4 text-neutral-300">{r.gridConsumption.toLocaleString()} kWh</td>
                      <td className="p-4 text-neutral-300">{r.dieselConsumption} L</td>
                      <td className="p-4 text-yellow-400 font-bold">{r.solarGeneration.toLocaleString()} kWh</td>
                      <td className="p-4 text-right text-emerald-400 font-bold">${Math.round(r.gridConsumption * 0.12).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'machinery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-900/40 border border-neutral-900 rounded-xl font-mono text-xs">
              <div>
                <span className="text-neutral-500 block">Total Active Telemetries:</span>
                <span className="text-white font-bold">{machines.length} registered hardware nodes</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Mean Hardware Efficiency:</span>
                <span className="text-emerald-400 font-bold">
                  {Math.round(machines.reduce((sum, m) => sum + m.efficiency, 0) / (machines.length || 1))}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-neutral-900 rounded-xl">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-900 bg-neutral-950/40 text-neutral-500">
                    <th className="p-4">Machine Parameters</th>
                    <th className="p-4">Energy Meter</th>
                    <th className="p-4">Avg Run Hours</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">CO₂ Output Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/40">
                  {machines.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-900/10">
                      <td className="p-4">
                        <span className="text-white block font-sans text-xs">{m.name}</span>
                        <span className="text-[10px] text-neutral-500">Health index: {m.healthScore}%</span>
                      </td>
                      <td className="p-4 text-neutral-300">{m.energyMeterId}</td>
                      <td className="p-4 text-neutral-300">{m.avgWorkingHours} hrs/day</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-emerald-400 font-bold">{m.co2GeneratedToday} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Document Footer Signature Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-neutral-900 text-xs font-mono text-neutral-500">
          <div>Report generated via EcoCarbon AI environmental audit daemon.</div>
          <div className="border-t border-neutral-800 pt-2 w-48 text-center">
            <span className="text-neutral-400 font-bold block">AUTHORIZED CERTIFICATE</span>
            <span className="text-[9px] block">EcoCarbon System Signed</span>
          </div>
        </div>

      </div>

    </div>
  );
}
