import React, { useState } from 'react';
import type { DateRangeOption } from '../../types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange?: DateRangeOption;
    data?: any;
}

const ExitByTypeAndReason: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { types, chartDataMap } = data;
    const [activeTab, setActiveTab] = useState(types[0]);

    const currentData = chartDataMap[activeTab] || [];
    const total = currentData.reduce((sum: number, d: any) => sum + d.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const pct = total > 0 ? Math.round((payload[0].value / total) * 100) : 0;
            return (
                <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl">
                    {`${payload[0].name}: ${payload[0].value} (${pct}%)`}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-4 shadow-sm h-full flex flex-col h-full hover:shadow transition-shadow">
            {/* Header & Tabs */}
            <div className="flex justify-between items-center shrink-0 mb-4 pb-3 border-b border-slate-100/80 w-full">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Exit by Type &amp; Reason
                    <InfoTooltip content="Distribution of employee exits based on the reason (e.g., Better Opportunity) and the nature of the exit (e.g., Resignation)." /></h3>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 mt-[-4px]">
                    {types.map((type: string) => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`px-3 py-1.5 text-[10px] uppercase tracking-wide font-bold rounded-md transition-all ${activeTab === type
                                ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body: Chart TOP + Data-Table Legend BOTTOM */}
            <div className="flex-1 flex flex-col items-center gap-4 pb-2 w-full h-full min-h-0">

                {/* Top: Donut with center number */}
                <div className="relative shrink-0 flex items-center justify-center w-full" style={{ height: 140 }}>
                    <PieChart width={140} height={140}>
                        <Pie
                            data={currentData}
                            cx={65}
                            cy={65}
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {currentData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    </PieChart>

                    {/* Center label in donut hole */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px] ml-[-10px]">
                        <span className="text-3xl font-black text-slate-800 leading-none">{total}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 text-center leading-tight">
                            Total
                        </span>
                    </div>
                </div>

                {/* Bottom: Data Table Legend (Scrollable if many items) */}
                <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto pr-2 px-1 custom-scrollbar">
                    {currentData.map((entry: any, index: number) => {
                        const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                        return (
                            <div key={index} className="flex items-center gap-2">
                                {/* Color dot */}
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: entry.color }}
                                />
                                {/* Label */}
                                <span className="text-[11px] font-bold text-slate-600 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {entry.name}
                                </span>
                                {/* Dot leader line */}
                                <span className="flex-shrink border-b border-dotted border-slate-200 min-w-4" />
                                {/* Stats */}
                                <div className="flex items-center gap-1.5 shrink-0 tabular-nums">
                                    <span className="text-[11px] font-black text-slate-800 w-8 text-right">{pct}%</span>
                                    <span className="text-[10px] font-bold text-slate-400">({entry.value})</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default ExitByTypeAndReason;
