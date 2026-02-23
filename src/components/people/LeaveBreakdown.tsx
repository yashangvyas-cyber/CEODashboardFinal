import React from 'react';
import { DateRangeOption } from '../../types';
import { CalendarOff, Plane, Coffee, Home } from 'lucide-react';

interface Props {
    dateRange: DateRangeOption;
}

const LeaveBreakdown: React.FC<Props> = ({ dateRange }) => {
    const departments = [
        { name: "Engineering", count: 12, total: 45, icon: Home },
        { name: "Sales & Marketing", count: 8, total: 32, icon: Plane },
        { name: "Customer Success", count: 5, total: 20, icon: Coffee },
        { name: "Product", count: 4, total: 15, icon: CalendarOff },
        { name: "Operations", count: 2, total: 12, icon: Home },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Leave Breakdown</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Currently Away</span>
                </div>
            </div>

            <div className="flex-1 px-6 pb-6 space-y-6 overflow-y-auto">
                {departments.map((dept, idx) => {
                    const percent = (dept.count / dept.total) * 100;
                    // Dynamic color based on intensity of absence
                    let colorClass = 'bg-blue-500';
                    if (percent > 25) colorClass = 'bg-amber-500';
                    if (percent > 40) colorClass = 'bg-rose-500';

                    const Icon = dept.icon;

                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700">{dept.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">{dept.count} <span className="text-slate-400 text-xs font-normal">/ {dept.total}</span></div>
                                </div>
                            </div>

                            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${colorClass} opacity-80 group-hover:opacity-100 transition-all duration-500 ease-out shadow-sm`}
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-end mt-1.5">
                                <span className="text-xs font-medium text-slate-500">{percent.toFixed(0)}% Absenteeism</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Total Absent</span>
                    <span className="font-bold text-slate-800">31 Employees</span>
                </div>
            </div>
        </div>
    );
};

export default LeaveBreakdown;