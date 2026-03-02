import React from 'react';
import type { DateRangeOption } from '../../types';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange?: DateRangeOption;
    data?: any;
}

const COLORS: Record<string, string> = {
    'nonRegrettable': '#22c55e',  // green-500
    'regrettable': '#ef4444',     // red-500
    'unspecified': '#cbd5e1'      // slate-300
};

const AttritionAnalysis: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { chartData } = data;


    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-4 shadow-sm h-full flex flex-col hover:shadow transition-shadow w-full">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100/80 w-full shrink-0 relative z-10">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Exit Trend
                    <InfoTooltip content="Monthly trend of employee exits, categorized by regrettable and non-regrettable attrition." /></h3>

                {/* Manual Legend at top right */}
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span>Regrettable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        <span>Non-Regrettable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                        <span>Unspecified</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative z-0 mt-2 min-h-0 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 0, right: 0, left: -25, bottom: 15 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            dy={10}
                            label={{ value: 'Months', position: 'bottom', fill: '#475569', fontSize: 11, offset: 0, fontWeight: 600 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            dx={-5}
                            allowDecimals={false}
                            label={{ value: 'Employee Count', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 11, offset: 15, fontWeight: 600 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                        />
                        <Bar dataKey="nonRegrettable" stackId="a" fill={COLORS.nonRegrettable} />
                        <Bar dataKey="regrettable" stackId="a" fill={COLORS.regrettable} />
                        <Bar dataKey="unspecified" stackId="a" fill={COLORS.unspecified} radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AttritionAnalysis;
