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
                <div className="flex h-6 w-full rounded-lg overflow-hidden shadow-sm border border-slate-100">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-1000 ease-out flex items-center justify-center text-white text-[8px] font-black"
                        style={{ width: `${sourceMix.new}%` }}
                    >
                        {sourceMix.new}%
                    </div>
                    <div
                        className="h-full bg-blue-400 transition-all duration-1000 ease-out flex items-center justify-center text-white text-[8px] font-black"
                        style={{ width: `${sourceMix.existing}%` }}
                    >
                        {sourceMix.existing}%
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-1 mb-0.5">
                            <div className="w-1.5 rounded-full bg-indigo-500 h-1.5" />
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate">New Client</span>
                        </div>
                        <span className="text-base font-black text-slate-800 ml-2.5 opacity-90">₹1.8Cr</span>
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <div className="flex items-center space-x-1 mb-0.5">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate">Existing Client</span>
                            <div className="w-1.5 rounded-full bg-blue-400 h-1.5" />
                        </div>
                        <span className="text-base font-black text-slate-800 mr-2.5 opacity-90">₹2.4Cr</span>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default RevenueSourceMix;
