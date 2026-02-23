import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange: DateRangeOption;
    data?: {
        score: number;
        trend: string;
        chartData: number[];
    };
}

const CollectionEfficiency: React.FC<Props> = ({ data }) => {
    const score = data?.score || 90.8;
    const trend = data?.trend || "+2.4% vs last month";
    const chartData = data?.chartData || [40, 55, 45, 60, 75, 65, 80, 70, 85, 90];

    return (
        <div className="premium-card p-6 flex flex-col justify-between h-full group hover-scale relative overflow-hidden h-full">
            <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <div className="w-48 h-48 bg-emerald-500 blur-3xl rounded-full"></div>
            </div>

            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10 w-full text-center">Collection Efficiency</h3>

            <div className="flex-1 flex flex-col justify-center items-center py-6 relative z-10">
                <div className="text-5xl font-black text-slate-900 tracking-tight text-gradient-emerald">{score}%</div>
                <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">(Collected / Invoiced)</div>
                <div className="flex items-center space-x-2 mt-4 text-emerald-700 bg-emerald-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200/50 shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{trend}</span>
                </div>
            </div>

            <div className="w-full h-16 flex items-end space-x-1 px-2 relative z-10">
                {chartData.map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-100 hover:bg-emerald-100 rounded-t-sm relative group/bar cursor-default transition-colors">
                        <div className="absolute bottom-0 w-full bg-emerald-400 rounded-t-sm transition-all duration-700 ease-out group-hover/bar:bg-emerald-500 shadow-sm shadow-emerald-500/20" style={{ height: `${h}%` }}></div>

                        <div className="opacity-0 group-hover/bar:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-[10px] font-bold bg-slate-800 text-white px-2 py-1 rounded pointer-events-none transition-opacity shadow-lg">
                            {h}%
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider relative z-10">6-Month Trend</p>
        </div>
    );
}

export default CollectionEfficiency;
