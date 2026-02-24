import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

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
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm flex flex-col hover:shadow transition-shadow">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                Early Attrition
                <InfoTooltip content="Percentage of employees who left the company within their first 90 days of employment." />
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

                    {/* Score Context */}
                    <div className="flex flex-col justify-center gap-2 pl-2">
                        <div className="text-sm font-black text-slate-800 leading-tight">High Risk</div>
                        <div className="flex flex-col gap-1">
                            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                                &lt;90 Days Exit Trend
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                Critical Attrition Zone
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default EarlyAttrition;
