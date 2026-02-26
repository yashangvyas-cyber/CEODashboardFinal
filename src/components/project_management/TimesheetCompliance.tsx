import React from 'react';
import type { DateRangeOption } from '../../types';
import { CalendarClock, AlertCircle, CheckCircle2 } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface ComplianceItem {
    department: string;
    unapproved: number;
    missing: number;
}

interface Props {
    dateRange: DateRangeOption;
    data?: ComplianceItem[];
}

const PERIOD_LABELS: Record<DateRangeOption, string> = {
    this_quarter: 'This Quarter',
    this_year: 'This Year',
    last_quarter: 'Last Quarter',
    last_year: 'Last Year',
    ytd: 'Year to Date',
};

const TimesheetCompliance: React.FC<Props> = ({ dateRange, data = [] }) => {
    const sortedIssues = [...data]
        .filter(item => (item.unapproved + item.missing) > 0)
        .sort((a, b) => (b.unapproved + b.missing) - (a.unapproved + a.missing));

    const periodLabel = PERIOD_LABELS[dateRange] ?? 'Selected Period';

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-6 shadow-sm flex flex-col h-full hover:border-indigo-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">
                        <CalendarClock className="w-4 h-4 mr-2 text-violet-500 group-hover:scale-110 transition-transform" />
                        Timesheet Compliance
                        <InfoTooltip content="Tracks pending timesheet approvals and missing logs for hourly projects by department. Older periods will show no data as those timesheets would have been resolved." />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                        <span className="font-semibold text-indigo-400">{periodLabel}</span>
                        {' · '}Pending approvals (Hourly only)
                    </p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start min-h-0 space-y-2 pb-1 overflow-y-auto custom-scrollbar">
                {sortedIssues.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        <div className="text-center">
                            <p className="text-sm font-bold text-emerald-600">No Pending Issues</p>
                            <p className="text-xs text-slate-400 mt-1">All timesheets for {periodLabel} are resolved.</p>
                        </div>
                    </div>
                ) : sortedIssues.map((item, idx) => {
                    const totalAction = item.unapproved + item.missing;
                    const isSevere = totalAction > 20;

                    return (
                        <div key={idx} className={`flex flex-col p-3 rounded-lg border hover:shadow-sm cursor-pointer transition-all duration-200 ${isSevere ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-300'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-800 leading-tight w-24 truncate">{item.department}</span>
                                    {isSevere && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                                </div>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${isSevere ? 'text-rose-700 bg-rose-100 border-rose-200' : 'text-slate-600 bg-slate-100 border-slate-200'}`}>
                                    {totalAction} Hrs Action Required
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="bg-white rounded border border-slate-100 px-2 py-1 flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Unapproved</span>
                                    </div>
                                    <span className="text-xs font-black text-amber-600">{item.unapproved}h</span>
                                </div>
                                <div className="bg-white rounded border border-slate-100 px-2 py-1 flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Missing Logs</span>
                                    </div>
                                    <span className="text-xs font-black text-rose-600">{item.missing}h</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-slate-400 bg-slate-50 p-2.5 rounded-lg italic leading-relaxed">
                <span className="font-bold text-slate-500">Logic:</span> Aggregates <span className="text-amber-600 font-bold">Unapproved</span> hours (Hourly projects only) and <span className="text-rose-600 font-bold">Missing</span> (00:00) timesheet logs by Department.
            </div>
        </div>
    );
};

export default TimesheetCompliance;
