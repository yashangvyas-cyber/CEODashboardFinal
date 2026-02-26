import React from 'react';
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

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl">
                    {`${payload[0].name}: ${payload[0].value}`}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-4 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0 mb-4 pb-3 border-b border-slate-100/80 w-full">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Exit by Type &amp; Reason
                    <InfoTooltip content="Distribution of employee exits based on the reason (e.g., Better Opportunity) and the type of exit (e.g., Resignation)." /></h3>
            </div>

            {/* Body: Two Side-by-Side Charts */}
            <div className="flex-1 flex w-full h-full min-h-0 gap-4">
                {types.map((type: string) => {
                    const currentData = chartDataMap[type] || [];

                    return (
                        <div key={type} className="flex-1 flex flex-col items-center justify-start w-1/2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{type}</h4>

                            {/* Donut Chart */}
                            <div className="relative shrink-0 flex items-center justify-center w-full" style={{ height: 160 }}>
                                <PieChart width={160} height={160}>
                                    <Pie
                                        data={currentData}
                                        cx={80}
                                        cy={80}
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
                            </div>

                            {/* Legend below the chart */}
                            <div className="w-full mt-4 flex flex-wrap justify-center gap-x-3 gap-y-2 px-1">
                                {currentData.map((entry: any, index: number) => {
                                    return (
                                        <div key={index} className="flex items-center gap-1.5 shrink-0">
                                            <span
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]" title={entry.name}>
                                                {entry.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExitByTypeAndReason;
