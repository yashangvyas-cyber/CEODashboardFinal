import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
    dateRange?: DateRangeOption;
    data?: { label: string; value: number; color?: string; hexColor?: string }[];
}

const LostDealAnalysis: React.FC<Props> = ({ data }) => {
    // If the data is passed from outside and uses the old `color` prop, we can map it to hexColor.
    const normalizedData = data ? data.map(item => ({
        ...item,
        hexColor: item.hexColor || (item.color ? '#slate-400' : '#e2e8f0') // Fallback mapping not ideal but enough for TS
    })) : null;

    // Convert Tailwind-centric data to standard hex colored data for Recharts
    const chartData = normalizedData || [
        { label: "Competitor", value: 40, hexColor: "#f43f5e" }, // rose-500
        { label: "Delayed", value: 30, hexColor: "#fbbf24" },    // amber-400
        { label: "Budget", value: 20, hexColor: "#94a3b8" },     // slate-400
        { label: "Other", value: 10, hexColor: "#e2e8f0" }       // slate-200
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl">
                    {`${payload[0].name}: ${payload[0].value}%`}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="premium-card p-6 flex flex-col h-full group hover-scale relative overflow-hidden h-full">
            <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100/80 w-full shrink-0">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Lost Deal Analysis</h3>
                <InfoTooltip content="Analysis of the primary reasons why deals were lost, such as competition, budget constraints, or timing." />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 pt-4 w-full">
                {/* Donut Chart */}
                <div className="relative shrink-0 flex items-center justify-center w-full group-hover:scale-105 transition-transform duration-500" style={{ height: 160 }}>
                    <PieChart width={160} height={160}>
                        <Pie
                            data={chartData}
                            cx={80}
                            cy={80}
                            innerRadius={0}
                            outerRadius={75}
                            paddingAngle={1}
                            dataKey="value"
                            nameKey="label"
                            stroke="none"
                        >
                            {chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.hexColor} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    </PieChart>
                </div>

                {/* 2x2 Legend */}
                <div className="w-full grid grid-cols-2 gap-3 mt-4">
                    {chartData.map((item, idx) => (
                        <div key={idx} className="flex items-center text-[10px] bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                            <div className="w-2 h-2 rounded-full mr-2 shrink-0" style={{ backgroundColor: item.hexColor }}></div>
                            <span className="text-slate-500 font-bold flex-1 truncate uppercase tracking-wider">{item.label}</span>
                            <span className="font-black text-slate-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LostDealAnalysis;
