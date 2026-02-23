import React from 'react';
import type { DateRangeOption } from '../../types';
import { CalendarClock, AlertCircle } from 'lucide-react';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
}

const TimesheetCompliance: React.FC<Props> = ({ data = [] }) => {
    // Sort by total unapproved hours (highest first)
    const sortedIssues = [...data].sort((a, b) => b.unapproved - a.unapproved);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-full flex flex-col hover:border-indigo-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                        <CalendarClock className="w-4 h-4 mr-2 text-violet-500 group-hover:scale-110 transition-transform" />
                        Timesheet Compliance
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Pending approvals (Hourly only)</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {sortedIssues.map((item, idx) => {
                    const isSevere = item.unapproved > 20;

                    return (
                        <div key={idx} className={`flex flex-col p-3 rounded-lg border hover:shadow-sm cursor-pointer transition-all duration-200 ${isSevere ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-300'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-800 leading-tight w-24 truncate">{item.department}</span>
                                    {isSevere && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                                </div>
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${isSevere ? 'text-rose-700 bg-rose-100 border-rose-200' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>
                                    {item.unapproved} Hrs Action Required
                                </span>
                            </div>

                            <div className="bg-white rounded border border-slate-100 p-1.5 flex justify-between items-center mt-1">
                                <span className="text-[10px] text-slate-500 font-medium">Unapproved</span>
                                <span className="text-xs font-bold text-amber-500">{item.unapproved}h</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic">
                <strong>Logic:</strong> Aggregates unapproved hours (specifically for Hourly projects) to highlight billing bottlenecks.
            </div>
        </div>
    );
};

export default TimesheetCompliance;
