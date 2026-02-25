import React from 'react';
import { Maximize2, MoreHorizontal, TrendingUp } from 'lucide-react';
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

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 p-4 shadow-sm h-full flex flex-col h-full hover:shadow transition-shadow overflow-hidden">
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-slate-100/80 w-full shrink-0">
                <div className="flex items-center">
                    <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Sales Performance</h3>
                    <InfoTooltip content="Key performance indicators for sales, including Average Deal Size (typical value of a won deal) and Sales Cycle (average days to close a deal)." />
                </div>
                <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                    <button className="hover:text-slate-600 transition-colors">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="hover:text-slate-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4">
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
                </div>
            </div>
        </div>
    );
};

export default SalesMetrics;
