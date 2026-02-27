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

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm flex flex-col h-full hover:shadow transition-shadow">
            {/* Header & Main Value aligned horizontally */}
            <div className="flex items-start justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-50 rounded-lg p-1.5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-black text-slate-700 tracking-tight">
                        Avg. Days to Pay
                    </h3>
                    <InfoTooltip content="Distribution of collected invoices by days taken to pay." />
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-2xl font-black text-amber-500 leading-none">
                        {d.avgDays}d
                    </div>
                </div>
            </div>

            {/* Segmented Bar */}
            <div className="w-full flex h-3.5 rounded-full overflow-hidden gap-1 mb-5">
                {d.buckets.map((bucket, i) => (
                    <div
                        key={i}
                        className={`${bucket.bgColor} rounded-sm transition-all duration-700 hover:opacity-80`}
                        style={{ width: `${bucket.percent}%` }}
                        title={`${bucket.label}: ${bucket.percent}%`}
                    />
                ))}
            </div>

            {/* Legend Grid */}
            <div className="flex justify-between items-center w-full mt-auto text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {d.buckets.map((bucket, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${bucket.bgColor}`} />
                        <span>{bucket.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvgDaysToPay;
