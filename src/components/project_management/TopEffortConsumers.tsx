import React from 'react';
import type { DateRangeOption } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Target } from 'lucide-react';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
}

const TopEffortConsumers: React.FC<Props> = ({ data = [] }) => {
    // Take top 5 for the chart
    const chartData = [...data].sort((a, b) => b.hours - a.hours).slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-full flex flex-col hover:border-indigo-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center">
                        <Target className="w-4 h-4 mr-2 text-indigo-500" />
                        Top Effort Consumers
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Projects taking up the most team time</p>
                </div>
            </div>

            <div className="w-full h-[240px] min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: -20, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                            width={110}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={24}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.type === 'Fixed Cost' ? '#f43f5e' : entry.type === 'Hourly' ? '#f59e0b' : '#3b82f6'} />
                            ))}
                            <LabelList dataKey="hours" position="right" formatter={(val: any) => `${val}h`} style={{ fontSize: '11px', fontWeight: 'bold', fill: '#475569' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></div><span className="text-[10px] font-medium text-slate-500">Fixed Cost</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div><span className="text-[10px] font-medium text-slate-500">Hourly</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div><span className="text-[10px] font-medium text-slate-500">Hirebase</span></div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic leading-tight">
                <strong>Logic:</strong> Shows where your team is working the most hours. Be careful if <span className="font-bold text-rose-500">Fixed Cost (Red)</span> projects are at the top—spending too much time on them kills your profit margin.
            </div>
        </div>
    );
};

export default TopEffortConsumers;
