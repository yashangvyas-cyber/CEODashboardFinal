import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { DateRangeOption } from '../../types';
import InfoTooltip from '../common/InfoTooltip';

interface CustomerData {
    name: string;
    invoiced: string;
    collected: string;
    percent: number;
    status: 'GOOD' | 'PARTIAL' | 'COMPLETED' | 'LATE';
}

interface Props {
    dateRange?: DateRangeOption;
    data?: CustomerData[];
}

const TopRevenueContributors: React.FC<Props> = ({ data }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const customers: CustomerData[] = data || [
        { name: "Suraj Kumar", invoiced: "45,98,750.58", collected: "42,00,000", percent: 92, status: 'GOOD' },
        { name: "Safari Software1", invoiced: "900", collected: "500", percent: 55, status: 'PARTIAL' },
        { name: "Alex Parker", invoiced: "275", collected: "150", percent: 54, status: 'PARTIAL' },
        { name: "Altra tech", invoiced: "8", collected: "4", percent: 50, status: 'PARTIAL' },
    ];

    const handleMouseEnter = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCoords({
            top: rect.top,
            left: rect.left + rect.width / 2
        });
        setHoveredIndex(idx);
    };

    return (
        <div className="bg-white border border-slate-200 p-4 flex flex-col h-full group transition-all hover:shadow-md relative overflow-hidden rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100/80 w-full shrink-0">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Top 5 Revenue Contributors</h3>
                        <InfoTooltip content="Highest value accounts by Invoiced Amount." />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">Highest value accounts by Invoiced Amount</span>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Invoiced</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Collected</span>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-5 overflow-auto custom-scrollbar pt-1 pr-1">
                {customers.map((customer, idx) => (
                    <div
                        key={idx}
                        className="relative group/item z-0"
                    >
                        {/* Name and Rank Row */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center text-[10px] font-black">
                                    {idx + 1}
                                </div>
                                <span className="text-[11px] font-black text-slate-700 tracking-tight">{customer.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">INVOICED:</span>
                                <span className="text-[10px] font-black text-slate-600 tabular-nums">{customer.invoiced}</span>
                                <span className="text-[8px] font-bold text-slate-300">...</span>
                            </div>
                        </div>

                        {/* Progress Bar - Triggers Tooltip */}
                        <div
                            className="relative w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 shadow-inner group-hover/item:border-slate-200 transition-colors cursor-pointer"
                            onMouseEnter={(e) => handleMouseEnter(idx, e)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="absolute inset-0 bg-slate-100/60" /> {/* Invoiced Layer */}
                            <div
                                className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                style={{ width: `${customer.percent}%` }}
                            /> {/* Collected Layer */}
                        </div>

                        {/* Tooltip Portal */}
                        {hoveredIndex === idx && createPortal(
                            <div
                                style={{
                                    position: 'fixed',
                                    top: `${coords.top - 8}px`,
                                    left: `${coords.left}px`,
                                    transform: 'translate(-50%, -100%)',
                                    zIndex: 99999
                                }}
                                className="bg-[#1e293b] text-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-6 border border-slate-700/50 backdrop-blur-sm pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-200"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Invoiced</span>
                                    <span className="text-[11px] font-black tracking-tight">{customer.invoiced}</span>
                                </div>
                                <div className="w-px h-6 bg-slate-700/50" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest leading-none mb-1">Collected</span>
                                    <span className="text-[11px] font-black tracking-tight text-emerald-400">{customer.collected}</span>
                                </div>
                                {/* Pointer */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-[#1e293b]" />
                            </div>,
                            document.body
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRevenueContributors;
