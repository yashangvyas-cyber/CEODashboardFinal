import React from 'react';
import { Info, Maximize2, MoreHorizontal } from 'lucide-react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        current: number;
        target: number;
        unit: string;
    };
}

const RevenueVsTarget: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const percentage = Math.round((data.current / data.target) * 100);
    const colorClass = percentage >= 90 ? 'text-emerald-600' : 'text-amber-500';
    const barColorClass = percentage >= 90 ? 'bg-emerald-500' : 'bg-amber-500';

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-full flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-start mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Revenue vs Target</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                    <button className="hover:text-slate-600 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-5">
                <div className="flex justify-between items-end">
                    <div>
                        <div className={`text-4xl font-black tracking-tighter leading-none ${colorClass}`}>
                            ₹{data.current}{data.unit}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                            YTD Revenue Achieved
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-slate-600 tracking-tight">
                            Target: ₹{data.target}{data.unit}
                        </div>
                        <div className={`text-xs font-black uppercase tracking-widest mt-1 ${colorClass}`}>
                            {percentage}% Achieved
                        </div>
                    </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner relative">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColorClass}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                    {percentage > 100 && (
                        <div className="absolute inset-0 flex items-center justify-end pr-2 pointer-events-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Forecast</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        +12.4% vs LY
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RevenueVsTarget;
