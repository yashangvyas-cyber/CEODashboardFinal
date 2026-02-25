import React from 'react';
import type { DateRangeOption } from '../../types';
import { Clock } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
    metricData?: any;
}

const UpcomingExpirations: React.FC<Props> = ({ data = [], metricData }) => {
    // Sort by days remaining (lowest first)
    const sortedExpirations = [...data].sort((a, b) => a.daysRemaining - b.daysRemaining);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full hover:border-amber-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><Clock className="w-4 h-4 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                        Upcoming Expirations
                        <InfoTooltip content="Tracks upcoming project completions or resource contract renewals, highlighting those at risk of expiring soon." /></h3>
                    <p className="text-xs text-slate-400 mt-1">Hirebase & Hourly Renewals</p>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {sortedExpirations.length} At Risk
                </span>
            </div>

            {/* Expired vs Newly Hired Metric (Hirebase Only) */}
            {metricData && (
                <div className="grid grid-cols-3 gap-2 mb-4 shrink-0">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Hired</span>
                        <span className="text-sm font-black text-emerald-500">+{metricData.newlyHired}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Expired</span>
                        <span className="text-sm font-black text-rose-500">-{metricData.expired}</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-0.5">Net</span>
                        <span className="text-sm font-black text-indigo-600">+{metricData.netChange}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {sortedExpirations.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all duration-200">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 leading-tight">{item.resourceOrProject}</span>
                            <span className="text-[10px] text-slate-500 font-medium mt-0.5">{item.type} | {item.manager}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-sm font-extrabold ${item.daysRemaining <= 5 ? 'text-rose-500' : 'text-amber-500'}`}>
                                {item.daysRemaining} Days
                            </span>
                            <span className="text-[9px] text-slate-400 uppercase font-bold">Remaining</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic">
                <strong>Logic:</strong> Tracks Hirebase net growth (Hired vs Expired this month) and flags upcoming contract/bucket renewals.
            </div>
        </div>
    );
};

export default UpcomingExpirations;
