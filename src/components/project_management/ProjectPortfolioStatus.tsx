import React from 'react';
import type { DateRangeOption } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
    data?: any[];
    statuses?: string[];
}

const ProjectPortfolioStatus: React.FC<Props> = ({ data, statuses = [] }) => {

    if (!data || data.length === 0 || statuses.length === 0) return null;

    // Expanded generic SaaS color palette for dynamic statuses
    const palette = [
        '#64748b', // slate
        '#f59e0b', // amber
        '#3b82f6', // blue
        '#10b981', // emerald
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#0ea5e9', // sky
        '#14b8a6', // teal
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">

            {/* Header */}
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center">
                        Projects by Type & Status
                        <InfoTooltip content="Historical view of the project portfolio during the selected period. Shows the distribution of Fixed-Price, Dedicated (Hirebase), and Hourly projects across their various delivery statuses." />
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Active portfolio volume for the selected date range</p>
                </div>
                {/* Optional summary tally if needed later */}
            </div>

            {/* Stacked Bar Chart */}
            <div className="flex-1 w-full min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 40, bottom: 20 }}
                        barSize={24}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="type"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                            width={120}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: any, name: string | undefined) => [
                                <span className="font-bold text-slate-800">{value} Projects</span>,
                                <span className="text-slate-500 uppercase text-[10px] font-bold">{name}</span>
                            ]}
                            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="square"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '10px', fontWeight: 700, paddingTop: '20px' }}
                        />
                        {statuses.map((status, index) => {
                            const isFirst = index === 0;
                            const isLast = index === statuses.length - 1;

                            // Safe radius calculation based on position
                            let radius: [number, number, number, number] = [0, 0, 0, 0];
                            if (isFirst && isLast) radius = [4, 4, 4, 4];
                            else if (isFirst) radius = [0, 0, 0, 0]; // Keep left flat since there's no left border
                            else if (isLast) radius = [0, 4, 4, 0];

                            const color = palette[index % palette.length];

                            return (
                                <Bar
                                    key={status}
                                    dataKey={status}
                                    stackId="a"
                                    fill={color}
                                    radius={radius}
                                />
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Custom static X-axis labels to match the screenshot baseline */}
            <div className="relative h-6 mt-2 ml-[160px] mr-[30px] border-t border-slate-200">
                <span className="absolute left-0 -translate-x-1/2 top-2 text-[10px] font-bold text-slate-400">0</span>
                <span className="absolute left-1/4 -translate-x-1/2 top-2 text-[10px] font-bold text-slate-400">7</span>
                <span className="absolute left-2/4 -translate-x-1/2 top-2 text-[10px] font-bold text-slate-400">14</span>
                <span className="absolute right-0 translate-x-1/2 top-2 text-[10px] font-bold text-slate-400">25+</span>
            </div>
        </div>
    );
};

export default ProjectPortfolioStatus;
