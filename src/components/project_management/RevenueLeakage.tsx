import React from 'react';
import type { DateRangeOption } from '../../types';
import { AlertTriangle } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
}

const RevenueLeakage: React.FC<Props> = ({ data = [] }) => {
    // Sort by leakage amount (highest first)
    const sortedLeakage = [...data].sort((a, b) => b.amount - a.amount);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full hover:border-rose-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><AlertTriangle className="w-4 h-4 mr-2 text-rose-500 group-hover:scale-110 transition-transform" />
                        Revenue Leakage Risk
                        <InfoTooltip content="Identifies projects where the actual hours spent exceed either the fixed-cost budget or the hours billed, representing a direct loss of potential revenue." /></h3>
                    <p className="text-xs text-slate-400 mt-1">Unbilled / Over-Budget Projects</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {sortedLeakage.map((item, idx) => (
                    <div key={idx} className="flex flex-col p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all duration-200">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-800 leading-tight w-2/3 truncate">{item.project}</span>
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 shrink-0">
                                {item.type}
                            </span>
                        </div>

                        <div className="flex justify-between items-end mt-1">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500">Actual vs {item.type === 'Fixed Cost' ? 'Purchased' : 'Billed'}</span>
                                <span className="text-xs font-medium text-slate-700">{item.actual} / {item.target} hrs</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-400 uppercase font-bold text-right">Leakage</span>
                                <span className="text-sm font-extrabold text-rose-500">{item.amount} hrs</span>
                            </div>
                        </div>

                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min((item.actual / item.target) * 100, 100)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic">
                <strong>Logic:</strong> Tracks Fixed Cost projects where Actual {`>`} Purchased, and Hourly projects where Actual Spent exceeds Billed hours.
            </div>
        </div>
    );
};

export default RevenueLeakage;
