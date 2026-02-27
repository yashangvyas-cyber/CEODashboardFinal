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
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between hover:shadow-md transition-all w-full h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 rounded-bl-full -z-10 blur-xl"></div>

            <div className="flex items-start justify-between mb-2 shrink-0 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase leading-none mb-1">Avg. Days to Pay</span>
                    <div className="flex items-center gap-1.5">
                        <div className="bg-emerald-50 rounded-md p-1 flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <InfoTooltip content="Distribution of collected invoices by days taken to pay." />
                    </div>
                </div>

                <div className="text-xl font-black text-amber-500 leading-none tracking-tighter">
                    {d.avgDays}d
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-3 relative z-10">
                <div className="w-full flex h-2 rounded-full overflow-hidden gap-0.5 shadow-inner bg-slate-100/50">
                    {d.buckets.map((bucket, i) => (
                        <div
                            key={i}
                            className={`${bucket.bgColor} transition-all duration-700 hover:opacity-80`}
                            style={{ width: `${bucket.percent}%` }}
                            title={`${bucket.label}: ${bucket.percent}%`}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 w-full text-[9px] font-black text-slate-500 uppercase tracking-wider">
                    {d.buckets.map((bucket, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-slate-50/50 p-1 rounded-md border border-slate-100/50">
                            <div className={`w-1.5 h-1.5 rounded-full ${bucket.bgColor} shadow-sm shadow-slate-400/20 flex-shrink-0`} />
                            <span className="truncate">{bucket.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvgDaysToPay;
