import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    data?: {
        totalJobs: number;
        chartData: { name: string; value: number; color: string }[];
    };
}

const JobStatus: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all h-full p-6">
            <div className="flex flex-row items-center justify-center gap-10">
                {/* Left Child: Donut Chart */}
                <div className="relative shrink-0 w-40 h-40">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                        <PieChart>
                            <Pie
                                data={data.chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={75}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={4}
                            >
                                {data.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-800 leading-none">{data.totalJobs}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
                    </div>
                </div>

                {/* Right Child: Vertically Stacked Legend */}
                <div className="flex flex-col justify-center gap-3">
                    <div className="mb-1 flex items-center">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Status</h3>
                        <InfoTooltip content="Current status of all job openings, categorized by open and closed positions." />
                    </div>
                    {data.chartData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-start gap-4 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 min-w-[70px]">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{entry.name}</span>
                            </div>
                            <span className="text-sm font-black text-slate-800 tabular-nums">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobStatus;
