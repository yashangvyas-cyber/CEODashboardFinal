import React from 'react';
import { Maximize2, MoreHorizontal, TrendingUp, Clock } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        avgDealSize: { value: number; unit: string; trend: number };
        salesCycle: { days: number; target: number };
    };
}

const SalesMetrics: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const { avgDealSize, salesCycle } = data;
    const isSlowCycle = salesCycle.days > salesCycle.target;

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-sm h-fit flex flex-col hover:shadow transition-shadow">
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div className="flex items-center">
                    <h3 className="text-sm font-bold text-slate-800 tracking-tight">Sales Performance</h3>
                    <InfoTooltip content="Key performance indicators for sales, including Average Deal Size (typical value of a won deal) and Sales Cycle (average days to close a deal)." />
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

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                {/* Metric 1: Avg Deal Size */}
                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Deal Size</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{avgDealSize.value}</span>
                            <span className="text-xs font-bold text-slate-400">{avgDealSize.unit}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="text-xs font-black text-emerald-600">+{avgDealSize.trend}%</span>
                    </div>
                </div>

                {/* Metric 2: Sales Cycle */}
                <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sales Cycle</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{salesCycle.days}</span>
                            <span className="text-xs font-bold text-slate-400">Days</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isSlowCycle ? 'bg-rose-50 border-rose-100' : 'bg-blue-50 border-blue-100'}`}>
                        <Clock size={14} className={isSlowCycle ? 'text-rose-500' : 'text-blue-500'} />
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isSlowCycle ? 'text-rose-600' : 'text-blue-600'}`}>
                            {isSlowCycle ? `+${salesCycle.days - salesCycle.target}d Lag` : 'On Target'}
                        </span>
                    </div>
                </div>

                {/* Metric 3: Pipeline Velocity (Moved here to cluster) */}
                <div className="w-full flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span>Pipeline Velocity</span>
                    <span className="text-emerald-500 font-black">Accelerating</span>
                </div>
            </div>
        </div>
    );
};

export default SalesMetrics;
