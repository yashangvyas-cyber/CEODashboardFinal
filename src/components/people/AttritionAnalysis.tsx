import React from 'react';
import type { DateRangeOption } from '../../types';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
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

    const renderCustomLegend = (props: any) => {
        const { payload } = props;
        // Re-order to match screenshot exactly: Non-Regrettable (green), Regrettable (red), Unspecified (gray)
        const orderedPayload = [
            payload.find((p: any) => p.value === 'nonRegrettable'),
            payload.find((p: any) => p.value === 'regrettable'),
            payload.find((p: any) => p.value === 'unspecified')
        ].filter(Boolean);

        return (
            <div className="flex justify-end gap-5 text-[11px] text-slate-500 font-semibold mb-2 pr-4">
                {orderedPayload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[entry.value] }}></span>
                        <span className="capitalize">{entry.value === 'regrettable' ? 'Regrettable' : entry.value === 'nonRegrettable' ? 'Non-Regrettable' : 'Unspecified'}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col border border-slate-200 rounded-[10px] p-4 bg-white shadow-sm hover:shadow transition-shadow w-full">
            <div className="flex justify-between items-start mb-4 shrink-0 w-full z-10 relative">
                <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center">
                    Exit Trend
                    <InfoTooltip content="Monthly trend of employee exits, categorized by regrettable and non-regrettable attrition." />
                </h3>
                <div className="absolute right-0 top-0 w-full">
                    <Legend
                        content={renderCustomLegend}
                        wrapperStyle={{ position: 'relative', top: 0, right: 0, width: '100%' }}
                    />
                </div>
            </div>

            <div className="h-[260px] relative z-0 mt-4 min-w-0">
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
