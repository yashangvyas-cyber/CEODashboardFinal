import React from 'react';
import type { DateRangeOption } from '../../types';

interface Props {
    dateRange?: DateRangeOption;
    data?: { label: string; value: number; color: string }[];
}

const LostDealAnalysis: React.FC<Props> = ({ data }) => {
    const chartData = data || [
        { label: "Competitor", value: 40, color: "fill-rose-500 bg-rose-500" },
        { label: "Delayed", value: 30, color: "fill-amber-400 bg-amber-400" },
        { label: "Budget", value: 20, color: "fill-slate-400 bg-slate-400" },
        { label: "Other", value: 10, color: "fill-slate-200 bg-slate-200" }
    ];

    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = chartData.map((item) => {
        const startPercent = cumulativePercent;
        const endPercent = cumulativePercent + (item.value / 100);
        cumulativePercent = endPercent;
        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);
        const largeArcFlag = item.value / 100 > 0.5 ? 1 : 0;
        const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
        return { ...item, pathData };
    });

    return (
        <div className="premium-card p-6 flex flex-col h-full group hover-scale relative overflow-hidden h-full">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Lost Deal Analysis</h3>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className="relative w-40 h-40 mb-6 drop-shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90">
                        {slices.map((slice, i) => (
                            <path
                                key={i}
                                d={slice.pathData}
                                className={`${slice.color.split(' ')[0]} transition-all duration-300 cursor-pointer stroke-white stroke-[0.02]`}
                            />
                        ))}
                    </svg>
                </div>

                <div className="w-full grid grid-cols-2 gap-3 mt-4">
                    {chartData.map((item, idx) => (
                        <div key={idx} className="flex items-center text-[10px] bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                            <div className={`w-2 h-2 rounded-full mr-2 ${item.color.split(' ')[1]}`}></div>
                            <span className="text-slate-500 font-bold flex-1 truncate uppercase tracking-wider">{item.label}</span>
                            <span className="font-black text-slate-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LostDealAnalysis;
