import React from 'react';
import InfoTooltip from '../common/InfoTooltip';
import type { DateRangeOption } from '../../types';

interface BucketItem {
    label: string;
    percent: number;
    color: string;
    textColor: string;
    bgColor: string;
}

interface Props {
    dateRange?: DateRangeOption;
    data?: {
        avgDays: number;
        trend: number; // positive = slower, negative = faster
        buckets: BucketItem[];
    };
}

const defaultData = {
    avgDays: 3,
    trend: -1.2,
    buckets: [
        { label: 'On Time', percent: 62, color: '#10b981', textColor: 'text-emerald-600', bgColor: 'bg-emerald-500' },
        { label: '1-30 Days', percent: 21, color: '#60a5fa', textColor: 'text-blue-500', bgColor: 'bg-blue-400' },
        { label: '31-45 Days', percent: 10, color: '#f59e0b', textColor: 'text-amber-500', bgColor: 'bg-amber-400' },
        { label: '45+ Days', percent: 7, color: '#f43f5e', textColor: 'text-rose-500', bgColor: 'bg-rose-500' },
    ]
};

const AvgDaysToPay: React.FC<Props> = ({ data }) => {
    const d = data || defaultData;
    const isFaster = d.trend <= 0;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm flex flex-col h-full hover:shadow transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Avg. Days to Pay</h3>
                    <InfoTooltip content="Historical breakdown of invoice settlement speeds by client segment." />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${isFaster
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    : 'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                    {isFaster ? '▼' : '▲'} {Math.abs(d.trend)}d vs last period
                </div>
            </div>

            {/* Big Number */}
            <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-6xl font-black text-slate-800 tracking-tighter leading-none">{d.avgDays}</span>
                <span className="text-lg font-bold text-slate-400">days</span>
                <span className={`ml-2 text-xs font-black uppercase tracking-widest ${isFaster ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isFaster ? 'Faster' : 'Slower'}
                </span>
            </div>

            {/* Segmented Bar */}
            <div className="w-full flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-4">
                {d.buckets.map((bucket, i) => (
                    <div
                        key={i}
                        className={`${bucket.bgColor} rounded-sm transition-all duration-700 hover:opacity-80`}
                        style={{ width: `${bucket.percent}%` }}
                        title={`${bucket.label}: ${bucket.percent}%`}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-auto">
                {d.buckets.map((bucket, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${bucket.bgColor}`} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{bucket.label}</span>
                        </div>
                        <span className={`text-[11px] font-black ${bucket.textColor}`}>{bucket.percent}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvgDaysToPay;
