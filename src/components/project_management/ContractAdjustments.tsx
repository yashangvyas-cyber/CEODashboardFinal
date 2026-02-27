import React from 'react';
import type { DateRangeOption } from '../../types';
import { Users2 } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
    metricData?: any;
}

const ContractAdjustments: React.FC<Props> = ({ data = [], metricData }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-full hover:border-slate-300 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center">
                            <Users2 className="w-4 h-4 mr-2 text-indigo-500 group-hover:scale-110 transition-transform" />
                            Contract Adjustments
                        </h3>
                        <InfoTooltip content="Historical view of resource contract changes within the selected date range, showing who was hired, whose contracts expired, or both." />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Hirebase Headcount Changes</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                    {data.length} Resources
                </span>
            </div>

            {/* Expired vs Newly Hired Metric (Hirebase Only) */}
            {metricData && (
                <div className="grid grid-cols-3 gap-2 mb-4 shrink-0">
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-wider mb-0.5">Hired</span>
                        <span className="text-sm font-black text-emerald-600">+{metricData.newlyHired}</span>
                    </div>
                    <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-2 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-rose-600/70 font-bold uppercase tracking-wider mb-0.5">Expired</span>
                        <span className="text-sm font-black text-rose-600">-{metricData.expired}</span>
                    </div>
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2 flex flex-col items-center justify-center border-dashed">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-0.5">Net</span>
                        <span className="text-sm font-black text-indigo-600">+{metricData.netChange}</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {data.filter(item => item.type !== 'Hourly').map((item, idx) => {
                    let statusColor = 'text-slate-500 bg-slate-100';
                    let label = item.status;
                    if (item.status === 'Hired') statusColor = 'text-emerald-700 bg-emerald-100 border-emerald-200';
                    else if (item.status === 'Expired') statusColor = 'text-rose-700 bg-rose-100 border-rose-200';
                    else if (item.status === 'Hired & Expired') statusColor = 'text-amber-700 bg-amber-100 border-amber-200';

                    return (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 leading-tight">{item.resourceOrProject}</span>
                                <span className="text-[10px] text-slate-500 font-medium mt-0.5">{item.type} | {item.manager}</span>
                                {item.startDate && (
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter mt-1 bg-indigo-50 px-2 py-0.5 rounded w-fit border border-indigo-100/50">
                                        Billable: {item.startDate} — {item.endDate || 'Present'}
                                    </span>
                                )}
                            </div>
                            <div className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${statusColor}`}>
                                {label}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic">
                <strong>Logic:</strong> Displays exactly who was added or removed from Hirebase billing in the selected period.
            </div>
        </div>
    );
};

export default ContractAdjustments;
