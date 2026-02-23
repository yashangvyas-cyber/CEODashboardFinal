import React, { useState } from 'react';
import type { DateRangeOption } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
    dateRange?: DateRangeOption;
    data?: any;
}

const ExitByTypeAndReason: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { types, chartDataMap } = data;
    const [activeTab, setActiveTab] = useState(types[0]);

    const currentData = chartDataMap[activeTab] || [];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-lg">
                    {`${payload[0].name}: ${payload[0].value}`}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            {/* Header & Tabs */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                    Exit by Type & Reason
                </h3>

                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60">
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

            {/* Chart Area */}
            <div className="flex-1 flex flex-col justify-between min-h-0">
                <div className="flex-1 min-h-[140px] relative flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={currentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={75}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {currentData.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 shrink-0 flex flex-wrap justify-center gap-x-3 gap-y-2.5 px-2">
                    {currentData.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap truncate max-w-[120px]" title={entry.name}>
                                {entry.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExitByTypeAndReason;
