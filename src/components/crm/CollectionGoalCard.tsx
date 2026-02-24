import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

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

    const radius = 52;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-white border border-slate-200 p-4 flex flex-col h-full items-center justify-between group transition-all hover:shadow-md relative overflow-hidden rounded-lg">
            <div className="flex items-center w-full mb-1 relative z-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Collection Goal</h3>
                <InfoTooltip content="Tracks the progress towards the collection target for the current period, showing how much of the target has been achieved in percentage." />
            </div>

            <div className="relative flex items-center justify-center my-2 z-10 group/gauge flex-1">
                {/* Background Circle */}
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-slate-100"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-indigo-500 transition-all duration-1000 ease-out"
                        style={{ filter: 'drop-shadow(0px 2px 4px rgba(79, 70, 229, 0.1))' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{percentage.toFixed(1)}%</span>
                    <span className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Achieved</span>
                </div>
            </div>

            <div className="w-full space-y-1 bg-slate-50/80 p-3 rounded-lg border border-slate-100 relative z-10 shadow-sm mt-3">
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-black uppercase tracking-tighter">Target</span>
                    <span className="font-black text-slate-800 tracking-tighter">{target}</span>
                </div>
                <div className="w-full h-px bg-slate-200"></div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-black uppercase tracking-tighter">Collected</span>
                    <span className="font-black text-indigo-600 tracking-tighter">{collected}</span>
                </div>
            </div>
        </div>
    );
};

export default CollectionGoalCard;
