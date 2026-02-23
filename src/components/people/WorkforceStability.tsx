import React from 'react';
import { DateRangeOption } from '../../types';
import { UserMinus, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  dateRange: DateRangeOption;
}

const WorkforceStability: React.FC<Props> = ({ dateRange }) => {
  // Widget A: Exit Trend Data
  const exitData = [
    { label: "Regrettable", value: 35, color: "text-rose-500", bg: "bg-rose-500" },
    { label: "Non-Regrettable", value: 65, color: "text-slate-400", bg: "bg-slate-400" }
  ];

  // Pie Chart Logic
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const regrettableOffset = circumference - (exitData[0].value / 100) * circumference;

  // Widget B: Exits by Manager 
  // Sorting Rule: 1. Highest Count (DESC) 2. Most Recent Exit (DESC)
  // Logic is pre-calculated here for display
  const managers = [
    { name: "Robert Fox", count: 7, lastExit: "Yesterday", dept: "Engineering" },       // 1. High Count, Recent
    { name: "Cody Fisher", count: 5, lastExit: "2 days ago", dept: "Sales" },           // 2. High Count, Recent
    { name: "Jane Cooper", count: 5, lastExit: "3 weeks ago", dept: "Product" },        // 3. High Count, Older
    { name: "Esther Howard", count: 3, lastExit: "5 days ago", dept: "Marketing" },     // 4. Low Count, Recent
    { name: "Guy Hawkins", count: 3, lastExit: "1 month ago", dept: "Engineering" },    // 5. Low Count, Older
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-2 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Workforce Stability</h3>
          <p className="text-xs text-slate-400 mt-1">Attrition Analysis & Risk</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100">
          <UserMinus className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-rose-600">8 Exits (Qtr)</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Section 1: Visual Pie Chart (Top) */}
        <div className="flex flex-col items-center justify-center py-6 px-6">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100" />
              <circle
                cx="40" cy="40" r={radius} fill="transparent" stroke="currentColor" strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={regrettableOffset} strokeLinecap="round"
                className="text-rose-500 shadow-lg"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">35%</span>
              <span className="text-xs text-rose-500 uppercase font-medium tracking-wide mt-1">Regrettable</span>
            </div>
          </div>

          {/* Legend Inline */}
          <div className="flex items-center space-x-6 text-xs">
            {exitData.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${item.bg} mr-2 ring-2 ring-white shadow-sm`}></div>
                <span className="text-slate-600 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-slate-100"></div>

        {/* Section 2: Manager Watchlist (Bottom - Full Width) */}
        <div className="flex-1 p-6 bg-slate-50/30">
          <h4 className="text-xs font-bold text-slate-800 mb-4 flex items-center uppercase tracking-wide">
            Manager Watchlist <span className="text-slate-400 font-normal ml-2 lowercase">(Top 5 by attrition)</span>
          </h4>
          <div className="space-y-3">
            {managers.map((mgr, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                <div className="flex items-center space-x-3">
                  <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border
                                ${idx === 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-200'}
                              `}>
                    {mgr.count}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{mgr.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{mgr.dept}</div>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-3">
                  <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    {mgr.lastExit}
                  </div>
                  {mgr.count >= 5 && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkforceStability;