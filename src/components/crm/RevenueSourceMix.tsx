import React from 'react';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange?: DateRangeOption;
    data?: { new: number; existing: number };
}

const RevenueSourceMix: React.FC<Props> = ({ data }) => {
    const sourceMix = data || { new: 45, existing: 55 };

    return (
        <div className="premium-card p-6 flex flex-col h-full group hover-scale relative overflow-hidden h-full">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100/80 w-full shrink-0">
                <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Revenue Source Mix</h3>
                <InfoTooltip content="Breakdown of revenue between new customer acquisitions and expansion or retention of existing clients." />
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10">
                <div className="flex h-12 w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-1000 ease-out flex items-center justify-center text-white text-[10px] font-black"
                        style={{ width: `${sourceMix.new}%` }}
                    >
                        {sourceMix.new}%
                    </div>
                    <div
                        className="h-full bg-blue-400 transition-all duration-1000 ease-out flex items-center justify-center text-white text-[10px] font-black"
                        style={{ width: `${sourceMix.existing}%` }}
                    >
                        {sourceMix.existing}%
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/20" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Client Revenue</span>
                        </div>
                        <span className="text-xl font-black text-slate-900 ml-4.5">₹1.8Cr</span>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Existing Client Revenue</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/20" />
                        </div>
                        <span className="text-xl font-black text-slate-900 mr-4.5">₹2.4Cr</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 flex justify-center">
                <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 italic text-[9px] text-slate-400 font-medium">
                    Based on YTD Invoiced Revenue
                </div>
            </div>
        </div>
    );
}

export default RevenueSourceMix;
