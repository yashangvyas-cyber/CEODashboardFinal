import React from 'react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange?: DateRangeOption;
    data?: any;
}

const EarlyAttrition: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { earlyAttrition } = data;
    // Calculate percentage based on early attritions relative to new joins
    const percentage = Math.round((earlyAttrition.exitsUnder90Days / earlyAttrition.newJoins) * 100) || 0;


    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm flex flex-col hover:shadow transition-shadow w-full mx-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Early Attrition
            </h3>

            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between w-full px-6 mb-8">
                    {/* Visual Circle - Increased Scale to fill width */}
                    <div className="relative w-36 h-36 shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background Track */}
                            <circle
                                cx="72"
                                cy="72"
                                r="58"
                                fill="transparent"
                                stroke="#f8fafc" // slate-50
                                strokeWidth="12"
                            />
                            {/* Value Track */}
                            <circle
                                cx="72"
                                cy="72"
                                r="58"
                                fill="transparent"
                                stroke="#f59e0b" // amber-500
                                strokeWidth="12"
                                strokeDasharray={2 * Math.PI * 58}
                                strokeDashoffset={(2 * Math.PI * 58) - (percentage / 100) * (2 * Math.PI * 58)}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white shadow-md border border-slate-50 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-slate-800 leading-none">{percentage}%</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Exit Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Score Context - Spread out to the right */}
                    <div className="flex flex-col text-right pr-2">
                        <div className="text-[52px] font-black text-slate-800 leading-none tracking-tighter mb-2">
                            High Risk
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <div className="text-[12px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 w-fit">
                                &lt;90 DAYS EXIT TREND
                            </div>
                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                                Critical Attrition Zone
                            </div>
                        </div>
                    </div>
                </div>

                {/* Context Pill - Full Width Integration with descriptive labels */}
                <div className="bg-slate-50/80 rounded-[12px] px-4 py-3 border border-slate-100/50 w-full flex justify-between items-center shadow-inner mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">Benchmark: 8%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic font-bold">
                        Calculated vs Total New Hires (Last 12m)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EarlyAttrition;
