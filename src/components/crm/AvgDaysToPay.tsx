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
        trend: number;
        buckets: BucketItem[];
    };
}

const AvgDaysToPay: React.FC<Props> = ({ data }) => {
    const d = data || {
        avgDays: 3,
        buckets: [
            { label: 'ON TIME', percent: 66, bgColor: 'bg-emerald-500' },
            { label: '1-30', percent: 12, bgColor: 'bg-amber-500' },
            { label: '30-45', percent: 8, bgColor: 'bg-orange-500' },
            { label: '45+', percent: 14, bgColor: 'bg-rose-500' },
        ]
    };

    return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm flex flex-col h-full hover:shadow-md transition-all relative overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between mb-2 pr-8">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm shrink-0 border border-emerald-100/50">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1">
                        <h3 className="text-[10px] font-black text-slate-700 tracking-tight leading-none uppercase">Avg. Days to Pay</h3>
                        <InfoTooltip content="Average number of days taken for invoices to be paid during the selected period." />
                    </div>
                </div>
                <div className="text-xl font-black text-amber-500 tracking-tighter leading-none shrink-0 pt-0.5">
                    {d.avgDays}d
                </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full flex h-2 gap-0.5 rounded-full overflow-hidden mb-3 mt-1 shadow-inner bg-slate-50">
                {d.buckets.map((bucket, idx) => (
                    <div
                        key={idx}
                        className={`${bucket.bgColor} transition-all duration-1000 ease-out first:rounded-l-full last:rounded-r-full shadow-inner`}
                        style={{ width: `${bucket.percent}%` }}
                    />
                ))}
            </div>

            {/* Legend - Single Row as per image */}
            <div className="flex items-center justify-between px-0.5">
                {d.buckets.map((bucket, idx) => (
                    <div key={idx} className="flex items-center gap-1 focus:outline-none cursor-default group">
                        <div className={`w-1.5 h-1.5 rounded-full ${bucket.bgColor} shadow-sm group-hover:scale-125 transition-transform`} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-600 transition-colors leading-none">
                            {bucket.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvgDaysToPay;
