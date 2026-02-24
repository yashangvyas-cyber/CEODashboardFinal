import React from 'react';
import { TrendingUp } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import type { DateRangeOption } from '../../types';

interface MonthData {
    month: string;
    won: number;
    invoiced: number;
    collected: number;
}

interface Props {
    dateRange?: DateRangeOption;
    data?: MonthData[];
}

const defaultData: MonthData[] = [
    { month: 'Jun', won: 41000, invoiced: 38000, collected: 16000 },
    { month: 'Jul', won: 38000, invoiced: 36000, collected: 14500 },
    { month: 'Aug', won: 35000, invoiced: 32000, collected: 13000 },
    { month: 'Sep', won: 32000, invoiced: 29000, collected: 13500 },
    { month: 'Oct', won: 30000, invoiced: 28000, collected: 14000 },
    { month: 'Nov', won: 28000, invoiced: 25000, collected: 13000 },
    { month: 'Dec', won: 25000, invoiced: 22000, collected: 12500 },
    { month: 'Jan', won: 28000, invoiced: 26000, collected: 14000 },
    { month: 'Feb', won: 32000, invoiced: 30000, collected: 15500 },
    { month: 'Mar', won: 38000, invoiced: 35000, collected: 16300 },
    { month: 'Apr', won: 42000, invoiced: 38500, collected: 17000 },
    { month: 'May', won: 42000, invoiced: 38000, collected: 16300 },
];

const formatValue = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
                <p className="font-black text-slate-600 mb-2 uppercase tracking-widest">{label}</p>
                {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-4 mb-0.5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="font-bold text-slate-500">{entry.name}</span>
                        </div>
                        <span className="font-black text-slate-800">{formatValue(entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const RevenueTrend: React.FC<Props> = ({ data }) => {
    const chartData = data || defaultData;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
                <div className="flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Revenue Trend</h3>
                    <InfoTooltip content="Monthly progression of revenue from deals won, invoiced, and collected." />
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    {[
                        { label: 'Total Won', color: '#6366f1' },
                        { label: 'Invoiced', color: '#a78bfa' },
                        { label: 'Collected', color: '#10b981' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-1.5">
                            <div className="w-5 h-0.5 rounded" style={{ backgroundColor: item.color }} />
                            <span className="text-slate-500">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[300px] w-full mt-4 min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                    <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={formatValue}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                            width={48}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="won"
                            name="Total Won"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="invoiced"
                            name="Invoiced"
                            stroke="#a78bfa"
                            strokeDasharray="5 3"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="collected"
                            name="Collected"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueTrend;
