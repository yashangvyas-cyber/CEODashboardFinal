import React from 'react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        percentage: number;
        target: string;
        collected: string;
    };
}

const CollectionGoalCard: React.FC<Props> = ({ data }) => {
    const percentage = data?.percentage || 86.3;
    const target = data?.target || "₹4.0Cr";
    const collected = data?.collected || "₹3.45Cr";

    const radius = 64;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="premium-card p-6 flex flex-col h-full items-center justify-between group hover-scale relative overflow-hidden h-full">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <div className="w-32 h-32 bg-indigo-500 blur-3xl rounded-full"></div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest w-full text-left mb-2 relative z-10">Collection Goal</h3>

            <div className="relative flex items-center justify-center my-4 z-10 group/gauge flex-1">
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-indigo-500 transition-all duration-1000 ease-out group-hover/gauge:stroke-indigo-400"
                        style={{ filter: 'drop-shadow(0px 4px 6px rgba(79, 70, 229, 0.2))' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tight text-gradient-indigo">{percentage.toFixed(1)}%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Achieved</span>
                </div>
            </div>

            <div className="w-full space-y-2 bg-slate-50/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100/50 relative z-10 shadow-sm mt-4">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Target</span>
                    <span className="font-black text-slate-900 tracking-tight">{target}</span>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Collected</span>
                    <span className="font-black text-indigo-600 tracking-tight shadow-sm">{collected}</span>
                </div>
            </div>
        </div>
    );
}

export default CollectionGoalCard;
