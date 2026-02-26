import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2 } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface DeptEntry {
    department: string;
    billable: number;
    nonBillable: number;
}

interface Props {
    data?: DeptEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const billable = payload.find((p: any) => p.dataKey === 'billable')?.value ?? 0;
    const nonBillable = payload.find((p: any) => p.dataKey === 'nonBillable')?.value ?? 0;
    const total = billable + nonBillable;
    const billPct = total > 0 ? Math.round((billable / total) * 100) : 0;

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
            <p className="font-black text-slate-800 mb-2 truncate max-w-[160px]">{label}</p>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span className="text-slate-600">Billable</span>
                    </span>
                    <span className="font-bold text-emerald-600">{billable}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                        <span className="text-slate-600">Non-Billable</span>
                    </span>
                    <span className="font-bold text-rose-500">{nonBillable}</span>
                </div>
                <div className="border-t border-slate-100 mt-1 pt-1 flex items-center justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Total</span>
                    <span className="font-black text-slate-700">{total} <span className="text-[10px] font-normal text-slate-400">({billPct}% billable)</span></span>
                </div>
            </div>
        </div>
    );
};

const CustomLegend = () => (
    <div className="flex items-center justify-center gap-5 mt-1">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
            Billable
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
            <span className="w-3 h-3 rounded-sm bg-rose-400 inline-block" />
            Non-Billable
        </span>
    </div>
);

const HirebaseByDepartment: React.FC<Props> = ({ data = [] }) => {
    if (!data || data.length === 0) return null;

    const sorted = [...data].sort((a, b) => (b.billable + b.nonBillable) - (a.billable + a.nonBillable));
    const totalResources = sorted.reduce((s, d) => s + d.billable + d.nonBillable, 0);
    const totalBillable = sorted.reduce((s, d) => s + d.billable, 0);
    const overallBillPct = totalResources > 0 ? Math.round((totalBillable / totalResources) * 100) : 0;

    // Shorten long department names for axis
    const chartData = sorted.map(d => ({
        ...d,
        shortDept: d.department.length > 14 ? d.department.slice(0, 13) + '…' : d.department,
    }));

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        Hirebase by Department
                        <InfoTooltip content="Distribution of active Hirebase resources across departments, split by their billability status. Source: Hirebase Report → Department + Billable columns." />
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">Resource headcount &amp; billability per department</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                        {sorted.length} Departments
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                        {overallBillPct}% billable overall
                    </span>
                </div>
            </div>

            {/* Summary badges */}
            <div className="grid grid-cols-3 gap-2 mb-4 shrink-0">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                    <span className="text-base font-black text-slate-800">{totalResources}</span>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Billable</span>
                    <span className="text-base font-black text-emerald-700">{totalBillable}</span>
                </div>
                <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-2 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Non-Bill.</span>
                    <span className="text-base font-black text-rose-600">{totalResources - totalBillable}</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 4, right: 8, left: -18, bottom: 8 }}
                        barCategoryGap="30%"
                        barGap={2}
                    >
                        <XAxis
                            dataKey="shortDept"
                            tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                        />
                        <YAxis
                            tick={{ fontSize: 9, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 6 }} />
                        <Bar dataKey="billable" name="Billable" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]}>
                            {chartData.map((_, i) => (
                                <Cell key={i} fill="#10b981" fillOpacity={0.85 - i * 0.06} />
                            ))}
                        </Bar>
                        <Bar dataKey="nonBillable" name="Non-Billable" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]}>
                            {chartData.map((_, i) => (
                                <Cell key={i} fill="#fb7185" fillOpacity={0.85 - i * 0.06} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <CustomLegend />

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50/50 p-2 rounded-lg italic leading-tight shrink-0">
                <strong>Logic:</strong> Groups all active Hirebase resources by <em>Department</em>, then stacks <em>Billable = Yes</em> (emerald) vs <em>No</em> (rose) within each bar.
            </div>
        </div>
    );
};

export default HirebaseByDepartment;
