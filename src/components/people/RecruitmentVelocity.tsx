import React from 'react';
import type { DateRangeOption } from '../../types';
import { Users, TrendingUp } from 'lucide-react';
import InfoTooltip from '../common/InfoTooltip';

interface Props {
    dateRange: DateRangeOption;
}

const RecruitmentVelocity: React.FC<Props> = () => {

    // Widget C: Sourcing Efficacy Pie Data
    const sourcingData = [
        { label: "LinkedIn", value: 45, color: "text-blue-600", bg: "bg-blue-600", fill: "fill-blue-600" },
        { label: "Referrals", value: 30, color: "text-emerald-500", bg: "bg-emerald-500", fill: "fill-emerald-500" },
        { label: "Agencies", value: 15, color: "text-purple-500", bg: "bg-purple-500", fill: "fill-purple-500" },
        { label: "Direct", value: 10, color: "text-slate-400", bg: "bg-slate-400", fill: "fill-slate-400" },
    ];

    // Logic for Multi-slice Pie (SVG)
    let cumulativePercent = 0;
    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = sourcingData.map((item) => {
        const startPercent = cumulativePercent;
        const endPercent = cumulativePercent + (item.value / 100);
        cumulativePercent = endPercent;

        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);
        const largeArcFlag = item.value / 100 > 0.5 ? 1 : 0;

        return {
            ...item,
            path: `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`
        };
    });

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-white z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100/80 w-full shrink-0">
                        <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">Sourcing Channel Distribution</h3>
                        <InfoTooltip content="Shows the percentage of candidates sourced from different channels like LinkedIn, Referrals, and Agencies." />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
            </div>

            {/* Centered Chart Layout — Redundancy Removed */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/20 gap-10">
                <div className="flex flex-col items-center w-full justify-center gap-12">
                    <div className="relative w-52 h-52 shrink-0">
                        <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                            {slices.map((slice, idx) => (
                                <path key={idx} d={slice.path} className={`${slice.fill} hover:opacity-90 transition-opacity cursor-pointer stroke-white stroke-[0.03]`} />
                            ))}
                        </svg>
                        <div className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <Users className="w-10 h-10 text-slate-200" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        {sourcingData.map((source, idx) => (
                            <div key={idx} className="flex items-center group">
                                <div className={`w-3.5 h-3.5 rounded-md ${source.bg} mr-3 shadow-md ring-2 ring-white group-hover:scale-110 transition-transform`}></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{source.label}</span>
                                    <span className="text-sm font-black text-slate-900 tabular-nums leading-none">{source.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentVelocity;