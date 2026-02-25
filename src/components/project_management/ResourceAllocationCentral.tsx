import React from 'react';
import type { DateRangeOption } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Network } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: any;
}

const ResourceAllocationCentral: React.FC<Props> = ({ data }) => {

    if (!data) return null;

    const { availability, statusAllocation, typeAllocation } = data;

    // Chart Colors mapped to the user's screenshot
    const statusColors: any = {
        'In Development': '#eab308', // amber
        'Paused': '#db2777', // pink
        'Not Started': '#475569', // slate
        'Hold': '#65a30d', // lime-green
        'Signed Off': '#4ade80', // light green
        'Ready?': '#2dd4bf' // teal
    };

    const typeColors: any = {
        'Dedicated Resource': '#84cc16', // lime
        'Fixed-Price': '#3b82f6', // blue
        'Time and Material': '#334155', // dark slate
        'Inhouse': '#10b981' // emerald
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase"><Network className="w-4 h-4 mr-2 text-indigo-500" />
                        Organization Resource Availability Metrics
                        <InfoTooltip content="Visualization of how resources are allocated across various projects and departments, highlighting availability, status-wise distribution, and allocation types." /></h3>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time bird's eye view of all technical talent allocation</p>
                </div>
            </div>

            {/* Top Row: The 3 Charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">

                {/* 1. Resource Availability Donut */}
                <div className="p-6 flex flex-col xl:flex-row items-center justify-center gap-6">
                    <div className="relative w-32 h-32 shrink-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { value: availability.availablePercent, color: '#10b981' },
                                        { value: 100 - availability.availablePercent, color: '#ef4444' }
                                    ]}
                                    cx="50%" cy="50%" innerRadius={45} outerRadius={60} startAngle={90} endAngle={-270}
                                    dataKey="value" stroke="none"
                                >
                                    {([{}, {}]).map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-800 leading-none">{availability.availablePercent}%</span>
                            <span className="text-[9px] text-slate-400 mt-1">{availability.totalCapacity} Hrs</span>
                        </div>
                    </div>
                    <div className="w-full space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Total Technical Employees</span>
                            <span className="font-bold text-slate-800">{availability.totalEmployees}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Over Allocated Hours</span>
                            <span className="font-bold text-rose-500">{availability.overAllocated}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Unallocated Hours</span>
                            <span className="font-bold text-indigo-600">{availability.unallocatedHours}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                            <span className="text-slate-700 font-bold">Available Bandwidth</span>
                            <span className="font-bold text-slate-800">{availability.availableHours} / {availability.totalCapacity} Hrs.</span>
                        </div>
                    </div>
                </div>

                {/* 2. Allocation by Status */}
                <div className="p-6 flex flex-col xl:flex-row items-center justify-center gap-6">
                    <div className="w-32 h-32 shrink-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                            <PieChart>
                                <Pie data={statusAllocation} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="hours" stroke="none">
                                    {statusAllocation.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#cbd5e1'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value} Hrs`, 'Hours']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-1.5 h-full flex flex-col justify-center">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">By Status (Hrs.)</h4>
                        {statusAllocation.map((item: any) => (
                            <div key={item.name} className="flex justify-between text-[11px]">
                                <span className="text-slate-600 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: statusColors[item.name] }}></span>
                                    {item.name}
                                </span>
                                <span className="font-bold text-indigo-600">{item.hours}:00</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Allocation by Type */}
                <div className="p-6 flex flex-col xl:flex-row items-center justify-center gap-6">
                    <div className="w-32 h-32 shrink-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                            <PieChart>
                                <Pie data={typeAllocation} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="hours" stroke="none">
                                    {typeAllocation.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={typeColors[entry.name] || '#cbd5e1'} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value} Hrs`, 'Hours']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full space-y-1.5 h-full flex flex-col justify-center">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">By Type (Hrs.)</h4>
                        {typeAllocation.map((item: any) => (
                            <div key={item.name} className="flex justify-between text-[11px]">
                                <span className="text-slate-600 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: typeColors[item.name] }}></span>
                                    {item.name}
                                </span>
                                <span className="font-bold text-indigo-600">{item.hours}:00</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResourceAllocationCentral;
