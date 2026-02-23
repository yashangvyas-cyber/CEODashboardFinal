import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

interface Props {
    data?: {
        totalJobs: number;
        chartData: { name: string; value: number; color: string }[];
    };
}

const JobStatus: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Open Vs. Closed Jobs</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
            </div>

            <div className="flex-1 min-h-0 relative flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
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
                    <span className="text-3xl font-black text-slate-800 leading-none">{data.totalJobs}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Jobs</span>
                </div>
            </div>

            <div className="mt-4 shrink-0 flex justify-center gap-6">
                {data.chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[11px] font-bold text-slate-600">{entry.name}</span>
                        <span className="text-[11px] font-black text-slate-800">{entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobStatus;
