import React from 'react';
import { Target } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    data?: {
        percentage: number;
        target: string;
        collected: string;
        surplus: string;
        currencyCode: string;
    };
}

const CollectionGoalCard: React.FC<Props> = ({ data }) => {
    const percentage = data?.percentage || 86.3;
    const collected = data?.collected || "₹3.45Cr";
    const surplus = data?.surplus || "₹0.45Cr";
    const currencyCode = data?.currencyCode || 'INR';


    // SVG Gauge calculations for a 180-degree semi-circle
    const radius = 55;
    const strokeWidth = 14;
    const circumference = Math.PI * radius; // Half-circle circumference
    const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    return (
        <div className="premium-card p-4 flex flex-col h-full bg-white group hover-scale relative overflow-hidden rounded-xl border border-slate-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-700 tracking-tight">Collections Goal</span>
                    <InfoTooltip content="Tracks progress towards the collection target." />
                    <div className="p-1 rounded bg-rose-50 text-rose-500 border border-rose-100 shadow-sm">
                        <Target size={12} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Gauge Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative mt-2 mb-2">
                <svg width="150" height="85" viewBox="0 0 150 85" className="mt-2">
                    {/* Background Semi-circle */}
                    <path
                        d="M 20 75 A 55 55 0 0 1 130 75"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Progress Semi-circle */}
                    <path
                        d="M 20 75 A 55 55 0 0 1 130 75"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>

                <div className="absolute top-[35px] flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">
                        {percentage > 100 ? '1000%+' : `${percentage.toFixed(1)}%`}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Collection</span>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="w-full py-1.5 px-3 mb-2 flex items-center justify-between bg-emerald-50/30 rounded-lg border border-emerald-100/50 text-[9px] font-bold">
                <div className="flex items-center gap-1">
                    <span className="text-slate-500 uppercase tracking-tight">Achieved:</span>
                    <span className="text-indigo-600">{collected}</span>
                </div>
                <div className="w-px h-3 bg-emerald-200/50"></div>
                <div className="flex items-center gap-1">
                    <span className="text-slate-500 uppercase tracking-tight">Surplus:</span>
                    <span className="text-emerald-600">{surplus}</span>
                </div>
            </div>

            {/* Footer Currency */}
            <div className="flex items-center justify-center gap-1 mt-auto pt-1">
                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                    <Target size={10} strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black text-slate-800 tracking-tight">123 ({currencyCode})</span>
            </div>
        </div>
    );
};

export default CollectionGoalCard;
