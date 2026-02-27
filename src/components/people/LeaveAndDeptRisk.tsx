import React from 'react';
import type { DateRangeOption } from '../../types';
import { ShieldAlert, CalendarClock } from 'lucide-react';

interface Props {
    dateRange?: DateRangeOption;
    data?: any;
}

const LeaveAndDeptOverview: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const totalEmployees = data.companyAvailability.totalEmployees;
    const onLeave = data.companyAvailability.onLeave;
    const stabilityPercent = Math.round(((totalEmployees - onLeave) / totalEmployees) * 100);

    const radius = 30;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (stabilityPercent / 100) * circ;

    const deptRisk = data.deptRisk || [];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col h-full group hover:shadow-md hover:border-emerald-100 transition-all duration-300 relative overflow-hidden text-slate-800">
            {/* Header */}
            <div className="mb-4 pb-4 border-b border-slate-100/80 w-full shrink-0 shrink-0 z-10 w-full">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><ShieldAlert className="w-5 h-5 mr-3 text-rose-500" />
                    Leave & Dept Overview</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-8">Resource Availability Tracker</p>
            </div>

            <div className="flex-1 flex flex-col z-10 w-full">

                {/* Top Section: Company Availability Box */}
                <div className="flex items-center p-4 border border-slate-100 bg-slate-50/50 rounded-xl mb-5 w-full shrink-0">
                    <div className="relative w-16 h-16 mr-6 shrink-0 flex items-center justify-center">
                        <svg className="w-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 72 72">
                            <circle cx="36" cy="36" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-200" />
                            <circle cx="36" cy="36" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="text-emerald-500" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-black text-slate-800">{stabilityPercent}%</span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-6 py-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Company Availability</span>
                        <div className="flex items-center">
                            <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 uppercase tracking-wider">
                                {onLeave} / {totalEmployees} ON LEAVE
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Department Bars */}
                <div className="flex-1 flex flex-col justify-center space-y-4 w-full mb-5">
                    {deptRisk.map((dept: any, idx: number) => (
                        <div key={idx} className="flex flex-col w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-700">{dept.name}</span>
                                <span className={`text-xs font-black uppercase tracking-widest ${dept.riskPercent > 50 ? 'text-rose-500' : 'text-amber-500'}`}>
                                    {dept.riskPercent}% COVERAGE NEEDED
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={`h-full rounded-full ${dept.riskPercent > 50 ? 'bg-rose-500' : 'bg-amber-400'}`}
                                    style={{ width: `${dept.riskPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Peak Leave Alert */}
                <div className="shrink-0 flex items-center px-4 py-3 border border-orange-100 bg-orange-50/50 rounded-xl text-orange-700 w-full mb-1">
                    <CalendarClock className="w-5 h-5 mr-3 text-orange-500" />
                    <div className="text-[11px] uppercase tracking-widest font-bold flex-1 text-slate-600">
                        Peak Leave Alert: <span className="font-extrabold text-orange-600 ml-2">{data.peakLeaveWarning}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaveAndDeptOverview;
