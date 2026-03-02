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
        <div className="premium-card p-3 flex flex-col h-full group hover-scale relative overflow-hidden h-full">
            <div className="flex items-center gap-2 mb-1 pb-2 border-b border-slate-100/80 w-full shrink-0">
                <h3 className="text-[10px] font-black text-slate-700 tracking-tight uppercase">Lost Deal Reasons</h3>
                <InfoTooltip content="Analysis of the primary reasons why deals were lost." />
            </div>

            <div className="flex-1 flex flex-row items-center gap-4 relative z-10 w-full min-h-0">
                {/* Donut Chart on Left */}
                <div className="shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500" style={{ width: 100, height: 100 }}>
                    <PieChart width={100} height={100}>
                        <Pie
                            data={chartData}
                            cx={50}
                            cy={50}
                            innerRadius={25}
                            outerRadius={45}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="label"
                            stroke="none"
                        >
                            {chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.hexColor} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </div>

                {/* Legend on Right (Scrollable if needed) */}
                <div className="flex-1 h-full py-2">
                    <div className="h-full overflow-y-auto custom-scrollbar pr-1">
                        <div className="flex flex-col gap-1.5">
                            {chartData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.hexColor }}></div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-tighter truncate leading-tight" title={item.label}>
                                            {item.label}
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-400">
                                            {item.value}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LostDealAnalysis;
